import express from 'express';
import {
  register,
  login,
  vendorLogin,
  adminLogin,
  verifyLoginOtp,
  resendLoginOtp,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
  googleOAuthCallback,
} from '../controllers/authController.js';
import passport from 'passport';
import { protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import {
  registerSchema,
  loginSchema,
  verifyOtpSchema,
  resendOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validations/authValidation.js';

const router = express.Router();

// Public routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/vendor/login', validate(loginSchema), vendorLogin);
router.post('/admin/login', validate(loginSchema), adminLogin);
router.post('/verify-otp', validate(verifyOtpSchema), verifyLoginOtp);
router.post('/resend-otp', validate(resendOtpSchema), resendLoginOtp);
router.post('/refresh', refreshAccessToken);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.put('/reset-password/:token', validate(resetPasswordSchema), resetPassword);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get(
  '/google/callback',
  (req, res, next) => {
    passport.authenticate('google', { 
      session: false, 
      failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=auth_failed` 
    })(req, res, next);
  },
  googleOAuthCallback
);


// Protected routes
router.post('/logout', logout); 
router.get('/me', protect, getMe);

export default router;
