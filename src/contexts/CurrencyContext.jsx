import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import logger from '../utils/logger'; // ✅ Professional logger

const CurrencyContext = createContext();

const CURRENCY_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_EXCHANGE_RATES: 'SET_EXCHANGE_RATES',
  SET_USER_CURRENCY: 'SET_USER_CURRENCY',
  SET_ERROR: 'SET_ERROR',
  SET_LOCATION: 'SET_LOCATION'
};

const initialState = {
  isLoading: false,
  exchangeRates: {},
  userCurrency: 'USD',
  userCountry: 'US',
  error: null,
  lastUpdated: null
};

const COUNTRY_CURRENCY_MAP = {
  US: 'USD', IN: 'INR', GB: 'GBP', EU: 'EUR', CA: 'CAD',
  AU: 'AUD', JP: 'JPY', CN: 'CNY', BR: 'BRL', MX: 'MXN',
  DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR',
  RU: 'RUB', KR: 'KRW', SG: 'SGD', AE: 'AED', SA: 'SAR',
  ZA: 'ZAR', NG: 'NGN', KE: 'KES', EG: 'EGP', TR: 'TRY',
  ID: 'IDR', TH: 'THB', VN: 'VND', MY: 'MYR', PH: 'PHP'
};

const FALLBACK_RATES = {
  USD: 1, EUR: 0.92, GBP: 0.79, INR: 83.25, CAD: 1.36,
  AUD: 1.52, JPY: 149.50, CNY: 7.24, BRL: 4.92, MXN: 17.25,
  RUB: 92.50, TRY: 28.75, ZAR: 18.90, SGD: 1.34
};

// Reducer
function currencyReducer(state, action) {
  switch (action.type) {
    case CURRENCY_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case CURRENCY_ACTIONS.SET_EXCHANGE_RATES:
      return {
        ...state,
        exchangeRates: action.payload.rates,
        lastUpdated: action.payload.timestamp,
        isLoading: false,
        error: null
      };
    case CURRENCY_ACTIONS.SET_USER_CURRENCY:
      return { ...state, userCurrency: action.payload };
    case CURRENCY_ACTIONS.SET_LOCATION:
      return {
        ...state,
        userCountry: action.payload.country,
        userCurrency: action.payload.currency
      };
    case CURRENCY_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
}

// Cache utilities
const CACHE_KEY = 'currency_rates';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

const getCachedRates = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    const { rates, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) return rates;
  } catch (error) {
    logger.warn('Failed to read cached rates', { error });
  }
  return null;
};

const setCachedRates = (rates) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      rates,
      timestamp: Date.now()
    }));
    logger.info('✅ Cached new currency rates');
  } catch (error) {
    logger.warn('Failed to cache rates', { error });
  }
};

