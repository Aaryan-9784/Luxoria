import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendorVehicles, fetchVendorBookings } from '@/redux/slices/vendorSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { Car, ChevronLeft, ChevronRight, Settings2, Plus, Calendar as CalendarIcon, ShieldAlert, X, Check, Clock, Wrench, Search } from 'lucide-react';
import CustomSelect from '@/components/ui/CustomSelect';

// ── Status config ────────────────────────────────────────────────────────────
const STATUS = {
  confirmed:  { label: 'Confirmed',  bg: 'bg-[#16A34A]/10', text: 'text-[#16A34A]', border: 'border-[#16A34A]/20', dot: '#16A34A' },
  active:     { label: 'Active',     bg: 'bg-[#2563EB]/10', text: 'text-[#2563EB]', border: 'border-[#2563EB]/20', dot: '#2563EB' },
  pending:    { label: 'Pending',    bg: 'bg-[#F59E0B]/10', text: 'text-[#F59E0B]', border: 'border-[#F59E0B]/20', dot: '#F59E0B' },
  completed:  { label: 'Completed',  bg: 'bg-[#666666]/10', text: 'text-[#666666]', border: 'border-[#666666]/20', dot: '#666666' },
  blocked:    { label: 'Maintenance',bg: 'bg-[#DC2626]/10', text: 'text-[#DC2626]', border: 'border-[#DC2626]/20', dot: '#DC2626' },
};
const getStatus = (s) => STATUS[s] || STATUS.pending;

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];


