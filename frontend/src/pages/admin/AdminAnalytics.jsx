import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnalytics, fetchAdminVehicles, fetchAdminBookings } from '@/redux/slices/adminSlice';
import { motion } from 'framer-motion';
import { Users, Car, DollarSign, Calendar, ArrowUpRight, ArrowDownRight, Activity, Download, ChevronDown } from 'lucide-react';
import CountUp from 'react-countup';
import CustomSelect from '@/components/ui/CustomSelect';

export default function AdminAnalytics() {
  const dispatch = useDispatch();
  const { analytics, vehicles, bookings, loading } = useSelector(state => state.admin);
  const [dateRange, setDateRange] = useState('year'); // year, month, week

  useEffect(() => {
    dispatch(fetchAnalytics());
    dispatch(fetchAdminVehicles());
    dispatch(fetchAdminBookings());
  }, [dispatch]);
  const kpis = {
    revenue: analytics?.overview?.totalRevenue || 0,
    bookings: analytics?.overview?.totalBookings || 0,
    activeUsers: analytics?.overview?.totalUsers || 0,
    vendors: analytics?.overview?.totalVendors || 0
  };

  const revenueData = useMemo(() => {
    if (!analytics?.monthlyRevenue?.length) {
      // Default 12 months of 0 if no data
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months.map(m => ({ month: m, value: 0 }));
    }
    
    // Map backend response
    const mapped = analytics.monthlyRevenue.map(item => {
      const monthStr = new Date(0, item._id.month - 1).toLocaleString('default', { month: 'short' });
      return {
        month: monthStr,
        value: item.revenue
      };
    });
    
    // Ensure we have 12 items for chart layout if possible
    if (mapped.length < 12) {
       const missing = 12 - mapped.length;
       for (let i = 0; i < missing; i++) {
         mapped.push({ month: '-', value: 0 });
       }
    }
    return mapped;
  }, [analytics]);

  const vehicleClasses = useMemo(() => {
    if (!vehicles.length) return [];
    const counts = vehicles.reduce((acc, v) => {
      acc[v.category] = (acc[v.category] || 0) + 1;
      return acc;
    }, {});
    
    const colors = ['#0F0F0F', '#C9A75D', '#666666', '#ECECEC', '#8B5A2B', '#A9A9A9', '#D3D3D3'];
    return Object.entries(counts).map(([name, count], idx) => ({
      name: name.replace('-', ' '),
      percentage: Math.round((count / vehicles.length) * 100),
      color: colors[idx % colors.length]
    })).sort((a,b) => b.percentage - a.percentage);
  }, [vehicles]);

  const topVendors = useMemo(() => {
    if (!bookings.length) return [];
    
    const vendorStats = bookings.reduce((acc, b) => {
      if (b.vendor && b.vendor.name) {
        if (!acc[b.vendor.name]) acc[b.vendor.name] = { name: b.vendor.name, bookings: 0, revenue: 0 };
        acc[b.vendor.name].bookings += 1;
        acc[b.vendor.name].revenue += b.totalAmount || 0;
      }
      return acc;
    }, {});
    
    return Object.values(vendorStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 4)
      .map(v => ({ ...v, trend: '+0%' })); // Static trend for now
  }, [bookings]);

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  // Find max revenue for chart scaling, ensure it's not 0
  const maxRevenue = Math.max(...revenueData.map(d => d.value), 1000); // Default scale to 1000 if 0

  const points = revenueData.map((d, i) => {
    const x = (i / (revenueData.length - 1)) * 100;
    const y = 100 - (d.value / maxRevenue) * 95;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,100 ${points} 100,100`;

  const handleExport = () => {
    // Mock export functionality
    const csvContent = "data:text/csv;charset=utf-8,Month,Revenue\\n" 
      + revenueData.map(d => `${d.month},${d.value}`).join("\\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "luxoria_analytics_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-[#0F0F0F] tracking-tight mb-2">Platform Analytics</h1>
          <p className="text-[13px] text-[#666666] tracking-wide">Enterprise performance metrics and global insights.</p>
        </div>
        <div className="flex items-center gap-3">
          <CustomSelect
            value={dateRange}
            onChange={(val) => setDateRange(val)}
            icon={ChevronDown}
            options={[
              { value: 'year', label: '2026 Fiscal Year' },
              { value: 'month', label: 'Last 30 Days' },
              { value: 'week', label: 'Last 7 Days' }
            ]}
          />
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 bg-[#0F0F0F] text-white px-5 py-2.5 rounded-xl text-[12px] font-bold uppercase tracking-wider hover:bg-[#C9A75D] transition-colors shadow-lg shadow-[#0F0F0F]/10"
          >
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Revenue', value: kpis.revenue, icon: DollarSign, prefix: '$', trend: '', isUp: true },
          { title: 'Global Bookings', value: kpis.bookings, icon: Calendar, prefix: '', trend: '', isUp: true },
          { title: 'Active Clients', value: kpis.activeUsers, icon: Users, prefix: '', trend: '', isUp: true },
          { title: 'Vendor Partners', value: kpis.vendors, icon: Car, prefix: '', trend: '', isUp: false },
        ].map((kpi, idx) => (
          <div key={idx} className="relative overflow-hidden group bg-white border border-[#ECECEC] rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 cursor-default flex flex-col justify-between h-full min-h-[160px]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C9A75D] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#0F0F0F] text-[#C9A75D] group-hover:scale-110 transition-transform duration-500 shadow-md">
                <kpi.icon className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${kpi.isUp ? 'bg-[#16A34A]/10 text-[#16A34A]' : 'bg-[#DC2626]/10 text-[#DC2626]'}`}>
                {kpi.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {kpi.trend}
              </div>
            </div>
            
            <div className="relative z-10 mt-auto">
              <h3 className="text-[32px] font-bold text-[#0F0F0F] tracking-tight mb-1">
                {kpi.prefix}<CountUp end={kpi.value} duration={2} separator="," />
              </h3>
              <p className="text-[11px] font-bold text-[#666666] uppercase tracking-[0.15em]">{kpi.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white border border-[#ECECEC] rounded-2xl p-8 shadow-sm flex flex-col min-w-0 overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-serif text-[#0F0F0F]">Revenue Growth</h3>
            <div className="flex items-center gap-2 text-[11px] font-bold text-[#666666] uppercase tracking-wider">
              <Activity className="w-4 h-4 text-[#C9A75D]" /> Performance
            </div>
          </div>

          {/* Enhanced SVG Chart */}
          <div className="flex-1 min-h-[300px] flex flex-col relative w-full pt-10">
            {loading && <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-30 flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#C9A75D] border-t-transparent rounded-full animate-spin" /></div>}
            
            {/* Y-axis Grid Lines */}
            <div className="absolute top-10 bottom-8 left-0 right-0 flex flex-col justify-between pointer-events-none">
              {[4,3,2,1,0].map((step, i) => (
                <div key={i} className="w-full border-t border-dashed border-[#ECECEC] flex items-center h-0 relative">
                  <span className="absolute -top-2.5 bg-white pr-2 text-[9px] text-[#999999] font-medium hidden sm:block z-10">
                    {formatCurrency((maxRevenue * step) / 4)}
                  </span>
                </div>
              ))}
            </div>

            {/* SVG Graph */}
            <div className="relative w-full flex-1 mb-8 mt-2">
              <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C9A75D" stopOpacity={0.3}/>
                    <stop offset="100%" stopColor="#C9A75D" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <polygon points={areaPoints} fill="url(#colorRevenue)" />
                <polyline points={points} fill="none" stroke="#C9A75D" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              </svg>
              
              {/* Interaction Overlay */}
              <div className="absolute inset-0">
                {revenueData.map((month, idx) => {
                  const xPercent = (idx / (revenueData.length - 1)) * 100;
                  const yPercent = 100 - (month.value / maxRevenue) * 95;
                  return (
                    <div key={idx} className="absolute top-0 bottom-0 w-8 -ml-4 group cursor-crosshair z-20" style={{ left: `${xPercent}%` }}>
                       {/* Hover Guide Line */}
                       <div className="absolute top-0 bottom-0 left-1/2 -ml-[0.5px] w-[1px] bg-[#0F0F0F] opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />
                       
                       {/* Dot */}
                       <div className="absolute w-3 h-3 bg-white border-2 border-[#C9A75D] rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-1/2 -translate-y-1/2 shadow-md pointer-events-none"
                            style={{ left: '50%', top: `${yPercent}%` }} />
                            
                       {/* Tooltip */}
                       <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-[#0F0F0F] text-white text-[10px] font-bold py-1.5 px-3 rounded-lg pointer-events-none shadow-lg transform -translate-x-1/2 -translate-y-[calc(100%+12px)] whitespace-nowrap z-30"
                            style={{ left: '50%', top: `${yPercent}%` }}>
                         {formatCurrency(month.value)}
                       </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* X-axis Labels */}
            <div className="relative w-full h-8">
              {revenueData.map((month, idx) => {
                const xPercent = (idx / (revenueData.length - 1)) * 100;
                return (
                  <span key={idx} className="absolute text-[10px] text-[#999999] uppercase tracking-widest font-bold transform -translate-x-1/2" style={{ left: `${xPercent}%` }}>
                    {month.month}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Side Panel: Distribution & Top Vendors */}
        <div className="space-y-8">
          
          {/* Booking Distribution */}
          <div className="bg-white border border-[#ECECEC] rounded-2xl p-8 shadow-sm">
            <h3 className="text-lg font-serif text-[#0F0F0F] mb-6">Class Distribution</h3>
            
            {/* Stacked Bar */}
            <div className="w-full h-3 rounded-full flex overflow-hidden mb-6 bg-[#F5F5F5]">
              {vehicleClasses.map((vc, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ width: 0 }} 
                  animate={{ width: `${vc.percentage}%` }} 
                  transition={{ duration: 1, delay: 0.2 }}
                  style={{ backgroundColor: vc.color }}
                />
              ))}
            </div>

            {/* Legend */}
            <div className="space-y-4">
              {vehicleClasses.length === 0 ? (
                <p className="text-[12px] text-[#666666] italic">No vehicle data available.</p>
              ) : vehicleClasses.map((vc, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: vc.color }} />
                    <span className="text-[12px] font-bold text-[#0F0F0F] uppercase tracking-wider">{vc.name}</span>
                  </div>
                  <span className="text-[12px] text-[#666666] font-medium">{vc.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Vendors */}
          <div className="bg-white border border-[#ECECEC] rounded-2xl p-8 shadow-sm">
            <h3 className="text-lg font-serif text-[#0F0F0F] mb-6">Top Partners</h3>
            
            <div className="space-y-6">
              {topVendors.length === 0 ? (
                <p className="text-[12px] text-[#666666] italic">No partner data available.</p>
              ) : topVendors.map((vendor, idx) => {
                const maxBookings = topVendors[0]?.bookings || 1;
                const widthPercent = (vendor.bookings / maxBookings) * 100;
                const isUp = vendor.trend.includes('+');
                
                return (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[12px] font-bold text-[#0F0F0F] uppercase tracking-wider">{vendor.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] text-[#0F0F0F] font-bold">{formatCurrency(vendor.revenue)}</span>
                        <span className={`text-[10px] font-bold flex items-center ${isUp ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                          {vendor.trend}
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-[#F5F5F5] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${widthPercent}%` }} 
                        transition={{ duration: 1, delay: 0.2 + (idx * 0.1) }}
                        className="h-full bg-[#C9A75D]"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>

      </div>
    </motion.div>
  );
}
