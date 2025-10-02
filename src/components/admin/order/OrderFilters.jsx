// src/components/admin/order/OrderFilters.js
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FilterIcon, 
  SearchIcon, 
  XCircleIcon, 
  ChevronDownIcon, 
  ArrowUpDownIcon, 
  XIcon,
  SmartphoneIcon,
  MonitorIcon
} from 'lucide-react';

const OrderFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState('status'); // For mobile tabbed interface
  const filtersRef = useRef(null);

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

  const statusOptions = [
    { value: 'all', label: 'All Statuses', color: 'gray', icon: '📊' },
    { value: 'pending', label: 'Pending', color: 'yellow', icon: '⏳' },
    { value: 'confirmed', label: 'Confirmed', color: 'blue', icon: '✅' },
    { value: 'processing', label: 'Processing', color: 'indigo', icon: '⚙️' },
    { value: 'shipped', label: 'Shipped', color: 'purple', icon: '🚚' },
    { value: 'delivered', label: 'Delivered', color: 'green', icon: '📦' },
    { value: 'cancelled', label: 'Cancelled', color: 'red', icon: '❌' }
  ];

  const paymentStatusOptions = [
    { value: 'all', label: 'All Payments', color: 'gray', icon: '💳' },
    { value: 'pending', label: 'Pending', color: 'yellow', icon: '⏳' },
    { value: 'paid', label: 'Paid', color: 'green', icon: '💰' },
    { value: 'failed', label: 'Failed', color: 'red', icon: '❌' },
    { value: 'refunded', label: 'Refunded', color: 'orange', icon: '↩️' }
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Order Date', icon: '📅' },
    { value: 'updatedAt', label: 'Last Updated', icon: '🔄' },
    { value: 'totalAmount', label: 'Total Amount', icon: '💰' },
    { value: 'customerName', label: 'Customer Name', icon: '👤' }
  ];

  const handleFilterUpdate = (updates) => {
    onFilterChange({ ...filters, ...updates });
  };

  const hasActiveFilters = filters.search || filters.status !== 'all' || filters.paymentStatus !== 'all';

  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6
      }
    }
  };

  const filterPanelVariants = {
    collapsed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    expanded: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const mobileFilterPanelVariants = {
    collapsed: {
      y: "100%",
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    },
    expanded: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: { 
      scale: 0.95,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  const getStatusColor = (value, type = 'status') => {
    const options = type === 'payment' ? paymentStatusOptions : statusOptions;
    const option = options.find(opt => opt.value === value);
    return option?.color || 'gray';
  };

  const getColorClasses = (color) => {
    const colors = {
      gray: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700',
      yellow: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
      blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      indigo: 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
      purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      green: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800',
      red: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800',
      orange: 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800'
    };
    return colors[color] || colors.gray;
  };

  // Mobile-optimized filter chips
  const FilterChip = ({ type, value, label, onRemove }) => {
    const option = type === 'status' 
      ? statusOptions.find(opt => opt.value === value)
      : paymentStatusOptions.find(opt => opt.value === value);

    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRemove}
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-full border-2 text-sm font-medium ${getColorClasses(option?.color)}`}
      >
        <span>{option?.icon}</span>
        {label}
        <XIcon className="w-3 h-3" />
      </motion.button>
    );
  };

  // Mobile Filter Tabs Component
  const MobileFilterTabs = () => (
    <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
      {[
        { id: 'status', label: 'Status', icon: '📊' },
        { id: 'payment', label: 'Payment', icon: '💳' },
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
      case 'status':
        return (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Order Status</h3>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map(option => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleFilterUpdate({ status: option.value })}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    filters.status === option.value
                      ? `${getColorClasses(option.color)} border-current shadow-md`
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{option.icon}</span>
                    <span className="text-sm font-medium">{option.label}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Payment Status</h3>
            <div className="grid grid-cols-2 gap-2">
              {paymentStatusOptions.map(option => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleFilterUpdate({ paymentStatus: option.value })}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    filters.paymentStatus === option.value
                      ? `${getColorClasses(option.color)} border-current shadow-md`
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{option.icon}</span>
                    <span className="text-sm font-medium">{option.label}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        );

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
                  onClick={() => handleFilterUpdate({ sortOrder: 'desc' })}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    filters.sortOrder === 'desc'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-md'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <ArrowUpDownIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">Newest First</span>
                  </div>
                </motion.button>

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
                    <ArrowUpDownIcon className="w-5 h-5 rotate-180" />
                    <span className="text-sm font-medium">Oldest First</span>
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
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 lg:p-6 shadow-lg"
      >
        {/* View Mode Indicator */}
        <div className="flex items-center justify-between mb-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
          >
            {isMobile ? <SmartphoneIcon className="w-4 h-4" /> : <MonitorIcon className="w-4 h-4" />}
            <span>{isMobile ? 'Mobile View' : 'Desktop View'}</span>
          </motion.div>
          
          <AnimatePresence>
            {hasActiveFilters && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full"
              >
                {[
                  filters.search && 1,
                  filters.status !== 'all' && 1,
                  filters.paymentStatus !== 'all' && 1
                ].filter(Boolean).length} Active
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Main Search and Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <motion.div 
            variants={itemVariants}
            className="flex-1 relative w-full"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative"
            >
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={isMobile ? "Search orders..." : "Search orders by ID, customer name, email, or product..."}
                value={filters.search}
                onChange={(e) => handleFilterUpdate({ search: e.target.value })}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-base font-medium"
              />
              {filters.search && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => handleFilterUpdate({ search: '' })}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <XIcon className="w-4 h-4" />
                </motion.button>
              )}
            </motion.div>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="flex gap-3 flex-shrink-0 w-full lg:w-auto"
          >
            <motion.button
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
              className={`flex items-center justify-center gap-2 lg:gap-3 px-4 lg:px-6 py-3 rounded-xl border-2 transition-all duration-300 font-semibold flex-1 lg:flex-none ${
                isFiltersExpanded || hasActiveFilters
                  ? 'border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 shadow-md'
                  : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <FilterIcon className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="text-sm lg:text-base">{isMobile ? 'Filters' : 'Advanced Filters'}</span>
              {hasActiveFilters && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-2 h-2 bg-blue-500 rounded-full"
                />
              )}
            </motion.button>
            
            <AnimatePresence>
              {hasActiveFilters && (
                <motion.button
                  key="clear-filters"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={onClearFilters}
                  className="flex items-center gap-2 px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors bg-gray-100 dark:bg-gray-700 rounded-xl font-medium text-sm lg:text-base"
                >
                  <XCircleIcon className="w-4 h-4 lg:w-5 lg:h-5" />
                  {isMobile ? 'Clear' : 'Clear All'}
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Active Filter Chips - Mobile */}
        {isMobile && hasActiveFilters && (
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
              {filters.status !== 'all' && (
                <FilterChip
                  type="status"
                  value={filters.status}
                  label={statusOptions.find(s => s.value === filters.status)?.label}
                  onRemove={() => handleFilterUpdate({ status: 'all' })}
                />
              )}
              {filters.paymentStatus !== 'all' && (
                <FilterChip
                  type="payment"
                  value={filters.paymentStatus}
                  label={paymentStatusOptions.find(p => p.value === filters.paymentStatus)?.label}
                  onRemove={() => handleFilterUpdate({ paymentStatus: 'all' })}
                />
              )}
            </div>
          </motion.div>
        )}

        {/* Desktop Expanded Filters Panel */}
        {!isMobile && (
          <AnimatePresence>
            {isFiltersExpanded && (
              <motion.div
                key="desktop-filter-panel"
                variants={filterPanelVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
              >
                {/* ... (keep the existing desktop filter content) */}
                <motion.div 
                  variants={containerVariants}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                  {/* Status Filter */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide text-xs">
                      Order Status
                    </label>
                    <motion.div whileHover={{ scale: 1.02 }} className="relative">
                      <select
                        value={filters.status}
                        onChange={(e) => handleFilterUpdate({ status: e.target.value })}
                        className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-3 focus:ring-blue-500/20 transition-all duration-300 appearance-none cursor-pointer font-medium"
                      >
                        {statusOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.icon} {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </motion.div>
                  </motion.div>

                  {/* Payment Status Filter */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide text-xs">
                      Payment Status
                    </label>
                    <motion.div whileHover={{ scale: 1.02 }} className="relative">
                      <select
                        value={filters.paymentStatus}
                        onChange={(e) => handleFilterUpdate({ paymentStatus: e.target.value })}
                        className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-3 focus:ring-blue-500/20 transition-all duration-300 appearance-none cursor-pointer font-medium"
                      >
                        {paymentStatusOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.icon} {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </motion.div>
                  </motion.div>

                  {/* Sort By */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide text-xs">
                      Sort By
                    </label>
                    <motion.div whileHover={{ scale: 1.02 }} className="relative">
                      <select
                        value={filters.sortBy}
                        onChange={(e) => handleFilterUpdate({ sortBy: e.target.value })}
                        className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-3 focus:ring-blue-500/20 transition-all duration-300 appearance-none cursor-pointer font-medium"
                      >
                        {sortOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.icon} {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </motion.div>
                  </motion.div>

                  {/* Sort Order */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide text-xs">
                      Sort Order
                    </label>
                    <div className="flex gap-3">
                      <motion.div whileHover={{ scale: 1.02 }} className="flex-1 relative">
                        <select
                          value={filters.sortOrder}
                          onChange={(e) => handleFilterUpdate({ sortOrder: e.target.value })}
                          className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-3 focus:ring-blue-500/20 transition-all duration-300 appearance-none cursor-pointer font-medium"
                        >
                          <option value="desc">📈 Newest First</option>
                          <option value="asc">📉 Oldest First</option>
                        </select>
                        <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </motion.div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleFilterUpdate({ 
                          sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' 
                        })}
                        className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 flex items-center justify-center min-w-[60px]"
                      >
                        <ArrowUpDownIcon className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
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
              key="mobile-filter-panel"
              variants={mobileFilterPanelVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-3xl border-t border-gray-200 dark:border-gray-700 p-6 max-h-[80vh] overflow-y-auto z-50 lg:hidden shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Filters</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsFiltersExpanded(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <XIcon className="w-6 h-6" />
                </motion.button>
              </div>

              {/* Mobile Filter Tabs */}
              <MobileFilterTabs />

              {/* Mobile Filter Content */}
              <div className="pb-6">
                <MobileFilterContent />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClearFilters}
                  className="flex-1 py-3 px-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium bg-white dark:bg-gray-800"
                >
                  Reset All
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsFiltersExpanded(false)}
                  className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-xl font-medium shadow-lg"
                >
                  Apply Filters
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default OrderFilters;