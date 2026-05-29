import { Router } from 'express';
import {
  getVehicles, getVehicle, getFeaturedVehicles, createVehicle,
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
router.get('/:id', getVehicle);

// Vendor routes
router.get('/vendor', protect, authorize('vendor'), getVendorVehicles);
router.post('/', protect, authorize('vendor'), validate(createVehicleSchema), createVehicle);
router.put('/:id', protect, authorize('vendor'), validate(updateVehicleSchema), updateVehicle);
router.delete('/:id', protect, authorize('vendor'), deleteVehicle);
router.post('/:id/images', protect, authorize('vendor'), uploadLimiter, uploadMultiple, uploadImages);
router.delete('/:id/images/:imageId', protect, authorize('vendor'), deleteImage);

export default router;
