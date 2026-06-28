import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Premium Avatar component.
 */
export default function Avatar({
  src,
  alt = '',
  name = '',
  size = 'md',
  className,
}) {
  const [hasError, setHasError] = React.useState(false);

  const sizeClasses = {
    xs: 'w-7 h-7 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
    '2xl': 'w-24 h-24 text-2xl',
  };

  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  if (src && !hasError) {
    return (
      <img
        src={src}
        alt={alt || name}
        onError={() => setHasError(true)}
        className={cn(
          'rounded-full object-cover border-2 border-white shadow-sm',
          sizeClasses[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold',
        'bg-gradient-to-br from-surface to-border text-secondary border-2 border-white shadow-sm',
        sizeClasses[size],
        className
      )}
      title={name}
    >
      {initials}
    </div>
  );
}

/**
 * Avatar Group — stacked, overlapping
 */
export function AvatarGroup({ avatars = [], max = 4, size = 'md', className }) {
  const displayed = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className={cn('flex -space-x-2', className)}>
      {displayed.map((avatar, i) => (
        <Avatar key={i} {...avatar} size={size} className="ring-2 ring-background" />
      ))}
      {remaining > 0 && (
        <div className={cn(
          'rounded-full flex items-center justify-center font-semibold bg-surface text-secondary border-2 border-background text-xs',
          size === 'sm' ? 'w-8 h-8' : 'w-10 h-10'
        )}>
          +{remaining}
        </div>
      )}
    </div>
  );
}
