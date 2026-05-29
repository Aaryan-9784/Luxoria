import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';
import {
  createRazorpayOrder,
  verifyRazorpaySignature,
} from '../services/paymentService.js';
import emailService from '../services/emailService.js';

/**
 * @desc    Create Razorpay order
 * @route   POST /api/payments/create-order
 * @access  User
 */
export const createOrder = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;

  const booking = await Booking.findById(bookingId).populate('vehicle', 'name');

  if (!booking) {
    throw ApiError.notFound('Booking not found');
  }

  if (booking.user.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('Not authorized');
  }

  if (booking.status !== 'pending') {
    throw ApiError.badRequest('Booking is not in pending state');
  }

  // Check if payment already exists
  const existingPayment = await Payment.findOne({
    booking: bookingId,
    status: { $in: ['captured', 'authorized'] },
  });

  if (existingPayment) {
    throw ApiError.conflict('Payment already completed for this booking');
  }

  const order = await createRazorpayOrder(
    booking.totalAmount,
    'INR',
    booking.bookingId
  );

  // Create payment record
  await Payment.create({
    booking: bookingId,
    user: req.user._id,
    razorpayOrderId: order.id,
    amount: booking.totalAmount,
    currency: 'INR',
  });

  ApiResponse.success(res, {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    key: process.env.RAZORPAY_KEY_ID,
    bookingId: booking.bookingId,
    vehicleName: booking.vehicle.name,
  }, 'Order created');
});

/**
 * @desc    Verify payment
 * @route   POST /api/payments/verify
 * @access  User
 */
export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  // Verify signature
  const isValid = verifyRazorpaySignature(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  );

  if (!isValid) {
    throw ApiError.badRequest('Payment verification failed — invalid signature');
  }

  // Update payment
  const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });

  if (!payment) {
    throw ApiError.notFound('Payment record not found');
  }

  payment.razorpayPaymentId = razorpay_payment_id;
  payment.razorpaySignature = razorpay_signature;
  payment.status = 'captured';
  await payment.save();

  // Update booking status
  const booking = await Booking.findById(payment.booking)
    .populate('vehicle', 'name brand')
    .populate('user', 'name email');

  booking.status = 'confirmed';
  await booking.save();

  // Send confirmation email (non-blocking)
  emailService.sendBookingConfirmation(booking.user, booking, booking.vehicle)
    .catch((err) => console.error('Confirmation email failed:', err));

  ApiResponse.success(res, {
    payment,
    booking,
  }, 'Payment verified and booking confirmed');
});

/**
 * @desc    Get payment details for a booking
 * @route   GET /api/payments/:bookingId
 * @access  Protected
 */
export const getPaymentDetails = asyncHandler(async (req, res) => {
  const payment = await Payment.findOne({ booking: req.params.bookingId })
    .populate('booking', 'bookingId totalAmount startDate endDate status')
    .populate('user', 'name email');

  if (!payment) {
    throw ApiError.notFound('Payment not found');
  }

  ApiResponse.success(res, { payment });
});
