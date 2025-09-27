// src/components/admin/dashboard/OrderVolume.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, RefreshCw, Truck, CheckCircle, Package } from 'lucide-react';

const OrderVolume = ({ data }) => {
  // Use actual API data structure
  const orderStats = data?.stats || [];
  const totalOrders = data?.totalOrders || 0;

  const getStatusConfig = (status) => {
    const configs = {
      PLACED: { 
        icon: ShoppingCart, 
        color: 'blue', 
        bg: 'bg-blue-100 dark:bg-blue-900/30', 
        text: 'text-blue-600 dark:text-blue-400',
        label: 'Placed'
      },
      PROCESSING: { 
        icon: RefreshCw, 
        color: 'yellow', 
        bg: 'bg-yellow-100 dark:bg-yellow-900/30', 
        text: 'text-yellow-600 dark:text-yellow-400',
        label: 'Processing'
      },
      SHIPPED: { 
        icon: Truck, 
        color: 'purple', 
        bg: 'bg-purple-100 dark:bg-purple-900/30', 
        text: 'text-purple-600 dark:text-purple-400',
        label: 'Shipped'
      },
      DELIVERED: { 
        icon: CheckCircle, 
        color: 'green', 
        bg: 'bg-green-100 dark:bg-green-900/30', 
        text: 'text-green-600 dark:text-green-400',
        label: 'Delivered'
      },
      PENDING: {
        icon: ShoppingCart,
        color: 'blue',
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-600 dark:text-blue-400',
        label: 'Pending'
      },
      COMPLETED: {
        icon: CheckCircle,
        color: 'green',
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-600 dark:text-green-400',
        label: 'Completed'
      }
    };
    
    const safeStatus = status && typeof status === 'string' ? status.toUpperCase() : 'UNKNOWN';
    return configs[safeStatus] || configs.PENDING;
  };

  const deliveredOrders = orderStats.find(s => s.fulfillmentStatus === 'DELIVERED')?._count?.id || 
                         orderStats.find(s => s.fulfillmentStatus === 'COMPLETED')?._count?.id || 0;
  const fulfillmentPercentage = totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 0;

  // Transform API data to match component expectations
  const displayStats = orderStats.map(stat => ({
    status: stat.fulfillmentStatus,
    count: stat._count?.id || 0,
    amount: stat._sum?.totalAmount || 0
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Order Volume Tracking</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Real-time order status overview</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalOrders.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Total Orders</p>
        </div>
      </div>

      {displayStats.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {displayStats.map((stat, index) => {
              const config = getStatusConfig(stat.status);
              const Icon = config.icon;
              
              return (
                <motion.div
                  key={stat.status || `stat-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className={`p-4 rounded-xl ${config.bg} text-center backdrop-blur-sm`}
                >
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                    <Icon className={`w-6 h-6 ${config.text}`} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.count.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {config.label.toLowerCase()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    ${stat.amount.toLocaleString()}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Order Progress Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6"
          >
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Order Fulfillment Progress</span>
              <span>{fulfillmentPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${fulfillmentPercentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-green-500 h-2 rounded-full"
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Completed: {deliveredOrders.toLocaleString()}</span>
              <span>In Progress: {(totalOrders - deliveredOrders).toLocaleString()}</span>
            </div>
          </motion.div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">No orders yet</p>
          <p className="text-gray-400 text-sm mt-2">Order statistics will appear here</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default OrderVolume;