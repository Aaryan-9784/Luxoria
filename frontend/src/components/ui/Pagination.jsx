import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Luxury pagination with ellipsis.
 */
export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className,
}) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    const delta = 1;

    pages.push(1);

    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    if (rangeStart > 2) pages.push('...');
    for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
    if (rangeEnd < totalPages - 1) pages.push('...');

    if (totalPages > 1) pages.push(totalPages);
    return pages;
  };

  return (
    <div className={cn('flex items-center justify-center gap-1', className)}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn-icon btn-icon-sm disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {getPages().map((page, i) => (
        <React.Fragment key={i}>
          {page === '...' ? (
            <span className="w-9 h-9 flex items-center justify-center text-caption text-muted">
              ···
            </span>
          ) : (
            <button
              onClick={() => onPageChange(page)}
              className={cn(
                'w-9 h-9 rounded-lg text-body-sm font-medium transition-all duration-200',
                page === currentPage
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-secondary hover:bg-surface hover:text-primary'
              )}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn-icon btn-icon-sm disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
