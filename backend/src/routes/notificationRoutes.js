import { Router } from 'express';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification, deleteAllNotifications, streamNotifications } from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/stream', streamNotifications);
router.get('/', getNotifications);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);
router.delete('/', deleteAllNotifications);
router.delete('/:id', deleteNotification);

export default router;
