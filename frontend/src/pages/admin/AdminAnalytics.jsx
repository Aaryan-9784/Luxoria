import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Car, DollarSign, Calendar, ArrowUpRight, ArrowDownRight, Activity, Download, ChevronDown } from 'lucide-react';
import CountUp from 'react-countup';

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('year'); // year, month, week

  // Mock analytics data
  const data = {
    kpis: {
      revenue: 1245000,
      bookings: 842,
      activeUsers: 12450,
      vendors: 156
    },
    revenueData: [
      { month: 'Jan', value: 45000 },
      { month: 'Feb', value: 52000 },
      { month: 'Mar', value: 48000 },
      { month: 'Apr', value: 61000 },
      { month: 'May', value: 59000 },
      { month: 'Jun', value: 75000 },
      { month: 'Jul', value: 82000 },
      { month: 'Aug', value: 95000 },
      { month: 'Sep', value: 88000 },
      { month: 'Oct', value: 105000 },
      { month: 'Nov', value: 112000 },
      { month: 'Dec', value: 125000 }
    ],
    vehicleClasses: [
      { name: 'Luxury Sedans', percentage: 45, color: '#0F0F0F' },
      { name: 'Supercars', percentage: 25, color: '#C9A75D' },
      { name: 'SUVs', percentage: 20, color: '#666666' },
      { name: 'Classics', percentage: 10, color: '#ECECEC' }
    ],
    topVendors: [
      { name: 'Elite Motors', bookings: 145, revenue: 320000, trend: '+12%' },
      { name: 'Prestige Exotics', bookings: 98, revenue: 215000, trend: '+8%' },
      { name: 'Crown Classics', bookings: 64, revenue: 140000, trend: '-3%' },
      { name: 'Royal Fleet', bookings: 42, revenue: 95000, trend: '+5%' }
    ]
  };

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  // Find max revenue for chart scaling, ensure it's not 0
  const maxRevenue = Math.max(...data.revenueData.map(d => d.value)) || 1;

  const handleExport = () => {
    // Mock export functionality
    const csvContent = "data:text/csv;charset=utf-8,Month,Revenue\\n" 
      + data.revenueData.map(d => `${d.month},${d.value}`).join("\\n");
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
          <div className="relative group">
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none bg-white border border-[#ECECEC] rounded-xl pl-4 pr-10 py-2.5 text-[12px] font-bold uppercase tracking-wider text-[#0F0F0F] focus:outline-none focus:border-[#C9A75D] transition-colors cursor-pointer"
            >
              <option value="year">2026 Fiscal Year</option>
              <option value="month">Last 30 Days</option>
              <option value="week">Last 7 Days</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999999] group-hover:text-[#C9A75D] transition-colors pointer-events-none" />
          </div>
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
          { title: 'Total Revenue', value: data.kpis.revenue, icon: DollarSign, prefix: '$', trend: '+12.5%', isUp: true },
          { title: 'Global Bookings', value: data.kpis.bookings, icon: Calendar, prefix: '', trend: '+8.2%', isUp: true },
          { title: 'Active Clients', value: data.kpis.activeUsers, icon: Users, prefix: '', trend: '+15.3%', isUp: true },
          { title: 'Vendor Partners', value: data.kpis.vendors, icon: Car, prefix: '', trend: '-2.1%', isUp: false },
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
        <div className="lg:col-span-2 bg-white border border-[#ECECEC] rounded-2xl p-8 shadow-sm flex flex-col min-w-0">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-serif text-[#0F0F0F]">Revenue Growth</h3>
            <div className="flex items-center gap-2 text-[11px] font-bold text-[#666666] uppercase tracking-wider">
              <Activity className="w-4 h-4 text-[#C9A75D]" /> Performance
            </div>
          </div>

          {/* The CSS Chart - Fixed height so bars render correctly */}
          <div className="flex-1 min-h-[300px] flex items-end justify-between gap-1 sm:gap-2 min-w-0 overflow-x-auto no-scrollbar pb-2">
            {data.revenueData.map((month, idx) => {
              const heightPercent = (month.value / maxRevenue) * 100;
              return (
                <div key={idx} className="flex flex-col items-center flex-1 min-w-[24px] h-full justify-end group">
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#0F0F0F] text-white text-[10px] font-bold py-1.5 px-3 rounded-lg mb-2 whitespace-nowrap pointer-events-none shadow-lg transform -translate-y-2">
                    {formatCurrency(month.value)}
                  </div>
                  {/* Bar */}
                  <div className="w-full relative flex justify-center items-end" style={{ height: 'calc(100% - 40px)' }}>
                    <motion.div 
                      initial={{ height: 0 }} 
                      animate={{ height: `${heightPercent}%` }} 
                      transition={{ duration: 1, delay: idx * 0.05 }}
                      className="w-full max-w-[40px] bg-[#F5F5F5] group-hover:bg-[#C9A75D] rounded-t-sm transition-colors relative overflow-hidden"
                    >
                      {/* Inner accent line */}
                      <div className="absolute top-0 left-0 w-full h-1 bg-[#0F0F0F] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  </div>
                  {/* Label */}
                  <span className="text-[10px] text-[#999999] uppercase tracking-widest mt-4 font-bold group-hover:text-[#0F0F0F] transition-colors">{month.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Side Panel: Distribution & Top Vendors */}
        <div className="space-y-8">
          
          {/* Booking Distribution */}
          <div className="bg-white border border-[#ECECEC] rounded-2xl p-8 shadow-sm">
            <h3 className="text-lg font-serif text-[#0F0F0F] mb-6">Class Distribution</h3>
            
            {/* Stacked Bar */}
            <div className="w-full h-3 rounded-full flex overflow-hidden mb-6">
              {data.vehicleClasses.map((vc, idx) => (
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
              {data.vehicleClasses.map((vc, idx) => (
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
              {data.topVendors.map((vendor, idx) => {
                const maxBookings = data.topVendors[0].bookings;
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
