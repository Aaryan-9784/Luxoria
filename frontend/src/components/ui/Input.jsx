import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Input = forwardRef(({
  label,
  error,
  helper,
  icon: Icon,
  iconRight: IconRight,
  size = 'md',
  className,
  containerClassName,
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={cn('w-full', containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="label">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Icon className="w-[18px] h-[18px] text-muted" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'input',
            size === 'lg' && 'input-lg',
            Icon && 'pl-10',
            IconRight && 'pr-10',
            error && 'input-error',
            className
          )}
          {...props}
        />
        {IconRight && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
            <IconRight className="w-[18px] h-[18px] text-muted" />
          </div>
        )}
      </div>
      {(error || helper) && (
        <p className={cn('helper-text', error ? 'helper-error' : '')}>
          {error || helper}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;

/**
 * Textarea variant
 */
export const Textarea = forwardRef(({
  label,
  error,
  helper,
  className,
  rows = 4,
  id,
  ...props
}, ref) => {
  const inputId = id || `textarea-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="w-full">
      {label && <label htmlFor={inputId} className="label">{label}</label>}
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        className={cn('input resize-none', error && 'input-error', className)}
        {...props}
      />
      {(error || helper) && (
        <p className={cn('helper-text', error ? 'helper-error' : '')}>
          {error || helper}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

/**
 * Select dropdown
 */
export const Select = forwardRef(({
  label,
  error,
  options = [],
  placeholder = 'Select...',
  className,
  id,
  ...props
}, ref) => {
  const inputId = id || `select-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="w-full">
      {label && <label htmlFor={inputId} className="label">{label}</label>}
      <select
        ref={ref}
        id={inputId}
        className={cn('input appearance-none cursor-pointer', error && 'input-error', className)}
        {...props}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => (
          <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
            {typeof opt === 'string' ? opt : opt.label}
          </option>
        ))}
      </select>
      {error && <p className="helper-text helper-error">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';
