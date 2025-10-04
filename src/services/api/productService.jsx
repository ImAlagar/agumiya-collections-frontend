import apiClient from "../../config/api";

export const productService = {
  // Sync products with longer timeout
  async syncProducts(shopId) {
    try {
      const response = await apiClient.get(`/products/sync/${shopId}`, {
        timeout: 120000 // 2 minutes timeout for sync
      });
      return response.data;
    } catch (error) {
      console.error('💥 Sync products error:', error);
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('Sync is taking longer than expected. Products are being processed in the background.');
      }
      
      throw new Error(error.response?.data?.message || error.message || 'Failed to sync products');
    }
  },

  async getAllProducts(params = {}) {
    try {
      const response = await apiClient.get('/products', { 
        params,
        timeout: 30000 
      });
      return response.data;
    } catch (error) {
      console.error('Get all products error:', error);
      throw error;
    }
  },

  async getProductById(id) {
    try {
      const response = await apiClient.get(`/products/${id}`, {
        timeout: 30000
      });
      return response.data;
    } catch (error) {
      console.error('Get product by ID error:', error);
      throw error;
    }
  },

  async getFilteredProducts(filters = {}) {
    try {
      const response = await apiClient.get('/products/filter', {
        params: filters,
        timeout: 30000
      });
      return response.data;
    } catch (error) {
      console.error('Get filtered products error:', error);
      throw error;
    }
  },

  async updateProduct(id, productData) {
    try {
      const response = await apiClient.put(`/products/${id}`, productData, {
        timeout: 30000
      });
      return response.data;
    } catch (error) {
      console.error('Update product error:', error);
      throw error;
    }
  },

  async deleteProduct(id) {
    try {
      const response = await apiClient.delete(`/products/${id}`, {
        timeout: 30000
      });
      return response.data;
    } catch (error) {
      console.error('Delete product error:', error);
      throw error;
    }
  },

// In your productService.js file
async getSimilarProducts(productId, limit = 4) {
  try {
    const response = await apiClient.get(`/products/${productId}/similar`, {
      params: { limit },
      timeout: 30000
    });
    return response.data;
  } catch (error) {
    console.error('Get similar products error:', error);
    // Return empty array instead of throwing error
    return { success: true, data: [] };
  }
}
};