import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import Vehicle from '../models/Vehicle.js';

/**
 * Get admin dashboard analytics
 * @param {string} period - 'year' | 'month' | 'week'
 */
export const getDashboardAnalytics = async (period = 'year') => {
  // Build date filter based on period
  const now = new Date();
  let dateFrom;
  if (period === 'week') {
    dateFrom = new Date(now);
    dateFrom.setDate(dateFrom.getDate() - 7);
  } else if (period === 'month') {
    dateFrom = new Date(now);
    dateFrom.setDate(dateFrom.getDate() - 30);
  } else {
    // 'year' — current calendar year
    dateFrom = new Date(now.getFullYear(), 0, 1);
  }
  const dateFilter = { createdAt: { $gte: dateFrom } };
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
    vehiclesByCategory,
    topVendorStats,
  ] = await Promise.all([
    // 0: totalUsers
    User.countDocuments({ role: 'user', isActive: true }),
    // 1: totalVendors
    User.countDocuments({ role: 'vendor', isActive: true }),
    // 2: totalVehicles
    Vehicle.countDocuments({ isActive: true }),
    // 3: totalBookings
    Booking.countDocuments({ isActive: true }),

    // 4: revenueStats
    Payment.aggregate([
      { $match: { status: 'captured', ...dateFilter } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]),

    // 5: bookingsByStatus
    Booking.aggregate([
      { $match: { isActive: true, ...dateFilter } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),

    // 6: recentBookings
    Booking.find({ isActive: true })
      .sort('-createdAt')
      .limit(10)
      .populate('user', 'name email avatar')
      .populate('vehicle', 'name brand images')
      .lean(),

    // 7: monthlyRevenue (last 12 months)
    Payment.aggregate([
      { $match: { status: 'captured', ...dateFilter } },
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

    // 8: pendingVehicles
    Vehicle.countDocuments({ status: 'pending', isActive: true }),

    // 9: vehiclesByCategory (for class distribution)
    Vehicle.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),

    // 10: topVendorStats (for top partners) — join from users side so vendors
    //     without bookings still appear, with bookings/revenue defaulting to 0
    User.aggregate([
      { $match: { role: 'vendor', isActive: true } },
      {
        $lookup: {
          from: 'bookings',
          let: { vendorId: '$_id' },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ['$vendor', '$$vendorId'] }, { $eq: ['$isActive', true] }] } } },
            { $group: { _id: null, bookings: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } },
          ],
          as: 'stats',
        },
      },
      { $unwind: { path: '$stats', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          name: 1,
          bookings: { $ifNull: ['$stats.bookings', 0] },
          revenue: { $ifNull: ['$stats.revenue', 0] },
        },
      },
      { $sort: { revenue: -1, bookings: -1 } },
      { $limit: 4 },
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
    vehiclesByCategory: vehiclesByCategory.map(item => ({
      name: (item._id || 'uncategorized').replace(/-/g, ' '),
      count: item.count,
    })),
    topVendors: topVendorStats.map(v => ({
      name: v.name,
      bookings: v.bookings,
      revenue: v.revenue,
    })),
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
