import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendorVehicles, fetchVendorBookings } from '@/redux/slices/vendorSlice';
import { motion } from 'framer-motion';
import { Car, Wallet, ArrowRight, ShieldAlert, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { staggerContainer, staggerItem } from '@/lib/motion';

export default function VendorOverview() {
  const dispatch = useDispatch();
  const { stats, bookings, loading } = useSelector(state => state.vendor);

  useEffect(() => {
    dispatch(fetchVendorVehicles());
    dispatch(fetchVendorBookings());
  }, [dispatch]);

  const recentRequests = bookings.filter(b => b.status === 'pending').slice(0, 4);

  if (loading) {
    return <div className="animate-pulse h-[60vh] flex items-center justify-center">Loading analytics...</div>;
  }

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-10">
      
      {/* Header */}
      <div>
        <h1 className="text-h2 text-primary mb-2">Performance Overview</h1>
        <p className="text-secondary">Monitor your fleet performance and incoming reservations.</p>
      </div>

      {/* KPI Widgets */}
      <motion.div variants={staggerItem} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: `$${stats?.totalRevenue?.toLocaleString('en-US') || 0}`, icon: Wallet, color: 'text-success', bg: 'bg-success/10' },
          { label: 'Active Rentals', value: stats?.activeRentals || 0, icon: Car, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Total Fleet', value: stats?.totalVehicles || 0, icon: BarChart3, color: 'text-accent', bg: 'bg-accent/10' },
          { label: 'Pending Approvals', value: stats?.pendingApprovals || 0, icon: ShieldAlert, color: 'text-error', bg: 'bg-error/10' },
        ].map((kpi, idx) => (
          <div key={idx} className="card-stat relative overflow-hidden group">
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-gold-subtle group-hover:scale-150 transition-transform duration-700`} />
            <div className="relative z-10 flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpi.bg} ${kpi.color}`}>
                <kpi.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-h3 text-primary mb-1">{kpi.value}</h3>
              <p className="text-caption font-semibold text-secondary uppercase tracking-wider">{kpi.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Placeholder for Chart */}
        <motion.div variants={staggerItem} className="lg:col-span-2 glass-card-elevated p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-h4 text-primary">Revenue Trends</h3>
            <select className="input py-1.5 px-3">
              <option>This Month</option>
              <option>Last 3 Months</option>
            </select>
          </div>
          <div className="h-[300px] flex items-center justify-center border border-dashed border-border rounded-xl bg-surface/50">
            <p className="text-secondary flex items-center gap-2"><BarChart3 className="w-5 h-5 text-muted" /> Chart Visualization (Integrate Recharts here)</p>
          </div>
        </motion.div>

        {/* Recent Requests */}
        <motion.div variants={staggerItem} className="glass-card-elevated p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-h4 text-primary">Pending Requests</h3>
            <Link to="/vendor/bookings" className="text-caption font-semibold text-accent hover:text-primary transition-colors">
              View All
            </Link>
          </div>
          
          <div className="flex-1 space-y-4">
            {recentRequests.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <ShieldAlert className="w-10 h-10 text-muted mb-3" />
                <p className="text-body-sm text-secondary">No pending booking requests.</p>
              </div>
            ) : (
              recentRequests.map(req => (
                <div key={req._id} className="p-4 rounded-xl border border-border hover:border-accent/30 transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-body-sm font-semibold text-primary">{req.vehicle.name}</p>
                    <span className="badge badge-accent">New</span>
                  </div>
                  <p className="text-xs text-secondary mb-3">
                    {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                  </p>
                  <Link to="/vendor/bookings" className="text-caption font-semibold text-primary flex items-center gap-1">
                    Review Request <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </motion.div>

      </div>

    </motion.div>
  );
}
