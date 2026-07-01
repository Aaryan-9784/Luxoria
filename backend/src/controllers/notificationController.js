import Notification from '../models/Notification.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';

/**
 * @desc    Get notifications
 * @route   GET /api/notifications
 * @access  Protected
 */
export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .sort('-createdAt')
    .limit(50);

  const unreadCount = await Notification.countDocuments({
    recipient: req.user._id,
    isRead: false,
  });

  ApiResponse.success(res, { notifications, unreadCount });
});

/**
 * @desc    Mark notification as read
 * @route   PUT /api/notifications/:id/read
 * @access  Protected
 */
export const markAsRead = asyncHandler(async (req, res) => {
  await Notification.findOneAndUpdate(
    { _id: req.params.id, recipient: req.user._id },
    { isRead: true }
  );

  ApiResponse.success(res, null, 'Marked as read');
});

/**
 * @desc    Mark all as read
 * @route   PUT /api/notifications/read-all
 * @access  Protected
 */
export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, isRead: false },
    { isRead: true }
  );

  ApiResponse.success(res, null, 'All notifications marked as read');
});

/**
 * @desc    Delete a single notification
 * @route   DELETE /api/notifications/:id
 * @access  Protected
 */
export const deleteNotification = asyncHandler(async (req, res) => {
  await Notification.findOneAndDelete({
    _id: req.params.id,
    recipient: req.user._id,
  });

  ApiResponse.success(res, null, 'Notification deleted');
});

/**
 * @desc    Delete all notifications for the current user
 * @route   DELETE /api/notifications
 * @access  Protected
 */
export const deleteAllNotifications = asyncHandler(async (req, res) => {
  await Notification.deleteMany({ recipient: req.user._id });

  ApiResponse.success(res, null, 'All notifications deleted');
});
