import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

const StatusUpdateModal = ({ 
  order, 
  isOpen, 
  onClose, 
  onUpdateStatus,
  isLoading 
}) => {
  const [statusData, setStatusData] = useState({
    paymentStatus: '',
    fulfillmentStatus: ''
  });

  useEffect(() => {
    if (order) {
      setStatusData({
        paymentStatus: order.paymentStatus || '',
        fulfillmentStatus: order.fulfillmentStatus || ''
      });
    }
  }, [order]);

  const paymentStatusOptions = [
    { value: 'PENDING', label: 'Pending', color: 'text-yellow-600' },
    { value: 'SUCCEEDED', label: 'Succeeded', color: 'text-green-600' },
    { value: 'FAILED', label: 'Failed', color: 'text-red-600' },
    { value: 'REFUND_PENDING', label: 'Refund Pending', color: 'text-orange-600' },
    { value: 'REFUNDED', label: 'Refunded', color: 'text-gray-600' },
    { value: 'PARTIALLY_REFUNDED', label: 'Partially Refunded', color: 'text-blue-600' }
  ];

  const fulfillmentStatusOptions = [
    { value: 'PLACED', label: 'Placed', color: 'text-yellow-600' },
    { value: 'PROCESSING', label: 'Processing', color: 'text-purple-600' },
    { value: 'SHIPPED', label: 'Shipped', color: 'text-indigo-600' },
    { value: 'DELIVERED', label: 'Delivered', color: 'text-green-600' },
    { value: 'CANCELLED', label: 'Cancelled', color: 'text-red-600' },
    { value: 'FAILED', label: 'Failed', color: 'text-red-600' },
    { value: 'PRINTIFY_FAILED', label: 'Printify Failed', color: 'text-red-600' }
  ];

  const handleStatusChange = (field, value) => {
    setStatusData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setStatusData({
      paymentStatus: order?.paymentStatus || '',
      fulfillmentStatus: order?.fulfillmentStatus || ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasPaymentChange = statusData.paymentStatus && statusData.paymentStatus !== order.paymentStatus;
    const hasFulfillmentChange = statusData.fulfillmentStatus && statusData.fulfillmentStatus !== order.fulfillmentStatus;

    if (!hasPaymentChange && !hasFulfillmentChange) {
      alert('Please select at least one status different from the current status');
      return;
    }

    const updateData = {};
    if (hasPaymentChange) updateData.paymentStatus = statusData.paymentStatus;
    if (hasFulfillmentChange) updateData.fulfillmentStatus = statusData.fulfillmentStatus;

    try {
      await onUpdateStatus(order.id, updateData);
      onClose();
    } catch (error) {
      console.error('Status update error:', error);
      alert(error.message || 'Failed to update order status');
    }
  };

  if (!isOpen || !order) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <RefreshCw className="text-blue-600 dark:text-blue-400" size={22} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                Update Order Status
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                Order #{order?.orderNumber || order?.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Status */}
        <div className="mb-5 sm:mb-6 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm sm:text-base">
            Current Status
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Payment:</span>
              <div className="font-medium text-gray-900 dark:text-white capitalize">
                {order?.paymentStatus?.toLowerCase().replace('_', ' ') || 'N/A'}
              </div>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Fulfillment:</span>
              <div className="font-medium text-gray-900 dark:text-white capitalize">
                {order?.fulfillmentStatus?.toLowerCase() || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Update Payment Status
            </label>
            <div className="space-y-1 sm:space-y-2">
              {paymentStatusOptions.map(option => (
                <label key={option.value} className="flex items-center gap-2 sm:gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="paymentStatus"
                    value={option.value}
                    checked={statusData.paymentStatus === option.value}
                    onChange={(e) => handleStatusChange('paymentStatus', e.target.value)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className={`text-xs sm:text-sm font-medium ${option.color} group-hover:opacity-80`}>
                    {option.label}
                  </span>
                  {statusData.paymentStatus === option.value && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </label>
              ))}
              <button
                type="button"
                onClick={() => handleStatusChange('paymentStatus', '')}
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mt-1"
              >
                Clear selection
              </button>
            </div>
          </div>

          {/* Fulfillment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Update Fulfillment Status
            </label>
            <div className="space-y-1 sm:space-y-2">
              {fulfillmentStatusOptions.map(option => (
                <label key={option.value} className="flex items-center gap-2 sm:gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="fulfillmentStatus"
                    value={option.value}
                    checked={statusData.fulfillmentStatus === option.value}
                    onChange={(e) => handleStatusChange('fulfillmentStatus', e.target.value)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className={`text-xs sm:text-sm font-medium ${option.color} group-hover:opacity-80`}>
                    {option.label}
                  </span>
                  {statusData.fulfillmentStatus === option.value && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </label>
              ))}
              <button
                type="button"
                onClick={() => handleStatusChange('fulfillmentStatus', '')}
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mt-1"
              >
                Clear selection
              </button>
            </div>
          </div>

          {/* Cancellation warning */}
          {(statusData.fulfillmentStatus === 'CANCELLED' && order?.fulfillmentStatus !== 'CANCELLED') && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                <span className="font-medium text-yellow-800 dark:text-yellow-200">
                  This will cancel the order
                </span>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={resetForm}
              className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-1/2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Update Status
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default StatusUpdateModal;
