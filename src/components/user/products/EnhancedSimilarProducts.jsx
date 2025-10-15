import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { useCart } from '../../../contexts/CartContext'; // Import cart context
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';
import { productService } from '../../../services/api/productService'; // Import product service for reviews

const EnhancedSimilarProducts = ({ 
  products, 
  title = "You May Also Like",
  maxDisplay = 4,
  showViewAll = true 
}) => {
  const navigate = useNavigate();
  const { formatPrice, userCurrency } = useCurrency();
  const { addToCart } = useCart(); // Get addToCart function from cart context
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productsWithReviews, setProductsWithReviews] = useState([]);
  const [addingToCart, setAddingToCart] = useState({}); // Track loading state for each product

  // Fetch review data for products
  useEffect(() => {
    const fetchProductReviews = async () => {
      if (!products || products.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const productsWithReviewData = await Promise.all(
          products.map(async (product) => {
            try {
              // Fetch review stats for each product
              const reviewResponse = await productService.getProductReviewStats(product.id);
              return {
                ...product,
                reviewStats: reviewResponse.data || {
                  averageRating: 0,
                  totalReviews: 0,
                  ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
                }
              };
            } catch (error) {
              console.error(`Error fetching reviews for product ${product.id}:`, error);
              return {
                ...product,
                reviewStats: {
                  averageRating: 0,
                  totalReviews: 0,
                  ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
                }
              };
            }
          })
        );

        setProductsWithReviews(productsWithReviewData);
      } catch (error) {
        console.error('Error fetching product reviews:', error);
        // Fallback to original products without review data
        setProductsWithReviews(products.map(product => ({
          ...product,
          reviewStats: {
            averageRating: 0,
            totalReviews: 0,
            ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
          }
        })));
      } finally {
        setLoading(false);
      }
    };

    fetchProductReviews();
  }, [products]);

  // Dynamic rating display function
  const renderDynamicStars = (rating, size = 'sm') => {
    const sizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5'
    };

    const numericRating = typeof rating === 'number' ? rating : 0;
    const displayRating = numericRating > 0 ? numericRating.toFixed(1) : '0.0';

    return (
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <FiStar
              key={star}
              className={`${sizeClasses[size]} ${
                star <= Math.floor(numericRating)
                  ? 'text-yellow-400 fill-current'
                  : star <= numericRating
                  ? 'text-yellow-400 fill-current opacity-70'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className={`text-xs font-medium ml-1 ${
          numericRating > 0 ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'
        }`}>
          {displayRating}
        </span>
      </div>
    );
  };

  // Dynamic review count text
  const getReviewCountText = (reviewStats) => {
    const totalReviews = reviewStats?.totalReviews || 0;
    if (totalReviews === 0) return 'No reviews yet';
    if (totalReviews === 1) return '1 review';
    return `${totalReviews} reviews`;
  };

  // Handle add to cart
  const handleAddToCart = async (product) => {
    setAddingToCart(prev => ({ ...prev, [product.id]: true }));
    
    try {
      const cartProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '/api/placeholder/400/400',
        quantity: 1,
        variantId: 'default', // You can modify this if you have variants
        category: product.category,
        inStock: product.inStock
      };
      
      addToCart(cartProduct);
      
      
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(prev => ({ ...prev, [product.id]: false }));
    }
  };

  if (!products || products.length === 0) {
    return null;
  }

  const displayProducts = productsWithReviews.slice(0, maxDisplay);

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
            const productRating = product.reviewStats?.averageRating || 0;
            const reviewCount = product.reviewStats?.totalReviews || 0;
            const isAddingToCart = addingToCart[product.id];
            
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
                      <button 
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.inStock || isAddingToCart}
                        className={`p-2 rounded-full shadow-lg transition-colors ${
                          !product.inStock 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : isAddingToCart
                            ? 'bg-blue-400 cursor-wait'
                            : 'bg-white hover:bg-gray-100 cursor-pointer'
                        }`}
                      >
                        <FiShoppingCart className={`w-4 h-4 ${
                          !product.inStock ? 'text-gray-200' : 
                          isAddingToCart ? 'text-white' : 'text-gray-600'
                        }`} />
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

                    {/* Rating Badge */}
                    {productRating > 0 && (
                      <div className="absolute bottom-3 left-3">
                        <div className="flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-full">
                          {renderDynamicStars(productRating, 'sm')}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="mb-2">
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-medium uppercase tracking-wide">
                        {product.category}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold truncate text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {product.name}
                    </h3>
                    
                    {/* Dynamic Rating */}
                    <div className="flex items-center justify-between mb-3">
                      {productRating > 0 ? (
                        <div className="flex flex-col gap-1">
                          {renderDynamicStars(productRating)}
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {getReviewCountText(product.reviewStats)}
                          </span>
                        </div>
                      ) : (
                        <div className="text-left">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            No reviews yet
                          </span>
                        </div>
                      )}
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
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={!product.inStock || isAddingToCart}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            !product.inStock
                              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                              : isAddingToCart
                              ? 'bg-blue-400 text-white cursor-wait'
                              : 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105'
                          }`}
                        >
                          {isAddingToCart ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <FiShoppingCart className="w-4 h-4" />
                          )}
                        </button>
                        
                        <button
                          onClick={() => navigate(`/products/${product.id}`)}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors transform group-hover:scale-105"
                        >
                          View
                        </button>
                      </div>
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