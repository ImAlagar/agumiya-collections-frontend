// src/components/admin/dashboard/BestSellingProducts.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Award, TrendingUp, TrendingDown, Package } from 'lucide-react';
import { useCurrency } from '../../../contexts/CurrencyContext';

const BestSellingProducts = ({ data }) => {
  const { formatPriceSimple } = useCurrency();

  // Use actual API data
  const products = data || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Best Selling Products</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Top performing products by revenue</p>
        </div>
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg"
        >
          <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
        </motion.div>
      </div>

      {products.length > 0 ? (
        <motion.div variants={containerVariants} className="space-y-3">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02, x: 5 }}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.sales || 0} units sold</p>
                </div>
              </div>
              
              <div className="text-right">
                {/* ✅ CHANGED: Use formatPriceSimple instead of hardcoded $ */}
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatPriceSimple(product.revenue || 0)}
                </p>
                <div className={`flex items-center justify-end text-sm ${
                  (product.growth || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {(product.growth || 0) >= 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {(product.growth || 0) >= 0 ? '+' : ''}{product.growth || 0}%
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">No sales data yet</p>
          <p className="text-gray-400 text-sm mt-2">Best-selling products will appear here</p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600"
      >
        <button className="w-full py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
          View all products →
        </button>
      </motion.div>
    </motion.div>
  );
};

export default BestSellingProducts;