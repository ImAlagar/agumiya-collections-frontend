// src/contexts/CurrencyContext.jsx
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

const CurrencyContext = createContext();

// Action types
const CURRENCY_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_EXCHANGE_RATES: 'SET_EXCHANGE_RATES',
  SET_USER_CURRENCY: 'SET_USER_CURRENCY',
  SET_ERROR: 'SET_ERROR',
  SET_LOCATION: 'SET_LOCATION'
};

// Initial state
const initialState = {
  isLoading: false,
  exchangeRates: {},
  userCurrency: 'USD',
  userCountry: 'US',
  error: null,
  lastUpdated: null
};

// Country to Currency mapping
const COUNTRY_CURRENCY_MAP = {
  'US': 'USD', 'IN': 'INR', 'GB': 'GBP', 'EU': 'EUR', 'CA': 'CAD',
  'AU': 'AUD', 'JP': 'JPY', 'CN': 'CNY', 'BR': 'BRL', 'MX': 'MXN',
  'DE': 'EUR', 'FR': 'EUR', 'IT': 'EUR', 'ES': 'EUR', 'NL': 'EUR',
  'RU': 'RUB', 'KR': 'KRW', 'SG': 'SGD', 'AE': 'AED', 'SA': 'SAR',
  'ZA': 'ZAR', 'NG': 'NGN', 'KE': 'KES', 'EG': 'EGP', 'TR': 'TRY',
  'ID': 'IDR', 'TH': 'THB', 'VN': 'VND', 'MY': 'MYR', 'PH': 'PHP'
};

// Fallback rates (updated periodically)
const FALLBACK_RATES = {
  USD: 1, EUR: 0.92, GBP: 0.79, INR: 83.25, CAD: 1.36,
  AUD: 1.52, JPY: 149.50, CNY: 7.24, BRL: 4.92, MXN: 17.25,
  CHF: 0.88, SEK: 10.68, NOK: 10.75, DKK: 6.92, PLN: 4.02,
  RUB: 92.50, TRY: 28.75, ZAR: 18.90, SGD: 1.34, HKD: 7.82,
  KRW: 1315.50, THB: 35.80, IDR: 15650, MYR: 4.68, PHP: 56.25,
  AED: 3.67, SAR: 3.75, INR: 83.25
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
    case CURRENCY_ACTIONS.SET_USER_LOCATION:
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
    console.warn('Failed to read cached rates:', error);
  }
  return null;
};

const setCachedRates = (rates) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      rates,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.warn('Failed to cache rates:', error);
  }
};

