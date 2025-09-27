// src/components/admin/dashboard/RefundsReturns.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const RefundsReturns = ({ data }) => {
  // Use actual API data
  const refundData = data || {
    totalRefunds: 0,
    refundRate: 0,
    refundCount: 0,
    failedCount: 0
  };

  const stats = [
    {
      label: 'Total Refund Amount',
      value: `$${refundData.totalRefunds.toLocaleString()}`,
      icon: RefreshCw,
      color: 'text-red-600',
      bg: 'bg-red-100 dark:bg-red-900/30'
    },
    {
      label: 'Refund Rate',
      value: `${refundData.refundRate}%`,
      icon: AlertTriangle,
      color: refundData.refundRate > 5 ? 'text-red-600' : 'text-yellow-600',
      bg: refundData.refundRate > 5 ? 'bg-red-100 dark:bg-red-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'
    },
    {
      label: 'Refund Requests',
      value: refundData.refundCount,
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      label: 'Failed Refunds',
      value: refundData.failedCount,
      icon: XCircle,
      color: 'text-red-600',
      bg: 'bg-red-100 dark:bg-red-900/30'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Refunds & Returns</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Manage and track refund requests</p>
        </div>
        <motion.div
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.5 }}
          className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg"
        >
          <RefreshCw className="w-6 h-6 text-red-600 dark:text-red-400" />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-xl ${stat.bg} backdrop-blur-sm`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm"
                >
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {refundData.refundCount > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4"
        >
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Refund Processing</span>
            <span>{refundData.refundCount - refundData.failedCount} processed</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ 
                width: `${((refundData.refundCount - refundData.failedCount) / refundData.refundCount) * 100}%` 
              }}
              transition={{ duration: 1, delay: 0.6 }}
              className="bg-blue-500 h-2 rounded-full"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Processed: {refundData.refundCount - refundData.failedCount}</span>
            <span>Failed: {refundData.failedCount}</span>
            <span>Total: {refundData.refundCount}</span>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-4"
        >
          <p className="text-gray-500 text-sm">No refund requests yet</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default RefundsReturns;