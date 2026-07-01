import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

// Priority dot colors for support ticket selects
const PRIORITY_COLORS = {
  normal: '#16A34A',
  high: '#D97706',
  urgent: '#DC2626',
};

export default function CustomSelect({
  value,
  onChange,
  options,
  icon: Icon = Filter,
  className,
  placeholder,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value) || null;
  const isPrioritySelect = options.some((opt) => PRIORITY_COLORS[opt.value]);
  const hasValue = !!selectedOption;

  return (
    <div ref={ref} className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between gap-3 bg-[#F5F5F5] border border-[#ECECEC] rounded-xl pl-4 pr-4 py-3.5 text-[13px] text-[#0F0F0F] font-medium transition-all duration-200 cursor-pointer focus:outline-none hover:border-[#C9A75D] focus:border-[#C9A75D] focus:ring-1 focus:ring-[#C9A75D]/40',
          isOpen && 'border-[#C9A75D] ring-1 ring-[#C9A75D]/40',
          className
        )}
      >
        <span className="flex items-center gap-2.5 truncate">
          {/* Priority dot — only when a value is selected */}
          {isPrioritySelect && hasValue && (
            <span
              className="w-2 h-2 rounded-full shrink-0 transition-colors duration-200"
              style={{ backgroundColor: PRIORITY_COLORS[selectedOption?.value] || '#16A34A' }}
            />
          )}
          {/* Generic icon */}
          {!isPrioritySelect && Icon && (
            <Icon className="w-4 h-4 text-[#666666] shrink-0" />
          )}
          {hasValue ? (
            <span className="truncate">{selectedOption.label}</span>
          ) : (
            <span className="truncate text-[#9CA3AF] font-normal">{placeholder || 'Select an option'}</span>
          )}
        </span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-[#666666] shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180 text-[#C9A75D]'
          )}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute z-50 w-full mt-2 bg-white border border-[#ECECEC] rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="py-1.5 max-h-60 overflow-y-auto">
              {options.map((option) => {
                const isSelected = value === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'w-full text-left px-4 py-3 text-[13px] flex items-center justify-between gap-3 transition-colors duration-150',
                      isSelected
                        ? 'bg-[#C9A75D]/8 text-[#0F0F0F] font-bold'
                        : 'text-[#374151] hover:bg-[#F9F9F9] font-medium'
                    )}
                  >
                    <span className="flex items-center gap-2.5">
                      {isPrioritySelect && (
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: PRIORITY_COLORS[option.value] || '#16A34A' }}
                        />
                      )}
                      {option.label}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#C9A75D] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
