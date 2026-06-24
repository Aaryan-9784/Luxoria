import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CustomSelect({ 
  value, 
  onChange, 
  options, 
  icon: Icon = Filter,
  className 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <div ref={ref} className="relative w-full sm:w-auto">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn("w-full sm:w-auto min-w-[150px] flex items-center justify-between bg-white border border-[#ECECEC] rounded-xl pl-4 pr-3 py-2.5 text-[13px] text-[#0F0F0F] hover:border-[#C9A75D] transition-colors appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C9A75D]/30", className)}
      >
        <span className="truncate pr-4 font-medium">{selectedOption?.label}</span>
        {Icon && <Icon className="w-4 h-4 text-[#666666] shrink-0" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-white border border-[#ECECEC] rounded-xl shadow-xl overflow-hidden"
          >
            <div className="py-1 max-h-60 overflow-y-auto">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-2.5 text-[13px] transition-colors",
                    value === option.value 
                      ? "bg-[#C9A75D]/10 text-[#C9A75D] font-bold" 
                      : "text-[#0F0F0F] hover:bg-[#F5F5F5] font-medium"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
