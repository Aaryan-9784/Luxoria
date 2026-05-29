import razorpayInstance from '../config/razorpay.js';
import crypto from 'crypto';
import ApiError from '../utils/ApiError.js';

/**
 * Create a Razorpay order
 */
export const createRazorpayOrder = async (amount, currency = 'INR', receipt) => {
  try {
    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt,
      payment_capture: 1, // Auto-capture
    };

    const order = await razorpayInstance.orders.create(options);
    return order;
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    throw ApiError.internal('Failed to create payment order');
  }
};

/**
 * Verify Razorpay payment signature
 */
export const verifyRazorpaySignature = (orderId, paymentId, signature) => {
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  return expectedSignature === signature;
};

/**
 * Fetch payment details from Razorpay
 */
export const fetchPaymentDetails = async (paymentId) => {
  try {
    const payment = await razorpayInstance.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.error('Razorpay fetch payment error:', error);
    throw ApiError.internal('Failed to fetch payment details');
  }
};

/**
 * Initiate refund
 */
export const initiateRefund = async (paymentId, amount) => {
  try {
    const refund = await razorpayInstance.payments.refund(paymentId, {
      amount: Math.round(amount * 100),
    });
    return refund;
  } catch (error) {
    console.error('Razorpay refund error:', error);
    throw ApiError.internal('Failed to initiate refund');
  }
};
