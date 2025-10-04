import React from 'react';
import { motion } from 'framer-motion';

const ReviewStep = ({ orderData, cartItems, subtotal, shipping, tax, grandTotal, formatPrice }) => {
  return (
    <motion.div
      key="review"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-8"
    >
      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
        Review Your Order
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Items */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Order Items ({cartItems.length})
            </h3>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {item.name}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        {formatPrice(item.price).formatted} × {item.quantity}
                      </p>
                      {item.variant && (
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          Variant: {item.variant.title}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="font-bold text-gray-900 dark:text-white">
                    {formatPrice(item.price * item.quantity).formatted}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shipping & Summary */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Shipping Address
            </h3>
            <div className="space-y-2">
              <p className="font-semibold text-gray-900 dark:text-white">
                {orderData.shippingAddress.firstName} {orderData.shippingAddress.lastName}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {orderData.shippingAddress.address1}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {orderData.shippingAddress.city}, {orderData.shippingAddress.region} {orderData.shippingAddress.zipCode}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {orderData.shippingAddress.country}
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Order Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatPrice(subtotal).formatted}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {shipping === 0 ? 'Free' : formatPrice(shipping).formatted}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tax</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatPrice(tax).formatted}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
                <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {formatPrice(grandTotal).formatted}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReviewStep;