const DEFAULT_USD_TO_INR_RATE = 95.22;

export const USD_TO_INR_RATE = Number(import.meta.env.VITE_USD_TO_INR_RATE || DEFAULT_USD_TO_INR_RATE);

export const convertUsdToInr = (value, rate = USD_TO_INR_RATE) => {
  const numericValue = Number(value || 0);
  return Math.round(numericValue * Number(rate));
};

export const formatInr = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export const formatDisplayAmount = (value, { fromUsd = true } = {}) => {
  const numericValue = Number(value || 0);
  const amount = fromUsd ? convertUsdToInr(numericValue) : numericValue;
  return formatInr(amount);
};