export function CurrencyProvider({ children }) {
  const [state, dispatch] = useReducer(currencyReducer, initialState);

  // Detect user location
  const detectUserLocation = useCallback(async () => {
    try {
      logger.info('🌍 Detecting user location via IP');
      const ipResponse = await fetch('https://ipapi.co/json/');
      const ipData = await ipResponse.json();
      
      const countryCode = ipData.country_code || 'US';
      const currency = COUNTRY_CURRENCY_MAP[countryCode] || 'USD';
      
      dispatch({
        type: CURRENCY_ACTIONS.SET_LOCATION,
        payload: { country: countryCode, currency }
      });
      
      logger.info(`✅ Detected location: ${countryCode}, Currency: ${currency}`);
      return { country: countryCode, currency };
    } catch (error) {
      logger.warn('⚠️ IP detection failed, using fallback method', { error });
      
      const browserLanguage = navigator.language || 'en-US';
      const country = browserLanguage.split('-')[1] || 'US';
      const currency = COUNTRY_CURRENCY_MAP[country] || 'USD';
      
      dispatch({
        type: CURRENCY_ACTIONS.SET_LOCATION,
        payload: { country, currency }
      });
      
      logger.info(`🌐 Fallback detection: ${country}, Currency: ${currency}`);
      return { country, currency };
    }
  }, []);

  // Fetch exchange rates
  const fetchExchangeRates = useCallback(async (baseCurrency = 'USD') => {
    dispatch({ type: CURRENCY_ACTIONS.SET_LOADING, payload: true });

    // Check cache
    const cachedRates = getCachedRates();
    if (cachedRates) {
      logger.info('💾 Loaded exchange rates from cache');
      dispatch({
        type: CURRENCY_ACTIONS.SET_EXCHANGE_RATES,
        payload: { rates: cachedRates, timestamp: Date.now() }
      });
      return cachedRates;
    }

    try {
      logger.info(`💱 Fetching exchange rates (base: ${baseCurrency})`);
      const response = await fetch(`https://api.frankfurter.app/latest?from=${baseCurrency}`);
      
      if (!response.ok) throw new Error('Frankfurter API request failed');
      
      const data = await response.json();
      const rates = { ...data.rates, [baseCurrency]: 1 };
      
      setCachedRates(rates);
      dispatch({
        type: CURRENCY_ACTIONS.SET_EXCHANGE_RATES,
        payload: { rates, timestamp: Date.now() }
      });
      
      logger.info('✅ Exchange rates updated successfully');
      return rates;
    } catch (error) {
      logger.error('💥 Exchange rate fetch failed', { error });
      
      setCachedRates(FALLBACK_RATES);
      dispatch({
        type: CURRENCY_ACTIONS.SET_EXCHANGE_RATES,
        payload: { rates: FALLBACK_RATES, timestamp: Date.now() }
      });
      
      dispatch({
        type: CURRENCY_ACTIONS.SET_ERROR,
        payload: 'Using fallback exchange rates'
      });
      
      return FALLBACK_RATES;
    }
  }, []);

  // Convert price
  const convertPrice = useCallback((price, from = 'USD', to = state.userCurrency) => {
    if (!price) return 0;
    const rates = state.exchangeRates;

    if (from === to) return price;
    if (!rates[to] || !rates[from]) {
      logger.warn(`Missing exchange rate for ${to} or ${from}`);
      const fallback = FALLBACK_RATES[to];
      return fallback ? price * fallback : price;
    }

    const usdValue = from === 'USD' ? price : price / rates[from];
    const converted = usdValue * rates[to];
    return Number(converted.toFixed(2));
  }, [state.exchangeRates, state.userCurrency]);

  // ✅ Get currency symbol
  const getCurrencySymbol = useCallback((currency = state.userCurrency) => {
    const symbols = {
      USD: '$', EUR: '€', GBP: '£', INR: '₹', JPY: '¥',
      CAD: 'CA$', AUD: 'A$', CNY: 'CN¥', BRL: 'R$', MXN: 'MX$',
      KRW: '₩', RUB: '₽', TRY: '₺', ZAR: 'R', SEK: 'kr',
      NOK: 'kr', DKK: 'kr', PLN: 'zł', THB: '฿', PHP: '₱',
      SGD: 'S$', AED: 'AED', SAR: 'SAR'
    };
    return symbols[currency] || currency;
  }, [state.userCurrency]);

  // ✅ Format price professionally
  const formatPrice = useCallback((price, currency = state.userCurrency, showOriginal = false) => {
    const convertedPrice = convertPrice(price, 'USD', currency);

    try {
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(convertedPrice);

      if (showOriginal && currency !== 'USD') {
        const original = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
        }).format(price);
        return { formatted, original };
      }

      return { formatted, original: null };
    } catch (error) {
      logger.warn('Fallback format used', { error });
      const formatted = `${convertedPrice.toFixed(2)} ${currency}`;
      const original = currency !== 'USD' ? `$${price.toFixed(2)}` : null;
      return { formatted, original };
    }
  }, [convertPrice, state.userCurrency]);

  // Initialize
  useEffect(() => {
    const init = async () => {
      logger.info('🚀 Initializing currency system...');
      await detectUserLocation();
      await fetchExchangeRates('USD');
    };
    init();

    const interval = setInterval(() => {
      fetchExchangeRates('USD');
      logger.info('♻️ Auto-refreshing currency rates');
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [detectUserLocation, fetchExchangeRates]);

  // ✅ Final value object
  const value = {
    ...state,
    convertPrice,
    formatPrice,
    getCurrencySymbol,
    refreshRates: () => fetchExchangeRates('USD'),
    detectUserLocation,
    setUserCurrency: (currency) =>
      dispatch({ type: CURRENCY_ACTIONS.SET_USER_CURRENCY, payload: currency })
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    logger.error('❌ useCurrency called outside CurrencyProvider');
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};