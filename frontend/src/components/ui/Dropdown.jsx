import React from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

/**
 * Premium dropdown menu with animations.
 */
export default function Dropdown({
  trigger,
  children,
  align = 'right',
  className,
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const ref = React.useRef(null);

  // Close on outside click
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative inline-flex">
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'absolute top-full mt-2 z-50 min-w-[200px]',
              'bg-white rounded-xl border border-border shadow-xl',
              'py-1.5 overflow-hidden',
              align === 'right' && 'right-0',
              align === 'left' && 'left-0',
              align === 'center' && 'left-1/2 -translate-x-1/2',
              className
            )}
            onClick={() => setIsOpen(false)}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DropdownItem({ icon: Icon, children, danger = false, className, ...props }) {
  return (
    <button
      className={cn(
        'w-full flex items-center gap-2.5 px-4 py-2.5 text-body-sm font-medium text-left transition-colors',
        danger
          ? 'text-error hover:bg-error/5'
          : 'text-primary hover:bg-surface',
        className
      )}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      {children}
    </button>
  );
}

export function DropdownDivider() {
  return <div className="my-1.5 mx-3 h-px bg-border" />;
}
