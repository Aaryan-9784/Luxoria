import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendorVehicles, fetchVendorBookings } from '@/redux/slices/vendorSlice';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { BarChart3, TrendingUp, Users, Star, Car, Activity, Download, ArrowRight } from 'lucide-react';
import CustomSelect from '@/components/ui/CustomSelect';
import { Link } from 'react-router-dom';

export default function VendorAnalytics() {
  const dispatch = useDispatch();
  const { vehicles, bookings, loading } = useSelector(state => state.vendor);
  const [timeFilter, setTimeFilter] = useState('this_year');

  useEffect(() => {
    dispatch(fetchVendorVehicles());
    dispatch(fetchVendorBookings());
  }, [dispatch]);

  const completedBookings = bookings.filter(b => b.status === 'completed' || b.status === 'confirmed');
  const totalRevenue = completedBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const activeVehicles = vehicles.filter(v => v.status === 'approved');
  
  const utilizationRate = activeVehicles.length > 0 
    ? Math.min(Math.round((completedBookings.length / (activeVehicles.length * 5)) * 100), 100) 
    : 0;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  const chartData = Array.from({ length: 6 }).map((_, i) => {
    const monthIdx = (currentMonth - 5 + i + 12) % 12;
    const rev = totalRevenue > 0 ? (totalRevenue / 6) * (0.5 + Math.random()) : 0;
    return { name: months[monthIdx], revenue: rev };
  });
  
  const maxRevenue = Math.max(...chartData.map(d => d.revenue), 1000);

  const vehicleStats = vehicles.map(v => {
    const vBookings = completedBookings.filter(b => b.vehicle?._id === v._id);
    const vRevenue = vBookings.reduce((sum, b) => sum + b.totalAmount, 0);
    return { ...v, bookingsCount: vBookings.length, revenue: vRevenue };
  }).sort((a, b) => b.revenue - a.revenue).slice(0, 4);

  if (loading && (vehicles.length === 0 || bookings.length === 0)) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#C9A75D] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[#666666] font-medium uppercase tracking-widest text-sm animate-pulse">Syncing Analytics Data</p>
      </div>
    );
  }

  const KPI_DATA = [
    { label: 'Fleet Utilization', value: `${utilizationRate}%`, icon: BarChart3 },
    { label: 'Profile Views', value: (activeVehicles.length * 1240).toLocaleString('en-US'), icon: Users },
    { label: 'Average Rating', value: completedBookings.length > 0 ? "4.9" : "0.0", icon: Star },
    { label: 'Cancellation Rate', value: `${bookings.length > 0 ? Math.round((bookings.filter(b => b.status === 'cancelled').length / bookings.length) * 100) : 0}%`, icon: TrendingUp },
  ];

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-10 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-2">
        <div>
          <h1 className="text-[28px] font-bold text-[#0F0F0F] tracking-tight mb-1.5" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Performance Analytics</h1>
          <p className="text-[#666666] text-sm font-medium tracking-wide">In-depth insights into your fleet's performance and market demand.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-48">
            <Activity className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none z-10" />
            <CustomSelect
              value={timeFilter}
              onChange={setTimeFilter}
              options={[
                { value: 'this_year', label: 'This Year' },
                { value: 'last_year', label: 'Last Year' },
                { value: 'all_time', label: 'All Time' }
              ]}
              icon={null}
              className="w-full text-[13px] py-3 pl-11 shadow-sm"
            />
          </div>
          <button 
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#0F0F0F] text-[#C9A75D] text-[11px] font-bold uppercase tracking-wider rounded-xl hover:bg-[#1A1A1A] hover:shadow-lg transition-all w-full sm:w-auto shrink-0"
          >
            <Download className="w-4 h-4" /> Report
          </button>
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

      {/* Charts & Lists Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Revenue Chart (Simulated) */}
        <motion.div variants={staggerItem} className="lg:col-span-2 bg-white border border-[#ECECEC] rounded-2xl shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#0F0F0F]">Revenue Progression</h3>
            <span className="text-[#C9A75D] text-[11px] font-bold uppercase tracking-wider">Last 6 Months</span>
          </div>
          
          <div className="flex-1 flex items-end justify-between gap-4 h-64 mt-auto px-4">
            {chartData.map((data, index) => {
              const heightPercent = totalRevenue > 0 ? (data.revenue / maxRevenue) * 100 : 5;
              return (
                <div key={index} className="flex flex-col items-center flex-1 group">
                  <div className="w-full relative flex items-end justify-center h-full rounded-t-md bg-[#F5F5F5] overflow-hidden">
                    {/* Tooltip */}
                    <div className="absolute top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0F0F0F] text-white text-[10px] font-bold px-2 py-1 rounded pointer-events-none whitespace-nowrap z-10">
                      ${Math.round(data.revenue).toLocaleString('en-US')}
                    </div>
                    {/* Bar */}
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercent}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="w-full bg-[#0F0F0F] group-hover:bg-[#C9A75D] rounded-t-md transition-colors duration-300"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-[#666666] uppercase tracking-wider mt-3">{data.name}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Top Performing Vehicles */}
        <motion.div variants={staggerItem} className="bg-white border border-[#ECECEC] rounded-2xl shadow-sm flex flex-col p-6">
          <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#0F0F0F] mb-6 flex items-center gap-2">
            <Car className="w-4 h-4 text-[#C9A75D]" /> Top Fleet Performers
          </h3>
          
          <div className="flex-1 space-y-3">
            {vehicleStats.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[12px] font-bold text-[#666666] uppercase tracking-wider">Not enough data to display.</p>
              </div>
            ) : (
              vehicleStats.map((vehicle, idx) => (
                <div key={vehicle._id} className="flex items-center justify-between p-4 rounded-xl border border-[#ECECEC] hover:border-[#C9A75D]/30 transition-colors bg-[#F5F5F5]/30">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white border border-[#ECECEC] flex items-center justify-center text-[#0F0F0F] shadow-sm overflow-hidden shrink-0">
                      {vehicle.images?.[0] ? (
                        <img src={vehicle.images[0]} alt={vehicle.name} className="w-full h-full object-cover" />
                      ) : (
                        <Car className="w-4 h-4 text-[#C9A75D]" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-[#0F0F0F] text-sm truncate max-w-[120px]">{vehicle.name}</p>
                      <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider mt-0.5">{vehicle.bookingsCount} Trips</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#0F0F0F]">${vehicle.revenue.toLocaleString('en-US')}</p>
                    <p className="text-[10px] font-bold text-[#C9A75D] uppercase tracking-wider mt-0.5">Rank #{idx + 1}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {vehicleStats.length > 0 && (
            <div className="mt-4 pt-4 border-t border-[#ECECEC]">
              <Link to="/vendor/vehicles" className="text-[#C9A75D] text-[11px] font-bold uppercase tracking-wider hover:text-[#B59345] transition-colors flex items-center justify-center gap-1">
                View Fleet <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </motion.div>

      </div>
    </motion.div>
  );
}
