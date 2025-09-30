// src/components/admin/contact/ContactStats.js
import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

const ContactStats = ({ stats }) => {
  const { theme } = useTheme();

  const statCards = [
    {
      title: 'Total Inquiries',
      value: stats?.total || 0,
      icon: Mail,
      color: 'blue',
      change: stats?.todayInquiries || 0,
      trend: 'up'
    },
    {
      title: 'Pending',
      value: stats?.byStatus?.PENDING || 0,
      icon: Clock,
      color: 'yellow',
      percentage: stats?.total ? Math.round((stats.byStatus?.PENDING / stats.total) * 100) : 0,
      trend: stats?.byStatus?.PENDING > 0 ? 'up' : 'down'
    },
    {
      title: 'Resolved',
      value: stats?.byStatus?.RESOLVED || 0,
      icon: CheckCircle,
      color: 'green',
      percentage: stats?.total ? Math.round((stats.byStatus?.RESOLVED / stats.total) * 100) : 0,
      trend: 'up'
    },
    {
      title: 'In Progress',
      value: stats?.byStatus?.IN_PROGRESS || 0,
      icon: AlertCircle,
      color: 'purple',
      percentage: stats?.total ? Math.round((stats.byStatus?.IN_PROGRESS / stats.total) * 100) : 0,
      trend: 'up'
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
      yellow: {
        bg: theme === 'dark' ? 'bg-yellow-900/20' : theme === 'smokey' ? 'bg-yellow-800/10' : 'bg-yellow-50',
        hoverBg: theme === 'dark' ? 'hover:bg-yellow-900/30' : theme === 'smokey' ? 'hover:bg-yellow-800/20' : 'hover:bg-yellow-100',
        text: 'text-yellow-600',
        icon: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500',
        border: 'border-yellow-200 dark:border-yellow-800'
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
        <TrendingUp className={`w-3 h-3 ${isPositive ? '' : 'rotate-180'}`} />
      </motion.div>
    );
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
    >
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        const colors = getColorClasses(stat.color);
        
        return (
          <motion.div
            key={stat.title}
            variants={cardVariants}
            whileHover="hover"
            className={`${colors.bg} ${colors.hoverBg} ${colors.border} rounded-xl p-6 border-2 cursor-pointer shadow-sm hover:shadow-lg transition-shadow duration-300 backdrop-blur-sm`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
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
                    {stat.value.toLocaleString()}
                  </motion.p>
                  {stat.trend && <TrendIndicator trend={stat.trend} color={stat.color} />}
                </div>
                
                <motion.div 
                  className="mt-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {stat.change && (
                    <p className={`text-sm font-medium ${colors.text} flex items-center`}>
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +{stat.change.toLocaleString()} today
                    </p>
                  )}
                  {stat.percentage && (
                    <p className={`text-sm font-medium ${colors.text}`}>
                      {stat.percentage}% of total
                    </p>
                  )}
                </motion.div>
              </div>
              
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                whileHover={{ rotate: 360, scale: 1.1 }}
                className={`p-3 rounded-2xl ${colors.bg} backdrop-blur-sm border ${colors.border}`}
              >
                <Icon className={`w-7 h-7 ${colors.icon}`} />
              </motion.div>
            </div>

            {/* Animated progress bar for percentages */}
            {(stat.percentage || stat.change) && (
              <motion.div 
                className="mt-4 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.8, duration: 1 }}
              >
                <motion.div
                  className={`h-full rounded-full ${colors.bg}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(stat.percentage || 50, 100)}%` }}
                  transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
                />
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default ContactStats;