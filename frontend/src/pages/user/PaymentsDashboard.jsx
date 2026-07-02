import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import api from '@/services/api';
import {
  CreditCard, ShieldCheck, Download, Hash,
  CalendarDays, DollarSign, ChevronLeft, ChevronRight,
  Car, TrendingUp, Receipt
} from 'lucide-react';
import { Link } from 'react-router-dom';
import CustomSelect from '@/components/ui/CustomSelect';

const STATUS_STYLE = {
  confirmed: { label: 'Paid', color: 'text-[#16A34A]', bg: 'bg-[#16A34A]/10', border: 'border-[#16A34A]/20' },
  completed: { label: 'Completed', color: 'text-[#16A34A]', bg: 'bg-[#16A34A]/10', border: 'border-[#16A34A]/20' },
  pending:   { label: 'Pending',   color: 'text-[#C9A75D]', bg: 'bg-[#C9A75D]/10', border: 'border-[#C9A75D]/20' },
  active:    { label: 'Active',    color: 'text-[#3B82F6]', bg: 'bg-[#3B82F6]/10', border: 'border-[#3B82F6]/20' },
  cancelled: { label: 'Refunded',  color: 'text-[#DC2626]', bg: 'bg-[#DC2626]/10', border: 'border-[#DC2626]/20' },
};

