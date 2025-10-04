// src/services/api/paymentService.js
import apiClient from '../../config/api.js';
import { API_ENDPOINTS } from '../../config/constants.jsx';

export const paymentService = {
  // Create Razorpay order
  async createPaymentOrder(orderId) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.PAYMENTS_CREATE_ORDER, { orderId });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create payment order');
    }
  },

  // Verify payment (client-side verification)
  async verifyPayment(verificationData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.PAYMENTS_VERIFY, verificationData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Payment verification failed');
    }
  },

  // Get payment status
  async getPaymentStatus(orderId) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.PAYMENTS_STATUS}/${orderId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get payment status');
    }
  }
};