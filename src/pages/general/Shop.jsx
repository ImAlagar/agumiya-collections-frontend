// src/pages/Shop.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerVariants, itemVariants, useProducts } from '../../contexts/ProductsContext';
import { SEO } from '../../contexts/SEOContext';
import ProductFilters from '../../components/user/products/ProductFilters';
import ProductGridSkeleton from '../../components/user/skeletons/ProductGridSkeleton';
import ProductCard from '../../components/user/products/ProductCard';
import CurrencySelector from '../../components/common/CurrencySelector';

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

  const [localFilters, setLocalFilters] = useState(filters);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Safe products array - always ensure it's an array
  const safeProducts = Array.isArray(products) ? products : [];

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = useCallback((newFilters) => {
    updateFilters(newFilters);
  }, [updateFilters]);

  const handlePageChange = useCallback((newPage) => {
    fetchProducts(newPage);
  }, [fetchProducts]);

  // Generate structured data for SEO - with safe products array
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

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 flex items-center justify-between group hover:shadow-xl transition-all duration-300"
            >
              <span className="font-semibold text-gray-900 dark:text-white">Filters & Sort</span>
              <motion.div
                animate={{ rotate: isFilterOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center group-hover:bg-primary-200 dark:group-hover:bg-primary-800 transition-colors"
              >
                <span className="text-primary-600 dark:text-primary-400">↓</span>
              </motion.div>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <motion.div 
              initial={false}
              animate={{ 
                height: isFilterOpen ? 'auto' : 'auto',
                opacity: 1 
              }}
              className={`lg:w-80 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}
            >
              <ProductFilters
                filters={localFilters}
                onFilterChange={handleFilterChange}
              />
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
                </div>
                
                {/* Sort Options and Currency Selector */}
                <div className="flex items-center space-x-4">
                  <CurrencySelector />
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
                    </select>
                  </div>
                </div>
              </motion.div>

              {/* Products Grid - 3 columns */}
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
                    onClick={() => handleFilterChange({
                      search: '',
                      category: 'All',
                      inStock: 'all',
                      sortBy: 'name',
                      sortOrder: 'asc',
                      limit: 10
                    })}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Reset Filters
                  </button>
                </motion.div>
              )}

              {/* Pagination */}
              {!isLoading && pagination.totalPages > 1 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex justify-center items-center space-x-3 mt-12"
                >
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-x-1"
                  >
                    <span>←</span>
                    <span>Previous</span>
                  </button>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg px-6 py-3">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      Page <span className="text-primary-600 dark:text-primary-400">{pagination.currentPage}</span> of {pagination.totalPages}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-lg transition-all duration-300 transform hover:translate-x-1"
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