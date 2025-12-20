import express from 'express';
import { register, login, logout, sendVerifyOTP, verifyEmail, isAuthenticated, sendResetOTP, resetPassword} from '../controllers/authControllers.js'
import userAuth from '../middleware/userauth.js'

export const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/send-verify-otp', userAuth, sendVerifyOTP);
authRouter.post('/verify-account', userAuth, verifyEmail);
authRouter.post('/is-auth', userAuth, isAuthenticated);
authRouter.post('/send-reset-otp', sendResetOTP);
authRouter.post('/reset-password', resetPassword);
