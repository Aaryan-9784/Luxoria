import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnalytics, fetchAdminBookings } from '@/redux/slices/adminSlice';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { Users, Building2, Car, Wallet, TrendingUp, AlertCircle, CalendarDays, ArrowRight, ShieldCheck, Activity, Database, Server } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminOverview() {
  const dispatch = useDispatch();
  const { analytics, bookings, loading } = useSelector(state => state.admin);

  useEffect(() => {
    dispatch(fetchAnalytics());
    dispatch(fetchAdminBookings('?limit=5&sort=-createdAt'));
  }, [dispatch]);

  if (loading || !analytics) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-secondary font-medium uppercase tracking-widest text-sm animate-pulse">Syncing Enterprise Data</p>
      </div>
    );
  }

  const KPI_DATA = [
    { label: 'Total Revenue', value: `$${(analytics?.overview?.totalRevenue || 0).toLocaleString('en-US')}`, icon: Wallet },
    { label: 'Total Users', value: analytics?.overview?.totalUsers || 0, icon: Users },
    { label: 'Active Vendors', value: analytics?.overview?.totalVendors || 0, icon: Building2 },
    { label: 'Total Fleet', value: analytics?.overview?.totalVehicles || 0, icon: Car },
  ];

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-10">
      
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-[28px] font-bold text-[#0F0F0F] tracking-tight mb-1.5" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>System Overview</h1>
        <p className="text-[#666666] text-sm font-medium tracking-wide">Real-time enterprise analytics and platform health.</p>
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
        
        {/* Action Center */}
        <motion.div variants={staggerItem} className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-[#ECECEC] rounded-2xl p-6 shadow-sm">
            <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#0F0F0F] mb-6 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#C9A75D]" /> Action Items
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-xl border border-[#ECECEC] bg-[#F5F5F5]/50 transition-all hover:bg-white hover:border-[#C9A75D]/50 hover:shadow-md group">
                <div>
                  <p className="font-bold text-xl text-[#0F0F0F]">{analytics?.overview?.pendingVehicles || 0}</p>
                  <p className="text-[10px] text-[#666666] font-bold uppercase tracking-[0.1em] mt-1">Pending Vehicles</p>
                </div>
                <Link to="/admin/fleet-approvals" className="text-[#C9A75D] text-[11px] font-bold uppercase tracking-wider group-hover:text-[#B59345] transition-colors flex items-center gap-1">Review <span className="text-[14px] leading-none">&rarr;</span></Link>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-xl border border-[#ECECEC] bg-[#F5F5F5]/50 transition-all hover:bg-white hover:border-[#C9A75D]/50 hover:shadow-md group">
                <div>
                  <p className="font-bold text-xl text-[#0F0F0F]">{analytics?.bookingsByStatus?.pending || 0}</p>
                  <p className="text-[10px] text-[#666666] font-bold uppercase tracking-[0.1em] mt-1">Pending Bookings</p>
                </div>
                <Link to="/admin/bookings" className="text-[#C9A75D] text-[11px] font-bold uppercase tracking-wider group-hover:text-[#B59345] transition-colors flex items-center gap-1">View <span className="text-[14px] leading-none">&rarr;</span></Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Booking Distribution */}
        <motion.div variants={staggerItem} className="lg:col-span-2 bg-white border border-[#ECECEC] rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#0F0F0F]">Booking Distribution</h3>
          </div>
          
          <div className="flex-1 flex flex-col justify-center gap-8 px-2">
            <div className="space-y-3">
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
                <span className="text-[#666666]">Completed</span>
                <span className="text-[#0F0F0F] text-sm">{analytics?.bookingsByStatus?.completed || 0}</span>
              </div>
              <div className="w-full bg-[#F5F5F5] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#16A34A] h-full rounded-full transition-all duration-1000 relative" style={{ width: `${((analytics?.bookingsByStatus?.completed || 0) / (analytics?.overview?.totalBookings || 1)) * 100}%` }} />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
                <span className="text-[#666666]">Confirmed</span>
                <span className="text-[#0F0F0F] text-sm">{analytics?.bookingsByStatus?.confirmed || 0}</span>
              </div>
              <div className="w-full bg-[#F5F5F5] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#0F0F0F] h-full rounded-full transition-all duration-1000" style={{ width: `${((analytics?.bookingsByStatus?.confirmed || 0) / (analytics?.overview?.totalBookings || 1)) * 100}%` }} />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
                <span className="text-[#666666]">Cancelled</span>
                <span className="text-[#0F0F0F] text-sm">{analytics?.bookingsByStatus?.cancelled || 0}</span>
              </div>
              <div className="w-full bg-[#F5F5F5] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#DC2626] h-full rounded-full transition-all duration-1000" style={{ width: `${((analytics?.bookingsByStatus?.cancelled || 0) / (analytics?.overview?.totalBookings || 1)) * 100}%` }} />
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Row 3: Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Activity / Bookings */}
        <motion.div variants={staggerItem} className="lg:col-span-2 bg-white border border-[#ECECEC] rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#0F0F0F]">Recent Bookings</h3>
            <Link to="/admin/bookings" className="text-[#C9A75D] text-[11px] font-bold uppercase tracking-wider hover:text-[#B59345] transition-colors flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></Link>
          </div>
          
          <div className="space-y-3">
            {bookings && bookings.length > 0 ? (
              bookings.slice(0, 5).map((booking, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-[#ECECEC] hover:border-[#C9A75D]/30 transition-colors bg-[#F5F5F5]/30">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white border border-[#ECECEC] flex items-center justify-center text-[#0F0F0F] shadow-sm">
                      <CalendarDays className="w-4 h-4 text-[#C9A75D]" />
                    </div>
                    <div>
                      <p className="font-bold text-[#0F0F0F] text-sm">{booking.vehicle?.make} {booking.vehicle?.model}</p>
                      <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider mt-0.5">{new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#0F0F0F]">${booking.totalPrice?.toLocaleString()}</p>
                    <p className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${booking.status === 'completed' ? 'text-[#16A34A]' : booking.status === 'pending' ? 'text-[#C9A75D]' : 'text-[#666666]'}`}>{booking.status}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-[12px] font-bold text-[#666666] uppercase tracking-wider">No recent bookings found.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* System Health & Quick Actions */}
        <motion.div variants={staggerItem} className="lg:col-span-1 space-y-8">
          
          {/* Quick Actions */}
          <div className="bg-white border border-[#ECECEC] rounded-2xl p-6 shadow-sm">
            <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#0F0F0F] mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/admin/vendors" className="flex flex-col items-center justify-center p-4 rounded-xl border border-[#ECECEC] hover:border-[#C9A75D] hover:bg-[#F5F5F5] transition-all group text-center">
                <ShieldCheck className="w-5 h-5 text-[#666666] group-hover:text-[#C9A75D] mb-2 transition-colors" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F0F0F]">Verify Vendors</span>
              </Link>
              <Link to="/admin/fleet-approvals" className="flex flex-col items-center justify-center p-4 rounded-xl border border-[#ECECEC] hover:border-[#C9A75D] hover:bg-[#F5F5F5] transition-all group text-center">
                <Car className="w-5 h-5 text-[#666666] group-hover:text-[#C9A75D] mb-2 transition-colors" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F0F0F]">Fleet Approvals</span>
              </Link>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white border border-[#ECECEC] rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#0F0F0F] mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#C9A75D]" /> System Health
            </h3>
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Server className="w-4 h-4 text-[#666666]" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F0F0F]">Core API</span>
                </div>
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#16A34A]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse"></span> Operational
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Database className="w-4 h-4 text-[#666666]" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F0F0F]">Database</span>
                </div>
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#16A34A]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse"></span> Latency 12ms
                </span>
              </div>
            </div>
          </div>

        </motion.div>
      </div>

    </motion.div>
  );
}
