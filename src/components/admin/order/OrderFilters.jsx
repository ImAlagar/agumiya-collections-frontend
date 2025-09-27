// src/components/admin/order/OrderFilters.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FilterIcon, SearchIcon, XCircleIcon, ChevronDownIcon, ArrowUpDownIcon, XIcon } from 'lucide-react';

const OrderFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'All Statuses', color: 'gray' },
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'confirmed', label: 'Confirmed', color: 'blue' },
    { value: 'processing', label: 'Processing', color: 'indigo' },
    { value: 'shipped', label: 'Shipped', color: 'purple' },
    { value: 'delivered', label: 'Delivered', color: 'green' },
    { value: 'cancelled', label: 'Cancelled', color: 'red' }
  ];

  const paymentStatusOptions = [
    { value: 'all', label: 'All Payment Statuses', color: 'gray' },
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'paid', label: 'Paid', color: 'green' },
    { value: 'failed', label: 'Failed', color: 'red' },
    { value: 'refunded', label: 'Refunded', color: 'orange' }
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Order Date' },
    { value: 'updatedAt', label: 'Last Updated' },
    { value: 'totalAmount', label: 'Total Amount' },
    { value: 'customerName', label: 'Customer Name' }
  ];

  const handleFilterUpdate = (updates) => {
    onFilterChange({ ...filters, ...updates });
  };

  const hasActiveFilters = filters.search || filters.status !== 'all' || filters.paymentStatus !== 'all';

  // Animation variants
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

  const filterItemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 20,
        duration: 0.5
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

  const iconVariants = {
    initial: { rotate: 0 },
    expanded: { rotate: 180 },
    hover: { scale: 1.2 }
  };

  const sortOrderVariants = {
    asc: { rotate: 0 },
    desc: { rotate: 180 },
    hover: { scale: 1.1 }
  };

  const badgeVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    },
    exit: { 
      scale: 0, 
      opacity: 0,
      transition: { duration: 0.2 }
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg"
    >
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
              placeholder="Search orders by ID, customer name, email, or product..."
              value={filters.search}
              onChange={(e) => handleFilterUpdate({ search: e.target.value })}
              className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg font-medium"
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
          className="flex gap-3 flex-shrink-0"
        >
          <motion.button
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
            className={`flex items-center gap-3 px-6 py-3.5 rounded-xl border-2 transition-all duration-300 font-semibold ${
              isFiltersExpanded || hasActiveFilters
                ? 'border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 shadow-md'
                : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
            }`}
          >
            <motion.div
              variants={iconVariants}
              animate={isFiltersExpanded ? "expanded" : "initial"}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <FilterIcon className="w-5 h-5" />
            </motion.div>
            Advanced Filters
            {hasActiveFilters && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-2.5 h-2.5 bg-blue-500 rounded-full"
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
                className="flex items-center gap-2 px-5 py-3.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors bg-gray-100 dark:bg-gray-700 rounded-xl font-medium"
              >
                <XCircleIcon className="w-5 h-5" />
                Clear All
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Expanded Filters Panel */}
      <AnimatePresence>
        {isFiltersExpanded && (
          <motion.div
            key="filter-panel"
            variants={filterPanelVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
          >
            <motion.div 
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {/* Status Filter */}
              <motion.div variants={filterItemVariants}>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide text-xs">
                  Order Status
                </label>
                <motion.div whileHover={{ scale: 1.02 }} className="relative">
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterUpdate({ status: e.target.value })}
                    className="w-full p-3.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-3 focus:ring-blue-500/20 transition-all duration-300 appearance-none cursor-pointer font-medium"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </motion.div>
              </motion.div>

              {/* Payment Status Filter */}
              <motion.div variants={filterItemVariants}>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide text-xs">
                  Payment Status
                </label>
                <motion.div whileHover={{ scale: 1.02 }} className="relative">
                  <select
                    value={filters.paymentStatus}
                    onChange={(e) => handleFilterUpdate({ paymentStatus: e.target.value })}
                    className="w-full p-3.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-3 focus:ring-blue-500/20 transition-all duration-300 appearance-none cursor-pointer font-medium"
                  >
                    {paymentStatusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </motion.div>
              </motion.div>

              {/* Sort By */}
              <motion.div variants={filterItemVariants}>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide text-xs">
                  Sort By
                </label>
                <motion.div whileHover={{ scale: 1.02 }} className="relative">
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterUpdate({ sortBy: e.target.value })}
                    className="w-full p-3.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-3 focus:ring-blue-500/20 transition-all duration-300 appearance-none cursor-pointer font-medium"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </motion.div>
              </motion.div>

              {/* Sort Order */}
              <motion.div variants={filterItemVariants}>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide text-xs">
                  Sort Order
                </label>
                <div className="flex gap-3">
                  <motion.div whileHover={{ scale: 1.02 }} className="flex-1 relative">
                    <select
                      value={filters.sortOrder}
                      onChange={(e) => handleFilterUpdate({ sortOrder: e.target.value })}
                      className="w-full p-3.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-3 focus:ring-blue-500/20 transition-all duration-300 appearance-none cursor-pointer font-medium"
                    >
                      <option value="desc">Newest First</option>
                      <option value="asc">Oldest First</option>
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </motion.div>
                  
                  <motion.button
                    variants={sortOrderVariants}
                    animate={filters.sortOrder}
                    whileHover="hover"
                    onClick={() => handleFilterUpdate({ 
                      sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' 
                    })}
                    className="px-4 py-3.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 flex items-center justify-center min-w-[60px]"
                  >
                    <ArrowUpDownIcon className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>

            {/* Active Filters Badges */}
            <AnimatePresence>
              {hasActiveFilters && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700"
                >
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Active Filters:</h4>
                  <div className="flex flex-wrap gap-2">
                    {filters.search && (
                      <motion.span
                        variants={badgeVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 font-medium ${getColorClasses('blue')}`}
                      >
                        Search: "{filters.search}"
                        <button
                          onClick={() => handleFilterUpdate({ search: '' })}
                          className="hover:scale-110 transition-transform"
                        >
                          <XIcon className="w-3 h-3" />
                        </button>
                      </motion.span>
                    )}
                    
                    {filters.status !== 'all' && (
                      <motion.span
                        variants={badgeVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ delay: 0.1 }}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 font-medium ${getColorClasses(getStatusColor(filters.status))}`}
                      >
                        Status: {statusOptions.find(s => s.value === filters.status)?.label}
                        <button
                          onClick={() => handleFilterUpdate({ status: 'all' })}
                          className="hover:scale-110 transition-transform"
                        >
                          <XIcon className="w-3 h-3" />
                        </button>
                      </motion.span>
                    )}
                    
                    {filters.paymentStatus !== 'all' && (
                      <motion.span
                        variants={badgeVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ delay: 0.2 }}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 font-medium ${getColorClasses(getStatusColor(filters.paymentStatus, 'payment'))}`}
                      >
                        Payment: {paymentStatusOptions.find(p => p.value === filters.paymentStatus)?.label}
                        <button
                          onClick={() => handleFilterUpdate({ paymentStatus: 'all' })}
                          className="hover:scale-110 transition-transform"
                        >
                          <XIcon className="w-3 h-3" />
                        </button>
                      </motion.span>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default OrderFilters;