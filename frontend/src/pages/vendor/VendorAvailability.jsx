import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendorVehicles, fetchVendorBookings } from '@/redux/slices/vendorSlice';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { CalendarRange, Car, ChevronLeft, ChevronRight, Settings2, Plus, Calendar as CalendarIcon, ShieldAlert } from 'lucide-react';
import CustomSelect from '@/components/ui/CustomSelect';

export default function VendorAvailability() {
  const dispatch = useDispatch();
  const { vehicles, bookings, loading } = useSelector(state => state.vendor);
  
  const [selectedVehicle, setSelectedVehicle] = useState('all');
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    dispatch(fetchVendorVehicles());
    dispatch(fetchVendorBookings());
  }, [dispatch]);

  const activeVehicles = vehicles.filter(v => v.status === 'approved');

  // Calendar logic
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Generate calendar days
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push({ empty: true });
  }
  
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), d);
    // Find bookings for this day
    const dayBookings = bookings.filter(b => {
      if (b.status === 'cancelled') return false;
      if (selectedVehicle !== 'all' && b.vehicle?._id !== selectedVehicle) return false;
      
      const start = new Date(b.startDate);
      const end = new Date(b.endDate);
      start.setHours(0,0,0,0);
      end.setHours(23,59,59,999);
      
      return dateObj >= start && dateObj <= end;
    });

    calendarDays.push({
      date: d,
      fullDate: dateObj,
      bookings: dayBookings,
      isToday: dateObj.toDateString() === new Date().toDateString()
    });
  }

  if (loading && (vehicles.length === 0 || bookings.length === 0)) {
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
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#0F0F0F] text-[#C9A75D] text-[11px] font-bold uppercase tracking-wider rounded-xl hover:bg-[#1A1A1A] hover:shadow-lg transition-all w-full sm:w-auto shrink-0"
          >
            <ShieldAlert className="w-4 h-4" /> Block Dates
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Calendar View */}
        <motion.div variants={staggerItem} className="lg:col-span-3 bg-white border border-[#ECECEC] rounded-2xl p-6 flex flex-col shadow-sm">
          
          {/* Calendar Controls */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[24px] font-bold text-[#0F0F0F] tracking-tight" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="w-10 h-10 rounded-full border border-[#ECECEC] flex items-center justify-center text-[#0F0F0F] hover:bg-[#F5F5F5] transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => setCurrentDate(new Date())} className="px-4 h-10 rounded-full border border-[#ECECEC] flex items-center justify-center text-[#0F0F0F] text-[11px] font-bold uppercase tracking-wider hover:bg-[#F5F5F5] transition-colors">
                Today
              </button>
              <button onClick={nextMonth} className="w-10 h-10 rounded-full border border-[#ECECEC] flex items-center justify-center text-[#0F0F0F] hover:bg-[#F5F5F5] transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-7 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider text-center py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-px bg-[#ECECEC] border border-[#ECECEC] rounded-xl overflow-hidden">
              {calendarDays.map((day, idx) => (
                <div 
                  key={idx} 
                  className={`min-h-[120px] p-2 bg-white ${day.empty ? 'bg-[#F9FAFB]' : 'hover:bg-[#F5F5F5]/50 transition-colors cursor-pointer'} ${day.isToday ? 'ring-2 ring-inset ring-[#C9A75D]' : ''}`}
                >
                  {!day.empty && (
                    <>
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[13px] font-bold w-7 h-7 flex items-center justify-center rounded-full ${day.isToday ? 'bg-[#0F0F0F] text-[#C9A75D]' : 'text-[#0F0F0F]'}`}>
                          {day.date}
                        </span>
                      </div>
                      
                      <div className="space-y-1.5">
                        {day.bookings?.slice(0, 3).map((booking, bIdx) => (
                          <div 
                            key={bIdx} 
                            className={`px-2 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider truncate border ${
                              booking.status === 'confirmed' 
                                ? 'bg-[#16A34A]/10 text-[#16A34A] border-[#16A34A]/20' 
                                : booking.status === 'completed'
                                ? 'bg-[#666666]/10 text-[#666666] border-[#666666]/20'
                                : 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20'
                            }`}
                          >
                            {booking.vehicle?.name || 'Vehicle Booked'}
                          </div>
                        ))}
                        {day.bookings?.length > 3 && (
                          <div className="text-[10px] font-bold text-[#9CA3AF] pl-2">
                            +{day.bookings.length - 3} more
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

        {/* Legend & Summary */}
        <motion.div variants={staggerItem} className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-[#ECECEC] rounded-2xl p-6 shadow-sm">
            <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#0F0F0F] mb-6 flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-[#C9A75D]" /> Calendar Key
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded bg-[#16A34A]/10 border border-[#16A34A]/20 shrink-0" />
                <span className="text-[12px] font-bold text-[#0F0F0F]">Confirmed Trip</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded bg-[#F59E0B]/10 border border-[#F59E0B]/20 shrink-0" />
                <span className="text-[12px] font-bold text-[#0F0F0F]">Pending Request</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded bg-[#666666]/10 border border-[#666666]/20 shrink-0" />
                <span className="text-[12px] font-bold text-[#0F0F0F]">Completed</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded bg-[#DC2626]/10 border border-[#DC2626]/20 shrink-0" />
                <span className="text-[12px] font-bold text-[#0F0F0F]">Maintenance / Blocked</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#ECECEC] rounded-2xl p-6 shadow-sm">
            <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#0F0F0F] mb-6 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-[#C9A75D]" /> Up Next
            </h3>
            
            <div className="space-y-4">
              {bookings.filter(b => b.status === 'confirmed' && new Date(b.startDate) >= new Date()).slice(0, 4).length > 0 ? (
                bookings.filter(b => b.status === 'confirmed' && new Date(b.startDate) >= new Date()).slice(0, 4).map((b, i) => (
                  <div key={i} className="flex gap-4 items-start pb-4 border-b border-[#ECECEC] last:border-0 last:pb-0">
                    <div className="w-10 h-10 rounded-lg bg-[#F5F5F5] flex flex-col items-center justify-center shrink-0 border border-[#ECECEC]">
                      <span className="text-[9px] font-bold text-[#9CA3AF] uppercase leading-none">{new Date(b.startDate).toLocaleDateString('en-US', { month: 'short' })}</span>
                      <span className="text-[14px] font-bold text-[#0F0F0F] leading-none mt-1">{new Date(b.startDate).getDate()}</span>
                    </div>
                    <div>
                      <p className="font-bold text-[13px] text-[#0F0F0F] leading-tight">{b.vehicle?.name || 'Vehicle'}</p>
                      <p className="text-[10px] font-bold text-[#C9A75D] uppercase tracking-wider mt-1">{new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-[12px] font-bold text-[#9CA3AF] uppercase tracking-wider">No upcoming trips.</p>
                </div>
              )}
            </div>
            
            <button className="w-full mt-6 py-3 border border-[#ECECEC] rounded-xl text-[11px] font-bold text-[#0F0F0F] uppercase tracking-wider hover:bg-[#F5F5F5] transition-colors flex items-center justify-center gap-2">
              <Plus className="w-3.5 h-3.5" /> Sync External Calendar
            </button>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
