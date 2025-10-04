// src/services/lookbookService.js
import apiClient from '../../config/api.js';

export const lookbookService = {
  async getCollections() {
    try {
      const response = await apiClient.get('/lookbook/collections');
      return response.data;
    } catch (error) {
      console.error('Get collections error:', error);
      throw error;
    }
  },

  async getLooks(filters = {}) {
    try {
      const response = await apiClient.get('/lookbook/looks', {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('Get looks error:', error);
      throw error;
    }
  },

  async getAllLooks() {
    try {
      const response = await apiClient.get('/lookbook/looks/all');
      return response.data;
    } catch (error) {
      console.error('Get all looks error:', error);
      throw error;
    }
  },

  async getFilters() {
    try {
      const response = await apiClient.get('/lookbook/filters');
      return response.data;
    } catch (error) {
      console.error('Get filters error:', error);
      throw error;
    }
  }
};