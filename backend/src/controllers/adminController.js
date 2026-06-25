import User from '../models/User.js';
import Vehicle from '../models/Vehicle.js';
import Booking from '../models/Booking.js';
import Notification from '../models/Notification.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiFeatures from '../utils/apiFeatures.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { getDashboardAnalytics } from '../services/analyticsService.js';

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Admin
 */
export const getUsers = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

  const totalCount = await User.countDocuments(filter);
  const features = new ApiFeatures(User.find(filter), req.query)
    .search(['name', 'email'])
    .sort()
    .paginate();
  features.totalCount = totalCount;

  const users = await features.query;

  ApiResponse.paginated(res, users, features.getPagination());
});

/**
 * @desc    Update user status
 * @route   PUT /api/admin/users/:id/status
 * @access  Admin
 */
export const updateUserStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive },
    { new: true }
  );

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  ApiResponse.success(res, { user }, `User ${isActive ? 'activated' : 'deactivated'}`);
});

/**
 * @desc    Get all vendors (pending/approved)
 * @route   GET /api/admin/vendors
 * @access  Admin
 */
export const getVendors = asyncHandler(async (req, res) => {
  const filter = { role: 'vendor' };
  if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

  const totalCount = await User.countDocuments(filter);
  const features = new ApiFeatures(User.find(filter), req.query)
    .search(['name', 'email'])
    .sort()
    .paginate();
  features.totalCount = totalCount;

  const vendors = await features.query;

  ApiResponse.paginated(res, vendors, features.getPagination());
});

/**
 * @desc    Approve/reject vendor
 * @route   PUT /api/admin/vendors/:id/approve
 * @access  Admin
 */
export const approveVendor = asyncHandler(async (req, res) => {
  const { isVerified } = req.body;

  const vendor = await User.findOneAndUpdate(
    { _id: req.params.id, role: 'vendor' },
    { isVerified },
    { new: true }
  );

  if (!vendor) {
    throw ApiError.notFound('Vendor not found');
  }

  await Notification.create({
    recipient: vendor._id,
    type: 'approval',
    title: isVerified ? 'Account Approved' : 'Account Rejected',
    message: isVerified
      ? 'Your vendor account has been approved! You can now list vehicles.'
      : 'Your vendor account has been rejected. Please contact support.',
  });

  ApiResponse.success(res, { vendor }, `Vendor ${isVerified ? 'approved' : 'rejected'}`);
});

/**
 * @desc    Get all vehicles (admin)
 * @route   GET /api/admin/vehicles
 * @access  Admin
 */
export const getAllVehicles = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

  const totalCount = await Vehicle.countDocuments(filter);
  const features = new ApiFeatures(Vehicle.find(filter), req.query)
    .search(['name', 'brand'])
    .sort()
    .paginate();
  features.totalCount = totalCount;

  const vehicles = await features.query.populate('vendor', 'name email avatar');

  ApiResponse.paginated(res, vehicles, features.getPagination());
});

/**
 * @desc    Approve/reject vehicle
 * @route   PUT /api/admin/vehicles/:id/approve
 * @access  Admin
 */
export const approveVehicle = asyncHandler(async (req, res) => {
  const { status } = req.body; // 'approved' or 'rejected'

  const vehicle = await Vehicle.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  ).populate('vendor', 'name');

  if (!vehicle) {
    throw ApiError.notFound('Vehicle not found');
  }

  if (vehicle.vendor) {
    await Notification.create({
      recipient: vehicle.vendor._id,
      type: 'approval',
      title: `Vehicle ${status === 'approved' ? 'Approved' : 'Rejected'}`,
      message: `Your vehicle "${vehicle.name}" has been ${status}.`,
      data: { vehicleId: vehicle._id },
    });
  }

  ApiResponse.success(res, { vehicle }, `Vehicle ${status}`);
});

/**
 * @desc    Get all bookings (admin)
 * @route   GET /api/admin/bookings
 * @access  Admin
 */
export const getAllBookings = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const totalCount = await Booking.countDocuments(filter);
  const features = new ApiFeatures(Booking.find(filter), req.query)
    .sort()
    .paginate();
  features.totalCount = totalCount;

  const bookings = await features.query
    .populate('user', 'name email avatar')
    .populate('vehicle', 'name brand images')
    .populate('vendor', 'name email');

  ApiResponse.paginated(res, bookings, features.getPagination());
});

/**
 * @desc    Get analytics dashboard
 * @route   GET /api/admin/analytics
 * @access  Admin
 */
export const getAnalytics = asyncHandler(async (req, res) => {
  const analytics = await getDashboardAnalytics();
  ApiResponse.success(res, { analytics });
});

export const deleteAdminVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
  if (!vehicle) {
    throw ApiError.notFound('Vehicle not found');
  }
  ApiResponse.success(res, null, 'Vehicle deleted successfully');
});

/**
 * @desc    Get all concierge requests
 * @route   GET /api/admin/concierge
 * @access  Admin
 */
export const getConciergeRequests = asyncHandler(async (req, res) => {
  const { status, search } = req.query;

  let query = {};

  if (status && status !== 'all') {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { clientName: { $regex: search, $options: 'i' } },
      { requestId: { $regex: search, $options: 'i' } },
    ];
  }

  const { default: ConciergeRequest } = await import('../models/ConciergeRequest.js');

  const requests = await ConciergeRequest.find(query).sort({ createdAt: -1 });
  
  // Create pagination object structure if needed by frontend
  const pagination = {
    total: requests.length,
    page: 1,
    pages: 1,
    limit: requests.length || 10
  };

  // We must return what adminSlice expects. The other routes use ApiResponse.paginated or ApiResponse.success
  // The fetchConcierge thunk will expect response.data.data
  res.status(200).json({
    success: true,
    data: requests,
    pagination
  });
});

/**
 * @desc    Update concierge request status
 * @route   PUT /api/admin/concierge/:id/status
 * @access  Admin
 */
export const updateConciergeStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!['pending', 'in-progress', 'completed'].includes(status)) {
    throw ApiError.badRequest('Invalid status value');
  }

  const { default: ConciergeRequest } = await import('../models/ConciergeRequest.js');

  const request = await ConciergeRequest.findOneAndUpdate(
    { requestId: req.params.id },
    { status },
    { new: true, runValidators: true }
  );

  if (!request) {
    throw ApiError.notFound(`Request not found with id of ${req.params.id}`);
  }

  ApiResponse.success(res, { request }, `Request status updated to ${status}`);
});