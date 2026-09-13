import Newsletter from '../models/Newsletter.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../middleware/asyncHandler.js';

export const subscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw ApiError.badRequest('Email is required');
  }

  const cleanEmail = String(email).toLowerCase().trim();

  // Check if already subscribed
  const existingSubscriber = await Newsletter.findOne({ email: cleanEmail });

  if (existingSubscriber) {
    return ApiResponse.success(res, null, 'You are already subscribed to our newsletter!');
  }

  // Create new subscriber
  await Newsletter.create({ email: cleanEmail });

  return ApiResponse.created(res, null, 'Successfully subscribed to the newsletter!');
});
