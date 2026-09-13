import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Luxury skeleton loader with shimmer effect.
 * Renders as a placeholder while content is loading.
 */
export default function Skeleton({ className, ...props }) {
  return <div className={cn('skeleton', className)} {...props} />;
}

export function SkeletonText({ lines = 3, className }) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'skeleton skeleton-text',
            i === lines - 1 && 'w-[60%]' // Last line is shorter
          )}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }) {
  return (
    <div className={cn('card p-0 overflow-hidden', className)}>
      <div className="skeleton skeleton-image" />
      <div className="p-6 space-y-3">
        <div className="skeleton skeleton-text w-[70%]" />
        <div className="skeleton skeleton-text-sm" />
        <div className="flex gap-3 pt-3">
          <div className="skeleton skeleton-button" />
          <div className="skeleton skeleton-button w-[80px]" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonAvatar({ size = 'md', className }) {
  const sizeClass = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-14 h-14' : 'w-10 h-10';
  return <div className={cn('skeleton rounded-full', sizeClass, className)} />;
}

export function SkeletonTable({ rows = 5, cols = 4, className }) {
  return (
    <div className={cn('w-full', className)}>
      {/* Header */}
      <div className="flex gap-4 p-4 border-b border-border">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="skeleton skeleton-text flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="flex gap-4 p-4 border-b border-border/50">
          {Array.from({ length: cols }).map((_, col) => (
            <div key={col} className={cn('skeleton skeleton-text flex-1', col === 0 && 'w-[40%]')} />
          ))}
        </div>
      ))}
    </div>
  );
}
