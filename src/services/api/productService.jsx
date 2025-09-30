// src/services/api/productService.js
import apiClient from '../../config/api';
import { API_ENDPOINTS } from '../../config/constants';

export const productService = {
  // Get all products with pagination and filters
  async getAllProducts(params = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTS, { params });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch products');
    }
  },

  // Get single product by ID - UPDATED
  async getProductById(id) {
    try {
      console.log('📡 Fetching product from:', `${API_ENDPOINTS.PRODUCTS}/${id}`);
      const response = await apiClient.get(`${API_ENDPOINTS.PRODUCTS}/${id}`);
      console.log('✅ Product service response:', response);
      return response;
    } catch (error) {
      console.error('❌ Product service error:', error);
      throw new Error(error.message || 'Failed to fetch product');
    }
  },

  // Get product variants
  async getProductVariants(productId) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.PRODUCTS}/${productId}/variants`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch product variants');
    }
  },

  // Sync products from Printify
  async syncProducts(shopId) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.PRODUCTS_SYNC}/${shopId}`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to sync products');
    }
  },

  // Update product
  async updateProduct(id, productData) {
    try {
      const response = await apiClient.put(`${API_ENDPOINTS.PRODUCTS}/${id}`, productData);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to update product');
    }
  },

  // Delete product
  async deleteProduct(id) {
    try {
      const response = await apiClient.delete(`${API_ENDPOINTS.PRODUCTS}/${id}`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to delete product');
    }
  },

  // Search products
  async searchProducts(query, params = {}) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.PRODUCTS}/search`, {
        params: { ...params, search: query }
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to search products');
    }
  },

  // Filter products
  async filterProducts(filters = {}) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.PRODUCTS}/filter`, {
        params: filters
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to filter products');
    }
  },

  // Get similar products
  async getSimilarProducts(productId, limit = 4) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.PRODUCTS}/${productId}/similar`, {
        params: { limit }
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch similar products');
    }
  }
};