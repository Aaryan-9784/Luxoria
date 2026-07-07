import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminVehicles, fetchAdminBookings } from '@/redux/slices/adminSlice';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { Car, ShieldAlert, X, Settings2, Clock, CalendarDays } from 'lucide-react';
import CustomSelect from '@/components/ui/CustomSelect';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const STATUS_STYLES = {
  confirmed: { bg: 'bg-[#16A34A]/10', text: 'text-[#16A34A]', border: 'border-[#16A34A]/20' },
  active: { bg: 'bg-[#2563EB]/10', text: 'text-[#2563EB]', border: 'border-[#2563EB]/20' },
  pending: { bg: 'bg-[#F59E0B]/10', text: 'text-[#F59E0B]', border: 'border-[#F59E0B]/20' },
  completed: { bg: 'bg-[#666666]/10', text: 'text-[#666666]', border: 'border-[#666666]/20' },
  cancelled: { bg: 'bg-[#DC2626]/10', text: 'text-[#DC2626]', border: 'border-[#DC2626]/20' },
};

const formatDateKey = (date) => {
  const target = new Date(date);
  return `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, '0')}-${String(target.getDate()).padStart(2, '0')}`;
};

const getStatusStyle = (status) => STATUS_STYLES[status] || STATUS_STYLES.pending;

