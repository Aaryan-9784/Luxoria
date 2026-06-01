import express from 'express';
import {
  register,
  login,
  googleAuth,
  googleAuthCallback,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshAccessToken);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

// Google OAuth routes
router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback);

// Protected routes
router.post('/logout', logout); 
router.get('/me', protect, getMe);

export default router;
