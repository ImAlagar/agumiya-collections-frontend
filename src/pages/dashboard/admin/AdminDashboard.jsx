// src/pages/dashboard/admin/AdminDashboard.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Award, ShoppingCart, RefreshCw, Settings, Menu, X } from 'lucide-react';

// Components
import SalesOverview from '../../../components/admin/dashboard/SalesOverview';
import BestSellingProducts from '../../../components/admin/dashboard/BestSellingProducts';
import OrderVolume from '../../../components/admin/dashboard/OrderVolume';
import RefundsReturns from '../../../components/admin/dashboard/RefundsReturns';
import ShippingTaxSettings from '../../../components/admin/dashboard/ShippingTaxSettings';

// Custom Hook
import { useDashboardData } from '../../../hooks/useDashboardData';
import DashboardStats from '../../../components/admin/stats/DashboardStats';

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full"
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
        className="mb-8 px-4 sm:px-6 lg:px-8 pt-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between w-full lg:w-auto">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard Overview
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
                Welcome to your store analytics dashboard
              </p>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
          
          {/* Time Range Selector */}
          <motion.div 
            className={`flex flex-wrap gap-2 mt-4 lg:mt-0 ${
              isMobileMenuOpen ? 'block' : 'hidden lg:flex'
            } lg:flex lg:space-x-2 w-full lg:w-auto`}
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
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 flex-1 lg:flex-none min-w-[60px] ${
                  timeRange === range
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-700'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="px-4 sm:px-6 lg:px-8">
        <DashboardStats data={dashboardData?.stats} timeRange={timeRange} />
      </div>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8 px-4 py-4 sm:px-6 lg:px-8"
      >
        <div className="relative">
          {/* Mobile Dropdown */}
          <div className="lg:hidden">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {tabConfig.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.label}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden lg:flex overflow-x-auto pb-2 scrollbar-hide">
            {tabConfig.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
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
        </div>
      </motion.div>

      {/* Tab Content */}
      <div className="px-4 sm:px-6 lg:px-8">
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
      </div>
    </motion.div>
  );
};

export default AdminDashboard;