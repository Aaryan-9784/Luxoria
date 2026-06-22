import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminBookings } from '@/redux/slices/adminSlice';
import { motion } from 'framer-motion';
import { Search, CalendarDays, Eye } from 'lucide-react';

export default function AdminBookings() {
  const dispatch = useDispatch();
  const { bookings, loading, totalBookings } = useSelector(state => state.admin);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchAdminBookings());
  }, [dispatch]);

  const filteredBookings = bookings.filter(b => 
    b.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.vendor?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status) => {
    switch(status) {
      case 'confirmed': return 'badge-success';
      case 'pending': return 'badge-accent';
      case 'active': return 'badge-primary';
      case 'completed': return 'badge-muted';
      case 'cancelled': return 'badge-error';
      default: return 'badge-muted';
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-h3 text-primary mb-1">Global Bookings</h1>
          <p className="text-secondary text-sm">Master ledger of all {totalBookings} platform transactions.</p>
        </div>
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input 
            type="text" 
            placeholder="Search by ID, User, or Vendor..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-9"
          />
        </div>
      </div>

      <div className="glass-card-elevated rounded-2xl overflow-hidden border border-border">
        {loading && bookings.length === 0 ? (
          <div className="p-10 text-center animate-pulse text-muted">Loading master ledger...</div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="table-premium">
              <thead>
                <tr>
                  <th>Ref ID</th>
                  <th>Customer</th>
                  <th>Vendor</th>
                  <th>Timeline</th>
                  <th>Status</th>
                  <th className="text-right">Value ($)</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="group">
                    <td>
                      <span className="badge badge-muted font-mono">
                        {booking.bookingId.substring(0,8).toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <p className="text-body-sm font-semibold text-primary">{booking.user?.name}</p>
                      <p className="text-caption text-muted">{booking.user?.email}</p>
                    </td>
                    <td>
                      <p className="text-body-sm font-semibold text-primary">{booking.vendor?.name}</p>
                      <p className="text-[10px] text-accent uppercase tracking-widest mt-0.5">{booking.vehicle?.brand}</p>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5 text-body-sm text-secondary">
                        <CalendarDays className="w-3.5 h-3.5 text-muted" />
                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${getStatusStyle(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <span className="text-body-sm font-bold text-primary">${booking.totalAmount.toLocaleString('en-US')}</span>
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
