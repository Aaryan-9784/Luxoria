import Booking from '../models/Booking.js';
import Vehicle from '../models/Vehicle.js';
import Payment from '../models/Payment.js';
import Notification from '../models/Notification.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiFeatures from '../utils/apiFeatures.js';
import asyncHandler from '../middleware/asyncHandler.js';
import * as paymentService from '../services/paymentService.js';
import emailService from '../services/emailService.js';

/**
 * @desc    Create booking
 * @route   POST /api/bookings
 * @access  User
 */
export const createBooking = asyncHandler(async (req, res) => {
  const { vehicleId, startDate, endDate, pickupLocation, dropoffLocation, notes } = req.body;

  // Only check isActive + approved — NOT availability field,
  // because availability: 'booked' would block ALL dates even when
  // the existing booking is on completely different dates.
  const vehicle = await Vehicle.findOne({
    _id: vehicleId,
    isActive: true,
    status: 'approved',
  });

  if (!vehicle) {
    throw ApiError.notFound('Vehicle not found or not approved for booking');
  }

  // Block maintenance vehicles
  if (vehicle.availability === 'maintenance') {
    throw ApiError.badRequest('Vehicle is currently under maintenance');
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw ApiError.badRequest('Invalid start or end date');
  }
  if (start > end) {
    throw ApiError.badRequest('End date cannot be before start date');
  }
  // Allow bookings starting today, giving timezone buffer
  const yesterdayUTC = new Date(Date.now() - 24 * 60 * 60 * 1000);
  yesterdayUTC.setUTCHours(0, 0, 0, 0);
  if (start < yesterdayUTC) {
    throw ApiError.badRequest('Start date cannot be in the past');
  }

  // Normalize start to beginning of day and end to end of day
  const startOfDay = new Date(startDate);
  startOfDay.setUTCHours(0, 0, 0, 0);
  const endOfDay = new Date(endDate);
  endOfDay.setUTCHours(23, 59, 59, 999);

  // Date-level overlap check — pending checkouts older than 15 mins are treated as abandoned
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
  const overlap = await Booking.findOne({
    vehicle: vehicleId,
    isActive: true,
    $or: [
      { status: { $in: ['confirmed', 'active'] } },
      { status: 'pending', createdAt: { $gte: fifteenMinutesAgo } },
    ],
    startDate: { $lte: endOfDay },
    endDate:   { $gte: startOfDay },
  });

  if (overlap) {
    throw ApiError.conflict('Vehicle is already booked for the selected dates');
  }

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const totalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const totalAmount = totalDays * vehicle.pricePerDay;

  const booking = await Booking.create({
    user: req.user._id,
    vehicle: vehicleId,
    vendor: vehicle.vendor,
    startDate: startOfDay,
    endDate: endOfDay,
    totalDays,
    totalAmount,
    pickupLocation: pickupLocation || vehicle.location?.city || 'Mumbai',
    dropoffLocation: dropoffLocation || pickupLocation || vehicle.location?.city || 'Mumbai',
    notes: notes || '',
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

  // Send confirmation email to customer (non-blocking)
  if (populatedBooking?.user?.email && populatedBooking?.vehicle) {
    emailService.sendBookingConfirmation(populatedBooking.user, populatedBooking, populatedBooking.vehicle)
      .catch((err) => console.error('Booking confirmation email failed:', err));
  }

  ApiResponse.created(res, { booking: populatedBooking }, 'Booking created successfully');
});

/**
 * @desc    Get authenticated user's or vendor's bookings
 * @route   GET /api/bookings
 * @access  Protected
 */
export const getBookings = asyncHandler(async (req, res) => {
  const filter = { isActive: true };

  if (req.user.role === 'vendor') {
    filter.vendor = req.user._id;
  } else if (req.user.role === 'user') {
    filter.user = req.user._id;
  }

  if (req.query.status) filter.status = req.query.status;

  const totalCount = await Booking.countDocuments(filter);

  const features = new ApiFeatures(Booking.find(filter), req.query)
    .sort()
    .paginate();
  features.totalCount = totalCount;

  const bookings = await features.query
    .populate('vehicle', 'name brand images pricePerDay category transmission')
    .populate('vendor', 'name avatar')
    .populate('user', 'name email avatar phone');

  ApiResponse.paginated(res, bookings, features.getPagination());
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
    .populate('vehicle', 'name brand images pricePerDay category transmission')
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

  // IDOR protection: Vendor can only update their own bookings; Admin can update any
  if (req.user.role !== 'admin' && booking.vendor.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('You are not authorized to update this booking');
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

  // Re-populate references so frontend state does not lose vehicle/user details
  await booking.populate([
    { path: 'vehicle', select: 'name brand images pricePerDay category transmission' },
    { path: 'user', select: 'name email phone avatar' },
    { path: 'vendor', select: 'name email phone' },
  ]);

  // If status is updated to confirmed, send confirmation email
  if (status === 'confirmed' && booking.user?.email && booking.vehicle) {
    emailService.sendBookingConfirmation(booking.user, booking, booking.vehicle)
      .catch((err) => console.error('Status update confirmation email failed:', err));
  }

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

  const previousStatus = booking.status;
  booking.status = 'cancelled';
  booking.cancellationReason = req.body.cancellationReason || 'Cancelled by user';
  await booking.save();

  // Process refund if booking was previously confirmed or active
  if (['confirmed', 'active'].includes(previousStatus)) {
    const payment = await Payment.findOne({
      booking: booking._id,
      status: 'captured',
    });

    if (payment && payment.razorpayPaymentId) {
      try {
        const refund = await paymentService.initiateRefund(payment.razorpayPaymentId, payment.amount);
        payment.status = 'refunded';
        payment.refundId = refund.id;
        payment.refundAmount = payment.amount;
        await payment.save();
      } catch (refundErr) {
        console.error('Auto-refund failed for booking cancellation:', refundErr.message);
      }
    }
  }

  // Notify vendor
  await Notification.create({
    recipient: booking.vendor,
    type: 'booking',
    title: 'Booking Cancelled',
    message: `Booking ${booking.bookingId} has been cancelled`,
    data: { bookingId: booking._id },
  });

  // Re-populate references so frontend state does not lose vehicle/user details
  await booking.populate([
    { path: 'vehicle', select: 'name brand images pricePerDay category transmission' },
    { path: 'user', select: 'name email phone avatar' },
    { path: 'vendor', select: 'name email phone' },
  ]);

  ApiResponse.success(res, { booking }, 'Booking cancelled successfully');
});
