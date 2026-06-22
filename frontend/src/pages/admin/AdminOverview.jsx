import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnalytics } from '@/redux/slices/adminSlice';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { Users, Building2, Car, Wallet, TrendingUp, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminOverview() {
  const dispatch = useDispatch();
  const { analytics, loading } = useSelector(state => state.admin);

  useEffect(() => {
    dispatch(fetchAnalytics());
  }, [dispatch]);

  if (loading || !analytics) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-secondary font-medium uppercase tracking-widest text-sm animate-pulse">Syncing Enterprise Data</p>
      </div>
    );
  }

  const KPI_DATA = [
    { label: 'Total Revenue', value: `$${analytics.revenue.totalAmount.toLocaleString('en-US')}`, icon: Wallet, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Total Users', value: analytics.users.total, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Active Vendors', value: analytics.users.vendors, icon: Building2, color: 'text-[#8B5CF6]', bg: 'bg-[#8B5CF6]/10' },
    { label: 'Approved Fleet', value: analytics.vehicles.approved, icon: Car, color: 'text-accent', bg: 'bg-accent/10' },
  ];

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-10">
      
      {/* Header */}
      <div>
        <h1 className="text-h2 text-primary mb-2 font-bold tracking-tight">System Overview</h1>
        <p className="text-secondary text-lg">Real-time enterprise analytics and platform health.</p>
      </div>

      {/* KPI Widgets */}
      <motion.div variants={staggerItem} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {KPI_DATA.map((kpi, idx) => (
          <div key={idx} className="card-stat relative overflow-hidden group">
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-gold-subtle group-hover:scale-150 transition-transform duration-700`} />
            <div className="relative z-10 flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpi.bg} ${kpi.color}`}>
                <kpi.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-h3 text-primary mb-1">{kpi.value}</h3>
              <p className="text-caption font-bold text-secondary uppercase tracking-wider">{kpi.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Action Center */}
        <motion.div variants={staggerItem} className="lg:col-span-1 space-y-6">
          <div className="glass-card-elevated p-6">
            <h3 className="text-h4 text-primary mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-accent" /> Action Items
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-surface/50 transition-colors hover:bg-surface">
                <div>
                  <p className="font-semibold text-primary">{analytics.vehicles.pending}</p>
                  <p className="text-caption text-secondary uppercase tracking-wider">Pending Vehicles</p>
                </div>
                <Link to="/admin/vehicles" className="text-accent text-body-sm font-semibold hover:text-accent-hover transition-colors">Review &rarr;</Link>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-surface/50 transition-colors hover:bg-surface">
                <div>
                  <p className="font-semibold text-primary">{analytics.bookings.pending}</p>
                  <p className="text-caption text-secondary uppercase tracking-wider">Pending Bookings</p>
                </div>
                <Link to="/admin/bookings" className="text-accent text-body-sm font-semibold hover:text-accent-hover transition-colors">View &rarr;</Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Breakdown Charts Placeholder */}
        <motion.div variants={staggerItem} className="lg:col-span-2 glass-card-elevated p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-h4 text-primary">Booking Distribution</h3>
          </div>
          
          <div className="flex-1 flex flex-col justify-center gap-8">
            <div className="space-y-2">
              <div className="flex justify-between text-body-sm font-medium">
                <span className="text-secondary">Completed</span>
                <span className="text-primary">{analytics.bookings.completed}</span>
              </div>
              <div className="w-full bg-surface h-2 rounded-full overflow-hidden">
                <div className="bg-success h-full rounded-full transition-all duration-1000" style={{ width: `${(analytics.bookings.completed / analytics.bookings.total) * 100}%` }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-body-sm font-medium">
                <span className="text-secondary">Confirmed</span>
                <span className="text-primary">{analytics.bookings.confirmed}</span>
              </div>
              <div className="w-full bg-surface h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: `${(analytics.bookings.confirmed / analytics.bookings.total) * 100}%` }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-body-sm font-medium">
                <span className="text-secondary">Cancelled</span>
                <span className="text-primary">{analytics.bookings.cancelled}</span>
              </div>
              <div className="w-full bg-surface h-2 rounded-full overflow-hidden">
                <div className="bg-error h-full rounded-full transition-all duration-1000" style={{ width: `${(analytics.bookings.cancelled / analytics.bookings.total) * 100}%` }} />
              </div>
            </div>
          </div>
        </motion.div>

      </div>

    </motion.div>
  );
}
