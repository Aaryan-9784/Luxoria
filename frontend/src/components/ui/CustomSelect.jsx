import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CustomSelect({
  value,
  onChange,
  options,
  icon: Icon = Filter,
  className,
  placeholder = 'Select an option',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Find the currently selected option label
  const selectedOption = options?.find((opt) => opt.value === value) || null;

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={ref} className={cn('relative w-full', className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'w-full flex items-center justify-between gap-3',
          'bg-[#F5F5F5] border border-[#ECECEC] rounded-xl pl-4 pr-3 py-3',
          'text-[13px] text-[#0F0F0F] font-medium',
          'transition-all duration-200 cursor-pointer focus:outline-none',
          'hover:border-[#C9A75D] focus:border-[#C9A75D] focus:ring-1 focus:ring-[#C9A75D]/40',
          isOpen && 'border-[#C9A75D] ring-1 ring-[#C9A75D]/40'
        )}
      >
        <span className="flex items-center gap-2.5 truncate min-w-0">
          {Icon && <Icon className="w-4 h-4 text-[#888] shrink-0" />}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-[#888] shrink-0 transition-transform duration-200',
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
            className="absolute z-[9999] w-full mt-2 bg-white border border-[#ECECEC] rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="py-1.5 max-h-64 overflow-y-auto">
              {options?.map((option) => {
                const isSelected = value === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      'w-full text-left px-4 py-3 text-[13px]',
                      'flex items-center justify-between gap-3',
                      'transition-colors duration-150 cursor-pointer',
                      isSelected
                        ? 'bg-[#C9A75D]/10 text-[#0F0F0F] font-bold'
                        : 'text-[#374151] hover:bg-[#F5F5F5] font-medium'
                    )}
                  >
                    <span>{option.label}</span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-[#C9A75D] shrink-0" />
                    )}
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
