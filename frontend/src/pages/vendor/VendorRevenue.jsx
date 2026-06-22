import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendorBookings } from '@/redux/slices/vendorSlice';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { Wallet, TrendingUp, DollarSign, Download, ArrowUpRight } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function VendorRevenue() {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector(state => state.vendor);

  useEffect(() => {
    // Refresh bookings to get latest revenue data
    dispatch(fetchVendorBookings());
  }, [dispatch]);

  const completedBookings = bookings.filter(b => b.status === 'completed' || b.status === 'confirmed');
  const totalRevenue = completedBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const pendingRevenue = bookings.filter(b => b.status === 'pending').reduce((sum, b) => sum + b.totalAmount, 0);

  if (loading) {
    return <div className="animate-pulse h-[60vh] flex items-center justify-center text-secondary">Calculating Revenue...</div>;
  }

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-h2 text-primary mb-2">Revenue Analytics</h1>
          <p className="text-secondary">Track your earnings and payout history.</p>
        </div>
        <Button variant="outline" iconLeft={Download}>Export CSV</Button>
      </div>

      {/* KPI Widgets */}
      <motion.div variants={staggerItem} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-success/10 group-hover:scale-150 transition-transform duration-700" />
          <div className="relative z-10 flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-success/10 text-success">
              <Wallet className="w-6 h-6" />
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-h3 text-primary mb-1">${totalRevenue.toLocaleString('en-US')}</h3>
            <p className="text-caption font-bold text-muted uppercase tracking-wider">Total Earnings</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-accent/10 group-hover:scale-150 transition-transform duration-700" />
          <div className="relative z-10 flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-accent/10 text-accent">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-h3 text-primary mb-1">{completedBookings.length}</h3>
            <p className="text-caption font-bold text-muted uppercase tracking-wider">Completed Trips</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-warning/10 group-hover:scale-150 transition-transform duration-700" />
          <div className="relative z-10 flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-warning/10 text-warning">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-h3 text-primary mb-1">${pendingRevenue.toLocaleString('en-US')}</h3>
            <p className="text-caption font-bold text-muted uppercase tracking-wider">Projected Revenue (Pending)</p>
          </div>
        </div>
      </motion.div>

      {/* Transactions List */}
      <motion.div variants={staggerItem} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-h4 text-primary">Recent Transactions</h3>
        </div>
        
        {completedBookings.length === 0 ? (
          <div className="p-10 text-center flex flex-col items-center">
            <Wallet className="w-12 h-12 text-muted mb-4" />
            <p className="text-secondary font-medium">No transactions yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface/50 text-caption font-semibold text-muted uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Vehicle</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {completedBookings.slice(0, 10).map((booking) => (
                  <tr key={booking._id} className="hover:bg-surface/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-secondary">{booking._id.slice(-8).toUpperCase()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-body-sm font-semibold text-primary">{booking.vehicle?.name || 'Unknown Vehicle'}</span>
                    </td>
                    <td className="px-6 py-4 text-body-sm text-secondary">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-body-sm font-bold text-success flex items-center gap-1">
                        +${booking.totalAmount.toLocaleString('en-US')} <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-success/10 text-success uppercase tracking-wide">
                        Paid
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
