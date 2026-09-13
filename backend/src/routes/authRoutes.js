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
import { authLimiter } from '../middleware/rateLimiter.js';
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

// Public routes (rate-limited)
router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/vendor/login', authLimiter, validate(loginSchema), vendorLogin);
router.post('/admin/login', authLimiter, validate(loginSchema), adminLogin);
router.post('/verify-otp', authLimiter, validate(verifyOtpSchema), verifyLoginOtp);
router.post('/resend-otp', authLimiter, validate(resendOtpSchema), resendLoginOtp);
router.post('/refresh', refreshAccessToken);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.put('/reset-password/:token', authLimiter, validate(resetPasswordSchema), resetPassword);

// Google OAuth routes
router.get('/google', (req, res, next) => {
  const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.redirect(`${clientUrl}/login?error=google_oauth_not_configured`);
  }
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })(req, res, next);
});

router.get(
  '/google/callback',
  (req, res, next) => {
    const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return res.redirect(`${clientUrl}/login?error=google_oauth_not_configured`);
    }
    passport.authenticate('google', { 
      session: false, 
      failureRedirect: `${clientUrl}/login?error=auth_failed` 
    })(req, res, next);
  },
  googleOAuthCallback
);


// Protected routes
router.post('/logout', logout); 
router.get('/me', protect, getMe);

export default router;
