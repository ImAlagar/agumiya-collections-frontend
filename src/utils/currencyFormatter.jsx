// src/utils/currencyFormatter.js

export const formatOrderAmount = (amount, currency = 'USD') => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numericAmount)) {
    return '$0.00';
  }

  // Comprehensive currency configuration
  const currencyConfig = {
    // Asian Currencies
    INR: { symbol: '₹', decimalPlaces: 2 },
    JPY: { symbol: '¥', decimalPlaces: 0 },
    CNY: { symbol: '¥', decimalPlaces: 2 },
    KRW: { symbol: '₩', decimalPlaces: 0 },
    SGD: { symbol: 'S$', decimalPlaces: 2 },
    MYR: { symbol: 'RM', decimalPlaces: 2 },
    THB: { symbol: '฿', decimalPlaces: 2 },
    IDR: { symbol: 'Rp', decimalPlaces: 0 },
    PHP: { symbol: '₱', decimalPlaces: 2 },
    VND: { symbol: '₫', decimalPlaces: 0 },
    
    // Middle East Currencies
    AED: { symbol: 'د.إ', decimalPlaces: 2 },
    SAR: { symbol: '﷼', decimalPlaces: 2 },
    QAR: { symbol: '﷼', decimalPlaces: 2 },
    
    // European Currencies
    EUR: { symbol: '€', decimalPlaces: 2 },
    GBP: { symbol: '£', decimalPlaces: 2 },
    CHF: { symbol: 'CHF', decimalPlaces: 2 },
    SEK: { symbol: 'kr', decimalPlaces: 2 },
    NOK: { symbol: 'kr', decimalPlaces: 2 },
    DKK: { symbol: 'kr', decimalPlaces: 2 },
    PLN: { symbol: 'zł', decimalPlaces: 2 },
    CZK: { symbol: 'Kč', decimalPlaces: 2 },
    HUF: { symbol: 'Ft', decimalPlaces: 0 },
    RON: { symbol: 'lei', decimalPlaces: 2 },
    
    // American Currencies
    USD: { symbol: '$', decimalPlaces: 2 },
    CAD: { symbol: 'CA$', decimalPlaces: 2 },
    MXN: { symbol: 'MX$', decimalPlaces: 2 },
    BRL: { symbol: 'R$', decimalPlaces: 2 },
    ARS: { symbol: '$', decimalPlaces: 2 },
    CLP: { symbol: '$', decimalPlaces: 0 },
    
    // Oceanian Currencies
    AUD: { symbol: 'A$', decimalPlaces: 2 },
    NZD: { symbol: 'NZ$', decimalPlaces: 2 },
    
    // African Currencies
    ZAR: { symbol: 'R', decimalPlaces: 2 },
    EGP: { symbol: '£', decimalPlaces: 2 },
    NGN: { symbol: '₦', decimalPlaces: 2 },
    KES: { symbol: 'KSh', decimalPlaces: 2 },
    
    // Other Major Currencies
    RUB: { symbol: '₽', decimalPlaces: 2 },
    TRY: { symbol: '₺', decimalPlaces: 2 },
    HKD: { symbol: 'HK$', decimalPlaces: 2 },
    TWD: { symbol: 'NT$', decimalPlaces: 0 },
    ILS: { symbol: '₪', decimalPlaces: 2 },
  };

  const config = currencyConfig[currency] || { symbol: '$', decimalPlaces: 2 };
  
  // Format the number with proper decimal places and thousand separators
  const formattedAmount = numericAmount.toLocaleString('en-US', {
    minimumFractionDigits: config.decimalPlaces,
    maximumFractionDigits: config.decimalPlaces
  });
  
  return `${config.symbol}${formattedAmount}`;
};

// Additional utility function for currency information
export const getCurrencyInfo = (currency) => {
  const currencyNames = {
    INR: 'Indian Rupee',
    USD: 'US Dollar',
    EUR: 'Euro',
    GBP: 'British Pound',
    JPY: 'Japanese Yen',
    CAD: 'Canadian Dollar',
    AUD: 'Australian Dollar',
    CNY: 'Chinese Yuan',
    KRW: 'South Korean Won',
    SGD: 'Singapore Dollar',
    MYR: 'Malaysian Ringgit',
    THB: 'Thai Baht',
    IDR: 'Indonesian Rupiah',
    PHP: 'Philippine Peso',
    VND: 'Vietnamese Dong',
    AED: 'UAE Dirham',
    SAR: 'Saudi Riyal',
    QAR: 'Qatari Riyal',
    CHF: 'Swiss Franc',
    SEK: 'Swedish Krona',
    NOK: 'Norwegian Krone',
    DKK: 'Danish Krone',
    PLN: 'Polish Złoty',
    CZK: 'Czech Koruna',
    HUF: 'Hungarian Forint',
    RON: 'Romanian Leu',
    MXN: 'Mexican Peso',
    BRL: 'Brazilian Real',
    ARS: 'Argentine Peso',
    CLP: 'Chilean Peso',
    NZD: 'New Zealand Dollar',
    ZAR: 'South African Rand',
    EGP: 'Egyptian Pound',
    NGN: 'Nigerian Naira',
    KES: 'Kenyan Shilling',
    RUB: 'Russian Ruble',
    TRY: 'Turkish Lira',
    HKD: 'Hong Kong Dollar',
    TWD: 'New Taiwan Dollar',
    ILS: 'Israeli Shekel',
  };

  return currencyNames[currency] || currency;
};

// Function to get all supported currencies
export const getSupportedCurrencies = () => {
  return Object.keys(currencyConfig);
};