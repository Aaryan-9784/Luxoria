import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import api from '@/services/api';
import { Download, Receipt, AlertCircle, CreditCard, CalendarDays, Hash, ChevronLeft, ChevronRight, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import CustomSelect from '@/components/ui/CustomSelect';
import { convertUsdToInr } from '@/utils/currency';
import { openLuxoriaReceipt } from '@/utils/generateReceipt';

export default function UserInvoices() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('all'); // all, month, year
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const { accessToken, user: currentUser, loading: authLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Wait until auth has finished initialising before fetching
    if (authLoading) return;
    if (!accessToken) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const fetchPayments = async () => {
      try {
        const res = await api.get('/bookings/my?limit=100');
        const bookings = Array.isArray(res.data.data) ? res.data.data : [];
        // Only show bookings that have been paid (confirmed, active, completed)
        const ledger = bookings
          .filter(b => ['confirmed', 'active', 'completed'].includes(b.status))
          .map(b => ({
            id: b._id,
            bookingId: b.bookingId,
            date: b.createdAt,
            startDate: b.startDate,
            endDate: b.endDate,
            totalDays: b.totalDays,
            amount: b.totalAmount,
            vehicle: b.vehicle?.name || 'N/A',
            vehicleImage: b.vehicle?.images?.[0]?.url || null,
            vehicleCategory: b.vehicle?.category || null,
            vehicleTransmission: b.vehicle?.transmission || 'Automatic',
            vehicleBrand: b.vehicle?.brand || '',
            status: b.status,
            method: 'Razorpay',
            pickupLocation: b.pickupLocation || 'N/A',
          }));
        setPayments(ledger);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [accessToken, authLoading]);

  const filteredPayments = useMemo(() => {
    const now = new Date();
    return payments.filter(tx => {
      if (timeframe === 'all') return true;
      const txDate = new Date(tx.date);
      if (timeframe === 'month') {
        return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
      }
      if (timeframe === 'year') {
        return txDate.getFullYear() === now.getFullYear();
      }
      return true;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [payments, timeframe]);

  const totalSpent = filteredPayments.reduce((acc, curr) => acc + curr.amount, 0);

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDownloadInvoice = (tx) => {
    const fmt = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    openLuxoriaReceipt({
      bookingRef:           tx.bookingId,
      dateIssued:           fmt(tx.date),
      tripStart:            fmt(tx.startDate),
      tripEnd:              fmt(tx.endDate),
      totalDays:            tx.totalDays,
      pickupLocation:       tx.pickupLocation,
      guestName:            currentUser?.name  || 'Guest',
      guestEmail:           currentUser?.email || '',
      vehicleName:          tx.vehicle,
      vehicleBrand:         tx.vehicleBrand || '',
      vehicleTransmission:  tx.vehicleTransmission || 'Automatic',
      amountUsd:            tx.amount,
      amountInr:            convertUsdToInr(tx.amount),
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#0F0F0F] tracking-tight mb-1.5" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Billing & Invoices</h1>
          <p className="text-[#666666] text-sm font-medium tracking-wide">View your transaction history and download official receipts.</p>
        </div>
        
        {!loading && payments.length > 0 && (
          <div className="flex items-center gap-4 w-full lg:w-auto">
            {/* Filter Timeline */}
            <div className="w-full sm:w-48">
              <CustomSelect
                value={timeframe}
                onChange={(val) => { setTimeframe(val); setCurrentPage(1); }}
                icon={CalendarDays}
                options={[
                  { value: 'all', label: 'All Time' },
                  { value: 'month', label: 'This Month' },
                  { value: 'year', label: 'This Year' },
                ]}
              />
            </div>
          </div>
        )}
      </div>

      {/* KPI Stats Bar */}
      {!loading && payments.length > 0 && (
        <div className="flex flex-wrap items-center gap-6 px-6 py-4 bg-white border border-[#ECECEC] rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0F0F0F] flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-[#C9A75D]" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#666666]">Total Spend</p>
              <p className="text-[16px] font-bold text-[#0F0F0F]">${totalSpent.toLocaleString('en-US')}</p>
            </div>
          </div>
          <div className="hidden sm:block h-10 w-px bg-[#ECECEC]"></div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#666666]">Transactions</p>
            <p className="text-[16px] font-bold text-[#0F0F0F]">{filteredPayments.length}</p>
          </div>
          <div className="hidden sm:block h-10 w-px bg-[#ECECEC]"></div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#666666]">Latest Payment</p>
            <p className="text-[16px] font-bold text-[#0F0F0F]">
              {filteredPayments.length > 0 ? new Date(filteredPayments[0].date).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {loading ? (
        /* ── Skeleton ── */
        <div className="space-y-3">
          {/* Stats skeleton */}
          <div className="flex flex-wrap items-center gap-6 px-6 py-4 bg-white border border-[#ECECEC] rounded-2xl shadow-sm">
            {[1,2,3].map(i => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F0F0F0] animate-pulse" />
                <div className="space-y-1.5">
                  <div className="h-2 w-20 bg-[#F0F0F0] rounded animate-pulse" />
                  <div className="h-4 w-14 bg-[#ECECEC] rounded animate-pulse" />
                </div>
                {i < 3 && <div className="hidden sm:block h-10 w-px bg-[#ECECEC] ml-3" />}
              </div>
            ))}
          </div>
          {/* Table skeleton */}
          <div className="bg-white border border-[#ECECEC] rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-[#F9F9F9] border-b border-[#ECECEC] px-6 py-4 grid grid-cols-6 gap-4">
              {['Date','Reference','Description','Method','Amount','Invoice'].map(h => (
                <div key={h} className="h-2.5 bg-[#ECECEC] rounded animate-pulse" />
              ))}
            </div>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="px-6 py-5 border-b border-[#F5F5F5] grid grid-cols-6 gap-4 items-center">
                <div className="h-3 w-20 bg-[#F5F5F5] rounded animate-pulse" />
                <div className="h-6 w-24 bg-[#F5F5F5] rounded-lg animate-pulse" />
                <div className="space-y-1.5">
                  <div className="h-3 w-28 bg-[#F5F5F5] rounded animate-pulse" />
                  <div className="h-2 w-20 bg-[#F0F0F0] rounded animate-pulse" />
                </div>
                <div className="h-3 w-20 bg-[#F5F5F5] rounded animate-pulse" />
                <div className="space-y-1.5">
                  <div className="h-3 w-14 bg-[#F5F5F5] rounded animate-pulse" />
                  <div className="h-2 w-16 bg-[#F0F0F0] rounded animate-pulse" />
                </div>
                <div className="flex justify-end">
                  <div className="h-8 w-8 bg-[#F5F5F5] rounded-lg animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : payments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 bg-white border border-[#ECECEC] border-dashed rounded-2xl shadow-sm text-center">
          <div className="w-20 h-20 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-6">
            <Receipt className="w-10 h-10 text-[#C9A75D] opacity-60" />
          </div>
          <h2 className="text-2xl font-serif text-[#0F0F0F] mb-3">No Transactions Found</h2>
          <p className="text-[14px] text-[#666666] max-w-md mx-auto mb-8 leading-relaxed">
            You don't have any recorded payments yet. Once you complete a luxury booking, your official invoices will appear here.
          </p>
          <Link to="/vehicles" className="inline-flex items-center gap-2 bg-[#0F0F0F] text-white px-8 py-3.5 rounded-xl text-[12px] font-bold uppercase tracking-widest hover:bg-[#C9A75D] hover:shadow-lg transition-all">
             Book a Vehicle
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-[#ECECEC] rounded-2xl shadow-sm overflow-hidden">
          {filteredPayments.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center">
              <Receipt className="w-10 h-10 text-[#ECECEC] mb-4" />
              <p className="text-[13px] font-medium text-[#666666]">No payments found for this timeframe.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F9F9F9] border-b border-[#ECECEC]">
                    <th className="py-4 px-6 text-[11px] font-bold text-[#666666] uppercase tracking-wider whitespace-nowrap">Date</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-[#666666] uppercase tracking-wider whitespace-nowrap">Reference</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-[#666666] uppercase tracking-wider whitespace-nowrap">Description</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-[#666666] uppercase tracking-wider whitespace-nowrap">Method</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-[#666666] uppercase tracking-wider whitespace-nowrap">Amount</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-[#666666] uppercase tracking-wider text-right whitespace-nowrap">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECECEC]">
                  {paginatedPayments.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#F5F5F5]/50 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-[12px] font-medium text-[#0F0F0F] whitespace-nowrap">
                          <CalendarDays className="w-4 h-4 text-[#666666]" />
                          {new Date(tx.date).toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'})}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#ECECEC] bg-white text-[11px] font-mono font-bold text-[#666666] whitespace-nowrap">
                          <Hash className="w-3 h-3 text-[#C9A75D]" />
                          {tx.bookingId.substring(0,8).toUpperCase()}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-[13px] font-bold text-[#0F0F0F] whitespace-nowrap">{tx.vehicle}</p>
                        <p className="text-[10px] text-[#666666] font-bold uppercase tracking-widest mt-0.5 whitespace-nowrap">Vehicle Rental</p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-[12px] font-medium text-[#0F0F0F] whitespace-nowrap">
                          <CreditCard className="w-4 h-4 text-[#C9A75D]" />
                          {tx.method}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-[14px] font-bold text-[#0F0F0F] whitespace-nowrap">
                          ${tx.amount.toLocaleString('en-US')}
                        </span>
                        <p className="text-[10px] text-[#16A34A] font-bold uppercase tracking-widest mt-0.5 whitespace-nowrap">Captured</p>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button 
                          onClick={() => handleDownloadInvoice(tx)}
                          className="inline-flex items-center justify-center p-2 rounded-lg text-[#666666] hover:text-[#C9A75D] hover:bg-white border border-transparent hover:border-[#ECECEC] transition-all"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-[#ECECEC] p-4 flex items-center justify-between bg-[#F9F9F9]">
              <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider hidden sm:block">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredPayments.length)} of {filteredPayments.length}
              </p>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-[#ECECEC] text-[#0F0F0F] bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F5F5F5] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-7 h-7 rounded-lg text-[11px] font-bold transition-colors ${currentPage === i + 1 ? 'bg-[#0F0F0F] text-white' : 'text-[#666666] hover:bg-[#ECECEC]'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-[#ECECEC] text-[#0F0F0F] bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F5F5F5] transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Support Banner */}
      <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-[#ECECEC] mt-8 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-[#FBFBFB] border border-[#ECECEC] flex items-center justify-center shrink-0">
          <AlertCircle className="w-5 h-5 text-[#C9A75D]" />
        </div>
        <div className="flex-1 mt-0.5">
          <h4 className="text-[14px] font-bold text-[#0F0F0F] mb-1">Official Invoicing</h4>
          <p className="text-[13px] text-[#666666] leading-relaxed">
            Invoices are generated automatically after a successful payment capture. For any billing discrepancies, please contact <Link to="/support" className="text-[#C9A75D] font-medium hover:underline">Luxoria Premium Support</Link> within 7 days of the transaction.
          </p>
        </div>
      </div>

    </motion.div>
  );
}
