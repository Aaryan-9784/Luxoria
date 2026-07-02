import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyBookings, fetchWishlist } from '@/redux/slices/dashboardSlice';
import { motion } from 'framer-motion';
import { 
  Car, MapPin, Award, Wallet, ArrowRight, 
  Heart, Compass, ShieldCheck, MessageSquare, Star, CalendarDays
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { staggerContainer, staggerItem } from '@/lib/motion';

export default function DashboardOverview() {
  const dispatch = useDispatch();
  const { stats, bookings, wishlist, loading } = useSelector(state => state.dashboard);
  const { user, accessToken } = useSelector(state => state.auth);

  useEffect(() => {
    if (!accessToken) return;
    dispatch(fetchMyBookings());
    dispatch(fetchWishlist());
  }, [dispatch, accessToken]);

  const activeBookings = bookings.filter(b => ['pending', 'confirmed', 'active'].includes(b.status)).slice(0, 3);

  const KPI_DATA = [
    { label: 'Total Spent', value: `$${(stats?.totalSpent || 0).toLocaleString('en-US')}`, icon: Wallet },
    { label: 'Active Bookings', value: stats?.activeBookings || 0, icon: Car },
    { label: 'Saved Vehicles', value: wishlist?.length || 0, icon: Heart },
    { label: 'Loyalty Points', value: stats?.loyaltyPoints || 0, icon: Award },
  ];

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-10">
      
      {/* Header */}
      <div className="mb-2">
        <div>
          <h1 className="text-[28px] font-bold text-[#0F0F0F] tracking-tight mb-1.5" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            Welcome back, {user?.name?.split(' ')[0] || 'Client'}
          </h1>
          <p className="text-[#666666] text-sm font-medium tracking-wide">Manage your luxury rentals and explore new experiences.</p>
        </div>
      </div>

      {/* KPI Widgets */}
      <motion.div variants={staggerItem} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {KPI_DATA.map((kpi, idx) => (
          <div key={idx} className="relative overflow-hidden group bg-white border border-[#ECECEC] rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 cursor-default">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C9A75D] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex flex-col justify-between h-full gap-6">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#0F0F0F] text-[#C9A75D] group-hover:scale-110 transition-transform duration-500 shadow-md">
                  <kpi.icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h3 className="text-[32px] font-bold text-[#0F0F0F] tracking-tight mb-1">{kpi.value}</h3>
                <p className="text-[11px] font-bold text-[#666666] uppercase tracking-[0.15em]">{kpi.label}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content: Current & Upcoming Trips */}
        <motion.div variants={staggerItem} className="lg:col-span-2 bg-white border border-[#ECECEC] rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#0F0F0F]">Current & Upcoming Trips</h3>
            <Link to="/bookings" className="text-[#C9A75D] text-[11px] font-bold uppercase tracking-wider hover:text-[#B59345] transition-colors flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></Link>
          </div>

          <div className="flex-1 flex flex-col">
            {activeBookings.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#F5F5F5]/50 rounded-xl border border-[#ECECEC] border-dashed">
                <Compass className="w-10 h-10 text-[#C9A75D] mb-4 opacity-50" />
                <h3 className="text-lg font-bold text-[#0F0F0F] mb-1">No upcoming trips</h3>
                <p className="text-[13px] text-[#666666] mb-6 max-w-[250px]">Your calendar is clear. Time to plan your next luxury experience.</p>
                <Link to="/vehicles" className="bg-[#0F0F0F] text-white px-6 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-wider hover:bg-[#C9A75D] hover:shadow-lg transition-all">Explore Fleet</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {activeBookings.map((booking) => (
                  <div key={booking._id} className="flex flex-col sm:flex-row gap-5 p-4 rounded-xl border border-[#ECECEC] hover:border-[#C9A75D]/50 transition-all bg-white group hover:shadow-md">
                    <div className="w-full sm:w-32 h-24 rounded-lg overflow-hidden shrink-0 bg-[#F5F5F5]">
                      <img src={booking.vehicle.images[0]?.url} alt={booking.vehicle.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-start mb-1.5">
                        <h4 className="font-bold text-[#0F0F0F] text-base">{booking.vehicle.name}</h4>
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${booking.status === 'confirmed' ? 'bg-[#0F0F0F] text-white' : 'bg-[#C9A75D]/10 text-[#C9A75D]'}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="space-y-1.5 mb-3">
                        <p className="text-[12px] font-medium text-[#666666] flex items-center gap-2">
                          <CalendarDays className="w-3.5 h-3.5 text-[#C9A75D]" />
                          {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                        </p>
                        <p className="text-[12px] font-medium text-[#666666] flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#C9A75D]" />
                          {booking.pickupLocation}
                        </p>
                      </div>
                      <Link to={`/bookings/${booking._id}`} className="text-[#C9A75D] text-[11px] font-bold uppercase tracking-wider hover:text-[#B59345] transition-colors inline-flex w-fit">
                        Manage Booking &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Side Panel: Quick Actions & Status */}
        <motion.div variants={staggerItem} className="lg:col-span-1 space-y-8">
          
          {/* Quick Actions */}
          <div className="bg-white border border-[#ECECEC] rounded-2xl p-6 shadow-sm">
            <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#0F0F0F] mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/vehicles" className="flex flex-col items-center justify-center p-4 rounded-xl border border-[#ECECEC] hover:border-[#C9A75D] hover:bg-[#F5F5F5] transition-all group text-center">
                <Car className="w-5 h-5 text-[#666666] group-hover:text-[#C9A75D] mb-2 transition-colors" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F0F0F]">Browse Fleet</span>
              </Link>
              <Link to="/support" className="flex flex-col items-center justify-center p-4 rounded-xl border border-[#ECECEC] hover:border-[#C9A75D] hover:bg-[#F5F5F5] transition-all group text-center">
                <MessageSquare className="w-5 h-5 text-[#666666] group-hover:text-[#C9A75D] mb-2 transition-colors" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F0F0F]">Contact VIP</span>
              </Link>
              <Link to="/reviews" className="flex flex-col items-center justify-center p-4 rounded-xl border border-[#ECECEC] hover:border-[#C9A75D] hover:bg-[#F5F5F5] transition-all group text-center">
                <Star className="w-5 h-5 text-[#666666] group-hover:text-[#C9A75D] mb-2 transition-colors" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F0F0F]">Leave Review</span>
              </Link>
              <Link to="/verification" className="flex flex-col items-center justify-center p-4 rounded-xl border border-[#ECECEC] hover:border-[#C9A75D] hover:bg-[#F5F5F5] transition-all group text-center">
                <ShieldCheck className="w-5 h-5 text-[#666666] group-hover:text-[#C9A75D] mb-2 transition-colors" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F0F0F]">Verify ID</span>
              </Link>
            </div>
          </div>

          {/* Membership Status */}
          <div className="bg-white border border-[#ECECEC] rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#0F0F0F] mb-6 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#C9A75D]" /> Membership Status
            </h3>
            <div className="space-y-5 relative z-10">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0F0F0F] text-[#C9A75D] flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[12px] font-bold uppercase tracking-wider text-[#0F0F0F] block">Gold Tier</span>
                    <span className="text-[10px] text-[#666666]">Premium Client</span>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-[#C9A75D]">Active</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                  <span className="text-[#666666]">Next Tier: Platinum</span>
                  <span className="text-[#0F0F0F]">{(stats?.loyaltyPoints || 0)} / 5,000 pts</span>
                </div>
                <div className="w-full bg-[#F5F5F5] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#C9A75D] h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(((stats?.loyaltyPoints || 0) / 5000) * 100, 100)}%` }} />
                </div>
              </div>
            </div>
          </div>

        </motion.div>
      </div>

    </motion.div>
  );
}
