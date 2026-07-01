import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function isSameDay(a, b) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isInRange(day, start, end) {
  if (!start || !end) return false;
  const t = day.getTime();
  return t > start.getTime() && t < end.getTime();
}

function formatDate(date) {
  if (!date) return '';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/**
 * DateRangePicker
 *
 * Props:
 *   startDate  {Date|null}
 *   endDate    {Date|null}
 *   onChange   ({startDate, endDate}) => void
 *   className  string
 *   placeholder string  (shown when nothing selected)
 */
export default function DateRangePicker({
  startDate = null,
  endDate = null,
  onChange,
  className,
  placeholder = 'Filter by date range...',
}) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const [hoverDate, setHoverDate] = useState(null);
  // internal selection state
  const [selecting, setSelecting] = useState(null); // null | Date (first click awaiting end)
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const today = new Date();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const handleDayClick = (day) => {
    const clicked = new Date(year, month, day);
    if (!selecting) {
      // First click: set start, wait for end
      setSelecting(clicked);
      onChange({ startDate: clicked, endDate: null });
    } else {
      // Second click: finalise range
      if (clicked < selecting) {
        onChange({ startDate: clicked, endDate: selecting });
      } else {
        onChange({ startDate: selecting, endDate: clicked });
      }
      setSelecting(null);
      setOpen(false);
    }
  };

  const clearDates = (e) => {
    e.stopPropagation();
    setSelecting(null);
    onChange({ startDate: null, endDate: null });
  };

  // Label shown in the trigger button
  const hasValue = startDate || endDate;
  const triggerLabel = hasValue
    ? startDate && endDate
      ? `${formatDate(startDate)} → ${formatDate(endDate)}`
      : startDate
      ? `${formatDate(startDate)} → …`
      : ''
    : '';

  // For hover preview while selecting
  const previewEnd = selecting ? hoverDate : null;
  const effectiveStart = selecting ?? startDate;
  const effectiveEnd = previewEnd ?? endDate;

  const getDayState = (day) => {
    const d = new Date(year, month, day);
    const isStart = isSameDay(d, effectiveStart);
    const isEnd = isSameDay(d, effectiveEnd);
    const inRange = isInRange(d, effectiveStart, effectiveEnd);
    const isToday = isSameDay(d, today);
    return { isStart, isEnd, inRange, isToday };
  };

  return (
    <div ref={ref} className={cn('relative', className)}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex items-center gap-2.5 w-full bg-white border border-[#ECECEC] rounded-xl',
          'px-4 py-2.5 text-[13px] font-medium transition-all duration-200',
          'hover:border-[#C9A75D] focus:outline-none',
          open && 'border-[#C9A75D] ring-2 ring-[#C9A75D]/10',
          !hasValue && 'text-[#999999]',
          hasValue && 'text-[#0F0F0F]'
        )}
      >
        <CalendarDays className="w-4 h-4 text-[#C9A75D] shrink-0" />
        <span className="flex-1 text-left truncate">
          {hasValue ? triggerLabel : placeholder}
        </span>
        {hasValue && (
          <span
            onClick={clearDates}
            className="p-0.5 rounded-full hover:bg-[#F5F5F5] text-[#999999] hover:text-[#0F0F0F] transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </span>
        )}
      </button>

      {/* Calendar dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full mt-2 right-0 z-50 bg-white rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.12)] border border-[#ECECEC] p-5 w-72 select-none"
          >
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-5">
              <button
                onClick={prevMonth}
                className="p-1.5 rounded-lg hover:bg-[#F5F5F5] transition-colors text-[#666666] hover:text-[#0F0F0F]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[13px] font-bold text-[#0F0F0F] uppercase tracking-wider">
                {MONTH_NAMES[month]} {year}
              </span>
              <button
                onClick={nextMonth}
                className="p-1.5 rounded-lg hover:bg-[#F5F5F5] transition-colors text-[#666666] hover:text-[#0F0F0F]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Day labels */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {DAY_LABELS.map((d) => (
                <div
                  key={d}
                  className="text-[10px] font-bold text-[#C9A75D] uppercase tracking-widest"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {/* Empty cells for alignment */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const { isStart, isEnd, inRange, isToday } = getDayState(day);
                const d = new Date(year, month, day);

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayClick(day)}
                    onMouseEnter={() => selecting && setHoverDate(d)}
                    onMouseLeave={() => selecting && setHoverDate(null)}
                    className={cn(
                      'w-8 h-8 mx-auto rounded-full text-[13px] font-medium flex items-center justify-center transition-all duration-150 relative',
                      // Range highlight (between start and end)
                      inRange && 'bg-[#C9A75D]/10 rounded-none text-[#0F0F0F]',
                      // Start day
                      isStart && !isEnd && 'bg-[#0F0F0F] text-white shadow-md rounded-full z-10',
                      // End day
                      isEnd && !isStart && 'bg-[#0F0F0F] text-white shadow-md rounded-full z-10',
                      // Start == End (single day)
                      isStart && isEnd && 'bg-[#0F0F0F] text-white shadow-md rounded-full z-10',
                      // Today marker
                      isToday && !isStart && !isEnd && 'text-[#C9A75D] font-bold',
                      // Default hover
                      !isStart && !isEnd && !inRange && 'text-[#666666] hover:bg-[#F5F5F5] hover:text-[#C9A75D]'
                    )}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Footer hint */}
            <div className="mt-4 pt-3 border-t border-[#F5F5F5]">
              {selecting ? (
                <p className="text-[11px] text-[#C9A75D] font-bold uppercase tracking-widest text-center">
                  Select end date
                </p>
              ) : startDate && endDate ? (
                <p className="text-[11px] text-[#666666] font-medium text-center">
                  {formatDate(startDate)} → {formatDate(endDate)}
                </p>
              ) : (
                <p className="text-[11px] text-[#999999] font-medium text-center">
                  Click a date to start
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
