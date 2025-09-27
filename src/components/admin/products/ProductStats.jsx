// src/components/admin/products/ProductStats.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { PackageIcon, DollarSignIcon, TrendingUpIcon, AlertTriangleIcon } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

const ProductStats = ({ products }) => {
  const { theme } = useTheme();
  
  const stats = {
    total: products.length,
    published: products.filter(p => p.status === 'published').length,
    outOfStock: products.filter(p => p.stock <= 0).length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0)
  };

  const statCards = [
    {
      label: 'Total Products',
      value: stats.total,
      icon: PackageIcon,
      color: 'blue',
      description: 'All products in catalog',
      delay: 0.1
    },
    {
      label: 'Published',
      value: stats.published,
      icon: TrendingUpIcon,
      color: 'green',
      description: 'Visible to customers',
      delay: 0.2
    },
    {
      label: 'Out of Stock',
      value: stats.outOfStock,
      icon: AlertTriangleIcon,
      color: 'red',
      description: 'Requires restocking',
      delay: 0.3
    },
    {
      label: 'Inventory Value',
      value: `$${stats.totalValue.toLocaleString()}`,
      icon: DollarSignIcon,
      color: 'purple',
      description: 'Total stock value',
      delay: 0.4
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: theme === 'dark' ? 'bg-blue-900/20' : theme === 'smokey' ? 'bg-blue-800/10' : 'bg-blue-50',
        hoverBg: theme === 'dark' ? 'hover:bg-blue-900/30' : theme === 'smokey' ? 'hover:bg-blue-800/20' : 'hover:bg-blue-100',
        text: 'text-blue-600',
        icon: theme === 'dark' ? 'text-blue-400' : 'text-blue-500',
        border: 'border-blue-200 dark:border-blue-800'
      },
      green: {
        bg: theme === 'dark' ? 'bg-green-900/20' : theme === 'smokey' ? 'bg-green-800/10' : 'bg-green-50',
        hoverBg: theme === 'dark' ? 'hover:bg-green-900/30' : theme === 'smokey' ? 'hover:bg-green-800/20' : 'hover:bg-green-100',
        text: 'text-green-600',
        icon: theme === 'dark' ? 'text-green-400' : 'text-green-500',
        border: 'border-green-200 dark:border-green-800'
      },
      red: {
        bg: theme === 'dark' ? 'bg-red-900/20' : theme === 'smokey' ? 'bg-red-800/10' : 'bg-red-50',
        hoverBg: theme === 'dark' ? 'hover:bg-red-900/30' : theme === 'smokey' ? 'hover:bg-red-800/20' : 'hover:bg-red-100',
        text: 'text-red-600',
        icon: theme === 'dark' ? 'text-red-400' : 'text-red-500',
        border: 'border-red-200 dark:border-red-800'
      },
      purple: {
        bg: theme === 'dark' ? 'bg-purple-900/20' : theme === 'smokey' ? 'bg-purple-800/10' : 'bg-purple-50',
        hoverBg: theme === 'dark' ? 'hover:bg-purple-900/30' : theme === 'smokey' ? 'hover:bg-purple-800/20' : 'hover:bg-purple-100',
        text: 'text-purple-600',
        icon: theme === 'dark' ? 'text-purple-400' : 'text-purple-500',
        border: 'border-purple-200 dark:border-purple-800'
      }
    };
    return colors[color] || colors.blue;
  };

  // Container animation
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

  // Card animation variants (same as UserStats)
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

  // Icon animation variants (same as UserStats)
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

  // Value animation variants
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        const colors = getColorClasses(stat.color);
        
        return (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover="hover"
            whileTap="tap"
            className={`${colors.bg} ${colors.hoverBg} ${colors.border} rounded-xl p-6 border-2 cursor-pointer shadow-sm hover:shadow-lg transition-shadow duration-300 backdrop-blur-sm`}
          >
            <div className="flex items-center justify-between">
              <motion.div variants={valueVariants} className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  {stat.label}
                </p>
                
                <motion.p 
                  className="text-3xl font-bold text-gray-900 dark:text-white mb-1"
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
                
                <motion.p 
                  className="text-xs text-gray-500 dark:text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {stat.description}
                </motion.p>
              </motion.div>
              
              <motion.div
                variants={iconVariants}
                whileHover="hover"
                className={`p-3 rounded-2xl ${colors.bg} backdrop-blur-sm border ${colors.border}`}
              >
                <Icon className={`w-7 h-7 ${colors.icon}`} />
                
                {/* Pulse animation for important stats */}
                {stat.color === 'red' && stats.outOfStock > 0 && (
                  <motion.span 
                    className="absolute -top-1 -right-1 flex h-3 w-3"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                  >
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </motion.span>
                )}
              </motion.div>
            </div>

            {/* Animated progress bar for published products percentage */}
            {stat.color === 'green' && (
              <motion.div 
                className="mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Published</span>
                  <span>{Math.round((stats.published / stats.total) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                  <motion.div 
                    className="bg-green-500 h-1.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats.published / stats.total) * 100}%` }}
                    transition={{ 
                      duration: 1, 
                      delay: 1,
                      ease: "easeOut" 
                    }}
                  />
                </div>
              </motion.div>
            )}

            {/* Stock alert for out of stock items */}
            {stat.color === 'red' && stats.outOfStock > 0 && (
              <motion.div 
                className="mt-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <div className="flex items-center space-x-1">
                  <AlertTriangleIcon className="w-3 h-3 text-red-500" />
                  <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                    {stats.outOfStock} product{stats.outOfStock !== 1 ? 's' : ''} need attention
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default ProductStats;