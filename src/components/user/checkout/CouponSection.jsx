// src/components/user/checkout/CouponSection.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTag, FiCheck, FiX } from 'react-icons/fi';
import { useCoupon } from '../../../contexts/CouponContext';

const CouponSection = ({ 
  subtotal, 
  cartItems, 
  onCouponApplied, 
  onCouponRemoved,
  themeStyles 
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const { validateCoupon, isLoading } = useCoupon();

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setIsApplying(true);
    try {
      const validationData = {
        code: couponCode.trim().toUpperCase(),
        cartItems: cartItems.map(item => ({
          id: item.id,
          productId: item.productId || item.id,
          price: item.price,
          quantity: item.quantity,
          category: item.category,
          variantId: item.variantId
        })),
        subtotal: subtotal
      };

      const result = await validateCoupon(validationData);
      
      if (result.success) {
        onCouponApplied(result.data.coupon);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Coupon application failed:', error);
      // You can show a toast notification here
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    onCouponRemoved();
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
          <FiTag className="mr-2" />
          Apply Coupon
        </h3>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          placeholder="Enter coupon code"
          className={`flex-1 px-4 py-3 ${themeStyles.input} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          disabled={isApplying || isLoading}
        />
        <button
          onClick={handleApplyCoupon}
          disabled={!couponCode.trim() || isApplying || isLoading}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl font-semibold transition-colors disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isApplying || isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Applying...</span>
            </>
          ) : (
            <span>Apply</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default CouponSection;