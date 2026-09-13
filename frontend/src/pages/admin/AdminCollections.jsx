import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminBookings } from '@/redux/slices/adminSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, ArrowUpRight, ArrowDownRight, Wallet, Receipt, DollarSign, Download, Filter, Search, CheckCircle2, Clock, XCircle, ArrowRightLeft } from 'lucide-react';
import CountUp from 'react-countup';
import CustomSelect from '@/components/ui/CustomSelect';

export default function AdminCollections() {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector(state => state.admin);
  const { accessToken } = useSelector(state => state.auth);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!accessToken) return;
    dispatch(fetchAdminBookings());
  }, [dispatch, accessToken]);

  const totalCollected = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const processingFees = totalCollected * 0.15; // 15% platform fee
  const pendingPayouts = bookings.filter(b => b.status !== 'completed').reduce((sum, b) => sum + ((b.totalAmount || 0) * 0.85), 0);
  const netRevenue = processingFees; // Our profit is the fees

  const kpis = {
    totalCollected,
    pendingPayouts,
    processingFees,
    netRevenue
  };

  const transactions = bookings.flatMap(b => {
    const amount = b.totalAmount || 0;
    const fee = amount * 0.15;
    const payout = amount * 0.85;
    const date = b.createdAt;
    
    return [
      {
        id: `COL-${b.bookingId?.substring(0,6) || b._id?.substring(0,6)}`,
        type: 'collection',
        entity: `Client: ${b.user?.name || 'Unknown'}`,
        amount: amount,
        date: date,
        status: b.status === 'confirmed' || b.status === 'completed' ? 'completed' : 'pending',
        method: 'Online Payment'
      },
      {
        id: `FEE-${b.bookingId?.substring(0,6) || b._id?.substring(0,6)}`,
        type: 'fee',
        entity: 'Platform Fee',
        amount: fee,
        date: date,
        status: 'completed',
        method: 'System Deduction'
      },
      {
        id: `PAY-${b.bookingId?.substring(0,6) || b._id?.substring(0,6)}`,
        type: 'payout',
        entity: `Vendor: ${b.vendor?.name || 'Unknown'}`,
        amount: payout,
        date: date,
        status: b.status === 'completed' ? 'completed' : 'pending',
        method: 'Bank Transfer'
      }
    ];
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const handleExport = () => {
    const rows = ["ID,Type,Entity,Amount,Date,Status"];
    transactions.forEach(t => {
      const entity = `"${String(t.entity).replace(/"/g, '""')}"`;
      rows.push(`${t.id},${t.type},${entity},${t.amount},${new Date(t.date).toLocaleDateString()},${t.status}`);
    });
    const csvContent = rows.join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "luxoria_financial_ledger.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const processAllPayouts = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
    }, 2000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#16A34A]/10 text-[#16A34A] text-[10px] font-bold uppercase tracking-wider"><CheckCircle2 className="w-3 h-3" /> Settled</span>;
      case 'pending': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#C9A75D]/10 text-[#C9A75D] text-[10px] font-bold uppercase tracking-wider"><Clock className="w-3 h-3" /> Processing</span>;
      case 'failed': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#DC2626]/10 text-[#DC2626] text-[10px] font-bold uppercase tracking-wider"><XCircle className="w-3 h-3" /> Failed</span>;
      default: return null;
    }
  };

  const filteredTransactions = transactions.filter(t => {
    if (filter !== 'all' && t.type !== filter) return false;
    if (searchQuery && !t.entity.toLowerCase().includes(searchQuery.toLowerCase()) && !t.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#0F0F0F] tracking-tight mb-1.5" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Financial Collections</h1>
          <p className="text-[#666666] text-sm font-medium tracking-wide">Manage vendor payouts, client invoices, and payment processing.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={processAllPayouts}
            disabled={processing}
            className="flex items-center gap-2 bg-[#F9F9F9] border border-[#ECECEC] text-[#0F0F0F] px-5 py-2.5 rounded-xl text-[12px] font-bold uppercase tracking-wider hover:border-[#C9A75D] hover:text-[#C9A75D] transition-colors disabled:opacity-50"
          >
            {processing ? <div className="w-4 h-4 border-2 border-[#C9A75D] border-t-transparent rounded-full animate-spin"></div> : <ArrowRightLeft className="w-4 h-4" />} 
            Process Payouts
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 bg-[#0F0F0F] text-white px-5 py-2.5 rounded-xl text-[12px] font-bold uppercase tracking-wider hover:bg-[#C9A75D] transition-colors shadow-lg shadow-[#0F0F0F]/10 whitespace-nowrap"
          >
            <Download className="w-4 h-4" /> Export Ledger
          </button>
        </div>
      </div>

      {/* KPI Grid (Matched perfectly to theme) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Gross Collected (YTD)', value: kpis.totalCollected, icon: CreditCard, prefix: '$', trend: '', isUp: true },
          { title: 'Pending Payouts', value: kpis.pendingPayouts, icon: Wallet, prefix: '$', trend: '', isUp: false },
          { title: 'Platform Fees', value: kpis.processingFees, icon: Receipt, prefix: '$', trend: '', isUp: true },
          { title: 'Net Revenue', value: kpis.netRevenue, icon: DollarSign, prefix: '$', trend: '', isUp: true },
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
                {kpi.prefix}<CountUp end={kpi.value} duration={2} separator="," />
              </h3>
              <p className="text-[11px] font-bold text-[#666666] uppercase tracking-[0.15em]">{kpi.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Financial Ledger */}
      <div className="bg-white border border-[#ECECEC] rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Table Header Controls */}
        <div className="p-6 border-b border-[#ECECEC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#0F0F0F] flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[#C9A75D]" /> Financial Ledger
          </h3>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999999]" />
              <input 
                type="text" 
                placeholder="Search entity or ID..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F9F9F9] border border-[#ECECEC] rounded-xl pl-10 pr-4 py-2.5 text-[13px] text-[#0F0F0F] focus:outline-none focus:border-[#C9A75D] transition-colors placeholder:text-[#999999]"
              />
            </div>
            {/* Filter */}
            <CustomSelect
              value={filter}
              onChange={(val) => setFilter(val)}
              options={[
                { value: 'all', label: 'All Entries' },
                { value: 'collection', label: 'Collections (In)' },
                { value: 'payout', label: 'Payouts (Out)' },
                { value: 'fee', label: 'Fees (Deductions)' }
              ]}
              className="bg-[#F9F9F9]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FDFBF7] border-b border-[#ECECEC]">
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-[#666666]">Transaction ID</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-[#666666]">Date</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-[#666666]">Entity</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-[#666666]">Method</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-[#666666] text-right">Amount</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-[#666666] text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {loading && transactions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-8 h-8 border-4 border-[#C9A75D] border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider animate-pulse">Loading Financials...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredTransactions.map((txn, idx) => (
                  <motion.tr 
                    key={txn.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.05 }}
                    className="border-b border-[#ECECEC] hover:bg-[#F9F9F9] transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <span className="text-[12px] font-bold text-[#0F0F0F] group-hover:text-[#C9A75D] transition-colors">{txn.id}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-[12px] text-[#666666]">{new Date(txn.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-[13px] font-medium text-[#0F0F0F]">{txn.entity}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-[12px] text-[#666666]">{txn.method}</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className={`text-[13px] font-bold ${txn.type === 'payout' || txn.type === 'fee' ? 'text-[#DC2626]' : 'text-[#16A34A]'}`}>
                        {txn.type === 'payout' || txn.type === 'fee' ? '-' : '+'}{formatCurrency(txn.amount)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {getStatusBadge(txn.status)}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {!loading && filteredTransactions.length === 0 && (
            <div className="py-16 flex flex-col items-center justify-center">
              <Receipt className="w-12 h-12 text-[#ECECEC] mb-4" />
              <p className="text-[12px] font-bold text-[#666666] uppercase tracking-widest">No transactions found</p>
            </div>
          )}
        </div>
      </div>

    </motion.div>
  );
}
