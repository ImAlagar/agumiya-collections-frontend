// src/components/products/ProductCard.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCurrency } from '../../../contexts/CurrencyContext';

const ProductCard = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { 
    formatPrice, 
    formatPriceRounded, 
    userCurrency, 
    getCurrencySymbol 
  } = useCurrency();
  const firstImage = product.images?.[0];
  
  // ✅ FIXED: Always use base product price for consistency
  const basePrice = product.price;
  const hasVariants = product.printifyVariants && product.printifyVariants.length > 0;

  // ✅ FIXED: Extract formatted prices properly
  const getFormattedPrice = (price) => {
    if (formatPriceRounded) {
      return formatPriceRounded(price, userCurrency);
    } else {
      const result = formatPrice(price, userCurrency);
      // Handle both object and string returns
      return typeof result === 'object' ? result.formatted : result;
    }
  };

  // ✅ FIXED: Always use base product price for consistency
  const formattedPrice = getFormattedPrice(basePrice);
  const originalFormattedPrice = product.originalPrice ? getFormattedPrice(product.originalPrice) : null;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    hover: {
      y: -8,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="group h-full"
    >
      <Link 
        to={`/products/${product.id}`} 
        className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700"
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 overflow-hidden">
          {firstImage && !imageError ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-600 animate-pulse" />
              )}
              <motion.img
                src={firstImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-3xl mb-2">🛍️</div>
                <p className="text-sm font-medium">Image Coming Soon</p>
              </div>
            </div>
          )}

          {/* Overlay with View Details */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-500 flex items-end justify-start p-4">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="text-white bg-black bg-opacity-70 px-3 py-2 rounded-lg text-sm font-medium backdrop-blur-sm"
            >
              View Details →
            </motion.span>
          </div>

          {/* Stock Status Badge */}
          <div className="absolute top-3 right-3">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
              product.inStock 
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-red-500 text-white shadow-md'
            }`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {/* Category Tag */}
          {product.category && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-md">
                {product.category}
              </span>
            </div>
          )}

          {/* Currency Badge */}
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500 text-white shadow-md">
              {userCurrency} {getCurrencySymbol()}
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-5 flex flex-col flex-grow">
          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 text-lg leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
            {product.name}
          </h3>

          {/* ✅ FIXED: Consistent Price Section - Only Base Price */}
          <div className="mb-3 min-h-[60px]">
            <div className="flex items-baseline justify-between mb-2">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formattedPrice}
                </span>
                
                {/* Show original price if on sale */}
                {product.originalPrice && product.originalPrice > basePrice && (
                  <span className="text-lg text-gray-500 line-through">
                    {originalFormattedPrice}
                  </span>
                )}
              </div>
              
              {/* Rating if available */}
              {product.rating && (
                <div className="flex items-center space-x-1 bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded-lg">
                  <span className="text-yellow-500 text-sm">⭐</span>
                  <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">
                    {product.rating}
                  </span>
                </div>
              )}
            </div>

            {/* ✅ FIXED: Show variant count without price variation mention */}
            {hasVariants && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {product.printifyVariants.length} options available
              </p>
            )}
          </div>

          {/* Variants Info - Without Price References */}
          {hasVariants && (
            <div className="mb-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  Choose options
                </span>
                <span className="text-primary-600 dark:text-primary-400 font-semibold flex items-center">
                  Select <span className="ml-1">→</span>
                </span>
              </div>
            </div>
          )}

          {/* Features/Highlights (bottom stick) */}
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {product.inStock && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-medium">
                ✓ Fast Shipping
              </span>
            )}
            {product.isPremium && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium">
                ✨ Premium
              </span>
            )}
            {hasVariants && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">
                🔄 Multiple Options
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;