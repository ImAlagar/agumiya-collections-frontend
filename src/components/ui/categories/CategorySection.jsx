import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight, ChevronLeft, ChevronRight, Heart, Star } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { Link } from 'react-router-dom';

const CategorySection = ({ category, products, index }) => {
  const { theme } = useTheme();
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
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className={`py-12 ${styles.background} relative overflow-hidden`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"></div>
      </div>
      
      <div className="relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="px-5"
        >
          {/* Category Header */}
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
            
            <div className="mt-8 flex items-center justify-center gap-6 text-sm">
              <span className={`${styles.subtitle} font-medium`}>
                {category.count} Exclusive Items
              </span>
              <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
              <span className={`${styles.subtitle} font-medium`}>
                Curated Selection
              </span>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
            {/* Category Showcase - Left Side */}
            <motion.div
              variants={itemVariants}
              className="xl:col-span-5"
            >
              <div className="relative group">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient[theme]} opacity-80 z-10`}></div>
                  
                  {/* Main Image */}
                  <motion.img
                    src={category.image}
                    alt={category.label}
                    className="w-full h-[600px] object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                  
                  {/* Content Overlay */}
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
                      className="text-gray-200 text-lg mb-8 font-light leading-relaxed"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      Discover {category.count} meticulously crafted pieces in our {category.label.toLowerCase()} collection
                    </motion.p>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <Link
                        to={`/shop?category=${encodeURIComponent(category.value)}`}
                        className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-lg text-white px-8 py-4 rounded-2xl hover:bg-white/30 transition-all duration-500 group/btn border border-white/20"
                      >
                        <span className="font-medium">Explore Collection</span>
                        <ArrowRight className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </motion.div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-500/10 rounded-full blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
              </div>
            </motion.div>

            {/* Products Grid - Right Side */}
            <motion.div
              variants={itemVariants}
              className="xl:col-span-7"
            >
              {products.length > 0 ? (
                <div className="relative">
                  {/* Products Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <AnimatePresence mode="wait">
                      {currentProducts.map((product, productIndex) => (
                        <motion.div
                          key={`${product.id}-${currentPage}`}
                          variants={cardVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          whileHover="hover"
                          className={`group relative ${styles.card} ${styles.border} rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm`}
                        >
                          {/* Product Image */}
                          <div className="relative overflow-hidden">
                            <motion.img
                              src={product.images?.[0] || category.image}
                              alt={product.name}
                              className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-700"
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.8 }}
                            />
                            
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            {/* Action Buttons */}
                            <div className="absolute top-4 right-4 flex gap-2">
                              <button className="p-3 bg-white/20 backdrop-blur-lg rounded-2xl text-white transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hover:bg-white/30">
                                <Heart className="w-4 h-4" />
                              </button>
                              <button className="p-3 bg-orange-500 text-white rounded-2xl transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100 hover:bg-orange-600">
                                <ShoppingBag className="w-4 h-4" />
                              </button>
                            </div>
                            
                            {/* Stock Badge */}
                            {product.inStock && (
                              <div className="absolute top-4 left-4">
                                <span className="px-3 py-1.5 bg-green-500 text-white rounded-full text-xs font-semibold backdrop-blur-sm">
                                  In Stock
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {/* Product Info */}
                          <div className="p-6">
                            <div className="flex items-start justify-between mb-3">
                              <h4 className={`${styles.text} font-semibold text-lg leading-tight line-clamp-2 flex-1 pr-4`}>
                                {product.name}
                              </h4>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className={`${styles.subtitle} text-sm font-medium`}>4.8</span>
                              </div>
                            </div>
                            
                            <p className={`${styles.subtitle} text-sm mb-4 line-clamp-2 font-light`}>
                              Premium quality {category.label.toLowerCase()} designed for excellence
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-orange-500 font-bold text-xl">
                                  ${product.price}
                                </span>
                                <span className={`${styles.subtitle} text-sm line-through ml-2`}>
                                  ${(product.price * 1.2).toFixed(2)}
                                </span>
                              </div>
                              <span className={`${styles.subtitle} text-xs font-medium px-3 py-1.5 rounded-full ${styles.border}`}>
                                {category.label}
                              </span>
                            </div>
                          </div>
                          
                          {/* Hover Effect Border */}
                          <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-orange-500/30 transition-all duration-500"></div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="flex items-center justify-center gap-4 mt-12"
                    >
                      <button
                        onClick={prevPage}
                        disabled={currentPage === 0}
                        className="p-3 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-300"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      
                      <div className="flex items-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentPage(i)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                              i === currentPage 
                                ? 'bg-orange-500 scale-125' 
                                : 'bg-white/30 hover:bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                      
                      <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages - 1}
                        className="p-3 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-300"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </motion.div>
                  )}

                  {/* View All Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="text-center mt-12"
                  >
                    <Link
                      to={`/shop?category=${encodeURIComponent(category.value)}`}
                      className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-10 py-4 rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all duration-500 shadow-2xl hover:shadow-orange-500/25 group/viewall"
                    >
                      <span className="font-semibold">View All {category.count} Products</span>
                      <ArrowRight className="w-5 h-5 transform group-hover/viewall:translate-x-1 transition-transform duration-300" />
                    </Link>
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