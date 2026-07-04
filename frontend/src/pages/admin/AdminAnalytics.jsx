import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnalytics } from '@/redux/slices/adminSlice';
import { motion } from 'framer-motion';
import {
  Users, Car, DollarSign, Calendar,
  Activity, Download, TrendingUp,
} from 'lucide-react';
import CountUp from 'react-countup';
import CustomSelect from '@/components/ui/CustomSelect';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';

// ─── Helpers ────────────────────────────────────────────────────────────────

const fmtUSD = (val) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(val);

const fmtUSDShort = (val) => {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000)    return `$${(val / 1000).toFixed(0)}K`;
  return `$${val}`;
};

// Month labels for an empty-state skeleton (Jan → Dec of current year)
const EMPTY_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => ({
  month: m,
  revenue: 0,
}));

// ─── Custom Tooltip ──────────────────────────────────────────────────────────

const RevenueTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0F0F0F] text-white rounded-xl px-4 py-3 shadow-2xl border border-white/10 min-w-[130px]">
      <p className="text-[10px] font-bold text-[#C9A75D] uppercase tracking-widest mb-1">{label}</p>
      <p className="text-[16px] font-bold">{fmtUSD(payload[0].value)}</p>
    </div>
  );
};

// ─── Component ──────────────────────────────────────────────────────────────

