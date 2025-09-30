// src/components/user/CurrencySelector.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurrency } from '../../contexts/CurrencyContext';
import { FiGlobe, FiChevronDown } from 'react-icons/fi';

const CurrencySelector = () => {
  const { userCurrency, setUserCurrency, exchangeRates, isLoading, getCurrencySymbol } = useCurrency();

  const popularCurrencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', flag: '🇨🇦' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: 'CN¥', flag: '🇨🇳' },
  ];

  const [isOpen, setIsOpen] = React.useState(false);

  const currentCurrency = popularCurrencies.find(c => c.code === userCurrency) || 
    { code: userCurrency, name: userCurrency, symbol: getCurrencySymbol(), flag: '🌍' };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-w-[120px] justify-between"
        disabled={isLoading}
      >
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"
          />
        ) : (
          <>
            <div className="flex items-center space-x-2">
              <FiGlobe size={16} className="text-blue-600" />
              <span>{currentCurrency.symbol}</span>
              <span className="font-semibold">{userCurrency}</span>
            </div>
            <motion.span
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <FiChevronDown size={16} />
            </motion.span>
          </>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-xl z-50 overflow-hidden"
          >
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Select Currency
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Prices will be converted automatically
              </p>
            </div>
            
            <div className="max-h-60 overflow-y-auto">
              {popularCurrencies.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => {
                    setUserCurrency(currency.code);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    userCurrency === currency.code
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{currency.flag}</span>
                      <div>
                        <div className="font-medium text-sm">{currency.code}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {currency.name}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-sm">{currency.symbol}</div>
                      {exchangeRates[currency.code] && (
                        <div className="text-xs text-gray-500">
                          1 USD = {exchangeRates[currency.code].toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CurrencySelector;