// src/pages/Shop.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerVariants, itemVariants, useProducts } from '../../contexts/ProductsContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { SEO } from '../../contexts/SEOContext';
import ProductGridSkeleton from '../../components/user/skeletons/ProductGridSkeleton';
import ProductCard from '../../components/user/products/ProductCard';
import CurrencySelector from '../../components/common/CurrencySelector';
import { productService } from '../../services/api/productService';

// Import Filter Components
import FilterSection from '../../components/filters/FilterSection';
import DualRangeSlider from '../../components/filters/DualRangeSlider';
import ChipFilter from '../../components/filters/ChipFilter';

// ✅ Filter Types
const AVAILABILITY_OPTIONS = [
  { value: 'all', label: 'All Products' },
  { value: 'true', label: 'In Stock' },
  { value: 'false', label: 'Out of Stock' }
];

// ✅ MAIN COMPONENT - MOBILE RESPONSIVE VERSION
const Shop = () => {
  const { products, isLoading, error, filters, pagination, fetchProducts, updateFilters, clearError } = useProducts();
  const { convertPrice, userCurrency, getCurrencySymbol, formatPrice } = useCurrency();

  // Filter state - synchronized with context
  const [localFilters, setLocalFilters] = useState({
    categories: [],
    minPrice: null,
    maxPrice: null,
    inStock: 'all',
    limit: 12,
    page: 1
  });

  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    priceRange: { min: 0, max: 1000 }
  });

  const [activeFilters, setActiveFilters] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  // ✅ Fetch filter options from backend
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await productService.getProductFilters();
        if (res.success && res.data) {
          const { categories, priceRange } = res.data;
          console.log('📊 Filter options loaded:', { categories, priceRange });
          
          setFilterOptions({
            categories: categories || [],
            priceRange: priceRange || { min: 0, max: 1000 }
          });

          // Initialize local filters with actual price range from API
          setLocalFilters(prev => ({
            ...prev,
            minPrice: priceRange?.min || 0,
            maxPrice: priceRange?.max || 1000
          }));
        }
      } catch (error) {
        console.error('❌ Failed to load filters:', error);
      }
    };
    fetchFilters();
  }, []);

  // ✅ Sync with context filters and fetch products when filters change
  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      setLocalFilters(prev => ({ ...prev, ...filters }));
    }
  }, [filters]);

  // ✅ Calculate active filters count
  useEffect(() => {
    const active = [];
    
    if (localFilters.categories?.length > 0) {
      active.push('categories');
    }
    
    if (localFilters.minPrice !== null && localFilters.minPrice !== filterOptions.priceRange.min) {
      active.push('minPrice');
    }
    
    if (localFilters.maxPrice !== null && localFilters.maxPrice !== filterOptions.priceRange.max) {
      active.push('maxPrice');
    }
    
    if (localFilters.inStock !== 'all') {
      active.push('availability');
    }

    setActiveFilters(active);
  }, [localFilters, filterOptions]);

  // ✅ Fetch products when filters change - DEBOUNCED
  useEffect(() => {
    setIsFiltering(true);
    const timeoutId = setTimeout(() => {
      console.log('🔄 Fetching products with filters:', localFilters);
      fetchProducts(1, localFilters);
      setIsFiltering(false);
    }, 500); // Debounce to avoid too many API calls
    
    return () => {
      clearTimeout(timeoutId);
      setIsFiltering(false);
    };
  }, [localFilters.categories, localFilters.minPrice, localFilters.maxPrice, localFilters.inStock, localFilters.limit]);

  // ✅ Handle filter change - UPDATED with auto-close
  const handleFilterChange = useCallback((newFilters) => {
    const updated = { ...localFilters, ...newFilters, page: 1 };
    setLocalFilters(updated);
    
    // Auto-close mobile sidebar on any filter change
    if (mobileFiltersOpen) {
      setMobileFiltersOpen(false);
    }
  }, [localFilters, mobileFiltersOpen]);

  // ✅ Individual filter handlers - UPDATED to close mobile sidebar
  const handleCategoryChange = useCallback((categories) => {
    console.log('🎯 Category changed:', categories);
    handleFilterChange({ categories });
  }, [handleFilterChange]);

  const handlePriceRangeChange = useCallback(([min, max]) => {
    console.log('💰 Price range changed:', { min, max });
    
    // Use raw USD values (no conversion needed since backend expects USD)
    handleFilterChange({ 
      minPrice: min,
      maxPrice: max
    });
  }, [handleFilterChange]);

  const handleAvailabilityChange = useCallback((inStock) => {
    console.log('📦 Availability changed:', inStock);
    handleFilterChange({ inStock });
  }, [handleFilterChange]);

  // ✅ Remove individual filter - UPDATED to close mobile sidebar
  const removeFilter = useCallback((filterType, value = null) => {
    console.log('🗑️ Removing filter:', filterType);
    
    let resetValue;

    switch (filterType) {
      case 'categories':
        resetValue = [];
        break;
      case 'minPrice':
        resetValue = filterOptions.priceRange.min;
        break;
      case 'maxPrice':
        resetValue = filterOptions.priceRange.max;
        break;
      case 'availability':
        resetValue = 'all';
        break;
      default:
        return;
    }

    handleFilterChange({ [filterType]: resetValue });
  }, [handleFilterChange, filterOptions]);

  // ✅ Reset all filters
  const clearAllFilters = useCallback(() => {
    console.log('🧹 Clearing all filters');
    const reset = {
      categories: [],
      minPrice: filterOptions.priceRange.min,
      maxPrice: filterOptions.priceRange.max,
      inStock: 'all',
      limit: 12,
      page: 1
    };
    setLocalFilters(reset);
    setMobileFiltersOpen(false);
  }, [filterOptions]);

  // ✅ Apply filters (for mobile)
  const applyFilters = useCallback(() => {
    setMobileFiltersOpen(false);
  }, []);

  // ✅ Format price for display - CORRECTED VERSION
  const formatPriceForDisplay = useCallback((price) => {
    if (price === null || price === undefined) return 'N/A';
    
    try {
      // Use the formatPrice function from currency context
      const { formatted } = formatPrice(price, userCurrency);
      return formatted;
    } catch (error) {
      console.warn('Price formatting failed, using fallback:', error);
      // Fallback formatting
      const convertedPrice = convertPrice(price, 'USD', userCurrency);
      return `${getCurrencySymbol()}${convertedPrice.toFixed(2)}`;
    }
  }, [formatPrice, convertPrice, userCurrency, getCurrencySymbol]);

  // ✅ Handle pagination
  const handlePageChange = useCallback((page) => {
    handleFilterChange({ page });
  }, [handleFilterChange]);

  // ✅ Get current price values for display - CORRECTED
  const getCurrentPriceValues = useCallback(() => {
    const minPrice = localFilters.minPrice !== null ? localFilters.minPrice : filterOptions.priceRange.min;
    const maxPrice = localFilters.maxPrice !== null ? localFilters.maxPrice : filterOptions.priceRange.max;
    
    return {
      min: minPrice,
      max: maxPrice
    };
  }, [localFilters, filterOptions]);

  const currentPrices = getCurrentPriceValues();
  const safeProducts = Array.isArray(products) ? products : [];
  const safePagination = pagination || { 
    currentPage: 1, 
    totalPages: 1, 
    totalCount: 0, 
    hasPrev: false, 
    hasNext: false 
  };

  // ✅ Mobile Filters Overlay Component
  const MobileFiltersOverlay = () => (
    <AnimatePresence>
      {mobileFiltersOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileFiltersOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          />
          
          {/* Filters Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-gray-900 shadow-2xl z-50 lg:hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Filters Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Price Range */}
              <FilterSection 
                title="Price Range" 
                badgeCount={activeFilters.includes('minPrice') || activeFilters.includes('maxPrice') ? 1 : 0}
                defaultOpen={true}
              >
                <DualRangeSlider
                  minValue={currentPrices.min}
                  maxValue={currentPrices.max}
                  onMinChange={(min) => handlePriceRangeChange([min, currentPrices.max])}
                  onMaxChange={(max) => handlePriceRangeChange([currentPrices.min, max])}
                  onBothChange={(min, max) => handlePriceRangeChange([min, max])}
                  absoluteMin={filterOptions.priceRange.min}
                  absoluteMax={filterOptions.priceRange.max}
                  step={1}
                  format={formatPriceForDisplay}
                />
              </FilterSection>

              {/* Categories */}
              {filterOptions.categories.length > 0 && (
                <FilterSection 
                  title="Categories" 
                  badgeCount={localFilters.categories?.length || 0}
                  defaultOpen={true}
                >
                  <ChipFilter
                    options={filterOptions.categories}
                    value={localFilters.categories[0] || ''}
                    onChange={(value) => handleCategoryChange([value])}
                    multiSelect={false}
                    showCounts={true}
                    maxVisible={10}
                  />
                </FilterSection>
              )}

              {/* Availability */}
              <FilterSection 
                title="Availability" 
                badgeCount={localFilters.inStock !== 'all' ? 1 : 0}
                defaultOpen={true}
              >
                <ChipFilter
                  options={AVAILABILITY_OPTIONS}
                  value={localFilters.inStock}
                  onChange={(value) => handleAvailabilityChange(value)}
                  multiSelect={false}
                  showCounts={false}
                />
              </FilterSection>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <button
                onClick={applyFilters}
                className="w-full py-3 bg-primary-600 text-white rounded-2xl font-semibold hover:bg-primary-700 transition-colors shadow-lg"
              >
                View Results
                {activeFilters.length > 0 && (
                  <span className="ml-2 bg-white text-primary-600 text-xs px-2 py-1 rounded-full">
                    {activeFilters.length}
                  </span>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // ✅ Active filters display - CORRECTED
  const renderActiveFilters = () => {
    if (activeFilters.length === 0) return null;

    const getFilterLabel = (filterType) => {
      switch (filterType) {
        case 'categories':
          const categoryLabels = localFilters.categories.map(cat => 
            filterOptions.categories.find(opt => opt.value === cat)?.label || cat
          );
          return `Categories: ${categoryLabels.join(', ')}`;
        case 'minPrice':
          return `Min: ${formatPriceForDisplay(localFilters.minPrice)}`;
        case 'maxPrice':
          return `Max: ${formatPriceForDisplay(localFilters.maxPrice)}`;
        case 'availability':
          const option = AVAILABILITY_OPTIONS.find(opt => opt.value === localFilters.inStock);
          return `Availability: ${option?.label || 'All'}`;
        default:
          return filterType;
      }
    };

    return (
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          Active filters:
        </span>
        {activeFilters.map(filter => (
          <motion.button
            key={filter}
            onClick={() => removeFilter(filter)}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-800/50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {getFilterLabel(filter)}
            <span className="text-xs ml-1">×</span>
          </motion.button>
        ))}
        <button
          onClick={clearAllFilters}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium underline ml-2"
        >
          Clear all
        </button>
      </div>
    );
  };

  return (
    <>
      <SEO 
        title="Shop All Products | ShopStyle"
        description="Browse our complete collection of products with smart filters and categories."
        keywords="shop, products, filters, categories, ecommerce"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-4 sm:py-8">
        <div className="px-3 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 truncate">
                Shop All Products
              </h1>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 truncate">
                Discover our curated collection of premium products
              </p>
            </div>
            
            <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
              <div className="hidden sm:block">
                <CurrencySelector />
              </div>
                            {/* Mobile Currency Selector */}
              <div className="sm:hidden">
                <CurrencySelector mobile />
              </div>
              
              {/* Mobile Filter Button */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="flex lg:hidden items-center gap-2 px-3 sm:px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl sm:rounded-2xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
              >
                <svg className=" w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                <span className="hidden xs:inline">Filters</span>
                {activeFilters.length > 0 && (
                  <span className="bg-primary-500 text-white text-xs px-1.5 sm:px-2 py-0.5 rounded-full min-w-[20px] text-center">
                    {activeFilters.length}
                  </span>
                )}
              </button>


            </div>
          </div>

          {/* Loading Indicator */}
          {isFiltering && (
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <span className="text-sm text-blue-600 dark:text-blue-400 ml-1">Updating results...</span>
              </div>
            </div>
          )}

          {/* Active Filters */}
          {renderActiveFilters()}

          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* 🧩 Desktop Sidebar Filters */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="hidden lg:block lg:w-80 space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Filters</h2>
                <button 
                  onClick={clearAllFilters}
                  className="text-sm text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-6">
                {/* Price Range - CORRECTED */}
                <FilterSection 
                  title="Price Range" 
                  badgeCount={activeFilters.includes('minPrice') || activeFilters.includes('maxPrice') ? 1 : 0}
                >
                  <DualRangeSlider
                    minValue={currentPrices.min}
                    maxValue={currentPrices.max}
                    onMinChange={(min) => handlePriceRangeChange([min, currentPrices.max])}
                    onMaxChange={(max) => handlePriceRangeChange([currentPrices.min, max])}
                    onBothChange={(min, max) => handlePriceRangeChange([min, max])}
                    absoluteMin={filterOptions.priceRange.min}
                    absoluteMax={filterOptions.priceRange.max}
                    step={1}
                    format={formatPriceForDisplay}
                  />
                </FilterSection>

                {/* Categories - CORRECTED */}
                {filterOptions.categories.length > 0 && (
                  <FilterSection 
                    title="Categories" 
                    badgeCount={localFilters.categories?.length || 0}
                  >
                    <ChipFilter
                      options={filterOptions.categories}
                      value={localFilters.categories[0] || ''}
                      onChange={(value) => handleCategoryChange([value])}
                      multiSelect={false}
                      showCounts={true}
                      maxVisible={10}
                    />
                  </FilterSection>
                )}

                {/* Availability - CORRECTED */}
                <FilterSection 
                  title="Availability" 
                  badgeCount={localFilters.inStock !== 'all' ? 1 : 0}
                >
                  <ChipFilter
                    options={AVAILABILITY_OPTIONS}
                    value={localFilters.inStock}
                    onChange={handleAvailabilityChange}
                    multiSelect={false}
                    showCounts={false}
                  />
                </FilterSection>
              </div>
            </motion.div>

            {/* 🧩 Product Grid Section */}
            <div className="flex-1 min-w-0">
              {/* Results Info Bar */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-6 p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-gray-600 dark:text-gray-400 font-medium text-sm sm:text-base truncate">
                    {isLoading ? (
                      "Loading products..."
                    ) : (
                      `Showing ${safeProducts.length} of ${safePagination.totalCount} products`
                    )}
                  </p>
                  {activeFilters.length > 0 && (
                    <p className="text-xs sm:text-sm text-primary-600 dark:text-primary-400 mt-1">
                      {activeFilters.length} active filter{activeFilters.length !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                  <select
                    value={localFilters.limit}
                    onChange={(e) => handleFilterChange({ limit: Number(e.target.value) })}
                    className="px-3 sm:px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl sm:rounded-2xl text-sm text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value={12}>12/page</option>
                    <option value={24}>24/page</option>
                    <option value={48}>48/page</option>
                  </select>
                </div>
              </div>

              {/* Product Grid */}
              {isLoading ? (
                <ProductGridSkeleton count={localFilters.limit} />
              ) : safeProducts.length > 0 ? (
                <motion.div
                  variants={staggerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6"
                >
                  {safeProducts.map((product) => (
                    <motion.div key={product.id} variants={itemVariants}>
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8 sm:py-16 px-4"
                >
                  <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 text-gray-300 dark:text-gray-600">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto text-sm sm:text-base">
                    Try adjusting your filters or search terms to find what you're looking for.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="px-6 py-3 bg-primary-600 text-white rounded-xl sm:rounded-2xl font-medium hover:bg-primary-700 transition-colors text-sm sm:text-base"
                  >
                    Clear All Filters
                  </button>
                </motion.div>
              )}

              {/* Pagination */}
              {!isLoading && safePagination.totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-8 sm:mt-12"
                >
                  <button
                    disabled={!safePagination.hasPrev}
                    onClick={() => handlePageChange(safePagination.currentPage - 1)}
                    className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl sm:rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-sm sm:text-base w-full sm:w-auto justify-center"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>
                  
                  <div className="flex items-center gap-1 sm:gap-2 order-first sm:order-none">
                    {Array.from({ length: safePagination.totalPages }, (_, i) => i + 1)
                      .filter(page => 
                        page === 1 || 
                        page === safePagination.totalPages || 
                        Math.abs(page - safePagination.currentPage) <= 1
                      )
                      .map((page, index, array) => {
                        const showEllipsis = index < array.length - 1 && array[index + 1] - page > 1;
                        
                        return (
                          <React.Fragment key={page}>
                            <button
                              onClick={() => handlePageChange(page)}
                              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl font-medium transition-colors text-xs sm:text-sm ${
                                page === safePagination.currentPage
                                  ? 'bg-primary-600 text-white shadow-lg'
                                  : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                              }`}
                            >
                              {page}
                            </button>
                            {showEllipsis && (
                              <span className="px-1 sm:px-2 text-gray-500 text-xs sm:text-sm">...</span>
                            )}
                          </React.Fragment>
                        );
                      })}
                  </div>
                  
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mx-2 sm:mx-4 text-center order-last sm:order-none">
                    Page {safePagination.currentPage} of {safePagination.totalPages}
                  </span>
                  
                  <button
                    disabled={!safePagination.hasNext}
                    onClick={() => handlePageChange(safePagination.currentPage + 1)}
                    className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl sm:rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-sm sm:text-base w-full sm:w-auto justify-center"
                  >
                    Next
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filters Overlay */}
        <MobileFiltersOverlay />
      </div>
    </>
  );
};

export default Shop;