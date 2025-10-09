import React from 'react';
import { motion } from 'framer-motion';

const ReviewStep = ({ orderData, cartItems, subtotal, shipping, tax, grandTotal, formatPrice }) => {
  const shippingAddress = orderData?.shippingAddress || {};

  // Safe price formatting function
  const getFormattedPrice = (price) => {
    try {
      const result = formatPrice(price);
      // Handle different return types
      if (typeof result === 'string') {
        return result;
      } else if (result && typeof result === 'object') {
        return result.formatted || result.toString();
      } else {
        return price?.toString() || '0';
      }
    } catch (error) {
      console.error('Price formatting error:', error);
      return price?.toString() || '0';
    }
  };


  return (
    <motion.div
      key="review"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full px-4 sm:px-6 lg:px-8 py-6"
    >
      {/* Header Section */}
      <div className="text-center mb-8 lg:mb-10">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
          Review Your Order
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
          Please review your items and shipping information before placing your order
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
            <div className="space-y-6">
              {/* Order Items Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white">
                    Order Items
                  </h3>
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs sm:text-sm font-medium px-3 py-1 rounded-full">
                    {cartItems?.length || 0} {cartItems?.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                {/* Items List */}
                <div className="space-y-4">
                  {cartItems?.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600"
                    >
                      {/* Product Info */}
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <img
                          src={item.image || '/placeholder-image.jpg'}
                          alt={item.name || 'Product image'}
                          className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-cover rounded-lg flex-shrink-0"
                          onError={(e) => {
                            e.target.src =
                              'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04MCA3MEgxMjBWOTBIOThWNzBIOThaIiBmaWxsPSIjOEU5MEE2Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iMjAiIGZpbGw9IiM4RTkwQTYiLz4KPC9zdmc+';
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                            {item.name || 'Unnamed Product'}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                            {getFormattedPrice(item.price)} × {item.quantity || 0}
                          </p>
                          {item.variant && (
                            <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 mt-1">
                              Variant: {item.variant.title || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              {/* Order Notes */}
              {orderData?.orderNotes && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Order Notes
                  </h3>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200 break-words">
                      {orderData.orderNotes}
                    </p>
                  </div>
                </div>
              )}
            </div>


          {/* Shipping & Summary - Right Column */}
          <div className="space-y-6">
            {/* Shipping Address Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white">
                  Shipping Address
                </h3>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                    {shippingAddress.firstName || 'N/A'} {shippingAddress.lastName || ''}
                  </p>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                      {shippingAddress.address1 || 'No address provided'}
                    </p>
                    {shippingAddress.address2 && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                        {shippingAddress.address2}
                      </p>
                    )}
                    <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                      {shippingAddress.city || 'N/A'}, {shippingAddress.region || 'N/A'} {shippingAddress.zipCode || ''}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                      {shippingAddress.country === 'IN' ? 'India' : 
                       shippingAddress.country === 'US' ? 'United States' :
                       shippingAddress.country === 'UK' ? 'United Kingdom' : 
                       shippingAddress.country || 'N/A'}
                    </p>
                  </div>
                </div>

                {shippingAddress.email && (
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                      {shippingAddress.email}
                    </p>
                  </div>
                )}

                {shippingAddress.phone && (
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                      {shippingAddress.phone}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Order Summary
              </h3>
              
              <div className="space-y-3 sm:space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Subtotal</span>
                  <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                    {getFormattedPrice(subtotal)}
                  </span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Shipping</span>
                  <span className="font-semibold text-green-600 dark:text-green-400 text-sm sm:text-base">
                    {shipping === 0 ? 'FREE' : getFormattedPrice(shipping)}
                  </span>
                </div>

                {/* Tax */}
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Tax</span>
                  <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                    {getFormattedPrice(tax)}
                  </span>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-gray-700 my-3 sm:my-4"></div>

                {/* Grand Total */}
                <div className="flex justify-between items-center py-2">
                  <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Total</span>
                  <span className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">
                    {getFormattedPrice(grandTotal)}
                  </span>
                </div>

                {/* Savings Notice */}
                {shipping === 0 && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mt-4">
                    <p className="text-xs sm:text-sm text-green-700 dark:text-green-300 text-center">
                      🎉 You saved {getFormattedPrice(shipping)} on shipping!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReviewStep;