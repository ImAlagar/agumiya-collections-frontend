// src/pages/admin/AdminOrders.js
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useOrders } from '../../../contexts/OrdersContext';
import OrderFilters from '../../../components/admin/order/OrderFilters';
import OrderTable from '../../../components/admin/order/OrderTable';
import { CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import OrderStats from '../../../components/admin/stats/OrderStats';
import StatusUpdateModal from '../../../components/admin/order/StatusUpdateModal';

const AdminOrders = () => {
  const {
    orders,
    isLoading,
    error,
    filters,
    pagination,
    fetchOrders,
    fetchOrderStats,
    updateOrderStatus,
    retryPrintifyOrder,
    adminCancelOrder,
    updateFilters,
    clearError
  } = useOrders();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdateOrder, setStatusUpdateOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [stats, setStats] = useState(null);
  const [localFilters, setLocalFilters] = useState(filters);
  const [successMessage, setSuccessMessage] = useState('');
  const [initialLoad, setInitialLoad] = useState(true);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setInitialLoad(true);
        
        // Load orders first - explicitly call with page 1
        await fetchOrders(1);
        
        // Load stats if available
        if (fetchOrderStats && typeof fetchOrderStats === 'function') {
          const statsResult = await fetchOrderStats();
          
          if (statsResult && typeof statsResult === 'object' && statsResult.success) {
            setStats(statsResult.stats);
          } else {
            console.warn('❌ [AdminOrders] Failed to load stats');
            setStats({
              total: orders?.length || 0,
              pending: 0,
              completed: 0,
              cancelled: 0,
              revenue: 0
            });
          }
        }
      } catch (error) {
        console.error('💥 [AdminOrders] Error loading data:', error);
      } finally {
        setInitialLoad(false);
      }
    };
    
    loadData();
  }, [fetchOrders, fetchOrderStats]);

  // Handle filter changes with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (JSON.stringify(localFilters) !== JSON.stringify(filters)) {
        updateFilters(localFilters);
        fetchOrders(1, localFilters);
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [localFilters, updateFilters, filters, fetchOrders]);

  // Handle page change
  const handlePageChange = (newPage) => {
    fetchOrders(newPage, localFilters);
  };

  // Handle page size change
  const handlePageSizeChange = (newLimit) => {
    const updatedFilters = { ...localFilters, limit: newLimit };
    setLocalFilters(updatedFilters);
    updateFilters(updatedFilters);
    fetchOrders(1, updatedFilters);
  };

  // View order details
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleUpdateStatus = async (orderId, statusData) => {
    try {
      setActionLoading(`status-${orderId}`);
      
      const result = await updateOrderStatus(orderId, statusData);
      
      if (result && result.success) {
        setSuccessMessage(`Order status updated successfully`);
        
        // Refresh orders to get updated data
        await fetchOrders(pagination?.currentPage || 1);
        
        // Refresh stats if available
        if (fetchOrderStats) {
          const statsResult = await fetchOrderStats();
          if (statsResult && statsResult.success) {
            setStats(statsResult.stats);
          }
        }
        
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error(result?.error || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Update status error:', error);
      setSuccessMessage(`Error: ${error.message}`);
      setTimeout(() => setSuccessMessage(''), 5000);
    } finally {
      setActionLoading(null);
    }
  };

  // Add function to open status modal
  const handleStatusUpdateClick = (order, e) => {
    e?.stopPropagation(); // Prevent row click
    setStatusUpdateOrder(order);
    setShowStatusModal(true);
  };
  
  const handleCancelOrder = async (orderId, reason) => {
    try {
      setActionLoading(`cancel-${orderId}`);
      const result = await adminCancelOrder(orderId, reason);
      
      if (result && result.success) {
        setSuccessMessage(`Order #${orderId} cancelled successfully`);
        
        // Refresh orders and stats
        await fetchOrders(pagination?.currentPage || 1);
        
        if (fetchOrderStats && typeof fetchOrderStats === 'function') {
          const statsResult = await fetchOrderStats();
          if (statsResult && statsResult.success) {
            setStats(statsResult.stats);
          }
        }
        
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error(result?.error || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Cancel order error:', error);
      setSuccessMessage(`Error: ${error.message}`);
      setTimeout(() => setSuccessMessage(''), 5000);
    } finally {
      setActionLoading(null);
    }
  };

  const handleFilterChange = (newFilters) => {
    setLocalFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleRefresh = async () => {
    try {
      await fetchOrders(pagination?.currentPage || 1);
      
      if (fetchOrderStats) {
        const statsResult = await fetchOrderStats();
        if (statsResult && statsResult.success) {
          setStats(statsResult.stats);
        }
      }
      
      setSuccessMessage('Orders refreshed successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Refresh error:', error);
    }
  };

  // Ensure orders is always an array when passing to components
  const safeOrders = Array.isArray(orders) ? orders : [];

  if (error && initialLoad) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center h-64 p-4"
      >
        <div className="text-center max-w-sm">
          <div className="w-10 h-10 sm:w-12 sm:h-12 text-red-500 mx-auto mb-3 sm:mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Error Loading Orders
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 break-words">{error}</p>
          <button
            onClick={() => {
              clearError();
              fetchOrders(1);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4 sm:space-y-6 px-2 sm:px-0"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Order Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            Manage and track customer orders
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto justify-start sm:justify-end">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 text-sm sm:text-base w-full sm:w-auto justify-center"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="sm:block">Refresh</span>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4 sm:mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 sm:p-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-400 mr-2" />
              <span className="text-sm sm:text-base text-red-800 dark:text-red-200 break-words">{error}</span>
            </div>
            <button
              onClick={clearError}
              className="text-red-800 dark:text-red-200 hover:text-red-900 dark:hover:text-red-100 font-medium text-sm sm:text-base self-end sm:self-auto mt-2 sm:mt-0"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      )}

      {/* Success Alert */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4 sm:mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 sm:p-4"
        >
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mr-2" />
            <span className="text-sm sm:text-base text-green-800 dark:text-green-200 break-words">{successMessage}</span>
          </div>
        </motion.div>
      )}

      {/* Order Statistics Dashboard */}
      <div className="px-1 sm:px-0">
        <OrderStats orders={safeOrders} stats={stats} />
      </div>

      {/* Filters Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
        <OrderFilters
          filters={localFilters}
          onFilterChange={handleFilterChange}
          onClearFilters={() => {
            const defaultFilters = {
              search: '',
              status: 'all',
              paymentStatus: 'all',
              sortBy: 'createdAt',
              sortOrder: 'desc',
              limit: 5
            };
            setLocalFilters(defaultFilters);
            updateFilters(defaultFilters);
            fetchOrders(1, defaultFilters);
          }}
        />
      </div>

      {/* Orders Table Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <OrderTable
            orders={safeOrders}
            isLoading={isLoading}
            pagination={pagination}
            onViewOrder={handleViewOrder}
            onStatusUpdate={handleStatusUpdateClick}
            onCancelOrder={handleCancelOrder}
            actionLoading={actionLoading}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      </div>

      {/* Status Update Modal */}
      <StatusUpdateModal
        order={statusUpdateOrder}
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          setStatusUpdateOrder(null);
        }}
        onUpdateStatus={handleUpdateStatus}
        isLoading={actionLoading === `status-${statusUpdateOrder?.id}`}
      />

      {/* Loading Indicator */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-4 right-4 bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm sm:text-base max-w-[90vw] z-50"
        >
          <RefreshCw className="w-4 h-4 animate-spin flex-shrink-0" />
          <span className="truncate">Loading Orders...</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdminOrders;