import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { Headset, CheckCircle, Clock, AlertCircle, Phone, Search, SlidersHorizontal, MapPin, Wine, ShieldAlert, Sparkles, X } from 'lucide-react';

const DUMMY_REQUESTS = [
  {
    id: 'CR-9012',
    client: 'Alexander Sterling',
    type: 'Security Detail',
    status: 'pending',
    date: '2026-06-25T14:00:00Z',
    description: 'Client requires two armed close protection officers for the Rolls-Royce Phantom booking tomorrow evening.',
    priority: 'high',
    icon: ShieldAlert,
    location: 'London, UK'
  },
  {
    id: 'CR-9013',
    client: 'Victoria Blackwood',
    type: 'Custom Beverage',
    status: 'in-progress',
    date: '2026-06-25T09:30:00Z',
    description: 'Requested 1996 Dom Pérignon chilled in the Maybach rear console upon airport arrival.',
    priority: 'medium',
    icon: Wine,
    location: 'Dubai, UAE'
  },
  {
    id: 'CR-9014',
    client: 'James Rutherford',
    type: 'Helicopter Transfer',
    status: 'completed',
    date: '2026-06-24T18:45:00Z',
    description: 'Helicopter transfer from JFK Airport to Manhattan helipad before the Lamborghini Urus rental.',
    priority: 'high',
    icon: Sparkles,
    location: 'New York, USA'
  },
];

export default function AdminConcierge() {
  const [requests, setRequests] = useState(DUMMY_REQUESTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.client.toLowerCase().includes(searchTerm.toLowerCase()) || req.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-[#16A34A] bg-[#16A34A]/10 border-[#16A34A]/20';
      case 'in-progress': return 'text-[#3B82F6] bg-[#3B82F6]/10 border-[#3B82F6]/20';
      case 'pending': return 'text-[#C9A75D] bg-[#C9A75D]/10 border-[#C9A75D]/20';
      default: return 'text-[#666666] bg-[#F5F5F5] border-[#ECECEC]';
    }
  };

  const getPriorityBadge = (priority) => {
    return priority === 'high' ? (
      <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-[#DC2626] tracking-widest">
        <AlertCircle className="w-3 h-3" /> High Priority
      </span>
    ) : null;
  };

  const updateStatus = (id, newStatus) => {
    setRequests(requests.map(req => req.id === id ? { ...req, status: newStatus } : req));
  };

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-2">
        <div>
          <h1 className="text-[28px] font-bold text-[#0F0F0F] tracking-tight mb-1.5 flex items-center gap-3" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            <Headset className="w-8 h-8 text-[#C9A75D]" /> VIP Concierge
          </h1>
          <p className="text-[#666666] text-sm font-medium tracking-wide">Manage bespoke requests and specialized services for high-net-worth clients.</p>
        </div>
      </div>

      {/* Filters & Search */}
      <motion.div variants={staggerItem} className="bg-white border border-[#ECECEC] rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center z-20 relative">
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          {['all', 'pending', 'in-progress', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-6 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
                filterStatus === status
                  ? 'bg-[#0F0F0F] text-white shadow-md'
                  : 'bg-transparent text-[#666666] hover:bg-[#F5F5F5] hover:text-[#0F0F0F]'
              }`}
            >
              {status.replace('-', ' ')}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative group flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999999] group-focus-within:text-[#C9A75D] transition-colors" />
            <input
              type="text"
              placeholder="Search request or client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#F5F5F5] border border-transparent focus:border-[#C9A75D]/30 focus:bg-white rounded-xl py-2.5 pl-11 pr-4 text-sm text-[#0F0F0F] placeholder-[#999999] transition-all outline-none"
            />
          </div>
          <button className="p-2.5 rounded-xl border border-[#ECECEC] text-[#0F0F0F] hover:bg-[#F5F5F5] transition-colors" title="Filter options">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Requests List */}
      <motion.div variants={staggerItem} className="space-y-4">
        <AnimatePresence>
          {filteredRequests.map((req) => (
            <motion.div 
              key={req.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-[#ECECEC] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                
                <div className="flex gap-5">
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-[#FDFBF7] border border-[#C9A75D]/20 flex items-center justify-center shadow-sm">
                    <req.icon className="w-6 h-6 text-[#C9A75D]" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-1.5">
                      <h3 className="text-lg font-bold text-[#0F0F0F]">{req.client}</h3>
                      <span className={`px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider ${getStatusColor(req.status)}`}>
                        {req.status.replace('-', ' ')}
                      </span>
                    </div>
                    <p className="text-[12px] font-bold text-[#666666] uppercase tracking-wider mb-3">
                      {req.id} &bull; {req.type}
                    </p>
                    <p className="text-[#4B5563] text-sm leading-relaxed max-w-2xl mb-4">
                      {req.description}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4 mt-2">
                      <span className="flex items-center gap-1.5 text-[11px] text-[#666666] font-bold uppercase tracking-wider">
                        <Clock className="w-3.5 h-3.5" /> {new Date(req.date).toLocaleDateString()} {new Date(req.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                      <span className="flex items-center gap-1.5 text-[11px] text-[#666666] font-bold uppercase tracking-wider">
                        <MapPin className="w-3.5 h-3.5" /> {req.location}
                      </span>
                      {getPriorityBadge(req.priority)}
                    </div>
                  </div>
                </div>

                <div className="flex md:flex-col gap-2 shrink-0 md:w-40 border-t md:border-t-0 md:border-l border-[#ECECEC] pt-4 md:pt-0 md:pl-6">
                  {req.status === 'pending' && (
                    <button 
                      onClick={() => updateStatus(req.id, 'in-progress')}
                      className="w-full flex justify-center items-center gap-2 py-2.5 rounded-xl border border-[#0F0F0F] bg-[#0F0F0F] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-transparent hover:text-[#0F0F0F] transition-colors"
                    >
                      Acknowledge
                    </button>
                  )}
                  {req.status === 'in-progress' && (
                    <button 
                      onClick={() => updateStatus(req.id, 'completed')}
                      className="w-full flex justify-center items-center gap-2 py-2.5 rounded-xl border border-[#16A34A] bg-[#16A34A]/10 text-[#16A34A] text-[11px] font-bold uppercase tracking-wider hover:bg-[#16A34A] hover:text-white transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Mark Done
                    </button>
                  )}
                  <button className="w-full flex justify-center items-center gap-2 py-2.5 rounded-xl border border-[#ECECEC] text-[#0F0F0F] text-[11px] font-bold uppercase tracking-wider hover:bg-[#F5F5F5] transition-colors">
                    <Phone className="w-3.5 h-3.5" /> Contact
                  </button>
                </div>

              </div>
            </motion.div>
          ))}
          {filteredRequests.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center border border-dashed border-[#ECECEC] rounded-2xl bg-white">
              <Headset className="w-12 h-12 text-[#CCCCCC] mx-auto mb-4" />
              <h3 className="text-lg font-bold text-[#0F0F0F] mb-1">No Concierge Requests</h3>
              <p className="text-[#666666] text-sm">No special requests match your current filters.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

    </motion.div>
  );
}