export default function VendorAvailability() {
  const dispatch = useDispatch();
  const { vehicles, bookings, loading } = useSelector(state => state.vendor);
  const { accessToken } = useSelector(state => state.auth);

  const [selectedVehicle, setSelectedVehicle] = useState('all');
  const [currentDate, setCurrentDate]         = useState(new Date());
  const [blockedDates, setBlockedDates]        = useState([]); // [{ date: 'YYYY-MM-DD', vehicleId, note }]
  const [showBlockModal, setShowBlockModal]    = useState(false);
  const [blockForm, setBlockForm]              = useState({ startDate: '', endDate: '', vehicleId: 'all', note: '' });
  const [selectedDay, setSelectedDay]          = useState(null); // for day detail popover
  const [jumpInput, setJumpInput]              = useState('');   // "MM/YYYY" search input

  useEffect(() => {
    if (!accessToken) return;
    dispatch(fetchVendorVehicles());
    dispatch(fetchVendorBookings());
  }, [dispatch, accessToken]);

  const activeVehicles = vehicles.filter(v => v.status === 'approved');

  // ── Calendar math ──────────────────────────────────────────────────────────
  const year  = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth    = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const prevMonth  = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth  = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday  = () => setCurrentDate(new Date());

  // Jump to typed date — accepts: "MM/YYYY", "Month YYYY", or native date input "YYYY-MM"
  const handleJumpDate = (raw) => {
    setJumpInput(raw);
    const s = raw.trim();
    let parsed = null;

    // "YYYY-MM" from native month input
    if (/^\d{4}-\d{2}$/.test(s)) {
      const [y, m] = s.split('-').map(Number);
      parsed = new Date(y, m - 1, 1);
    }
    // "MM/YYYY"
    else if (/^\d{1,2}\/\d{4}$/.test(s)) {
      const [m, y] = s.split('/').map(Number);
      if (m >= 1 && m <= 12) parsed = new Date(y, m - 1, 1);
    }
    // "Month YYYY" e.g. "July 2026"
    else {
      const idx = MONTHS.findIndex(mn => s.toLowerCase().startsWith(mn.toLowerCase()));
      const yearMatch = s.match(/\d{4}/);
      if (idx !== -1 && yearMatch) parsed = new Date(Number(yearMatch[0]), idx, 1);
    }

    if (parsed && !isNaN(parsed)) setCurrentDate(parsed);
  };

  // ── Date key helper ────────────────────────────────────────────────────────
  const dateKey = (d) => {
    const dd = new Date(d);
    return `${dd.getFullYear()}-${String(dd.getMonth()+1).padStart(2,'0')}-${String(dd.getDate()).padStart(2,'0')}`;
  };


  // ── Build calendar days ────────────────────────────────────────────────────
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push({ empty: true });

  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d);
    const key = dateKey(dateObj);

    // Real bookings for this day
    const dayBookings = bookings.filter(b => {
      if (b.status === 'cancelled') return false;
      if (selectedVehicle !== 'all') {
        const vid = b.vehicle?._id?.toString() ?? b.vehicle?.toString() ?? '';
        if (vid !== selectedVehicle) return false;
      }
      const start = new Date(b.startDate); start.setHours(0,0,0,0);
      const end   = new Date(b.endDate);   end.setHours(23,59,59,999);
      return dateObj >= start && dateObj <= end;
    });

    // Manual blocks for this day
    const dayBlocks = blockedDates.filter(bl => {
      if (selectedVehicle !== 'all' && bl.vehicleId !== 'all' && bl.vehicleId !== selectedVehicle) return false;
      return key >= bl.startDate && key <= bl.endDate;
    });

    calendarDays.push({
      date: d, fullDate: dateObj, key,
      bookings: dayBookings,
      blocks: dayBlocks,
      isToday: dateObj.toDateString() === new Date().toDateString(),
      isPast:  dateObj < new Date(new Date().setHours(0,0,0,0)),
    });
  }


  // ── Block Dates handler ────────────────────────────────────────────────────
  const handleAddBlock = () => {
    if (!blockForm.startDate || !blockForm.endDate) return;
    if (blockForm.endDate < blockForm.startDate) return;
    setBlockedDates(prev => [...prev, { ...blockForm, id: Date.now() }]);
    setBlockForm({ startDate: '', endDate: '', vehicleId: 'all', note: '' });
    setShowBlockModal(false);
  };

  const handleRemoveBlock = (id) => {
    setBlockedDates(prev => prev.filter(b => b.id !== id));
  };

  // ── Sync / Export .ics ────────────────────────────────────────────────────
  const handleSyncCalendar = () => {
    const upcoming = bookings.filter(b =>
      (b.status === 'confirmed' || b.status === 'active') &&
      new Date(b.startDate) >= new Date()
    );
    if (upcoming.length === 0) {
      alert('No upcoming confirmed bookings to export.');
      return;
    }
    const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Luxoria//Fleet Calendar//EN'];
    upcoming.forEach(b => {
      const fmt = (d) => new Date(d).toISOString().replace(/[-:]/g,'').split('.')[0] + 'Z';
      lines.push('BEGIN:VEVENT');
      lines.push(`UID:${b._id}@luxoria`);
      lines.push(`DTSTART:${fmt(b.startDate)}`);
      lines.push(`DTEND:${fmt(b.endDate)}`);
      lines.push(`SUMMARY:${b.vehicle?.name || 'Vehicle'} – Booked`);
      lines.push(`DESCRIPTION:Booking ${b.bookingId || b._id}`);
      lines.push('END:VEVENT');
    });
    lines.push('END:VCALENDAR');
    const blob    = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = 'luxoria-fleet-calendar.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 150);
  };


  // ── Up Next ────────────────────────────────────────────────────────────────
  const upNext = bookings
    .filter(b => {
      if (b.status !== 'confirmed' && b.status !== 'active') return false;
      if (selectedVehicle !== 'all') {
        const vid = b.vehicle?._id?.toString() ?? b.vehicle?.toString() ?? '';
        if (vid !== selectedVehicle) return false;
      }
      return new Date(b.startDate) >= new Date(new Date().setHours(0,0,0,0));
    })
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, 4);

  if (loading && vehicles.length === 0 && bookings.length === 0) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#C9A75D] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[#666666] font-medium uppercase tracking-widest text-sm animate-pulse">Syncing Calendar Data</p>
      </div>
    );
  }


  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-10 pb-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-2">
        <div>
          <h1 className="text-[28px] font-bold text-[#0F0F0F] tracking-tight mb-1.5" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Fleet Calendar</h1>
          <p className="text-[#666666] text-sm font-medium tracking-wide">Manage vehicle availability, view upcoming bookings, and schedule maintenance blocks.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none z-10" />
            <CustomSelect
              value={selectedVehicle}
              onChange={setSelectedVehicle}
              options={[
                { value: 'all', label: 'All Vehicles' },
                ...activeVehicles.map(v => ({ value: v._id, label: v.name }))
              ]}
              icon={null}
              className="w-full text-[13px] py-3 pl-11 shadow-sm"
            />
          </div>
          <button
            onClick={() => setShowBlockModal(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#0F0F0F] text-[#C9A75D] text-[11px] font-bold uppercase tracking-wider rounded-xl hover:bg-[#1A1A1A] hover:shadow-lg transition-all w-full sm:w-auto shrink-0"
          >
            <ShieldAlert className="w-4 h-4" /> Block Dates
          </button>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Calendar */}
        <motion.div variants={staggerItem} className="lg:col-span-3 bg-white border border-[#ECECEC] rounded-2xl p-6 flex flex-col shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[24px] font-bold text-[#0F0F0F] tracking-tight" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              {MONTHS[month]} {year}
            </h2>
            <div className="flex items-center gap-3">
              {/* Date search / jump input */}
              <div className="relative hidden sm:flex items-center">
                <Search className="absolute left-3 w-3.5 h-3.5 text-[#9CA3AF] pointer-events-none" />
                <input
                  type="month"
                  value={`${year}-${String(month + 1).padStart(2, '0')}`}
                  onChange={(e) => handleJumpDate(e.target.value)}
                  title="Jump to month"
                  className="pl-8 pr-3 h-10 border border-[#ECECEC] rounded-full text-[12px] font-semibold text-[#0F0F0F] bg-white focus:outline-none focus:border-[#C9A75D] focus:ring-1 focus:ring-[#C9A75D]/30 cursor-pointer hover:border-[#C9A75D]/50 transition-colors"
                  style={{ colorScheme: 'light' }}
                />
              </div>
              {/* Prev / Today / Next */}
              <button onClick={prevMonth} className="w-10 h-10 rounded-full border border-[#ECECEC] flex items-center justify-center text-[#0F0F0F] hover:bg-[#F5F5F5] transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={goToToday} className="px-4 h-10 rounded-full border border-[#ECECEC] text-[#0F0F0F] text-[11px] font-bold uppercase tracking-wider hover:bg-[#F5F5F5] transition-colors">
                Today
              </button>
              <button onClick={nextMonth} className="w-10 h-10 rounded-full border border-[#ECECEC] flex items-center justify-center text-[#0F0F0F] hover:bg-[#F5F5F5] transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-7 mb-2">
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(day => (
                <div key={day} className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider text-center py-2">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-px bg-[#ECECEC] border border-[#ECECEC] rounded-xl overflow-hidden">
              {calendarDays.map((day, idx) => (
                <div
                  key={idx}
                  onClick={() => !day.empty && setSelectedDay(day)}
                  className={`min-h-[100px] p-2 bg-white transition-colors
                    ${day.empty ? 'bg-[#F9FAFB] cursor-default' : 'cursor-pointer hover:bg-[#FAFAF8]'}
                    ${day.isToday ? 'ring-2 ring-inset ring-[#C9A75D]' : ''}
                    ${day.isPast && !day.empty ? 'opacity-50' : ''}
                  `}
                >
                  {!day.empty && (
                    <>
                      <span className={`text-[13px] font-bold w-7 h-7 flex items-center justify-center rounded-full mb-1
                        ${day.isToday ? 'bg-[#0F0F0F] text-[#C9A75D]' : 'text-[#0F0F0F]'}`}>
                        {day.date}
                      </span>
                      <div className="space-y-1">
                        {day.bookings.slice(0, 2).map((b, i) => {
                          const sc = getStatus(b.status);
                          return (
                            <div key={i} className={`px-1.5 py-1 rounded text-[9px] font-bold uppercase tracking-wide truncate border ${sc.bg} ${sc.text} ${sc.border}`}>
                              {b.vehicle?.name || 'Booked'}
                            </div>
                          );
                        })}
                        {day.blocks.slice(0, 1).map((bl, i) => (
                          <div key={`bl-${i}`} className="px-1.5 py-1 rounded text-[9px] font-bold uppercase tracking-wide truncate border bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/20">
                            {bl.note || 'Blocked'}
                          </div>
                        ))}
                        {(day.bookings.length + day.blocks.length) > 3 && (
                          <div className="text-[9px] font-bold text-[#9CA3AF] pl-1">
                            +{day.bookings.length + day.blocks.length - 3} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>


        {/* Sidebar */}
        <motion.div variants={staggerItem} className="lg:col-span-1 space-y-6">

          {/* Calendar Key */}
          <div className="bg-white border border-[#ECECEC] rounded-2xl p-6 shadow-sm">
            <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#0F0F0F] mb-5 flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-[#C9A75D]" /> Calendar Key
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Confirmed Trip',      dot: '#16A34A' },
                { label: 'Active Trip',         dot: '#2563EB' },
                { label: 'Pending Request',     dot: '#F59E0B' },
                { label: 'Completed',           dot: '#666666' },
                { label: 'Maintenance / Blocked', dot: '#DC2626' },
              ].map(k => (
                <div key={k.label} className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: k.dot }} />
                  <span className="text-[12px] font-semibold text-[#0F0F0F]">{k.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Up Next */}
          <div className="bg-white border border-[#ECECEC] rounded-2xl p-6 shadow-sm">
            <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#0F0F0F] mb-5 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-[#C9A75D]" /> Up Next
            </h3>
            <div className="space-y-3">
              {upNext.length === 0 ? (
                <p className="text-[12px] font-bold text-[#9CA3AF] uppercase tracking-wider text-center py-4">No upcoming trips.</p>
              ) : (
                upNext.map((b, i) => (
                  <div key={i} className="flex gap-3 items-start pb-3 border-b border-[#F5F5F5] last:border-0 last:pb-0">
                    <div className="w-10 h-10 rounded-lg bg-[#F5F5F5] flex flex-col items-center justify-center shrink-0 border border-[#ECECEC]">
                      <span className="text-[9px] font-bold text-[#9CA3AF] uppercase leading-none">{new Date(b.startDate).toLocaleDateString('en-US',{month:'short'})}</span>
                      <span className="text-[14px] font-bold text-[#0F0F0F] leading-none mt-0.5">{new Date(b.startDate).getDate()}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[13px] text-[#0F0F0F] truncate">{b.vehicle?.name || 'Vehicle'}</p>
                      <p className="text-[10px] font-bold text-[#C9A75D] uppercase tracking-wide mt-0.5">
                        {new Date(b.startDate).toLocaleDateString('en-US',{month:'short',day:'numeric'})} – {new Date(b.endDate).toLocaleDateString('en-US',{month:'short',day:'numeric'})}
                      </p>
                      <span className={`inline-block mt-1 text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded border ${getStatus(b.status).bg} ${getStatus(b.status).text} ${getStatus(b.status).border}`}>
                        {getStatus(b.status).label}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button
              onClick={handleSyncCalendar}
              className="w-full mt-5 py-2.5 bg-[#0F0F0F] text-[#C9A75D] rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-[#1A1A1A] transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-3.5 h-3.5" /> Sync External Calendar
            </button>
          </div>

          {/* Active Blocks */}
          {blockedDates.length > 0 && (
            <div className="bg-white border border-[#ECECEC] rounded-2xl p-6 shadow-sm">
              <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#0F0F0F] mb-4 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#DC2626]" /> Blocked Periods
              </h3>
              <div className="space-y-2">
                {blockedDates.map(bl => (
                  <div key={bl.id} className="flex items-start justify-between gap-2 p-2.5 rounded-lg bg-[#DC2626]/5 border border-[#DC2626]/15">
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-[#DC2626] truncate">{bl.note || 'Maintenance'}</p>
                      <p className="text-[10px] text-[#9CA3AF] mt-0.5">{bl.startDate} – {bl.endDate}</p>
                    </div>
                    <button onClick={() => handleRemoveBlock(bl.id)} className="shrink-0 text-[#DC2626] hover:text-[#B91C1C] transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>


      {/* ── Block Dates Modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {showBlockModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setShowBlockModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-[17px] font-bold text-[#0F0F0F]" style={{ fontFamily: 'Georgia, serif' }}>Block Dates</h3>
                  <p className="text-[12px] text-[#9CA3AF] font-medium mt-0.5">Mark dates as maintenance or unavailable</p>
                </div>
                <button onClick={() => setShowBlockModal(false)} className="w-8 h-8 rounded-full border border-[#ECECEC] flex items-center justify-center hover:bg-[#F5F5F5] transition-colors">
                  <X className="w-4 h-4 text-[#666666]" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Vehicle */}
                <div>
                  <label className="text-[11px] font-bold text-[#666666] uppercase tracking-wider block mb-1.5">Vehicle</label>
                  <CustomSelect
                    value={blockForm.vehicleId}
                    onChange={(v) => setBlockForm(f => ({ ...f, vehicleId: v }))}
                    options={[
                      { value: 'all', label: 'All Vehicles' },
                      ...activeVehicles.map(v => ({ value: v._id, label: v.name }))
                    ]}
                    className="w-full text-[13px]"
                  />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#666666] uppercase tracking-wider block mb-1.5">Start Date</label>
                    <input
                      type="date"
                      value={blockForm.startDate}
                      onChange={(e) => setBlockForm(f => ({ ...f, startDate: e.target.value }))}
                      className="w-full border border-[#ECECEC] rounded-xl px-3 py-2.5 text-[13px] font-medium text-[#0F0F0F] focus:outline-none focus:border-[#C9A75D] focus:ring-1 focus:ring-[#C9A75D]/30 bg-[#F9FAFB]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#666666] uppercase tracking-wider block mb-1.5">End Date</label>
                    <input
                      type="date"
                      value={blockForm.endDate}
                      min={blockForm.startDate}
                      onChange={(e) => setBlockForm(f => ({ ...f, endDate: e.target.value }))}
                      className="w-full border border-[#ECECEC] rounded-xl px-3 py-2.5 text-[13px] font-medium text-[#0F0F0F] focus:outline-none focus:border-[#C9A75D] focus:ring-1 focus:ring-[#C9A75D]/30 bg-[#F9FAFB]"
                    />
                  </div>
                </div>

                {/* Note */}
                <div>
                  <label className="text-[11px] font-bold text-[#666666] uppercase tracking-wider block mb-1.5">Reason (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Scheduled maintenance"
                    value={blockForm.note}
                    onChange={(e) => setBlockForm(f => ({ ...f, note: e.target.value }))}
                    className="w-full border border-[#ECECEC] rounded-xl px-3 py-2.5 text-[13px] font-medium text-[#0F0F0F] focus:outline-none focus:border-[#C9A75D] focus:ring-1 focus:ring-[#C9A75D]/30 bg-[#F9FAFB] placeholder-[#CCCCCC]"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowBlockModal(false)} className="flex-1 py-3 border border-[#ECECEC] rounded-xl text-[12px] font-bold text-[#666666] uppercase tracking-wider hover:bg-[#F5F5F5] transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleAddBlock}
                  disabled={!blockForm.startDate || !blockForm.endDate}
                  className="flex-1 py-3 bg-[#0F0F0F] text-[#C9A75D] rounded-xl text-[12px] font-bold uppercase tracking-wider hover:bg-[#1A1A1A] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" /> Confirm Block
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* ── Day Detail Popover ────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedDay && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setSelectedDay(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-[17px] font-bold text-[#0F0F0F]" style={{ fontFamily: 'Georgia, serif' }}>
                    {selectedDay.fullDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </h3>
                  <p className="text-[12px] text-[#9CA3AF] mt-0.5">
                    {selectedDay.bookings.length + selectedDay.blocks.length} event{selectedDay.bookings.length + selectedDay.blocks.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <button onClick={() => setSelectedDay(null)} className="w-8 h-8 rounded-full border border-[#ECECEC] flex items-center justify-center hover:bg-[#F5F5F5] transition-colors">
                  <X className="w-4 h-4 text-[#666666]" />
                </button>
              </div>

              {selectedDay.bookings.length === 0 && selectedDay.blocks.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-8 h-8 text-[#E0E0E0] mx-auto mb-2" />
                  <p className="text-[12px] font-bold text-[#CCCCCC] uppercase tracking-widest">No events this day</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-72 overflow-y-auto">
                  {selectedDay.bookings.map((b, i) => {
                    const sc = getStatus(b.status);
                    return (
                      <div key={i} className={`p-3 rounded-xl border ${sc.bg} ${sc.border}`}>
                        <div className="flex items-center justify-between">
                          <p className={`text-[13px] font-bold ${sc.text}`}>{b.vehicle?.name || 'Vehicle'}</p>
                          <span className={`text-[10px] font-bold uppercase tracking-wide ${sc.text}`}>{sc.label}</span>
                        </div>
                        <p className="text-[11px] text-[#9CA3AF] mt-1">
                          {new Date(b.startDate).toLocaleDateString('en-US',{month:'short',day:'numeric'})} – {new Date(b.endDate).toLocaleDateString('en-US',{month:'short',day:'numeric'})}
                          {b.totalDays ? ` · ${b.totalDays} day${b.totalDays>1?'s':''}` : ''}
                        </p>
                        {b.bookingId && <p className="text-[10px] font-mono text-[#9CA3AF] mt-0.5">{b.bookingId}</p>}
                      </div>
                    );
                  })}
                  {selectedDay.blocks.map((bl, i) => (
                    <div key={`bl-${i}`} className="p-3 rounded-xl border bg-[#DC2626]/5 border-[#DC2626]/20">
                      <div className="flex items-center justify-between">
                        <p className="text-[13px] font-bold text-[#DC2626]">{bl.note || 'Maintenance'}</p>
                        <span className="text-[10px] font-bold uppercase tracking-wide text-[#DC2626]">Blocked</span>
                      </div>
                      <p className="text-[11px] text-[#9CA3AF] mt-1">{bl.startDate} – {bl.endDate}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
