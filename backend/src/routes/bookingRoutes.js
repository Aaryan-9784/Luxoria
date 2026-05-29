import { Router } from 'express';
import {
  createBooking, getMyBookings, getVendorBookings,
  getBooking, updateBookingStatus, cancelBooking,
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { createBookingSchema, cancelBookingSchema } from '../validations/bookingValidation.js';

const router = Router();

router.use(protect);

router.post('/', authorize('user'), validate(createBookingSchema), createBooking);
router.get('/my', authorize('user'), getMyBookings);
router.get('/vendor', authorize('vendor'), getVendorBookings);
router.get('/:id', getBooking);
router.put('/:id/status', authorize('vendor', 'admin'), updateBookingStatus);
router.put('/:id/cancel', authorize('user'), validate(cancelBookingSchema), cancelBooking);

export default router;
