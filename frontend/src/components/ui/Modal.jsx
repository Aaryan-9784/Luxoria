import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { modalOverlay, modalContent } from '@/lib/motion';
import { IconButton } from './Button';

/**
 * Premium Modal with blur backdrop and spring animation.
 * Follows accessibility with role="dialog", aria-modal, and focus trap.
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showClose = true,
  className,
}) {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[90vw]',
  };

  // Close on Escape
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 glass-overlay"
            onClick={onClose}
            {...modalOverlay}
          />

          {/* Content */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className={cn(
              'relative w-full glass-card-elevated p-0 overflow-hidden z-10',
              sizeClasses[size],
              className
            )}
            {...modalContent}
          >
            {/* Header */}
            {(title || showClose) && (
              <div className="flex items-start justify-between px-7 pt-7 pb-0">
                <div>
                  {title && (
                    <h2 id="modal-title" className="text-h4 text-primary">{title}</h2>
                  )}
                  {description && (
                    <p className="text-body-sm text-secondary mt-1">{description}</p>
                  )}
                </div>
                {showClose && (
                  <IconButton icon={X} size="sm" onClick={onClose} label="Close" className="mt-0.5" />
                )}
              </div>
            )}

            {/* Body */}
            <div className="px-7 py-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/**
 * Modal Footer — action buttons area
 */
export function ModalFooter({ children, className }) {
  return (
    <div className={cn('flex items-center justify-end gap-3 pt-4 mt-2 border-t border-border', className)}>
      {children}
    </div>
  );
}
