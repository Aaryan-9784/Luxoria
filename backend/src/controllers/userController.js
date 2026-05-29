import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../services/uploadService.js';
import { UPLOAD } from '../constants/index.js';

/**
 * @desc    Get current user profile
 * @route   GET /api/users/me
 * @access  Protected
 */
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  ApiResponse.success(res, { user });
});

/**
 * @desc    Update profile
 * @route   PUT /api/users/me
 * @access  Protected
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, address } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, phone, address },
    { new: true, runValidators: true }
  );

  ApiResponse.success(res, { user }, 'Profile updated successfully');
});

/**
 * @desc    Upload/update avatar
 * @route   PUT /api/users/me/avatar
 * @access  Protected
 */
export const updateAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw ApiError.badRequest('Please upload an image');
  }

  const user = await User.findById(req.user._id);

  // Delete old avatar from Cloudinary if exists
  if (user.avatar.publicId) {
    await deleteFromCloudinary(user.avatar.publicId);
  }

  // Upload new avatar
  const result = await uploadToCloudinary(
    req.file.buffer,
    UPLOAD.FOLDERS.AVATARS,
    { width: 400, height: 400 }
  );

  user.avatar = result;
  await user.save({ validateBeforeSave: false });

  ApiResponse.success(res, { user }, 'Avatar updated successfully');
});

/**
 * @desc    Change password
 * @route   PUT /api/users/me/password
 * @access  Protected
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.comparePassword(currentPassword))) {
    throw ApiError.badRequest('Current password is incorrect');
  }

  user.password = newPassword;
  user.refreshTokens = []; // Invalidate all other sessions
  await user.save();

  ApiResponse.success(res, null, 'Password changed successfully. Please login again.');
});
