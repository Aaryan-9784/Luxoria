import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, ArrowUpRight, ArrowDownRight, Wallet, Receipt, DollarSign, Download, Filter, Search, CheckCircle2, Clock, XCircle, ArrowRightLeft } from 'lucide-react';
import CountUp from 'react-countup';

export default function AdminCollections() {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [processing, setProcessing] = useState(false);

  // Mock Financial Data
  const data = {
    kpis: {
      totalCollected: 2450000,
      pendingPayouts: 145000,
      processingFees: 73500,
      netRevenue: 2231500
    },
    transactions: [
      { id: 'TXN-9823', type: 'collection', entity: 'Client: James W.', amount: 4500, date: '2026-06-22', status: 'completed', method: 'Credit Card (Stripe)' },
      { id: 'TXN-9822', type: 'payout', entity: 'Vendor: Elite Motors', amount: 12400, date: '2026-06-21', status: 'pending', method: 'Wire Transfer' },
      { id: 'TXN-9821', type: 'collection', entity: 'Client: Sarah L.', amount: 2100, date: '2026-06-21', status: 'completed', method: 'Apple Pay' },
      { id: 'TXN-9820', type: 'fee', entity: 'Stripe Processing', amount: 135, date: '2026-06-20', status: 'completed', method: 'Platform Deduction' },
      { id: 'TXN-9819', type: 'payout', entity: 'Vendor: Prestige Exotics', amount: 8900, date: '2026-06-19', status: 'completed', method: 'Wire Transfer' },
      { id: 'TXN-9818', type: 'collection', entity: 'Client: Michael B.', amount: 5500, date: '2026-06-18', status: 'failed', method: 'Bank Transfer' },
      { id: 'TXN-9817', type: 'payout', entity: 'Vendor: Crown Classics', amount: 3200, date: '2026-06-18', status: 'pending', method: 'Wire Transfer' },
      { id: 'TXN-9816', type: 'collection', entity: 'Client: Emma C.', amount: 1800, date: '2026-06-17', status: 'completed', method: 'Credit Card (Stripe)' },
    ]
  };

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const handleExport = () => {
    // Mock export functionality
    const csvContent = "data:text/csv;charset=utf-8,ID,Type,Entity,Amount,Date,Status\\n" 
      + data.transactions.map(t => `${t.id},${t.type},${t.entity},${t.amount},${t.date},${t.status}`).join("\\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "luxoria_financial_ledger.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  const filteredTransactions = data.transactions.filter(t => {
    if (filter !== 'all' && t.type !== filter) return false;
    if (searchQuery && !t.entity.toLowerCase().includes(searchQuery.toLowerCase()) && !t.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-[#0F0F0F] tracking-tight mb-2">Financial Collections</h1>
          <p className="text-[13px] text-[#666666] tracking-wide">Manage vendor payouts, client invoices, and payment processing.</p>
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
            className="flex items-center gap-2 bg-[#0F0F0F] text-white px-5 py-2.5 rounded-xl text-[12px] font-bold uppercase tracking-wider hover:bg-[#C9A75D] transition-colors shadow-lg shadow-[#0F0F0F]/10"
          >
            <Download className="w-4 h-4" /> Export Ledger
          </button>
        </div>
      </div>

      {/* KPI Grid (Matched perfectly to theme) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Gross Collected (YTD)', value: data.kpis.totalCollected, icon: CreditCard, prefix: '$', trend: '+18.2%', isUp: true },
          { title: 'Pending Payouts', value: data.kpis.pendingPayouts, icon: Wallet, prefix: '$', trend: '+4.5%', isUp: false }, // Down visually implies more pending
          { title: 'Platform Fees', value: data.kpis.processingFees, icon: Receipt, prefix: '$', trend: '-1.2%', isUp: true }, // Less fees is good
          { title: 'Net Revenue', value: data.kpis.netRevenue, icon: DollarSign, prefix: '$', trend: '+22.4%', isUp: true },
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
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full sm:w-auto appearance-none bg-[#F9F9F9] border border-[#ECECEC] rounded-xl px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider text-[#0F0F0F] focus:outline-none focus:border-[#C9A75D] transition-colors cursor-pointer"
            >
              <option value="all">All Entries</option>
              <option value="collection">Collections (In)</option>
              <option value="payout">Payouts (Out)</option>
              <option value="fee">Fees (Deductions)</option>
            </select>
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
                {filteredTransactions.map((txn, idx) => (
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
          {filteredTransactions.length === 0 && (
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
