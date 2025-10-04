import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';

const EnhancedSimilarProducts = ({ 
  products, 
  title = "You May Also Like",
  maxDisplay = 4,
  showViewAll = true 
}) => {
  const navigate = useNavigate();
  const { formatPrice, userCurrency } = useCurrency();
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading state
    if (products) {
      const timer = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [products]);

  if (!products || products.length === 0) {
    return null;
  }

  const displayProducts = products.slice(0, maxDisplay);

  if (loading) {
    return (
      <section className="mt-12 sm:mt-16">
        <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          {title}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-300 dark:bg-gray-700 h-48 rounded-lg mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mt-12 sm:mt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          {title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Discover more amazing products that match your style and preferences
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {displayProducts.map((product, index) => {
            const { formatted: productFormattedPrice } = formatPrice(product.price);
            
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 overflow-hidden">
                  
                  {/* Product Image with Overlay */}
                  <div className="relative overflow-hidden">
                    <img
                      src={product.images?.[0] || '/api/placeholder/400/400'}
                      alt={product.name}
                      className="w-full h-60 object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Overlay with Actions */}
                    <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${
                      hoveredProduct === product.id ? 'bg-opacity-20' : 'bg-opacity-0'
                    }`} />
                    
                    {/* Quick Actions */}
                    <div className={`absolute top-3 right-3 flex flex-col space-y-2 transition-all duration-300 ${
                      hoveredProduct === product.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                    }`}>
                      <button className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                        <FiHeart className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                        <FiShoppingCart className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    {/* Stock Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        product.inStock 
                          ? 'bg-green-500 text-white' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {product.inStock ? 'In Stock' : 'Sold Out'}
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="mb-2">
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-medium uppercase tracking-wide">
                        {product.category}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {product.name}
                    </h3>
                    
                    {/* Rating */}
                    <div className="flex items-center space-x-1 mb-3">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <FiStar 
                            key={i} 
                            className={`w-3 h-3 ${i < 4 ? 'fill-current' : ''}`} 
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">(42)</span>
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {productFormattedPrice}
                        </p>
                        {product.originalPrice > product.price && (
                          <p className="text-sm text-gray-500 line-through">
                            {formatPrice(product.originalPrice).formatted}
                          </p>
                        )}
                      </div>
                      
                      <button
                        onClick={() => navigate(`/products/${product.id}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors transform group-hover:scale-105"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* View More Section */}
      {showViewAll && products.length > maxDisplay && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Discover More Amazing Products
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Explore our complete collection of premium products tailored just for you
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Browse All Products
            </button>
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default EnhancedSimilarProducts;