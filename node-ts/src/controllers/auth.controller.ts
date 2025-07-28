import type { Request, Response } from 'express';
import { UserRepository } from '../repositories/user.repositories';
import { SessionRepository } from '../repositories/sessio.repositories';
import { ComparePassword, HashPassowrd } from '../utils/bcrypt.utills';
import type { IUser } from '../models/user.model';
import { generateOtp, generateTimestamp } from '../utils/utils';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.utils';
import { sendVerificationEmail, sendWelcomeEmail } from '../utils/email.utils';
import asyncHandler from '../utils/async-handler';
import ApiError from '../advices/ApiError';
import ApiResponse from '../advices/ApiResponse';




export const RegisterUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, username, email, password } = req.body;

  if (!name || !username || !email || !password) {
    throw new ApiError(400, 'All fields are required' );
  }

  const existingUserByEmail = await UserRepository.findUserByEmail(email);

  if (existingUserByEmail?.is_verified === true) {
    throw new ApiError(400, 'User already exists with this email');
  }

  const existingUserByUsername = await UserRepository.findUserByUsername(username, true);

  if (existingUserByUsername) {
    throw new ApiError(400, 'This username is already taken');
  }

  const hashedPassword = await HashPassowrd(password);
  const verification_code = generateOtp();
  const verification_code_expiry = generateTimestamp("15")
  let userToBeReturned: IUser | null = null;
  let isExistingUser = false;
  

  if (existingUserByEmail) {

    userToBeReturned = await UserRepository.updateUserById(
      String(existingUserByEmail._id),
      {
        name,
        password: hashedPassword,
        username,
        verification_code,
        verification_code_expiry,
        is_verified: false
      },
      {
        _id: 1,
        name: 1,
        email: 1,
        username: 1,
        is_verified: 1,
        createdAt: 1,
        updatedAt: 1,
      }
    );

    if (!userToBeReturned) {
      throw new ApiError(500, 'Failed to update user');
    }

    isExistingUser = true;

  } else {
    const createdUser = await UserRepository.createUser({
      name,
      email,
      username,
      password:hashedPassword,
      verification_code_expiry,
      verification_code,
      is_verified: false,
    }, {
      _id: 1,
      name: 1,
      email: 1,
      username: 1,
      is_verified: 1,
      createdAt: 1,
      updatedAt: 1,
    });

    if (!createdUser) {
      throw new ApiError(500, 'Failed to create user');
    }

    userToBeReturned = createdUser;
  }

  // Send verification email
  const emailSent = await sendVerificationEmail(
    userToBeReturned.email,
    userToBeReturned.name,
    verification_code
  );

  if (!emailSent) {
    console.warn('Failed to send verification email, but user was created/updated');
  }

  res.status(isExistingUser ? 200 : 201).json(
    new ApiResponse({
      user: userToBeReturned,
      message: 'User registered successfully. Please check your email for verification code.'
    })
  );
});



export const LoginUser = asyncHandler(async (req: Request, res: Response) => {
  const {identifier , password} = req.body;
  if (!identifier || !password) {
    throw new ApiError(400, 'Identifier and password are required');
  }
  const isEmail = identifier.includes('@');

  console.log("idnetifier", identifier);

  let findUser;
  if (isEmail) {
    findUser = await UserRepository.findUserByEmail(identifier);
  } else {
    findUser = await UserRepository.findUserByUsername(identifier);
  }
  if (!findUser) {
    throw new ApiError(404, 'User not found');
  }
  if (!findUser.is_verified) {
    throw new ApiError(403, 'User is not verified');
  }
  const isPasswordValid = await ComparePassword(password, findUser.password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid password');
  }
  const userToBeReturned = await UserRepository.findUserById(
    String(findUser._id),
    {
      _id: 1,
      name: 1,
      username: 1,
      is_verified: 1,
      createdAt: 1,
      updatedAt: 1,
    }
  );


  if (!userToBeReturned) {
    throw new ApiError(404, 'User not found');
  }

  const access_token = generateAccessToken(userToBeReturned);
  const refresh_token = generateRefreshToken(userToBeReturned);

  // Create session expiry date (30 days from now)
  const sessionExpiresAt = new Date();
  sessionExpiresAt.setDate(sessionExpiresAt.getDate() + 30);

  // Check if user already has a session and delete it
  await SessionRepository.deleteSessionByUserId(String(userToBeReturned._id));

  // Create new session in database
  const session = await SessionRepository.createSession({
    user_id: String(userToBeReturned._id),
    refresh_token,
    expires_at: sessionExpiresAt
  });

  if (!session) {
    throw new ApiError(500, 'Failed to create session');
  }

  res.cookie('refresh_token', refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'lax', 
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });
  res.cookie('access_token', access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'lax',
    maxAge: 10 * 60 * 1000 // 10 minutes
  });

  res.status(200).json(
    new ApiResponse({
      access_token,
      user: userToBeReturned,
    })
  );
});



