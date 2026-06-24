import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import Vehicle from '../models/Vehicle.js';

/**
 * Get admin dashboard analytics
 */
export const getDashboardAnalytics = async () => {
  const [
    totalUsers,
    totalVendors,
    totalVehicles,
    totalBookings,
    revenueStats,
    bookingsByStatus,
    recentBookings,
    monthlyRevenue,
    pendingVehicles,
  ] = await Promise.all([
    User.countDocuments({ role: 'user', isActive: true }),
    User.countDocuments({ role: 'vendor', isActive: true }),
    Vehicle.countDocuments({ isActive: true }),
    Booking.countDocuments({ isActive: true }),
    Vehicle.countDocuments({ status: 'pending', isActive: true }),

    // Total revenue
    Payment.aggregate([
      { $match: { status: 'captured' } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]),

    // Bookings by status
    Booking.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),

    // Recent bookings
    Booking.find({ isActive: true })
      .sort('-createdAt')
      .limit(10)
      .populate('user', 'name email avatar')
      .populate('vehicle', 'name brand images')
      .lean(),

    // Monthly revenue (last 12 months)
    Payment.aggregate([
      { $match: { status: 'captured' } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          revenue: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 },
    ]),
  ]);

  return {
    overview: {
      totalUsers,
      totalVendors,
      totalVehicles,
      pendingVehicles,
      totalBookings,
      totalRevenue: revenueStats[0]?.total || 0,
      totalPayments: revenueStats[0]?.count || 0,
    },
    bookingsByStatus: bookingsByStatus.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
    recentBookings,
    monthlyRevenue: monthlyRevenue.reverse(),
  };
};

/**
 * Get vendor dashboard analytics
 */
export const getVendorAnalytics = async (vendorId) => {
  const [
    totalVehicles,
    activeVehicles,
    totalBookings,
    revenueStats,
    bookingsByStatus,
    recentBookings,
  ] = await Promise.all([
    Vehicle.countDocuments({ vendor: vendorId, isActive: true }),
    Vehicle.countDocuments({ vendor: vendorId, isActive: true, status: 'approved' }),
    Booking.countDocuments({ vendor: vendorId, isActive: true }),

    Payment.aggregate([
      {
        $lookup: {
          from: 'bookings',
          localField: 'booking',
          foreignField: '_id',
          as: 'bookingData',
        },
      },
      { $unwind: '$bookingData' },
      { $match: { 'bookingData.vendor': vendorId, status: 'captured' } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]),

    Booking.aggregate([
      { $match: { vendor: vendorId, isActive: true } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),

    Booking.find({ vendor: vendorId, isActive: true })
      .sort('-createdAt')
      .limit(10)
      .populate('user', 'name email avatar')
      .populate('vehicle', 'name brand images')
      .lean(),
  ]);

  return {
    overview: {
      totalVehicles,
      activeVehicles,
      totalBookings,
      totalRevenue: revenueStats[0]?.total || 0,
    },
    bookingsByStatus: bookingsByStatus.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
    recentBookings,
  };
};
