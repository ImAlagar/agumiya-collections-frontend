// pages/dashboard/settings/CouponManagement.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Ticket, Plus, Edit2, Trash2, Copy, Calendar, Search, Filter, ArrowLeft, Menu, X } from 'lucide-react';
import { useCoupon } from '../../../contexts/CouponContext';
import CreateCouponModal from './CreateCouponModal';
import { useNavigate } from 'react-router-dom';

const CouponManagement = () => {
  const navigate = useNavigate();
  const { 
    coupons, 
    isLoading, 
    error, 
    getCoupons, 
    deleteCoupon,
    clearError 
  } = useCoupon();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    getCoupons();
  }, [getCoupons]);

  const handleDeleteCoupon = async (couponId) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) {
      return;
    }

    const result = await deleteCoupon(couponId);
    if (result.success) {
      console.log('Coupon deleted successfully!');
    } else {
      alert(result.error || 'Failed to delete coupon');
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    alert('Coupon code copied to clipboard!');
  };

  const getDiscountText = (coupon) => {
    if (coupon.discountType === 'PERCENTAGE') {
      return `${coupon.discountValue}% OFF`;
    } else {
      return `$${coupon.discountValue} OFF`;
    }
  };

  const getUsagePercentage = (coupon) => {
    if (!coupon.usageLimit) return 0;
    return (coupon.usedCount / coupon.usageLimit) * 100;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No expiry';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleCouponCreated = (newCoupon) => {
    console.log('Coupon created:', newCoupon);
    alert('Coupon created successfully!');
  };

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coupon.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterActive === 'all' || 
                         (filterActive === 'active' && coupon.isActive) ||
                         (filterActive === 'inactive' && !coupon.isActive);

    return matchesSearch && matchesFilter;
  });

  if (isLoading && coupons.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 p-4 sm:p-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center justify-between sm:justify-start sm:space-x-4">
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/admin/settings/general')}
                className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <ArrowLeft className="text-gray-600 dark:text-gray-400" size={20} />
              </motion.button>
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-2xl">
                <Ticket className="text-orange-600 dark:text-orange-400" size={24} sm:size={32} />
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden p-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          
          <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} sm:block`}>
            <div className="text-center sm:text-left mb-4 sm:mb-0">
              <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Coupon Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1 sm:mt-2 text-sm sm:text-lg">
                Create and manage discount coupons
              </p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCreateModal(true)}
            className={`${
              isMobileMenuOpen ? 'flex' : 'hidden sm:flex'
            } items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold shadow-lg w-full sm:w-auto`}
          >
            <Plus size={18} sm:size={20} />
            <span className="text-sm sm:text-base">Create Coupon</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-xl text-sm sm:text-base"
        >
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button onClick={clearError} className="text-red-700 dark:text-red-200 hover:text-red-900 dark:hover:text-red-100">
              ×
            </button>
          </div>
        </motion.div>
      )}

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 sm:mb-8 flex flex-col sm:flex-row gap-3 sm:gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search coupons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white shadow-sm text-sm sm:text-base"
          />
        </div>
        
        <select
          value={filterActive}
          onChange={(e) => setFilterActive(e.target.value)}
          className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white shadow-sm text-sm sm:text-base"
        >
          <option value="all">All Coupons</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </motion.div>

      {/* Floating Action Button for Mobile */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowCreateModal(true)}
        className="sm:hidden fixed bottom-6 right-6 z-40 bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-full shadow-2xl"
      >
        <Plus size={24} />
      </motion.button>

      {/* Coupons Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-20 sm:pb-0"
      >
        {filteredCoupons.map((coupon, index) => (
          <motion.div
            key={coupon.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-xl transition-all duration-300"
          >
            {/* Coupon Header */}
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                  {coupon.code}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
                  {coupon.description || 'No description'}
                </p>
              </div>
              <div className="flex space-x-1 sm:space-x-2 ml-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => copyToClipboard(coupon.code)}
                  className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg"
                  title="Copy code"
                >
                  <Copy size={14} sm:size={16} />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1 sm:p-2 text-gray-400 hover:text-blue-600 bg-gray-100 dark:bg-gray-700 rounded-lg"
                  title="Edit coupon"
                  onClick={() => {
                    alert('Edit functionality to be implemented');
                  }}
                >
                  <Edit2 size={14} sm:size={16} />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDeleteCoupon(coupon.id)}
                  className="p-1 sm:p-2 text-gray-400 hover:text-red-600 bg-gray-100 dark:bg-gray-700 rounded-lg"
                  title="Delete coupon"
                >
                  <Trash2 size={14} sm:size={16} />
                </motion.button>
              </div>
            </div>

            {/* Discount Info */}
            <div className="mb-3 sm:mb-4">
              <span className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                {getDiscountText(coupon)}
              </span>
              {coupon.minOrderAmount > 0 && (
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">
                  Min. order: ${coupon.minOrderAmount}
                </p>
              )}
              {coupon.maxDiscountAmount && coupon.discountType === 'PERCENTAGE' && (
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Max discount: ${coupon.maxDiscountAmount}
                </p>
              )}
            </div>

            {/* Usage Stats */}
            <div className="mb-3 sm:mb-4">
              <div className="flex justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 sm:mb-2">
                <span>Usage</span>
                <span>{coupon.usedCount}/{coupon.usageLimit || '∞'}</span>
              </div>
              {coupon.usageLimit && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 sm:h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${getUsagePercentage(coupon)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 sm:h-2 rounded-full"
                  ></motion.div>
                </div>
              )}
            </div>

            {/* Additional Info */}
            <div className="mb-3 sm:mb-4 space-y-1 sm:space-y-2">
              {coupon.isSingleUse && (
                <span className="inline-block bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs">
                  Single Use
                </span>
              )}
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Applies to: {coupon.applicableTo.replace('_', ' ').toLowerCase()}
              </p>
            </div>

            {/* Validity & Status */}
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Calendar size={12} sm:size={14} className="mr-1" />
                <span className="truncate">{formatDate(coupon.validUntil)}</span>
              </div>
              <span
                className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold ${
                  coupon.isActive
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                    : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                }`}
              >
                {coupon.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredCoupons.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 sm:py-16"
        >
          <Ticket size={48} sm:size={64} className="mx-auto text-gray-400 mb-3 sm:mb-4" />
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
            {coupons.length === 0 ? 'No coupons created yet' : 'No coupons found'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 text-sm sm:text-lg">
            {coupons.length === 0 
              ? 'Create your first coupon to start offering discounts' 
              : 'Try adjusting your search or filter criteria'
            }
          </p>
          {coupons.length === 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl font-semibold text-sm sm:text-lg shadow-lg"
            >
              Create First Coupon
            </motion.button>
          )}
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && coupons.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-2xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Processing...</p>
          </div>
        </div>
      )}

      {/* Create Coupon Modal */}
      <CreateCouponModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCouponCreated={handleCouponCreated}
      />
    </motion.div>
  );
};

export default CouponManagement;