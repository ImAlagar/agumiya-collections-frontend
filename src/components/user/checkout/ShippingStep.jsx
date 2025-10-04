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
      className="p-8"
    >
      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
        Shipping Information
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Please enter your shipping details
      </p>

      <div className="space-y-6">
        {/* Name Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              First Name *
            </label>
            <input
              type="text"
              value={fieldValues.firstName}
              onChange={(e) => handleFieldChange('firstName', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border ${
                formErrors.firstName 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
              } ${themeStyles.input} transition-colors`}
              placeholder="Enter your first name"
            />
            {formErrors.firstName && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {formErrors.firstName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              value={fieldValues.lastName}
              onChange={(e) => handleFieldChange('lastName', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border ${
                formErrors.lastName 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
              } ${themeStyles.input} transition-colors`}
              placeholder="Enter your last name"
            />
            {formErrors.lastName && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {formErrors.lastName}
              </p>
            )}
          </div>
        </div>

        {/* Contact Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={fieldValues.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border ${
                formErrors.email 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
              } ${themeStyles.input} transition-colors`}
              placeholder="your.email@example.com"
            />
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {formErrors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={fieldValues.phone}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border ${
                formErrors.phone 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
              } ${themeStyles.input} transition-colors`}
              placeholder="+91 12345 67890"
            />
            {formErrors.phone && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        {/* Address Line 1 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Street Address *
          </label>
          <input
            type="text"
            value={fieldValues.address1}
            onChange={(e) => handleFieldChange('address1', e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border ${
              formErrors.address1 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
            } ${themeStyles.input} transition-colors`}
            placeholder="123 Main Street, Apartment #"
          />
          {formErrors.address1 && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {formErrors.address1}
            </p>
          )}
        </div>

        {/* Address Line 2 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Address Line 2 (Optional)
          </label>
          <input
            type="text"
            value={fieldValues.address2}
            onChange={(e) => handleFieldChange('address2', e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 ${themeStyles.input} transition-colors`}
            placeholder="Apartment, suite, unit, etc."
          />
        </div>

        {/* City, State, ZIP */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              City *
            </label>
            <input
              type="text"
              value={fieldValues.city}
              onChange={(e) => handleFieldChange('city', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border ${
                formErrors.city 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
              } ${themeStyles.input} transition-colors`}
              placeholder="Enter your city"
            />
            {formErrors.city && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {formErrors.city}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              State/Region *
            </label>
            <input
              type="text"
              value={fieldValues.region}
              onChange={(e) => handleFieldChange('region', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border ${
                formErrors.region 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
              } ${themeStyles.input} transition-colors`}
              placeholder="Enter your state"
            />
            {formErrors.region && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {formErrors.region}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ZIP Code *
            </label>
            <input
              type="text"
              value={fieldValues.zipCode}
              onChange={(e) => handleFieldChange('zipCode', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border ${
                formErrors.zipCode 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
              } ${themeStyles.input} transition-colors`}
              placeholder="123456"
            />
            {formErrors.zipCode && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {formErrors.zipCode}
              </p>
            )}
          </div>
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Country *
          </label>
          <select
            value={fieldValues.country}
            onChange={(e) => handleFieldChange('country', e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border ${
              formErrors.country 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
            } ${themeStyles.input} transition-colors`}
          >
            <option value="IN">India</option>
            <option value="US">United States</option>
            <option value="UK">United Kingdom</option>
          </select>
        </div>

        {/* Order Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Order Notes (Optional)
          </label>
          <textarea
            value={orderData?.orderNotes || ''}
            onChange={(e) => handleInputChange('orderNotes', e.target.value)}
            rows={3}
            className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 ${themeStyles.input} transition-colors`}
            placeholder="Any special instructions..."
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ShippingStep;