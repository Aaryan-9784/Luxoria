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
      case 'confirmed': return 'bg-success/10 text-success';
      case 'pending': return 'bg-accent/10 text-accent';
      case 'active': return 'bg-primary/10 text-primary';
      case 'completed': return 'bg-surface text-secondary';
      case 'cancelled': return 'bg-error/10 text-error';
      default: return 'bg-surface text-secondary';
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
            className="w-full bg-white border border-border rounded-xl pl-9 pr-4 py-2 text-body-sm outline-none focus:border-accent shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
        {loading && bookings.length === 0 ? (
          <div className="p-10 text-center animate-pulse text-muted">Loading master ledger...</div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface/50 border-b border-border">
                  <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Ref ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Vendor</th>
                  <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Timeline</th>
                  <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider text-right">Value ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-surface/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs bg-surface border border-border px-2 py-1 rounded text-primary">
                        {booking.bookingId.substring(0,8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-primary">{booking.user?.name}</p>
                      <p className="text-xs text-muted">{booking.user?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-primary">{booking.vendor?.name}</p>
                      <p className="text-xs text-accent uppercase tracking-widest mt-0.5">{booking.vehicle?.brand}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-secondary">
                        <CalendarDays className="w-3.5 h-3.5 text-muted" />
                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${getStatusStyle(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-primary">${booking.totalAmount.toLocaleString('en-US')}</span>
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
