import apiClient from '../../config/api.js';
import { API_ENDPOINTS } from '../../config/constants.jsx';

export const taxService = {
  // ==================== PUBLIC TAX METHODS ====================
  
  /**
   * Calculate tax for an order
   */
  async calculateTax(taxData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.TAX.CALCULATE, taxData);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to calculate tax',
        error: error.response?.data,
        validationErrors: error.response?.data?.errors
      };
    }
  },

  /**
   * Get all country tax rates
   */
  async getCountryTaxRates() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.TAX.COUNTRIES);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch country tax rates',
        data: []
      };
    }
  },

  /**
   * Get tax rate for specific country
   */
  async getTaxRateForCountry(countryCode) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.TAX.COUNTRY}/${countryCode}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch tax rate for country',
        data: null
      };
    }
  },

  // ==================== USER TAX METHODS ====================

  /**
   * Get tax settings (read-only for users)
   */
  async getTaxSettings() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.TAX.SETTINGS);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch tax settings',
        data: null
      };
    }
  },

  // ==================== ADMIN TAX METHODS ====================

  /**
   * Update tax settings (admin only)
   */
  async updateTaxSettings(settingsData) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.TAX.SETTINGS, settingsData);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update tax settings',
        error: error.response?.data,
        validationErrors: error.response?.data?.errors
      };
    }
  },

  /**
   * Validate tax configuration (admin only)
   */
  async validateTaxConfiguration() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.TAX.VALIDATE);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to validate tax configuration',
        data: null
      };
    }
  },

  /**
   * Get tax configuration statistics (admin only)
   */


  /**
   * Bulk update country tax rates (admin only)
   */
  async bulkUpdateCountryRates(countryRates) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.TAX.BULK_UPDATE, { countryRates });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to bulk update country rates',
        error: error.response?.data
      };
    }
  },

  /**
   * Reset tax settings to default (admin only)
   */
  async resetTaxSettings() {
    try {
      const response = await apiClient.post(API_ENDPOINTS.TAX.RESET);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to reset tax settings',
        error: error.response?.data
      };
    }
  }
};