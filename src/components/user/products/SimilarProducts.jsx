import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCurrency } from '../../../contexts/CurrencyContext';

const SimilarProducts = ({ products, title = "You May Also Like" }) => {
  const navigate = useNavigate();
  const { formatPrice, userCurrency } = useCurrency();

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 sm:mt-16">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-5 sm:mb-8 text-center"
      >
        {title}
      </motion.h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.slice(0, 4).map((product, index) => {
          const { formatted: productFormattedPrice } = formatPrice(product.price, userCurrency);
          
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => navigate(`/shop/products/${product.id}`)}
              className="cursor-pointer group"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg p-3 sm:p-4 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600">
                {/* Product Image */}
                <div className="relative overflow-hidden rounded-lg mb-3 sm:mb-4">
                  <img
                    src={product.images?.[0] || '/api/placeholder/300/300'}
                    alt={product.name}
                    className="w-full h-40 sm:h-48 object-cover rounded-lg group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg" />
                  
                  {/* Quick View Badge */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      View
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 text-sm sm:text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-blue-600 dark:text-blue-400 font-bold text-sm sm:text-lg">
                      {productFormattedPrice}
                    </p>
                    
                    {/* Stock Status */}
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      product.inStock 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>

                  {/* Category Badge */}
                  {product.category && (
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700">
                      <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {product.category}
                      </span>
                      <div className="flex items-center space-x-1 text-yellow-500">
                        <span className="text-xs">★</span>
                        <span className="text-xs text-gray-500">4.5</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* View More Button */}
      {products.length > 4 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center mt-8"
        >
          <button
            onClick={() => navigate('/shop')}
            className="px-6 py-3 border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 rounded-lg hover:bg-blue-600 hover:text-white dark:hover:bg-blue-400 dark:hover:text-white transition-all duration-300 font-medium"
          >
            View All Products
          </button>
        </motion.div>
      )}
    </section>
  );
};

export default SimilarProducts;