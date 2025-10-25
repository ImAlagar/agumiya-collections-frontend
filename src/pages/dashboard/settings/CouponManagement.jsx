// src/pages/dashboard/settings/CouponManagement.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Ticket, Plus, Edit2, Trash2, Copy, Calendar, Search, 
  Menu, X, Eye, EyeOff, AlertTriangle
} from 'lucide-react';
import { useCoupon } from '../../../contexts/CouponContext';
import CreateCouponModal from './CreateCouponModal';
import { useNavigate } from 'react-router-dom';

const CouponManagement = () => {
  const navigate = useNavigate();

  const { 
    adminCoupons = [], 
    adminLoading, 
    fetchAllCoupons, 
    deleteCoupon,
    createCoupon,
    updateCoupon
  } = useCoupon();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchAllCoupons();
  }, [fetchAllCoupons]);

  const handleDeleteClick = (coupon) => {
    setSelectedCoupon(coupon);
    setShowDeleteModal(true);
  };

  const handleEditClick = (coupon) => {
    setSelectedCoupon(coupon);
    setShowEditModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCoupon) return;
    
    try {
      // Check if coupon has been used
      if (selectedCoupon.usedCount > 0) {
        alert('Cannot delete coupon that has been used. Please deactivate it instead.');
        setShowDeleteModal(false);
        setSelectedCoupon(null);
        return;
      }

      await deleteCoupon(selectedCoupon.id);
      fetchAllCoupons();
      setShowDeleteModal(false);
      setSelectedCoupon(null);
    } catch (error) {
      console.error('Failed to delete coupon:', error);
      
      // If error is about used coupon, offer deactivation
      if (error.response?.data?.message?.includes('used')) {
        if (window.confirm('This coupon has been used. Would you like to deactivate it instead?')) {
          await handleDeactivate(selectedCoupon);
        }
      } else {
        alert('Failed to delete coupon. Please try again.');
      }
    }
  };

  const handleDeactivate = async (coupon) => {
    try {
      await updateCoupon(coupon.id, { isActive: false });
      fetchAllCoupons();
      alert('Coupon deactivated successfully!');
    } catch (error) {
      console.error('Failed to deactivate coupon:', error);
      alert('Failed to deactivate coupon. Please try again.');
    }
  };

  const handleActivate = async (coupon) => {
    try {
      await updateCoupon(coupon.id, { isActive: true });
      fetchAllCoupons();
      alert('Coupon activated successfully!');
    } catch (error) {
      console.error('Failed to activate coupon:', error);
      alert('Failed to activate coupon. Please try again.');
    }
  };

  const handleEditSubmit = async (formData) => {
    if (!selectedCoupon) return;
    
    try {
      await updateCoupon(selectedCoupon.id, formData);
      fetchAllCoupons();
      setShowEditModal(false);
      setSelectedCoupon(null);
      alert('Coupon updated successfully!');
    } catch (error) {
      console.error('Failed to update coupon:', error);
      alert('Failed to update coupon. Please try again.');
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

  if (adminLoading && adminCoupons.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center justify-between sm:justify-start sm:space-x-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-2xl">
              <Ticket className="text-orange-600 dark:text-orange-400" size={28} />
            </div>

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
            <Plus size={18} />
            <span className="text-sm sm:text-base">Create Coupon</span>
          </motion.button>
        </div>
      </div>

      {/* Search & Filter */}
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

      {/* Coupons Grid */}
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
            className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border ${
              coupon.isActive 
                ? 'border-green-200 dark:border-green-800' 
                : 'border-gray-200 dark:border-gray-700 opacity-75'
            } p-4 sm:p-6 hover:shadow-xl transition-all duration-300`}
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
                  onClick={() => handleEditClick(coupon)}
                  className="p-2 text-gray-400 hover:text-blue-600 bg-gray-100 dark:bg-gray-700 rounded-lg"
                  title="Edit coupon"
                >
                  <Edit2 size={14} />
                </motion.button>
                {coupon.usedCount > 0 ? (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => coupon.isActive ? handleDeactivate(coupon) : handleActivate(coupon)}
                    className={`p-2 ${
                      coupon.isActive 
                        ? 'text-orange-400 hover:text-orange-600' 
                        : 'text-green-400 hover:text-green-600'
                    } bg-gray-100 dark:bg-gray-700 rounded-lg`}
                    title={coupon.isActive ? 'Deactivate coupon' : 'Activate coupon'}
                  >
                    {coupon.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteClick(coupon)}
                    className="p-2 text-gray-400 hover:text-red-600 bg-gray-100 dark:bg-gray-700 rounded-lg"
                    title="Delete coupon"
                  >
                    <Trash2 size={14} />
                  </motion.button>
                )}
              </div>
            </div>

            {/* Used Count Warning */}
            {coupon.usedCount > 0 && (
              <div className="mb-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-center text-yellow-800 dark:text-yellow-200 text-xs">
                  <AlertTriangle size={12} className="mr-1" />
                  <span>Used {coupon.usedCount} time(s) - Cannot be deleted</span>
                </div>
              </div>
            )}

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
                    className={`h-2 rounded-full ${
                      getUsagePercentage(coupon) > 80 
                        ? 'bg-red-500' 
                        : getUsagePercentage(coupon) > 50 
                        ? 'bg-orange-500' 
                        : 'bg-green-500'
                    }`}
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

      {/* Empty State */}
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

      {/* Loading Overlay */}
      {adminLoading && adminCoupons.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-2xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Processing...</p>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedCoupon && (
          <DeleteConfirmationModal
            coupon={selectedCoupon}
            onClose={() => {
              setShowDeleteModal(false);
              setSelectedCoupon(null);
            }}
            onConfirm={handleDeleteConfirm}
            onDeactivate={() => {
              handleDeactivate(selectedCoupon);
              setShowDeleteModal(false);
              setSelectedCoupon(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Edit Coupon Modal */}
      <AnimatePresence>
        {showEditModal && selectedCoupon && (
          <EditCouponModal
            coupon={selectedCoupon}
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setSelectedCoupon(null);
            }}
            onSubmit={handleEditSubmit}
          />
        )}
      </AnimatePresence>

      {/* Create Coupon Modal */}
      <CreateCouponModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCouponCreated={() => {
          setShowCreateModal(false);
          fetchAllCoupons();
        }}
      />
    </motion.div>
  );
};

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({ coupon, onClose, onConfirm, onDeactivate }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
    >
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="text-red-600 dark:text-red-400" size={24} />
        </div>
        
        {coupon.usedCount > 0 ? (
          <>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="text-yellow-600 dark:text-yellow-400" size={20} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Cannot Delete Coupon
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This coupon has been used <strong>{coupon.usedCount} time(s)</strong> and cannot be permanently deleted.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Would you like to <strong>deactivate</strong> it instead to prevent future usage?
            </p>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onDeactivate}
                className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-colors"
              >
                Deactivate
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Delete Coupon
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete coupon <strong>"{coupon.code}"</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  </motion.div>
);

// Edit Coupon Modal Component (keep the same as before)
const EditCouponModal = ({ coupon, isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    code: coupon.code || '',
    description: coupon.description || '',
    discountType: coupon.discountType || 'PERCENTAGE',
    discountValue: coupon.discountValue || '',
    minOrderAmount: coupon.minOrderAmount || '',
    maxDiscountAmount: coupon.maxDiscountAmount || '',
    usageLimit: coupon.usageLimit || '',
    validUntil: coupon.validUntil ? new Date(coupon.validUntil).toISOString().split('T')[0] : '',
    isActive: coupon.isActive ?? true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Edit Coupon</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ... (keep the same form fields as before) ... */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Coupon Code *
            </label>
            <input
              type="text"
              required
              value={formData.code}
              onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Discount Type *
              </label>
              <select
                value={formData.discountType}
                onChange={(e) => handleChange('discountType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="PERCENTAGE">Percentage</option>
                <option value="FIXED_AMOUNT">Fixed Amount</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Discount Value *
              </label>
              <input
                type="number"
                required
                min="0"
                step={formData.discountType === 'PERCENTAGE' ? '0.1' : '1'}
                value={formData.discountValue}
                onChange={(e) => handleChange('discountValue', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Min Order Amount
              </label>
              <input
                type="number"
                min="0"
                value={formData.minOrderAmount}
                onChange={(e) => handleChange('minOrderAmount', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Usage Limit
              </label>
              <input
                type="number"
                min="0"
                value={formData.usageLimit}
                onChange={(e) => handleChange('usageLimit', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {formData.discountType === 'PERCENTAGE' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Discount Amount
              </label>
              <input
                type="number"
                min="0"
                value={formData.maxDiscountAmount}
                onChange={(e) => handleChange('maxDiscountAmount', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Valid Until
            </label>
            <input
              type="date"
              value={formData.validUntil}
              onChange={(e) => handleChange('validUntil', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Active Coupon
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Update Coupon
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};  

export default CouponManagement;