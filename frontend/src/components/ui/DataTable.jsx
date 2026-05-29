import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal } from 'lucide-react';

/**
 * Premium enterprise data table.
 */
export default function DataTable({
  columns = [],
  data = [],
  sortConfig,
  onSort,
  isLoading = false,
  className,
}) {
  const handleSort = (column) => {
    if (!column.sortable || !onSort) return;
    const direction =
      sortConfig?.key === column.key && sortConfig?.direction === 'asc'
        ? 'desc'
        : 'asc';
    onSort({ key: column.key, direction });
  };

  const getSortIcon = (column) => {
    if (!column.sortable) return null;
    if (sortConfig?.key !== column.key) return <ArrowUpDown className="w-3.5 h-3.5 text-muted" />;
    return sortConfig.direction === 'asc'
      ? <ArrowUp className="w-3.5 h-3.5 text-primary" />
      : <ArrowDown className="w-3.5 h-3.5 text-primary" />;
  };

  return (
    <div className={cn('matte-elevated overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="table-premium">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col)}
                  className={cn(col.sortable && 'cursor-pointer select-none hover:text-primary')}
                  style={{ width: col.width }}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    {getSortIcon(col)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={row.id || rowIndex}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row, rowIndex) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && !isLoading && (
        <div className="py-16 text-center text-secondary text-body-sm">
          No data available
        </div>
      )}
    </div>
  );
}

/**
 * Actions cell — three-dot menu trigger.
 */
export function TableActions({ children }) {
  return (
    <div className="flex items-center justify-end gap-2">
      {children}
    </div>
  );
}
