import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyBookings, cancelBooking } from '@/redux/slices/dashboardSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, MapPin, Search, Filter, X, ChevronLeft, ChevronRight, Hash, Download, Eye } from 'lucide-react';
import CustomSelect from '@/components/ui/CustomSelect';
import { Link } from 'react-router-dom';

// Match booking date against a typed string (partial match on formatted date)
function dateMatchesQuery(bookingDate, query) {
  if (!query.trim()) return true;
  const d = new Date(bookingDate);
  const formatted = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toLowerCase();
  const iso = d.toISOString().slice(0, 10);
  return formatted.includes(query.trim().toLowerCase()) || iso.includes(query.trim());
}

export default function MyBookings() {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector(state => state.dashboard);
  const { accessToken } = useSelector(state => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateSearch, setDateSearch] = useState('');
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 8;

  useEffect(() => {
    if (!accessToken) return;
    dispatch(fetchMyBookings());
  }, [dispatch, accessToken]);

  // Filtering
  const filteredBookings = bookings.filter(b => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (b.vehicle?.name && b.vehicle.name.toLowerCase().includes(term)) ||
      (b.bookingId && b.bookingId.toLowerCase().includes(term));
    const matchesStatus = filterStatus === 'all' ? true : b.status === filterStatus;
    const matchesDate = !dateSearch.trim() ? true :
      dateMatchesQuery(b.startDate, dateSearch) || dateMatchesQuery(b.endDate, dateSearch);
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);
  const paginatedBookings = filteredBookings.slice((currentPage - 1) * bookingsPerPage, currentPage * bookingsPerPage);

  const handleCancel = async () => {
    if (bookingToCancel) {
      await dispatch(cancelBooking({ id: bookingToCancel, reason: 'User requested cancellation from dashboard' }));
      setCancelModalOpen(false);
      setBookingToCancel(null);
    }
  };

  const handleDownloadReceipt = (booking) => {
    const lines = [
      '================================================',
      '           LUXORIA — RENTAL RECEIPT             ',
      '================================================',
      '',
      `Booking ID    : ${booking.bookingId}`,
      `Vehicle       : ${booking.vehicle?.name || 'N/A'}`,
      '',
      `Pick-up       : ${new Date(booking.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`,
      `Drop-off      : ${new Date(booking.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`,
      `Total Days    : ${booking.totalDays}`,
      '',
      `Location      : ${booking.pickupLocation || 'N/A'}`,
      `Status        : ${booking.status?.toUpperCase()}`,
      `Total Amount  : $${booking.totalAmount?.toLocaleString('en-US')}`,
      '',
      '================================================',
      '     Thank you for choosing Luxoria.            ',
      '================================================',
    ].join('\n');
    const blob = new Blob([lines], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Luxoria_Receipt_${booking.bookingId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#16A34A]/10 border border-[#16A34A]/20 text-[10px] font-bold uppercase tracking-wider text-[#16A34A] whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse"></span> Completed
          </span>
        );
      case 'confirmed':
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0F0F0F]/5 border border-[#0F0F0F]/10 text-[10px] font-bold uppercase tracking-wider text-[#666666] whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-[#666666]"></span> {status}
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#C9A75D]/10 border border-[#C9A75D]/20 text-[10px] font-bold uppercase tracking-wider text-[#C9A75D] whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A75D] animate-pulse"></span> Pending
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#DC2626]/10 border border-[#DC2626]/20 text-[10px] font-bold uppercase tracking-wider text-[#DC2626] whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]"></span> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0F0F0F]/5 border border-[#0F0F0F]/10 text-[10px] font-bold uppercase tracking-wider text-[#666666] whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-[#666666]"></span> {status}
          </span>
        );
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#0F0F0F] tracking-tight mb-1.5" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>My Bookings</h1>
          <p className="text-[#666666] text-sm font-medium tracking-wide">Manage your luxury reservations and past trips.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666]" />
            <input 
              type="text" 
              placeholder="Search by vehicle or ID..." 
              value={searchTerm}
              onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
              className="w-full bg-white border border-[#ECECEC] rounded-xl pl-10 pr-4 py-2.5 text-[13px] text-[#0F0F0F] placeholder-[#999999] focus:outline-none focus:border-[#C9A75D] transition-colors"
            />
          </div>

          {/* Date Search */}
          <div className="relative w-full sm:w-48">
            <CalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999999] pointer-events-none" />
            <input
              type="text"
              placeholder="Search date..."
              value={dateSearch}
              onChange={(e) => { setDateSearch(e.target.value); setCurrentPage(1); }}
              className="w-full bg-white border border-[#ECECEC] rounded-xl pl-10 pr-9 py-2.5 text-[13px] text-[#0F0F0F] placeholder-[#999999] focus:outline-none focus:border-[#C9A75D] transition-colors"
            />
            {dateSearch && (
              <button onClick={() => { setDateSearch(''); setCurrentPage(1); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#AAAAAA] hover:text-[#DC2626] transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Status */}
          <div className="w-full sm:w-48">
            <CustomSelect
              value={filterStatus}
              onChange={(val) => { setFilterStatus(val); setCurrentPage(1); }}
              icon={Filter}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'pending', label: 'Pending' },
                { value: 'confirmed', label: 'Confirmed' },
                { value: 'active', label: 'Active' },
                { value: 'completed', label: 'Completed' },
                { value: 'cancelled', label: 'Cancelled' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-[#ECECEC] rounded-2xl shadow-sm overflow-hidden">
        {loading && bookings.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center">
             <div className="w-8 h-8 border-4 border-[#C9A75D] border-t-transparent rounded-full animate-spin mb-4" />
             <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider animate-pulse">Loading Reservations...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center">
            <Search className="w-10 h-10 text-[#ECECEC] mb-4" />
            <p className="text-[13px] font-medium text-[#666666]">No bookings found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F9F9F9] border-b border-[#ECECEC]">
                  <th className="py-4 px-6 text-[11px] font-bold text-[#666666] uppercase tracking-wider whitespace-nowrap">Vehicle Details</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-[#666666] uppercase tracking-wider whitespace-nowrap">Reservation Dates</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-[#666666] uppercase tracking-wider whitespace-nowrap">Status</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-[#666666] uppercase tracking-wider whitespace-nowrap">Total</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-[#666666] uppercase tracking-wider text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECECEC]">
                {paginatedBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-[#F5F5F5]/50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-[#F5F5F5]">
                          <img src={booking.vehicle?.images?.[0]?.url} alt={booking.vehicle?.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-[#0F0F0F] whitespace-nowrap">{booking.vehicle?.name || 'Unknown Vehicle'}</p>
                          <div className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-[#666666] mt-0.5">
                            <Hash className="w-3 h-3 text-[#C9A75D]" />
                            {booking.bookingId?.substring(0,8).toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-[12px] font-medium text-[#0F0F0F] mb-1 flex items-center gap-1.5 whitespace-nowrap">
                        <CalendarDays className="w-3.5 h-3.5 text-[#666666]" /> 
                        {new Date(booking.startDate).toLocaleDateString('en-GB', {day: 'numeric', month:'short'})} - {new Date(booking.endDate).toLocaleDateString('en-GB', {day: 'numeric', month:'short', year:'numeric'})}
                      </p>
                      <p className="text-[11px] text-[#666666] flex items-center gap-1.5 whitespace-nowrap">
                        <MapPin className="w-3.5 h-3.5 text-[#666666]" /> {booking.pickupLocation}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      {renderStatusBadge(booking.status)}
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-[14px] font-bold text-[#0F0F0F]">${booking.totalAmount?.toLocaleString('en-US')}</p>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/bookings/${booking._id}`} className="p-2 rounded-lg text-[#666666] hover:text-[#0F0F0F] hover:bg-white border border-transparent hover:border-[#ECECEC] transition-all" title="View Details">
                          <Eye className="w-4 h-4" />
                        </Link>
                        {['completed', 'confirmed'].includes(booking.status) && (
                          <button onClick={() => handleDownloadReceipt(booking)} className="p-2 rounded-lg text-[#666666] hover:text-[#C9A75D] hover:bg-white border border-transparent hover:border-[#ECECEC] transition-all" title="Download Receipt">
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                        {['pending', 'confirmed'].includes(booking.status) && (
                          <button 
                            onClick={() => { setBookingToCancel(booking._id); setCancelModalOpen(true); }}
                            className="p-2 rounded-lg text-[#666666] hover:text-[#DC2626] hover:bg-white border border-transparent hover:border-[#ECECEC] transition-all"
                            title="Cancel Booking"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="border-t border-[#ECECEC] p-4 flex items-center justify-between bg-[#F9F9F9]">
            <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider hidden sm:block">
              Showing {(currentPage - 1) * bookingsPerPage + 1} to {Math.min(currentPage * bookingsPerPage, filteredBookings.length)} of {filteredBookings.length}
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

      {/* Cancellation Modal */}
      <AnimatePresence>
        {cancelModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#08152E]/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white border border-[#ECECEC] rounded-2xl w-full max-w-md p-8 relative shadow-2xl"
            >
              <button onClick={() => setCancelModalOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-full bg-[#F3F4F6] text-[#08152E] hover:bg-[#E5E7EB] transition-colors">
                <X className="w-4 h-4" />
              </button>
              
              <div className="w-14 h-14 rounded-full bg-[#DC2626]/10 flex items-center justify-center mb-5 mx-auto">
                <X className="w-7 h-7 text-[#DC2626]" />
              </div>
              <h3 className="text-xl font-bold text-[#0F0F0F] text-center mb-2">Cancel Reservation?</h3>
              <p className="text-[13px] text-[#666666] text-center mb-8 leading-relaxed">
                Are you sure you want to cancel this reservation? Depending on the policy, cancellation fees may apply. This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setCancelModalOpen(false)} 
                  className="flex-1 py-3 rounded-xl border border-[#ECECEC] text-[#4B5563] font-bold text-[13px] hover:bg-[#F3F4F6] transition-colors"
                >
                  KEEP BOOKING
                </button>
                <button 
                  onClick={handleCancel} 
                  className="flex-1 py-3 rounded-xl bg-[#DC2626] text-white font-bold text-[13px] hover:shadow-lg hover:shadow-[#DC2626]/30 transition-all"
                >
                  YES, CANCEL
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
