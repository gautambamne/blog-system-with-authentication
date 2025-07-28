import jwt from 'jsonwebtoken';
import type { IUser } from '../models/user.model';



export const generateAccessToken = (user: Partial<IUser>): string => {
    const secret = process.env.ACCESS_TOKEN_SECRET || 'default_secret';
    const expiresIn = '10m'; // token expires in 10 minutes

    return jwt.sign(
        { user },
        secret,
        { expiresIn }
    );
};

 export const generateRefreshToken = (user: Partial<IUser>): string => {
    const secret = process.env.REFRESH_TOKEN_SECRET!;
    const expiresIn = '30d';         // token expires in 30 days
    return jwt.sign(
        { user },
        secret,
        { expiresIn }
    );
};  


type JwtPayloadWithUser = {
    user: Partial<IUser>;
    iat?: number;
    exp?: number;
};

export const verifyAccessToken = (token: string): Partial<IUser> | null => {
    try {
        const secret = process.env.ACCESS_TOKEN_SECRET!;
        const decoded = jwt.verify(token, secret) as JwtPayloadWithUser;
              console.log('Decoded user:', decoded.user);
        return decoded.user || null;
    } catch (error) {
        console.error('Invalid access token:', error);
        return null;
    }
};      


export const verifyRefreshToken = (token: string): Partial<IUser> | null => {
    try {
        const secret = process.env.REFRESH_TOKEN_SECRET!;
        const decoded = jwt.verify(token, secret) as JwtPayloadWithUser;
        return decoded.user || null;
    } catch (error) {
        console.error('Invalid refresh token:', error);
        return null;
    }
}