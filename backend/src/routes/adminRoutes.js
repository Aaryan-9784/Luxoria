import { Router } from 'express';
import {
  getUsers, updateUserStatus, getVendors, approveVendor,
  getAllVehicles, approveVehicle, deleteAdminVehicle, getAllBookings, getAnalytics,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.use(protect, authorize('admin'));

router.get('/users', getUsers);
router.put('/users/:id/status', updateUserStatus);
router.get('/vendors', getVendors);
router.put('/vendors/:id/approve', approveVendor);
router.get('/vehicles', getAllVehicles);
router.put('/vehicles/:id/approve', approveVehicle);
router.delete('/vehicles/:id', deleteAdminVehicle);
router.get('/bookings', getAllBookings);
router.get('/analytics', getAnalytics);

export default router;