export function CurrencyProvider({ children }) {
  const [state, dispatch] = useReducer(currencyReducer, initialState);

  // Detect user location
  const detectUserLocation = useCallback(async () => {
    try {
      const ipResponse = await fetch('https://ipapi.co/json/');
      const ipData = await ipResponse.json();
      
      const countryCode = ipData.country_code;
      const currency = COUNTRY_CURRENCY_MAP[countryCode] || 'USD';
      
      dispatch({
        type: CURRENCY_ACTIONS.SET_USER_LOCATION,
        payload: { country: countryCode, currency }
      });
      
      return { country: countryCode, currency };
    } catch (error) {
      console.warn('IP detection failed, using fallback:', error);
      
      // Fallback: Browser language detection
      const browserLanguage = navigator.language || 'en-US';
      const countryFromLanguage = browserLanguage.split('-')[1] || 'US';
      const currency = COUNTRY_CURRENCY_MAP[countryFromLanguage] || 'USD';
      
      dispatch({
        type: CURRENCY_ACTIONS.SET_USER_LOCATION,
        payload: { country: countryFromLanguage, currency }
      });
      
      return { country: countryFromLanguage, currency };
    }
  }, []);

  // Fetch exchange rates
  const fetchExchangeRates = useCallback(async (baseCurrency = 'USD') => {
    dispatch({ type: CURRENCY_ACTIONS.SET_LOADING, payload: true });
    
    // Check cache first
    const cachedRates = getCachedRates();
    if (cachedRates) {
      dispatch({
        type: CURRENCY_ACTIONS.SET_EXCHANGE_RATES,
        payload: { rates: cachedRates, timestamp: Date.now() }
      });
      return cachedRates;
    }

    try {
      // Try Frankfurter API first (free, no API key)
      const response = await fetch(
        `https://api.frankfurter.app/latest?from=${baseCurrency}`
      );
      
      if (!response.ok) throw new Error('Frankfurter API failed');
      
      const data = await response.json();
      const rates = { ...data.rates, [baseCurrency]: 1 };
      
      // Cache the rates
      setCachedRates(rates);
      
      dispatch({
        type: CURRENCY_ACTIONS.SET_EXCHANGE_RATES,
        payload: { rates, timestamp: Date.now() }
      });
      
      return rates;
    } catch (error) {
      console.error('Exchange rate fetch failed, using fallback:', error);
      
      // Use fallback rates
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

  // Convert price function
  const convertPrice = useCallback((price, fromCurrency = 'USD', toCurrency = state.userCurrency) => {
    if (!price || price === 0) return 0;
    
    const rates = state.exchangeRates;
    
    // If same currency, return original price
    if (fromCurrency === toCurrency) return price;
    
    // If rates not available, use fallback or return original
    if (!rates[toCurrency] || !rates[fromCurrency]) {
      console.warn(`Exchange rate not available for ${toCurrency}`);
      const fallbackRate = FALLBACK_RATES[toCurrency];
      return fallbackRate ? price * fallbackRate : price;
    }
    
    // Convert through USD as base
    const priceInUSD = fromCurrency === 'USD' ? price : price / rates[fromCurrency];
    const convertedPrice = priceInUSD * rates[toCurrency];
    
    return Number(convertedPrice.toFixed(2));
  }, [state.exchangeRates, state.userCurrency]);

  // Format price with currency symbol
  const formatPrice = useCallback((price, currency = state.userCurrency, showOriginal = false) => {
    const convertedPrice = convertPrice(price, 'USD', currency);
    
    try {
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(convertedPrice);

      // Show original USD price if different currency and requested
      if (showOriginal && currency !== 'USD') {
        const originalPrice = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
        }).format(price);
        
        return { formatted, original: originalPrice };
      }
      
      return { formatted, original: null };
    } catch (error) {
      // Fallback formatting
      const formatted = `${convertedPrice.toFixed(2)} ${currency}`;
      const original = currency !== 'USD' ? `$${price.toFixed(2)}` : null;
      return { formatted, original };
    }
  }, [state.userCurrency, convertPrice]);

  // Get currency symbol
  const getCurrencySymbol = useCallback((currency = state.userCurrency) => {
    const symbols = {
      USD: '$', EUR: '€', GBP: '£', INR: '₹', JPY: '¥',
      CAD: 'CA$', AUD: 'A$', CNY: 'CN¥', BRL: 'R$', MXN: 'MX$',
      KRW: '₩', RUB: '₽', TRY: '₺', ZAR: 'R', SEK: 'kr',
      NOK: 'kr', DKK: 'kr', PLN: 'zł', THB: '฿', PHP: '₱'
    };
    return symbols[currency] || currency;
  }, [state.userCurrency]);

  // Initialize currency system
  useEffect(() => {
    const initializeCurrency = async () => {
      await detectUserLocation();
      await fetchExchangeRates('USD');
    };
    
    initializeCurrency();
    
    // Refresh rates every hour
    const interval = setInterval(() => {
      fetchExchangeRates('USD');
    }, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [detectUserLocation, fetchExchangeRates]);

  const value = {
    // State
    ...state,
    
    // Actions
    convertPrice,
    formatPrice,
    getCurrencySymbol,
    setUserCurrency: (currency) => 
      dispatch({ type: CURRENCY_ACTIONS.SET_USER_CURRENCY, payload: currency }),
    refreshRates: () => fetchExchangeRates('USD'),
    detectUserLocation,
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
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};