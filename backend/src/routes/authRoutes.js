import express from 'express';
import {
  register,
  login,
  vendorLogin,
  adminLogin,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validations/authValidation.js';

const router = express.Router();

// Public routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/vendor/login', validate(loginSchema), vendorLogin);
router.post('/admin/login', validate(loginSchema), adminLogin);
router.post('/refresh', refreshAccessToken);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.put('/reset-password/:token', validate(resetPasswordSchema), resetPassword);


// Protected routes
router.post('/logout', logout); 
router.get('/me', protect, getMe);

export default router;
