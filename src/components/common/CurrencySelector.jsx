// src/components/common/CurrencySelector.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurrency } from '../../contexts/CurrencyContext';

const CurrencySelector = () => {
  const { userCurrency, currencies, changeCurrency, isLoading } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  const currentCurrency = currencies.find(c => c.code === userCurrency);

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-2">
        <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" />
        <div className="w-12 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="flex items-center space-x-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2 hover:shadow-lg transition-all duration-300 disabled:opacity-50"
      >
        {currentCurrency && (
          <>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              {currentCurrency.symbol}
            </span>
            <span className="text-gray-600 dark:text-gray-400 text-sm">
              {currentCurrency.code}
            </span>
          </>
        )}
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-gray-400 text-xs"
        >
          ▼
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-xl z-50 overflow-hidden"
          >
            <div className="max-h-64 overflow-y-auto">
              {currencies.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => {
                    changeCurrency(currency.code);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                    userCurrency === currency.code 
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-lg">
                        {currency.symbol}
                      </span>
                      <div className="text-left">
                        <div className="font-semibold">{currency.code}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {currency.name}
                        </div>
                      </div>
                    </div>
                    {userCurrency === currency.code && (
                      <span className="text-primary-600 dark:text-primary-400">✓</span>
                    )}
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