// src/components/admin/products/ProductTable.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Loader from '../../common/Loader';
import ProductDetails from './ProductDetails';
import { itemVariants, staggerVariants } from '../../../contexts/ProductsContext';
import { TrendingUp, Package, Image as ImageIcon, Calendar } from 'lucide-react';

const ProductTable = ({ products, isLoading, pagination, onPageChange }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleRowClick = (product) => {
    setSelectedProduct(product);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedProduct(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 dark:text-gray-500 mb-4">
          <Package className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No products found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Try adjusting your filters or sync new products.
        </p>
      </div>
    );
  }

  return (
    <>
      <motion.div
        variants={staggerVariants}
        initial="hidden"
        animate="visible"
        className="overflow-hidden"
      >
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-400 min-w-[250px]">Product</th>
                <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-400">Category</th>
                <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-400">Price</th>
                <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-400">Inventory</th>
                <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-400">Variants</th>
                <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-400">Media</th>
                <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-400">Created</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <motion.tr
                  key={product.id}
                  variants={itemVariants}
                  className="border-b border-gray-100 dark:border-gray-900 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer group"
                  onClick={() => handleRowClick(product)}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={product.images?.[0] || '/api/placeholder/40/40'}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover shadow-sm"
                          onError={(e) => {
                            e.target.src = '/api/placeholder/40/40';
                          }}
                        />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          SKU: {product.sku || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">
                    <span className="inline-flex px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                      {product.category || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      ${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
                    </div>
                    {product.comparePrice && (
                      <div className="text-sm text-gray-500 line-through">
                        ${product.comparePrice}
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        product.inStock ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <span className={`text-sm font-medium ${
                        !product.inStock ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                      }`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Package className="w-4 h-4" />
                      {product.printifyVariants?.length || 0}
                      <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                        product.printifyVariants?.filter(v => v.isAvailable).length > 0
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {product.printifyVariants?.filter(v => v.isAvailable).length || 0} active
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <ImageIcon className="w-4 h-4" />
                      {product.images?.length || 0}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      {new Date(product.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3 p-4">
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleRowClick(product)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={product.images?.[0] || '/api/placeholder/40/40'}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover shadow-sm"
                      onError={(e) => {
                        e.target.src = '/api/placeholder/40/40';
                      }}
                    />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {product.name}
                    </div>
                    <div className="text-sm text-gray-500">{product.category}</div>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  product.inStock 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {product.inStock ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Price</div>
                  <div className="font-semibold">${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}</div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Inventory</div>
                  <div className={`font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Variants</div>
                  <div className="font-medium flex items-center gap-1">
                    <Package className="w-3 h-3" />
                    {product.printifyVariants?.length || 0}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Media</div>
                  <div className="font-medium flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    {product.images?.length || 0}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Created {new Date(product.createdAt).toLocaleDateString()}
                </div>
                <div className="text-blue-600 dark:text-blue-400 text-xs font-medium">
                  Tap to view details
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-200 dark:border-gray-700 gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of {pagination.totalCount} products
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Previous
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        pagination.currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => onPageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Product Details Sidebar */}
      {showDetails && selectedProduct && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleCloseDetails} />
          <div className="relative w-full max-w-2xl h-full">
            <ProductDetails 
              product={selectedProduct} 
              onClose={handleCloseDetails} 
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductTable;