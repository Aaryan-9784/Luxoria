import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendorBookings, updateBookingStatus } from '@/redux/slices/vendorSlice';
import { motion } from 'framer-motion';
import { Search, CalendarDays, MapPin, Check, X as RejectIcon, User } from 'lucide-react';

export default function VendorBookings() {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector(state => state.vendor);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchVendorBookings());
  }, [dispatch]);

  const filteredBookings = bookings.filter(b => 
    b.vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch(status) {
      case 'confirmed': return 'bg-success/10 text-success border-success/20';
      case 'pending': return 'bg-accent/10 text-accent border-accent/20';
      case 'active': return 'bg-primary/10 text-primary border-primary/20';
      case 'completed': return 'bg-muted/10 text-secondary border-border';
      case 'cancelled': return 'bg-error/10 text-error border-error/20';
      default: return 'bg-surface text-secondary border-border';
    }
  };

  const handleStatusUpdate = async (id, status) => {
    // In a real app, you might want to show a confirmation modal for rejections
    await dispatch(updateBookingStatus({ id, status }));
  };

  if (loading && bookings.length === 0) {
    return <div className="animate-pulse p-10 text-center">Loading bookings...</div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-h3 text-primary mb-1">Booking Management</h1>
          <p className="text-secondary">Approve, reject, and manage your vehicle reservations.</p>
        </div>
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input 
            type="text" 
            placeholder="Search bookings or clients..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-border rounded-xl pl-9 pr-4 py-2.5 text-body-sm outline-none focus:border-accent shadow-sm"
          />
        </div>
      </div>

      {/* Booking List */}
      <div className="glass-card-elevated rounded-2xl overflow-hidden border border-border bg-white shadow-sm">
        {filteredBookings.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-secondary">No booking requests found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface/50 border-b border-border">
                  <th className="px-6 py-4 text-caption font-semibold text-secondary uppercase tracking-wider">Client & Vehicle</th>
                  <th className="px-6 py-4 text-caption font-semibold text-secondary uppercase tracking-wider">Dates & Location</th>
                  <th className="px-6 py-4 text-caption font-semibold text-secondary uppercase tracking-wider">Total (₹)</th>
                  <th className="px-6 py-4 text-caption font-semibold text-secondary uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-caption font-semibold text-secondary uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-surface/30 transition-colors">
                    
                    <td className="px-6 py-4 align-top">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                            {booking.user?.avatar?.url ? (
                              <img src={booking.user.avatar.url} alt="client" className="w-full h-full rounded-full object-cover" />
                            ) : (
                              <User className="w-4 h-4 text-accent" />
                            )}
                          </div>
                          <div>
                            <p className="text-body-sm font-semibold text-primary">{booking.user?.name}</p>
                            <p className="text-xs text-muted">{booking.user?.email}</p>
                          </div>
                        </div>
                        <div className="text-body-sm text-secondary font-medium">
                          {booking.vehicle?.name}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 align-top">
                      <p className="text-body-sm text-primary mb-1 flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5 text-muted" /> 
                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-secondary flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-muted" /> {booking.pickupLocation}
                      </p>
                    </td>

                    <td className="px-6 py-4 align-top">
                      <p className="text-body-sm font-bold text-primary">₹{booking.totalAmount.toLocaleString('en-IN')}</p>
                    </td>

                    <td className="px-6 py-4 align-top">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider border ${getStatusBadge(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 align-top text-right">
                      {booking.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                            className="w-8 h-8 rounded-full bg-success/10 text-success hover:bg-success hover:text-white flex items-center justify-center transition-colors"
                            title="Accept Booking"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                            className="w-8 h-8 rounded-full bg-error/10 text-error hover:bg-error hover:text-white flex items-center justify-center transition-colors"
                            title="Reject Booking"
                          >
                            <RejectIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button className="text-caption font-semibold text-accent hover:text-primary transition-colors">View Details</button>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </motion.div>
  );
}
