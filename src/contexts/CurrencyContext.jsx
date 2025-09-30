// src/contexts/CurrencyContext.js (Updated)
import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider = ({ children }) => {
  const [userCurrency, setUserCurrency] = useState('USD');
  const [currencies, setCurrencies] = useState([]);
  const [exchangeRates, setExchangeRates] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [geoLocation, setGeoLocation] = useState(null);
  const [showCurrencyPrompt, setShowCurrencyPrompt] = useState(false);

  const API_BASE = import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:5000/api/v1';

  useEffect(() => {
    initializeCurrency();
  }, []);

  const detectUserLocation = async () => {
    try {
      // Method 1: Check if user already has a preference
      const savedCurrency = localStorage.getItem('preferredCurrency');
      const currencyPromptShown = localStorage.getItem('currencyPromptShown');
      
      if (savedCurrency) {
        setUserCurrency(savedCurrency);
        return;
      }

      // Method 2: Use browser's language setting
      const browserLanguage = navigator.language || navigator.userLanguage;
      const region = browserLanguage.split('-')[1] || 'US';
      
      const regionToCurrency = {
        'US': 'USD', 'GB': 'GBP', 'EU': 'EUR', 'CA': 'CAD', 
        'AU': 'AUD', 'JP': 'JPY', 'IN': 'INR', 'CN': 'CNY',
        'BR': 'BRL', 'MX': 'MXN', 'KR': 'KRW'
      };

      const detectedCurrency = regionToCurrency[region] || 'USD';
      
      // Only show prompt if not shown before and currency differs from default
      if (!currencyPromptShown && detectedCurrency !== 'USD') {
        setGeoLocation({ currency: detectedCurrency, country: region });
        setShowCurrencyPrompt(true);
      } else {
        setUserCurrency(detectedCurrency);
      }

    } catch (error) {
      console.log('Location detection failed, using USD as default');
      setUserCurrency('USD');
    }
  };

  const initializeCurrency = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get available currencies
      const currenciesResponse = await fetch(`${API_BASE}/currency/currencies`);
      if (!currenciesResponse.ok) throw new Error('Failed to fetch currencies');
      const currenciesData = await currenciesResponse.json();
      
      if (currenciesData.success) {
        setCurrencies(currenciesData.data);
      }

      // Get exchange rates
      const ratesResponse = await fetch(`${API_BASE}/currency/exchange-rates`);
      if (ratesResponse.ok) {
        const ratesData = await ratesResponse.json();
        if (ratesData.success) {
          setExchangeRates(ratesData.data.rates);
        }
      }

      // Detect user location (non-intrusive)
      await detectUserLocation();

    } catch (err) {
      console.error('Currency initialization failed:', err);
      setError(err.message);
      // Set fallback data
      setCurrencies([{ code: 'USD', name: 'US Dollar', symbol: '$' }]);
      setExchangeRates({ USD: 1 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCurrencyAccept = (currency) => {
    setUserCurrency(currency);
    localStorage.setItem('preferredCurrency', currency);
    localStorage.setItem('currencyPromptShown', 'true');
    setShowCurrencyPrompt(false);
  };

  const handleCurrencyDecline = () => {
    localStorage.setItem('currencyPromptShown', 'true');
    setShowCurrencyPrompt(false);
  };

  const convertPrice = (priceUSD) => {
    if (!priceUSD || isNaN(priceUSD)) return 0;
    if (userCurrency === 'USD') return parseFloat(priceUSD);
    
    const rate = exchangeRates[userCurrency];
    return rate ? parseFloat(priceUSD) * rate : parseFloat(priceUSD);
  };

  const formatPrice = (priceUSD, customCurrency = null) => {
    const currencyCode = customCurrency || userCurrency;
    const convertedPrice = convertPrice(priceUSD);
    const currency = currencies.find(c => c.code === currencyCode);

    if (!currency) {
      return `$${convertedPrice.toFixed(2)}`;
    }

    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(convertedPrice);
    } catch (error) {
      return `${currency.symbol}${convertedPrice.toFixed(2)}`;
    }
  };

  const changeCurrency = (newCurrency) => {
    setUserCurrency(newCurrency);
    localStorage.setItem('preferredCurrency', newCurrency);
  };

  const value = {
    userCurrency,
    currencies,
    exchangeRates,
    isLoading,
    error,
    convertPrice,
    formatPrice,
    changeCurrency,
    showCurrencyPrompt,
    geoLocation,
    handleCurrencyAccept,
    handleCurrencyDecline
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};