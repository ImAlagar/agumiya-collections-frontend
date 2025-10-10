import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Loader from '../../common/Loader';
import ProductDetails from './ProductDetails';
import { itemVariants, staggerVariants } from '../../../contexts/ProductsContext';
import { 
  Package, 
  Image as ImageIcon, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  MoreVertical,
  Globe
} from 'lucide-react';
import { useCurrency } from '../../../contexts/CurrencyContext'; // Adjust path as needed


const ProductTable = ({ 
  products, 
  isLoading, 
  pagination, 
  onPageChange, 
  onPageSizeChange, 
  onDeletePrintify 
}) => {
   const { formatPriceSimple, getCurrencySymbol } = useCurrency();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionMenu, setActionMenu] = useState(null);

  const handleRowClick = (product) => {
    setSelectedProduct(product);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedProduct(null);
  };

  const handleDeleteClick = (product, e) => {
    if (e) e.stopPropagation();
    setDeleteConfirm(product);
  };

const handleConfirmDelete = async () => {
  if (!deleteConfirm || !onDeletePrintify) return;
  
  console.log('🔄 Starting delete process:', {
    product: deleteConfirm.name,
    printifyProductId: deleteConfirm.printifyProductId
  });
  
  try {
    setIsDeleting(true);
    // Delete from Printify and local database
    const result = await onDeletePrintify('24454051', deleteConfirm.printifyProductId);
    console.log('✅ Delete result:', result);
    
    setDeleteConfirm(null);
    setActionMenu(null);
  } catch (error) {
    console.error('❌ Delete failed:', error);
    // Show error message to user
    alert(`Delete failed: ${error.message}`);
  } finally {
    setIsDeleting(false);
  }
};

  const handleCancelDelete = () => {
    setDeleteConfirm(null);
  };

  const toggleActionMenu = (productId, e) => {
    e.stopPropagation();
    setActionMenu(actionMenu === productId ? null : productId);
  };

  // Close action menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setActionMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

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
        {/* Page Size Selector */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total: {pagination?.totalCount || 0} products
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Show:</span>
            <select 
              value={pagination?.limit || 12}
              onChange={(e) => {
                onPageSizeChange && onPageSizeChange(Number(e.target.value));
              }}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={36}>36</option>
              <option value={48}>48</option>
            </select>
            <span className="text-sm text-gray-600 dark:text-gray-400">per page</span>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
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
                <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-400 w-20">Actions</th>
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
                        {product.printifyProductId && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" title="Synced with Printify" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          SKU: {product.sku || 'N/A'}
                          {product.printifyProductId && (
                            <span className="ml-2 text-green-600 dark:text-green-400">• Printify</span>
                          )}
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
                       {formatPriceSimple(product.price)}
                    </div>
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
                  <td className="p-4">
                    <div className="relative">
                      <button
                        onClick={(e) => toggleActionMenu(product.id, e)}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      {actionMenu === product.id && (
                        <div className="absolute right-0 top-10 z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg min-w-[160px]">
                          <button
                            onClick={(e) => handleDeleteClick(product, e)}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900 transition-colors"
                          >
                            <Globe className="w-4 h-4" />
                            Delete Printify
                          </button>
                        </div>
                      )}
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
                    {product.printifyProductId && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {product.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {product.category}
                      {product.printifyProductId && (
                        <span className="ml-2 text-green-600 dark:text-green-400">• Printify</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.inStock 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {product.inStock ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Price</div>
    <div className="font-semibold">{formatPriceSimple(product.price)}</div>
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
                <div className="flex gap-2">
                  <button
                    onClick={(e) => handleDeleteClick(product, e)}
                    className="p-1 text-orange-500 hover:bg-orange-50 rounded transition-colors text-xs"
                    title="Delete from Printify"
                  >
                    <Globe className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination - Keep existing pagination code */}
        {pagination && pagination.totalPages > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-200 dark:border-gray-700 gap-4"
          >
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of{' '}
              {pagination.totalCount} products
            </div>
            
            {pagination.totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPageChange && onPageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 text-sm font-medium"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                
                <div className="flex gap-1">
                  {(() => {
                    const pages = [];
                    const totalPages = pagination.totalPages;
                    const currentPage = pagination.currentPage;
                    
                    pages.push(
                      <button
                        key={1}
                        onClick={() => onPageChange && onPageChange(1)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 min-w-[40px] ${
                          currentPage === 1
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                            : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        1
                      </button>
                    );

                    if (currentPage > 3) {
                      pages.push(
                        <span key="ellipsis1" className="px-2 text-gray-500">
                          ...
                        </span>
                      );
                    }

                    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                      if (i !== 1 && i !== totalPages) {
                        pages.push(
                          <button
                            key={i}
                            onClick={() => onPageChange && onPageChange(i)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 min-w-[40px] ${
                              currentPage === i
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                                : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            {i}
                          </button>
                        );
                      }
                    }

                    if (currentPage < totalPages - 2) {
                      pages.push(
                        <span key="ellipsis2" className="px-2 text-gray-500">
                          ...
                        </span>
                      );
                    }

                    if (totalPages > 1) {
                      pages.push(
                        <button
                          key={totalPages}
                          onClick={() => onPageChange && onPageChange(totalPages)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 min-w-[40px] ${
                            currentPage === totalPages
                              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                              : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          {totalPages}
                        </button>
                      );
                    }

                    return pages;
                  })()}
                </div>

                <button
                  onClick={() => onPageChange && onPageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 text-sm font-medium"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                <Globe className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Delete Printify Product
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  This will delete from both Printify and local database
                </p>
              </div>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete <strong>"{deleteConfirm.name}"</strong>? 
              <span className="block mt-1 text-sm text-orange-600 dark:text-orange-400">
                This action will remove the product from your Printify store and local database.
              </span>
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader size="sm" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4" />
                    Delete Printify
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Product Details Sidebar */}
      {showDetails && selectedProduct && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleCloseDetails} />
          <div className="relative w-full max-w-2xl h-full">
            <ProductDetails 
              product={selectedProduct} 
              onClose={handleCloseDetails}
              onDeletePrintify={onDeletePrintify}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductTable;