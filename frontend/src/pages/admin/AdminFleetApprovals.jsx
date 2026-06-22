import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Clock, XCircle, CheckCircle2, ChevronRight, Car, AlertCircle, FileText, Image as ImageIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import CountUp from 'react-countup';

export default function AdminFleetApprovals() {
  const [filter, setFilter] = useState('pending');

  // Mock Data
  const [approvals, setApprovals] = useState([
    {
      id: 'REQ-092',
      vendor: 'Elite Motors',
      vehicle: { make: 'Rolls-Royce', model: 'Phantom Series II', year: 2024, price: 1800, class: 'Luxury Sedan' },
      submitted: '2026-06-22',
      status: 'pending',
      checks: { specs: true, photos: true, insurance: false },
      image: 'https://images.unsplash.com/photo-1631259596396-1f900a6e0c70?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'REQ-091',
      vendor: 'Prestige Exotics',
      vehicle: { make: 'Lamborghini', model: 'Aventador SVJ', year: 2023, price: 2500, class: 'Supercar' },
      submitted: '2026-06-21',
      status: 'pending',
      checks: { specs: true, photos: false, insurance: true },
      image: 'https://images.unsplash.com/photo-1544636331-e26879cd30c2?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'REQ-090',
      vendor: 'Crown Classics',
      vehicle: { make: 'Bentley', model: 'Continental GT', year: 2025, price: 1200, class: 'Luxury Coupe' },
      submitted: '2026-06-20',
      status: 'pending',
      checks: { specs: true, photos: true, insurance: true },
      image: 'https://images.unsplash.com/photo-1620882814836-88a2c88bdff8?auto=format&fit=crop&q=80&w=600'
    }
  ]);

  const kpis = {
    pending: 12,
    approved: 45,
    rejected: 3,
    avgTime: '4.2h'
  };

  const handleApprove = (id) => {
    setApprovals(approvals.filter(a => a.id !== id));
    // In a real app, make API call here
  };

  const handleReject = (id) => {
    setApprovals(approvals.filter(a => a.id !== id));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-[#0F0F0F] tracking-tight mb-2">Fleet Approvals</h1>
          <p className="text-[13px] text-[#666666] tracking-wide">Review and curate incoming vehicle submissions to maintain fleet standards.</p>
        </div>
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
                {kpi.isUp ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
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
          <div className="flex gap-2">
            {['pending', 'in-review', 'action-required'].map(status => (
              <button 
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all ${
                  filter === status 
                    ? 'bg-[#0F0F0F] text-white shadow-md' 
                    : 'bg-white border border-[#ECECEC] text-[#666666] hover:border-[#C9A75D] hover:text-[#0F0F0F]'
                }`}
              >
                {status.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Queue List */}
        <div className="divide-y divide-[#ECECEC]">
          <AnimatePresence>
            {approvals.map((req) => (
              <motion.div 
                key={req.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6 hover:bg-[#F9F9F9] transition-colors group flex flex-col lg:flex-row gap-6"
              >
                {/* Thumbnail */}
                <div className="w-full lg:w-48 h-32 rounded-xl overflow-hidden shrink-0 relative">
                  <img src={req.image} alt={req.vehicle.model} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] font-bold text-white uppercase tracking-wider">
                    {req.id}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="text-[11px] font-bold text-[#C9A75D] uppercase tracking-wider mb-1">{req.vehicle.class}</p>
                      <h4 className="text-xl font-serif text-[#0F0F0F] mb-1">{req.vehicle.year} {req.vehicle.make} {req.vehicle.model}</h4>
                      <p className="text-[13px] text-[#666666]">Submitted by <span className="font-bold text-[#0F0F0F]">{req.vendor}</span> on {new Date(req.submitted).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#0F0F0F]">${req.vehicle.price}<span className="text-[12px] text-[#666666] font-normal">/day</span></p>
                    </div>
                  </div>

                  {/* Quality Checks */}
                  <div className="flex flex-wrap items-center gap-4 mt-2">
                    <div className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider ${req.checks.specs ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                      {req.checks.specs ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      Specs Verified
                    </div>
                    <div className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider ${req.checks.photos ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                      {req.checks.photos ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      High-Res Media
                    </div>
                    <div className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider ${req.checks.insurance ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                      {req.checks.insurance ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      Insurance Docs
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex lg:flex-col items-center lg:items-end justify-center gap-3 shrink-0 lg:border-l lg:border-[#ECECEC] lg:pl-6">
                  <button 
                    onClick={() => handleApprove(req.id)}
                    className="w-full sm:w-auto lg:w-40 flex items-center justify-center gap-2 bg-[#0F0F0F] text-white px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-[#C9A75D] transition-colors shadow-md"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve
                  </button>
                  <button 
                    className="w-full sm:w-auto lg:w-40 flex items-center justify-center gap-2 bg-white border border-[#ECECEC] text-[#0F0F0F] px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider hover:border-[#0F0F0F] transition-colors"
                  >
                    <FileText className="w-4 h-4" /> Request Fix
                  </button>
                  <button 
                    onClick={() => handleReject(req.id)}
                    className="w-full sm:w-auto lg:w-40 flex items-center justify-center gap-2 bg-white text-[#DC2626] px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-[#DC2626]/10 transition-colors"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {approvals.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center bg-[#FDFBF7]/50">
              <ShieldCheck className="w-16 h-16 text-[#ECECEC] mb-4" />
              <h3 className="text-lg font-serif text-[#0F0F0F] mb-1">Queue Empty</h3>
              <p className="text-[12px] font-bold text-[#666666] uppercase tracking-widest">All fleet submissions are reviewed</p>
            </div>
          )}
        </div>
      </div>

    </motion.div>
  );
}
