import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CustomSelect({
  value,
  onChange,
  options,
  icon: Icon,
  className,
  triggerClassName,
  placeholder = 'Select an option',
  variant = 'default', // 'default' | 'field' | 'pill'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKey);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen]);

  const selectedOption = options?.find((opt) => opt.value === value) || null;

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={ref} className={cn('relative w-full', className)}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'w-full flex items-center justify-between gap-3 min-h-[42px]',
          variant === 'field'
            ? 'bg-[#F5F5F5] border border-[#ECECEC] rounded-xl px-4 py-3'
            : variant === 'pill'
            ? 'bg-white border border-[#ECECEC] rounded-full px-4 py-2.5 shadow-xs'
            : 'bg-white border border-[#ECECEC] rounded-xl px-4 py-2.5 shadow-xs',
          'text-[13px] font-medium text-[#0F0F0F]',
          'transition-all duration-200 cursor-pointer focus:outline-none',
          isOpen
            ? 'border-[#C9A75D] ring-2 ring-[#C9A75D]/20 shadow-sm'
            : 'hover:border-[#C9A75D]/60 hover:bg-[#FCFBF8]',
          triggerClassName
        )}
      >
        <span className="flex items-center gap-2.5 truncate min-w-0">
          {Icon && (
            <span className={cn(
              'flex items-center justify-center w-6 h-6 rounded-full shrink-0 transition-colors',
              isOpen ? 'text-[#C9A75D]' : 'text-[#9CA3AF]'
            )}>
              <Icon className="w-3.5 h-3.5" />
            </span>
          )}
          <span className={cn('truncate tracking-wide', !selectedOption && 'text-[#9CA3AF] font-medium')}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>
        <ChevronDown
          className={cn(
            'w-4 h-4 shrink-0 transition-all duration-200',
            isOpen ? 'rotate-180 text-[#C9A75D]' : 'text-[#9CA3AF]'
          )}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute z-[9999] w-full mt-1.5 bg-white border border-[#ECECEC] rounded-xl shadow-xl overflow-hidden"
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
                      'w-full text-left px-4 py-2.5 text-[13px]',
                      'flex items-center justify-between gap-3',
                      'transition-colors duration-150 cursor-pointer',
                      isSelected
                        ? 'bg-[#C9A75D]/8 text-[#0F0F0F] font-bold'
                        : 'text-[#374151] hover:bg-[#F8F8F6] font-medium'
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
