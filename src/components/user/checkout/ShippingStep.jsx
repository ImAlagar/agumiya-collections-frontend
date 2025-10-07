import React from 'react';
import { motion } from 'framer-motion';

const ShippingStep = ({ orderData, formErrors, handleInputChange, themeStyles }) => {
  const shippingAddress = orderData?.shippingAddress || {};
  
  const fieldValues = {
    firstName: shippingAddress.firstName || '',
    lastName: shippingAddress.lastName || '',
    email: shippingAddress.email || '',
    phone: shippingAddress.phone || '',
    address1: shippingAddress.address1 || '',
    address2: shippingAddress.address2 || '',
    city: shippingAddress.city || '',
    region: shippingAddress.region || '',
    country: shippingAddress.country || 'IN',
    zipCode: shippingAddress.zipCode || ''
  };

  const handleFieldChange = (field, value) => {
    handleInputChange('shippingAddress', field, value);
  };

  return (
    <motion.div
      key="shipping"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full px-4 sm:px-6 lg:px-8 py-6"
    >
      {/* Header Section */}
      <div className="text-center mb-8 lg:mb-10">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
          Shipping Information
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
          Please enter your shipping details. Fields marked with * are required.
        </p>
      </div>

      {/* Form Container */}
      <div className="max-w-4xl mx-auto">
        <div className="space-y-4 sm:space-y-6">
          {/* Name Row - Responsive grid */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                First Name *
              </label>
              <input
                type="text"
                value={fieldValues.firstName}
                onChange={(e) => handleFieldChange('firstName', e.target.value)}
                className={`w-full px-3 sm:px-4 py-3 text-sm sm:text-base rounded-lg border ${
                  formErrors.firstName 
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
                } ${themeStyles.input} transition-all duration-200`}
                placeholder="Enter first name"
              />
              {formErrors.firstName && (
                <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">
                  {formErrors.firstName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Last Name *
              </label>
              <input
                type="text"
                value={fieldValues.lastName}
                onChange={(e) => handleFieldChange('lastName', e.target.value)}
                className={`w-full px-3 sm:px-4 py-3 text-sm sm:text-base rounded-lg border ${
                  formErrors.lastName 
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
                } ${themeStyles.input} transition-all duration-200`}
                placeholder="Enter last name"
              />
              {formErrors.lastName && (
                <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">
                  {formErrors.lastName}
                </p>
              )}
            </div>
          </div>

          {/* Contact Row - Responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address *
              </label>
              <input
                type="email"
                value={fieldValues.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                className={`w-full px-3 sm:px-4 py-3 text-sm sm:text-base rounded-lg border ${
                  formErrors.email 
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
                } ${themeStyles.input} transition-all duration-200`}
                placeholder="your.email@example.com"
              />
              {formErrors.email && (
                <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">
                  {formErrors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone Number *
              </label>
              <input
                type="tel"
                value={fieldValues.phone}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                className={`w-full px-3 sm:px-4 py-3 text-sm sm:text-base rounded-lg border ${
                  formErrors.phone 
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
                } ${themeStyles.input} transition-all duration-200`}
                placeholder="+91 12345 67890"
              />
              {formErrors.phone && (
                <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">
                  {formErrors.phone}
                </p>
              )}
            </div>
          </div>

          {/* Address Line 1 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Street Address *
            </label>
            <input
              type="text"
              value={fieldValues.address1}
              onChange={(e) => handleFieldChange('address1', e.target.value)}
              className={`w-full px-3 sm:px-4 py-3 text-sm sm:text-base rounded-lg border ${
                formErrors.address1 
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
              } ${themeStyles.input} transition-all duration-200`}
              placeholder="123 Main Street, Apartment #"
            />
            {formErrors.address1 && (
              <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">
                {formErrors.address1}
              </p>
            )}
          </div>

          {/* Address Line 2 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Address Line 2 (Optional)
            </label>
            <input
              type="text"
              value={fieldValues.address2}
              onChange={(e) => handleFieldChange('address2', e.target.value)}
              className="w-full px-3 sm:px-4 py-3 text-sm sm:text-base rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200"
              placeholder="Apartment, suite, unit, etc."
            />
          </div>

          {/* City, State, ZIP - Responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                City *
              </label>
              <input
                type="text"
                value={fieldValues.city}
                onChange={(e) => handleFieldChange('city', e.target.value)}
                className={`w-full px-3 sm:px-4 py-3 text-sm sm:text-base rounded-lg border ${
                  formErrors.city 
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
                } ${themeStyles.input} transition-all duration-200`}
                placeholder="Enter your city"
              />
              {formErrors.city && (
                <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">
                  {formErrors.city}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                State/Region *
              </label>
              <input
                type="text"
                value={fieldValues.region}
                onChange={(e) => handleFieldChange('region', e.target.value)}
                className={`w-full px-3 sm:px-4 py-3 text-sm sm:text-base rounded-lg border ${
                  formErrors.region 
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
                } ${themeStyles.input} transition-all duration-200`}
                placeholder="Enter your state"
              />
              {formErrors.region && (
                <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">
                  {formErrors.region}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                ZIP Code *
              </label>
              <input
                type="text"
                value={fieldValues.zipCode}
                onChange={(e) => handleFieldChange('zipCode', e.target.value)}
                className={`w-full px-3 sm:px-4 py-3 text-sm sm:text-base rounded-lg border ${
                  formErrors.zipCode 
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
                } ${themeStyles.input} transition-all duration-200`}
                placeholder="123456"
              />
              {formErrors.zipCode && (
                <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">
                  {formErrors.zipCode}
                </p>
              )}
            </div>
          </div>

          {/* Country */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Country *
            </label>
            <select
              value={fieldValues.country}
              onChange={(e) => handleFieldChange('country', e.target.value)}
              className={`w-full px-3 sm:px-4 py-3 text-sm sm:text-base rounded-lg border ${
                formErrors.country 
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
              } ${themeStyles.input} transition-all duration-200`}
            >
              <option value="IN">India</option>
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
            </select>
            {formErrors.country && (
              <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">
                {formErrors.country}
              </p>
            )}
          </div>

          {/* Order Notes */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Order Notes (Optional)
            </label>
            <textarea
              value={orderData?.orderNotes || ''}
              onChange={(e) => handleInputChange('orderNotes', e.target.value)}
              rows={3}
              className="w-full px-3 sm:px-4 py-3 text-sm sm:text-base rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none transition-all duration-200"
              placeholder="Any special instructions, delivery notes, or comments..."
            />
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
            <strong>Note:</strong> All information is kept secure and encrypted. 
            Please ensure your shipping address is accurate to avoid delivery issues.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ShippingStep;