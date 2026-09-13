import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * Premium stat/KPI card for dashboards.
 * Supports trend indicators and icon displays.
 */
export default function StatCard({
  label,
  value,
  prefix,
  suffix,
  change,
  changeLabel,
  icon: Icon,
  iconColor = 'text-accent',
  iconBg = 'bg-gradient-gold-subtle',
  className,
}) {
  const isPositive = change > 0;
  const isNegative = change < 0;

  return (
    <div className={cn('card-stat group', className)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-overline text-muted">{label}</p>
        </div>
        {Icon && (
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', iconBg)}>
            <Icon className={cn('w-5 h-5', iconColor)} />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1 mb-2">
        {prefix && <span className="text-body-sm text-secondary font-medium">{prefix}</span>}
        <span className="text-h2 font-bold text-primary tracking-tight">{value}</span>
        {suffix && <span className="text-body-sm text-secondary font-medium">{suffix}</span>}
      </div>

      {change !== undefined && (
        <div className="flex items-center gap-1.5">
          <span className={cn(
            'flex items-center gap-0.5 text-caption font-semibold',
            isPositive && 'text-success',
            isNegative && 'text-error',
            !isPositive && !isNegative && 'text-muted'
          )}>
            {isPositive && <TrendingUp className="w-3.5 h-3.5" />}
            {isNegative && <TrendingDown className="w-3.5 h-3.5" />}
            {!isPositive && !isNegative && <Minus className="w-3.5 h-3.5" />}
            {isPositive && '+'}{change}%
          </span>
          {changeLabel && <span className="text-caption text-muted">{changeLabel}</span>}
        </div>
      )}
    </div>
  );
}
