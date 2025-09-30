// src/services/api/productService.js
import apiClient from '../../config/api';
import { API_ENDPOINTS } from '../../config/constants';

// Unified error handler for product service
const handleProductError = (error, defaultMessage) => {
  const message = error.apiMessage || error.response?.data?.message || error.message || defaultMessage;
  throw new Error(message);
};

export const productService = {
  async getAllProducts(params = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTS, { params });
      return response.data; // Return data instead of full response
    } catch (error) {
      throw handleProductError(error, 'Failed to fetch products');
    }
  },

  async getProductById(id) {
    try {
      console.log('📡 Fetching product from:', `${API_ENDPOINTS.PRODUCTS}/${id}`);
      const response = await apiClient.get(`${API_ENDPOINTS.PRODUCTS}/${id}`);
      console.log('✅ Product service response:', response);
      return response.data; // Return data instead of full response
    } catch (error) {
      console.error('❌ Product service error:', error);
      throw handleProductError(error, 'Failed to fetch product');
    }
  },

  async getProductVariants(productId) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.PRODUCTS}/${productId}/variants`);
      return response.data;
    } catch (error) {
      throw handleProductError(error, 'Failed to fetch product variants');
    }
  },

  async syncProducts(shopId) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.PRODUCTS_SYNC}/${shopId}`);
      return response.data;
    } catch (error) {
      throw handleProductError(error, 'Failed to sync products');
    }
  },

  async updateProduct(id, productData) {
    try {
      const response = await apiClient.put(`${API_ENDPOINTS.PRODUCTS}/${id}`, productData);
      return response.data;
    } catch (error) {
      throw handleProductError(error, 'Failed to update product');
    }
  },

  async deleteProduct(id) {
    try {
      const response = await apiClient.delete(`${API_ENDPOINTS.PRODUCTS}/${id}`);
      return response.data;
    } catch (error) {
      throw handleProductError(error, 'Failed to delete product');
    }
  },

  async searchProducts(query, params = {}) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.PRODUCTS}/search`, {
        params: { ...params, search: query }
      });
      return response.data;
    } catch (error) {
      throw handleProductError(error, 'Failed to search products');
    }
  },

  async filterProducts(filters = {}) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.PRODUCTS}/filter`, {
        params: filters
      });
      return response.data;
    } catch (error) {
      throw handleProductError(error, 'Failed to filter products');
    }
  },

  async getSimilarProducts(productId, limit = 4) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.PRODUCTS}/${productId}/similar`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      throw handleProductError(error, 'Failed to fetch similar products');
    }
  }
};