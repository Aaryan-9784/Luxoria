import React from 'react';
import { cn } from '@/lib/utils';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Premium search bar with optional filters toggle.
 */
export default function SearchBar({
  value = '',
  onChange,
  placeholder = 'Search...',
  showFilters = false,
  onToggleFilters,
  filtersActive = false,
  size = 'md',
  className,
}) {
  const sizeClasses = {
    sm: 'py-2 px-3 text-body-sm',
    md: 'py-3 px-4 text-body-sm',
    lg: 'py-4 px-5 text-body',
  };

  return (
    <div className={cn('relative flex items-center', className)}>
      <div className="absolute left-3.5 pointer-events-none">
        <Search className={cn(
          'text-muted',
          size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'
        )} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full rounded-xl bg-white border border-border outline-none',
          'focus:border-accent focus:ring-2 focus:ring-accent/10',
          'transition-all duration-200',
          size === 'lg' ? 'pl-12' : 'pl-10',
          sizeClasses[size],
          showFilters && 'pr-12'
        )}
      />

      {/* Clear button */}
      <AnimatePresence>
        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => onChange('')}
            className={cn(
              'absolute btn-icon btn-icon-sm',
              showFilters ? 'right-11' : 'right-2'
            )}
          >
            <X className="w-3.5 h-3.5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Filters toggle */}
      {showFilters && (
        <button
          onClick={onToggleFilters}
          className={cn(
            'absolute right-2 btn-icon btn-icon-sm transition-colors',
            filtersActive && 'bg-accent/10 text-accent'
          )}
          aria-label="Toggle filters"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
