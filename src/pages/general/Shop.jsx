// src/pages/Shop.jsx
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerVariants, itemVariants, useProducts } from '../../contexts/ProductsContext';
import { SEO } from '../../contexts/SEOContext';
import ProductGridSkeleton from '../../components/user/skeletons/ProductGridSkeleton';
import ProductCard from '../../components/user/products/ProductCard';

// Professional Filter Components
const FilterSection = ({ title, children, isOpen = true }) => {
  const [open, setOpen] = useState(isOpen);

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
      initial={false}
      animate={{ height: 'auto' }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="w-6 h-6 flex items-center justify-center"
        >
          <span className="text-gray-500 dark:text-gray-400">▼</span>
        </motion.div>
      </button>
      
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: 'auto', 
              opacity: 1,
              transition: {
                height: { duration: 0.4, ease: "easeInOut" },
                opacity: { duration: 0.3, delay: 0.1 }
              }
            }}
            exit={{ 
              height: 0, 
              opacity: 0,
              transition: {
                height: { duration: 0.3 },
                opacity: { duration: 0.2 }
              }
            }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const RangeSlider = ({ label, value, onChange, min, max, step = 1, format = (val) => val }) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <span className="text-sm font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded-lg">
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
      />
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
};

const ChipFilter = ({ label, options, value, onChange, multiSelect = false }) => {
  const handleClick = (optionValue) => {
    if (multiSelect) {
      const newValue = value.includes(optionValue)
        ? value.filter(v => v !== optionValue)
        : [...value, optionValue];
      onChange(newValue);
    } else {
      onChange(value === optionValue ? '' : optionValue);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = multiSelect 
            ? value.includes(option.value)
            : value === option.value;
          
          return (
            <motion.button
              key={option.value}
              onClick={() => handleClick(option.value)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-200 dark:shadow-primary-900/50'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {option.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

const RatingFilter = ({ value, onChange }) => {
  const ratings = [4, 3, 2, 1];
  
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Minimum Rating</label>
      <div className="space-y-2">
        {ratings.map((rating) => (
          <motion.button
            key={rating}
            onClick={() => onChange(value === rating ? 0 : rating)}
            className={`w-full flex items-center space-x-3 p-3 rounded-xl text-left transition-all duration-300 ${
              value === rating
                ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
                : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
            whileHover={{ x: 4 }}
          >
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-lg ${
                    star <= rating
                      ? 'text-yellow-400'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className={`text-sm font-medium ${
              value === rating 
                ? 'text-yellow-700 dark:text-yellow-300' 
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              {rating}.0 & up
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

const Shop = () => {
  const { 
    products, 
    isLoading, 
    error, 
    filters,
    pagination,
    fetchProducts, 
    updateFilters,
    clearError 
  } = useProducts();

  const [localFilters, setLocalFilters] = useState({
    ...filters,
    priceRange: [0, 1000],
    categories: [],
    brands: [],
    minRating: 0,
    features: [],
    availability: 'all'
  });

  // Safe products array
  const safeProducts = Array.isArray(products) ? products : [];

  // Mock data for filters (replace with your actual data)
  const filterOptions = useMemo(() => ({
    categories: [
      { value: 'electronics', label: 'Electronics', count: 45 },
      { value: 'clothing', label: 'Clothing', count: 89 },
      { value: 'home', label: 'Home & Garden', count: 67 },
      { value: 'sports', label: 'Sports', count: 34 },
      { value: 'books', label: 'Books', count: 56 }
    ],
    brands: [
      { value: 'apple', label: 'Apple', count: 23 },
      { value: 'samsung', label: 'Samsung', count: 18 },
      { value: 'nike', label: 'Nike', count: 31 },
      { value: 'sony', label: 'Sony', count: 15 },
      { value: 'adidas', label: 'Adidas', count: 27 }
    ],
    features: [
      { value: 'wireless', label: 'Wireless', count: 42 },
      { value: 'waterproof', label: 'Waterproof', count: 28 },
      { value: 'smart', label: 'Smart', count: 35 },
      { value: 'eco-friendly', label: 'Eco Friendly', count: 19 }
    ]
  }), []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setLocalFilters(prev => ({ ...prev, ...filters }));
  }, [filters]);

  const handleFilterChange = useCallback((newFilters) => {
    const updatedFilters = { ...localFilters, ...newFilters };
    setLocalFilters(updatedFilters);
    updateFilters(updatedFilters);
  }, [localFilters, updateFilters]);

  const handlePriceRangeChange = useCallback((newRange) => {
    handleFilterChange({ priceRange: newRange });
  }, [handleFilterChange]);

  const clearAllFilters = useCallback(() => {
    const resetFilters = {
      search: '',
      category: 'All',
      categories: [],
      brands: [],
      priceRange: [0, 1000],
      minRating: 0,
      features: [],
      inStock: 'all',
      sortBy: 'name',
      sortOrder: 'asc',
      limit: 10
    };
    setLocalFilters(resetFilters);
    updateFilters(resetFilters);
  }, [updateFilters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (localFilters.categories.length > 0) count++;
    if (localFilters.brands.length > 0) count++;
    if (localFilters.minRating > 0) count++;
    if (localFilters.features.length > 0) count++;
    if (localFilters.priceRange[0] > 0 || localFilters.priceRange[1] < 1000) count++;
    if (localFilters.inStock !== 'all') count++;
    return count;
  }, [localFilters]);

  const handlePageChange = useCallback((newPage) => {
    fetchProducts(newPage);
  }, [fetchProducts]);

  // Generate structured data for SEO
  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "numberOfItems": safeProducts.length,
    "itemListElement": safeProducts.map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": product.name || 'Unnamed Product',
        "description": (product.description?.replace(/<[^>]*>/g, '') || '').substring(0, 160),
        "image": product.images?.[0] || '',
        "sku": product.sku || product.id || '',
        "offers": {
          "@type": "Offer",
          "price": (product.price || 0).toString(),
          "priceCurrency": "USD",
          "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
        },
        "category": product.category || 'Uncategorized'
      }
    }))
  };

  return (
    <>
      <SEO  
        title="Shop All Products | ShopStyle"
        description="Browse our complete collection of fashion, electronics, and lifestyle products. Filter by category, price, and ratings."
        keywords="products, shop, fashion, electronics, filter, categories"
        canonical="https://shopstyle.com/shop"
        structuredData={productStructuredData}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="px-4 sm:px-6 lg:px-8">
          {/* Error Alert */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="mb-6 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 backdrop-blur-sm"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                      <span className="text-red-600 dark:text-red-400 text-lg">⚠️</span>
                    </div>
                    <p className="text-red-800 dark:text-red-200 font-medium">{error}</p>
                  </div>
                  <button
                    onClick={clearError}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 text-xl font-bold w-8 h-8 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900 rounded-full transition-colors"
                  >
                    ×
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:w-80 space-y-6"
            >
              {/* Filters Header */}
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Filters</h2>
                <div className="flex items-center space-x-2">
                  {activeFilterCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded-full"
                    >
                      {activeFilterCount}
                    </motion.span>
                  )}
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Filter Sections */}
              <div className="space-y-4">
                {/* Price Range */}
                <FilterSection title="Price Range">
                  <RangeSlider
                    label="Price Range"
                    value={localFilters.priceRange}
                    onChange={handlePriceRangeChange}
                    min={0}
                    max={1000}
                    step={10}
                    format={(val) => `$${val}`}
                  />
                </FilterSection>

                {/* Categories */}
                <FilterSection title="Categories">
                  <ChipFilter
                    label=""
                    options={filterOptions.categories}
                    value={localFilters.categories}
                    onChange={(value) => handleFilterChange({ categories: value })}
                    multiSelect={true}
                  />
                </FilterSection>

                {/* Brands */}
                <FilterSection title="Brands">
                  <ChipFilter
                    label=""
                    options={filterOptions.brands}
                    value={localFilters.brands}
                    onChange={(value) => handleFilterChange({ brands: value })}
                    multiSelect={true}
                  />
                </FilterSection>

                {/* Ratings */}
                <FilterSection title="Customer Ratings">
                  <RatingFilter
                    value={localFilters.minRating}
                    onChange={(value) => handleFilterChange({ minRating: value })}
                  />
                </FilterSection>

                {/* Features */}
                <FilterSection title="Features">
                  <ChipFilter
                    label=""
                    options={filterOptions.features}
                    value={localFilters.features}
                    onChange={(value) => handleFilterChange({ features: value })}
                    multiSelect={true}
                  />
                </FilterSection>

                {/* Availability */}
                <FilterSection title="Availability">
                  <div className="space-y-3">
                    {[
                      { value: 'all', label: 'All Products' },
                      { value: 'inStock', label: 'In Stock' },
                      { value: 'outOfStock', label: 'Out of Stock' }
                    ].map((option) => (
                      <motion.label
                        key={option.value}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                        whileHover={{ x: 4 }}
                      >
                        <input
                          type="radio"
                          name="availability"
                          value={option.value}
                          checked={localFilters.inStock === option.value}
                          onChange={(e) => handleFilterChange({ inStock: e.target.value })}
                          className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          {option.label}
                        </span>
                      </motion.label>
                    ))}
                  </div>
                </FilterSection>
              </div>
            </motion.div>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Results Info and Sort */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-2 shadow-sm">
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                      {isLoading ? (
                        <span className="flex items-center space-x-2">
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full"
                          />
                          <span>Loading...</span>
                        </span>
                      ) : (
                        `${pagination.totalCount} products found`
                      )}
                    </p>
                  </div>
                  
                  {/* Active Filters Display */}
                  {activeFilterCount > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-wrap gap-2"
                    >
                      {localFilters.categories.map(category => (
                        <motion.span
                          key={category}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1"
                        >
                          <span>{filterOptions.categories.find(c => c.value === category)?.label}</span>
                          <button
                            onClick={() => handleFilterChange({
                              categories: localFilters.categories.filter(c => c !== category)
                            })}
                            className="hover:text-primary-600"
                          >
                            ×
                          </button>
                        </motion.span>
                      ))}
                    </motion.div>
                  )}
                </div>
                
                {/* Sort Options */}
                <div className="flex items-center space-x-4">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm px-4 py-2">
                    <select
                      value={`${filters.sortBy}-${filters.sortOrder}`}
                      onChange={(e) => {
                        const [sortBy, sortOrder] = e.target.value.split('-');
                        handleFilterChange({ sortBy, sortOrder });
                      }}
                      className="bg-transparent border-0 focus:ring-0 text-gray-900 dark:text-white font-medium cursor-pointer"
                    >
                      <option value="name-asc">Name: A-Z</option>
                      <option value="name-desc">Name: Z-A</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="createdAt-desc">Newest First</option>
                      <option value="createdAt-asc">Oldest First</option>
                      <option value="rating-desc">Highest Rated</option>
                    </select>
                  </div>
                </div>
              </motion.div>

              {/* Products Grid */}
              {isLoading ? (
                <ProductGridSkeleton count={filters.limit} />
              ) : (
                <motion.div
                  variants={staggerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  <AnimatePresence>
                    {safeProducts.map((product) => (
                      <motion.div 
                        key={product.id} 
                        variants={itemVariants}
                        layout
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* Empty State */}
              {!isLoading && safeProducts.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="text-8xl mb-6"
                  >
                    🛍️
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    No products found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-lg mb-6 max-w-md mx-auto">
                    We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Reset All Filters
                  </button>
                </motion.div>
              )}

              {/* Pagination */}
              {!isLoading && pagination.totalPages > 1 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12"
                >
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-x-1 w-full sm:w-auto"
                  >
                    <span>←</span>
                    <span>Previous</span>
                  </button>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg px-6 py-3 w-full sm:w-auto text-center">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      Page <span className="text-primary-600 dark:text-primary-400">{pagination.currentPage}</span> of {pagination.totalPages}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-lg transition-all duration-300 transform hover:translate-x-1 w-full sm:w-auto"
                  >
                    <span>Next</span>
                    <span>→</span>
                  </button>
                </motion.div>
              )}

            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default Shop;