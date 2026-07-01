import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAY_LABELS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

function isSameDay(a, b) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function CalendarDropdown() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const today = new Date();
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const handleDayClick = (day) => {
    const clicked = new Date(year, month, day);
    if (selectedDate && isSameDay(selectedDate, clicked)) {
      // toggle off on same day
      setSelectedDate(null);
    } else {
      setSelectedDate(clicked);
      setShowCalendar(false);
    }
  };

  const clearSelected = (e) => {
    e.stopPropagation();
    setSelectedDate(null);
  };

  // Trigger label
  const triggerLabel = selectedDate
    ? selectedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  return (
    <div className="relative flex items-center">
      {/* Trigger button */}
      <button
        onClick={() => setShowCalendar(!showCalendar)}
        className={`relative flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all duration-200 group ${
          showCalendar || selectedDate
            ? 'bg-[#F5F5F5] border border-[#C9A75D]/40 text-[#0F0F0F]'
            : 'text-[#666666] hover:text-[#0F0F0F] hover:bg-[#F5F5F5] border border-transparent'
        }`}
        title="Date Navigator"
      >
        <CalendarIcon className={`w-[18px] h-[18px] shrink-0 transition-colors ${selectedDate ? 'text-[#C9A75D]' : 'group-hover:text-[#C9A75D]'}`} />
        {triggerLabel && (
          <span className="text-[12px] font-bold text-[#0F0F0F] tracking-wide hidden sm:inline">
            {triggerLabel}
          </span>
        )}
        {selectedDate && (
          <span
            onClick={clearSelected}
            className="ml-0.5 p-0.5 rounded-full hover:bg-[#ECECEC] text-[#999999] hover:text-[#DC2626] transition-colors cursor-pointer"
          >
            <X className="w-3 h-3" />
          </span>
        )}
      </button>

      <AnimatePresence>
        {showCalendar && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setShowCalendar(false)} />

            {/* Calendar panel */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-full right-0 mt-3 w-[300px] bg-white rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.12)] border border-[#ECECEC] overflow-hidden z-50 p-5 select-none"
            >

              {/* Month / Year navigation */}
              <div className="flex justify-between items-center mb-5">
                <button
                  onClick={prevMonth}
                  className="p-2 hover:bg-[#F5F5F5] rounded-xl transition-colors text-[#666666] hover:text-[#0F0F0F]"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Clickable month/year — click year to jump to today's month */}
                <button
                  onClick={() => setViewDate(new Date())}
                  className="text-[14px] font-bold text-[#0F0F0F] uppercase tracking-wider hover:text-[#C9A75D] transition-colors"
                  title="Jump to today"
                >
                  {MONTH_NAMES[month]} {year}
                </button>

                <button
                  onClick={nextMonth}
                  className="p-2 hover:bg-[#F5F5F5] rounded-xl transition-colors text-[#666666] hover:text-[#0F0F0F]"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Day-of-week labels */}
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {DAY_LABELS.map((d) => (
                  <div
                    key={d}
                    className="text-[10px] font-bold text-[#C9A75D] uppercase tracking-widest py-1"
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Day grid */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {/* Empty spacers for alignment */}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const thisDay = new Date(year, month, day);
                  const isToday = isSameDay(thisDay, today);
                  const isSelected = isSameDay(thisDay, selectedDate);

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayClick(day)}
                      className={`
                        w-9 h-9 mx-auto rounded-full text-[13px] font-medium
                        flex items-center justify-center transition-all duration-150
                        ${isSelected
                          ? 'bg-[#0F0F0F] text-white shadow-md scale-105'
                          : isToday
                          ? 'bg-[#C9A75D]/15 text-[#C9A75D] font-bold hover:bg-[#C9A75D] hover:text-white'
                          : 'text-[#444444] hover:bg-[#F5F5F5] hover:text-[#C9A75D]'
                        }
                      `}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3 border-t border-[#F5F5F5] flex items-center justify-between">
                {selectedDate ? (
                  <p className="text-[11px] font-bold text-[#0F0F0F] tracking-wide">
                    {selectedDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                ) : (
                  <p className="text-[11px] text-[#999999] font-medium">Select a date</p>
                )}

                {/* Jump-to-today pill */}
                <button
                  onClick={() => {
                    setViewDate(new Date());
                    setSelectedDate(new Date());
                    setShowCalendar(false);
                  }}
                  className="text-[10px] font-bold uppercase tracking-widest text-[#C9A75D] hover:text-[#0F0F0F] transition-colors px-2 py-1 rounded-lg hover:bg-[#F5F5F5]"
                >
                  Today
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
