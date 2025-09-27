// src/components/admin/dashboard/ShippingTaxSettings.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, DollarSign, Globe, Settings, Loader, Edit } from 'lucide-react';



const ShippingTaxSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchShippingSettings = async () => {
      try {
        setLoading(true);
        // This would call your new backend API
        // const response = await shippingService.getShippingSettings();
        // setSettings(response.data);
        
        // For now, using empty state since API doesn't exist
        setSettings({
          supportedCountries: [],
          taxCountries: [],
          excludedCountries: [],
          shippingZones: [],
          taxRates: {}
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShippingSettings();
  }, []);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
      >
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">Loading shipping settings...</span>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
      >
        <div className="text-center py-8">
          <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Shipping Settings Unavailable
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error || 'Shipping and tax settings API is not yet implemented'}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </motion.div>
    );
  }

  const safeTaxRates = settings?.taxRates || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Shipping & Tax Settings</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isEditing ? 'Edit global shipping configurations' : 'Manage global shipping and tax configurations'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
          >
            <Edit className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </motion.button>
          <motion.div
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.3 }}
            className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg"
          >
            <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </motion.div>
        </div>
      </div>

      {Object.keys(safeTaxRates).length === 0 && 
       settings.supportedCountries.length === 0 ? (
        <div className="text-center py-12">
          <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Shipping Settings Configured
          </h4>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Set up your shipping zones, supported countries, and tax rates to start selling internationally.
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Configure Shipping Settings
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Supported Countries */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
          >
            <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
              <Globe className="w-4 h-4 mr-2 text-green-600" />
              Supported Countries
            </h4>
            {settings.supportedCountries.length > 0 ? (
              <>
                <div className="flex flex-wrap gap-2">
                  {settings.supportedCountries.map((country, index) => (
                    <motion.span
                      key={country}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      whileHover={{ scale: 1.1 }}
                      className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium"
                    >
                      {country}
                    </motion.span>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {settings.supportedCountries.length} countries supported
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-500 italic">No countries configured</p>
            )}
          </motion.div>

          {/* Tax Countries */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
          >
            <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-blue-600" />
              Tax Countries & Rates
            </h4>
            {Object.keys(safeTaxRates).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(safeTaxRates).map(([country, rate], index) => (
                  <motion.div
                    key={country}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded-lg"
                  >
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{country}</span>
                    <span className="text-sm font-bold text-blue-600">{rate}%</span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No tax rates configured</p>
            )}
          </motion.div>

          {/* Additional sections would go here */}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 flex space-x-4"
      >
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          {isEditing ? 'Save Changes' : 'Configure Settings'}
        </button>
        <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          View Documentation
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ShippingTaxSettings;