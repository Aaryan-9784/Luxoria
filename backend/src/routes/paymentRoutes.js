import { Router } from 'express';
import { createOrder, verifyPayment, getPaymentDetails, handleWebhook } from '../controllers/paymentController.js';
import { protect, authorize } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { createOrderSchema, verifyPaymentSchema } from '../validations/paymentValidation.js';

const router = Router();

// Public webhook endpoint for asynchronous payment capture from Razorpay
router.post('/webhook', handleWebhook);

router.use(protect);

router.post('/create-order', authorize('user', 'vendor', 'admin'), validate(createOrderSchema), createOrder);
router.post('/verify', authorize('user', 'vendor', 'admin'), validate(verifyPaymentSchema), verifyPayment);
router.get('/:bookingId', getPaymentDetails);

export default router;
