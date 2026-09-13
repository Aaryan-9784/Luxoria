import { Router } from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlistController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/', getWishlist);
router.post('/:vehicleId', addToWishlist);
router.delete('/:vehicleId', removeFromWishlist);

export default router;
