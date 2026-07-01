import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConciergeRequests, updateConciergeStatus } from '@/redux/slices/adminSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/motion';
import * as Icons from 'lucide-react';
import { Headset, CheckCircle, Clock, AlertCircle, Phone, Search, MapPin, Download } from 'lucide-react';
import CustomSelect from '@/components/ui/CustomSelect';

export default function AdminConcierge() {
  const dispatch = useDispatch();
  const { conciergeRequests, loading } = useSelector(state => state.admin);
  const { accessToken } = useSelector(state => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!accessToken) return;
    dispatch(fetchConciergeRequests());
  }, [dispatch, accessToken]);

  const filteredRequests = (conciergeRequests || []).filter(req => {
    const searchMatch = req.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) || req.requestId?.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = filterStatus === 'all' || req.status === filterStatus;
    return searchMatch && statusMatch;
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

  const handleUpdateStatus = (id, newStatus) => {
    dispatch(updateConciergeStatus({ id, status: newStatus }));
  };

  const handleContact = (clientName, id, type) => {
    const formattedClient = clientName ? clientName.toLowerCase().replace(/\s+/g, '.') : 'client';
    window.location.href = `mailto:contact@${formattedClient}.com?subject=Re: ${id} - ${type}`;
  };

  const handleExportReport = () => {
    setExporting(true);

    try {
      const headers = ['Request ID', 'Client Name', 'Type', 'Status', 'Priority', 'Location', 'Date', 'Description'];
      const rows = filteredRequests.map(req => [
        req.requestId || '',
        req.clientName || '',
        req.type || '',
        req.status || '',
        req.priority || 'normal',
        req.location || '',
        req.date ? new Date(req.date).toLocaleDateString('en-GB') : '',
        req.description || '',
      ]);

      const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const statusLabel = filterStatus === 'all' ? 'all' : filterStatus;
      link.href = url;
      link.download = `vip-concierge-${statusLabel}-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  const renderIcon = (iconName) => {
    const IconComponent = Icons[iconName] || Icons.Sparkles;
    return <IconComponent className="w-6 h-6 text-[#C9A75D]" />;
  };

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#0F0F0F] tracking-tight mb-1.5" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            VIP Concierge
          </h1>
          <p className="text-[#666666] text-sm font-medium tracking-wide">Manage bespoke requests and specialized services for high-net-worth clients.</p>
        </div>
        <button
          onClick={handleExportReport}
          disabled={exporting}
          className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-[#0F0F0F] text-white text-[11px] font-bold uppercase tracking-wider shadow-md hover:bg-[#C9A75D] transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 self-start md:self-auto"
        >
          {exporting ? (
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {exporting ? 'Exporting...' : 'Export Report'}
        </button>
      </div>

      {/* Filters & Search */}
      <motion.div variants={staggerItem} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-20 relative">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999999]" />
            <input
              type="text"
              placeholder="Search request or client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-[#ECECEC] rounded-xl pl-11 pr-4 py-2.5 text-[13px] text-[#0F0F0F] focus:outline-none focus:border-[#C9A75D] focus:shadow-[0_0_0_3px_rgba(201,167,93,0.1)] transition-all placeholder:text-[#999999]"
            />
          </div>
          <CustomSelect
            value={filterStatus}
            onChange={(val) => setFilterStatus(val)}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'pending', label: 'Pending' },
              { value: 'in-progress', label: 'In Progress' },
              { value: 'completed', label: 'Completed' }
            ]}
          />
        </div>
      </motion.div>

      {/* Requests List */}
      <motion.div variants={staggerItem} className="space-y-4 relative min-h-[300px]">
        {loading && conciergeRequests.length === 0 && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-30 flex flex-col items-center justify-center rounded-2xl border border-[#ECECEC]">
            <div className="w-8 h-8 border-4 border-[#C9A75D] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider animate-pulse">Loading Client Requests...</p>
          </div>
        )}

        <AnimatePresence>
          {filteredRequests.map((req) => (
            <motion.div 
              key={req.requestId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-[#ECECEC] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                
                <div className="flex gap-5">
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-[#FDFBF7] border border-[#C9A75D]/20 flex items-center justify-center shadow-sm">
                    {renderIcon(req.icon)}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-1.5">
                      <h3 className="text-lg font-bold text-[#0F0F0F]">{req.clientName}</h3>
                      <span className={`px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider ${getStatusColor(req.status)}`}>
                        {req.status.replace('-', ' ')}
                      </span>
                    </div>
                    <p className="text-[12px] font-bold text-[#666666] uppercase tracking-wider mb-3">
                      {req.requestId} &bull; {req.type}
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
                      onClick={() => handleUpdateStatus(req.requestId, 'in-progress')}
                      disabled={loading}
                      className="w-full flex justify-center items-center gap-2 py-2.5 rounded-xl border border-[#0F0F0F] bg-[#0F0F0F] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-transparent hover:text-[#0F0F0F] transition-colors disabled:opacity-50"
                    >
                      Acknowledge
                    </button>
                  )}
                  {req.status === 'in-progress' && (
                    <button 
                      onClick={() => handleUpdateStatus(req.requestId, 'completed')}
                      disabled={loading}
                      className="w-full flex justify-center items-center gap-2 py-2.5 rounded-xl border border-[#16A34A] bg-[#16A34A]/10 text-[#16A34A] text-[11px] font-bold uppercase tracking-wider hover:bg-[#16A34A] hover:text-white transition-colors disabled:opacity-50"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Mark Done
                    </button>
                  )}
                  <button 
                    onClick={() => handleContact(req.clientName, req.requestId, req.type)}
                    className="w-full flex justify-center items-center gap-2 py-2.5 rounded-xl border border-[#ECECEC] text-[#0F0F0F] text-[11px] font-bold uppercase tracking-wider hover:bg-[#F5F5F5] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" /> Contact
                  </button>
                </div>

              </div>
            </motion.div>
          ))}
          {!loading && filteredRequests.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center border border-[#ECECEC] rounded-2xl bg-white shadow-sm">
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
