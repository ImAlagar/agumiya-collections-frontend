// src/components/admin/products/ProductFilters.jsx
import React, { useState, useRef, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRODUCT_CATEGORIES } from '../../../config/constants';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { 
  FilterIcon, 
  SearchIcon, 
  XCircleIcon, 
  ChevronDownIcon, 
  ArrowUpDownIcon, 
  XIcon,
  SmartphoneIcon,
  MonitorIcon,
  TagIcon,
  TrendingUpIcon,
} from 'lucide-react';

const ProductFilters = ({ filters, onFilterChange, isLoading, priceRange }) => {
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState('category');
  const [localPriceRange, setLocalPriceRange] = useState({
    min: filters.minPrice || '',
    max: filters.maxPrice || ''
  });
  
  const filtersRef = useRef(null);
  
  // Add currency context
  const { convertPrice, formatPrice, userCurrency, getCurrencySymbol } = useCurrency();

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close filters when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isFiltersExpanded && isMobile && filtersRef.current && !filtersRef.current.contains(event.target)) {
        setIsFiltersExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFiltersExpanded, isMobile]);

  // Update local price range when filters change
  useEffect(() => {
    setLocalPriceRange({
      min: filters.minPrice || '',
      max: filters.maxPrice || ''
    });
  }, [filters.minPrice, filters.maxPrice]);

  // Convert price for display
  const convertPriceForDisplay = (price) => {
    if (!price || price === '') return '';
    return convertPrice(price, 'USD', userCurrency);
  };

  // Convert price back to USD for filtering
  const convertPriceToUSD = (price) => {
    if (!price || price === '') return null;
    if (userCurrency === 'USD') return parseFloat(price);
    return convertPrice(parseFloat(price), userCurrency, 'USD');
  };

  const stockOptions = [
    { value: 'all', label: 'All Stock', color: 'gray', icon: '📊' },
    { value: 'true', label: 'In Stock', color: 'green', icon: '✅' },
    { value: 'false', label: 'Out of Stock', color: 'red', icon: '❌' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Name', icon: '📝' },
    { value: 'price', label: 'Price', icon: '💰' },
    { value: 'createdAt', label: 'Date Added', icon: '📅' },
    { value: 'stock', label: 'Stock Level', icon: '📦' },
    { value: 'updatedAt', label: 'Last Updated', icon: '🔄' }
  ];

  const handleFilterUpdate = (updates) => {
    onFilterChange({ ...filters, ...updates });
  };

  const handlePriceRangeApply = () => {
    // Convert prices back to USD for consistent filtering
    const minPriceUSD = localPriceRange.min ? convertPriceToUSD(localPriceRange.min) : null;
    const maxPriceUSD = localPriceRange.max ? convertPriceToUSD(localPriceRange.max) : null;
    
    handleFilterUpdate({
      minPrice: minPriceUSD,
      maxPrice: maxPriceUSD
    });
  };

  const handlePriceRangeClear = () => {
    setLocalPriceRange({ min: '', max: '' });
    handleFilterUpdate({
      minPrice: null,
      maxPrice: null
    });
  };

  const clearFilters = () => {
    setLocalPriceRange({ min: '', max: '' });
    onFilterChange({
      search: '',
      category: 'All',
      inStock: 'all',
      minPrice: null,
      maxPrice: null,
      sortBy: 'name',
      sortOrder: 'asc'
    });
  };

  const hasActiveFilters = 
    filters.search || 
    filters.category !== 'All' || 
    filters.inStock !== 'all' || 
    filters.minPrice !== null || 
    filters.maxPrice !== null;

  const getColorClasses = (color) => {
    const colors = {
      gray: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700',
      green: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800',
      red: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800',
      blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      yellow: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800'
    };
    return colors[color] || colors.gray;
  };

  // Format price for display with currency
  const formatPriceWithCurrency = (price) => {
    if (!price && price !== 0) return `${getCurrencySymbol()}0`;
    const formatted = formatPrice(price, userCurrency);
    return formatted.formatted;
  };

  // Filter Chip Component
  const FilterChip = ({ type, value, label, onRemove }) => {
    const getChipConfig = () => {
      if (type === 'search') {
        return { icon: '🔍', color: 'blue' };
      }
      if (type === 'category' && value !== 'All') {
        return { icon: '🏷️', color: 'purple' };
      }
      if (type === 'stock') {
        const option = stockOptions.find(opt => opt.value === value);
        return { icon: option?.icon, color: option?.color };
      }
      if (type === 'price') {
        return { icon: '💰', color: 'yellow' };
      }
      return { icon: '📊', color: 'gray' };
    };

    const { icon, color } = getChipConfig();

    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRemove}
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-full border-2 text-sm font-medium ${getColorClasses(color)}`}
      >
        <span>{icon}</span>
        {label}
        <XIcon className="w-3 h-3" />
      </motion.button>
    );
  };

  // Price Range Filter Component - UPDATED
  const PriceRangeFilter = () => {
    // Convert price range for display in current currency
    const displayMinPrice = priceRange?.min ? convertPriceForDisplay(priceRange.min) : 0;
    const displayMaxPrice = priceRange?.max ? convertPriceForDisplay(priceRange.max) : 1000;
    
    return (
      <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-gray-700 dark:text-gray-300">Price Range</h4>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {formatPriceWithCurrency(displayMinPrice)} - {formatPriceWithCurrency(displayMaxPrice)}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Min Price ({userCurrency})
            </label>
            <input
              type="number"
              placeholder="Min"
              value={localPriceRange.min}
              onChange={(e) => setLocalPriceRange(prev => ({ ...prev, min: e.target.value }))}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Max Price ({userCurrency})
            </label>
            <input
              type="number"
              placeholder="Max"
              value={localPriceRange.max}
              onChange={(e) => setLocalPriceRange(prev => ({ ...prev, max: e.target.value }))}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              min="0"
              step="0.01"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handlePriceRangeApply}
            className="flex-1 py-2 px-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            Apply
          </button>
          <button
            onClick={handlePriceRangeClear}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Clear
          </button>
        </div>
        
        {/* Currency Info */}
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Prices displayed in {userCurrency}. Filtering uses converted values.
        </div>
      </div>
    );
  };

  // Mobile Filter Tabs Component
  const MobileFilterTabs = () => (
    <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
      {[
        { id: 'category', label: 'Category', icon: '🏷️' },
        { id: 'stock', label: 'Stock', icon: '📦' },
        { id: 'price', label: 'Price', icon: '💰' },
        { id: 'sort', label: 'Sort', icon: '🔀' }
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveFilterTab(tab.id)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 font-medium text-sm transition-all ${
            activeFilterTab === tab.id
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <span>{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );

  // Mobile Filter Content
  const MobileFilterContent = () => {
    switch (activeFilterTab) {
      case 'category':
        return (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Product Category</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {['All', ...PRODUCT_CATEGORIES].map(category => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleFilterUpdate({ category })}
                  className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                    filters.category === category
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-md'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <TagIcon className="w-4 h-4" />
                    <span className="font-medium">{category}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case 'stock':
        return (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Stock Status</h3>
            <div className="grid grid-cols-1 gap-2">
              {stockOptions.map(option => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleFilterUpdate({ inStock: option.value })}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    filters.inStock === option.value
                      ? `${getColorClasses(option.color)} border-current shadow-md`
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{option.icon}</span>
                    <div>
                      <div className="font-medium">{option.label}</div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case 'price':
        return <PriceRangeFilter />;

      case 'sort':
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">Sort By</h3>
              <div className="space-y-2">
                {sortOptions.map(option => (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleFilterUpdate({ sortBy: option.value })}
                    className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                      filters.sortBy === option.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-md'
                        : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{option.icon}</span>
                      <span className="font-medium">{option.label}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">Sort Order</h3>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleFilterUpdate({ sortOrder: 'asc' })}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    filters.sortOrder === 'asc'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-md'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <TrendingUpIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">Ascending</span>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleFilterUpdate({ sortOrder: 'desc' })}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    filters.sortOrder === 'desc'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-md'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <TrendingUpIcon className="w-5 h-5 rotate-180" />
                    <span className="text-sm font-medium">Descending</span>
                  </div>
                </motion.button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Main Filter Component */}
      <motion.div
        ref={filtersRef}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 lg:p-6 shadow-lg"
      >
        {/* View Mode Indicator */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            {isMobile ? <SmartphoneIcon className="w-4 h-4" /> : <MonitorIcon className="w-4 h-4" />}
            <span>{isMobile ? 'Mobile View' : 'Desktop View'}</span>
          </div>
          
          <AnimatePresence>
            {hasActiveFilters && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full"
              >
                {[
                  filters.search && 1,
                  filters.category !== 'All' && 1,
                  filters.inStock !== 'all' && 1,
                  (filters.minPrice !== null || filters.maxPrice !== null) && 1
                ].filter(Boolean).length} Active
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Main Search and Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <div className="flex-1 relative w-full">
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={isMobile ? "Search products..." : "Search products by name, SKU, or description..."}
                value={filters.search}
                onChange={(e) => handleFilterUpdate({ search: e.target.value })}
                disabled={isLoading}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {filters.search && (
                <button
                  onClick={() => handleFilterUpdate({ search: '' })}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          
          <div className="flex gap-3 flex-shrink-0 w-full lg:w-auto">
            <button
              onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
              disabled={isLoading}
              className={`flex items-center justify-center gap-2 lg:gap-3 px-4 lg:px-6 py-3 rounded-xl border-2 transition-all duration-300 font-semibold flex-1 lg:flex-none ${
                isFiltersExpanded || hasActiveFilters
                  ? 'border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 shadow-md'
                  : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <FilterIcon className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="text-sm lg:text-base">{isMobile ? 'Filters' : 'Advanced Filters'}</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-blue-500 rounded-full" />
              )}
            </button>
            
            <AnimatePresence>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors bg-gray-100 dark:bg-gray-700 rounded-xl font-medium text-sm lg:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <XCircleIcon className="w-4 h-4 lg:w-5 lg:h-5" />
                  {isMobile ? 'Clear' : 'Clear All'}
                </button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <FilterChip
                  type="search"
                  value="search"
                  label={`Search: "${filters.search}"`}
                  onRemove={() => handleFilterUpdate({ search: '' })}
                />
              )}
              {filters.category !== 'All' && (
                <FilterChip
                  type="category"
                  value={filters.category}
                  label={`Category: ${filters.category}`}
                  onRemove={() => handleFilterUpdate({ category: 'All' })}
                />
              )}
              {filters.inStock !== 'all' && (
                <FilterChip
                  type="stock"
                  value={filters.inStock}
                  label={`Stock: ${filters.inStock === 'true' ? 'In Stock' : 'Out of Stock'}`}
                  onRemove={() => handleFilterUpdate({ inStock: 'all' })}
                />
              )}
              {(filters.minPrice !== null || filters.maxPrice !== null) && (
                <FilterChip
                  type="price"
                  value="price"
                  label={`Price: ${formatPriceWithCurrency(filters.minPrice || 0)} - ${filters.maxPrice ? formatPriceWithCurrency(filters.maxPrice) : '∞'}`}
                  onRemove={() => {
                    handleFilterUpdate({ 
                      minPrice: null, 
                      maxPrice: null 
                    });
                    setLocalPriceRange({ min: '', max: '' });
                  }}
                />
              )}
            </div>
          </motion.div>
        )}

        {/* Desktop Expanded Filters Panel */}
        {!isMobile && isFiltersExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide text-xs">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterUpdate({ category: e.target.value })}
                    disabled={isLoading}
                    className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-3 focus:ring-blue-500/20 transition-all duration-300 appearance-none cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {['All', ...PRODUCT_CATEGORIES].map(category => (
                      <option key={category} value={category}>
                        {category === 'All' ? '📊 All Categories' : `🏷️ ${category}`}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Stock Status Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide text-xs">
                  Stock Status
                </label>
                <div className="relative">
                  <select
                    value={filters.inStock}
                    onChange={(e) => handleFilterUpdate({ inStock: e.target.value })}
                    disabled={isLoading}
                    className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-3 focus:ring-blue-500/20 transition-all duration-300 appearance-none cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {stockOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.icon} {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="lg:col-span-2">
                <PriceRangeFilter />
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide text-xs">
                  Sort By
                </label>
                <div className="relative">
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterUpdate({ sortBy: e.target.value })}
                    disabled={isLoading}
                    className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-3 focus:ring-blue-500/20 transition-all duration-300 appearance-none cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.icon} {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide text-xs">
                  Sort Order
                </label>
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <select
                      value={filters.sortOrder}
                      onChange={(e) => handleFilterUpdate({ sortOrder: e.target.value })}
                      disabled={isLoading}
                      className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-3 focus:ring-blue-500/20 transition-all duration-300 appearance-none cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="asc">📈 Ascending</option>
                      <option value="desc">📉 Descending</option>
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                  
                  <button
                    onClick={() => handleFilterUpdate({ 
                      sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' 
                    })}
                    disabled={isLoading}
                    className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 flex items-center justify-center min-w-[60px] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowUpDownIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Mobile Full-Screen Filter Panel */}
      <AnimatePresence>
        {isMobile && isFiltersExpanded && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFiltersExpanded(false)}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            />
            
            {/* Filter Panel */}
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-3xl border-t border-gray-200 dark:border-gray-700 p-6 max-h-[80vh] overflow-y-auto z-50 lg:hidden shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Product Filters</h3>
                <button
                  onClick={() => setIsFiltersExpanded(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <XIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Filter Tabs */}
              <MobileFilterTabs />

              {/* Mobile Filter Content */}
              <div className="pb-6">
                <MobileFilterContent />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={clearFilters}
                  className="flex-1 py-3 px-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium bg-white dark:bg-gray-800"
                >
                  Reset All
                </button>
                <button
                  onClick={() => setIsFiltersExpanded(false)}
                  className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-xl font-medium shadow-lg"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductFilters;