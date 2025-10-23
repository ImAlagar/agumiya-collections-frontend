import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { useCart } from '../../../contexts/CartContext';
import { FiHeart, FiShoppingCart, FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { productService } from '../../../services/api/productService';

const EnhancedSimilarProducts = ({ 
  products, 
  title = "You May Also Like",
  maxDisplay = 4,
  showViewAll = true 
}) => {
  const navigate = useNavigate();
  const { formatPrice, userCurrency } = useCurrency();
  const { addToCart } = useCart();
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productsWithReviews, setProductsWithReviews] = useState([]);
  const [addingToCart, setAddingToCart] = useState({});
  const [currentScroll, setCurrentScroll] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef(null);

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

  // Check scroll position
  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Scroll functions for mobile
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = 280; // Match mobile card width
      const scrollAmount = cardWidth;
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = 280; // Match mobile card width
      const scrollAmount = cardWidth;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Handle scroll events
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setCurrentScroll(scrollContainerRef.current.scrollLeft);
      updateScrollButtons();
    }
  };

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
    if (totalReviews === 0) return 'No reviews';
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
        variantId: 'default',
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
      <section className="mt-8 sm:mt-16 px-4">
        <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          {title}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-300 dark:bg-gray-700 h-40 sm:h-48 rounded-lg mb-3"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8 sm:mt-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-6"
      >
        <h2 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Discover more amazing products that match your style
        </p>
      </motion.div>

      {/* Desktop Grid View */}
      <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {displayProducts.map((product, index) => (
            <ProductCard 
              key={product.id}
              product={product}
              index={index}
              hoveredProduct={hoveredProduct}
              setHoveredProduct={setHoveredProduct}
              addingToCart={addingToCart}
              handleAddToCart={handleAddToCart}
              renderDynamicStars={renderDynamicStars}
              getReviewCountText={getReviewCountText}
              formatPrice={formatPrice}
              navigate={navigate}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Mobile Horizontal Scroll View */}
      <div className="sm:hidden relative">
        {/* Scroll Container */}
        <div className="relative">
          {/* Scroll Buttons - Only show when needed */}
          {canScrollLeft && (
            <button
              onClick={scrollLeft}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-all backdrop-blur-sm"
            >
              <FiChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          )}
          
          {canScrollRight && (
            <button
              onClick={scrollRight}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-all backdrop-blur-sm"
            >
              <FiChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          )}

          {/* Horizontal Scroll Container */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto scrollbar-hide space-x-4 pb-4 -mx-2 px-2 snap-x snap-mandatory"
            style={{ scrollBehavior: 'smooth' }}
            onScroll={handleScroll}
          >
            {displayProducts.map((product, index) => (
              <div 
                key={product.id}
                className="flex-shrink-0 w-[280px] snap-start" // Optimal mobile card width
              >
                <ProductCard 
                  product={product}
                  index={index}
                  hoveredProduct={hoveredProduct}
                  setHoveredProduct={setHoveredProduct}
                  addingToCart={addingToCart}
                  handleAddToCart={handleAddToCart}
                  renderDynamicStars={renderDynamicStars}
                  getReviewCountText={getReviewCountText}
                  formatPrice={formatPrice}
                  navigate={navigate}
                  isMobile={true}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicators */}
        {displayProducts.length > 1 && (
          <div className="flex justify-center mt-4 space-x-1.5">
            {displayProducts.map((_, index) => {
              const cardWidth = 280;
              const gap = 16;
              const totalWidth = cardWidth + gap;
              const isActive = Math.floor(currentScroll / totalWidth) === index;
              
              return (
                <button
                  key={index}
                  onClick={() => {
                    if (scrollContainerRef.current) {
                      scrollContainerRef.current.scrollTo({
                        left: index * totalWidth,
                        behavior: 'smooth'
                      });
                    }
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    isActive 
                      ? 'bg-blue-600 w-6' 
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                  }`}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* View More Section */}
      {showViewAll && products.length > maxDisplay && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8 sm:mt-12"
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 sm:p-8">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
              Discover More Products
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
              Explore our complete collection of premium products
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
            >
              Browse All Products
            </button>
          </div>
        </motion.div>
      )}
    </section>
  );
};

// Optimized Mobile Product Card Component
const ProductCard = ({ 
  product, 
  index, 
  hoveredProduct, 
  setHoveredProduct, 
  addingToCart, 
  handleAddToCart, 
  renderDynamicStars, 
  getReviewCountText, 
  formatPrice, 
  navigate,
  isMobile = false 
}) => {
  const { formatted: productFormattedPrice } = formatPrice(product.price);
  const productRating = product.reviewStats?.averageRating || 0;
  const reviewCount = product.reviewStats?.totalReviews || 0;
  const isAddingToCart = addingToCart[product.id];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="relative group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden h-full flex flex-col"
      onMouseEnter={() => !isMobile && setHoveredProduct(product.id)}
      onMouseLeave={() => !isMobile && setHoveredProduct(null)}
    >
      {/* Product Image */}
      <div className="relative overflow-hidden flex-shrink-0">
        <img
          src={product.images?.[0] || '/api/placeholder/400/400'}
          alt={product.name}
          className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Stock Badge */}
        <div className="absolute top-2 left-2">
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
          <div className="absolute top-2 right-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-full">
              {renderDynamicStars(productRating, 'sm')}
            </div>
          </div>
        )}

        {/* Quick Add to Cart for Mobile */}
        {isMobile && (
          <button 
            onClick={() => handleAddToCart(product)}
            disabled={!product.inStock || isAddingToCart}
            className={`absolute bottom-2 right-2 p-2 rounded-full shadow-lg transition-all ${
              !product.inStock 
                ? 'bg-gray-400 cursor-not-allowed' 
                : isAddingToCart
                ? 'bg-blue-400 cursor-wait'
                : 'bg-white hover:bg-gray-100 cursor-pointer active:scale-95'
            }`}
          >
            <FiShoppingCart className={`w-4 h-4 ${
              !product.inStock ? 'text-gray-200' : 
              isAddingToCart ? 'text-white' : 'text-gray-600'
            }`} />
          </button>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3 flex-1 flex flex-col">
        {/* Category */}
        <div className="mb-1">
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium uppercase tracking-wide">
            {product.category}
          </span>
        </div>
        
        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 text-sm leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-1">
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="mb-3">
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

        {/* Price and Actions */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <p className="text-base font-bold text-blue-600 dark:text-blue-400">
              {productFormattedPrice}
            </p>
            {product.originalPrice > product.price && (
              <p className="text-xs text-gray-500 line-through">
                {formatPrice(product.originalPrice).formatted}
              </p>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            {!isMobile && (
              <button
                onClick={() => handleAddToCart(product)}
                disabled={!product.inStock || isAddingToCart}
                className={`p-2 rounded-lg text-sm font-medium transition-all ${
                  !product.inStock
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : isAddingToCart
                    ? 'bg-blue-400 text-white cursor-wait'
                    : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'
                }`}
              >
                {isAddingToCart ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FiShoppingCart className="w-4 h-4" />
                )}
              </button>
            )}
            
            <button
              onClick={() => navigate(`/products/${product.id}`)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors active:scale-95"
            >
              View
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedSimilarProducts;