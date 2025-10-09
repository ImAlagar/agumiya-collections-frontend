// src/pages/dashboard/settings/CouponManagement.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Ticket, Plus, Edit2, Trash2, Copy, Calendar, Search, 
  Menu, X 
} from 'lucide-react';
import { useCoupon } from '../../../contexts/CouponContext';
import CreateCouponModal from './CreateCouponModal';
import { useNavigate } from 'react-router-dom';

const CouponManagement = () => {
  const navigate = useNavigate();

  // ✅ Correct variables from context
  const { 
    adminCoupons = [], 
    adminLoading, 
    fetchAllCoupons, 
    deleteCoupon,
    createCoupon 
  } = useCoupon();

  // ✅ Local states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ✅ Fetch all coupons on load
  useEffect(() => {
    fetchAllCoupons();
  }, [fetchAllCoupons]);

  // ✅ Delete coupon
  const handleDeleteCoupon = async (couponId) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    await deleteCoupon(couponId);
    fetchAllCoupons();
  };

  // ✅ When coupon created successfully
  const handleCouponCreated = (newCoupon) => {
    alert(`Coupon ${newCoupon.code} created successfully!`);
    fetchAllCoupons();
  };

  // ✅ Copy code
  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    alert('Coupon code copied to clipboard!');
  };

  // ✅ Helpers
  const getDiscountText = (coupon) => {
    if (coupon.discountType === 'PERCENTAGE') {
      return `${coupon.discountValue}% OFF`;
    } else {
      return `₹${coupon.discountValue} OFF`;
    }
  };

  const getUsagePercentage = (coupon) => {
    if (!coupon.usageLimit) return 0;
    return (coupon.usedCount / coupon.usageLimit) * 100;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No expiry';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // ✅ Filtered coupons
  const filteredCoupons = (adminCoupons || []).filter(coupon => {
    const matchesSearch =
      coupon.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterActive === 'all' ||
      (filterActive === 'active' && coupon.isActive) ||
      (filterActive === 'inactive' && !coupon.isActive);

    return matchesSearch && matchesFilter;
  });

  // ✅ Loading screen (first load)
  if (adminLoading && adminCoupons.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // ✅ Main render
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 p-4 sm:p-6"
    >
      {/* ---------- Header ---------- */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center justify-between sm:justify-start sm:space-x-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-2xl">
              <Ticket className="text-orange-600 dark:text-orange-400" size={28} />
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

          {/* Create Coupon Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCreateModal(true)}
            className={`${
              isMobileMenuOpen ? 'flex' : 'hidden sm:flex'
            } items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold shadow-lg w-full sm:w-auto`}
          >
            <Plus size={18} />
            <span className="text-sm sm:text-base">Create Coupon</span>
          </motion.button>
        </div>
      </div>

      {/* ---------- Search & Filter ---------- */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
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
      </div>

      {/* ---------- Coupons Grid ---------- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-20 sm:pb-0"
      >
        {(filteredCoupons || []).map((coupon, index) => (
          <motion.div
            key={coupon.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-xl transition-all duration-300"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                  {coupon.code}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
                  {coupon.description || 'No description'}
                </p>
              </div>
              <div className="flex space-x-2 ml-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => copyToClipboard(coupon.code)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg"
                  title="Copy code"
                >
                  <Copy size={14} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => alert('Edit feature coming soon')}
                  className="p-2 text-gray-400 hover:text-blue-600 bg-gray-100 dark:bg-gray-700 rounded-lg"
                  title="Edit coupon"
                >
                  <Edit2 size={14} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDeleteCoupon(coupon.id)}
                  className="p-2 text-gray-400 hover:text-red-600 bg-gray-100 dark:bg-gray-700 rounded-lg"
                  title="Delete coupon"
                >
                  <Trash2 size={14} />
                </motion.button>
              </div>
            </div>

            {/* Discount */}
            <div className="mb-4">
              <span className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                {getDiscountText(coupon)}
              </span>
              {coupon.minOrderAmount > 0 && (
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Min order: ₹{coupon.minOrderAmount}
                </p>
              )}
              {coupon.maxDiscountAmount && coupon.discountType === 'PERCENTAGE' && (
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Max discount: ₹{coupon.maxDiscountAmount}
                </p>
              )}
            </div>

            {/* Usage Progress */}
            {coupon.usageLimit && (
              <div className="mb-4">
                <div className="flex justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span>Usage</span>
                  <span>{coupon.usedCount}/{coupon.usageLimit}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${getUsagePercentage(coupon)}%` }}
                    transition={{ duration: 1 }}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                  />
                </div>
              </div>
            )}

            {/* Validity */}
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Calendar size={12} className="mr-1" />
                <span>{formatDate(coupon.validUntil)}</span>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
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

      {/* ---------- Empty State ---------- */}
      {(filteredCoupons || []).length === 0 && (
        <div className="text-center py-16">
          <Ticket size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {adminCoupons.length === 0 ? 'No coupons created yet' : 'No coupons found'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {adminCoupons.length === 0
              ? 'Create your first coupon to start offering discounts!'
              : 'Try adjusting your search or filter.'}
          </p>
          {adminCoupons.length === 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg"
            >
              Create First Coupon
            </motion.button>
          )}
        </div>
      )}

      {/* ---------- Loading Overlay ---------- */}
      {adminLoading && adminCoupons.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-2xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Processing...</p>
          </div>
        </div>
      )}

      {/* ---------- Create Coupon Modal ---------- */}
      <CreateCouponModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCouponCreated={handleCouponCreated}
      />
    </motion.div>
  );
};

export default CouponManagement;
