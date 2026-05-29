import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generatePasswordResetToken,
  hashResetToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from '../services/authService.js';
import emailService from '../services/emailService.js';
import passport from 'passport';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw ApiError.conflict('An account with this email already exists');
  }

  const user = await User.create({ name, email, password, phone, role });

  // Generate tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Save refresh token to DB
  user.refreshTokens.push({
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  await user.save({ validateBeforeSave: false });

  // Set cookie
  setRefreshTokenCookie(res, refreshToken);

  // Send welcome email (non-blocking)
  emailService.sendWelcomeEmail(user).catch((err) => console.error('Welcome email failed:', err));

  ApiResponse.created(res, {
    user: user.toJSON(),
    accessToken,
  }, 'Account created successfully');
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  if (!user.isActive) {
    throw ApiError.forbidden('Your account has been deactivated. Contact support.');
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Clean expired tokens and add new one
  user.cleanExpiredTokens();
  user.refreshTokens.push({
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  await user.save({ validateBeforeSave: false });

  setRefreshTokenCookie(res, refreshToken);

  ApiResponse.success(res, {
    user: user.toJSON(),
    accessToken,
  }, 'Logged in successfully');
});

/**
 * @desc    Google OAuth redirect
 * @route   GET /api/auth/google
 * @access  Public
 */
export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false,
});

/**
 * @desc    Google OAuth callback
 * @route   GET /api/auth/google/callback
 * @access  Public
 */
export const googleAuthCallback = asyncHandler(async (req, res, next) => {
  passport.authenticate('google', { session: false }, async (err, user) => {
    try {
      if (err || !user) {
        return res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
      }

      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      user.cleanExpiredTokens();
      user.refreshTokens.push({
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      await user.save({ validateBeforeSave: false });

      setRefreshTokenCookie(res, refreshToken);

      // Redirect to frontend with access token
      res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${accessToken}`);
    } catch (error) {
      next(error);
    }
  })(req, res, next);
});

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh
 * @access  Public (requires refresh token cookie)
 */
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw ApiError.unauthorized('No refresh token provided');
  }

  // Verify token
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    clearRefreshTokenCookie(res);
    throw ApiError.unauthorized('Invalid or expired refresh token');
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw ApiError.unauthorized('User not found');
  }

  // Verify token exists in DB (rotation check)
  const tokenIndex = user.refreshTokens.findIndex((t) => t.token === refreshToken);
  if (tokenIndex === -1) {
    // Token reuse detected — clear all tokens (security measure)
    user.refreshTokens = [];
    await user.save({ validateBeforeSave: false });
    clearRefreshTokenCookie(res);
    throw ApiError.unauthorized('Token reuse detected. Please login again.');
  }

  // Rotate: remove old, add new
  user.refreshTokens.splice(tokenIndex, 1);
  const newRefreshToken = generateRefreshToken(user._id);
  user.refreshTokens.push({
    token: newRefreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  user.cleanExpiredTokens();
  await user.save({ validateBeforeSave: false });

  const newAccessToken = generateAccessToken(user._id);
  setRefreshTokenCookie(res, newRefreshToken);

  ApiResponse.success(res, { accessToken: newAccessToken }, 'Token refreshed');
});

/**
 * @desc    Logout
 * @route   POST /api/auth/logout
 * @access  Protected
 */
export const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (refreshToken) {
    const user = await User.findById(req.user._id);
    if (user) {
      user.refreshTokens = user.refreshTokens.filter(
        (t) => t.token !== refreshToken
      );
      await user.save({ validateBeforeSave: false });
    }
  }

  clearRefreshTokenCookie(res);
  ApiResponse.success(res, null, 'Logged out successfully');
});

/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    // Don't reveal if user exists
    return ApiResponse.success(res, null, 'If an account exists, a reset email has been sent');
  }

  const { resetToken, hashedToken, expiresAt } = generatePasswordResetToken();

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = expiresAt;
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  try {
    await emailService.sendPasswordReset(user, resetUrl);
    ApiResponse.success(res, null, 'If an account exists, a reset email has been sent');
  } catch {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw ApiError.internal('Failed to send reset email. Please try again.');
  }
});

/**
 * @desc    Reset password
 * @route   PUT /api/auth/reset-password/:token
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = hashResetToken(req.params.token);

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw ApiError.badRequest('Invalid or expired reset token');
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshTokens = []; // Invalidate all sessions
  await user.save();

  ApiResponse.success(res, null, 'Password reset successful. Please login with your new password.');
});

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Protected
 */
export const getMe = asyncHandler(async (req, res) => {
  ApiResponse.success(res, { user: req.user });
});
