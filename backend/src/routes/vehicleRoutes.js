import { Router } from 'express';
import {
  getVehicles, getVehicle, getFeaturedVehicles, getPublicStats, createVehicle,
  updateVehicle, deleteVehicle, uploadImages, deleteImage, getVendorVehicles
} from '../controllers/vehicleController.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadMultiple } from '../middleware/upload.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';
import validate from '../middleware/validate.js';
import { createVehicleSchema, updateVehicleSchema } from '../validations/vehicleValidation.js';

const router = Router();

// Public routes
router.get('/', getVehicles);
router.get('/featured', getFeaturedVehicles);
router.get('/stats', getPublicStats);
// Vendor & Admin fleet management routes
router.get('/vendor', protect, authorize('vendor', 'admin'), getVendorVehicles);

// Public route with parameter
router.get('/:id', getVehicle);
router.post('/', protect, authorize('vendor', 'admin'), validate(createVehicleSchema), createVehicle);
router.put('/:id', protect, authorize('vendor', 'admin'), validate(updateVehicleSchema), updateVehicle);
router.delete('/:id', protect, authorize('vendor', 'admin'), deleteVehicle);
router.post('/:id/images', protect, authorize('vendor', 'admin'), uploadLimiter, uploadMultiple, uploadImages);
router.delete('/:id/images/:imageId', protect, authorize('vendor', 'admin'), deleteImage);

export default router;
