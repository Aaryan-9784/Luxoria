import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendorBookings } from '@/redux/slices/vendorSlice';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { Wallet, TrendingUp, DollarSign, Download, ArrowUpRight, Calendar, FileText } from 'lucide-react';

export default function VendorRevenue() {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector(state => state.vendor);
  const [timeFilter, setTimeFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchVendorBookings());
  }, [dispatch]);

  const filteredByTime = bookings.filter(b => {
    if (timeFilter === 'all') return true;
    const bookingDate = new Date(b.createdAt);
    const now = new Date();
    if (timeFilter === 'this_month') {
      return bookingDate.getMonth() === now.getMonth() && bookingDate.getFullYear() === now.getFullYear();
    }
    if (timeFilter === 'last_30') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);
      return bookingDate >= thirtyDaysAgo;
    }
    return true;
  });

  const completedBookings = filteredByTime.filter(b => b.status === 'completed' || b.status === 'confirmed');
  const pendingBookings = filteredByTime.filter(b => b.status === 'pending');
  
  const totalRevenue = completedBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const pendingRevenue = pendingBookings.reduce((sum, b) => sum + b.totalAmount, 0);

  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Vehicle', 'Date', 'Amount', 'Status'];
    const csvContent = [
      headers.join(','),
      ...completedBookings.map(b => 
        `${b._id},"${b.vehicle?.name || 'Unknown'}","${new Date(b.createdAt).toLocaleDateString()}",${b.totalAmount},Paid`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `luxoria_revenue_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && bookings.length === 0) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#C9A75D] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[#666666] font-medium uppercase tracking-widest text-sm animate-pulse">Syncing Revenue Data</p>
      </div>
    );
  }

  const KPI_DATA = [
    { label: 'Total Earnings', value: `$${totalRevenue.toLocaleString('en-US')}`, icon: Wallet },
    { label: 'Completed Trips', value: completedBookings.length, icon: TrendingUp },
    { label: 'Projected (Pending)', value: `$${pendingRevenue.toLocaleString('en-US')}`, icon: DollarSign },
  ];

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-10 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-2">
        <div>
          <h1 className="text-[28px] font-bold text-[#0F0F0F] tracking-tight mb-1.5" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Revenue Analytics</h1>
          <p className="text-[#666666] text-sm font-medium tracking-wide">Track your earnings, payouts, and financial performance.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-48">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <select 
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="w-full bg-white border border-[#ECECEC] text-[#0F0F0F] text-[13px] py-3 pl-11 pr-4 rounded-xl focus:outline-none focus:border-[#C9A75D] transition-all appearance-none cursor-pointer shadow-sm"
            >
              <option value="all">All Time</option>
              <option value="this_month">This Month</option>
              <option value="last_30">Last 30 Days</option>
            </select>
          </div>
          <button 
            onClick={handleExportCSV}
            disabled={completedBookings.length === 0}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#0F0F0F] text-[#C9A75D] text-[11px] font-bold uppercase tracking-wider rounded-xl hover:bg-[#1A1A1A] hover:shadow-lg transition-all w-full sm:w-auto disabled:opacity-50 shrink-0"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* KPI Widgets */}
      <motion.div variants={staggerItem} className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      {/* Transactions List */}
      <motion.div variants={staggerItem} className="bg-white border border-[#ECECEC] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-[#ECECEC] flex items-center justify-between">
          <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#0F0F0F]">Recent Transactions</h3>
          <span className="text-[11px] font-medium text-[#666666] bg-[#F5F5F5] px-3 py-1 rounded-full">Displaying Latest 10</span>
        </div>
        
        {completedBookings.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center">
            <FileText className="w-12 h-12 text-[#ECECEC] mb-4" />
            <p className="text-[#666666] text-[13px] font-medium">You don't have any completed or paid transactions in this time period.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F5F5F5] border-b border-[#ECECEC]">
                  <th className="py-4 px-6 text-[10px] font-bold text-[#666666] uppercase tracking-wider">Transaction ID</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-[#666666] uppercase tracking-wider">Vehicle</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-[#666666] uppercase tracking-wider">Date</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-[#666666] uppercase tracking-wider text-right">Amount</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-[#666666] uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECECEC]">
                {completedBookings.slice(0, 10).map((booking) => (
                  <motion.tr variants={staggerItem} key={booking._id} className="hover:bg-[#F5F5F5]/50 transition-colors group">
                    <td className="py-5 px-6">
                      <span className="font-mono text-[12px] font-bold text-[#666666] uppercase bg-[#ECECEC]/50 px-2 py-1 rounded">{booking._id.slice(-8)}</span>
                    </td>
                    <td className="py-5 px-6">
                      <span className="text-[13px] font-bold text-[#0F0F0F]">{booking.vehicle?.name || 'Unknown Vehicle'}</span>
                    </td>
                    <td className="py-5 px-6">
                      <span className="text-[13px] text-[#666666] font-medium">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-5 px-6 text-right">
                      <span className="text-[14px] font-bold text-[#16A34A] inline-flex items-center justify-end gap-1">
                        +${booking.totalAmount.toLocaleString('en-US')} <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity translate-y-1 group-hover:translate-y-0 duration-300" />
                      </span>
                    </td>
                    <td className="py-5 px-6 text-right">
                      <span className="bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center justify-center gap-1 shadow-sm">
                        Paid
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
