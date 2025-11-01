// src/utils/currencyFallback.js
export const FALLBACK_RATES = {
  USD: 1,
  EUR: 0.85,
  GBP: 0.73,
  INR: 87.8,
  CAD: 1.35,
  AUD: 1.52,
  JPY: 149.50,
  CNY: 7.24,
  BRL: 4.92,
  MXN: 17.25,
  KRW: 1315.50,
  SGD: 1.34,
  CHF: 0.88,
  SEK: 10.45,
  NOK: 10.75,
  DKK: 6.85,
};

export const getFallbackRate = (currency) => {
  return FALLBACK_RATES[currency] || 1;
};