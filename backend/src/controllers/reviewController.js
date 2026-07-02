import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiFeatures from '../utils/apiFeatures.js';
import asyncHandler from '../middleware/asyncHandler.js';

/**
 * @desc    Get my reviews
 * @route   GET /api/reviews/my
 * @access  User
 */
export const getMyReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ user: req.user._id, isActive: true })
    .populate('vehicle', 'name brand images category')
    .populate('booking', 'startDate endDate')
    .sort('-createdAt');

  ApiResponse.success(res, { reviews });
});

/**
 * @desc    Create review
 * @route   POST /api/reviews/:vehicleId
 * @access  User
 */
export const createReview = asyncHandler(async (req, res) => {
  const { vehicleId } = req.params;
  const { rating, comment, bookingId } = req.body;

  // Verify user has a completed booking for this vehicle
  const booking = await Booking.findOne({
    _id: bookingId,
    user: req.user._id,
    vehicle: vehicleId,
    status: 'completed',
  });

  if (!booking) {
    throw ApiError.badRequest('You can only review vehicles from completed bookings');
  }

  const review = await Review.create({
    user: req.user._id,
    vehicle: vehicleId,
    booking: bookingId,
    rating,
    comment,
  });

  const populated = await Review.findById(review._id).populate('user', 'name avatar');

  ApiResponse.created(res, { review: populated }, 'Review submitted successfully');
});

/**
 * @desc    Get reviews for a vehicle
 * @route   GET /api/reviews/:vehicleId
 * @access  Public
 */
export const getVehicleReviews = asyncHandler(async (req, res) => {
  const filter = { vehicle: req.params.vehicleId, isActive: true };
  const totalCount = await Review.countDocuments(filter);

  const features = new ApiFeatures(Review.find(filter), req.query)
    .sort()
    .paginate();
  features.totalCount = totalCount;

  const reviews = await features.query.populate('user', 'name avatar');

  ApiResponse.paginated(res, reviews, features.getPagination());
});

/**
 * @desc    Update review
 * @route   PUT /api/reviews/:id
 * @access  User (author)
 */
export const updateReview = asyncHandler(async (req, res) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    throw ApiError.notFound('Review not found');
  }

  if (review.user.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('You can only edit your own reviews');
  }

  const { rating, comment } = req.body;
  review.rating = rating || review.rating;
  review.comment = comment !== undefined ? comment : review.comment;
  await review.save();

  ApiResponse.success(res, { review }, 'Review updated');
});

/**
 * @desc    Delete review
 * @route   DELETE /api/reviews/:id
 * @access  User (author) / Admin
 */
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    throw ApiError.notFound('Review not found');
  }

  const isAuthor = review.user.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isAuthor && !isAdmin) {
    throw ApiError.forbidden('Not authorized');
  }

  review.isActive = false;
  await review.save();

  ApiResponse.success(res, null, 'Review deleted');
});
