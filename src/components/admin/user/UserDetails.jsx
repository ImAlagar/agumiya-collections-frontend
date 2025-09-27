// src/components/admin/user/UserDetails.js
import React from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  ShoppingCart, 
  DollarSign, 
  CheckCircle, 
  XCircle,
  Loader 
} from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import UserOrderStats from './UserOrderStats';

const UserDetails = ({ user, onClose, onStatusUpdate, isLoading }) => {
  const { theme } = useTheme();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusBadge = (isActive) => {
    if (isActive) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
          <CheckCircle className="w-4 h-4 mr-1" />
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
        <XCircle className="w-4 h-4 mr-1" />
        Inactive
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      'SUCCEEDED': { color: 'green', label: 'Success' },
      'PENDING': { color: 'yellow', label: 'Pending' },
      'FAILED': { color: 'red', label: 'Failed' },
      'REFUNDED': { color: 'blue', label: 'Refunded' }
    };

    const config = statusConfig[status] || { color: 'gray', label: status };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-${config.color}-100 text-${config.color}-800 dark:bg-${config.color}-900/20 dark:text-${config.color}-300`}>
        {config.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30 }}
        className="h-full bg-white dark:bg-gray-800 shadow-xl overflow-y-auto"
      >
        <div className="flex items-center justify-center h-full">
          <Loader className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </motion.div>
    );
  }

  if (!user) {
    return (
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30 }}
        className="h-full bg-white dark:bg-gray-800 shadow-xl overflow-y-auto"
      >
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 dark:text-gray-400">No user data available</p>
        </div>
      </motion.div>
    );
  }

  const totalSpent = user.orders?.reduce((sum, order) => sum + (order.totalAmount || 0), 0) || 0;
  const successfulOrders = user.orders?.filter(order => order.paymentStatus === 'SUCCEEDED').length || 0;

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30 }}
      className="h-full rounded-l-2xl border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto flex flex-col"
    >
      <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            User Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* User Profile Section */}
        <section>
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {user.name}
              </h3>
              <div className="flex items-center space-x-4 mt-2">
                {getStatusBadge(user.isActive)}
                <button
                  onClick={() => onStatusUpdate(user)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                >
                  {user.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-gray-900 dark:text-white">{user.email}</p>
                <span className={`text-xs ${user.emailVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                  {user.emailVerified ? 'Verified' : 'Unverified'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                <p className="text-gray-900 dark:text-white">{user.phone || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Registered</p>
                <p className="text-gray-900 dark:text-white">{formatDate(user.createdAt)}</p>
              </div>
            </div>

            {user.address && (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                  <p className="text-gray-900 dark:text-white">{user.address}</p>
                </div>
              </div>
            )}
          </div>
        </section>

            <section>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Order Statistics</h4>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                <UserOrderStats user={user} />
            </div>
            </section>
        {/* Recent Orders */}
        {user.orders && user.orders.length > 0 && (
          <section>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Orders</h4>
            <div className="space-y-3">
              {user.orders.slice(0, 5).map((order) => (
                <div key={order.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Order #{order.id}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(order.totalAmount)}
                      </p>
                      <div className="mt-1">
                        {getPaymentStatusBadge(order.paymentStatus)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {(!user.orders || user.orders.length === 0) && (
          <section>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Order History</h4>
            <div className="text-center py-8 border border-gray-200 dark:border-gray-700 rounded-lg">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No orders found for this user</p>
            </div>
          </section>
        )}
      </div>
    </motion.div>
  );
};

export default UserDetails;