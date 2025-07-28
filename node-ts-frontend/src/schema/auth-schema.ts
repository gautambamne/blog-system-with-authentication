import * as z from 'zod';


export const RegisterUserSchema = z
  .object({
    name: z
      .string({ message: "Name is required" })
      .min(3, { message: "Name must be at least 3 characters long" })
      .max(50, { message: "Name must not exceed 50 characters" }),

    username: z
      .string({ message: "Username is required" })
      .min(1, { message: "Username is required" }),

    email: z
      .string({ message: "Email is required" })
      .email({ message: "Invalid email address" }),

    password: z
      .string({ message: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters long" }),

    confirm_password: z
      .string({ message: "Confirm Password is required" }),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["password"], // You can also use "confirm_password" depending on where you want the error
    message: "Passwords do not match",
  });



export const LoginUserSchema = z.object({
  identifier: z
    .string({ message: "Email or username is required" })
    .min(1, { message: "Email or username is required" })
    .refine(
      (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || /^[a-zA-Z0-9_.-]{3,}$/.test(val),
      {
        message: "Enter a valid email or username (min 3 characters)",
      }
    ),

  password: z
    .string({ message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters long" }),
});



export const EmailOnlySchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email({ message: "Invalid email address" }),
});


export const EmailWithVerificationSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email({ message: "Invalid email address" }),

  verification_code: z
    .string({ message: "Verification code is required" })
    .regex(/^\d{6}$/, { message: "Verification code must be exactly 6 digits" }),
});
