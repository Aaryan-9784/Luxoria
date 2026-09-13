import crypto from 'crypto';
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

const generateAndSendOtp = async (user) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  user.loginOtp = hashedOtp;
  user.loginOtpExpires = expiresAt;
  await user.save({ validateBeforeSave: false });

  await emailService.sendLoginOtp(user, otp);
};

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

  await generateAndSendOtp(user);

  ApiResponse.success(res, {
    requireOtp: true,
    email: user.email,
  }, 'Verification OTP has been sent to your email.');
});

/**
 * @desc    Vendor Login
 * @route   POST /api/auth/vendor/login
 * @access  Public
 */
export const vendorLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  if (user.role !== 'vendor' && user.role !== 'admin') {
    throw ApiError.forbidden('Unauthorized access. This portal is for vendors only.');
  }

  if (!user.isActive) {
    throw ApiError.forbidden('Your account has been deactivated. Contact support.');
  }

  await generateAndSendOtp(user);

  ApiResponse.success(res, {
    requireOtp: true,
    email: user.email,
  }, 'Verification OTP has been sent to your email.');
});

/**
 * @desc    Admin Login
 * @route   POST /api/auth/admin/login
 * @access  Public
 */
export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  if (user.role !== 'admin') {
    throw ApiError.forbidden('Unauthorized access. This portal is for administrators only.');
  }

  if (!user.isActive) {
    throw ApiError.forbidden('Your account has been deactivated. Contact support.');
  }

  await generateAndSendOtp(user);

  ApiResponse.success(res, {
    requireOtp: true,
    email: user.email,
  }, 'Verification OTP has been sent to your email.');
});

/**
 * @desc    Verify Login OTP
 * @route   POST /api/auth/verify-otp
 * @access  Public
 */
export const verifyLoginOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    throw ApiError.badRequest('Email and OTP verification code are required');
  }
  const cleanEmail = String(email).toLowerCase().trim();
  const cleanOtp = String(otp).trim();

  const user = await User.findOne({ email: cleanEmail }).select('+loginOtp +loginOtpExpires');
  if (!user) {
    throw ApiError.badRequest('Account not found. Please sign in again.');
  }

  if (!user.loginOtp || !user.loginOtpExpires) {
    throw ApiError.badRequest('No active verification code found for this account. Please sign in again.');
  }

  if (user.loginOtpExpires < new Date()) {
    user.loginOtp = undefined;
    user.loginOtpExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw ApiError.badRequest('Verification code has expired. Please click "Resend Code".');
  }

  const hashedOtp = crypto.createHash('sha256').update(cleanOtp).digest('hex');
  if (user.loginOtp !== hashedOtp) {
    throw ApiError.badRequest('Incorrect verification code. Please check your email and try again.');
  }

  // Clear OTP fields
  user.loginOtp = undefined;
  user.loginOtpExpires = undefined;

  // Generate tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

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
 * @desc    Resend Login OTP
 * @route   POST /api/auth/resend-otp
 * @access  Public
 */
export const resendLoginOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw ApiError.badRequest('Email address is required');
  }
  const cleanEmail = String(email).toLowerCase().trim();

  const user = await User.findOne({ email: cleanEmail });
  if (!user) {
    throw ApiError.badRequest('Account not found with this email');
  }

  await generateAndSendOtp(user);

  ApiResponse.success(res, { email: user.email }, 'Verification OTP has been resent to your email.');
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

  // Rotate: Replace old token atomically
  const newRefreshToken = generateRefreshToken(user._id);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const updatedUser = await User.findOneAndUpdate(
    { _id: user._id, 'refreshTokens.token': refreshToken },
    {
      $set: {
        'refreshTokens.$.token': newRefreshToken,
        'refreshTokens.$.expiresAt': expiresAt
      }
    },
    { new: true }
  );

  if (!updatedUser) {
    // Token reuse detected - the token was already rotated by another concurrent request!
    await User.findByIdAndUpdate(user._id, { $set: { refreshTokens: [] } });
    clearRefreshTokenCookie(res);
    throw ApiError.unauthorized('Token reuse detected. Please login again.');
  }

  // Clean expired tokens asynchronously to keep DB clean
  User.findByIdAndUpdate(user._id, {
    $pull: { refreshTokens: { expiresAt: { $lt: new Date() } } }
  }).exec().catch(() => {});

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
    const user = await User.findOne({ 'refreshTokens.token': refreshToken });
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

/**
 * @desc    Google OAuth Callback handling
 * @route   GET /api/auth/google/callback
 * @access  Public
 */
export const googleOAuthCallback = asyncHandler(async (req, res) => {
  // User is injected by passport middleware
  const user = req.user;

  if (!user) {
    return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=auth_failed`);
  }

  // Generate tokens
  const refreshToken = generateRefreshToken(user._id);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // Manage tokens in DB
  user.cleanExpiredTokens();
  user.refreshTokens.push({
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  await user.save({ validateBeforeSave: false });

  // Set the HTTP-only cookie
  setRefreshTokenCookie(res, refreshToken);

  // Redirect to frontend OAuth callback page to initiate token exchange
  res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/oauth-callback`);
});
