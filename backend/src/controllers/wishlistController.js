import Wishlist from '../models/Wishlist.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';

/**
 * @desc    Get user's wishlist
 * @route   GET /api/wishlist
 * @access  User
 */
export const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.find({ user: req.user._id })
    .populate({
      path: 'vehicle',
      match: { isActive: true },
      select: 'name brand model images pricePerDay category rating location',
      populate: { path: 'vendor', select: 'name avatar' },
    })
    .sort('-createdAt');

  // Filter out null vehicles (deleted)
  const filtered = wishlist.filter((item) => item.vehicle !== null);

  ApiResponse.success(res, { wishlist: filtered });
});

/**
 * @desc    Add to wishlist
 * @route   POST /api/wishlist/:vehicleId
 * @access  User
 */
export const addToWishlist = asyncHandler(async (req, res) => {
  const { vehicleId } = req.params;

  try {
    const item = await Wishlist.create({
      user: req.user._id,
      vehicle: vehicleId,
    });

    ApiResponse.created(res, { wishlist: item }, 'Added to wishlist');
  } catch (err) {
    if (err.code === 11000) {
      throw ApiError.conflict('Vehicle already in wishlist');
    }
    throw err;
  }
});

/**
 * @desc    Remove from wishlist
 * @route   DELETE /api/wishlist/:vehicleId
 * @access  User
 */
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const result = await Wishlist.findOneAndDelete({
    user: req.user._id,
    vehicle: req.params.vehicleId,
  });

  if (!result) {
    throw ApiError.notFound('Vehicle not in wishlist');
  }

  ApiResponse.success(res, null, 'Removed from wishlist');
});
