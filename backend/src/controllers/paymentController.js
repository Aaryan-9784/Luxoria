import crypto from 'crypto';
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
import { convertUsdToInr } from '../utils/currency.js';

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

  const amountInInr = convertUsdToInr(booking.totalAmount);

  const order = await createRazorpayOrder(
    amountInInr,
    'INR',
    booking.bookingId
  );

  // Create payment record
  await Payment.create({
    booking: bookingId,
    user: req.user._id,
    razorpayOrderId: order.id,
    amount: amountInInr,
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

  if (payment.status === 'captured') {
    const booking = await Booking.findById(payment.booking)
      .populate('vehicle', 'name brand images category transmission')
      .populate('user', 'name email');

    if (booking.status !== 'confirmed') {
      booking.status = 'confirmed';
      await booking.save();
    }

    return ApiResponse.success(res, {
      payment,
      booking,
    }, 'Payment already verified');
  }

  payment.razorpayPaymentId = razorpay_payment_id;
  payment.razorpaySignature = razorpay_signature;
  payment.status = 'captured';
  await payment.save();

  // Update booking status
  const booking = await Booking.findById(payment.booking)
    .populate('vehicle', 'name brand images category transmission')
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
    .populate('booking', 'bookingId totalAmount startDate endDate status vendor user')
    .populate('user', 'name email');

  if (!payment) {
    throw ApiError.notFound('Payment not found');
  }

  const isOwner = payment.user?._id?.toString() === req.user._id.toString();
  const isVendor = payment.booking?.vendor?.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isVendor && !isAdmin) {
    throw ApiError.forbidden('You are not authorized to view this payment');
  }

  ApiResponse.success(res, { payment });
});

/**
 * @desc    Handle Razorpay Webhook
 * @route   POST /api/payments/webhook
 * @access  Public (Signature-verified)
 */
export const handleWebhook = asyncHandler(async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;
  const signature = req.headers['x-razorpay-signature'];

  if (secret && signature) {
    const rawPayload = req.rawBody || (typeof req.body === 'string' ? req.body : JSON.stringify(req.body));
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawPayload)
      .digest('hex');

    if (expectedSignature !== signature) {
      throw ApiError.badRequest('Invalid webhook signature');
    }
  }

  const { event, payload } = req.body || {};

  if (event === 'payment.captured' || event === 'order.paid') {
    const paymentEntity = payload?.payment?.entity;
    const orderId = paymentEntity?.order_id || payload?.order?.entity?.id;
    const paymentId = paymentEntity?.id;

    if (orderId) {
      const payment = await Payment.findOne({ razorpayOrderId: orderId });
      if (payment && payment.status !== 'captured') {
        payment.status = 'captured';
        if (paymentId) payment.razorpayPaymentId = paymentId;
        await payment.save();

        const booking = await Booking.findById(payment.booking)
          .populate('vehicle', 'name brand images category transmission')
          .populate('user', 'name email');

        if (booking && booking.status === 'pending') {
          booking.status = 'confirmed';
          await booking.save();

          emailService.sendBookingConfirmation(booking.user, booking, booking.vehicle)
            .catch((err) => console.error('Webhook confirmation email failed:', err));
        }
      }
    }
  } else if (event === 'payment.failed') {
    const paymentEntity = payload?.payment?.entity;
    const orderId = paymentEntity?.order_id;
    if (orderId) {
      await Payment.findOneAndUpdate(
        { razorpayOrderId: orderId, status: { $ne: 'captured' } },
        { status: 'failed' }
      );
    }
  }

  res.status(200).json({ status: 'ok' });
});
