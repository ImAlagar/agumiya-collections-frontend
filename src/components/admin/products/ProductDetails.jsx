// src/components/admin/products/ProductDetails.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../contexts/ThemeContext';
import { 
  X, 
  Tag, 
  DollarSign, 
  Package, 
  Image as ImageIcon, 
  Layers, 
  Calendar, 
  ExternalLink, 
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Tablet,
  Monitor
} from 'lucide-react';
import { useCurrency } from '../../../contexts/CurrencyContext'; // Add this import

const ProductDetails = ({ product, onClose }) => {
  const { theme } = useTheme();
    const { formatPrice, formatPriceSimple, getCurrencySymbol } = useCurrency(); // Add this

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const getThemeClasses = () => {
    switch (theme) {
      case 'dark':
        return {
          container: 'bg-gray-900 border-gray-700 text-white',
          card: 'bg-gray-800 border-gray-700',
          input: 'bg-gray-700 border-gray-600 text-white placeholder-gray-400',
          tab: 'bg-gray-800',
          activeTab: 'bg-blue-600 text-white',
          inactiveTab: 'text-gray-300 hover:text-white hover:bg-gray-700',
          button: {
            primary: 'bg-blue-600 hover:bg-blue-700 text-white',
            secondary: 'bg-gray-700 hover:bg-gray-600 text-white',
            danger: 'bg-red-600 hover:bg-red-700 text-white'
          },
          text: {
            primary: 'text-white',
            secondary: 'text-gray-300',
            muted: 'text-gray-400'
          }
        };
      case 'smokey':
        return {
          container: 'bg-gray-800 border-gray-600 text-gray-100',
          card: 'bg-gray-700 border-gray-600',
          input: 'bg-gray-600 border-gray-500 text-white placeholder-gray-300',
          tab: 'bg-gray-700',
          activeTab: 'bg-blue-500 text-white',
          inactiveTab: 'text-gray-300 hover:text-white hover:bg-gray-600',
          button: {
            primary: 'bg-blue-500 hover:bg-blue-600 text-white',
            secondary: 'bg-gray-600 hover:bg-gray-500 text-white',
            danger: 'bg-red-500 hover:bg-red-600 text-white'
          },
          text: {
            primary: 'text-gray-100',
            secondary: 'text-gray-300',
            muted: 'text-gray-400'
          }
        };
      default:
        return {
          container: 'bg-white border-gray-200 text-gray-900',
          card: 'bg-gray-50 border-gray-200',
          input: 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
          tab: 'bg-gray-100',
          activeTab: 'bg-blue-500 text-white',
          inactiveTab: 'text-gray-600 hover:text-gray-900 hover:bg-gray-200',
          button: {
            primary: 'bg-blue-500 hover:bg-blue-600 text-white',
            secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
            danger: 'bg-red-500 hover:bg-red-600 text-white'
          },
          text: {
            primary: 'text-gray-900',
            secondary: 'text-gray-600',
            muted: 'text-gray-500'
          }
        };
    }
  };

  const themeClasses = getThemeClasses();
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const stripHtml = (html) => {
    if (!html) return '';
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Package },
    { id: 'variants', label: 'Variants', icon: Layers },
    { id: 'images', label: 'Media', icon: ImageIcon },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  const availableVariants = product.printifyVariants?.filter(v => v.isAvailable) || [];
  const unavailableVariants = product.printifyVariants?.filter(v => !v.isAvailable) || [];

  // Responsive grid classes
  const getGridClasses = () => {
    if (isMobile) return 'grid-cols-1';
    if (isTablet) return 'grid-cols-2';
    return 'grid-cols-1 md:grid-cols-2';
  };

  const getImageSizeClasses = () => {
    if (isMobile) return 'w-full h-48';
    if (isTablet) return 'w-full h-56';
    return 'w-full max-w-md h-64';
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className={`
        fixed inset-y-0 right-0 w-full 
        ${isMobile ? 'max-w-full' : isTablet ? 'max-w-2xl' : 'max-w-2xl'}
        ${themeClasses.container} 
        border-l shadow-2xl overflow-hidden flex flex-col z-50
      `}
    >
      {/* Header */}
      <div className={`p-4 sm:p-6 border-b ${themeClasses.card.split(' ')[1]} flex-shrink-0`}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {isMobile && (
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2 rounded-lg transition-colors ${themeClasses.button.secondary} flex-shrink-0`}
                >
                  <ChevronLeft size={20} />
                </motion.button>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="text-lg sm:text-xl font-semibold truncate">{product.name}</h3>
                <p className={`text-xs sm:text-sm ${themeClasses.text.muted} mt-1 truncate`}>
                  Complete product information and analytics
                </p>
              </div>
            </div>
            
          </div>
          
          {!isMobile && (
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-lg transition-colors ${themeClasses.button.secondary} flex-shrink-0 ml-4`}
            >
              <X size={20} />
            </motion.button>
          )}
        </div>

        {/* Tabs - Responsive */}
        <div className={`flex p-1 rounded-lg ${themeClasses.tab}`}>
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  flex-1 min-w-0 py-2 px-2 sm:px-3 text-xs sm:text-sm font-medium rounded-md 
                  transition-all flex items-center justify-center gap-1 sm:gap-2
                  ${activeTab === tab.id ? themeClasses.activeTab : themeClasses.inactiveTab}
                `}
              >
                <IconComponent size={isMobile ? 12 : 14} />
                <span className="truncate">{tab.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 sm:space-y-6"
          >
            {activeTab === 'overview' && (
              <>
                {/* Main Image */}
                <div className="text-center">
                  <div className="relative inline-block max-w-full">
                    <div className="relative">
                      <img
                        src={product.images?.[selectedImageIndex] || '/api/placeholder/400/300'}
                        alt={product.name}
                        className={`${getImageSizeClasses()} object-cover rounded-xl shadow-lg mx-auto`}
                        onError={(e) => {
                          e.target.src = '/api/placeholder/400/300';
                        }}
                      />
                      
                      {product.images && product.images.length > 1 && (
                        <>
                          <motion.button
                            onClick={prevImage}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full ${themeClasses.button.primary} shadow-lg`}
                          >
                            <ChevronLeft size={isMobile ? 16 : 20} />
                          </motion.button>
                          <motion.button
                            onClick={nextImage}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full ${themeClasses.button.primary} shadow-lg`}
                          >
                            <ChevronRight size={isMobile ? 16 : 20} />
                          </motion.button>
                        </>
                      )}
                    </div>
                    
                    {product.images && product.images.length > 1 && (
                      <div className="flex justify-center gap-1 sm:gap-2 mt-3 overflow-x-auto pb-2">
                        {product.images.slice(0, isMobile ? 3 : 5).map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`flex-shrink-0 ${
                              isMobile ? 'w-8 h-8' : 'w-10 h-10'
                            } rounded border-2 transition-all ${
                              selectedImageIndex === index 
                                ? 'border-blue-500 scale-110' 
                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                            }`}
                          >
                            <img
                              src={image}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover rounded"
                              onError={(e) => {
                                e.target.src = '/api/placeholder/40/40';
                              }}
                            />
                          </button>
                        ))}
                        {product.images.length > (isMobile ? 3 : 5) && (
                          <div className={`flex-shrink-0 ${
                            isMobile ? 'w-8 h-8' : 'w-10 h-10'
                          } flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded text-xs font-medium`}>
                            +{product.images.length - (isMobile ? 3 : 5)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Info Grid */}
                <div className={`grid ${getGridClasses()} gap-3 sm:gap-4`}>
                  <div className={`p-3 sm:p-4 rounded-lg ${themeClasses.card}`}>
                    <label className="block text-xs sm:text-sm font-semibold opacity-75 mb-2 flex items-center gap-2">
                      <Package size={isMobile ? 14 : 16} />
                      Product Name
                    </label>
                    <h4 className="text-sm sm:text-lg font-semibold truncate">{product.name}</h4>
                  </div>

                  <div className={`p-3 sm:p-4 rounded-lg ${themeClasses.card}`}>
                    <label className="block text-xs sm:text-sm font-semibold opacity-75 mb-2 flex items-center gap-2">
                      Price
                    </label>
                    <p className="text-lg sm:text-xl font-semibold text-green-600">
                      {formatPriceSimple(product.price)}
                    </p>
                  </div>

                  <div className={`p-3 sm:p-4 rounded-lg ${themeClasses.card}`}>
                    <label className="block text-xs sm:text-sm font-semibold opacity-75 mb-2 flex items-center gap-2">
                      <Tag size={isMobile ? 14 : 16} />
                      Category
                    </label>
                    <span className={`inline-flex px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                      theme === 'dark' ? 'bg-blue-900 text-blue-200' : 
                      theme === 'smokey' ? 'bg-blue-800 text-blue-100' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {product.category || 'Uncategorized'}
                    </span>
                  </div>

                  <div className={`p-3 sm:p-4 rounded-lg ${themeClasses.card}`}>
                    <label className="block text-xs sm:text-sm font-semibold opacity-75 mb-2">
                      Inventory Status
                    </label>
                    <span className={`inline-flex px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                      product.inStock 
                        ? (theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800')
                        : (theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800')
                    }`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className={`p-3 sm:p-4 rounded-lg ${themeClasses.card}`}>
                  <label className="block text-xs sm:text-sm font-semibold opacity-75 mb-3">Product Description</label>
                  <p className="text-xs sm:text-sm leading-relaxed opacity-90 whitespace-pre-wrap max-h-32 overflow-y-auto">
                    {stripHtml(product.description)}
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className={`p-3 sm:p-4 rounded-lg text-center ${themeClasses.card}`}>
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">{product.printifyVariants?.length || 0}</div>
                    <div className="text-xs sm:text-sm opacity-75">Variants</div>
                  </div>
                  <div className={`p-3 sm:p-4 rounded-lg text-center ${themeClasses.card}`}>
                    <div className="text-xl sm:text-2xl font-bold text-green-600">{availableVariants.length}</div>
                    <div className="text-xs sm:text-sm opacity-75">Available</div>
                  </div>
                  <div className={`p-3 sm:p-4 rounded-lg text-center ${themeClasses.card}`}>
                    <div className="text-xl sm:text-2xl font-bold text-purple-600">{product.images?.length || 0}</div>
                    <div className="text-xs sm:text-sm opacity-75">Images</div>
                  </div>
                  <div className={`p-3 sm:p-4 rounded-lg text-center ${themeClasses.card}`}>
                    <div className="text-xs sm:text-sm font-bold text-orange-600">
                      {formatDate(product.createdAt)}
                    </div>
                    <div className="text-xs sm:text-sm opacity-75">Created</div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'variants' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <h4 className="font-semibold text-sm sm:text-base">
                    Product Variants ({product.printifyVariants?.length || 0})
                  </h4>
                  <div className="text-xs sm:text-sm opacity-75 flex gap-2">
                    <span className="text-green-600">{availableVariants.length} available</span>
                    <span>•</span>
                    <span className="text-red-600">{unavailableVariants.length} unavailable</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:gap-3 max-h-96 overflow-y-auto">
                  {product.printifyVariants?.map((variant, index) => (
                    <motion.div
                      key={variant.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-3 sm:p-4 rounded-lg border ${themeClasses.card} ${
                        variant.isAvailable ? 'border-green-200 dark:border-green-800' : 'border-red-200 dark:border-red-800'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2 gap-2">
                        <div className="min-w-0 flex-1">
                          <h5 className="font-semibold text-sm truncate">{variant.title}</h5>
                          <div className="text-xs opacity-75 mt-1 truncate">SKU: {variant.sku}</div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                          variant.isAvailable
                            ? (theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800')
                            : (theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800')
                        }`}>
                          {variant.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="font-semibold text-green-600">{formatPriceSimple(variant.price)}</span>
                        <span className="text-xs opacity-75 truncate ml-2">ID: {variant.id}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'images' && (
              <div className="space-y-4">
                <h4 className="font-semibold text-sm sm:text-base">
                  Product Media ({product.images?.length || 0})
                </h4>
                <div className={`grid ${
                  isMobile ? 'grid-cols-2' : isTablet ? 'grid-cols-3' : 'grid-cols-3 lg:grid-cols-4'
                } gap-2 sm:gap-4 max-h-96 overflow-y-auto`}>
                  {product.images?.map((image, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative group cursor-pointer"
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-20 sm:h-24 object-cover rounded-lg shadow-md transition-transform group-hover:scale-105"
                        onError={(e) => {
                          e.target.src = '/api/placeholder/150/100';
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
                          View
                        </div>
                      </div>
                      <div className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                        {index + 1}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-4 sm:space-y-6">
                <div className={`grid ${getGridClasses()} gap-3 sm:gap-4`}>
                  <div className={`p-3 sm:p-4 rounded-lg ${themeClasses.card}`}>
                    <label className="block text-xs sm:text-sm font-semibold opacity-75 mb-2">Product ID</label>
                    <p className="font-mono text-xs sm:text-sm opacity-90 break-all">{product.id}</p>
                  </div>
                  <div className={`p-3 sm:p-4 rounded-lg ${themeClasses.card}`}>
                    <label className="block text-xs sm:text-sm font-semibold opacity-75 mb-2">External ID</label>
                    <p className="font-mono text-xs sm:text-sm opacity-90 break-all">{product.printifyProductId}</p>
                  </div>
                  <div className={`p-3 sm:p-4 rounded-lg ${themeClasses.card}`}>
                    <label className="block text-xs sm:text-sm font-semibold opacity-75 mb-2 flex items-center gap-2">
                      <Calendar size={isMobile ? 14 : 16} />
                      Created
                    </label>
                    <p className="text-xs sm:text-sm opacity-90">{formatDate(product.createdAt)}</p>
                  </div>
                  <div className={`p-3 sm:p-4 rounded-lg ${themeClasses.card}`}>
                    <label className="block text-xs sm:text-sm font-semibold opacity-75 mb-2 flex items-center gap-2">
                      <Calendar size={isMobile ? 14 : 16} />
                      Last Updated
                    </label>
                    <p className="text-xs sm:text-sm opacity-90">{formatDate(product.updatedAt)}</p>
                  </div>
                </div>

                <div className={`p-3 sm:p-4 rounded-lg ${themeClasses.card}`}>
                  <label className="block text-xs sm:text-sm font-semibold opacity-75 mb-3">Technical Specifications</label>
                  <div className={`grid ${getGridClasses()} gap-3 sm:gap-4 text-xs sm:text-sm`}>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Blueprint ID:</span>
                        <span className="font-mono text-xs opacity-75 truncate ml-2">{product.printifyBlueprintId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Provider ID:</span>
                        <span className="font-mono text-xs opacity-75 truncate ml-2">{product.printifyPrintProviderId}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">SKU Prefix:</span>
                        <span className="font-mono text-xs opacity-75 truncate ml-2">{product.sku}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Total Variants:</span>
                        <span className="font-mono text-xs opacity-75">{product.printifyVariants?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analytics Placeholder */}
                <div className={`p-4 sm:p-6 rounded-lg text-center ${themeClasses.card}`}>
                  <BarChart3 className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                  <h4 className="font-semibold text-sm sm:text-base mb-2">Analytics Coming Soon</h4>
                  <p className="text-xs sm:text-sm opacity-75">
                    Product performance metrics and sales analytics will be available in the next update.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Actions */}
      <div className={`p-3 sm:p-4 border-t ${themeClasses.card.split(' ')[1]} flex-shrink-0`}>
        <div className="flex gap-2 sm:gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex-1 py-2 px-3 sm:px-4 rounded-lg transition-all flex items-center justify-center gap-2 text-xs sm:text-sm font-medium ${themeClasses.button.secondary}`}
            onClick={() => window.open(`/products/${product.id}`, '_blank')}
          >
            <ExternalLink size={isMobile ? 14 : 16} />
            {isMobile ? 'View Live' : 'View Live Product'}
          </motion.button>
          
          {isMobile && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`py-2 px-4 rounded-lg transition-all flex items-center justify-center text-xs sm:text-sm font-medium ${themeClasses.button.primary}`}
              onClick={onClose}
            >
              Done
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetails;