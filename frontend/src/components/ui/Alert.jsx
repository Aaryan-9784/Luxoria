import React from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react';

const ICON_MAP = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const STYLE_MAP = {
  success: 'bg-success/5 border-success/20 text-success',
  error: 'bg-error/5 border-error/20 text-error',
  warning: 'bg-warning/5 border-warning/20 text-warning',
  info: 'bg-info/5 border-info/20 text-info',
};

/**
 * Premium Alert banner for inline messages.
 */
export default function Alert({
  type = 'info',
  title,
  children,
  dismissible = false,
  onDismiss,
  className,
}) {
  const [visible, setVisible] = React.useState(true);
  const Icon = ICON_MAP[type];

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.25 }}
          className={cn(
            'flex items-start gap-3 px-4 py-3.5 rounded-xl border',
            STYLE_MAP[type],
            className
          )}
          role="alert"
        >
          <Icon className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            {title && <p className="font-semibold text-body-sm mb-0.5">{title}</p>}
            <div className="text-body-sm opacity-90">{children}</div>
          </div>
          {dismissible && (
            <button onClick={handleDismiss} className="shrink-0 p-0.5 hover:opacity-70 transition-opacity">
              <X className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
