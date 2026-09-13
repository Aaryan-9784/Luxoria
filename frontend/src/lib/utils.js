import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes safely.
 * Usage: cn('text-lg', isActive && 'text-accent', className)
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
