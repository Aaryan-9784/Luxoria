import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendorVehicles, fetchVendorBookings } from '@/redux/slices/vendorSlice';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { Car, Wallet, ArrowRight, AlertCircle, BarChart3, CalendarDays, PlusCircle, CheckCircle2, LayoutGrid, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import CustomSelect from '@/components/ui/CustomSelect';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function VendorOverview() {
  const dispatch = useDispatch();
  const { stats, bookings, loading } = useSelector(state => state.vendor);
  const [timeFilter, setTimeFilter] = useState('This Month');

  useEffect(() => {
    dispatch(fetchVendorVehicles());
    dispatch(fetchVendorBookings());
  }, [dispatch]);

  const recentRequests = bookings.filter(b => b.status === 'pending');

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#C9A75D] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[#666666] font-bold uppercase tracking-widest text-[11px] animate-pulse">Syncing Partner Data</p>
      </div>
    );
  }

  const KPI_DATA = [
    { label: 'Total Revenue', value: `$${(stats?.totalRevenue || 0).toLocaleString('en-US')}`, icon: Wallet },
    { label: 'Active Rentals', value: stats?.activeRentals || 0, icon: Car },
    { label: 'Total Fleet', value: stats?.totalVehicles || 0, icon: LayoutGrid },
    { label: 'Pending Approvals', value: stats?.pendingApprovals || 0, icon: AlertCircle },
  ];

  const generateChartData = () => {
    // Generate dummy data based on timeFilter for demonstration
    const data = [];
    const points = timeFilter === 'This Year' ? 12 : timeFilter === 'Last 3 Months' ? 12 : 30;
    const labelPrefix = timeFilter === 'This Year' ? 'Month ' : timeFilter === 'Last 3 Months' ? 'Week ' : 'Day ';
    
    let baseValue = 500;
    for (let i = 1; i <= points; i++) {
      baseValue = Math.max(100, baseValue + (Math.random() * 400 - 150));
      data.push({
        name: `${labelPrefix}${i}`,
        revenue: Math.floor(baseValue)
      });
    }
    return data;
  };
  const chartData = generateChartData();

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-10">
      
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-[28px] font-bold text-[#0F0F0F] tracking-tight mb-1.5" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Performance Overview</h1>
        <p className="text-[#666666] text-sm font-medium tracking-wide">Monitor your fleet performance and incoming reservations.</p>
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
          <div className="bg-white border border-[#ECECEC] rounded-2xl p-6 shadow-sm h-full">
            <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#0F0F0F] mb-6 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#C9A75D]" /> Action Items
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-xl border border-[#ECECEC] bg-[#F5F5F5]/50 transition-all hover:bg-white hover:border-[#C9A75D]/50 hover:shadow-md group">
                <div>
                  <p className="font-bold text-xl text-[#0F0F0F]">{recentRequests.length}</p>
                  <p className="text-[10px] text-[#666666] font-bold uppercase tracking-[0.1em] mt-1">Pending Requests</p>
                </div>
                <Link to="/vendor/bookings" className="text-[#C9A75D] text-[11px] font-bold uppercase tracking-wider group-hover:text-[#B59345] transition-colors flex items-center gap-1">Review <span className="text-[14px] leading-none">&rarr;</span></Link>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-xl border border-[#ECECEC] bg-[#F5F5F5]/50 transition-all hover:bg-white hover:border-[#C9A75D]/50 hover:shadow-md group">
                <div>
                  <p className="font-bold text-xl text-[#0F0F0F]">{stats?.pendingApprovals || 0}</p>
                  <p className="text-[10px] text-[#666666] font-bold uppercase tracking-[0.1em] mt-1">Vehicles in Review</p>
                </div>
                <Link to="/vendor/vehicles" className="text-[#C9A75D] text-[11px] font-bold uppercase tracking-wider group-hover:text-[#B59345] transition-colors flex items-center gap-1">View <span className="text-[14px] leading-none">&rarr;</span></Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Revenue Trends Placeholder */}
        <motion.div variants={staggerItem} className="lg:col-span-2 bg-white border border-[#ECECEC] rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#0F0F0F]">Revenue Trends</h3>
            <CustomSelect
              value={timeFilter}
              onChange={setTimeFilter}
              options={[
                { value: 'This Month', label: 'This Month' },
                { value: 'Last 3 Months', label: 'Last 3 Months' },
                { value: 'This Year', label: 'This Year' }
              ]}
              icon={null}
              className="bg-[#F5F5F5] py-2 px-3"
            />
          </div>
          
          <div className="flex-1 min-h-[250px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A75D" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#C9A75D" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ECECEC" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 'bold' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 'bold' }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F0F0F', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#C9A75D', fontWeight: 'bold' }}
                  labelStyle={{ color: '#9CA3AF', marginBottom: '4px', fontSize: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#C9A75D" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>

      {/* Row 3: Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Bookings */}
        <motion.div variants={staggerItem} className="lg:col-span-2 bg-white border border-[#ECECEC] rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#0F0F0F]">Recent Bookings</h3>
            <Link to="/vendor/bookings" className="text-[#C9A75D] text-[11px] font-bold uppercase tracking-wider hover:text-[#B59345] transition-colors flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></Link>
          </div>
          
          <div className="space-y-3">
            {bookings && bookings.length > 0 ? (
              bookings.slice(0, 5).map((booking, idx) => (
                <div key={booking._id || idx} className="flex items-center justify-between p-4 rounded-xl border border-[#ECECEC] hover:border-[#C9A75D]/30 transition-colors bg-[#F5F5F5]/30">
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

        {/* Quick Actions */}
        <motion.div variants={staggerItem} className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-[#ECECEC] rounded-2xl p-6 shadow-sm h-full">
            <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#0F0F0F] mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/vendor/add-vehicle" className="flex flex-col items-center justify-center p-5 rounded-xl border border-[#ECECEC] hover:border-[#C9A75D] hover:bg-[#F5F5F5] transition-all group text-center">
                <PlusCircle className="w-6 h-6 text-[#666666] group-hover:text-[#C9A75D] mb-3 transition-colors" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F0F0F]">Add Vehicle</span>
              </Link>
              <Link to="/vendor/vehicles" className="flex flex-col items-center justify-center p-5 rounded-xl border border-[#ECECEC] hover:border-[#C9A75D] hover:bg-[#F5F5F5] transition-all group text-center">
                <Car className="w-6 h-6 text-[#666666] group-hover:text-[#C9A75D] mb-3 transition-colors" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F0F0F]">Manage Fleet</span>
              </Link>
              <Link to="/vendor/bookings" className="flex flex-col items-center justify-center p-5 rounded-xl border border-[#ECECEC] hover:border-[#C9A75D] hover:bg-[#F5F5F5] transition-all group text-center">
                <CheckCircle2 className="w-6 h-6 text-[#666666] group-hover:text-[#C9A75D] mb-3 transition-colors" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F0F0F]">Approvals</span>
              </Link>
              <Link to="/vendor/availability" className="flex flex-col items-center justify-center p-5 rounded-xl border border-[#ECECEC] hover:border-[#C9A75D] hover:bg-[#F5F5F5] transition-all group text-center">
                <Clock className="w-6 h-6 text-[#666666] group-hover:text-[#C9A75D] mb-3 transition-colors" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F0F0F]">Availability</span>
              </Link>
            </div>
          </div>
        </motion.div>

      </div>

    </motion.div>
  );
}