export const RefreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const refresh_token = req.cookies.refresh_token;

  if (!refresh_token) {
    throw new ApiError(401, 'Refresh token not provided');
  }

  const session = await SessionRepository.findSessionByToken(refresh_token);

  if (!session) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  const userObj = await UserRepository.findUserById(
    String(session.user_id),
    {
      _id: 1,
      name: 1,
      email: 1,
      username: 1,
      is_verified: 1,
      createdAt: 1,
      updatedAt: 1,
    }
  );

  if (!userObj) {
    throw new ApiError(404, 'User not found');
  }

  const access_token = generateAccessToken(userObj);

  res.cookie('access_token', access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'lax',
    maxAge: 10 * 60 * 1000 // 10 minutes
  });

  res.status(200).json(
    new ApiResponse({
      access_token,
      user: userObj,
    })
  );
});

export const LogoutUser = asyncHandler(async (req: Request, res: Response) => {
  const refresh_token = req.cookies.refresh_token;
  const session = await SessionRepository.findSessionByToken(refresh_token);

  if (refresh_token && session) {
     await SessionRepository.deleteSessionById(String(session._id));
  }

  
  res.clearCookie('refresh_token');
  res.clearCookie('access_token');

  res.status(200).json(new ApiResponse({
    message : "Loged out successfully"
  }));
});

export const VerifyEmail = asyncHandler(async (req: Request, res: Response) => {
  
  const { email, verification_code } = req.body;
    console.log("Email:", email, "Verification Code:", verification_code);
  if (!email || !verification_code) {
    throw new ApiError(400, 'Email and verification code are required');
  }

  const user = await UserRepository.findUserByEmail(email);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.is_verified) {
    throw new ApiError(400, 'User is already verified');
  }

  if (!user.verification_code || !user.verification_code_expiry) {
    throw new ApiError(400, 'No verification code found. Please register again.');
  }

  if (user.verification_code !== verification_code) {
    throw new ApiError(400, 'Invalid verification code');
  }

  if (new Date() > user.verification_code_expiry) {
    throw new ApiError(400, 'Verification code has expired. Please register again.');
  }

  // Verify the user and clear verification code
  const verifiedUser = await UserRepository.updateUserById(
    String(user._id),
    {
      is_verified: true,
      verification_code: undefined,
      verification_code_expiry: undefined
    },
    {
      _id: 1,
      name: 1,
      email: 1,
      username: 1,
      is_verified: 1,
      createdAt: 1,
      updatedAt: 1,
    }
  );

  if (!verifiedUser) {
    throw new ApiError(500, 'Failed to verify user');
  }

  // Send welcome email
  await sendWelcomeEmail(verifiedUser.email, verifiedUser.name);

  res.status(200).json(
    new ApiResponse({
      user: verifiedUser,
      message: 'Email verified successfully! Welcome to our platform.'
    })
  );
});

export const ResendVerificationCode = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, 'Email is required');
  }

  const user = await UserRepository.findUserByEmail(email);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.is_verified) {
    throw new ApiError(400, 'User is already verified');
  }

  // Generate new verification code
  const verification_code = generateOtp();
  const verification_code_expiry = generateTimestamp("15");

  // Update user with new verification code
  const updatedUser = await UserRepository.updateUserById(
    String(user._id),
    {
      verification_code,
      verification_code_expiry
    }
  );

  if (!updatedUser) {
    throw new ApiError(500, 'Failed to generate new verification code');
  }

  // Send new verification email
  const emailSent = await sendVerificationEmail(
    user.email,
    user.name,
    verification_code
  );

  if (!emailSent) {
    throw new ApiError(500, 'Failed to send verification email');
  }

  res.status(200).json(
    new ApiResponse({
      message: 'New verification code sent to your email'
    })
  );
});