// src/components/admin/dashboard/StatCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

const StatCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color, 
  subtitle, 
  description,
  alert,
  delay = 0 
}) => {
  const { theme } = useTheme();

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: theme === 'dark' ? 'bg-blue-900/20' : theme === 'smokey' ? 'bg-blue-800/10' : 'bg-blue-50',
        hoverBg: theme === 'dark' ? 'hover:bg-blue-900/30' : theme === 'smokey' ? 'hover:bg-blue-800/20' : 'hover:bg-blue-100',
        text: 'text-blue-600 dark:text-blue-400',
        icon: theme === 'dark' ? 'text-blue-400' : 'text-blue-500',
        border: 'border-blue-200 dark:border-blue-800',
        progress: 'bg-blue-500'
      },
      green: {
        bg: theme === 'dark' ? 'bg-green-900/20' : theme === 'smokey' ? 'bg-green-800/10' : 'bg-green-50',
        hoverBg: theme === 'dark' ? 'hover:bg-green-900/30' : theme === 'smokey' ? 'hover:bg-green-800/20' : 'hover:bg-green-100',
        text: 'text-green-600 dark:text-green-400',
        icon: theme === 'dark' ? 'text-green-400' : 'text-green-500',
        border: 'border-green-200 dark:border-green-800',
        progress: 'bg-green-500'
      },
      purple: {
        bg: theme === 'dark' ? 'bg-purple-900/20' : theme === 'smokey' ? 'bg-purple-800/10' : 'bg-purple-50',
        hoverBg: theme === 'dark' ? 'hover:bg-purple-900/30' : theme === 'smokey' ? 'hover:bg-purple-800/20' : 'hover:bg-purple-100',
        text: 'text-purple-600 dark:text-purple-400',
        icon: theme === 'dark' ? 'text-purple-400' : 'text-purple-500',
        border: 'border-purple-200 dark:border-purple-800',
        progress: 'bg-purple-500'
      },
      orange: {
        bg: theme === 'dark' ? 'bg-orange-900/20' : theme === 'smokey' ? 'bg-orange-800/10' : 'bg-orange-50',
        hoverBg: theme === 'dark' ? 'hover:bg-orange-900/30' : theme === 'smokey' ? 'hover:bg-orange-800/20' : 'hover:bg-orange-100',
        text: 'text-orange-600 dark:text-orange-400',
        icon: theme === 'dark' ? 'text-orange-400' : 'text-orange-500',
        border: 'border-orange-200 dark:border-orange-800',
        progress: 'bg-orange-500'
      },
      red: {
        bg: theme === 'dark' ? 'bg-red-900/20' : theme === 'smokey' ? 'bg-red-800/10' : 'bg-red-50',
        hoverBg: theme === 'dark' ? 'hover:bg-red-900/30' : theme === 'smokey' ? 'hover:bg-red-800/20' : 'hover:bg-red-100',
        text: 'text-red-600 dark:text-red-400',
        icon: theme === 'dark' ? 'text-red-400' : 'text-red-500',
        border: 'border-red-200 dark:border-red-800',
        progress: 'bg-red-500'
      }
    };
    return colors[color] || colors.blue;
  };

  const colors = getColorClasses(color);
  const isPositive = change >= 0;

  // Card animation variants
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
        duration: 0.5,
        delay
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

  // Icon animation variants
  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: delay + 0.3
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
        delay: delay + 0.2
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      className={`${colors.bg} ${colors.hoverBg} ${colors.border} rounded-xl p-4 sm:p-6 border-2 cursor-pointer shadow-sm hover:shadow-lg transition-shadow duration-300 backdrop-blur-sm`}    >
      <div className="flex items-center justify-between">
        <motion.div variants={valueVariants} className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {title}
          </p>
          
          <motion.p 
            className="text-3xl font-bold text-gray-900 dark:text-white mb-1"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              delay: delay + 0.4
            }}
          >
            {typeof value === 'number' ? value.toLocaleString() : value}
          </motion.p>
          
          {subtitle && (
            <motion.p 
              className="text-xs text-gray-500 dark:text-gray-400 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.6 }}
            >
              {subtitle}
            </motion.p>
          )}

          {description && (
            <motion.p 
              className="text-xs text-gray-500 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.6 }}
            >
              {description}
            </motion.p>
          )}

          {change !== undefined && (
            <motion.div 
              className={`flex items-center text-sm font-medium mt-2 ${isPositive ? 'text-green-600' : 'text-red-600'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: delay + 0.7 }}
            >
              {isPositive ? (
                <ArrowUp className="w-3 h-3 mr-1" />
              ) : (
                <ArrowDown className="w-3 h-3 mr-1" />
              )}
              {Math.abs(change)}% from last period
            </motion.div>
          )}
        </motion.div>
        
        <motion.div
          variants={iconVariants}
          whileHover="hover"
          className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl ${colors.bg} backdrop-blur-sm border ${colors.border} relative`}
        >
          <Icon className={`w-5 h-5 sm:w-7 sm:h-7 ${colors.icon}`} />
          
          {/* Alert indicator for negative changes */}
          {change < 0 && (
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

          {/* Custom alert indicator */}
          {alert && (
            <motion.span 
              className="absolute -top-1 -right-1 flex h-3 w-3"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
            </motion.span>
          )}
        </motion.div>
      </div>

      {/* Progress bar for percentage-based metrics */}
      {change !== undefined && (
        <motion.div 
          className="mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.8 }}
        >
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Performance</span>
            <span>{Math.abs(change)}% {isPositive ? 'growth' : 'decline'}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
            <motion.div 
              className={`h-1.5 rounded-full ${isPositive ? colors.progress : 'bg-red-500'}`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(Math.abs(change), 100)}%` }}
              transition={{ 
                duration: 1, 
                delay: delay + 1,
                ease: "easeOut" 
              }}
            />
          </div>
        </motion.div>
      )}

      {/* Alert message for negative changes */}
      {change < 0 && (
        <motion.div 
          className="mt-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 1 }}
        >
          <div className="flex items-center space-x-1">
            <AlertTriangle className="w-3 h-3 text-red-500" />
            <span className="text-xs text-red-600 dark:text-red-400 font-medium">
              {Math.abs(change)}% decrease from last period
            </span>
          </div>
        </motion.div>
      )}

      {/* Custom alert message */}
      {alert && (
        <motion.div 
          className="mt-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 1 }}
        >
          <div className="flex items-center space-x-1">
            <AlertTriangle className="w-3 h-3 text-yellow-500" />
            <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
              {alert}
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default StatCard;