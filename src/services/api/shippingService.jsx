// src/services/api/shippingService.js

import apiClient from "../../config/api";

export const shippingService = {
  /**
   * Calculate shipping cost for cart using Printify API
   */
  async calculatePrintifyShipping(cartData) {
    try {
      const response = await apiClient.post('/shipping/printify/calculate', cartData);
      return response.data;
    } catch (error) {
      console.error('Printify shipping calculation API error:', error);
      throw new Error(error.response?.data?.message || 'Failed to calculate shipping');
    }
  },

  /**
   * Get shipping cost for single product
   */
  async getProductShipping(productData) {
    try {
      const response = await apiClient.post('/shipping/printify/product', productData);
      return response.data;
    } catch (error) {
      console.error('Product shipping API error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get product shipping');
    }
  },

  /**
   * Get order shipping details
   */
  async getOrderShipping(orderId) {
    try {
      const response = await apiClient.get(`/shipping/printify/order/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Order shipping API error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get order shipping details');
    }
  },

  /**
   * Calculate shipping cost for cart (legacy - keep for compatibility)
   */
  async calculateShipping(cartData) {
    try {
      const response = await apiClient.post('/shipping/calculate', cartData);
      return response.data;
    } catch (error) {
      console.error('Shipping calculation API error:', error);
      throw new Error(error.response?.data?.message || 'Failed to calculate shipping');
    }
  },

  /**
   * Get detailed shipping estimates (legacy - keep for compatibility)
   */
  async getShippingEstimates(cartData) {
    try {
      const response = await apiClient.post('/shipping/estimates', cartData);
      return response.data;
    } catch (error) {
      console.error('Shipping estimates API error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get shipping estimates');
    }
  },

  /**
   * Get supported countries
   */
  async getSupportedCountries() {
    try {
      const response = await apiClient.get('/shipping/countries');
      return response.data;
    } catch (error) {
      console.error('Get countries API error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get supported countries');
    }
  },

  /**
   * Get shipping configuration (Admin)
   */
  async getShippingConfig() {
    try {
      const response = await apiClient.get('/shipping/config');
      return response.data;
    } catch (error) {
      console.error('Get shipping config API error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get shipping configuration');
    }
  },

  /**
   * Update shipping configuration (Admin)
   */
  async updateShippingConfig(configData) {
    try {
      const response = await apiClient.put('/shipping/config', configData);
      return response.data;
    } catch (error) {
      console.error('Update shipping config API error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update shipping configuration');
    }
  },

  /**
   * Get shipping zones (Admin)
   */
  async getShippingZones() {
    try {
      const response = await apiClient.get('/shipping/zones');
      return response.data;
    } catch (error) {
      console.error('Get shipping zones API error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get shipping zones');
    }
  },

  /**
   * Create shipping zone (Admin)
   */
  async createShippingZone(zoneData) {
    try {
      const response = await apiClient.post('/shipping/zones', zoneData);
      return response.data;
    } catch (error) {
      console.error('Create shipping zone API error:', error);
      throw new Error(error.response?.data?.message || 'Failed to create shipping zone');
    }
  },

  /**
   * Update shipping zone (Admin)
   */
  async updateShippingZone(zoneId, zoneData) {
    try {
      const response = await apiClient.put(`/shipping/zones/${zoneId}`, zoneData);
      return response.data;
    } catch (error) {
      console.error('Update shipping zone API error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update shipping zone');
    }
  }
};