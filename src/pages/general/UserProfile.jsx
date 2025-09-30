// src/pages/general/UserProfile.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../../services/api/authService';
import { storageManager } from '../../services/storage/storageManager';
import { STORAGE_KEYS, USER_TYPES } from '../../config/constants.jsx';
import { SEO } from '../../contexts/SEOContext.jsx';
import { useAuth } from '../../contexts/AuthProvider.jsx';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const { user: authUser, isAdmin, userType } = useAuth();

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      
      const currentUserType = userType || storageManager.getCurrentUserType();
      
      if (!currentUserType) {
        setError('No user type found');
        setLoading(false);
        return;
      }

      const cachedUserData = storageManager.getItem(STORAGE_KEYS.USER_DATA, currentUserType);
      
      if (cachedUserData) {
        setUserData(cachedUserData);
      }

      let response;
      if (currentUserType === USER_TYPES.ADMIN) {
        response = await authService.getAdminProfile();
      } else {
        response = await authService.getUserProfile();
      }

      if (response && response.success) {
        const freshUserData = response.admin || response.user || response.data;
        setUserData(freshUserData);
        storageManager.setItem(STORAGE_KEYS.USER_DATA, freshUserData, currentUserType);
      } else {
        if (!cachedUserData) {
          setError(response?.message || 'Failed to load profile data');
        }
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to load profile';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (updateData) => {
    try {
      const currentUserType = userType || storageManager.getCurrentUserType();
      let response;
      
      if (currentUserType === USER_TYPES.ADMIN) {
        response = await authService.updateProfile(updateData);
      } else {
        response = await authService.updateProfile(updateData);
      }

      if (response.success) {
        const updatedUser = response.admin || response.user;
        setUserData(updatedUser);
        storageManager.setItem(STORAGE_KEYS.USER_DATA, updatedUser, currentUserType);
        return { success: true, message: 'Profile updated successfully' };
      }
      return { success: false, message: response.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getPageTitle = () => {
    if (isAdmin) {
      return `${userData?.name || 'Admin'} Dashboard - Agumiya Collections`;
    }
    return `${userData?.name || 'User'} Profile - Agumiya Collections`;
  };

  const getPageDescription = () => {
    if (isAdmin) {
      return 'Admin dashboard for managing Agumiya Collections. Monitor orders, products, and system analytics.';
    }
    return 'Manage your Agumiya Collections account. View and update your profile information, order history, and preferences.';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <SEO
          title="Loading Profile - Agumiya Collections"
          description="Loading profile information"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your profile...</p>
        </motion.div>
      </div>
    );
  }

  if (error && !userData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <SEO 
          title="Error - Agumiya Collections"
          description="Error loading profile"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-red-500 text-lg mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Unable to Load Profile
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={loadUserProfile}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={getPageTitle()}
        description={getPageDescription()}
        keywords={isAdmin ? "admin dashboard, management, analytics, Agumiya Collections" : "user profile, account settings, order history, Agumiya Collections"}
        canonical={`https://agumiya-collections.com/${isAdmin ? 'admin' : 'profile'}`}
        ogType="profile"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          "name": getPageTitle(),
          "description": getPageDescription(),
          "publisher": {
            "@type": "Organization",
            "name": "Agumiya Collections"
          }
        }}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {isAdmin ? 'Admin Dashboard' : 'My Account'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {isAdmin ? 'Manage your store and monitor analytics' : 'Manage your profile and preferences'}
                </p>
              </div>
              {isAdmin && (
                <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-4 py-2 rounded-lg">
                  <span className="font-semibold">Admin Mode</span>
                </div>
              )}
            </div>
          </motion.header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isAdmin 
                      ? 'bg-gradient-to-br from-purple-500 to-pink-600' 
                      : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                  }`}>
                    <span className="text-white font-semibold text-lg">
                      {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {userData?.name || 'User'}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {userData?.email || 'No email provided'}
                    </p>
                    {isAdmin && (
                      <span className="inline-block mt-1 px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 rounded-full">
                        Administrator
                      </span>
                    )}
                  </div>
                </div>

                <nav className="space-y-2">
                  {getNavigationItems(isAdmin).map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? isAdmin
                            ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                            : 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="text-lg">{tab.icon}</span>
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-3"
            >
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <ProfileOverview 
                    userData={userData} 
                    isAdmin={isAdmin}
                    formatDate={formatDate}
                    onUpdateProfile={handleUpdateProfile}
                  />
                )}
                {activeTab === 'orders' && (
                  <OrderHistory userData={userData} isAdmin={isAdmin} />
                )}
                {activeTab === 'settings' && (
                  <ProfileSettings 
                    userData={userData} 
                    isAdmin={isAdmin}
                    onUpdateProfile={handleUpdateProfile}
                  />
                )}
                {activeTab === 'security' && (
                  <SecuritySettings userData={userData} isAdmin={isAdmin} />
                )}
                {isAdmin && activeTab === 'analytics' && (
                  <AdminAnalytics userData={userData} />
                )}
                {isAdmin && activeTab === 'management' && (
                  <AdminManagement userData={userData} />
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

// Helper function to get navigation items based on user type
const getNavigationItems = (isAdmin) => {
  const baseItems = [
    { id: 'overview', label: 'Overview', icon: '👤' },
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'security', label: 'Security', icon: '🔒' }
  ];

  if (isAdmin) {
    return [
      ...baseItems,
      { id: 'analytics', label: 'Analytics', icon: '📊' },
      { id: 'management', label: 'Management', icon: '🏪' }
    ];
  }

  return baseItems;
};

// Profile Overview Component
const ProfileOverview = ({ userData, isAdmin, formatDate, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    phone: userData?.phone || ''
  });

  const handleSave = async () => {
    const result = await onUpdateProfile(formData);
    if (result.success) {
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {isAdmin ? 'Admin Information' : 'Profile Information'}
          </h2>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`px-4 py-2 rounded-lg text-white transition-colors ${
              isAdmin 
                ? 'bg-purple-600 hover:bg-purple-700' 
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            ) : (
              <p className="text-gray-900 dark:text-white">{userData?.name || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            ) : (
              <p className="text-gray-900 dark:text-white">{userData?.email || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            ) : (
              <p className="text-gray-900 dark:text-white">{userData?.phone || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Member Since
            </label>
            <p className="text-gray-900 dark:text-white">
              {userData?.createdAt ? formatDate(userData.createdAt) : 'Unknown'}
            </p>
          </div>

          {isAdmin && userData?.role && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Role
              </label>
              <p className="text-gray-900 dark:text-white capitalize">{userData.role}</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center"
        >
          <div className={`text-2xl font-bold mb-2 ${
            isAdmin ? 'text-purple-600 dark:text-purple-400' : 'text-indigo-600 dark:text-indigo-400'
          }`}>
            {userData?.orderCount || 0}
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            {isAdmin ? 'Total Store Orders' : 'Total Orders'}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center"
        >
          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
            {userData?.completedOrders || 0}
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            {isAdmin ? 'Completed Orders' : 'Completed'}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center"
        >
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {userData?.pendingOrders || 0}
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            {isAdmin ? 'Pending Orders' : 'Pending'}
          </div>
        </motion.div>
      </div>

      {/* Admin-specific stats */}
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center"
          >
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-2">
              {userData?.totalProducts || 0}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Total Products</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center"
          >
            <div className="text-2xl font-bold text-pink-600 dark:text-pink-400 mb-2">
              {userData?.totalCustomers || 0}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Total Customers</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center"
          >
            <div className="text-2xl font-bold text-teal-600 dark:text-teal-400 mb-2">
              ${userData?.totalRevenue || 0}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Total Revenue</div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

// Order History Component
const OrderHistory = ({ userData, isAdmin }) => (
  <motion.div
    key="orders"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
  >
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
      {isAdmin ? 'Store Orders' : 'Order History'}
    </h2>
    <div className="text-center py-12">
      <div className="text-6xl mb-4">📦</div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {isAdmin ? 'No orders in store' : 'No orders yet'}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {isAdmin ? 'Orders from customers will appear here' : 'Start shopping to see your order history here'}
      </p>
      <Link
        to={isAdmin ? "/admin/products" : "/shop"}
        className={`inline-flex items-center px-6 py-3 rounded-lg text-white transition-colors ${
          isAdmin ? 'bg-purple-600 hover:bg-purple-700' : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
      >
        {isAdmin ? 'Manage Products' : 'Start Shopping'}
      </Link>
    </div>
  </motion.div>
);

// Admin-specific Components
const AdminAnalytics = ({ userData }) => (
  <motion.div
    key="analytics"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
  >
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
      Store Analytics
    </h2>
    <div className="text-center py-12">
      <div className="text-6xl mb-4">📊</div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Analytics Dashboard
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Store performance metrics and analytics will be displayed here.
      </p>
    </div>
  </motion.div>
);

const AdminManagement = ({ userData }) => (
  <motion.div
    key="management"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
  >
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
      Store Management
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Link
        to="/admin/products"
        className="p-6 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="text-2xl mb-2">🛍️</div>
        <h3 className="font-semibold text-gray-900 dark:text-white">Product Management</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
          Manage your product catalog
        </p>
      </Link>
      
      <Link
        to="/admin/orders"
        className="p-6 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="text-2xl mb-2">📦</div>
        <h3 className="font-semibold text-gray-900 dark:text-white">Order Management</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
          Process and manage orders
        </p>
      </Link>
    </div>
  </motion.div>
);

// Profile Settings Component
const ProfileSettings = ({ userData, isAdmin, onUpdateProfile }) => (
  <motion.div
    key="settings"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
  >
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
      {isAdmin ? 'Admin Settings' : 'Profile Settings'}
    </h2>
    <div className="space-y-6">
      <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-600">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">Email Notifications</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isAdmin ? 'Receive store updates and alerts' : 'Receive updates about your orders'}
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" defaultChecked />
          <div className={`w-11 h-6 bg-gray-200 peer-focus:ring-4 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 ${
            isAdmin 
              ? 'peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 peer-checked:bg-purple-600'
              : 'peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 peer-checked:bg-indigo-600'
          }`}></div>
        </label>
      </div>
      
      {isAdmin && (
        <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-600">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">Store Notifications</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Get alerts for new orders and low stock</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
          </label>
        </div>
      )}
    </div>
  </motion.div>
);

// Security Settings Component
const SecuritySettings = ({ userData, isAdmin }) => (
  <motion.div
    key="security"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
  >
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
      Security Settings
    </h2>
    <div className="space-y-6">
      <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-600">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security</p>
        </div>
        <button className={`font-medium ${
          isAdmin ? 'text-purple-600 hover:text-purple-700' : 'text-indigo-600 hover:text-indigo-700'
        }`}>
          Enable
        </button>
      </div>
      
      <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-600">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">Change Password</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">Update your password regularly</p>
        </div>
        <Link
          to="/forgot-password"
          className={`font-medium ${
            isAdmin ? 'text-purple-600 hover:text-purple-700' : 'text-indigo-600 hover:text-indigo-700'
          }`}
        >
          Change
        </Link>
      </div>
    </div>
  </motion.div>
);

export default UserProfile;