export default function AdminCalendar() {
  const dispatch = useDispatch();
  const { vehicles, bookings, loading } = useSelector((state) => state.admin);
  const { accessToken, user } = useSelector((state) => state.auth);

  const [selectedVehicle, setSelectedVehicle] = useState('all');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [blockedDates, setBlockedDates] = useState([]);
  const [blocksLoaded, setBlocksLoaded] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockForm, setBlockForm] = useState({ startDate: '', endDate: '', vehicleId: 'all', note: '' });

  const storageKey = user?._id ? `luxoria_admin_calendar_blocks_${user._id}` : null;

  useEffect(() => {
    if (!storageKey) return;
    try {
      const raw = localStorage.getItem(storageKey);
      setBlockedDates(raw ? JSON.parse(raw) : []);
    } catch {
      setBlockedDates([]);
    }
    setBlocksLoaded(true);
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey || !blocksLoaded) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(blockedDates));
    } catch {
      // ignore localStorage failures
    }
  }, [blockedDates, blocksLoaded, storageKey]);

  useEffect(() => {
    if (!accessToken) return;
    dispatch(fetchAdminVehicles());
    dispatch(fetchAdminBookings());
  }, [dispatch, accessToken]);

  const activeVehicles = useMemo(
    () => vehicles.filter((vehicle) => vehicle.status === 'approved'),
    [vehicles],
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const today = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);

  const filteredBookings = useMemo(
    () =>
      bookings.filter((booking) => {
        if (booking.status === 'cancelled') return false;
        if (selectedVehicle === 'all') return true;
        const vehicleId = booking.vehicle?._id?.toString?.() || booking.vehicle?.toString?.() || '';
        return vehicleId === selectedVehicle;
      }),
    [bookings, selectedVehicle],
  );

  const calendarDays = useMemo(() => {
    const days = Array.from({ length: firstDayOfMonth }, () => ({ empty: true }));

    for (let d = 1; d <= daysInMonth; d += 1) {
      const fullDate = new Date(year, month, d);
      const dateKey = formatDateKey(fullDate);
      const dayStart = new Date(fullDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(fullDate);
      dayEnd.setHours(23, 59, 59, 999);

      const dayBookings = filteredBookings.filter((booking) => {
        const bookingStart = new Date(booking.startDate);
        const bookingEnd = new Date(booking.endDate);
        return bookingStart <= dayEnd && bookingEnd >= dayStart;
      });

      const dayBlocks = blockedDates.filter((block) => {
        if (selectedVehicle !== 'all' && block.vehicleId !== 'all' && block.vehicleId !== selectedVehicle) return false;
        return dateKey >= block.startDate && dateKey <= block.endDate;
      });

      days.push({
        date: d,
        key: dateKey,
        bookings: dayBookings,
        blocks: dayBlocks,
        isToday: fullDate.getTime() === today.getTime(),
        isPast: fullDate < today,
      });
    }

    return days;
  }, [blockedDates, daysInMonth, filteredBookings, firstDayOfMonth, month, today, year, selectedVehicle]);

  const handleMonthChange = (offset) => setCurrentDate(new Date(year, month + offset, 1));

  const upcomingBookings = useMemo(
    () =>
      filteredBookings
        .filter((booking) => new Date(booking.startDate) >= today)
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
        .slice(0, 4),
    [filteredBookings, today],
  );

  const handleJumpDate = (value) => {
    if (!value) return;
    const [yearValue, monthValue] = value.split('-').map(Number);
    if (!Number.isNaN(yearValue) && !Number.isNaN(monthValue)) {
      setCurrentDate(new Date(yearValue, monthValue - 1, 1));
    }
  };

  const handleAddBlock = () => {
    if (!blockForm.startDate || !blockForm.endDate) return;
    if (blockForm.endDate < blockForm.startDate) return;
    setBlockedDates((prev) => [...prev, { ...blockForm, id: Date.now() }]);
    setBlockForm({ startDate: '', endDate: '', vehicleId: 'all', note: '' });
    setShowBlockModal(false);
  };

  const handleRemoveBlock = (id) => setBlockedDates((prev) => prev.filter((block) => block.id !== id));

  if (loading && vehicles.length === 0 && bookings.length === 0) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#C9A75D] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[#666666] font-medium uppercase tracking-widest text-sm animate-pulse">Syncing calendar data</p>
      </div>
    );
  }

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-10 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col lg:flex-row justify-between gap-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#0F0F0F] tracking-tight mb-1.5" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            Admin Fleet Calendar
          </h1>
          <p className="text-[#666666] text-sm font-medium tracking-wide">Review platform availability, schedule maintenance blocks, and align bookings across the fleet.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <CustomSelect
            value={selectedVehicle}
            onChange={setSelectedVehicle}
            options={[
              { value: 'all', label: 'All Vehicles' },
              ...activeVehicles.map((vehicle) => ({ value: vehicle._id, label: vehicle.name || vehicle.model || 'Unnamed Vehicle' })),
            ]}
            icon={Car}
            className="w-full sm:w-64"
          />

          <button
            type="button"
            onClick={() => setShowBlockModal(true)}
            className="inline-flex items-center gap-2 rounded-full bg-[#0F0F0F] px-5 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-white hover:bg-[#1A1A1A] transition whitespace-nowrap"
          >
            <ShieldAlert className="w-4 h-4" />
            Block Dates
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {[
          { label: 'Total bookings', value: bookings.length, icon: CalendarDays },
          { label: 'Blocked periods', value: blockedDates.length, icon: ShieldAlert },
          { label: 'Active vehicles', value: activeVehicles.length, icon: Car },
          { label: 'Upcoming', value: upcomingBookings.length, icon: Clock },
        ].map((card) => (
          <div key={card.label} className="group relative overflow-hidden rounded-3xl border border-[#ECECEC] bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#C9A75D] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-full bg-[#0F0F0F] text-[#C9A75D] flex items-center justify-center shadow-md">
                  <card.icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#9CA3AF]">{card.label}</p>
                <p className="mt-3 text-[32px] font-bold text-[#0F0F0F]">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.7fr_1fr]">
        <motion.div variants={staggerItem} className="bg-white border border-[#ECECEC] rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-[22px] font-bold text-[#0F0F0F]">{MONTHS[month]} {year}</h2>
                <p className="text-sm text-[#64748B]">Calendar view of fleet occupancy and blocked availability.</p>
              </div>
              <div className="relative flex items-center">
                <CalendarDays className="absolute left-3 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
                <input
                  type="date"
                  value={`${year}-${String(month + 1).padStart(2, '0')}-01`}
                  onChange={(e) => {
                    if (e.target.value) {
                      const d = new Date(e.target.value + 'T00:00:00');
                      setCurrentDate(new Date(d.getFullYear(), d.getMonth(), 1));
                    }
                  }}
                  className="rounded-full border border-[#ECECEC] bg-white pl-9 pr-4 py-2.5 text-[13px] font-semibold text-[#0F0F0F] focus:border-[#C9A75D] focus:outline-none hover:border-[#C9A75D] transition-all cursor-pointer"
                  aria-label="Jump to date"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px bg-[#ECECEC] rounded-2xl overflow-hidden mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="py-3 text-center text-[11px] font-bold uppercase tracking-[0.3em] text-[#9CA3AF] bg-[#F8FAFC]">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-px bg-[#ECECEC] rounded-2xl overflow-hidden">
            {calendarDays.map((day, idx) => (
              <div
                key={idx}
                className={`min-h-[120px] p-3 bg-white ${day.empty ? 'bg-[#F7F8FA]' : 'hover:bg-[#FAFAF8]'} ${day.isToday ? 'ring-2 ring-[#C9A75D] ring-inset' : ''} ${day.isPast && !day.empty ? 'opacity-70' : ''}`}
              >
                {!day.empty && (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${day.isToday ? 'bg-[#0F0F0F] text-[#C9A75D]' : 'text-[#0F0F0F]'}`}>
                        {day.date}
                      </span>
                      <span className="rounded-full border border-[#ECECEC] bg-[#F8FAFC] px-2 py-0.5 text-[11px] font-semibold text-[#64748B]">
                        {day.bookings.length + day.blocks.length}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {day.bookings.slice(0, 2).map((booking) => {
                        const status = getStatusStyle(booking.status);
                        return (
                          <div key={booking._id} className={`truncate rounded-2xl border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${status.bg} ${status.text} ${status.border}`}>
                            {booking.vehicle?.name || 'Booking'}
                          </div>
                        );
                      })}
                      {day.blocks.slice(0, 1).map((block) => (
                        <div key={block.id} className="truncate rounded-2xl border border-[#DC2626]/20 bg-[#FEF3F2] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#B91C1C]">
                          {block.note || 'Blocked'}
                        </div>
                      ))}
                      {day.bookings.length + day.blocks.length > 3 && (
                        <div className="text-[10px] font-semibold text-[#9CA3AF]">+{day.bookings.length + day.blocks.length - 3} more</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="space-y-6">
          {/* Calendar Key */}
          <motion.div variants={staggerItem} className="rounded-3xl border border-[#ECECEC] bg-white p-6 shadow-sm">
            <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#0F0F0F] mb-5 flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-[#C9A75D]" /> Calendar Key
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Confirmed Trip',        dot: '#16A34A' },
                { label: 'Active Trip',           dot: '#2563EB' },
                { label: 'Pending Request',       dot: '#F59E0B' },
                { label: 'Completed',             dot: '#666666' },
                { label: 'Maintenance / Blocked', dot: '#DC2626' },
              ].map((k) => (
                <div key={k.label} className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: k.dot }} />
                  <span className="text-[12px] font-semibold text-[#0F0F0F]">{k.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Blocked Periods */}
          {blockedDates.length > 0 && (
            <motion.div variants={staggerItem} className="rounded-3xl border border-[#ECECEC] bg-white p-6 shadow-sm">
              <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#0F0F0F] mb-4 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#DC2626]" /> Blocked Periods
              </h3>
              <div className="space-y-2">
                {blockedDates.map((block) => (
                  <div key={block.id} className="flex items-start justify-between gap-2 p-2.5 rounded-xl bg-[#DC2626]/5 border border-[#DC2626]/15">
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-[#DC2626] truncate">{block.note || 'Maintenance'}</p>
                      <p className="text-[10px] text-[#9CA3AF] mt-0.5">{block.startDate} – {block.endDate}</p>
                    </div>
                    <button onClick={() => handleRemoveBlock(block.id)} className="shrink-0 text-[#DC2626] hover:text-[#B91C1C] transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {showBlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#08152E]/40 p-4">
          <div className="w-full max-w-2xl rounded-[32px] bg-white p-6 shadow-2xl border border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-[#0F0F0F]">Create a blocked period</h2>
                <p className="text-sm text-[#64748B]">Reserve time for maintenance, fleet prep, or vendor inspections.</p>
              </div>
              <button type="button" onClick={() => setShowBlockModal(false)} className="text-[#9CA3AF] hover:text-[#0F0F0F] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <label className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#64748B]">Vehicle</label>
                <CustomSelect
                  value={blockForm.vehicleId}
                  onChange={(value) => setBlockForm((prev) => ({ ...prev, vehicleId: value }))}
                  options={[
                    { value: 'all', label: 'All vehicles' },
                    ...activeVehicles.map((vehicle) => ({ value: vehicle._id, label: vehicle.name || vehicle.model || 'Unnamed Vehicle' })),
                  ]}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#64748B]">Note</label>
                <input
                  type="text"
                  value={blockForm.note}
                  onChange={(e) => setBlockForm((prev) => ({ ...prev, note: e.target.value }))}
                  className="w-full rounded-2xl border border-[#ECECEC] bg-[#F8FAFC] px-4 py-3 text-sm text-[#0F0F0F] outline-none focus:border-[#C9A75D]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#64748B]">Start date</label>
                <input
                  type="date"
                  value={blockForm.startDate}
                  onChange={(e) => setBlockForm((prev) => ({ ...prev, startDate: e.target.value }))}
                  className="w-full rounded-2xl border border-[#ECECEC] bg-[#F8FAFC] px-4 py-3 text-sm text-[#0F0F0F] outline-none focus:border-[#C9A75D]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#64748B]">End date</label>
                <input
                  type="date"
                  value={blockForm.endDate}
                  onChange={(e) => setBlockForm((prev) => ({ ...prev, endDate: e.target.value }))}
                  className="w-full rounded-2xl border border-[#ECECEC] bg-[#F8FAFC] px-4 py-3 text-sm text-[#0F0F0F] outline-none focus:border-[#C9A75D]"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setShowBlockModal(false)} className="rounded-2xl border border-[#E5E7EB] px-6 py-3 text-sm font-semibold text-[#475569] hover:bg-[#F5F5F5] transition">
                Cancel
              </button>
              <button type="button" onClick={handleAddBlock} className="rounded-2xl bg-[#0F0F0F] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1A1A1A] transition">
                Save blocked dates
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}