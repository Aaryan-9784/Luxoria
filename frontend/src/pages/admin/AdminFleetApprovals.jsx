import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminVehicles, approveVehicle, deleteAdminVehicle } from '@/redux/slices/adminSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Clock, XCircle, CheckCircle2, ChevronRight, Car, AlertCircle, FileText, Image as ImageIcon, ArrowUpRight, ArrowDownRight, Trash2, Download } from 'lucide-react';
import CountUp from 'react-countup';

export default function AdminFleetApprovals() {
  const dispatch = useDispatch();
  const { vehicles, loading } = useSelector(state => state.admin);
  const { accessToken } = useSelector(state => state.auth);
  const [filter, setFilter] = useState('pending');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!accessToken) return;
    dispatch(fetchAdminVehicles());
  }, [dispatch, accessToken]);

  const kpis = {
    pending: vehicles.filter(v => v.status === 'pending').length,
    approved: vehicles.filter(v => v.status === 'approved').length,
    rejected: vehicles.filter(v => v.status === 'rejected').length,
    avgTime: '2.4h' // Mocked avg time for now
  };

  const filteredVehicles = filter === 'all' ? vehicles : vehicles.filter(v => v.status === filter);

  const handleApprove = async (id) => {
    await dispatch(approveVehicle({ id, status: 'approved' }));
  };

  const handleReject = async (id) => {
    await dispatch(approveVehicle({ id, status: 'rejected' }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this vehicle? This cannot be undone.')) return;
    await dispatch(deleteAdminVehicle(id));
  };

  const handleExportReport = () => {
    setExporting(true);

    try {
      const headers = ['Vehicle ID', 'Brand', 'Model', 'Year', 'Category', 'Status', 'Price/Day ($)', 'Vendor', 'Submitted Date', 'Has Images'];
      const rows = filteredVehicles.map(v => [
        v._id,
        v.brand || '',
        v.model || v.name || '',
        v.year || '',
        v.category || '',
        v.status || '',
        v.pricePerDay || '',
        v.vendor?.name || (typeof v.vendor === 'string' ? v.vendor : 'N/A'),
        v.createdAt ? new Date(v.createdAt).toLocaleDateString('en-GB') : '',
        v.images && v.images.length > 0 ? 'Yes' : 'No',
      ]);

      const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const filterLabel = filter === 'all' ? 'all' : filter;
      link.href = url;
      link.download = `fleet-approvals-${filterLabel}-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#0F0F0F] tracking-tight mb-1.5" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Fleet Approvals</h1>
          <p className="text-[#666666] text-sm font-medium tracking-wide">Review and curate incoming vehicle submissions to maintain fleet standards.</p>
        </div>
        <button
          onClick={handleExportReport}
          disabled={exporting}
          className="flex items-center gap-2 bg-[#0F0F0F] text-white px-5 py-2.5 rounded-xl text-[12px] font-bold uppercase tracking-wider hover:bg-[#C9A75D] transition-colors shadow-lg shadow-[#0F0F0F]/10 whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {exporting ? (
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {exporting ? 'Exporting...' : 'Export Report'}
        </button>
      </div>

      {/* KPI Grid (Matched to AdminOverview theme) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Pending Review', value: kpis.pending, icon: Clock, prefix: '', trend: '+2', isUp: false }, // More pending is bad
          { title: 'Approved (This Week)', value: kpis.approved, icon: ShieldCheck, prefix: '', trend: '+15%', isUp: true },
          { title: 'Rejected', value: kpis.rejected, icon: XCircle, prefix: '', trend: '-1', isUp: true },
          { title: 'Avg. Review Time', value: 0, overrideValue: kpis.avgTime, icon: Clock, prefix: '', trend: '-0.5h', isUp: true },
        ].map((kpi, idx) => (
          <div key={idx} className="relative overflow-hidden group bg-white border border-[#ECECEC] rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 cursor-default flex flex-col justify-between h-full min-h-[160px]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C9A75D] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#0F0F0F] text-[#C9A75D] group-hover:scale-110 transition-transform duration-500 shadow-md">
                <kpi.icon className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${kpi.isUp ? 'bg-[#16A34A]/10 text-[#16A34A]' : 'bg-[#DC2626]/10 text-[#DC2626]'}`}>
                {kpi.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {kpi.trend}
              </div>
            </div>
            
            <div className="relative z-10 mt-auto">
              <h3 className="text-[32px] font-bold text-[#0F0F0F] tracking-tight mb-1">
                {kpi.overrideValue ? kpi.overrideValue : <>{kpi.prefix}<CountUp end={kpi.value} duration={2} separator="," /></>}
              </h3>
              <p className="text-[11px] font-bold text-[#666666] uppercase tracking-[0.15em]">{kpi.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Review Queue */}
      <div className="bg-white border border-[#ECECEC] rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Controls */}
        <div className="p-6 border-b border-[#ECECEC] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FDFBF7]">
          <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#0F0F0F] flex items-center gap-2">
            <Car className="w-4 h-4 text-[#C9A75D]" /> Submission Queue
          </h3>
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'approved', 'rejected'].map(status => (
              <button 
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all ${
                  filter === status 
                    ? 'bg-[#0F0F0F] text-white shadow-md' 
                    : 'bg-white border border-[#ECECEC] text-[#666666] hover:border-[#C9A75D] hover:text-[#0F0F0F]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Queue List */}
        <div className="divide-y divide-[#ECECEC]">
          <AnimatePresence>
            {loading && vehicles.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#C9A75D] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-[12px] font-bold text-[#666666] uppercase tracking-widest">Loading Vehicles...</p>
              </div>
            ) : filteredVehicles.map((req) => (
              <motion.div 
                key={req._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6 hover:bg-[#F9F9F9] transition-colors group flex flex-col lg:flex-row gap-6"
              >
                {/* Thumbnail */}
                <div className="w-full lg:w-48 h-32 rounded-xl overflow-hidden shrink-0 relative bg-[#F5F5F5] flex items-center justify-center">
                  {req.images && req.images.length > 0 ? (
                    <img src={req.images[0].url} alt={req.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <Car className="w-8 h-8 text-[#ECECEC]" />
                  )}
                  <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] font-bold text-white uppercase tracking-wider">
                    {req._id.substring(0,8)}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="text-[11px] font-bold text-[#C9A75D] uppercase tracking-wider mb-1">{req.category}</p>
                      <h4 className="text-xl font-serif text-[#0F0F0F] mb-1">{req.year} {req.brand} {req.model || req.name}</h4>
                      <p className="text-[13px] text-[#666666]">Submitted by <span className="font-bold text-[#0F0F0F]">{req.vendor?.name || (typeof req.vendor === 'string' ? req.vendor : 'Sovereign Elite Mobility')}</span> on {new Date(req.createdAt || req.submitted).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#0F0F0F]">${req.pricePerDay}<span className="text-[12px] text-[#666666] font-normal">/day</span></p>
                    </div>
                  </div>

                  {/* Quality Checks */}
                  <div className="flex flex-wrap items-center gap-4 mt-2">
                    <div className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#16A34A]`}>
                      <CheckCircle2 className="w-4 h-4" /> Specs Verified
                    </div>
                    <div className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider ${req.images && req.images.length > 0 ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                      {req.images && req.images.length > 0 ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      High-Res Media
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex lg:flex-col items-center lg:items-end justify-center gap-3 shrink-0 lg:border-l lg:border-[#ECECEC] lg:pl-6">
                  {req.status !== 'approved' && (
                    <button 
                      onClick={() => handleApprove(req._id)}
                      className="w-full sm:w-auto lg:w-40 flex items-center justify-center gap-2 bg-[#0F0F0F] text-white px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-[#C9A75D] transition-colors shadow-md"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve
                    </button>
                  )}
                  {req.status !== 'rejected' && (
                    <button 
                      onClick={() => handleReject(req._id)}
                      className="w-full sm:w-auto lg:w-40 flex items-center justify-center gap-2 bg-white text-[#DC2626] px-5 py-2.5 rounded-xl border border-[#ECECEC] text-[11px] font-bold uppercase tracking-wider hover:bg-[#DC2626]/10 hover:border-[#DC2626]/10 transition-colors"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  )}
                  {req.status === 'rejected' && (
                    <button
                      onClick={() => handleDelete(req._id)}
                      className="w-full sm:w-auto lg:w-40 flex items-center justify-center gap-2 bg-[#DC2626] text-white px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-[#B91C1C] transition-colors shadow-md"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {!loading && filteredVehicles.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center bg-[#FDFBF7]/50">
              <ShieldCheck className="w-16 h-16 text-[#ECECEC] mb-4" />
              <h3 className="text-lg font-serif text-[#0F0F0F] mb-1">Queue Empty</h3>
              <p className="text-[12px] font-bold text-[#666666] uppercase tracking-widest">No vehicles found in this category</p>
            </div>
          )}
        </div>
      </div>

    </motion.div>
  );
}
