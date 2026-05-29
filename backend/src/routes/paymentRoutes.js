import { Router } from 'express';
import { createOrder, verifyPayment, getPaymentDetails } from '../controllers/paymentController.js';
import { protect, authorize } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { createOrderSchema, verifyPaymentSchema } from '../validations/paymentValidation.js';

const router = Router();

router.use(protect);

router.post('/create-order', authorize('user'), validate(createOrderSchema), createOrder);
router.post('/verify', authorize('user'), validate(verifyPaymentSchema), verifyPayment);
router.get('/:bookingId', getPaymentDetails);

export default router;
