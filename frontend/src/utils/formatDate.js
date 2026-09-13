/**
 * Luxoria — Booking Date Formatter Utilities
 *
 * Booking dates represent calendar dates (e.g. 22 Sept - 23 Sept).
 * Using timeZone: 'UTC' ensures that positive or negative client timezones
 * (e.g. IST +05:30 or EST -05:00) will never shift a date to the next or previous day.
 */

/**
 * Format a single booking date consistently.
 * @param {string|Date} dateInput
 * @param {Intl.DateTimeFormatOptions} [options]
 * @returns {string}
 */
export function formatBookingDate(dateInput, options = {}) {
  if (!dateInput) return options.fallback ?? '—';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return options.fallback ?? '—';

  const defaultOpts = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
    ...options,
  };
  delete defaultOpts.fallback;

  return d.toLocaleDateString('en-GB', defaultOpts);
}

/**
 * Format a booking date range (e.g. "22 Sept - 23 Sept 2026").
 * @param {string|Date} startDate
 * @param {string|Date} endDate
 * @param {Object} [options]
 * @returns {string}
 */
export function formatBookingRange(startDate, endDate, options = {}) {
  if (!startDate && !endDate) return '—';
  if (!startDate) return formatBookingDate(endDate, options);
  if (!endDate) return formatBookingDate(startDate, options);

  const startFormatted = formatBookingDate(startDate, {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
    ...options,
    year: undefined,
  });

  const endFormatted = formatBookingDate(endDate, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
    ...options,
  });

  return `${startFormatted} - ${endFormatted}`;
}

/**
 * Check if a booking date matches a search query string.
 * @param {string|Date} bookingDate
 * @param {string} query
 * @returns {boolean}
 */
export function bookingDateMatchesQuery(bookingDate, query) {
  if (!query || !query.trim()) return true;
  if (!bookingDate) return false;

  const d = new Date(bookingDate);
  if (isNaN(d.getTime())) return false;

  const formatted = d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).toLowerCase();

  const iso = d.toISOString().slice(0, 10);
  const q = query.trim().toLowerCase();

  return formatted.includes(q) || iso.includes(q);
}
