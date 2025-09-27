// src/components/admin/products/ProductFilters.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRODUCT_CATEGORIES } from '../../../config/constants';
import { FilterIcon, SearchIcon, XCircleIcon, ChevronDownIcon, ArrowUpDownIcon, XIcon } from 'lucide-react';

const ProductFilters = ({ filters, onFilterChange, isLoading }) => {
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  const handleSearchChange = (value) => {
    onFilterChange({ search: value });
  };

  const handleCategoryChange = (category) => {
    onFilterChange({ category });
  };

  const handleStockChange = (inStock) => {
    onFilterChange({ inStock });
  };

  const handleSortChange = (sortBy, sortOrder) => {
    onFilterChange({ sortBy, sortOrder });
  };

  const clearFilters = () => {
    onFilterChange({
      search: '',
      category: 'All',
      inStock: 'all',
      sortBy: 'name',
      sortOrder: 'asc'
    });
  };

  const hasActiveFilters = filters.search || filters.category !== 'All' || filters.inStock !== 'all';

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
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
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
        duration: 0.4,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const filterItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: { 
      scale: 0.98,
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
    hover: { scale: 1.1 }
  };

  const sortButtonVariants = {
    initial: { rotate: 0 },
    asc: { rotate: 0 },
    desc: { rotate: 180 },
    hover: { scale: 1.1, backgroundColor: "rgba(59, 130, 246, 0.1)" }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm"
    >
      {/* Main Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <motion.div 
          variants={itemVariants}
          className="flex-1 relative w-full"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileFocus={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name, SKU, or description..."
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              disabled={isLoading}
            />
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
            className={`flex items-center gap-3 px-5 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
              isFiltersExpanded || hasActiveFilters
                ? 'border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 shadow-sm'
                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
          >
            <motion.div
              variants={iconVariants}
              animate={isFiltersExpanded ? "expanded" : "initial"}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <FilterIcon className="w-4 h-4" />
            </motion.div>
            Filters
            {hasActiveFilters && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-2 h-2 bg-blue-500 rounded-full"
              />
            )}
          </motion.button>
          
          <AnimatePresence>
            {hasActiveFilters && (
              <motion.button
                key="clear-filters"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3 }}
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors overflow-hidden whitespace-nowrap"
              >
                <XCircleIcon className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium">Clear</span>
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Expanded Filters */}
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
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {/* Category Filter */}
              <motion.div variants={filterItemVariants}>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Category
                </label>
                <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                  <select
                    value={filters.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200 appearance-none cursor-pointer"
                  >
                    {PRODUCT_CATEGORIES.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </motion.div>
              </motion.div>

              {/* Stock Status Filter */}
              <motion.div variants={filterItemVariants}>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Stock Status
                </label>
                <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                  <select
                    value={filters.inStock}
                    onChange={(e) => handleStockChange(e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200 appearance-none cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    <option value="true">In Stock</option>
                    <option value="false">Out of Stock</option>
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </motion.div>
              </motion.div>

              {/* Sort Options */}
              <motion.div variants={filterItemVariants}>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Sort By
                </label>
                <div className="flex gap-3">
                  <motion.div whileHover={{ scale: 1.02 }} className="flex-1">
                    <select
                      value={filters.sortBy}
                      onChange={(e) => handleSortChange(e.target.value, filters.sortOrder)}
                      className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200 appearance-none cursor-pointer"
                    >
                      <option value="name">Name</option>
                      <option value="price">Price</option>
                      <option value="createdAt">Date Added</option>
                      <option value="stock">Stock</option>
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </motion.div>
                  
                  <motion.button
                    variants={sortButtonVariants}
                    initial="initial"
                    animate={filters.sortOrder === 'asc' ? 'asc' : 'desc'}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => handleSortChange(filters.sortBy, filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center min-w-[60px]"
                  >
                    <ArrowUpDownIcon className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>

            {/* Active Filters Badges */}
            <AnimatePresence>
              {hasActiveFilters && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 flex flex-wrap gap-2"
                >
                  {filters.search && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm"
                    >
                      Search: "{filters.search}"
                      <button
                        onClick={() => handleSearchChange('')}
                        className="hover:text-blue-600 dark:hover:text-blue-200"
                      >
                        <XIcon className="w-3 h-3" />
                      </button>
                    </motion.span>
                  )}
                  
                  {filters.category !== 'All' && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm"
                    >
                      Category: {filters.category}
                      <button
                        onClick={() => handleCategoryChange('All')}
                        className="hover:text-green-600 dark:hover:text-green-200"
                      >
                        <XIcon className="w-3 h-3" />
                      </button>
                    </motion.span>
                  )}
                  
                  {filters.inStock !== 'all' && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm"
                    >
                      Stock: {filters.inStock === 'true' ? 'In Stock' : 'Out of Stock'}
                      <button
                        onClick={() => handleStockChange('all')}
                        className="hover:text-purple-600 dark:hover:text-purple-200"
                      >
                        <XIcon className="w-3 h-3" />
                      </button>
                    </motion.span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductFilters;