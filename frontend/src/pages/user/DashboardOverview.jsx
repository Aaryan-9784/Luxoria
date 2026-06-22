import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyBookings, fetchWishlist } from '@/redux/slices/dashboardSlice';
import { motion } from 'framer-motion';
import { Car, MapPin, CalendarDays, Award, Wallet, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { staggerContainer, staggerItem } from '@/lib/motion';

export default function DashboardOverview() {
  const dispatch = useDispatch();
  const { stats, bookings, loading } = useSelector(state => state.dashboard);

  useEffect(() => {
    dispatch(fetchMyBookings());
    dispatch(fetchWishlist());
  }, [dispatch]);

  const activeBookings = bookings.filter(b => ['pending', 'confirmed', 'active'].includes(b.status)).slice(0, 3);

  if (loading) {
    return <div className="animate-pulse text-secondary text-body-sm">Loading dashboard...</div>;
  }

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-10">
      
      {/* KPI Widgets */}
      <motion.div variants={staggerItem} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-stat relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-gold-subtle rounded-full group-hover:scale-150 transition-transform duration-700" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-caption text-secondary uppercase tracking-wider mb-2">Total Spent</p>
              <h3 className="text-h3 text-primary">${stats?.totalSpent?.toLocaleString('en-US') || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
              <Wallet className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="card-stat relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-gold-subtle rounded-full group-hover:scale-150 transition-transform duration-700" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-caption text-secondary uppercase tracking-wider mb-2">Active Bookings</p>
              <h3 className="text-h3 text-primary">{stats?.activeBookings || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
              <Car className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="card-stat relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-gold-subtle rounded-full group-hover:scale-150 transition-transform duration-700" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-caption text-secondary uppercase tracking-wider mb-2">Loyalty Points</p>
              <h3 className="text-h3 text-primary">{stats?.loyaltyPoints || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Active Trips Section */}
      <motion.div variants={staggerItem}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-h4 text-primary">Current & Upcoming Trips</h2>
          <Link to="/bookings" className="text-body-sm font-semibold text-accent hover:text-accent-hover transition-colors flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {activeBookings.length === 0 ? (
          <div className="matte-surface p-10 text-center flex flex-col items-center justify-center">
            <Car className="w-12 h-12 text-muted mb-4" />
            <h3 className="text-h4 text-primary mb-2">No upcoming trips</h3>
            <p className="text-body-sm text-secondary mb-6">Your calendar is clear. Time to plan your next luxury experience.</p>
            <Link to="/vehicles" className="btn btn-primary">Explore Fleet</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeBookings.map((booking) => (
              <div key={booking._id} className="card-lift flex flex-col sm:flex-row gap-6 p-4">
                <div className="w-full sm:w-40 h-32 rounded-xl overflow-hidden shrink-0">
                  <img src={booking.vehicle.images[0]?.url} alt={booking.vehicle.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-h4 text-primary">{booking.vehicle.name}</h4>
                    <span className="badge badge-accent">
                      {booking.status}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-body-sm text-secondary flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-muted" />
                      {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-body-sm text-secondary flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted" />
                      {booking.pickupLocation}
                    </p>
                  </div>
                  <Link to={`/bookings/${booking._id}`} className="text-caption font-semibold text-accent uppercase tracking-wider hover:text-accent-hover transition-colors">
                    Manage Booking &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

    </motion.div>
  );
}
