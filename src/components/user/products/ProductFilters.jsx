// src/components/products/ProductFilters.js
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '../../../hooks/useDebounce';

const ProductFilters = ({ filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [priceRange, setPriceRange] = useState([filters.minPrice || 0, filters.maxPrice || 1000]);
  const [rating, setRating] = useState(filters.rating || 0);
  
  // Only debounce search to avoid too many API calls
  const debouncedSearch = useDebounce(localFilters.search, 500);

  // Sync local filters when parent filters change (e.g., from reset)
  useEffect(() => {
    setLocalFilters(filters);
    setPriceRange([filters.minPrice || 0, filters.maxPrice || 1000]);
    setRating(filters.rating || 0);
  }, [filters]);

  // Handle debounced search separately
  useEffect(() => {
    if (debouncedSearch !== undefined && debouncedSearch !== filters.search) {
      onFilterChange({ search: debouncedSearch });
    }
  }, [debouncedSearch, onFilterChange]); // Remove filters.search from dependencies

  const handleChange = useCallback((key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    
    // For non-search fields, update immediately
    if (key !== 'search') {
      onFilterChange(newFilters);
    }
  }, [localFilters, onFilterChange]);

  const handlePriceRangeChange = useCallback((newRange) => {
    setPriceRange(newRange);
    onFilterChange({
      minPrice: newRange[0],
      maxPrice: newRange[1]
    });
  }, [onFilterChange]);

  const handleRatingChange = useCallback((newRating) => {
    setRating(newRating);
    onFilterChange({ rating: newRating });
  }, [onFilterChange]);

  const handleClearFilters = useCallback(() => {
    const resetFilters = {
      search: '',
      category: 'All',
      brand: 'All Brands',
      inStock: 'all',
      sortBy: 'name',
      sortOrder: 'asc',
      limit: 10,
      minPrice: 0,
      maxPrice: 1000,
      rating: 0
    };
    setLocalFilters(resetFilters);
    setPriceRange([0, 1000]);
    setRating(0);
    onFilterChange(resetFilters);
  }, [onFilterChange]);

  const categories = [
    'All',
    'Men\'s Clothing',
    'Women\'s Clothing',
    'Accessories',
    'Electronics',
    'Home & Living',
    'Beauty & Health',
    'Sports & Outdoors'
  ];

  const brands = [
    'All Brands',
    'Nike',
    'Apple',
    'Samsung',
    'Sony',
    'Adidas',
    'Zara',
    'H&M'
  ];

  const filterVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "tween",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={filterVariants}
      className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 space-y-6 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClearFilters}
          className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-semibold"
        >
          Reset All
        </motion.button>
      </div>

      {/* Search */}
      <motion.div variants={filterVariants} className="relative">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          🔍 Search Products
        </label>
        <div className="relative">
          <input
            type="text"
            value={localFilters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            placeholder="What are you looking for?"
            className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-2xl px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
          />
        </div>
      </motion.div>

      {/* Category */}
      <motion.div variants={filterVariants}>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          📁 Category
        </label>
        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
          {categories.map(category => (
            <motion.button
              key={category}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleChange('category', category)}
              className={`w-full text-left px-4 py-2 rounded-xl transition-all duration-300 ${
                localFilters.category === category
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-semibold'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Brand */}
      <motion.div variants={filterVariants}>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          🏷️ Brand
        </label>
        <select
          value={localFilters.brand || 'All Brands'}
          onChange={(e) => handleChange('brand', e.target.value)}
          className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-2xl px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 appearance-none cursor-pointer"
        >
          {brands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </motion.div>

      {/* Price Range */}
      <motion.div variants={filterVariants}>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          💰 Price Range: ${priceRange[0]} - ${priceRange[1]}
        </label>
        <div className="space-y-4">
          <input
            type="range"
            min="0"
            max="1000"
            step="10"
            value={priceRange[1]}
            onChange={(e) => handlePriceRangeChange([priceRange[0], parseInt(e.target.value)])}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex space-x-4">
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => handlePriceRangeChange([parseInt(e.target.value) || 0, priceRange[1]])}
              className="flex-1 border-2 border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500"
              placeholder="Min"
            />
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => handlePriceRangeChange([priceRange[0], parseInt(e.target.value) || 1000])}
              className="flex-1 border-2 border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500"
              placeholder="Max"
            />
          </div>
        </div>
      </motion.div>

      {/* Rating */}
      <motion.div variants={filterVariants}>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          ⭐ Rating
        </label>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map(stars => (
            <motion.button
              key={stars}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleRatingChange(stars)}
              className={`w-full text-left px-4 py-2 rounded-xl transition-all duration-300 flex items-center space-x-2 ${
                rating === stars
                  ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < stars ? 'text-yellow-400' : 'text-gray-300'}>
                    {i < stars ? '★' : '☆'}
                  </span>
                ))}
              </div>
              <span className="text-sm">& Up</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Stock Status */}
      <motion.div variants={filterVariants}>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          📦 Stock Status
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'all', label: 'All', emoji: '🔄' },
            { value: 'true', label: 'In Stock', emoji: '✅' },
            { value: 'false', label: 'Out of Stock', emoji: '❌' }
          ].map((option) => (
            <motion.button
              key={option.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleChange('inStock', option.value)}
              className={`px-4 py-3 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2 ${
                localFilters.inStock === option.value
                  ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-2 border-green-500'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <span>{option.emoji}</span>
              <span className="text-sm font-medium">{option.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Results per page */}
      <motion.div variants={filterVariants}>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          📊 Results per page
        </label>
        <select
          value={localFilters.limit || 10}
          onChange={(e) => handleChange('limit', parseInt(e.target.value))}
          className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-2xl px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 appearance-none cursor-pointer"
        >
          <option value={10}>10 products</option>
          <option value={20}>20 products</option>
          <option value={50}>50 products</option>
          <option value={100}>100 products</option>
        </select>
      </motion.div>

      {/* Active Filters Badges */}
      <AnimatePresence>
        {(localFilters.search || localFilters.category !== 'All' || localFilters.brand !== 'All Brands' || rating > 0) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Active Filters:
            </h4>
            <div className="flex flex-wrap gap-2">
              {localFilters.search && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium"
                >
                  Search: "{localFilters.search}"
                </motion.span>
              )}
              {localFilters.category !== 'All' && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"
                >
                  {localFilters.category}
                </motion.span>
              )}
              {localFilters.brand !== 'All Brands' && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs font-medium"
                >
                  {localFilters.brand}
                </motion.span>
              )}
              {rating > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-full text-xs font-medium"
                >
                  {rating}★ & Up
                </motion.span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductFilters;