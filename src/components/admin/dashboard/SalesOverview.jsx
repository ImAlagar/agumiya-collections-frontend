// src/components/admin/dashboard/SalesOverview.jsx
import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart,
  Zap,
  ArrowUpRight,
  Loader
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SalesOverview = ({ data, timeRange }) => {
  const chartRef = useRef(null);
  
  // Process API data or use sample data structure
  const salesData = data || [];
  const totalRevenue = salesData.reduce((sum, day) => sum + (day.sales || 0), 0);
  const totalOrders = salesData.reduce((sum, day) => sum + (day.orders || 0), 0);
  const averageDaily = salesData.length > 0 ? totalRevenue / salesData.length : 0;
  
  // Calculate growth rate (you can replace with actual API data)
  const growthRate = salesData.length > 1 ? 
    ((salesData[salesData.length - 1]?.sales || 0) - (salesData[0]?.sales || 0)) / (salesData[0]?.sales || 1) * 100 : 0;

  // Prepare chart data
  const chartData = {
    labels: salesData.map(day => 
      new Date(day.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    ),
    datasets: [
      {
        label: 'Revenue',
        data: salesData.map(day => day.sales || 0),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
        yAxisID: 'y',
      },
      {
        label: 'Orders',
        data: salesData.map(day => day.orders || 0),
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
        type: 'line',
        yAxisID: 'y1',
        pointBackgroundColor: 'rgba(16, 185, 129, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: false,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(107, 114, 128, 0.8)',
          font: {
            size: 11,
          }
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        ticks: {
          color: 'rgba(99, 102, 241, 0.8)',
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        },
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        ticks: {
          color: 'rgba(16, 185, 129, 0.8)',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgba(107, 114, 128, 0.8)',
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: 'rgba(255, 255, 255, 0.9)',
        bodyColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (context.dataset.label === 'Revenue') {
                label += '$' + context.parsed.y.toLocaleString();
              } else {
                label += context.parsed.y.toLocaleString() + ' orders';
              }
            }
            return label;
          }
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeOutQuart'
    },
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8
      }
    }
  };

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 1.2
      }
    }
  };

  const statCardVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 15,
        duration: 0.6
      }
    },
    hover: {
      y: -5,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        duration: 0.2
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
    >
      {/* Chart Section */}
      <div className="lg:col-span-2">
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <motion.h3 
                className="text-lg font-semibold text-gray-900 dark:text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Sales Overview
              </motion.h3>
              <motion.p 
                className="text-sm text-gray-600 dark:text-gray-400"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Revenue trends over {timeRange}
              </motion.p>
            </div>
            <motion.div 
              className="flex items-center space-x-2 text-gray-500"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Calendar className="w-4 h-4" />
              <span className="text-sm capitalize">{timeRange}ly</span>
            </motion.div>
          </div>
          
          <motion.div
            variants={chartVariants}
            className="h-64 relative"
          >
            <AnimatePresence mode="wait">
              {salesData.length > 0 ? (
                <motion.div
                  key="chart"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="h-full"
                >
                  <Bar 
                    ref={chartRef}
                    data={chartData} 
                    options={chartOptions}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl"
                >
                  <BarChart3 className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg font-medium">No sales data available</p>
                  <p className="text-gray-400 text-sm mt-2">Sales will appear when orders are placed</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Quick Stats below chart */}
          {salesData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700"
            >
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  ${totalRevenue.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Total Revenue</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {totalOrders}
                </p>
                <p className="text-xs text-gray-500">Total Orders</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {salesData.length}
                </p>
                <p className="text-xs text-gray-500">Days Tracked</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
      
      {/* Stats Sidebar */}
      <motion.div
        variants={itemVariants}
        transition={{ delay: 0.4 }}
        className="space-y-6"
      >
        {/* Total Revenue Card */}
        <motion.div
          variants={statCardVariants}
          whileHover="hover"
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">Total Revenue</h4>
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <DollarSign className="w-6 h-6" />
            </motion.div>
          </div>
          <motion.p 
            className="text-3xl font-bold mb-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              delay: 0.6 
            }}
          >
            ${totalRevenue.toLocaleString()}
          </motion.p>
          <div className="flex items-center text-blue-100">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="text-sm">
              {growthRate >= 0 ? '+' : ''}{growthRate.toFixed(1)}% from last period
            </span>
          </div>
        </motion.div>

        {/* Average Daily Card */}
        <motion.div
          variants={statCardVariants}
          whileHover="hover"
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">Average Daily</h4>
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <Zap className="w-6 h-6" />
            </motion.div>
          </div>
          <motion.p 
            className="text-3xl font-bold mb-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              delay: 0.7 
            }}
          >
            ${averageDaily.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </motion.p>
          <div className="flex items-center text-green-100">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span className="text-sm">Per day average</span>
          </div>
        </motion.div>

        {/* Orders Summary Card */}
        <motion.div
          variants={statCardVariants}
          whileHover="hover"
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">Orders Summary</h4>
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <ShoppingCart className="w-6 h-6" />
            </motion.div>
          </div>
          <motion.p 
            className="text-3xl font-bold mb-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              delay: 0.8 
            }}
          >
            {totalOrders}
          </motion.p>
          <div className="text-purple-100 text-sm">
            {salesData.length} days of activity
          </div>
        </motion.div>

        {/* Performance Indicator */}
        <motion.div
          variants={statCardVariants}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Performance</h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                <span>Revenue Growth</span>
                <span>{growthRate >= 0 ? '+' : ''}{growthRate.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div 
                  className="h-2 rounded-full bg-gradient-to-r from-green-400 to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(Math.abs(growthRate), 100)}%` }}
                  transition={{ duration: 1.5, delay: 1 }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                <span>Order Consistency</span>
                <span>{salesData.length > 0 ? 'Good' : 'N/A'}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div 
                  className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"
                  initial={{ width: 0 }}
                  animate={{ width: salesData.length > 0 ? '85%' : '0%' }}
                  transition={{ duration: 1.5, delay: 1.2 }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default SalesOverview;