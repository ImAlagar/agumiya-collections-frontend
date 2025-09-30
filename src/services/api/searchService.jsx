// src/services/api/searchService.js
import apiClient from '../../config/api.js';

export const searchService = {
  // Global search across all entities
  async globalSearch(query, type = 'all', options = {}) {
    try {
      const params = {
        query: query.trim(),
        type,
        page: options.page || 1,
        limit: options.limit || 10,
        sortBy: options.sortBy || 'createdAt',
        sortOrder: options.sortOrder || 'desc'
      };

      const response = await apiClient.get('/search/global', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Search failed');
    }
  },

  // Search suggestions/autocomplete
  async getSearchSuggestions(query, type = 'products', limit = 5) {
    try {
      if (!query || query.length < 2) {
        return { success: true, data: { suggestions: [] } };
      }

      const response = await apiClient.get('/search/suggestions', {
        params: { query: query.trim(), type, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Search suggestions error:', error);
      return { success: true, data: { suggestions: [] } };
    }
  },

  // Popular searches
  async getPopularSearches(limit = 5) {
    try {
      const response = await apiClient.get('/search/popular', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Popular searches error:', error);
      return { success: true, data: { popular: [] } };
    }
  },

  // Trending products
  async getTrendingProducts(limit = 5) {
    try {
      const response = await apiClient.get('/search/trending', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Trending products error:', error);
      return { success: true, data: [] };
    }
  }
};