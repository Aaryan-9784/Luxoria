import { Router } from 'express';
import { createReview, getVehicleReviews, updateReview, deleteReview } from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/:vehicleId', getVehicleReviews);
router.post('/:vehicleId', protect, authorize('user'), createReview);
router.put('/:id', protect, authorize('user'), updateReview);
router.delete('/:id', protect, deleteReview);

export default router;
