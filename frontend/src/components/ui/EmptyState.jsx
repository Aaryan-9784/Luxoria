import React from 'react';
import { cn } from '@/lib/utils';
import Button from './Button';

/**
 * Empty state with icon, title, description, and optional CTA.
 */
export default function EmptyState({
  icon: Icon,
  title = 'Nothing here yet',
  description,
  action,
  className,
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-20 px-6 text-center', className)}>
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center mb-6 shadow-inner-subtle">
          <Icon className="w-7 h-7 text-muted" />
        </div>
      )}
      <h3 className="text-h4 text-primary mb-2">{title}</h3>
      {description && (
        <p className="text-body-sm text-secondary max-w-sm">{description}</p>
      )}
      {action && (
        <div className="mt-6">
          {React.isValidElement(action) ? (
            action
          ) : action.label && action.onClick ? (
            <Button onClick={action.onClick}>{action.label}</Button>
          ) : null}
        </div>
      )}
    </div>
  );
}
