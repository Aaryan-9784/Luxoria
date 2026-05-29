import Booking from '../models/Booking.js';
import Vehicle from '../models/Vehicle.js';
import Notification from '../models/Notification.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiFeatures from '../utils/apiFeatures.js';
import asyncHandler from '../middleware/asyncHandler.js';

/**
 * @desc    Create booking
 * @route   POST /api/bookings
 * @access  User
 */
export const createBooking = asyncHandler(async (req, res) => {
  const { vehicleId, startDate, endDate, pickupLocation, dropoffLocation, notes } = req.body;

  const vehicle = await Vehicle.findOne({
    _id: vehicleId,
    isActive: true,
    status: 'approved',
    availability: 'available',
  });

  if (!vehicle) {
    throw ApiError.notFound('Vehicle not available for booking');
  }

  // Check for overlapping bookings
  const overlap = await Booking.findOne({
    vehicle: vehicleId,
    isActive: true,
    status: { $in: ['pending', 'confirmed', 'active'] },
    $or: [
      { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } },
    ],
  });

  if (overlap) {
    throw ApiError.conflict('Vehicle is already booked for the selected dates');
  }

  const diffTime = Math.abs(new Date(endDate) - new Date(startDate));
  const totalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const totalAmount = totalDays * vehicle.pricePerDay;

  const booking = await Booking.create({
    user: req.user._id,
    vehicle: vehicleId,
    vendor: vehicle.vendor,
    startDate,
    endDate,
    totalDays,
    totalAmount,
    pickupLocation,
    dropoffLocation,
    notes,
  });

  // Notify vendor
  await Notification.create({
    recipient: vehicle.vendor,
    type: 'booking',
    title: 'New Booking Request',
    message: `${req.user.name} has booked ${vehicle.name} for ${totalDays} days`,
    data: { bookingId: booking._id },
  });

  const populatedBooking = await Booking.findById(booking._id)
    .populate('vehicle', 'name brand images pricePerDay')
    .populate('user', 'name email avatar');

  ApiResponse.created(res, { booking: populatedBooking }, 'Booking created successfully');
});

/**
 * @desc    Get user's bookings
 * @route   GET /api/bookings/my
 * @access  User
 */
export const getMyBookings = asyncHandler(async (req, res) => {
  const filter = { user: req.user._id, isActive: true };
  if (req.query.status) filter.status = req.query.status;

  const totalCount = await Booking.countDocuments(filter);

  const features = new ApiFeatures(Booking.find(filter), req.query)
    .sort()
    .paginate();
  features.totalCount = totalCount;

  const bookings = await features.query
    .populate('vehicle', 'name brand images pricePerDay category')
    .populate('vendor', 'name avatar');

  ApiResponse.paginated(res, bookings, features.getPagination());
});

/**
 * @desc    Get vendor's bookings
 * @route   GET /api/bookings/vendor
 * @access  Vendor
 */
export const getVendorBookings = asyncHandler(async (req, res) => {
  const filter = { vendor: req.user._id, isActive: true };
  if (req.query.status) filter.status = req.query.status;

  const totalCount = await Booking.countDocuments(filter);

  const features = new ApiFeatures(Booking.find(filter), req.query)
    .sort()
    .paginate();
  features.totalCount = totalCount;

  const bookings = await features.query
    .populate('vehicle', 'name brand images pricePerDay')
    .populate('user', 'name email avatar phone');

  ApiResponse.paginated(res, bookings, features.getPagination());
});

/**
 * @desc    Get booking details
 * @route   GET /api/bookings/:id
 * @access  Protected
 */
export const getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('vehicle', 'name brand model images pricePerDay category location features')
    .populate('user', 'name email avatar phone')
    .populate('vendor', 'name email avatar phone');

  if (!booking) {
    throw ApiError.notFound('Booking not found');
  }

  // Only the user, vendor, or admin can view
  const isOwner = booking.user._id.toString() === req.user._id.toString();
  const isVendor = booking.vendor._id.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isVendor && !isAdmin) {
    throw ApiError.forbidden('Not authorized to view this booking');
  }

  ApiResponse.success(res, { booking });
});

/**
 * @desc    Update booking status
 * @route   PUT /api/bookings/:id/status
 * @access  Vendor/Admin
 */
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw ApiError.notFound('Booking not found');
  }

  booking.status = status;
  await booking.save();

  // Notify user
  await Notification.create({
    recipient: booking.user,
    type: 'booking',
    title: 'Booking Status Updated',
    message: `Your booking ${booking.bookingId} status is now: ${status}`,
    data: { bookingId: booking._id },
  });

  ApiResponse.success(res, { booking }, 'Booking status updated');
});

/**
 * @desc    Cancel booking
 * @route   PUT /api/bookings/:id/cancel
 * @access  User
 */
export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw ApiError.notFound('Booking not found');
  }

  if (booking.user.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('You can only cancel your own bookings');
  }

  if (['completed', 'cancelled'].includes(booking.status)) {
    throw ApiError.badRequest(`Cannot cancel a ${booking.status} booking`);
  }

  booking.status = 'cancelled';
  booking.cancellationReason = req.body.cancellationReason || 'Cancelled by user';
  await booking.save();

  // Notify vendor
  await Notification.create({
    recipient: booking.vendor,
    type: 'booking',
    title: 'Booking Cancelled',
    message: `Booking ${booking.bookingId} has been cancelled`,
    data: { bookingId: booking._id },
  });

  ApiResponse.success(res, { booking }, 'Booking cancelled successfully');
});
