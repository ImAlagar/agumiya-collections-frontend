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
        params: this.normalizeFilters(filters),
        timeout: 30000
      });
      return response.data;
    } catch (error) {
      console.error('💥 Get filtered products error:', error);
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

async deletePrintifyProduct(shopId, printifyProductId) {
  try {
    const response = await apiClient.delete(`/products/printify/${shopId}/${printifyProductId}`, {
      timeout: 30000
    });
    return response.data;
  } catch (error) {
    console.error('Delete Printify product error:', error);
    throw error;
  }
},

  async getSimilarProducts(productId, limit = 4) {
    try {
      const response = await apiClient.get(`/products/${productId}/similar`, {
        params: { limit },
        timeout: 30000
      });
      return response.data;
    } catch (error) {
      console.error('Get similar products error:', error);
      return { success: true, data: [] };
    }
  },

  async getProductFilters() {
    try {
      const response = await apiClient.get('/products/filters', {
        timeout: 30000
      });
      return response.data;
    } catch (error) {
      console.error('💥 Get product filters error:', error);
      // Return default filters if API fails
      return {
        success: true,
        data: {
          categories: [],
          priceRange: { min: 0, max: 1000 },
          stockCounts: { inStock: 0, outOfStock: 0, total: 0 }
        }
      };
    }
  },

  normalizeFilters(filters) {
    const normalized = { ...filters };
    
    
    // Handle categories - ensure it's properly formatted for the API
    if (normalized.categories) {
      if (Array.isArray(normalized.categories)) {
        // For multiple categories, send as array
        normalized.categories = normalized.categories;
      }
      // For single category, keep as string
    }
    
    // Handle price filters - ensure they're numbers
    if (normalized.minPrice) {
      normalized.minPrice = parseFloat(normalized.minPrice);
    }
    if (normalized.maxPrice) {
      normalized.maxPrice = parseFloat(normalized.maxPrice);
    }
    
    // Handle inStock filter
    if (normalized.inStock === 'all') {
      delete normalized.inStock; // Remove 'all' from API call
    }
    
    // Remove empty values
    Object.keys(normalized).forEach(key => {
      if (normalized[key] === null || 
          normalized[key] === undefined || 
          normalized[key] === '' ||
          (Array.isArray(normalized[key]) && normalized[key].length === 0)) {
        delete normalized[key];
      }
    });
    
    return normalized;
  },
  
    async getProductsByCategory(category, page = 1, limit = 12) {
    try {
      const response = await apiClient.get(`/products/category/${encodeURIComponent(category)}`, {
        params: { page, limit },
        timeout: 30000
      });
      return response.data;
    } catch (error) {
      console.error('Get products by category error:', error);
      throw error;
    }
  },
};