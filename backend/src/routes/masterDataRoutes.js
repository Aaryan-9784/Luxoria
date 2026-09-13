import { Router } from 'express';
import { getByCategory, createMasterData, updateMasterData, deleteMasterData } from '../controllers/masterDataController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/:category', getByCategory);
router.post('/', protect, authorize('admin'), createMasterData);
router.put('/:id', protect, authorize('admin'), updateMasterData);
router.delete('/:id', protect, authorize('admin'), deleteMasterData);

export default router;
