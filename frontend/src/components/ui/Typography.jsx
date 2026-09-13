import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Luxury section header — used for page sections.
 */
export function SectionHeader({
  overline,
  title,
  description,
  align = 'left',
  className,
  children, // right-side action slot
}) {
  return (
    <div className={cn(
      'flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12',
      align === 'center' && 'text-center md:flex-col md:items-center',
      className
    )}>
      <div className={align === 'center' ? 'max-w-2xl mx-auto' : ''}>
        {overline && (
          <span className="text-overline text-accent mb-3 block">{overline}</span>
        )}
        <h2 className="text-h2 text-primary mb-3">{title}</h2>
        {description && (
          <p className="text-body text-secondary max-w-xl leading-relaxed">{description}</p>
        )}
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  );
}

/**
 * Dashboard page header — breadcrumb-like with title and actions.
 */
export function PageHeader({
  title,
  description,
  breadcrumb,
  children, // action slot
  className,
}) {
  return (
    <div className={cn('mb-8', className)}>
      {breadcrumb && (
        <div className="flex items-center gap-2 text-caption text-muted mb-3">
          {breadcrumb}
        </div>
      )}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-h3 text-primary">{title}</h1>
          {description && (
            <p className="text-body-sm text-secondary mt-1">{description}</p>
          )}
        </div>
        {children && <div className="flex items-center gap-3">{children}</div>}
      </div>
    </div>
  );
}

/**
 * Overline label — small uppercase label above sections.
 */
export function Overline({ children, className }) {
  return (
    <span className={cn('text-overline text-accent', className)}>
      {children}
    </span>
  );
}

/**
 * Divider — subtle horizontal line.
 */
export function Divider({ variant = 'default', className }) {
  return (
    <div className={cn(
      variant === 'default' && 'divider',
      variant === 'subtle' && 'divider-subtle',
      variant === 'gold' && 'divider-gold',
      className
    )} />
  );
}
