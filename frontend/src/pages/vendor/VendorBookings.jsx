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
      case 'confirmed': return 'badge-success';
      case 'pending': return 'badge-accent';
      case 'active': return 'badge-primary';
      case 'completed': return 'badge-muted';
      case 'cancelled': return 'badge-error';
      default: return 'badge-muted';
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
            className="input pl-9"
          />
        </div>
      </div>

      {/* Booking List */}
      <div className="glass-card-elevated rounded-2xl overflow-hidden border border-border">
        {filteredBookings.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-secondary">No booking requests found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="table-premium">
              <thead>
                <tr>
                  <th>Client & Vehicle</th>
                  <th>Dates & Location</th>
                  <th>Total ($)</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="group">
                    
                    <td className="align-top">
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
                            <p className="text-caption text-muted">{booking.user?.email}</p>
                          </div>
                        </div>
                        <div className="text-body-sm text-secondary font-medium">
                          {booking.vehicle?.name}
                        </div>
                      </div>
                    </td>

                    <td className="align-top">
                      <p className="text-body-sm text-primary mb-1 flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5 text-muted" /> 
                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                      </p>
                      <p className="text-caption text-secondary flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-muted" /> {booking.pickupLocation}
                      </p>
                    </td>

                    <td className="align-top">
                      <p className="text-body-sm font-bold text-primary">${booking.totalAmount.toLocaleString('en-US')}</p>
                    </td>

                    <td className="align-top">
                      <span className={`badge ${getStatusBadge(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>

                    <td className="align-top text-right">
                      {booking.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                            className="btn-icon bg-success/10 text-success hover:bg-success hover:text-white transition-colors border-transparent"
                            title="Accept Booking"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                            className="btn-icon bg-error/10 text-error hover:bg-error hover:text-white transition-colors border-transparent"
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