export default function PaymentsDashboard() {
  const { accessToken } = useSelector(state => state.auth);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    if (!accessToken) return;
    const fetch = async () => {
      try {
        const res = await api.get('/bookings/my?limit=100');
        const bookings = Array.isArray(res.data.data) ? res.data.data : [];
        setPayments(bookings.filter(b => b.totalAmount > 0));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [accessToken]);

  const filtered = useMemo(() => {
    const now = new Date();
    return payments
      .filter(b => {
        if (timeframe === 'all') return true;
        const d = new Date(b.createdAt);
        if (timeframe === 'month') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        if (timeframe === 'year')  return d.getFullYear() === now.getFullYear();
        return true;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [payments, timeframe]);

  const totalSpent   = filtered.filter(b => ['confirmed','completed','active'].includes(b.status)).reduce((s, b) => s + b.totalAmount, 0);
  const totalPages   = Math.ceil(filtered.length / itemsPerPage);
  const paginated    = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDownload = (b) => {
    const lines = [
      '================================================',
      '         LUXORIA — PAYMENT RECEIPT              ',
      '================================================',
      '',
      `Booking Ref  : ${b.bookingId}`,
      `Vehicle      : ${b.vehicle?.name || 'N/A'}`,
      `Date         : ${new Date(b.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`,
      `Period       : ${new Date(b.startDate).toLocaleDateString('en-GB')} – ${new Date(b.endDate).toLocaleDateString('en-GB')}`,
      `Duration     : ${b.totalDays} day(s)`,
      `Status       : ${b.status?.toUpperCase()}`,
      `Amount Paid  : $${b.totalAmount?.toLocaleString('en-US')}`,
      '',
      '================================================',
      '       Thank you for choosing Luxoria.          ',
      '================================================',
    ].join('\n');
    const blob = new Blob([lines], { type: 'text/plain;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `Luxoria_Payment_${b.bookingId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#0F0F0F] tracking-tight mb-1.5" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            Payments
          </h1>
          <p className="text-[#666666] text-sm font-medium tracking-wide">Your complete transaction history and payment records.</p>
        </div>
        {payments.length > 0 && (
          <div className="w-full sm:w-48">
            <CustomSelect
              value={timeframe}
              onChange={(v) => { setTimeframe(v); setCurrentPage(1); }}
              icon={CalendarDays}
              options={[
                { value: 'all',   label: 'All Time' },
                { value: 'month', label: 'This Month' },
                { value: 'year',  label: 'This Year' },
              ]}
            />
          </div>
        )}
      </div>

      {/* Stats */}
      {payments.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { icon: DollarSign,  label: 'Total Spent',    value: `$${totalSpent.toLocaleString('en-US')}` },
            { icon: Receipt,     label: 'Transactions',   value: filtered.length },
            { icon: TrendingUp,  label: 'Avg. Per Rental',value: filtered.length ? `$${Math.round(totalSpent / filtered.filter(b=>['confirmed','completed','active'].includes(b.status)).length || 1).toLocaleString()}` : '$0' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-white border border-[#ECECEC] rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#0F0F0F] flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-[#C9A75D]" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#666666]">{label}</p>
                <p className="text-[16px] font-bold text-[#0F0F0F]">{value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-[#ECECEC] rounded-2xl">
          <div className="w-8 h-8 border-4 border-[#C9A75D] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider animate-pulse">Loading Payments...</p>
        </div>
      ) : payments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 bg-white border border-dashed border-[#ECECEC] rounded-2xl text-center">
          <div className="w-20 h-20 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-6">
            <CreditCard className="w-9 h-9 text-[#C9A75D] opacity-60" />
          </div>
          <h2 className="text-2xl font-bold text-[#0F0F0F] mb-3" style={{ fontFamily: 'Georgia, serif' }}>No Payments Yet</h2>
          <p className="text-[14px] text-[#666666] max-w-md mx-auto mb-8 leading-relaxed">
            Once you complete a booking, your payment history will appear here.
          </p>
          <Link to="/vehicles" className="inline-flex items-center gap-2 bg-[#0F0F0F] text-white px-8 py-3.5 rounded-xl text-[12px] font-bold uppercase tracking-widest hover:bg-[#C9A75D] transition-all">
            <Car className="w-4 h-4" /> Browse Fleet
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-[#ECECEC] rounded-2xl shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-[13px] text-[#666666]">No payments in this timeframe.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F9F9F9] border-b border-[#ECECEC]">
                    {['Date', 'Reference', 'Vehicle', 'Duration', 'Status', 'Amount', ''].map(h => (
                      <th key={h} className="py-4 px-5 text-[11px] font-bold text-[#666666] uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECECEC]">
                  {paginated.map(b => {
                    const st = STATUS_STYLE[b.status] || STATUS_STYLE.pending;
                    return (
                      <tr key={b._id} className="hover:bg-[#F9F9F9] transition-colors group">
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-2 text-[12px] font-medium text-[#0F0F0F] whitespace-nowrap">
                            <CalendarDays className="w-3.5 h-3.5 text-[#999999]" />
                            {new Date(b.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </div>
                        </td>
                        <td className="py-4 px-5">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#ECECEC] bg-[#F9F9F9] text-[11px] font-mono font-bold text-[#666666] whitespace-nowrap">
                            <Hash className="w-3 h-3 text-[#C9A75D]" />
                            {b.bookingId?.substring(0, 8).toUpperCase()}
                          </div>
                        </td>
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            {b.vehicle?.images?.[0]?.url && (
                              <div className="w-10 h-8 rounded-lg overflow-hidden shrink-0 bg-[#F0F0F0]">
                                <img src={b.vehicle.images[0].url} alt={b.vehicle.name} className="w-full h-full object-cover" />
                              </div>
                            )}
                            <p className="text-[13px] font-bold text-[#0F0F0F] whitespace-nowrap">{b.vehicle?.name || 'Vehicle'}</p>
                          </div>
                        </td>
                        <td className="py-4 px-5">
                          <p className="text-[12px] font-medium text-[#0F0F0F] whitespace-nowrap">{b.totalDays} day{b.totalDays !== 1 ? 's' : ''}</p>
                        </td>
                        <td className="py-4 px-5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${st.color} ${st.bg} ${st.border}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${st.color.replace('text-', 'bg-')}`} />
                            {st.label}
                          </span>
                        </td>
                        <td className="py-4 px-5">
                          <p className="text-[14px] font-bold text-[#0F0F0F] whitespace-nowrap">${b.totalAmount?.toLocaleString('en-US')}</p>
                        </td>
                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={() => handleDownload(b)}
                            className="p-2 rounded-lg text-[#666666] hover:text-[#C9A75D] hover:bg-white border border-transparent hover:border-[#ECECEC] transition-all"
                            title="Download Receipt"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-[#ECECEC] p-4 flex items-center justify-between bg-[#F9F9F9]">
              <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider hidden sm:block">
                Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-[#ECECEC] bg-white disabled:opacity-40 hover:bg-[#F5F5F5] transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} onClick={() => setCurrentPage(i + 1)}
                    className={`w-7 h-7 rounded-lg text-[11px] font-bold transition-colors ${currentPage === i + 1 ? 'bg-[#0F0F0F] text-white' : 'text-[#666666] hover:bg-[#ECECEC]'}`}>
                    {i + 1}
                  </button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-[#ECECEC] bg-white disabled:opacity-40 hover:bg-[#F5F5F5] transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Security Banner */}
      <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-[#ECECEC] shadow-sm">
        <div className="w-10 h-10 rounded-full bg-[#FBFBFB] border border-[#ECECEC] flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5 text-[#C9A75D]" />
        </div>
        <div className="mt-0.5">
          <h4 className="text-[14px] font-bold text-[#0F0F0F] mb-1">Secure Payments via Razorpay</h4>
          <p className="text-[13px] text-[#666666] leading-relaxed">
            All transactions are processed through <span className="text-[#C9A75D] font-medium">Razorpay</span> with bank-level encryption. Luxoria never stores your card details directly.
          </p>
        </div>
      </div>

    </motion.div>
  );
}
