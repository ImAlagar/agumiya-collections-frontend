// components/cart/CartCouponSection.jsx
import React, { useState } from 'react';
import { Tag, ChevronDown, ChevronUp, Copy } from 'lucide-react';
import { useCoupon } from '../../../contexts/CouponContext';

const CartCouponSection = ({ subtotal }) => {
  const [showCouponInput, setShowCouponInput] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const { applyCoupon, appliedCoupon, removeCoupon, loading } = useCoupon();

  const availableCoupons = [
    { code: 'WELCOME10', discount: '10% OFF', minOrder: 0 },
    { code: 'FIRST100', discount: '₹100 OFF', minOrder: 500 },
    { code: 'FREESHIP', discount: 'Free Shipping', minOrder: 799 },
  ];

  const handleApplyCoupon = async () => {
    if (couponCode.trim()) {
      await applyCoupon({ code: couponCode, subtotal });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-4">
      {/* Header - Always Visible */}
      <div 
        className="flex items-center justify-between cursor-pointer mb-3"
        onClick={() => setShowCouponInput(!showCouponInput)}
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <Tag className="text-green-600 dark:text-green-400" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Apply Coupon</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Save more on your order</p>
          </div>
        </div>
        {showCouponInput ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>

      {/* Coupon Input Section */}
        {showCouponInput && (
          <div className="space-y-4">
            {/* Apply Coupon Input */}
            {!appliedCoupon ? (
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="w-full sm:flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={loading || !couponCode.trim()}
                  className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-medium transition-colors"
                >
                  {loading ? 'Applying...' : 'Apply'}
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 gap-3 sm:gap-0">
                <div className="flex items-center space-x-3">
                  <Tag className="text-green-600" size={20} />
                  <div>
                    <p className="font-semibold text-green-800 dark:text-green-200">
                      {appliedCoupon.code} Applied!
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      You saved ₹{appliedCoupon.discountAmount}
                    </p>
                  </div>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-red-600 hover:text-red-700 text-sm font-medium self-end sm:self-auto"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Available Coupons - Quick Apply */}
            <div className="border-t pt-4">
              <p className="font-medium text-gray-900 dark:text-white mb-3">
                Popular coupons:
              </p>
              <div className="grid grid-cols-1 gap-3">
                {availableCoupons.map((coupon) => (
                  <div
                    key={coupon.code}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {coupon.discount}
                      </span>
                      {coupon.minOrder > 0 && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Min. order ₹{coupon.minOrder}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <code className="bg-white dark:bg-gray-600 px-3 py-1 rounded border font-mono text-sm">
                        {coupon.code}
                      </code>
                      <button
                        onClick={() => {
                          setCouponCode(coupon.code);
                          handleApplyCoupon();
                        }}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        Apply
                      </button>
                      <button
                        onClick={() => navigator.clipboard.writeText(coupon.code)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-500 rounded"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

    </div>
  );
};

export default CartCouponSection;