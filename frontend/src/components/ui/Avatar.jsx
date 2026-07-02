import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Premium Avatar component.
 *
 * variant="default"  — light surface background with initials fallback (used in lists, cards)
 * variant="luxury"   — Luxoria-branded: gold ring + black background + gold initial (used in nav/topbar)
 * showOnline         — show green online dot (luxury variant only)
 */
export default function Avatar({
  src,
  alt = '',
  name = '',
  size = 'md',
  variant = 'default',
  showOnline = false,
  className,
}) {
  const [hasError, setHasError] = React.useState(false);

  // Reset error state whenever the src URL changes so a new image is always attempted
  React.useEffect(() => {
    setHasError(false);
  }, [src]);

  const sizeClasses = {
    xs:    'w-7 h-7',
    sm:    'w-8 h-8',
    md:    'w-10 h-10',
    lg:    'w-12 h-12',
    xl:    'w-16 h-16',
    '2xl': 'w-24 h-24',
  };

  // Gold ring padding — thin at small sizes
  const ringPad = {
    xs:    'p-[1.5px]',
    sm:    'p-[1.5px]',
    md:    'p-[2px]',
    lg:    'p-[2.5px]',
    xl:    'p-[3px]',
    '2xl': 'p-[3px]',
  };

  // Inner white separator border — skip at xs/sm to preserve image area
  const innerBorder = {
    xs:    '',
    sm:    '',
    md:    'border border-white/60',
    lg:    'border border-white/60',
    xl:    'border-2 border-white',
    '2xl': 'border-2 border-white',
  };

  // Initial letter size inside the luxury circle
  const initialSize = {
    xs:    'text-[10px]',
    sm:    'text-[13px]',
    md:    'text-[15px]',
    lg:    'text-[18px]',
    xl:    'text-[24px]',
    '2xl': 'text-[36px]',
  };

  // Online dot dimensions
  const dotSize = {
    xs:    'w-1.5 h-1.5',
    sm:    'w-2 h-2',
    md:    'w-2.5 h-2.5',
    lg:    'w-3 h-3',
    xl:    'w-3.5 h-3.5',
    '2xl': 'w-4 h-4',
  };

  // Online dot position
  const dotPos = {
    xs:    'bottom-0 right-0',
    sm:    'bottom-0 right-0',
    md:    '-bottom-0.5 -right-0.5',
    lg:    '-bottom-0.5 -right-0.5',
    xl:    '-bottom-1 -right-1',
    '2xl': '-bottom-1 -right-1',
  };

  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  /* ─── LUXURY VARIANT ─────────────────────────────────────── */
  if (variant === 'luxury') {
    return (
      <div className={cn('relative shrink-0', sizeClasses[size], className)}>
        {/* Gold gradient ring */}
        <div className={cn(
          'w-full h-full rounded-full bg-gradient-to-tr from-[#C9A75D] to-[#E8D090]',
          ringPad[size],
        )}>
          <div className={cn(
            'w-full h-full rounded-full overflow-hidden bg-[#0F0F0F] flex items-center justify-center',
            innerBorder[size],
          )}>
            {src && !hasError ? (
              <img
                src={src}
                alt={alt || name}
                className="w-full h-full object-cover"
                onError={() => setHasError(true)}
              />
            ) : (
              <span className={cn('font-bold text-[#C9A75D] leading-none select-none', initialSize[size])}>
                {initials}
              </span>
            )}
          </div>
        </div>
        {/* Online indicator */}
        {showOnline && (
          <span className={cn(
            'absolute rounded-full bg-[#16A34A] border-[1.5px] border-white',
            dotSize[size],
            dotPos[size],
          )} />
        )}
      </div>
    );
  }

  /* ─── DEFAULT VARIANT ─────────────────────────────────────── */
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
          size === 'sm' ? 'w-8 h-8' : 'w-10 h-10',
        )}>
          +{remaining}
        </div>
      )}
    </div>
  );
}
