import React from 'react';
import { cn } from '@/lib/utils';

const badgeVariants = {
  primary: 'badge-primary',
  accent: 'badge-accent',
  success: 'badge-success',
  error: 'badge-error',
  warning: 'badge-warning',
  info: 'badge-info',
  muted: 'badge-muted',
};

export default function Badge({ children, variant = 'muted', dot = false, className, ...props }) {
  return (
    <span className={cn('badge', badgeVariants[variant], className)} {...props}>
      {dot && (
        <span className={cn(
          'w-1.5 h-1.5 rounded-full',
          variant === 'success' && 'bg-success',
          variant === 'error' && 'bg-error',
          variant === 'warning' && 'bg-warning',
          variant === 'info' && 'bg-info',
          variant === 'accent' && 'bg-accent',
          variant === 'primary' && 'bg-white',
          variant === 'muted' && 'bg-muted',
        )} />
      )}
      {children}
    </span>
  );
}
