// src/services/api/couponService.js
import apiClient from '../../config/api.js';
import { API_ENDPOINTS } from '../../config/constants.jsx';

export const couponService = {
  // ------------------ COUPON MANAGEMENT METHODS ------------------
  async createCoupon(couponData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.COUPONS, couponData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create coupon');
    }
  },

  async getCoupons(params = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.COUPONS, { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch coupons');
    }
  },

  async getCouponById(id) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.COUPONS}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch coupon');
    }
  },

  async updateCoupon(id, updateData) {
    try {
      const response = await apiClient.put(`${API_ENDPOINTS.COUPONS}/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update coupon');
    }
  },

  async deleteCoupon(id) {
    try {
      const response = await apiClient.delete(`${API_ENDPOINTS.COUPONS}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete coupon');
    }
  },

  async getCouponStats() {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.COUPONS}/stats`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch coupon statistics');
    }
  },

  // ------------------ COUPON VALIDATION METHODS ------------------
  async validateCoupon(validationData) {
    try {
      const response = await apiClient.post(`${API_ENDPOINTS.COUPONS}/validate`, validationData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to validate coupon');
    }
  },

  // ------------------ BULK OPERATIONS ------------------
  async bulkDeleteCoupons(ids) {
    try {
      const response = await apiClient.post(`${API_ENDPOINTS.COUPONS}/bulk-delete`, { ids });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete coupons');
    }
  },

  async bulkUpdateCoupons(ids, updateData) {
    try {
      const response = await apiClient.post(`${API_ENDPOINTS.COUPONS}/bulk-update`, { 
        ids, 
        updateData 
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update coupons');
    }
  }
};