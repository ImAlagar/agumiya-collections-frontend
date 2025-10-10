// src/components/admin/dashboard/SalesOverview.jsx
import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart,
  Zap,
  ArrowUpRight
} from 'lucide-react';

// ✅ Import all Chart.js registerables (safe for production)
import { Chart as ChartJS, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Add currency context import
import { useCurrency } from '../../../contexts/CurrencyContext';

// Register everything (includes LineController, BarController, etc.)
ChartJS.register(...registerables);

const SalesOverview = ({ data, timeRange }) => {
  const chartRef = useRef(null);
  const { formatPriceSimple, getCurrencySymbol } = useCurrency(); // Add this

  const salesData = data || [];

  const totalRevenue = salesData.reduce((sum, day) => sum + (day.sales || 0), 0);
  const totalOrders = salesData.reduce((sum, day) => sum + (day.orders || 0), 0);
  const averageDaily = salesData.length > 0 ? totalRevenue / salesData.length : 0;

  const growthRate = salesData.length > 1
    ? ((salesData[salesData.length - 1]?.sales || 0) - (salesData[0]?.sales || 0)) / 
      (salesData[0]?.sales || 1) * 100
    : 0;

  // Update chart data callbacks to use currency formatting
  const chartData = {
    labels: salesData.map(day => 
      new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
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
        type: 'bar'
      },
      {
        label: 'Orders',
        data: salesData.map(day => day.orders || 0),
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
        grid: { display: false },
        ticks: { color: 'rgba(107, 114, 128, 0.8)' }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        ticks: {
          color: 'rgba(99, 102, 241, 0.8)',
          callback: value => formatPriceSimple(value) // Updated to use currency formatting
        },
        grid: { color: 'rgba(107, 114, 128, 0.1)' }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        ticks: { color: 'rgba(16, 185, 129, 0.8)' },
        grid: { drawOnChartArea: false },
      }
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
        callbacks: {
          label: context => {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null) {
              if (context.dataset.label === 'Revenue') {
                label += formatPriceSimple(context.parsed.y); // Updated
              } else {
                label += context.parsed.y.toLocaleString() + ' orders';
              }
            }
            return label;
          }
        }
      }
    },
    animation: { duration: 2000, easing: 'easeOutQuart' },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
    >
      {/* Chart Section */}
      <div className="lg:col-span-2">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sales Overview</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Revenue trends over {timeRange}</p>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <Calendar className="w-4 h-4" />
              <span className="text-sm capitalize">{timeRange}ly</span>
            </div>
          </div>

          <div className="h-64 relative">
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
                  <Bar ref={chartRef} data={chartData} options={chartOptions} />
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl"
                >
                  <BarChart3 className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg font-medium">No sales data available</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Sidebar Stats */}
      <motion.div className="space-y-6">
        <motion.div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">Total Revenue</h4>
            <DollarSign className="w-6 h-6" />
          </div>
          <p className="text-3xl font-bold mb-2">
            {formatPriceSimple(totalRevenue)} {/* Updated */}
          </p>
          <div className="flex items-center text-blue-100">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="text-sm">
              {growthRate >= 0 ? '+' : ''}{growthRate.toFixed(1)}% from last period
            </span>
          </div>
        </motion.div>

        <motion.div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">Average Daily</h4>
            <Zap className="w-6 h-6" />
          </div>
          <p className="text-3xl font-bold mb-2">
            {formatPriceSimple(averageDaily)} {/* Updated */}
          </p>
          <div className="flex items-center text-green-100">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span className="text-sm">Per day average</span>
          </div>
        </motion.div>

        <motion.div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">Orders Summary</h4>
            <ShoppingCart className="w-6 h-6" />
          </div>
          <p className="text-3xl font-bold mb-2">{totalOrders.toLocaleString()}</p>
          <div className="text-purple-100 text-sm">{salesData.length} days of activity</div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default SalesOverview;