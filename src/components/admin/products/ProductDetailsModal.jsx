// src/components/admin/ProductDetailsModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../contexts/ThemeContext';
import { useProducts } from '../../../contexts/ProductsContext';


const ProductDetailsModal = ({ product, isOpen, onClose }) => {
  const { theme } = useTheme();
  const { updateProduct } = useProducts();
  const [activeTab, setActiveTab] = useState('details');
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);

  // Initialize edited product when modal opens
  React.useEffect(() => {
    if (product && isOpen) {
      setEditedProduct({ ...product });
    }
  }, [product, isOpen]);

  const handleSave = async () => {
    if (!editedProduct) return;
    
    const result = await updateProduct(product.id, {
      name: editedProduct.name,
      price: editedProduct.price,
      inStock: editedProduct.inStock,
      category: editedProduct.category
    });
    
    if (result.success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedProduct({ ...product });
    setIsEditing(false);
  };

  if (!product || !isOpen) return null;

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`max-w-4xl w-full max-h-[90vh] overflow-hidden rounded-xl shadow-2xl ${
              theme === 'dark' ? 'bg-gray-900' : 
              theme === 'smokey' ? 'bg-gray-800' : 'bg-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-6 border-b ${
              theme === 'dark' ? 'border-gray-700' : 
              theme === 'smokey' ? 'border-gray-600' : 'border-gray-200'
            }`}>
              <div>
                {isEditing ? (
                  <input
                    value={editedProduct?.name || ''}
                    onChange={(e) => setEditedProduct(prev => ({ ...prev, name: e.target.value }))}
                    className={`text-2xl font-bold w-full p-2 rounded ${
                      theme === 'dark' ? 'bg-gray-800 text-white' : 
                      theme === 'smokey' ? 'bg-gray-700 text-white' : 'bg-gray-100'
                    }`}
                  />
                ) : (
                  <h2 className={`text-2xl font-bold ${
                    theme === 'dark' ? 'text-white' : 
                    theme === 'smokey' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {product.name}
                  </h2>
                )}
                <p className={`mt-1 ${
                  theme === 'dark' ? 'text-gray-400' : 
                  theme === 'smokey' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  SKU: {product.sku}
                </p>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-full hover:bg-opacity-20 transition-colors ${
                  theme === 'dark' ? 'text-gray-400 hover:bg-gray-400' : 
                  theme === 'smokey' ? 'text-gray-300 hover:bg-gray-300' : 'text-gray-600 hover:bg-gray-600'
                }`}
              >
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className={`border-b ${
              theme === 'dark' ? 'border-gray-700' : 
              theme === 'smokey' ? 'border-gray-600' : 'border-gray-200'
            }`}>
              <nav className="flex space-x-8 px-6">
                {['details', 'variants', 'images'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                      activeTab === tab
                        ? theme === 'dark' ? 'border-blue-500 text-blue-400' : 
                          theme === 'smokey' ? 'border-blue-400 text-blue-300' : 'border-blue-500 text-blue-600'
                        : theme === 'dark' ? 'border-transparent text-gray-400 hover:text-gray-300' : 
                          theme === 'smokey' ? 'border-transparent text-gray-400 hover:text-gray-300' : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {activeTab === 'details' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-c cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 
                        theme === 'smokey' ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                        Product Name
                      </label>
                      {isEditing ? (
                        <input
                          value={editedProduct?.name || ''}
                          onChange={(e) => setEditedProduct(prev => ({ ...prev, name: e.target.value }))}
                          className={`w-full p-3 rounded-lg border ${
                            theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 
                            theme === 'smokey' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                          }`}
                        />
                      ) : (
                        <p className={`p-3 rounded-lg ${
                          theme === 'dark' ? 'bg-gray-800 text-gray-300' : 
                          theme === 'smokey' ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {product.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 
                        theme === 'smokey' ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                        Price
                      </label>
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.01"
                          value={editedProduct?.price || ''}
                          onChange={(e) => setEditedProduct(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                          className={`w-full p-3 rounded-lg border ${
                            theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 
                            theme === 'smokey' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                          }`}
                        />
                      ) : (
                        <p className={`p-3 rounded-lg ${
                          theme === 'dark' ? 'bg-gray-800 text-gray-300' : 
                          theme === 'smokey' ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'
                        }`}>
                          ${product.price}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 
                        theme === 'smokey' ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                        Stock Quantity
                      </label>
                      {isEditing ? (
                        <input
                          type="number"
                          value={editedProduct?.inStock || ''}
                          onChange={(e) => setEditedProduct(prev => ({ ...prev, inStock: parseInt(e.target.value) }))}
                          className={`w-full p-3 rounded-lg border ${
                            theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 
                            theme === 'smokey' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                          }`}
                        />
                      ) : (
                        <p className={`p-3 rounded-lg ${
                          theme === 'dark' ? 'bg-gray-800 text-gray-300' : 
                          theme === 'smokey' ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {product.inStock} units
                        </p>
                      )}
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 
                        theme === 'smokey' ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                        Category
                      </label>
                      {isEditing ? (
                        <select
                          value={editedProduct?.category || ''}
                          onChange={(e) => setEditedProduct(prev => ({ ...prev, category: e.target.value }))}
                          className={`w-full p-3 rounded-lg border ${
                            theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 
                            theme === 'smokey' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                          }`}
                        >
                          <option value="electronics">Electronics</option>
                          <option value="clothing">Clothing</option>
                          <option value="home">Home & Garden</option>
                          <option value="sports">Sports</option>
                        </select>
                      ) : (
                        <p className={`p-3 rounded-lg ${
                          theme === 'dark' ? 'bg-gray-800 text-gray-300' : 
                          theme === 'smokey' ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {product.category}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 
                        theme === 'smokey' ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                        Description
                      </label>
                      {isEditing ? (
                        <textarea
                          value={editedProduct?.description || ''}
                          onChange={(e) => setEditedProduct(prev => ({ ...prev, description: e.target.value }))}
                          rows={4}
                          className={`w-full p-3 rounded-lg border ${
                            theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 
                            theme === 'smokey' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                          }`}
                        />
                      ) : (
                        <p className={`p-3 rounded-lg ${
                          theme === 'dark' ? 'bg-gray-800 text-gray-300' : 
                          theme === 'smokey' ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {product.description || 'No description available.'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'variants' && (
                <div className="space-y-4">
                  <h3 className={`text-lg font-semibold ${
                    theme === 'dark' ? 'text-white' : 
                    theme === 'smokey' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Product Variants
                  </h3>
                  {product.variants && product.variants.length > 0 ? (
                    <div className="space-y-3">
                      {product.variants.map((variant, index) => (
                        <div key={index} className={`p-4 rounded-lg ${
                          theme === 'dark' ? 'bg-gray-800' : 
                          theme === 'smokey' ? 'bg-gray-700' : 'bg-gray-100'
                        }`}>
                          <div className="flex justify-between items-center">
                            <div>
                              <p className={`font-medium ${
                                theme === 'dark' ? 'text-white' : 
                                theme === 'smokey' ? 'text-white' : 'text-gray-900'
                              }`}>
                                {variant.name}
                              </p>
                              <p className={`text-sm ${
                                theme === 'dark' ? 'text-gray-400' : 
                                theme === 'smokey' ? 'text-gray-300' : 'text-gray-600'
                              }`}>
                                Price: ${variant.price} | Stock: {variant.stock}
                              </p>
                            </div>
                            {isEditing && (
                              <button className="text-red-500 hover:text-red-700">
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={`text-center py-8 ${
                      theme === 'dark' ? 'text-gray-400' : 
                      theme === 'smokey' ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      No variants available for this product.
                    </p>
                  )}
                  {isEditing && (
                    <button className={`w-full py-3 rounded-lg border-2 border-dashed ${
                      theme === 'dark' ? 'border-gray-600 text-gray-400 hover:border-gray-500' : 
                      theme === 'smokey' ? 'border-gray-500 text-gray-400 hover:border-gray-400' : 'border-gray-300 text-gray-500 hover:border-gray-400'
                    }`}>
                      + Add Variant
                    </button>
                  )}
                </div>
              )}

              {activeTab === 'images' && (
                <div className="space-y-4">
                  <h3 className={`text-lg font-semibold ${
                    theme === 'dark' ? 'text-white' : 
                    theme === 'smokey' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Product Images
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {product.images && product.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        {isEditing && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                            <button className="text-white bg-red-500 px-3 py-1 rounded">
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {isEditing && (
                    <button className={`w-full py-3 rounded-lg border-2 border-dashed ${
                      theme === 'dark' ? 'border-gray-600 text-gray-400 hover:border-gray-500' : 
                      theme === 'smokey' ? 'border-gray-500 text-gray-400 hover:border-gray-400' : 'border-gray-300 text-gray-500 hover:border-gray-400'
                    }`}>
                      + Add Image
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className={`flex justify-between items-center p-6 border-t ${
              theme === 'dark' ? 'border-gray-700' : 
              theme === 'smokey' ? 'border-gray-600' : 'border-gray-200'
            }`}>
              <div className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 
                theme === 'smokey' ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Last updated: {new Date(product.updatedAt).toLocaleDateString()}
              </div>
              
              <div className="flex space-x-3">
                {!isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 
                        theme === 'smokey' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      Edit Product
                    </button>
                    <button
                      onClick={onClose}
                      className={`px-6 py-2 rounded-lg font-medium border transition-colors ${
                        theme === 'dark' ? 'border-gray-600 text-gray-300 hover:bg-gray-800' : 
                        theme === 'smokey' ? 'border-gray-500 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Close
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleCancel}
                      className={`px-6 py-2 rounded-lg font-medium border transition-colors ${
                        theme === 'dark' ? 'border-gray-600 text-gray-300 hover:bg-gray-800' : 
                        theme === 'smokey' ? 'border-gray-500 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        theme === 'dark' ? 'bg-green-600 hover:bg-green-700 text-white' : 
                        theme === 'smokey' ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      Save Changes
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailsModal;