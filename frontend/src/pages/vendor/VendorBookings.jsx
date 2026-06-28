import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendorBookings, updateBookingStatus } from '@/redux/slices/vendorSlice';
import { motion } from 'framer-motion';
import { Search, CalendarDays, MapPin, Check, X as RejectIcon, User, Filter, AlertCircle, FileText } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/motion';
import CustomSelect from '@/components/ui/CustomSelect';

export default function VendorBookings() {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector(state => state.vendor);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchVendorBookings());
  }, [dispatch]);

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.vehicle?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.bookingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case 'confirmed': return <span className="bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-max shadow-sm"><Check className="w-3 h-3" /> Confirmed</span>;
      case 'pending': return <span className="bg-[#C9A75D]/10 text-[#B59345] border border-[#C9A75D]/30 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-max shadow-sm"><AlertCircle className="w-3 h-3" /> Pending</span>;
      case 'completed': return <span className="bg-[#F5F5F5] text-[#0F0F0F] border border-[#ECECEC] px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-max shadow-sm"><Check className="w-3 h-3" /> Completed</span>;
      case 'cancelled': return <span className="bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/20 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-max shadow-sm"><RejectIcon className="w-3 h-3" /> Cancelled</span>;
      default: return <span className="bg-[#F5F5F5] text-[#666666] border border-[#ECECEC] px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider w-max shadow-sm">{status}</span>;
    }
  };

  const handleStatusUpdate = async (id, status) => {
    if(window.confirm(`Are you sure you want to ${status === 'cancelled' ? 'reject' : 'accept'} this booking?`)) {
      await dispatch(updateBookingStatus({ id, status }));
    }
  };

  if (loading && bookings.length === 0) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#C9A75D] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[#666666] font-bold uppercase tracking-widest text-[11px] animate-pulse">Loading Reservations</p>
      </div>
    );
  }

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-8 pb-10">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-2">
        <div>
          <h1 className="text-[28px] font-bold text-[#0F0F0F] tracking-tight mb-1.5" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Booking Management</h1>
          <p className="text-[#666666] text-sm font-medium tracking-wide">Approve, reject, and manage your vehicle reservations.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <input 
              type="text" 
              placeholder="Search bookings or clients..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-[#ECECEC] text-[#0F0F0F] text-[13px] py-3 pl-11 pr-4 rounded-xl focus:outline-none focus:border-[#C9A75D] transition-all placeholder:text-[#9CA3AF] shadow-sm"
            />
          </div>
          <div className="relative w-full sm:w-48">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none z-10" />
            <CustomSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'pending', label: 'Pending' },
                { value: 'confirmed', label: 'Confirmed' },
                { value: 'completed', label: 'Completed' },
                { value: 'cancelled', label: 'Cancelled' }
              ]}
              icon={null}
              className="w-full text-[13px] py-3 pl-11 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Booking List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white border border-[#ECECEC] rounded-2xl p-16 text-center shadow-sm">
          <FileText className="w-12 h-12 text-[#ECECEC] mx-auto mb-4" />
          <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#0F0F0F] mb-2">No Bookings Found</h3>
          <p className="text-[#666666] text-[13px] font-medium">
            {searchTerm || statusFilter !== 'all' ? "No bookings match your search and filter criteria." : "You don't have any booking requests yet."}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-[#ECECEC] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F5F5F5] border-b border-[#ECECEC]">
                  <th className="py-4 px-6 text-[10px] font-bold text-[#666666] uppercase tracking-wider">Client & Vehicle</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-[#666666] uppercase tracking-wider">Dates & Location</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-[#666666] uppercase tracking-wider">Total ($)</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-[#666666] uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-[#666666] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECECEC]">
                {filteredBookings.map((booking) => (
                  <motion.tr variants={staggerItem} key={booking._id} className="hover:bg-[#F5F5F5]/50 transition-colors group">
                    
                    <td className="py-5 px-6 align-top">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#F5F5F5] border border-[#ECECEC] flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                            {booking.user?.avatar?.url ? (
                              <img src={booking.user.avatar.url} alt="client" className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-5 h-5 text-[#9CA3AF]" />
                            )}
                          </div>
                          <div>
                            <p className="text-[14px] font-bold text-[#0F0F0F]">{booking.user?.name || 'Unknown User'}</p>
                            <p className="text-[11px] text-[#666666]">{booking.user?.email || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="text-[12px] font-bold text-[#0F0F0F] border-t border-[#ECECEC] pt-3 mt-1 inline-block">
                          {booking.vehicle?.name || 'Unknown Vehicle'}
                        </div>
                      </div>
                    </td>

                    <td className="py-5 px-6 align-top">
                      <p className="text-[13px] font-bold text-[#0F0F0F] mb-1.5 flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-[#C9A75D]" /> 
                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                      </p>
                      <p className="text-[12px] text-[#666666] flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#9CA3AF]" /> {booking.pickupLocation}
                      </p>
                    </td>

                    <td className="py-5 px-6 align-top">
                      <p className="text-[16px] font-bold text-[#0F0F0F]">${booking.totalAmount?.toLocaleString('en-US')}</p>
                    </td>

                    <td className="py-5 px-6 align-top">
                      {getStatusBadge(booking.status)}
                    </td>

                    <td className="py-5 px-6 align-top text-right">
                      {booking.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                            className="flex items-center justify-center w-9 h-9 rounded-full bg-[#16A34A]/10 text-[#16A34A] hover:bg-[#16A34A] hover:text-white transition-all shadow-sm"
                            title="Accept Booking"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                            className="flex items-center justify-center w-9 h-9 rounded-full bg-[#DC2626]/10 text-[#DC2626] hover:bg-[#DC2626] hover:text-white transition-all shadow-sm"
                            title="Reject Booking"
                          >
                            <RejectIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button className="text-[10px] font-bold uppercase tracking-wider text-[#C9A75D] hover:text-[#0F0F0F] transition-colors py-2 px-3 border border-transparent hover:border-[#ECECEC] rounded-lg hover:bg-white hover:shadow-sm inline-block">
                          View Details
                        </button>
                      )}
                    </td>

                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </motion.div>
  );
}
