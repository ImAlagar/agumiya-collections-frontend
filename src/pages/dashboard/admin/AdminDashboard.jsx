// src/pages/dashboard/admin/AdminDashboard.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Award, ShoppingCart, RefreshCw, Settings } from 'lucide-react';

// Components


// Custom Hook
import { useDashboardData } from '../../../hooks/useDashboardData';
import DashboardStats from '../../../components/admin/dashboard/DashboardStats';
import SalesOverview from '../../../components/admin/dashboard/SalesOverview';
import BestSellingProducts from '../../../components/admin/dashboard/BestSellingProducts';
import OrderVolume from '../../../components/admin/dashboard/OrderVolume';
import RefundsReturns from '../../../components/admin/dashboard/RefundsReturns';
import ShippingTaxSettings from '../../../components/admin/dashboard/ShippingTaxSettings';

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');
  
  const { dashboardData, loading, error } = useDashboardData(timeRange);

  const tabConfig = [
    { id: 'overview', label: 'Sales Overview', icon: BarChart3 },
    { id: 'products', label: 'Best Sellers', icon: Award },
    { id: 'orders', label: 'Order Volume', icon: ShoppingCart },
    { id: 'refunds', label: 'Refunds', icon: RefreshCw },
    { id: 'shipping', label: 'Shipping & Tax', icon: Settings }
  ];

  const renderTabContent = () => {
    const components = {
      overview: <SalesOverview data={dashboardData?.salesOverview} timeRange={timeRange} />,
      products: <BestSellingProducts data={dashboardData?.bestSelling} />,
      orders: <OrderVolume data={dashboardData?.orderVolume} />,
      refunds: <RefundsReturns data={dashboardData?.refunds} />,
      shipping: <ShippingTaxSettings data={dashboardData?.shippingSettings} />
    };
    return components[activeTab] || components.overview;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
        >
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Failed to load dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Welcome to your store analytics dashboard
            </p>
          </div>
          
          {/* Time Range Selector */}
          <motion.div 
            className="flex space-x-2 mt-4 lg:mt-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {['day', 'week', 'month', 'year'].map((range) => (
              <motion.button
                key={range}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  timeRange === range
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <DashboardStats data={dashboardData?.stats} timeRange={timeRange} />

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <div className="flex overflow-x-auto space-x-1 pb-2 scrollbar-hide">
          {tabConfig.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-lg'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          {renderTabContent()}
        </motion.div>
      </AnimatePresence>

      {/* Quick Actions */}
      {/* <QuickActions  /> */}
    </motion.div>
  );
};

export default AdminDashboard;