import React from 'react';
import { cn } from '@/lib/utils';

const variants = {
  primary: 'btn-primary',
  accent: 'btn-accent',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
};

const sizes = {
  xs: 'btn-xs',
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
  xl: 'btn-xl',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  pill = false,
  loading = false,
  disabled = false,
  icon: Icon,
  iconRight: IconRight,
  className,
  ...props
}) {
  return (
    <button
      className={cn(
        'btn',
        variants[variant],
        sizes[size],
        pill && 'btn-pill',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className={cn('spinner', variant !== 'primary' && variant !== 'accent' && variant !== 'danger' && 'spinner-dark')} />
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 shrink-0" />}
          {children}
          {IconRight && <IconRight className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
}

/**
 * Icon-only button — for toolbars, actions, etc.
 */
export function IconButton({
  icon: Icon,
  size = 'md',
  className,
  label,
  ...props
}) {
  const sizeClass = size === 'sm' ? 'btn-icon-sm' : size === 'lg' ? 'btn-icon-lg' : '';
  return (
    <button
      className={cn('btn-icon', sizeClass, className)}
      aria-label={label}
      title={label}
      {...props}
    >
      <Icon className={cn(
        size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'
      )} />
    </button>
  );
}
