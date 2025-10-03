import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useProducts } from '../../../contexts/ProductsContext';
import ProductTable from '../../../components/admin/products/ProductTable';
import ProductFilters from '../../../components/admin/products/ProductFilters';
import SyncProducts from '../../../components/admin/products/SyncProducts';
import { pageVariants, pageTransition } from '../../../contexts/ProductsContext';
import { RefreshCwIcon } from 'lucide-react';
import ProductStats from '../../../components/admin/stats/ProductStats';

const AdminProduct = () => {
   const { 
    products, 
    isLoading, 
    error, 
    pagination, 
    filters,
    fetchProducts, 
    syncProducts,
    updateFilters,
    updatePageSize,
    clearError 
  } = useProducts();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (JSON.stringify(localFilters) !== JSON.stringify(filters)) {
        updateFilters(localFilters);
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [localFilters, updateFilters, filters]);

  const handlePageChange = (page) => {
    fetchProducts(page);
  };

  const handlePageSizeChange = (newSize) => {
    updatePageSize(newSize);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleFilterChange = (newFilters) => {
    setLocalFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleRefresh = () => {
    fetchProducts(pagination.currentPage);
  };

  const handleSync = async () => {
    try {
      const result = await syncProducts();
      return result;
    } catch (error) {
      throw error;
    }
  };

  // Debug pagination
  useEffect(() => {
    console.log('📊 Current pagination state:', {
      productsCount: products.length,
      pagination,
      filters
    });
  }, [products, pagination, filters]);

  if (error) {
    return (
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="flex items-center justify-center h-64"
      >
        <div className="text-center">
          <div className="w-12 h-12 text-red-500 mx-auto mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Error Loading Products
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={clearError}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="space-y-6"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Product Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your products and inventory
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <SyncProducts onSync={handleSync} />
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            <RefreshCwIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Statistics Section */}
      <ProductStats products={products} />

      {/* Filters Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <ProductFilters
          filters={localFilters}
          onFilterChange={handleFilterChange}
          isLoading={isLoading}
        />
      </div>

      {/* Products Table Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <ProductTable
          products={products}
          isLoading={isLoading}
          pagination={pagination}
          onEdit={handleEdit}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>

        {/* Sync Status Banner */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2"
          >
            <RefreshCwIcon className="w-4 h-4 animate-spin" />
            <span>Loading products...</span>
          </motion.div>
        )}
        
    </motion.div>
  );
};

export default AdminProduct