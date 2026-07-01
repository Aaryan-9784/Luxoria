import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendorVehicles, fetchVendorBookings } from '@/redux/slices/vendorSlice';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { BarChart3, TrendingUp, Users, Star, Car, Activity, Download, ArrowRight, Trophy } from 'lucide-react';
import CustomSelect from '@/components/ui/CustomSelect';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function VendorAnalytics() {
  const dispatch = useDispatch();
  const { vehicles, bookings, loading } = useSelector(state => state.vendor);
  const { accessToken } = useSelector(state => state.auth);
  const [timeFilter, setTimeFilter] = useState('this_year');

  useEffect(() => {
    if (!accessToken) return;
    dispatch(fetchVendorVehicles());
    dispatch(fetchVendorBookings());
  }, [dispatch, accessToken]);

  // ── Filter bookings by selected time period ──────────────────────────────
  const filteredBookings = (() => {
    const now = new Date();
    return bookings.filter(b => {
      const created = new Date(b.createdAt);
      if (timeFilter === 'this_year') return created.getFullYear() === now.getFullYear();
      if (timeFilter === 'last_year') return created.getFullYear() === now.getFullYear() - 1;
      return true; // all_time
    });
  })();

  const completedBookings = filteredBookings.filter(
    b => b.status === 'completed' || b.status === 'confirmed'
  );
  const activeVehicles = vehicles.filter(v => v.status === 'approved');

  // Helper: get vehicle id string regardless of whether it's populated or a raw id
  const getVehicleId = (b) =>
    b.vehicle?._id ? b.vehicle._id.toString() : b.vehicle?.toString?.() ?? '';

  // Fleet utilization: % of approved vehicles with at least one completed/confirmed booking
  const vehiclesWithBookings = activeVehicles.filter(v =>
    completedBookings.some(b => getVehicleId(b) === v._id.toString())
  ).length;
  const utilizationRate = activeVehicles.length > 0
    ? Math.min(Math.round((vehiclesWithBookings / activeVehicles.length) * 100), 100)
    : 0;

  // Average rating from real vehicle rating data
  const ratedVehicles = vehicles.filter(v => v.rating?.count > 0);
  const avgRating = ratedVehicles.length > 0
    ? (ratedVehicles.reduce((sum, v) => sum + v.rating.average, 0) / ratedVehicles.length).toFixed(1)
    : '0.0';

  // Real monthly revenue chart data (last 6 months relative to filter)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  // For last_year, anchor to Dec of that year; otherwise use current month
  const anchorYear  = timeFilter === 'last_year' ? now.getFullYear() - 1 : now.getFullYear();
  const anchorMonth = timeFilter === 'last_year' ? 11 : now.getMonth();

  const chartData = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(anchorYear, anchorMonth - 5 + i, 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    const revenue = completedBookings
      .filter(b => {
        const bd = new Date(b.createdAt);
        return bd.getFullYear() === year && bd.getMonth() === month;
      })
      .reduce((sum, b) => sum + b.totalAmount, 0);
    return { name: months[month], revenue };
  });

  // Top fleet performers — sorted by revenue descending
  const vehicleStats = vehicles.map(v => {
    const vBookings = completedBookings.filter(
      b => getVehicleId(b) === v._id.toString()
    );
    const vRevenue = vBookings.reduce((sum, b) => sum + b.totalAmount, 0);
    return { ...v, bookingsCount: vBookings.length, revenue: vRevenue };
  }).sort((a, b) => b.revenue - a.revenue).slice(0, 4);

  // ── Download report as CSV ────────────────────────────────────────────────
  const handleDownloadReport = useCallback(() => {
    const rows = [
      ['Report: Performance Analytics'],
      ['Period', timeFilter === 'this_year' ? 'This Year' : timeFilter === 'last_year' ? 'Last Year' : 'All Time'],
      [],
      ['KPI', 'Value'],
      ['Fleet Utilization', `${utilizationRate}%`],
      ['Total Bookings', filteredBookings.length],
      ['Average Rating', avgRating],
      ['Cancellation Rate', `${filteredBookings.length > 0 ? Math.round((filteredBookings.filter(b => b.status === 'cancelled').length / filteredBookings.length) * 100) : 0}%`],
      [],
      ['Revenue by Month'],
      ['Month', 'Revenue'],
      ...chartData.map(d => [d.name, `$${d.revenue.toLocaleString('en-US')}`]),
      [],
      ['Top Fleet Performers'],
      ['Vehicle', 'Trips', 'Revenue'],
      ...vehicleStats.map((v, i) => [v.name, v.bookingsCount, `$${v.revenue.toLocaleString('en-US')}`]),
    ];

    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `luxoria-analytics-${timeFilter}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [timeFilter, utilizationRate, filteredBookings, avgRating, chartData, vehicleStats]);

  if (loading && vehicles.length === 0 && bookings.length === 0) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#C9A75D] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[#666666] font-medium uppercase tracking-widest text-sm animate-pulse">Syncing Analytics Data</p>
      </div>
    );
  }

  const KPI_DATA = [
    { label: 'Fleet Utilization',  value: `${utilizationRate}%`, icon: BarChart3 },
    { label: 'Total Bookings',     value: filteredBookings.length.toLocaleString('en-US'), icon: Users },
    { label: 'Average Rating',     value: avgRating, icon: Star },
    {
      label: 'Cancellation Rate',
      value: `${filteredBookings.length > 0
        ? Math.round((filteredBookings.filter(b => b.status === 'cancelled').length / filteredBookings.length) * 100)
        : 0}%`,
      icon: TrendingUp,
    },
  ];

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-10 pb-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-2">
        <div>
          <h1 className="text-[28px] font-bold text-[#0F0F0F] tracking-tight mb-1.5" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Performance Analytics</h1>
          <p className="text-[#666666] text-sm font-medium tracking-wide">In-depth insights into your fleet's performance and market demand.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-48">
            <Activity className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none z-10" />
            <CustomSelect
              value={timeFilter}
              onChange={setTimeFilter}
              options={[
                { value: 'this_year', label: 'This Year' },
                { value: 'last_year', label: 'Last Year' },
                { value: 'all_time', label: 'All Time' },
              ]}
              icon={null}
              className="w-full text-[13px] py-3 pl-11 shadow-sm"
            />
          </div>
          <button
            onClick={handleDownloadReport}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#0F0F0F] text-[#C9A75D] text-[11px] font-bold uppercase tracking-wider rounded-xl hover:bg-[#1A1A1A] hover:shadow-lg transition-all w-full sm:w-auto shrink-0"
          >
            <Download className="w-4 h-4" /> Report
          </button>
        </div>
      </div>

      {/* KPI Widgets */}
      <motion.div variants={staggerItem} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {KPI_DATA.map((kpi, idx) => (
          <div key={idx} className="relative overflow-hidden group bg-white border border-[#ECECEC] rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 cursor-default">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C9A75D] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex flex-col justify-between h-full gap-6">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#0F0F0F] text-[#C9A75D] group-hover:scale-110 transition-transform duration-500 shadow-md">
                  <kpi.icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h3 className="text-[32px] font-bold text-[#0F0F0F] tracking-tight mb-1">{kpi.value}</h3>
                <p className="text-[11px] font-bold text-[#666666] uppercase tracking-[0.15em]">{kpi.label}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Charts & Lists Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Revenue Chart */}
        <motion.div variants={staggerItem} className="lg:col-span-2 bg-white border border-[#ECECEC] rounded-2xl shadow-sm overflow-hidden flex flex-col">
          {/* Card header */}
          <div className="flex justify-between items-center px-6 pt-6 pb-3">
            <div>
              <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#0F0F0F]">Revenue Progression</h3>
              <p className="text-[11px] text-[#9CA3AF] font-medium mt-0.5">
                {timeFilter === 'this_year' ? 'Last 6 months of this year' : timeFilter === 'last_year' ? 'Last 6 months of last year' : 'Last 6 months overall'}
              </p>
            </div>
          </div>

          {/* Chart or empty state */}
          {chartData.every(d => d.revenue === 0) ? (
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-16">
              <div className="w-14 h-14 rounded-full bg-[#F5F5F5] flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-[#D0D0D0]" />
              </div>
              <div className="text-center">
                <p className="text-[13px] font-bold text-[#CCCCCC] uppercase tracking-widest">No revenue yet</p>
                <p className="text-[11px] text-[#D0D0D0] font-medium mt-1">Complete bookings will appear here</p>
              </div>
            </div>
          ) : (
            <>
              {/* Total revenue — only shown when there is data */}
              <div className="px-6 pb-2 flex items-end gap-3">
                <span className="text-[26px] font-bold text-[#0F0F0F] tracking-tight leading-none">
                  ${chartData.reduce((s, d) => s + d.revenue, 0).toLocaleString('en-US')}
                </span>
                <span className="text-[12px] text-[#9CA3AF] font-medium pb-1">total in period</span>
              </div>
              <div className="w-full px-2 pb-6" style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#C9A75D" stopOpacity={0.18} />
                        <stop offset="100%" stopColor="#C9A75D" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: '#9CA3AF', fontWeight: '600' }}
                      dy={8}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: '#9CA3AF', fontWeight: '600' }}
                      tickFormatter={(v) => v === 0 ? '$0' : `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                      width={42}
                      domain={[0, 'auto']}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F0F0F',
                        border: 'none',
                        borderRadius: '10px',
                        color: '#fff',
                        padding: '10px 14px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                      }}
                      itemStyle={{ color: '#C9A75D', fontWeight: '700', fontSize: 13 }}
                      labelStyle={{ color: '#9CA3AF', marginBottom: '2px', fontSize: 11, fontWeight: '600' }}
                      formatter={(v) => [`$${v.toLocaleString('en-US')}`, 'Revenue']}
                      cursor={{ stroke: '#C9A75D', strokeWidth: 1, strokeDasharray: '4 2' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#C9A75D"
                      strokeWidth={2.5}
                      fill="url(#revenueGradient)"
                      dot={{ fill: '#C9A75D', strokeWidth: 0, r: 4 }}
                      activeDot={{ fill: '#C9A75D', stroke: '#fff', strokeWidth: 2, r: 6 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </motion.div>

        {/* Top Performing Vehicles */}
        <motion.div variants={staggerItem} className="bg-white border border-[#ECECEC] rounded-2xl shadow-sm flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-[#F5F5F5]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#F9F6F0] flex items-center justify-center">
                <Trophy className="w-3.5 h-3.5 text-[#C9A75D]" />
              </div>
              <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#0F0F0F]">Top Fleet Performers</h3>
            </div>
            <p className="text-[11px] text-[#9CA3AF] font-medium mt-1.5">
              Ranked by revenue · {timeFilter === 'this_year' ? 'This year' : timeFilter === 'last_year' ? 'Last year' : 'All time'}
            </p>
          </div>

          {/* List */}
          <div className="flex-1 px-4 py-3 space-y-1">
            {/* Show vehicles that have at least 1 booking, fall back to all vehicles if none have bookings */}
            {(() => {
              const withBookings = vehicleStats.filter(v => v.bookingsCount > 0);
              const list = withBookings.length > 0 ? withBookings : [];
              const rankColors = ['#C9A75D', '#A0A0A0', '#B87333', '#9CA3AF'];

              if (list.length === 0) {
                return (
                  <div className="flex flex-col items-center justify-center py-10 gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#F5F5F5] flex items-center justify-center">
                      <Car className="w-5 h-5 text-[#D0D0D0]" />
                    </div>
                    <div className="text-center">
                      <p className="text-[12px] font-bold text-[#CCCCCC] uppercase tracking-widest">No trips yet</p>
                      <p className="text-[11px] text-[#D0D0D0] font-medium mt-1">Revenue will rank your fleet</p>
                    </div>
                  </div>
                );
              }

              const maxRevenue = list[0].revenue || 1;
              return list.map((vehicle, idx) => {
                const imgUrl = vehicle.images?.[0]?.url ?? null;
                const barPct = Math.max(4, Math.round((vehicle.revenue / maxRevenue) * 100));
                return (
                  <div key={vehicle._id} className="group p-3 rounded-xl hover:bg-[#FAFAFA] transition-colors duration-200">
                    <div className="flex items-center gap-3">
                      {/* Rank badge */}
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
                        style={{ backgroundColor: `${rankColors[idx]}18`, color: rankColors[idx] }}
                      >
                        {idx + 1}
                      </div>

                      {/* Image */}
                      <div className="w-10 h-10 rounded-lg border border-[#ECECEC] overflow-hidden shrink-0 bg-[#F5F5F5]">
                        {imgUrl ? (
                          <img src={imgUrl} alt={vehicle.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Car className="w-4 h-4 text-[#D0D0D0]" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-bold text-[#0F0F0F] text-[13px] truncate">{vehicle.name}</p>
                          <p className="font-bold text-[#0F0F0F] text-[13px] shrink-0">
                            ${vehicle.revenue.toLocaleString('en-US')}
                          </p>
                        </div>
                        <div className="flex items-center justify-between gap-2 mt-0.5">
                          <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wide">
                            {vehicle.bookingsCount} {vehicle.bookingsCount === 1 ? 'trip' : 'trips'}
                          </p>
                          <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: rankColors[idx] }}>
                            Rank #{idx + 1}
                          </p>
                        </div>
                        {/* Revenue bar */}
                        <div className="mt-1.5 h-[3px] w-full bg-[#F0F0F0] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${barPct}%`, backgroundColor: rankColors[idx] }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-[#F5F5F5]">
            <Link
              to="/vendor/vehicles"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#0F0F0F] text-[#C9A75D] text-[11px] font-bold uppercase tracking-wider rounded-xl hover:bg-[#1A1A1A] transition-all"
            >
              View Full Fleet <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
