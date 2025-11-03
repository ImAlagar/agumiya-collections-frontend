import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight, ChevronLeft, ChevronRight, Heart, Star } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { useNavigate } from 'react-router-dom';
import fallbackcategory from '../../../assets/images/categories/fallback-category.jpg';

const CategorySection = ({ category, products, reviewStats, index }) => {
  const { theme } = useTheme();
  const { formatPrice, getCurrencySymbol } = useCurrency();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 4;

  const totalPages = Math.ceil(products.length / productsPerPage);
  const currentProducts = products.slice(
    currentPage * productsPerPage,
    (currentPage + 1) * productsPerPage
  );

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const renderDynamicStars = (rating, size = 'sm') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    const numericRating = typeof rating === 'number' ? rating : 0;
    const displayRating = numericRating > 0 ? numericRating.toFixed(1) : '0.0';

    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
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
        <span className={`text-sm font-medium ${
          numericRating > 0 ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'
        }`}>
          {displayRating}
        </span>
      </div>
    );
  };

  const getReviewCountText = (stats) => {
    const totalReviews = stats?.totalReviews || 0;
    if (totalReviews === 0) return 'No reviews yet';
    if (totalReviews === 1) return '1 review';
    return `${totalReviews} reviews`;
  };

  const getThemeStyles = () => {
    const baseStyles = {
      light: {
        background: 'bg-gradient-to-br from-white to-gray-50/80',
        text: 'text-gray-900',
        subtitle: 'text-gray-600',
        card: 'bg-white/80 backdrop-blur-sm',
        border: 'border-gray-200',
        overlay: 'bg-gradient-to-br from-black/40 to-black/20'
      },
      dark: {
        background: 'bg-gradient-to-br from-gray-900 to-gray-800/80',
        text: 'text-white',
        subtitle: 'text-gray-300',
        card: 'bg-gray-800/80 backdrop-blur-sm',
        border: 'border-gray-700',
        overlay: 'bg-gradient-to-br from-black/60 to-black/40'
      },
      smokey: {
        background: 'bg-gradient-to-br from-gray-800 to-gray-700/80',
        text: 'text-white',
        subtitle: 'text-gray-300',
        card: 'bg-gray-700/80 backdrop-blur-sm',
        border: 'border-gray-600',
        overlay: 'bg-gradient-to-br from-black/70 to-black/50'
      }
    };

    return baseStyles[theme] || baseStyles.light;
  };

  const styles = getThemeStyles();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.8
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: -20,
      transition: {
        duration: 0.4,
        ease: "easeIn"
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const getCategoryImage = () => {
    const productWithImage = products.find(product => 
      product.images && product.images.length > 0
    );
    
    if (productWithImage && productWithImage.images[0]) {
      return productWithImage.images[0];
    }
    
    return category.image;
  };

const handleProductClick = (product) => {
  // Navigate to shop with category filter and scroll to products
  navigate(`/shop?category=${encodeURIComponent(category.value)}`);
};

  const handleViewAllClick = () => {
    navigate(`/shop?category=${encodeURIComponent(category.value)}`);
  };

  const handleCategoryShowcaseClick = () => {
    navigate(`/shop?category=${encodeURIComponent(category.value)}`);
  };

  return (
    <section className={`py-12 ${styles.background} relative overflow-hidden`}>
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"></div>
      </div>
      
      <div className="relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="px-12"
        >
          <motion.div variants={itemVariants} className="text-center mb-20">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-orange-500"></div>
              <span className="text-orange-500 font-light text-sm uppercase tracking-widest">
                Premium Collection
              </span>
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-orange-500"></div>
            </div>
            
            <h2 className={`text-5xl md:text-6xl font-light ${styles.text} mb-6 leading-tight`}>
              {category.label}
            </h2>
            
            <p className={`${styles.subtitle} text-xl max-w-3xl mx-auto leading-relaxed font-light`}>
              {category.description}
            </p>
            
            <div className="mt-6 flex items-center justify-center gap-6">
              {reviewStats?.averageRating > 0 ? (
                <div className="flex items-center gap-4">
                  {renderDynamicStars(reviewStats.averageRating, 'md')}
                  <span className={`${styles.subtitle} font-medium`}>
                    {getReviewCountText(reviewStats)}
                  </span>
                </div>
              ) : (
                <span className={`${styles.subtitle} font-medium`}>
                  Be the first to review our {category.label.toLowerCase()} collection
                </span>
              )}
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-6 text-sm">
              <span className={`${styles.subtitle} font-medium`}>
                {reviewStats?.totalProducts || products.length} Exclusive Items
              </span>
              <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
              <span className={`${styles.subtitle} font-medium`}>
                Curated Selection
              </span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
            <motion.div
              variants={itemVariants}
              className="xl:col-span-5"
            >
              <div className="relative group">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient[theme]} opacity-80 z-10`}></div>
                  
                  <motion.img
                    src={getCategoryImage()}
                    alt={category.label}
                    className="w-full h-[600px] object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    onError={(e) => {
                      e.target.src = fallbackcategory;
                    }}
                  />
                  
                  <div className="absolute inset-0 z-20 flex flex-col justify-end p-12">
                    <motion.h3
                      className="text-white text-4xl font-light mb-4"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {category.label}
                    </motion.h3>
                    
                    <motion.p
                      className="text-gray-900 text-lg mb-4 font-light leading-relaxed"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      Discover {reviewStats?.totalProducts || products.length} meticulously crafted pieces in our {category.label.toLowerCase()} collection
                    </motion.p>

                    {reviewStats?.averageRating > 0 && (
                      <motion.div
                        className="flex items-center gap-3 mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        {renderDynamicStars(reviewStats.averageRating, 'md')}
                        <span className="text-gray-200 text-sm">
                          {getReviewCountText(reviewStats)}
                        </span>
                      </motion.div>
                    )}
                    
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <button
                        onClick={handleCategoryShowcaseClick}
                        className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-lg text-white px-8 py-4 rounded-2xl hover:bg-white/30 transition-all duration-500 group/btn border border-white/50"
                      >
                        <span className="font-medium">Explore Collection</span>
                        <ArrowRight className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </button>
                    </motion.div>
                  </div>
                </div>
                
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-500/10 rounded-full blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="xl:col-span-7"
            >
              {products.length > 0 ? (
                <div className="relative">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <AnimatePresence mode="popLayout">
                      {currentProducts.map((product) => {
                        const { formatted: currentPrice } = formatPrice(product.price);
                        const { formatted: originalPrice } = formatPrice(product.price * 1.2);
                        
                        const productRating = product.reviewStats?.averageRating || 0;
                        const reviewCount = product.reviewStats?.totalReviews || 0;
                        
                        return (
                              <motion.div
                                key={product.id}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                whileHover="hover"
                                className={`group relative ${styles.card} ${styles.border} rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm cursor-pointer`}
                                onClick={() => handleProductClick(product)}
                                whileTap={{ scale: 0.95 }} // Add tap feedback
                              >
                            <div className="relative overflow-hidden">
                              <motion.img
                                src={product.images?.[0] || getCategoryImage()}
                                alt={product.name}
                                className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-700"
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.8 }}
                                onError={(e) => {
                                  e.target.src = getCategoryImage();
                                }}
                              />
                              
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                              
                              {product.inStock && (
                                <div className="absolute top-4 left-4">
                                  <span className="px-3 py-1.5 bg-green-500 text-white rounded-full text-xs font-semibold backdrop-blur-sm">
                                    In Stock
                                  </span>
                                </div>
                              )}


                            </div>
                            
                            <div className="p-6">
                              <div className="flex items-start justify-between mb-3">
                                <h4 className={`${styles.text} font-semibold text-lg leading-tight line-clamp-2 flex-1 pr-4`}>
                                  {product.name}
                                </h4>
                                {productRating > 0 ? (
                                  <div className="flex flex-col items-end gap-1">
                                    {renderDynamicStars(productRating)}
                                    <span className={`${styles.subtitle} text-xs`}>
                                      {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
                                    </span>
                                  </div>
                                ) : (
                                  <div className="text-right">
                                    <span className={`${styles.subtitle} text-xs`}>
                                      
                                    </span>
                                  </div>
                                )}
                              </div>
                              
                              <p className={`${styles.subtitle} text-sm mb-4 line-clamp-2 font-light`}>
                                Premium quality {category.label.toLowerCase()} designed for excellence
                              </p>
                              
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="text-orange-500 font-bold text-xl">
                                    {currentPrice}
                                  </span>
                                  <span className={`${styles.subtitle} text-sm line-through ml-2`}>
                                    {originalPrice}
                                  </span>
                                </div>
                                <span className={`${styles.subtitle} text-xs font-medium px-3 py-1.5 rounded-full ${styles.border}`}>
                                  {category.label}
                                </span>
                              </div>
                            </div>
                            
                            <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-orange-500/30 transition-all duration-500"></div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="text-center mt-12"
                  >
                    <button
                      onClick={handleViewAllClick}
                      className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-10 py-4 rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all duration-500 shadow-2xl hover:shadow-orange-500/25 group/viewall"
                    >
                      <span className="font-semibold">
                        View All {reviewStats?.totalProducts || products.length} Products
                      </span>
                      <ArrowRight className="w-5 h-5 transform group-hover/viewall:translate-x-1 transition-transform duration-300" />
                    </button>
                  </motion.div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-20"
                >
                  <div className="w-24 h-24 bg-gray-200/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <ShoppingBag className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className={`${styles.text} text-2xl font-light mb-4`}>
                    Coming Soon
                  </h3>
                  <p className={`${styles.subtitle} max-w-md mx-auto`}>
                    We're curating the perfect {category.label.toLowerCase()} collection for you. Check back soon for exclusive launches.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CategorySection;