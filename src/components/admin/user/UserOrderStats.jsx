// src/components/admin/user/UserOrderStats.js
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, CheckCircle, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

const UserOrderStats = ({ user }) => {
  // Safe data extraction
  const orders = user?.orders || [];
  const totalSpent = orders.reduce((sum, order) => sum + (order?.totalAmount || 0), 0);
  const successfulOrders = orders.filter(order => order?.paymentStatus === 'SUCCEEDED').length;
  const totalOrders = orders.length;
  const successRate = totalOrders > 0 ? Math.round((successfulOrders / totalOrders) * 100) : 0;
  const avgOrder = totalOrders > 0 ? totalSpent / totalOrders : 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const statCards = [
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: ShoppingCart,
      color: 'blue',
      description: 'All time orders',
      trend: totalOrders > 0 ? 'up' : 'neutral'
    },
    {
      title: 'Successful Orders',
      value: successfulOrders,
      icon: CheckCircle,
      color: 'green',
      description: `${successRate}% success rate`,
      trend: successfulOrders > 0 ? 'up' : 'neutral'
    },
    {
      title: 'Total Spent',
      value: formatCurrency(totalSpent),
      icon: DollarSign,
      color: 'purple',
      description: 'Lifetime value',
      trend: totalSpent > 0 ? 'up' : 'neutral'
    },
    {
      title: 'Avg. Order Value',
      value: formatCurrency(avgOrder),
      icon: DollarSign,
      color: 'orange',
      description: 'Average per order',
      trend: avgOrder > 0 ? 'up' : 'neutral'
    }
  ];

  // Color classes that work with Tailwind's JIT compiler
  const getColorClasses = (color) => {
    const baseClasses = {
      blue: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        text: 'text-blue-600 dark:text-blue-400',
        icon: 'text-blue-500 dark:text-blue-400',
        border: 'border-blue-200 dark:border-blue-800'
      },
      green: {
        bg: 'bg-green-50 dark:bg-green-900/20',
        text: 'text-green-600 dark:text-green-400',
        icon: 'text-green-500 dark:text-green-400',
        border: 'border-green-200 dark:border-green-800'
      },
      purple: {
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        text: 'text-purple-600 dark:text-purple-400',
        icon: 'text-purple-500 dark:text-purple-400',
        border: 'border-purple-200 dark:border-purple-800'
      },
      orange: {
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        text: 'text-orange-600 dark:text-orange-400',
        icon: 'text-orange-500 dark:text-orange-400',
        border: 'border-orange-200 dark:border-orange-800'
      }
    };
    return baseClasses[color] || baseClasses.blue;
  };

  // If no orders, show a placeholder message
  if (totalOrders === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-6 sm:py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg"
      >
        <AlertCircle className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">No order history available</p>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 mt-1">
          This user hasn't placed any orders yet
        </p>
      </motion.div>
    );
  }

  const TrendIndicator = ({ trend, color }) => {
    const isPositive = trend === 'up';
    const colors = getColorClasses(color);
    
    if (trend === 'neutral') return null;
    
    return (
      <div className={`ml-1 sm:ml-2 inline-flex items-center ${isPositive ? colors.text : 'text-red-500'}`}>
        <TrendingUp className={`w-3 h-3 sm:w-4 sm:h-4 ${isPositive ? '' : 'rotate-180'}`} />
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        const colors = getColorClasses(stat.color);
        
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className={`${colors.bg} ${colors.border} rounded-lg p-3 sm:p-4 border-2 min-h-[90px] sm:min-h-[100px] flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 truncate">
                  {stat.title}
                </p>
                <div className="flex items-center">
                  <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                    {stat.value}
                  </p>
                  <TrendIndicator trend={stat.trend} color={stat.color} />
                </div>
              </div>
              
              <div className={`p-1 sm:p-2 rounded-lg ${colors.bg} flex-shrink-0 ml-2`}>
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${colors.icon}`} />
              </div>
            </div>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {stat.description}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
};

export default UserOrderStats;