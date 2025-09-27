// src/components/admin/OrderStatsDashboard.js
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, CheckCircle, DollarSign, TrendingUp } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

const OrderStatsDashboard = ({ orders }) => {
  const { theme } = useTheme();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const totalSpent = orders?.reduce((sum, order) => sum + (order.totalAmount || 0), 0) || 0;
  const successfulOrders = orders?.filter(order => order.paymentStatus === 'SUCCEEDED').length || 0;
  const totalOrders = orders?.length || 0;
  const avgOrder = totalOrders > 0 ? totalSpent / totalOrders : 0;

  const statCards = [
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: ShoppingCart,
      color: 'blue',
      change: totalOrders,
      trend: 'up'
    },
    {
      title: 'Successful Orders',
      value: successfulOrders,
      icon: CheckCircle,
      color: 'green',
      percentage: totalOrders > 0 ? Math.round((successfulOrders / totalOrders) * 100) : 0,
      trend: successfulOrders > 0 ? 'up' : 'neutral'
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(totalSpent),
      icon: DollarSign,
      color: 'purple',
      trend: totalSpent > 0 ? 'up' : 'neutral'
    },
    {
      title: 'Avg. Order Value',
      value: formatCurrency(avgOrder),
      icon: DollarSign,
      color: 'orange',
      trend: avgOrder > 0 ? 'up' : 'neutral'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: theme === 'dark' ? 'bg-blue-900/20' : theme === 'smokey' ? 'bg-blue-800/10' : 'bg-blue-50',
        hoverBg: theme === 'dark' ? 'hover:bg-blue-900/30' : theme === 'smokey' ? 'hover:bg-blue-800/20' : 'hover:bg-blue-100',
        text: 'text-blue-600',
        icon: theme === 'dark' ? 'text-blue-400' : 'text-blue-500',
        border: 'border-blue-200 dark:border-blue-800',
        progress: theme === 'dark' ? 'bg-blue-400/30' : 'bg-blue-500/20'
      },
      green: {
        bg: theme === 'dark' ? 'bg-green-900/20' : theme === 'smokey' ? 'bg-green-800/10' : 'bg-green-50',
        hoverBg: theme === 'dark' ? 'hover:bg-green-900/30' : theme === 'smokey' ? 'hover:bg-green-800/20' : 'hover:bg-green-100',
        text: 'text-green-600',
        icon: theme === 'dark' ? 'text-green-400' : 'text-green-500',
        border: 'border-green-200 dark:border-green-800',
        progress: theme === 'dark' ? 'bg-green-400/30' : 'bg-green-500/20'
      },
      purple: {
        bg: theme === 'dark' ? 'bg-purple-900/20' : theme === 'smokey' ? 'bg-purple-800/10' : 'bg-purple-50',
        hoverBg: theme === 'dark' ? 'hover:bg-purple-900/30' : theme === 'smokey' ? 'hover:bg-purple-800/20' : 'hover:bg-purple-100',
        text: 'text-purple-600',
        icon: theme === 'dark' ? 'text-purple-400' : 'text-purple-500',
        border: 'border-purple-200 dark:border-purple-800',
        progress: theme === 'dark' ? 'bg-purple-400/30' : 'bg-purple-500/20'
      },
      orange: {
        bg: theme === 'dark' ? 'bg-orange-900/20' : theme === 'smokey' ? 'bg-orange-800/10' : 'bg-orange-50',
        hoverBg: theme === 'dark' ? 'hover:bg-orange-900/30' : theme === 'smokey' ? 'hover:bg-orange-800/20' : 'hover:bg-orange-100',
        text: 'text-orange-600',
        icon: theme === 'dark' ? 'text-orange-400' : 'text-orange-500',
        border: 'border-orange-200 dark:border-orange-800',
        progress: theme === 'dark' ? 'bg-orange-400/30' : 'bg-orange-500/20'
      }
    };
    return colors[color] || colors.blue;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.5
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        duration: 0.2
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.3
      }
    },
    hover: {
      rotate: 360,
      scale: 1.1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
        duration: 0.3
      }
    }
  };

  const valueVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 0.2
      }
    }
  };

  const TrendIndicator = ({ trend, color }) => {
    const isPositive = trend === 'up';
    const colors = getColorClasses(color);
    
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        className={`ml-2 inline-flex items-center ${isPositive ? colors.text : 'text-red-500'}`}
      >
        <TrendingUp className={`w-4 h-4 ${isPositive ? '' : 'rotate-180'}`} />
      </motion.div>
    );
  };

  if (!orders || orders.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center"
      >
        <p className="text-gray-500 dark:text-gray-400">No order data available</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mb-6"
    >
      <div className=" dark:bg-gray-800 rounded-lg shadow-sm  dark:border-gray-700 ">

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            const colors = getColorClasses(stat.color);
            
            return (
              <motion.div
                key={stat.title}
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
                className={`${colors.bg} ${colors.hoverBg} ${colors.border} rounded-xl p-6 border-2 cursor-pointer shadow-sm hover:shadow-lg transition-shadow duration-300 backdrop-blur-sm`}
              >
                <div className="flex items-center justify-between">
                  <motion.div variants={valueVariants} className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      {stat.title}
                    </p>
                    <div className="flex items-baseline">
                      <motion.p 
                        className="text-3xl font-bold text-gray-900 dark:text-white"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 200, 
                          delay: 0.4 + index * 0.1 
                        }}
                      >
                        {stat.value}
                      </motion.p>
                      {stat.trend && <TrendIndicator trend={stat.trend} color={stat.color} />}
                    </div>
                    
                    <motion.div 
                      className="mt-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      {stat.change && typeof stat.change === 'number' && (
                        <p className={`text-sm font-medium ${colors.text} flex items-center`}>
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {stat.change.toLocaleString()} orders
                        </p>
                      )}
                      {stat.percentage && (
                        <p className={`text-sm font-medium ${colors.text}`}>
                          {stat.percentage}% success rate
                        </p>
                      )}
                    </motion.div>
                  </motion.div>
                  
                  <motion.div
                    variants={iconVariants}
                    whileHover="hover"
                    className={`p-3 rounded-2xl ${colors.bg} backdrop-blur-sm border ${colors.border}`}
                  >
                    <Icon className={`w-7 h-7 ${colors.icon}`} />
                  </motion.div>
                </div>

                {/* Animated progress bar for percentages */}
                {stat.percentage && (
                  <motion.div 
                    className="mt-4 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.8, duration: 1 }}
                  >
                    <motion.div
                      className={`h-full rounded-full ${colors.progress}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(stat.percentage, 100)}%` }}
                      transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
                    />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default OrderStatsDashboard;