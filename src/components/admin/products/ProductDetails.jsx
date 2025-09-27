// src/components/admin/products/ProductDetails.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../contexts/ThemeContext';
import { X, Tag, DollarSign, Package, Image as ImageIcon, Layers, Calendar, ExternalLink, BarChart3 } from 'lucide-react';

const ProductDetails = ({ product, onClose }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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
          }
        };
    }
  };

  const themeClasses = getThemeClasses();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Package },
    { id: 'variants', label: 'Variants', icon: Layers },
    { id: 'images', label: 'Media', icon: ImageIcon },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  const availableVariants = product.printifyVariants?.filter(v => v.isAvailable) || [];
  const unavailableVariants = product.printifyVariants?.filter(v => !v.isAvailable) || [];

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30 }}
      className={`h-full rounded-l-xl border-l shadow-2xl ${themeClasses.container} overflow-hidden flex flex-col`}
    >
      {/* Header */}
      <div className={`p-6 border-b ${themeClasses.card.split(' ')[1]} flex-shrink-0`}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-semibold">Product Details</h3>
            <p className="text-sm opacity-70 mt-1">Complete product information and analytics</p>
          </div>
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-2 rounded-lg transition-colors ${themeClasses.button.secondary}`}
          >
            <X size={20} />
          </motion.button>
        </div>

        {/* Tabs */}
        <div className={`flex p-1 rounded-lg ${themeClasses.tab}`}>
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${
                  activeTab === tab.id ? themeClasses.activeTab : themeClasses.inactiveTab
                }`}
              >
                <IconComponent size={14} />
                {tab.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {activeTab === 'overview' && (
              <>
                {/* Main Image */}
                <div className="text-center">
                  <div className="relative inline-block">
                    <img
                      src={product.images?.[selectedImageIndex] || '/api/placeholder/400/300'}
                      alt={product.name}
                      className="w-full max-w-md h-64 object-cover rounded-xl shadow-lg"
                      onError={(e) => {
                        e.target.src = '/api/placeholder/400/300';
                      }}
                    />
                    {product.images && product.images.length > 1 && (
                      <div className="flex justify-center gap-2 mt-3">
                        {product.images.slice(0, 5).map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`w-10 h-10 rounded border-2 transition-all ${
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
                        {product.images.length > 5 && (
                          <div className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded text-xs font-medium">
                            +{product.images.length - 5}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-lg ${themeClasses.card}`}>
                    <label className="block text-sm font-semibold opacity-75 mb-2 flex items-center gap-2">
                      <Package size={16} />
                      Product Name
                    </label>
                    <h4 className="text-lg font-semibold">{product.name}</h4>
                  </div>

                  <div className={`p-4 rounded-lg ${themeClasses.card}`}>
                    <label className="block text-sm font-semibold opacity-75 mb-2 flex items-center gap-2">
                      <DollarSign size={16} />
                      Price
                    </label>
                    <p className="text-xl font-semibold text-green-600">
                      {formatPrice(product.price)}
                    </p>
                  </div>

                  <div className={`p-4 rounded-lg ${themeClasses.card}`}>
                    <label className="block text-sm font-semibold opacity-75 mb-2 flex items-center gap-2">
                      <Tag size={16} />
                      Category
                    </label>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      theme === 'dark' ? 'bg-blue-900 text-blue-200' : 
                      theme === 'smokey' ? 'bg-blue-800 text-blue-100' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {product.category || 'Uncategorized'}
                    </span>
                  </div>

                  <div className={`p-4 rounded-lg ${themeClasses.card}`}>
                    <label className="block text-sm font-semibold opacity-75 mb-2">
                      Inventory Status
                    </label>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      product.inStock 
                        ? (theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800')
                        : (theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800')
                    }`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className={`p-4 rounded-lg ${themeClasses.card}`}>
                  <label className="block text-sm font-semibold opacity-75 mb-3">Product Description</label>
                  <p className="text-sm leading-relaxed opacity-90 whitespace-pre-wrap">
                    {stripHtml(product.description)}
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className={`p-4 rounded-lg text-center ${themeClasses.card}`}>
                    <div className="text-2xl font-bold text-blue-600">{product.printifyVariants?.length || 0}</div>
                    <div className="text-sm opacity-75">Variants</div>
                  </div>
                  <div className={`p-4 rounded-lg text-center ${themeClasses.card}`}>
                    <div className="text-2xl font-bold text-green-600">{availableVariants.length}</div>
                    <div className="text-sm opacity-75">Available</div>
                  </div>
                  <div className={`p-4 rounded-lg text-center ${themeClasses.card}`}>
                    <div className="text-2xl font-bold text-purple-600">{product.images?.length || 0}</div>
                    <div className="text-sm opacity-75">Images</div>
                  </div>
                  <div className={`p-4 rounded-lg text-center ${themeClasses.card}`}>
                    <div className="text-2xl font-bold text-orange-600">
                      {formatDate(product.createdAt)}
                    </div>
                    <div className="text-sm opacity-75">Created</div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'variants' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">Product Variants ({product.printifyVariants?.length || 0})</h4>
                  <div className="text-sm opacity-75">
                    <span className="text-green-600">{availableVariants.length} available</span>
                    <span className="mx-2">•</span>
                    <span className="text-red-600">{unavailableVariants.length} unavailable</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                  {product.printifyVariants?.map((variant, index) => (
                    <motion.div
                      key={variant.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 rounded-lg border ${themeClasses.card} ${
                        variant.isAvailable ? 'border-green-200 dark:border-green-800' : 'border-red-200 dark:border-red-800'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h5 className="font-semibold text-sm">{variant.title}</h5>
                          <div className="text-xs opacity-75 mt-1">SKU: {variant.sku}</div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          variant.isAvailable
                            ? (theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800')
                            : (theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800')
                        }`}>
                          {variant.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-green-600">{formatPrice(variant.price)}</span>
                        <span className="text-xs opacity-75">ID: {variant.id}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'images' && (
              <div className="space-y-4">
                <h4 className="font-semibold">Product Media ({product.images?.length || 0})</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
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
                        className="w-full h-24 object-cover rounded-lg shadow-md transition-transform group-hover:scale-105"
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
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-lg ${themeClasses.card}`}>
                    <label className="block text-sm font-semibold opacity-75 mb-2">Product ID</label>
                    <p className="font-mono text-sm opacity-90">{product.id}</p>
                  </div>
                  <div className={`p-4 rounded-lg ${themeClasses.card}`}>
                    <label className="block text-sm font-semibold opacity-75 mb-2">External ID</label>
                    <p className="font-mono text-sm opacity-90 break-all">{product.printifyProductId}</p>
                  </div>
                  <div className={`p-4 rounded-lg ${themeClasses.card}`}>
                    <label className="block text-sm font-semibold opacity-75 mb-2 flex items-center gap-2">
                      <Calendar size={16} />
                      Created
                    </label>
                    <p className="text-sm opacity-90">{formatDate(product.createdAt)}</p>
                  </div>
                  <div className={`p-4 rounded-lg ${themeClasses.card}`}>
                    <label className="block text-sm font-semibold opacity-75 mb-2 flex items-center gap-2">
                      <Calendar size={16} />
                      Last Updated
                    </label>
                    <p className="text-sm opacity-90">{formatDate(product.updatedAt)}</p>
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${themeClasses.card}`}>
                  <label className="block text-sm font-semibold opacity-75 mb-3">Technical Specifications</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Blueprint ID:</span>
                        <span className="font-mono text-xs opacity-75">{product.printifyBlueprintId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Provider ID:</span>
                        <span className="font-mono text-xs opacity-75">{product.printifyPrintProviderId}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">SKU Prefix:</span>
                        <span className="font-mono text-xs opacity-75">{product.sku}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Total Variants:</span>
                        <span className="font-mono text-xs opacity-75">{product.printifyVariants?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analytics Placeholder */}
                <div className={`p-6 rounded-lg text-center ${themeClasses.card}`}>
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h4 className="font-semibold mb-2">Analytics Coming Soon</h4>
                  <p className="text-sm opacity-75">Product performance metrics and sales analytics will be available in the next update.</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Actions */}
      <div className={`p-4 border-t ${themeClasses.card.split(' ')[1]} flex-shrink-0`}>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex-1 py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2 font-medium ${themeClasses.button.secondary}`}
            onClick={() => window.open(`/products/${product.id}`, '_blank')}
          >
            <ExternalLink size={16} />
            View Live Product
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetails;