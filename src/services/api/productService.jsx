// src/services/api/productService.js
import apiClient from '../../config/api.js';
import { API_ENDPOINTS } from '../../config/constants.jsx';

export const productService = {
  // Get all products with pagination and filters
  async getAllProducts(params = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTS, { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch products');
    }
  },

  // Get single product by ID
  async getProductById(id) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.PRODUCTS}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch product');
    }
  },

  // Get product variants
  async getProductVariants(productId) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.PRODUCTS}/${productId}/variants`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch product variants');
    }
  },

  // Sync products from Printify
  async syncProducts(shopId) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.PRODUCTS_SYNC}/${shopId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to sync products');
    }
  },


};

// Add products endpoints to constants
export const PRODUCTS_ENDPOINTS = {
  PRODUCTS: '/api/v1/products',
  PRODUCTS_SYNC: '/api/v1/products/sync'
};