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
      case 'confirmed': return 'bg-success/10 text-success border-success/20';
      case 'pending': return 'bg-accent/10 text-accent border-accent/20';
      case 'active': return 'bg-primary/10 text-primary border-primary/20';
      case 'completed': return 'bg-muted/10 text-secondary border-border';
      case 'cancelled': return 'bg-error/10 text-error border-error/20';
      default: return 'bg-surface text-secondary border-border';
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
    return <div className="animate-pulse">Loading bookings...</div>;
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
              className="w-full bg-surface border border-border rounded-lg pl-9 pr-4 py-2.5 text-body-sm outline-none focus:border-accent transition-colors"
            />
          </div>
          <button className="btn-icon bg-surface border border-border rounded-lg hover:border-accent transition-colors">
            <Filter className="w-5 h-5 text-secondary" />
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
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface/50 border-b border-border">
                  <th className="px-6 py-4 text-caption font-semibold text-secondary uppercase tracking-wider">Vehicle</th>
                  <th className="px-6 py-4 text-caption font-semibold text-secondary uppercase tracking-wider">Dates & Location</th>
                  <th className="px-6 py-4 text-caption font-semibold text-secondary uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-caption font-semibold text-secondary uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 text-caption font-semibold text-secondary uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-surface/30 transition-colors group">
                    <td className="px-6 py-4 align-top">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0">
                          <img src={booking.vehicle.images[0]?.url} alt={booking.vehicle.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-body-sm font-semibold text-primary">{booking.vehicle.name}</p>
                          <p className="text-xs text-muted uppercase tracking-wider">ID: {booking.bookingId.substring(0,8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <p className="text-body-sm text-primary mb-1 flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5 text-muted" /> 
                        {new Date(booking.startDate).toLocaleDateString('en-GB', {day: 'numeric', month:'short'})} - {new Date(booking.endDate).toLocaleDateString('en-GB', {day: 'numeric', month:'short', year:'numeric'})}
                      </p>
                      <p className="text-xs text-secondary flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-muted" /> {booking.pickupLocation}
                      </p>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider border ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <p className="text-body-sm font-semibold text-primary">₹{booking.totalAmount.toLocaleString('en-IN')}</p>
                    </td>
                    <td className="px-6 py-4 align-top text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link to={`/bookings/${booking._id}`} className="text-caption font-semibold text-accent hover:text-primary transition-colors">Details</Link>
                        {['pending', 'confirmed'].includes(booking.status) && (
                          <button 
                            onClick={() => { setBookingToCancel(booking._id); setCancelModalOpen(true); }}
                            className="text-caption font-semibold text-error hover:text-error/80 transition-colors ml-3"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card-elevated w-full max-w-md p-8 rounded-3xl relative"
          >
            <button onClick={() => setCancelModalOpen(false)} className="absolute top-6 right-6 text-muted hover:text-primary">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-h4 text-primary mb-2">Cancel Booking</h3>
            <p className="text-secondary mb-6 text-sm">Are you sure you want to cancel this reservation? Depending on the policy, cancellation fees may apply.</p>
            <div className="flex gap-4 justify-end">
              <button onClick={() => setCancelModalOpen(false)} className="btn btn-outline">Keep Booking</button>
              <button onClick={handleCancel} className="btn bg-error text-white hover:bg-error/90">Yes, Cancel</button>
            </div>
          </motion.div>
        </div>
      )}

    </motion.div>
  );
}
