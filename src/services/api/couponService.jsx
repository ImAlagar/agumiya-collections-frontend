// src/services/api/couponService.js
import apiClient from "../../config/api";
import { API_ENDPOINTS } from "../../config/constants";

export const couponService = {
  // =========================
  // 🧑‍💼 ADMIN COUPON APIS
  // =========================

  // ✅ Create new coupon
  async createCoupon(data) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.COUPONS, data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to create coupon:", error);
      throw error;
    }
  },

  // ✅ Get all coupons
  async getAllCoupons() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.COUPONS);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to fetch all coupons:", error);
      throw error;
    }
  },

  // ✅ Get coupon by ID
  async getCouponById(id) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.COUPONS}/${id}`);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to fetch coupon by ID:", error);
      throw error;
    }
  },

  // ✅ Update coupon
  async updateCoupon(id, data) {
    try {
      const response = await apiClient.put(`${API_ENDPOINTS.COUPONS}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to update coupon:", error);
      throw error;
    }
  },

  // ✅ Delete coupon
 async deleteCoupon(id) {
    try {

      
      const response = await apiClient.delete(`${API_ENDPOINTS.COUPONS}/${id}`);
      
      return response.data;
    } catch (error) {
      console.error("❌ Failed to delete coupon:", error);
      
      // Detailed error logging
      if (error.response) {
        console.error("📋 Server response:", error.response.data);
        console.error("📋 Status:", error.response.status);
        console.error("📋 Headers:", error.response.headers);
      } else if (error.request) {
        console.error("📋 No response received:", error.request);
      } else {
        console.error("📋 Error message:", error.message);
      }
      
      throw error;
    }
  },

  // =========================
  // 🛒 USER COUPON APIS
  // =========================

  // ✅ Validate coupon (during checkout)
  async validateCoupon(data) {
    try {
      const response = await apiClient.post(`${API_ENDPOINTS.COUPONS}/validate`, data);
      return response.data;
    } catch (error) {
      console.error("❌ Coupon validation failed:", error);
      throw error;
    }
  },

  // ✅ Get available coupons (for suggestions) - FIXED
  async getAvailableCoupons(data = {}) {
    try {
      const response = await apiClient.post(`${API_ENDPOINTS.COUPONS}/available`, data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to fetch available coupons:", error);
      throw error;
    }
  },

  // ✅ Mark coupon as used (after successful payment)
  async markCouponAsUsed(data) {
    try {
      const response = await apiClient.post(`${API_ENDPOINTS.COUPONS}/mark-used`, data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to mark coupon as used:", error);
      throw error;
    }
  },

  // =========================
  // 🌐 PUBLIC COUPON APIS (No authentication required)
  // =========================

  async getPublicCoupons(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (filters.minOrderAmount) queryParams.append('minOrderAmount', filters.minOrderAmount);
      
      const url = `${API_ENDPOINTS.COUPONS}/public/available?${queryParams.toString()}`;
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to fetch public coupons:", error);
      throw error;
    }
  },

  // ✅ Get coupon categories for filtering
  async getCouponCategories() {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.COUPONS}/public/categories`);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to fetch coupon categories:", error);
      throw error;
    }
  },

  // ✅ Get popular coupons (most used)
  async getPopularCoupons(limit = 5) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.COUPONS}/public/popular?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to fetch popular coupons:", error);
      throw error;
    }
  },
};