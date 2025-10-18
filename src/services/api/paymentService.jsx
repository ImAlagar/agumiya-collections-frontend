// src/services/api/paymentService.js
import apiClient from '../../config/api.js';
import { API_ENDPOINTS } from '../../config/constants.jsx';

export const paymentService = {
  // Create Razorpay order
  async createPaymentOrder(paymentData) {
    try {
      if (!paymentData.orderId) {
        throw new Error('Order ID is required');
      }

      const requestData = {
        orderId: paymentData.orderId.toString()
      };

      const response = await apiClient.post(API_ENDPOINTS.PAYMENTS_CREATE_ORDER, requestData);
      
      const paymentDataResponse = response.data.data;
      
      if (!paymentDataResponse) {
        throw new Error('No payment data found in response');
      }
      
      return {
        success: true,
        data: paymentDataResponse,
        rawResponse: response.data
      };
      
    } catch (error) {
      console.error('❌ Payment order creation failed:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to create payment order';
      
      return {
        success: false,
        error: errorMessage,
        message: errorMessage,
        status: error.response?.status
      };
    }
  },


  // Verify payment (client-side verification)
  async verifyPayment(verificationData) {
    try {
      
      // Validate required fields - INCLUDING ORDER ID
      const requiredFields = ['razorpay_payment_id', 'razorpay_order_id', 'razorpay_signature', 'orderId'];
      const missingFields = requiredFields.filter(field => !verificationData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required verification fields: ${missingFields.join(', ')}`);
      }

      // Ensure we're sending the correct data structure
      const verificationPayload = {
        razorpay_payment_id: verificationData.razorpay_payment_id,
        razorpay_order_id: verificationData.razorpay_order_id,
        razorpay_signature: verificationData.razorpay_signature,
        orderId: verificationData.orderId // 🔥 Make sure this is included
      };


      const response = await apiClient.post(API_ENDPOINTS.PAYMENTS_VERIFY, verificationPayload);
      
      
      return response.data;
      
    } catch (error) {
      console.error('❌ Payment verification error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Payment verification failed';
      
      throw new Error(errorMessage);
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