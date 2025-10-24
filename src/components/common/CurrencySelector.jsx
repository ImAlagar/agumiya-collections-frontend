// src/components/common/CurrencySelector.jsx
import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurrency } from '../../contexts/CurrencyContext';
import { FiGlobe, FiChevronDown, FiSearch, FiX } from 'react-icons/fi';
import currenciesData from '../../data/currencies.json';

const CurrencySelector = ({ mobile = false }) => {
  const { userCurrency, setUserCurrency, exchangeRates, isLoading, getCurrencySymbol } = useCurrency();
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');

  const currencies = currenciesData.currencies;

  // Optimized filtering with useMemo
  const filteredCurrencies = useMemo(() => {
    if (!searchTerm) return currencies;
    
    const term = searchTerm.toLowerCase();
    return currencies.filter(currency =>
      currency.code.toLowerCase().includes(term) ||
      currency.name.toLowerCase().includes(term)
    );
  }, [currencies, searchTerm]);

  const currentCurrency = currencies.find(c => c.code === userCurrency) || 
    { code: userCurrency, name: userCurrency, symbol: getCurrencySymbol(userCurrency), flag: '🌍' };

  const handleCurrencySelect = (currencyCode) => {
    setUserCurrency(currencyCode);
    setIsOpen(false);
    setSearchTerm('');
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  // Mobile-specific styles
  const containerClass = mobile 
    ? "relative z-10 w-full"
    : "relative z-10 w-full sm:w-auto";

  const buttonClass = mobile
    ? "flex items-center justify-center w-full space-x-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[60px]"
    : "flex items-center justify-between w-full sm:w-auto space-x-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl px-3 sm:px-4 py-2 text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  const dropdownClass = mobile
    ? "fixed inset-x-4 top-60 bottom-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col"
    : "absolute top-full right-0 sm:right-0 mt-2 w-[90vw] sm:w-80 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-xl z-50 overflow-hidden";

  const listClass = mobile
    ? "flex-1 overflow-y-auto"
    : "max-h-[60vh] overflow-y-auto";

  return (
    <div className={containerClass}>
      {/* Trigger Button - Simplified for mobile */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClass}
        disabled={isLoading}
        aria-label="Select currency"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"
            aria-label="Loading currencies"
          />
        ) : (
          <>
            {mobile ? (
              // Mobile: Show only currency code
              <div className="flex items-center justify-center space-x-1">
                <FiGlobe size={14} className="text-blue-600 flex-shrink-0" />
                <span className="font-semibold text-xs sm:text-sm truncate">{userCurrency}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiChevronDown size={12} className="flex-shrink-0" />
                </motion.span>
              </div>
            ) : (
              // Desktop: Show full details
              <>
                <div className="flex items-center space-x-2">
                  <FiGlobe size={16} className="text-blue-600 flex-shrink-0" />
                  <span className="truncate text-sm sm:text-base">{currentCurrency.symbol}</span>
                  <span className="font-semibold truncate text-sm sm:text-base">{userCurrency}</span>
                </div>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiChevronDown size={16} className="flex-shrink-0" />
                </motion.span>
              </>
            )}
          </>
        )}
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile Backdrop */}
            {mobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={() => setIsOpen(false)}
              />
            )}
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className={dropdownClass}
              role="dialog"
              aria-label="Currency selection"
            >
              {/* Header */}
              <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                    Select Currency
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    aria-label="Close currency selector"
                  >
                    <FiX size={16} />
                  </button>
                </div>
                
                {/* Search Input */}
                <div className="relative">
                  <FiSearch 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                    size={16} 
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    placeholder="Search by code or name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="Search currencies"
                  />
                  {searchTerm && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      aria-label="Clear search"
                    >
                      <FiX size={16} />
                    </button>
                  )}
                </div>
                
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {filteredCurrencies.length} of {currencies.length} currencies
                </p>
              </div>
              
              {/* Currency List */}
              <div 
                className={listClass}
                role="listbox"
                aria-label="Available currencies"
              >
                {filteredCurrencies.length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    <FiSearch size={24} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No currencies found</p>
                    <p className="text-xs mt-1">Try a different search term</p>
                  </div>
                ) : (
                  filteredCurrencies.map((currency) => (
                    <button
                      key={currency.code}
                      onClick={() => handleCurrencySelect(currency.code)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700 ${
                        userCurrency === currency.code
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                      role="option"
                      aria-selected={userCurrency === currency.code}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          <span className="text-lg flex-shrink-0" aria-hidden="true">
                            {currency.flag}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-sm truncate">
                              {currency.code}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                              {currency.name}
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-2 flex-shrink-0">
                          <div className="font-medium text-sm">
                            {currency.symbol}
                          </div>
                          {exchangeRates?.[currency.code] && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {exchangeRates[currency.code].toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CurrencySelector;