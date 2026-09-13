import { Router } from 'express';
import {
  createBooking, getBookings, getMyBookings, getVendorBookings,
  getBooking, updateBookingStatus, cancelBooking,
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { createBookingSchema, cancelBookingSchema } from '../validations/bookingValidation.js';

const router = Router();

router.use(protect);

router.get('/', getBookings);
router.post('/', authorize('user', 'vendor', 'admin'), validate(createBookingSchema), createBooking);
router.get('/my', authorize('user', 'vendor', 'admin'), getMyBookings);
router.get('/vendor', authorize('vendor', 'admin'), getVendorBookings);
router.get('/:id', getBooking);
router.put('/:id/status', authorize('vendor', 'admin'), updateBookingStatus);
router.put('/:id/cancel', authorize('user', 'vendor', 'admin'), validate(cancelBookingSchema), cancelBooking);

export default router;