export default function AdminAnalytics() {
  const dispatch = useDispatch();
  const { analytics, loading } = useSelector((state) => state.admin);
  const { accessToken } = useSelector((state) => state.auth);
  const [dateRange, setDateRange] = useState('year');

  useEffect(() => {
    if (!accessToken) return;
    dispatch(fetchAnalytics(dateRange));
  }, [dispatch, dateRange, accessToken]);

  // ── KPIs
  const kpis = {
    revenue:     analytics?.overview?.totalRevenue  || 0,
    bookings:    analytics?.overview?.totalBookings  || 0,
    activeUsers: analytics?.overview?.totalUsers     || 0,
    vendors:     analytics?.overview?.totalVendors   || 0,
  };

  // ── Revenue chart data
  const revenueData = useMemo(() => {
    if (!analytics?.monthlyRevenue?.length) return null; // null = no real data yet
    return analytics.monthlyRevenue.map((item) => ({
      month: new Date(0, item._id.month - 1).toLocaleString('default', { month: 'short' }),
      revenue: item.revenue,
    }));
  }, [analytics]);

  const hasRevenueData = revenueData !== null && revenueData.some((d) => d.revenue > 0);
  const chartData      = hasRevenueData ? revenueData : EMPTY_MONTHS;
  const maxRevenue     = hasRevenueData
    ? Math.max(...revenueData.map((d) => d.revenue))
    : 0;

  // ── Vehicle classes
  const vehicleClasses = useMemo(() => {
    if (!analytics?.vehiclesByCategory?.length) return [];
    const total = analytics.vehiclesByCategory.reduce((s, v) => s + v.count, 0);
    const colors = ['#0F0F0F', '#C9A75D', '#888888', '#BDBDBD', '#8B5A2B', '#A9A9A9', '#D3D3D3'];
    return analytics.vehiclesByCategory.map((item, idx) => ({
      name:       item.name,
      count:      item.count,
      percentage: total > 0 ? Math.round((item.count / total) * 100) : 0,
      color:      colors[idx % colors.length],
    }));
  }, [analytics]);

  // ── Top vendors
  const topVendors = useMemo(() => analytics?.topVendors || [], [analytics]);
  const maxVendorRev = Math.max(...topVendors.map((v) => v.revenue), 1);

  // ── Export CSV
  const handleExport = () => {
    const rows = (hasRevenueData ? revenueData : [])
      .map((d) => `${d.month},${d.revenue}`)
      .join('\n');
    const uri = encodeURI(`data:text/csv;charset=utf-8,Month,Revenue\n${rows}`);
    const a   = document.createElement('a');
    a.href     = uri;
    a.download = 'luxoria_analytics.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-7xl mx-auto pb-12"
    >
      {/* ── Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#0F0F0F] tracking-tight mb-1.5" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            Platform Analytics
          </h1>
          <p className="text-[#666666] text-sm font-medium tracking-wide">
            Enterprise performance metrics and global insights.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <CustomSelect
            value={dateRange}
            onChange={setDateRange}
            icon={null}
            options={[
              { value: 'year',  label: '2026 Fiscal Year' },
              { value: 'month', label: 'Last 30 Days' },
              { value: 'week',  label: 'Last 7 Days' },
            ]}
          />
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-[#0F0F0F] text-white px-5 py-2.5 rounded-xl text-[12px] font-bold uppercase tracking-wider hover:bg-[#C9A75D] transition-colors shadow-lg shadow-[#0F0F0F]/10 whitespace-nowrap"
          >
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* ── KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { title: 'Total Revenue',   value: kpis.revenue,     icon: DollarSign, prefix: '$' },
          { title: 'Global Bookings', value: kpis.bookings,    icon: Calendar,   prefix: ''  },
          { title: 'Active Clients',  value: kpis.activeUsers, icon: Users,      prefix: ''  },
          { title: 'Vendor Partners', value: kpis.vendors,     icon: Car,        prefix: ''  },
        ].map((kpi, idx) => (
          <div
            key={idx}
            className="relative overflow-hidden group bg-white border border-[#ECECEC] rounded-2xl p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 cursor-default flex flex-col justify-between min-h-[156px]"
          >
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#C9A75D] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="w-11 h-11 rounded-full flex items-center justify-center bg-[#0F0F0F] text-[#C9A75D] group-hover:scale-110 transition-transform duration-500 shadow-md">
              <kpi.icon className="w-5 h-5" />
            </div>
            <div className="mt-auto">
              <h3 className="text-[30px] font-bold text-[#0F0F0F] tracking-tight mb-0.5">
                {kpi.prefix}
                <CountUp end={kpi.value} duration={2} separator="," />
              </h3>
              <p className="text-[10px] font-bold text-[#888888] uppercase tracking-[0.15em]">
                {kpi.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Revenue Chart — spans 2 cols */}
        <div className="lg:col-span-2 bg-white border border-[#ECECEC] rounded-2xl p-8 shadow-sm">

          {/* Chart header */}
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-lg font-serif text-[#0F0F0F]">Revenue Growth</h3>
              <p className="text-[11px] text-[#888888] mt-0.5">
                {hasRevenueData
                  ? `Peak month: ${fmtUSD(maxRevenue)}`
                  : 'No revenue recorded yet — chart shows full-year frame'}
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-[#888888] uppercase tracking-wider">
              <Activity className="w-4 h-4 text-[#C9A75D]" /> Performance
            </div>
          </div>

          {/* Empty-state banner */}
          {!hasRevenueData && !loading && (
            <div className="flex items-center gap-3 bg-[#FAFAFA] border border-[#ECECEC] rounded-xl px-4 py-3 mb-6 mt-4">
              <TrendingUp className="w-4 h-4 text-[#C9A75D] shrink-0" />
              <p className="text-[12px] text-[#666666]">
                Revenue data will appear here once bookings are confirmed and payments are captured.
              </p>
            </div>
          )}

          {/* Recharts AreaChart */}
          <div className="w-full mt-4" style={{ height: 280 }}>
            {loading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-8 h-8 border-[3px] border-[#C9A75D] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#C9A75D" stopOpacity={hasRevenueData ? 0.25 : 0.06} />
                      <stop offset="100%" stopColor="#C9A75D" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="4 4"
                    stroke="#F0F0F0"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 10, fill: '#AAAAAA', fontWeight: 700, letterSpacing: 1 }}
                    tickLine={false}
                    axisLine={false}
                    dy={8}
                  />

                  <YAxis
                    tickFormatter={fmtUSDShort}
                    tick={{ fontSize: 10, fill: '#AAAAAA', fontWeight: 600 }}
                    tickLine={false}
                    axisLine={false}
                    width={52}
                    tickCount={5}
                    domain={hasRevenueData ? ['auto', 'auto'] : [0, 1000]}
                  />

                  <Tooltip
                    content={hasRevenueData ? <RevenueTooltip /> : () => null}
                    cursor={
                      hasRevenueData
                        ? { stroke: '#C9A75D', strokeWidth: 1, strokeDasharray: '4 4' }
                        : false
                    }
                  />

                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke={hasRevenueData ? '#C9A75D' : '#E0E0E0'}
                    strokeWidth={hasRevenueData ? 2.5 : 1.5}
                    fill="url(#revGradient)"
                    dot={false}
                    activeDot={
                      hasRevenueData
                        ? { r: 5, fill: '#fff', stroke: '#C9A75D', strokeWidth: 2.5 }
                        : false
                    }
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* ── Side Panel */}
        <div className="space-y-6">

          {/* Class Distribution */}
          <div className="bg-white border border-[#ECECEC] rounded-2xl p-7 shadow-sm">
            <h3 className="text-lg font-serif text-[#0F0F0F] mb-5">Class Distribution</h3>

            {vehicleClasses.length === 0 ? (
              <p className="text-[12px] text-[#888888] italic">No vehicle data available.</p>
            ) : (
              <>
                {/* Stacked bar */}
                <div className="w-full h-2.5 rounded-full flex overflow-hidden mb-5 bg-[#F5F5F5]">
                  {vehicleClasses.map((vc, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ width: 0 }}
                      animate={{ width: `${vc.percentage}%` }}
                      transition={{ duration: 0.9, delay: 0.15 * idx }}
                      style={{ backgroundColor: vc.color }}
                    />
                  ))}
                </div>

                {/* Legend */}
                <div className="space-y-3">
                  {vehicleClasses.map((vc, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: vc.color }}
                        />
                        <span className="text-[11px] font-bold text-[#0F0F0F] uppercase tracking-wider">
                          {vc.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[#888888]">{vc.count}</span>
                        <span className="text-[11px] font-semibold text-[#0F0F0F] w-8 text-right">
                          {vc.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Top Partners */}
          <div className="bg-white border border-[#ECECEC] rounded-2xl p-7 shadow-sm">
            <h3 className="text-lg font-serif text-[#0F0F0F] mb-5">Top Partners</h3>

            {topVendors.length === 0 ? (
              <p className="text-[12px] text-[#888888] italic">No partner data available.</p>
            ) : (
              <div className="space-y-5">
                {topVendors.map((vendor, idx) => {
                  const pct = Math.round((vendor.revenue / maxVendorRev) * 100);
                  return (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold text-[#0F0F0F] uppercase tracking-wider truncate max-w-[110px]">
                          {vendor.name}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] font-bold text-[#0F0F0F]">
                            {fmtUSD(vendor.revenue)}
                          </span>
                          <span className="text-[10px] text-[#888888]">
                            {vendor.bookings} {vendor.bookings === 1 ? 'booking' : 'bookings'}
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-[#F5F5F5] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.max(pct, vendor.revenue > 0 || vendor.bookings > 0 ? 4 : 0)}%` }}
                          transition={{ duration: 0.9, delay: 0.1 * idx }}
                          className="h-full rounded-full"
                          style={{
                            background: idx === 0
                              ? 'linear-gradient(90deg, #C9A75D, #e8c97a)'
                              : '#DEDEDE',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </motion.div>
  );
}
