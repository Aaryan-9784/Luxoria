import Joi from 'joi';

export const createOrderSchema = {
  body: Joi.object({
    bookingId: Joi.string().required(),
  }),
};

export const verifyPaymentSchema = {
  body: Joi.object({
    razorpay_order_id: Joi.string().required(),
    razorpay_payment_id: Joi.string().required(),
    razorpay_signature: Joi.string().required(),
  }),
};
