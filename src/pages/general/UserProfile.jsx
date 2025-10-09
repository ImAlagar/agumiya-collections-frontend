// src/pages/general/UserProfile.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../../services/api/authService';
import { storageManager } from '../../services/storage/storageManager';
import { STORAGE_KEYS, USER_TYPES } from '../../config/constants.jsx';
import { SEO } from '../../contexts/SEOContext.jsx';
import { useAuth } from '../../contexts/AuthProvider.jsx';
import { useCurrency } from '../../contexts/CurrencyContext.jsx';

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
              User Since
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

    </motion.div>
  );
};


const OrderHistory = ({ userData, isAdmin }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false); // 👈 NEW STATE
  const { formatPrice } = useCurrency();

  useEffect(() => {
    if (!isAdmin) {
      loadUserOrders();
    }
  }, [isAdmin]);

  const loadUserOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await authService.getUserOrders();
      if (response && response.success) {
        setOrders(response.orders || response.data || []);
      } else {
        setError(response?.message || "Failed to load orders");
      }
    } catch (err) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      PROCESSING: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      SHIPPED: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
      DELIVERED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      CONFIRMED: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  };

  const formatCurrency = (amount) => {
    const { formatted } = formatPrice(amount || 0);
    return formatted;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getOrderDisplayId = (order) => {
    const id = order.orderNumber || order.id || order._id;
    if (!id) return "N/A";
    const str = id.toString();
    return str.length > 8 ? str.slice(-8) : str;
  };

  const getOrderId = (order) => order.id || order._id || "unknown";

  // ⚙️ Show only first 3 orders if showAll = false
  const displayedOrders = showAll ? orders : orders.slice(0, 3);

  if (isAdmin) {
    return (
      <motion.div
        key="orders"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Store Orders
        </h2>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No orders in store
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Orders from customers will appear here
          </p>
          <Link
            to="/admin/products"
            className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Manage Products
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="orders"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Order History
        </h2>
        <button
          onClick={loadUserOrders}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
        >
          <span>🔄</span>
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full"
          />
          <span className="ml-3 text-gray-600 dark:text-gray-400">
            Loading orders...
          </span>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="text-red-500 dark:text-red-400 mb-4">
            Error loading orders: {error}
          </div>
          <button
            onClick={loadUserOrders}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No orders yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start shopping to see your order history here
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {displayedOrders.map((order, index) => (
              <motion.div
                key={getOrderId(order) || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Order #{getOrderDisplayId(order)}
                        </h3>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 sm:mt-0 ${getStatusColor(order.status)}`}
                        >
                          {order.status
                            ? order.status.charAt(0).toUpperCase() +
                              order.status.slice(1).toLowerCase()
                            : "Unknown"}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">
                            Placed:
                          </span>
                          <span className="ml-2 text-gray-900 dark:text-white">
                            {formatDate(order.createdAt || order.orderDate)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">
                            Items:
                          </span>
                          <span className="ml-2 text-gray-900 dark:text-white">
                            {order.items?.length || 0} items
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">
                            Total:
                          </span>
                          <span className="ml-2 font-semibold text-indigo-600 dark:text-indigo-400">
                            {formatCurrency(order.totalAmount || order.grandTotal || 0)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-0 md:ml-4 flex space-x-2">
                      <Link
                        to={`/orders/${getOrderId(order)}`}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 👇 Show More / Show Less Button */}
          {orders.length > 3 && (
            <div className="text-center mt-6">
              <button
                onClick={() => setShowAll(!showAll)}
                className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-6 py-2 rounded-lg font-medium transition-colors"
              >
                {showAll ? "Show Less" : "Show More"}
              </button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};


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

  </motion.div>
);

export default UserProfile;