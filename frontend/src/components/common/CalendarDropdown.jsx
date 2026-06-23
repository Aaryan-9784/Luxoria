import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarDropdown() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="relative flex items-center">
      <button 
        onClick={() => setShowCalendar(!showCalendar)} 
        className="relative p-2 text-[#666666] hover:text-[#0F0F0F] transition-colors" 
        title="Calendar"
      >
        <CalendarIcon className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {showCalendar && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowCalendar(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-[-40px] sm:right-[-20px] md:right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-[#ECECEC] overflow-hidden z-50 p-5"
            >
              <div className="flex justify-between items-center mb-5">
                <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))} className="p-1.5 hover:bg-[#F5F5F5] rounded-lg transition-colors">
                  <ChevronLeft className="w-4 h-4 text-[#666666]" />
                </button>
                <span className="text-[14px] font-bold text-[#0F0F0F] uppercase tracking-wider">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
                <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))} className="p-1.5 hover:bg-[#F5F5F5] rounded-lg transition-colors">
                  <ChevronRight className="w-4 h-4 text-[#666666]" />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center mb-3">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="text-[10px] font-bold text-[#C9A75D] uppercase tracking-widest">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {[...Array(firstDayOfMonth)].map((_, i) => <div key={`empty-${i}`} />)}
                {[...Array(daysInMonth)].map((_, i) => (
                  <button 
                    key={i} 
                    className={`w-8 h-8 mx-auto rounded-full text-[13px] font-medium flex items-center justify-center transition-all ${
                      i + 1 === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear() 
                        ? 'bg-[#0F0F0F] text-white shadow-md' 
                        : 'text-[#666666] hover:bg-[#F5F5F5] hover:text-[#C9A75D]'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
