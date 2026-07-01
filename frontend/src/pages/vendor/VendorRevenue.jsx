import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendorBookings } from '@/redux/slices/vendorSlice';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { Wallet, TrendingUp, DollarSign, Download, ArrowUpRight, Calendar, FileText, Car } from 'lucide-react';
import CustomSelect from '@/components/ui/CustomSelect';

export default function VendorRevenue() {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector(state => state.vendor);
  const { accessToken } = useSelector(state => state.auth);
  const [timeFilter, setTimeFilter] = useState('all');

  useEffect(() => {
    if (!accessToken) return;
    dispatch(fetchVendorBookings());
  }, [dispatch, accessToken]);

  // ── Filter bookings by selected time period ───────────────────────────────
  const filteredByTime = bookings.filter(b => {
    if (timeFilter === 'all') return true;
    const bookingDate = new Date(b.createdAt);
    const now = new Date();
    if (timeFilter === 'this_month') {
      return bookingDate.getMonth() === now.getMonth() && bookingDate.getFullYear() === now.getFullYear();
    }
    if (timeFilter === 'last_month') {
      const firstOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastOfLastMonth  = new Date(now.getFullYear(), now.getMonth(), 0);
      return bookingDate >= firstOfLastMonth && bookingDate <= lastOfLastMonth;
    }
    if (timeFilter === 'this_year') {
      return bookingDate.getFullYear() === now.getFullYear();
    }
    return true;
  });

  // Completed or confirmed = earned revenue
  const earnedBookings  = filteredByTime.filter(b => b.status === 'completed' || b.status === 'confirmed');
  // Pending = projected revenue
  const pendingBookings = filteredByTime.filter(b => b.status === 'pending' || b.status === 'active');

  const totalRevenue   = earnedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const pendingRevenue = pendingBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  // Recent transactions = earned bookings sorted newest first, capped at 10
  const recentTransactions = [...earnedBookings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);

  // All filtered bookings sorted newest first for export
  const allSortedBookings = [...filteredByTime]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // ── Export CSV ─────────────────────────────────────────────────────────────
  const handleExportCSV = () => {
    const headers = ['Booking ID', 'Vehicle', 'Customer', 'Rental Period', 'Days', 'Amount', 'Status', 'Date'];
    const rows = allSortedBookings.map(b => {
      const start = b.startDate ? new Date(b.startDate).toLocaleDateString('en-US') : '-';
      const end   = b.endDate   ? new Date(b.endDate).toLocaleDateString('en-US')   : '-';
      // Escape any quotes inside string fields
      const safeName    = (b.vehicle?.name || 'Unknown').replace(/"/g, '""');
      const safeCustomer = (b.user?.name   || 'Unknown').replace(/"/g, '""');
      return [
        b.bookingId || b._id,
        `"${safeName}"`,
        `"${safeCustomer}"`,
        `"${start} - ${end}"`,
        b.totalDays  ?? '-',
        b.totalAmount ?? 0,
        b.status,
        new Date(b.createdAt).toLocaleDateString('en-US'),
      ].join(',');
    });

    const csv     = [headers.join(','), ...rows].join('\n');
    const blob    = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const blobUrl = URL.createObjectURL(blob);
    const link    = document.createElement('a');
    link.href     = blobUrl;
    link.download = `luxoria_earnings_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 150);
  };

  // ── Status helpers ─────────────────────────────────────────────────────────
  const statusConfig = {
    completed: { label: 'Completed', bg: '#16A34A10', text: '#16A34A', border: '#16A34A30' },
    confirmed: { label: 'Confirmed', bg: '#C9A75D10', text: '#C9A75D', border: '#C9A75D30' },
    active:    { label: 'Active',    bg: '#2563EB10', text: '#2563EB', border: '#2563EB30' },
    pending:   { label: 'Pending',   bg: '#9CA3AF15', text: '#6B7280', border: '#9CA3AF30' },
    cancelled: { label: 'Cancelled', bg: '#DC262610', text: '#DC2626', border: '#DC262630' },
  };
  const getStatus = (s) => statusConfig[s] || statusConfig.pending;

  if (loading && bookings.length === 0) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#C9A75D] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[#666666] font-medium uppercase tracking-widest text-sm animate-pulse">Syncing Revenue Data</p>
      </div>
    );
  }

  const KPI_DATA = [
    { label: 'Total Earnings',      value: `$${totalRevenue.toLocaleString('en-US')}`,   icon: Wallet },
    { label: 'Completed Trips',     value: earnedBookings.length,                          icon: TrendingUp },
    { label: 'Projected (Pending)', value: `$${pendingRevenue.toLocaleString('en-US')}`,  icon: DollarSign },
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
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none z-10" />
            <CustomSelect
              value={timeFilter}
              onChange={setTimeFilter}
              options={[
                { value: 'all',        label: 'All Time' },
                { value: 'this_year',  label: 'This Year' },
                { value: 'this_month', label: 'This Month' },
                { value: 'last_month', label: 'Last Month' },
              ]}
              icon={null}
              className="w-full text-[13px] py-3 pl-11 shadow-sm"
            />
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#0F0F0F] text-[#C9A75D] text-[11px] font-bold uppercase tracking-wider rounded-xl hover:bg-[#1A1A1A] hover:shadow-lg transition-all w-full sm:w-auto shrink-0"
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

      {/* Transactions Table */}
      <motion.div variants={staggerItem} className="bg-white border border-[#ECECEC] rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-[#ECECEC] flex items-center justify-between">
          <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#0F0F0F]">Recent Transactions</h3>
          <span className="text-[11px] font-bold text-[#666666] bg-[#F5F5F5] px-3 py-1.5 rounded-full uppercase tracking-wide">
            {recentTransactions.length} of {earnedBookings.length}
          </span>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#F5F5F5] flex items-center justify-center">
              <FileText className="w-6 h-6 text-[#D0D0D0]" />
            </div>
            <div className="text-center">
              <p className="text-[13px] font-bold text-[#CCCCCC] uppercase tracking-widest">No transactions yet</p>
              <p className="text-[12px] text-[#D0D0D0] font-medium mt-1">Completed & confirmed bookings will appear here</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-[#ECECEC]">
                  <th className="py-3.5 px-6 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Booking ID</th>
                  <th className="py-3.5 px-6 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Vehicle</th>
                  <th className="py-3.5 px-6 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Rental Period</th>
                  <th className="py-3.5 px-6 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider text-right">Days</th>
                  <th className="py-3.5 px-6 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider text-right">Amount</th>
                  <th className="py-3.5 px-6 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F5F5]">
                {recentTransactions.map((booking) => {
                  const sc = getStatus(booking.status);
                  const imgUrl = booking.vehicle?.images?.[0]?.url ?? null;
                  const start = booking.startDate ? new Date(booking.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—';
                  const end   = booking.endDate   ? new Date(booking.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
                  return (
                    <motion.tr
                      variants={staggerItem}
                      key={booking._id}
                      className="hover:bg-[#FAFAFA] transition-colors group"
                    >
                      {/* Booking ID */}
                      <td className="py-4 px-6">
                        <span className="font-mono text-[11px] font-bold text-[#9CA3AF] bg-[#F5F5F5] px-2 py-1 rounded tracking-wider">
                          {booking.bookingId || booking._id.slice(-8).toUpperCase()}
                        </span>
                      </td>

                      {/* Vehicle */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg border border-[#ECECEC] overflow-hidden shrink-0 bg-[#F5F5F5]">
                            {imgUrl ? (
                              <img src={imgUrl} alt={booking.vehicle?.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Car className="w-4 h-4 text-[#D0D0D0]" />
                              </div>
                            )}
                          </div>
                          <span className="text-[13px] font-bold text-[#0F0F0F]">
                            {booking.vehicle?.name || 'Unknown Vehicle'}
                          </span>
                        </div>
                      </td>

                      {/* Rental period */}
                      <td className="py-4 px-6">
                        <span className="text-[12px] font-medium text-[#666666]">{start} – {end}</span>
                      </td>

                      {/* Days */}
                      <td className="py-4 px-6 text-right">
                        <span className="text-[13px] font-bold text-[#0F0F0F]">
                          {booking.totalDays ?? '—'}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-6 text-right">
                        <span className="text-[14px] font-bold text-[#16A34A] inline-flex items-center justify-end gap-1">
                          +${(booking.totalAmount || 0).toLocaleString('en-US')}
                          <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6 text-right">
                        <span
                          className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center justify-center"
                          style={{ backgroundColor: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}
                        >
                          {sc.label}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
