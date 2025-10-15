// src/components/admin/dashboard/ShippingTaxSettings.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  DollarSign, 
  Globe, 
  Settings, 
  Loader, 
  Edit, 
  Save,
  X,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import countries from '../../../utils/country.json';
import { useTax } from '../../../contexts/TaxContext';

const ShippingTaxSettings = () => {
  const { 
    taxSettings, 
    countryRates, 
    loading, 
    error,
    fetchTaxSettings, 
    updateTaxSettings,
    validateTaxConfiguration,
    resetTaxState
  } = useTax();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [taxStats, setTaxStats] = useState(null);
  const [localTaxSettings, setLocalTaxSettings] = useState({
    name: 'Default Tax Settings',
    taxType: 'VAT',
    calculationType: 'PERCENTAGE',
    inclusionType: 'EXCLUSIVE',
    defaultRate: 0,
    countryRates: []
  });
  const [expandedSections, setExpandedSections] = useState({
    configuration: true,
    countries: true
  });

  useEffect(() => {
    fetchTaxSettings();
  }, [fetchTaxSettings]);

  useEffect(() => {
    if (taxSettings) {
      setLocalTaxSettings({
        name: taxSettings.name,
        taxType: taxSettings.taxType,
        calculationType: taxSettings.calculationType,
        inclusionType: taxSettings.inclusionType,
        defaultRate: taxSettings.defaultRate,
        countryRates: countryRates || []
      });
    }
  }, [taxSettings, countryRates]);


  const handleSaveTaxSettings = async () => {

    try {
      setSaving(true);
      
      const result = await updateTaxSettings(localTaxSettings);
      
      if (result.success) {
        
        setIsEditing(false);
        setValidationResult(null);
      } else {
        console.error('❌ API returned failure:', result);
      }
    } catch (err) {
      console.error('💥 Unexpected error in handleSaveTaxSettings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleValidateConfiguration = async () => {
    setValidating(true);
    try {
      const result = await validateTaxConfiguration();
      setValidationResult(result.data);
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setValidating(false);
    }
  };

  const handleRefresh = async () => {
    resetTaxState();
    await fetchTaxSettings();
    setValidationResult(null);
  };

  const addCountryRate = () => {
    setLocalTaxSettings(prev => ({
      ...prev,
      countryRates: [
        ...prev.countryRates,
        {
          countryCode: '',
          countryName: '',
          taxRate: 0,
          appliesToShipping: false,
          priority: prev.countryRates.length
        }
      ]
    }));
  };

  const updateCountryRate = (index, field, value) => {
    setLocalTaxSettings(prev => ({
      ...prev,
      countryRates: prev.countryRates.map((rate, i) => 
        i === index ? { ...rate, [field]: value } : rate
      )
    }));
  };

  const removeCountryRate = (index) => {
    setLocalTaxSettings(prev => ({
      ...prev,
      countryRates: prev.countryRates.filter((_, i) => i !== index)
    }));
  };

  const handleCountrySelect = (index, countryCode) => {
    const country = countries.find(c => c.name === countryCode);
    if (country) {
      updateCountryRate(index, 'countryCode', country.name);
      updateCountryRate(index, 'countryName', country.name);
    }
  };

  const getTotalConfiguredCountries = () => {
    return countryRates?.length || 0;
  };

  const getAverageTaxRate = () => {
    if (!countryRates?.length) return 0;
    const total = countryRates.reduce((sum, rate) => sum + rate.taxRate, 0);
    return (total / countryRates.length).toFixed(1);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (loading && !taxSettings) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700"
      >
        <div className="flex items-center justify-center py-8 sm:py-12">
          <Loader className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-sm sm:text-base text-gray-600">Loading tax settings...</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700"
    >
      {/* Header - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-3 sm:space-y-0">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
            Shipping & Tax Settings
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
            {isEditing ? 'Edit global tax configurations' : 'Manage global shipping and tax configurations'}
          </p>
        </div>
        <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-3">
          {!isEditing && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex-shrink-0"
              title="Refresh data"
            >
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>
          )}
          {isEditing ? (
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveTaxSettings}
                disabled={saving}
                className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-sm flex-shrink-0"
              >
                <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">{saving ? 'Saving...' : 'Save'}</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(false)}
                className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm flex-shrink-0"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Cancel</span>
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex-shrink-0"
            >
              <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Configure</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
        >
          <div className="flex items-start space-x-2 sm:space-x-3">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <span className="text-xs sm:text-sm text-red-800 dark:text-red-200 font-medium break-words">
              {error}
            </span>
          </div>
        </motion.div>
      )}

      {/* Validation Result */}
      {validationResult && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl border ${
            validationResult.isValid 
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
              : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
          }`}
        >
          <div className="flex items-start space-x-2 sm:space-x-3">
            {validationResult.isValid ? (
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <span className={`text-xs sm:text-sm font-medium break-words ${
                validationResult.isValid 
                  ? 'text-green-800 dark:text-green-200'
                  : 'text-yellow-800 dark:text-yellow-200'
              }`}>
                {validationResult.message}
              </span>
              {validationResult.errors && (
                <ul className="mt-2 text-xs sm:text-sm list-disc list-inside space-y-1">
                  {validationResult.errors.map((err, index) => (
                    <li key={index} className="text-yellow-700 dark:text-yellow-300 break-words">
                      {err}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Tax Configuration Section */}
      <div className="mb-6 sm:mb-8">
        {/* Section Header - Collapsible on Mobile */}
        <button
          onClick={() => toggleSection('configuration')}
          className="flex items-center justify-between w-full mb-3 sm:mb-4 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white text-left">
            Tax Configuration
          </h4>
          <div className="flex items-center space-x-2 sm:space-x-4">
            {!isEditing && taxStats && (
              <div className="hidden xs:flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                <span>📊 {getTotalConfiguredCountries()} countries</span>
                <span>📈 {getAverageTaxRate()}% avg</span>
              </div>
            )}
            {expandedSections.configuration ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </div>
        </button>
        
        {expandedSections.configuration && (
          <>
            {isEditing ? (
              <div className="space-y-4 sm:space-y-6">
                {/* Basic Tax Settings - Mobile Grid */}
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                      Tax System Name *
                    </label>
                    <input
                      type="text"
                      value={localTaxSettings.name}
                      onChange={(e) => setLocalTaxSettings(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Enter tax system name"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                        Tax Type *
                      </label>
                      <select
                        value={localTaxSettings.taxType}
                        onChange={(e) => setLocalTaxSettings(prev => ({ ...prev, taxType: e.target.value }))}
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      >
                        <option value="VAT">VAT</option>
                        <option value="GST">GST</option>
                        <option value="SALES_TAX">Sales Tax</option>
                        <option value="CUSTOM">Custom</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                        Default Rate (%) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={localTaxSettings.defaultRate}
                        onChange={(e) => setLocalTaxSettings(prev => ({ ...prev, defaultRate: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="0.0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                      Price Inclusion *
                    </label>
                    <select
                      value={localTaxSettings.inclusionType}
                      onChange={(e) => setLocalTaxSettings(prev => ({ ...prev, inclusionType: e.target.value }))}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="EXCLUSIVE">Tax Exclusive</option>
                      <option value="INCLUSIVE">Tax Inclusive</option>
                    </select>
                  </div>
                </div>

                {/* Country Tax Rates */}
                <div>
                  <div className="flex flex-col xs:flex-row xs:items-center justify-between mb-3 sm:mb-4 space-y-2 xs:space-y-0">
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm sm:text-md font-medium text-gray-900 dark:text-white">
                        Country Tax Rates
                      </h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400 hidden xs:block">
                        Configure tax rates for different countries
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={addCountryRate}
                      className="flex items-center space-x-1 sm:space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm w-full xs:w-auto justify-center"
                    >
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Add Country</span>
                    </motion.button>
                  </div>

                  {localTaxSettings.countryRates.length === 0 ? (
                    <div className="text-center py-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <Globe className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">No country tax rates configured</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Add your first country tax rate to get started
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 sm:space-y-3">
                      {localTaxSettings.countryRates.map((rate, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 space-y-3"
                        >
                          <div className="grid grid-cols-1 gap-2 sm:gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Country *
                              </label>
                              <select
                                value={rate.countryName}
                                onChange={(e) => handleCountrySelect(index, e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                              >
                                <option value="">Select Country</option>
                                {countries.map(country => (
                                  <option key={country.name} value={country.name}>
                                    {country.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Tax Rate (%) *
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="0.1"
                                  value={rate.taxRate}
                                  onChange={(e) => updateCountryRate(index, 'taxRate', parseFloat(e.target.value) || 0)}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                  placeholder="0.0"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Priority
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  value={rate.priority}
                                  onChange={(e) => updateCountryRate(index, 'priority', parseInt(e.target.value) || 0)}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                />
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={rate.appliesToShipping}
                                  onChange={(e) => updateCountryRate(index, 'appliesToShipping', e.target.checked)}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                                />
                                <span className="text-xs text-gray-700 dark:text-gray-300">
                                  Apply to Shipping
                                </span>
                              </label>

                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => removeCountryRate(index)}
                                className="p-1 sm:p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Remove country"
                              >
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Display mode - Mobile optimized
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {/* Tax Settings Summary */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                >
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                    <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-blue-600" />
                    Tax Configuration
                  </h4>
                  {taxSettings ? (
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">System:</span>
                          <span className="font-medium truncate ml-2" title={taxSettings.name}>
                            {taxSettings.name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Type:</span>
                          <span className="font-medium">{taxSettings.taxType}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Inclusion:</span>
                          <span className="font-medium capitalize">{taxSettings.inclusionType.toLowerCase()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Default Rate:</span>
                          <span className="font-medium">{taxSettings.defaultRate}%</span>
                        </div>
                      </div>
                      <div className="col-span-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Status:</span>
                          <span className={`font-medium ${taxSettings.isActive ? 'text-green-600' : 'text-red-600'}`}>
                            {taxSettings.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-3">
                      <p className="text-xs sm:text-sm text-gray-500 italic">No tax configuration found</p>
                    </div>
                  )}
                </motion.div>

                {/* Country Tax Rates Display */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <h4 className="font-medium text-gray-900 dark:text-white flex items-center text-sm sm:text-base">
                      <Globe className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-600" />
                      Country Tax Rates
                    </h4>
                    <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                      {countryRates?.length || 0} countries
                    </span>
                  </div>
                  {countryRates?.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {countryRates.map((rate, index) => (
                        <motion.div
                          key={rate.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 text-xs sm:text-sm"
                        >
                          <div className="flex items-center space-x-1 sm:space-x-2 min-w-0 flex-1">
                            <span className="font-medium text-gray-700 dark:text-gray-300 truncate">
                              {rate.countryName}
                            </span>
                            {rate.appliesToShipping && (
                              <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-1 sm:px-2 py-0.5 rounded flex-shrink-0">
                                +Ship
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0 ml-2">
                            <span className="font-bold text-blue-600">
                              {rate.taxRate}%
                            </span>
                            {rate.priority > 0 && (
                              <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-1 rounded">
                                P{rate.priority}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-3">
                      <p className="text-xs sm:text-sm text-gray-500 italic">No country tax rates configured</p>
                    </div>
                  )}
                </motion.div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Action Buttons - Mobile Optimized */}
      {!isEditing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center"
        >
          <div className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-3">
            <button 
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors text-center"
            >
              Configure Tax Settings
            </button>
            <button 
              onClick={handleValidateConfiguration}
              disabled={validating}
              className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {validating ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              <span>{validating ? 'Validating...' : 'Validate'}</span>
            </button>
          </div>

        </motion.div>
      )}
    </motion.div>
  );
};

export default ShippingTaxSettings;