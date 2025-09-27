import apiClient from '../../config/api.js';
import { API_ENDPOINTS } from '../../config/constants.jsx';

export const dashboardService = {
  async getDashboardStats(period = 'month') {
    try {
      const response = await apiClient.get(API_ENDPOINTS.DASHBOARD_STATS, {
        params: { period }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch dashboard stats');
    }
  },

  async getSalesOverview(period = 'month', groupBy = 'day') {
    try {
      const response = await apiClient.get(API_ENDPOINTS.SALES_OVERVIEW, {
        params: { period, groupBy }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch sales overview');
    }
  },

  async getBestSellingProducts(period = 'month', limit = 10) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.BEST_SELLING, {
        params: { period, limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch best-selling products');
    }
  },

  async getOrderVolume(period = 'month') {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ORDER_VOLUME, {
        params: { period }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch order volume');
    }
  },

  async getRefundsReturns(period = 'month') {
    try {
      const response = await apiClient.get(API_ENDPOINTS.REFUNDS_RETURNS, {
        params: { period }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch refunds data');
    }
  }
};