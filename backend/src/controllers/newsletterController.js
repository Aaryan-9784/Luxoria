import Newsletter from '../models/Newsletter.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/responseHandler.js';

export const subscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return sendResponse(res, 400, false, 'Email is required');
  }

  // Check if already subscribed
  const existingSubscriber = await Newsletter.findOne({ email });

  if (existingSubscriber) {
    // Return success anyway to prevent email enumeration, or specific message if preferred
    return sendResponse(res, 200, true, 'You are already subscribed to our newsletter!');
  }

  // Create new subscriber
  await Newsletter.create({ email });

  return sendResponse(res, 201, true, 'Successfully subscribed to the newsletter!');
});
