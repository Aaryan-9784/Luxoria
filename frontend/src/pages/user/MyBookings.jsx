import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyBookings, cancelBooking } from '@/redux/slices/dashboardSlice';
import { motion } from 'framer-motion';
import { CalendarDays, MapPin, Search, Filter, MoreVertical, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MyBookings() {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector(state => state.dashboard);
  const [searchTerm, setSearchTerm] = useState('');
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  const filteredBookings = bookings.filter(b => 
    b.vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.bookingId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'badge-success';
      case 'pending': return 'badge-accent';
      case 'active': return 'badge-primary';
      case 'completed': return 'badge-muted';
      case 'cancelled': return 'badge-error';
      default: return 'badge-muted';
    }
  };

  const handleCancel = async () => {
    if (bookingToCancel) {
      await dispatch(cancelBooking({ id: bookingToCancel, reason: 'User requested cancellation from dashboard' }));
      setCancelModalOpen(false);
      setBookingToCancel(null);
    }
  };

  if (loading && bookings.length === 0) {
    return <div className="animate-pulse text-secondary text-body-sm">Loading bookings...</div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-h3 text-primary mb-1">My Bookings</h1>
          <p className="text-secondary">Manage your luxury reservations</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input 
              type="text" 
              placeholder="Search by vehicle or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-9"
            />
          </div>
          <button className="btn-icon border border-border hover:border-primary transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Booking History Table / Cards */}
      <div className="glass-card-elevated rounded-2xl overflow-hidden border border-border">
        {filteredBookings.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-secondary">No bookings found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="table-premium">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Dates & Location</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="group">
                    <td>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0">
                          <img src={booking.vehicle.images[0]?.url} alt={booking.vehicle.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-body-sm font-semibold text-primary">{booking.vehicle.name}</p>
                          <p className="text-caption text-muted uppercase tracking-wider">ID: {booking.bookingId.substring(0,8)}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p className="text-body-sm text-primary mb-1 flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5 text-muted" /> 
                        {new Date(booking.startDate).toLocaleDateString('en-GB', {day: 'numeric', month:'short'})} - {new Date(booking.endDate).toLocaleDateString('en-GB', {day: 'numeric', month:'short', year:'numeric'})}
                      </p>
                      <p className="text-caption text-secondary flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-muted" /> {booking.pickupLocation}
                      </p>
                    </td>
                    <td>
                      <span className={`badge ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td>
                      <p className="text-body-sm font-semibold text-primary">${booking.totalAmount.toLocaleString('en-US')}</p>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link to={`/bookings/${booking._id}`} className="btn btn-ghost btn-sm">Details</Link>
                        {['pending', 'confirmed'].includes(booking.status) && (
                          <button 
                            onClick={() => { setBookingToCancel(booking._id); setCancelModalOpen(true); }}
                            className="btn btn-ghost btn-sm text-error hover:text-error"
                          >
                            Cancel
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
      </div>

      {/* Cancellation Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 glass-overlay">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card w-full max-w-md p-8 relative"
          >
            <button onClick={() => setCancelModalOpen(false)} className="btn-icon absolute top-4 right-4">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-h4 text-primary mb-2">Cancel Booking</h3>
            <p className="text-body-sm text-secondary mb-6">Are you sure you want to cancel this reservation? Depending on the policy, cancellation fees may apply.</p>
            <div className="flex gap-4 justify-end">
              <button onClick={() => setCancelModalOpen(false)} className="btn btn-outline">Keep Booking</button>
              <button onClick={handleCancel} className="btn btn-danger">Yes, Cancel</button>
            </div>
          </motion.div>
        </div>
      )}

    </motion.div>
  );
}
