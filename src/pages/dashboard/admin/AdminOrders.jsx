// src/pages/admin/AdminOrders.js
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useOrders } from '../../../contexts/OrdersContext';
import OrderFilters from '../../../components/admin/order/OrderFilters';
import OrderTable from '../../../components/admin/order/OrderTable';
import { CheckCircle, TrainTrackIcon, RefreshCwIcon } from 'lucide-react';
import OrderStats from '../../../components/admin/stats/OrderStats';

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
    updateFilters,
    clearError
  } = useOrders();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdateOrder, setStatusUpdateOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [stats, setStats] = useState(null);
  const [localFilters, setLocalFilters] = useState(filters);

  // ✅ FIXED: Safe data loading with proper error handling
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🔄 Starting data load...');
        
        // Load orders first
        await fetchOrders();
        console.log('✅ Orders loaded successfully');
        
        // ✅ SAFE: Check if fetchOrderStats exists and handle undefined
        if (fetchOrderStats && typeof fetchOrderStats === 'function') {
          console.log('🔄 Fetching order stats...');
          const statsResult = await fetchOrderStats();
          console.log('📊 Stats result:', statsResult);
          
          // ✅ SAFE: Check if statsResult exists and has success property
          if (statsResult && typeof statsResult === 'object' && statsResult.success) {
            console.log('✅ Stats loaded successfully:', statsResult.stats);
            setStats(statsResult.stats);
          } else {
            console.warn('❌ Failed to load stats - invalid response:', statsResult);
            // Set default stats to prevent errors
            setStats({
              total: orders?.length || 0,
              pending: 0,
              completed: 0,
              cancelled: 0,
              revenue: 0
            });
          }
        } else {
          console.warn('⚠️ fetchOrderStats is not available as a function');
          // Set default stats
          setStats({
            total: orders?.length || 0,
            pending: 0,
            completed: 0,
            cancelled: 0,
            revenue: 0
          });
        }
      } catch (error) {
        console.error('💥 Error loading data:', error);
        // Set default stats on error
        setStats({
          total: orders?.length || 0,
          pending: 0,
          completed: 0,
          cancelled: 0,
          revenue: 0
        });
      }
    };
    
    loadData();
  }, [fetchOrders, fetchOrderStats, orders?.length]);

  // Handle filter changes with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (JSON.stringify(localFilters) !== JSON.stringify(filters)) {
        updateFilters(localFilters);
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [localFilters, updateFilters, filters]);

  // Handle page change
  const handlePageChange = (newPage) => {
    fetchOrders(newPage);
  };

  // View order details
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  // Update order status
  const handleStatusUpdate = (order) => {
    setStatusUpdateOrder(order);
    setShowStatusModal(true);
  };

  const handleStatusConfirm = async (newStatus) => {
    try {
      setActionLoading('status-update');
      const result = await updateOrderStatus(statusUpdateOrder.id, { status: newStatus });
      
      // ✅ SAFE: Check if result exists
      if (result && result.success) {
        setShowStatusModal(false);
        setStatusUpdateOrder(null);
        
        // Refresh orders and stats with safe handling
        await fetchOrders(pagination.currentPage);
        
        if (fetchOrderStats) {
          const statsResult = await fetchOrderStats();
          if (statsResult && statsResult.success) {
            setStats(statsResult.stats);
          }
        }
      }
    } catch (error) {
      console.error('Status update error:', error);
    } finally {
      setActionLoading(null);
    }
  };

  // Retry Printify forwarding
  const handleRetryPrintify = async (orderId) => {
    try {
      setActionLoading(`retry-${orderId}`);
      const result = await retryPrintifyOrder(orderId);
      
      // ✅ SAFE: Check if result exists
      if (result && result.success) {
        await fetchOrders(pagination.currentPage);
      }
    } catch (error) {
      console.error('Retry Printify error:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleFilterChange = (newFilters) => {
    setLocalFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleRefresh = async () => {
    try {
      await fetchOrders(pagination.currentPage);
      
      // ✅ SAFE: Refresh stats with proper checking
      if (fetchOrderStats) {
        const statsResult = await fetchOrderStats();
        if (statsResult && statsResult.success) {
          setStats(statsResult.stats);
        }
      }
    } catch (error) {
      console.error('Refresh error:', error);
    }
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center h-64"
      >
        <div className="text-center">
          <div className="w-12 h-12 text-red-500 mx-auto mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Error Loading Orders
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Order Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and track customer orders
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
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

      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TrainTrackIcon className="h-5 w-5 text-red-400 mr-2" />
              <span className="text-red-800 dark:text-red-200">{error}</span>
            </div>
            <button
              onClick={clearError}
              className="text-red-800 dark:text-red-200 hover:text-red-900 dark:hover:text-red-100 font-medium"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      )}

      {/* Success Alert */}
      {actionLoading === 'success' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
        >
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
            <span className="text-green-800 dark:text-green-200">Action completed successfully</span>
          </div>
        </motion.div>
      )}

      {/* Order Statistics Dashboard */}
      <OrderStats orders={orders} stats={stats} />

      {/* Filters Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <OrderFilters
          filters={localFilters}
          onFilterChange={handleFilterChange}
          onClearFilters={() => setLocalFilters({
            search: '',
            status: 'all',
            paymentStatus: 'all',
            sortBy: 'createdAt',
            sortOrder: 'desc'
          })}
        />
      </div>

      {/* Orders Table Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <OrderTable
          orders={orders}
          isLoading={isLoading}
          pagination={pagination}
          onViewOrder={handleViewOrder}
          onUpdateStatus={handleStatusUpdate}
          onRetryPrintify={handleRetryPrintify}
          actionLoading={actionLoading}
          onPageChange={handlePageChange}
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
          <span>Loading Orders...</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdminOrders;