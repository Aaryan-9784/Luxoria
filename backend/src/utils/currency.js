const DEFAULT_USD_TO_INR_RATE = Number(process.env.USD_TO_INR_RATE || 95.22);

export const getUsdToInrRate = () => Number(process.env.USD_TO_INR_RATE || DEFAULT_USD_TO_INR_RATE);

export const convertUsdToInr = (amount, rate = getUsdToInrRate()) => {
  const numericAmount = Number(amount || 0);
  return Math.round(numericAmount * Number(rate));
};
