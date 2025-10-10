// components/admin/CreateCouponModal.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Calendar, DollarSign, Percent, Hash, Sparkles } from 'lucide-react';
import { useCoupon } from '../../../contexts/CouponContext';

const CreateCouponModal = ({ isOpen, onClose, onCouponCreated }) => {
  const { createCoupon, adminLoading, clearAdminError } = useCoupon();
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    minOrderAmount: '',
    maxDiscountAmount: '',
    usageLimit: '',
    validUntil: '',
    isSingleUse: false,
    applicableTo: 'ALL_PRODUCTS',
    categories: [],
    products: []
  });
  const [error, setError] = useState('');

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  clearAdminError();

  console.log('🟡 Form submission started...');

  // Validation
  if (!formData.code.trim()) {
    setError('Coupon code is required');
    return;
  }

  if (!formData.discountValue || parseFloat(formData.discountValue) <= 0) {
    setError('Discount value must be greater than 0');
    return;
  }

  if (formData.discountType === 'PERCENTAGE' && parseFloat(formData.discountValue) > 100) {
    setError('Percentage discount cannot exceed 100%');
    return;
  }

  // Prepare data for backend - ensure all fields are properly formatted
  const couponData = {
    code: formData.code.trim().toUpperCase(),
    description: formData.description.trim() || `Discount coupon ${formData.code}`,
    discountType: formData.discountType,
    discountValue: parseFloat(formData.discountValue),
    minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : 0,
    maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : 0,
    usageLimit: formData.usageLimit ? parseInt(formData.usageLimit, 10) : null,
    validUntil: formData.validUntil || null,
    isSingleUse: Boolean(formData.isSingleUse),
    isActive: true, // Make sure this is included
    applicableTo: formData.applicableTo,
    categories: Array.isArray(formData.categories) ? formData.categories : [],
    products: Array.isArray(formData.products) ? formData.products : []
  };

  console.log('📤 Sending coupon data to API:', couponData);

  try {
    const result = await createCoupon(couponData);
    console.log('📥 Response from createCoupon:', result);

    if (result.success) {
      console.log('✅ Coupon created successfully!');
      onCouponCreated(result.data);
      onClose();
      resetForm();
    } else {
      console.log('❌ Coupon creation failed:', result.error);
      const errorMessage = result.error || 'Failed to create coupon';
      setError(errorMessage);
    }
  } catch (err) {
    console.error('🔥 Unexpected error in handleSubmit:', err);
    const errorMessage = err.message || 'An unexpected error occurred while creating the coupon';
    setError(errorMessage);
  }
};

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      discountType: 'PERCENTAGE',
      discountValue: '',
      minOrderAmount: '',
      maxDiscountAmount: '',
      usageLimit: '',
      validUntil: '',
      isSingleUse: false,
      applicableTo: 'ALL_PRODUCTS',
      categories: [],
      products: []
    });
    setError('');
  };

  const generateRandomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setFormData({ ...formData, code });
  };

  const handleClose = () => {
    resetForm();
    clearAdminError();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-lg w-full max-w-2xl max-h-[95vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Create New Coupon
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
              Fill in the details to create a discount coupon
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {error && (
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          {/* Coupon Code */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Coupon Code *
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                    placeholder="e.g., WELCOME10"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={generateRandomCode}
                  className="flex items-center justify-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-colors text-sm sm:text-base"
                >
                  <Sparkles size={14} sm:size={16} />
                  <span>Generate</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                placeholder="e.g., Welcome discount for new customers"
              />
            </div>
          </div>

          {/* Discount Configuration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Discount Type *
              </label>
              <select
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base"
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED_AMOUNT">Fixed Amount</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {formData.discountType === 'PERCENTAGE' ? 'Discount Value * (%)' : 'Discount Amount *'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {formData.discountType === 'PERCENTAGE' ? (
                    <Percent size={16} className="text-gray-400" />
                  ) : (
                    <DollarSign size={16} className="text-gray-400" />
                  )}
                </div>
                <input
                  type="number"
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                  placeholder={formData.discountType === 'PERCENTAGE' ? '10' : '15'}
                  min="0"
                  max={formData.discountType === 'PERCENTAGE' ? '100' : undefined}
                  step={formData.discountType === 'PERCENTAGE' ? '0.1' : '0.01'}
                  required
                />
              </div>
            </div>
          </div>

          {/* Conditions & Restrictions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Minimum Order Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign size={16} className="text-gray-400" />
                </div>
                <input
                  type="number"
                  value={formData.minOrderAmount}
                  onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                  placeholder="0 (No minimum)"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {formData.discountType === 'PERCENTAGE' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Maximum Discount Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    value={formData.maxDiscountAmount}
                    onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                    placeholder="No maximum limit"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Total Usage Limit
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Hash size={16} className="text-gray-400" />
                </div>
                <input
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                  placeholder="Unlimited uses"
                  min="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Valid Until
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={16} className="text-gray-400" />
                </div>
                <input
                  type="datetime-local"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                />
              </div>
            </div>
          </div>

          {/* Additional Options */}
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <input
                type="checkbox"
                id="isSingleUse"
                checked={formData.isSingleUse}
                onChange={(e) => setFormData({ ...formData, isSingleUse: e.target.checked })}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="isSingleUse" className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                Single Use Per Customer
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Applicable To
              </label>
              <select
                value={formData.applicableTo}
                onChange={(e) => setFormData({ ...formData, applicableTo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base"
              >
                <option value="ALL_PRODUCTS">All Products</option>
                <option value="CATEGORY_SPECIFIC">Specific Categories</option>
                <option value="PRODUCT_SPECIFIC">Specific Products</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end space-y-3 sm:space-y-0 space-y-reverse sm:space-x-3 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleClose}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors text-sm sm:text-base font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={adminLoading}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 sm:px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg transition-colors text-sm sm:text-base font-medium shadow-lg"
            >
              {adminLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save size={16} />
              )}
              <span>{adminLoading ? 'Creating...' : 'Create Coupon'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateCouponModal;