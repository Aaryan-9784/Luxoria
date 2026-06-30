import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminBookings } from '@/redux/slices/adminSlice';
import { motion } from 'framer-motion';
import { Search, CalendarDays, Download, Filter, ChevronLeft, ChevronRight, Hash, Eye } from 'lucide-react';
import CustomSelect from '@/components/ui/CustomSelect';

export default function AdminBookings() {
  const dispatch = useDispatch();
  const { bookings, loading, totalBookings } = useSelector(state => state.admin);
  const { accessToken } = useSelector(state => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'pending', 'confirmed', 'completed', 'cancelled'
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 10;

  useEffect(() => {
    if (!accessToken) return;
    dispatch(fetchAdminBookings());
  }, [dispatch, accessToken]);

  // Filtering
  const filteredBookings = bookings.filter(b => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (b.bookingId && b.bookingId.toLowerCase().includes(term)) ||
      (b.user?.name && b.user.name.toLowerCase().includes(term)) ||
      (b.vendor?.name && b.vendor.name.toLowerCase().includes(term));
    const matchesStatus = filterStatus === 'all' ? true : b.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);
  const paginatedBookings = filteredBookings.slice((currentPage - 1) * bookingsPerPage, currentPage * bookingsPerPage);

  const handleExport = () => {
    const csvRows = ["Ref ID,Customer,Vendor,Vehicle,Start Date,End Date,Status,Total Amount"];
    filteredBookings.forEach(b => {
      const customer = `"${(b.user?.name || 'Unknown').replace(/"/g, '""')}"`;
      const vendor = `"${(b.vendor?.name || 'Unknown').replace(/"/g, '""')}"`;
      const vehicle = `"${(b.vehicle?.brand || '').replace(/"/g, '""')}"`;
      csvRows.push(`${b.bookingId},${customer},${vendor},${vehicle},${new Date(b.startDate).toLocaleDateString()},${new Date(b.endDate).toLocaleDateString()},${b.status},${b.totalAmount || 0}`);
    });
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "luxoria_global_bookings.csv");
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
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0F0F0F]/5 border border-[#0F0F0F]/10 text-[10px] font-bold uppercase tracking-wider text-[#666666] whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-[#666666]"></span> Confirmed
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
          <h1 className="text-3xl font-serif text-[#0F0F0F] tracking-tight mb-2">Global Bookings</h1>
          <p className="text-[13px] text-[#666666] tracking-wide">Master ledger of all {totalBookings} platform transactions.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666]" />
            <input 
              type="text" 
              placeholder="Search by ID, User, or Vendor..." 
              value={searchTerm}
              onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
              className="w-full bg-white border border-[#ECECEC] rounded-xl pl-10 pr-4 py-2.5 text-[13px] text-[#0F0F0F] placeholder-[#999999] focus:outline-none focus:border-[#C9A75D] transition-colors"
            />
          </div>

          {/* Filter */}
          <CustomSelect
            value={filterStatus}
            onChange={(val) => {setFilterStatus(val); setCurrentPage(1);}}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'pending', label: 'Pending' },
              { value: 'confirmed', label: 'Confirmed' },
              { value: 'completed', label: 'Completed' },
              { value: 'cancelled', label: 'Cancelled' }
            ]}
          />

          {/* Export */}
          <button onClick={handleExport} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0F0F0F] text-white px-5 py-2.5 rounded-xl text-[12px] font-bold uppercase tracking-wider hover:bg-[#1A1A1A] transition-colors shadow-lg shadow-[#0F0F0F]/10">
            <Download className="w-4 h-4 text-[#C9A75D]" /> Export
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-[#ECECEC] rounded-2xl shadow-sm overflow-hidden">
        {loading && bookings.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center">
             <div className="w-8 h-8 border-4 border-[#C9A75D] border-t-transparent rounded-full animate-spin mb-4" />
             <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider animate-pulse">Loading Master Ledger...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F9F9F9] border-b border-[#ECECEC]">
                  <th className="py-4 px-6 text-[11px] font-bold text-[#666666] uppercase tracking-wider whitespace-nowrap">Ref ID</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-[#666666] uppercase tracking-wider whitespace-nowrap">Customer</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-[#666666] uppercase tracking-wider whitespace-nowrap">Vendor</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-[#666666] uppercase tracking-wider whitespace-nowrap">Timeline</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-[#666666] uppercase tracking-wider whitespace-nowrap">Status</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-[#666666] uppercase tracking-wider text-right whitespace-nowrap">Value ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECECEC]">
                {paginatedBookings.length > 0 ? paginatedBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-[#F5F5F5]/50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#ECECEC] bg-white text-[11px] font-mono font-bold text-[#666666] whitespace-nowrap">
                        <Hash className="w-3 h-3 text-[#C9A75D]" />
                        {booking.bookingId.substring(0,8).toUpperCase()}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-[13px] font-bold text-[#0F0F0F] whitespace-nowrap">{booking.user?.name}</p>
                      <p className="text-[11px] text-[#666666] mt-0.5 whitespace-nowrap">{booking.user?.email}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-[13px] font-bold text-[#0F0F0F] whitespace-nowrap">{booking.vendor?.name}</p>
                      <p className="text-[10px] text-[#C9A75D] font-bold uppercase tracking-widest mt-0.5 whitespace-nowrap">{booking.vehicle?.brand}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-[12px] font-medium text-[#0F0F0F] whitespace-nowrap">
                        <CalendarDays className="w-4 h-4 text-[#666666]" />
                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {renderStatusBadge(booking.status)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="text-[14px] font-bold text-[#0F0F0F] whitespace-nowrap">
                        ${booking.totalAmount?.toLocaleString('en-US') || '0'}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-[#666666]">
                        <Search className="w-8 h-8 mb-3 opacity-20" />
                        <p className="text-[13px] font-medium">No transactions found matching your criteria.</p>
                      </div>
                    </td>
                  </tr>
                )}
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

    </motion.div>
  );
}
