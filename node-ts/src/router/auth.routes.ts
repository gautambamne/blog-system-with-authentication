
import { Router } from 'express';
import { 
    LoginUser, 
    RegisterUser, 
    RefreshAccessToken, 
    LogoutUser, 
    VerifyEmail, 
    ResendVerificationCode 
} from '../controllers/auth.controller';

const UserRouter = Router();

// Public routes
UserRouter.post("/auth/register" , RegisterUser);
UserRouter.post("/auth/login", LoginUser);
UserRouter.post("/auth/verify-email", VerifyEmail);
UserRouter.post("/auth/resend-verification", ResendVerificationCode);
UserRouter.post("/auth/refresh-token", RefreshAccessToken);
UserRouter.post("/auth/logout", LogoutUser);

export default UserRouter;