import apiClient from "../../config/api.js";
import { API_ENDPOINTS } from "../../config/constants.jsx";

export const orderService = {
  // Get all orders with pagination and filters
  async getAllOrders(params = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ORDERS, { params });


      if (response.data && response.data.success) {
        const apiData = response.data.data || [];

        return {
          success: true,
          data: {
            orders: apiData,
            currentPage: response.data.currentPage || params.page || 1,
            totalPages:
              response.data.totalPages ||
              Math.ceil(apiData.length / (params.limit || 5)),
            totalCount: response.data.totalCount || apiData.length,
          },
        };
      } else {
        return {
          success: false,
          message: response.data?.message || "Failed to fetch orders",
        };
      }
    } catch (error) {
      console.error("❌ Admin Orders API error:", {
        status: error.response?.status,
        message: error.response?.data?.message,
        error: error.message,
      });

      // If 401/403, it's an authentication issue
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error("Authentication failed. Please log in again.");
      }

      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch orders",
      };
    }
  },
  // Get single order by ID
  async getOrderById(id) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.ORDERS}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch order");
    }
  },

  // Update order status
  async updateOrderStatus(orderId, statusData) {
    try {
      const response = await apiClient.patch(
        `${API_ENDPOINTS.ORDERS}/${orderId}/status`,
        statusData
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update order status"
      );
    }
  },

  // Retry Printify forwarding
  async retryPrintifyOrder(orderId) {
    try {
      const response = await apiClient.post(
        `${API_ENDPOINTS.ORDERS}/${orderId}/retry-printify`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to retry Printify forwarding"
      );
    }
  },

  async createOrder(orderData) {
    try {
      
      const response = await apiClient.post(API_ENDPOINTS.ORDERS, orderData);
      return response.data;
    } catch (error) {
      console.error('❌ Order creation API error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      // Log the actual error response from backend
      if (error.response?.data) {
        console.error('🔍 Backend error details:', error.response.data);
      }
      
      throw new Error(error.response?.data?.message || 'Invalid order data. Please check your cart items and try again.');
    }
  },

  // In your orderService
  async getOrderStats() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ORDER_STATS);

      // ✅ Ensure consistent response structure
      if (response.data && typeof response.data === "object") {
        return {
          success: true,
          data: response.data,
        };
      } else {
        return {
          success: false,
          message: "Invalid response format from order stats API",
        };
      }
    } catch (error) {
      console.error("❌ Order stats API error:", error);

      // ✅ Return consistent error structure
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch order stats",
      };
    }
  },

  async getUserOrders() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USER_ORDERS);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get user orders"
      );
    }
  },

// In your frontend orderService.jsx
async cancelOrder(orderId, reason = "Cancelled by customer") {
  try {
    const timeoutMs = 15000; // 15 seconds should be plenty
    
    
    const response = await Promise.race([
      apiClient.post(`${API_ENDPOINTS.ORDERS}/${orderId}/cancel`, { reason }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
      )
    ]);
    
    
    // Handle both response formats
    if (response.data && (response.data.success || response.data.data)) {
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Order cancelled successfully'
      };
    } else {
      return {
        success: false,
        error: response.data?.message || 'Cancellation failed',
        message: response.data?.message || 'Cancellation failed'
      };
    }
    
  } catch (error) {
    console.error('❌ Frontend: Cancellation request failed:', {
      message: error.message,
      response: error.response?.data,
      isTimeout: error.message.includes('timeout') || error.code === 'ECONNABORTED'
    });
    
    // Handle timeout gracefully
    if (error.message.includes('timeout') || error.code === 'ECONNABORTED') {
      return {
        success: true, // Assume success for timeout cases
        message: 'Order cancellation is being processed. Please check back in a moment.',
        isProcessing: true
      };
    }
    
    // Handle other errors
    if (error.response?.status === 404) {
      throw new Error('Order not found.');
    } else if (error.response?.status === 403) {
      throw new Error('You do not have permission to cancel this order.');
    } else if (error.response?.status === 400) {
      throw new Error(error.response.data?.message || 'Cannot cancel this order.');
    }
    
    throw new Error(error.response?.data?.message || error.message || "Failed to cancel order");
  }
},

  // Admin cancels any order
  async adminCancelOrder(orderId, reason = "Cancelled by admin") {
    try {
      const response = await apiClient.post(
        `${API_ENDPOINTS.ORDERS}/${orderId}/admin-cancel`,
        { reason }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to cancel order"
      );
    }
  },

  // Process refund for cancelled order
  async processRefund(orderId, reason = "Order cancellation") {
    try {
      const response = await apiClient.post(
        `${API_ENDPOINTS.ORDERS}/${orderId}/process-refund`,
        { reason }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to process refund"
      );
    }
  },

  // Retry failed refund
  async retryRefund(orderId) {
    try {
      const response = await apiClient.post(
        `${API_ENDPOINTS.ORDERS}/${orderId}/retry-refund`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to retry refund"
      );
    }
  },

  // Reset refund status
  async resetRefundStatus(orderId) {
    try {
      const response = await apiClient.post(
        `${API_ENDPOINTS.ORDERS}/${orderId}/reset-refund`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to reset refund status"
      );
    }
  },

  // Get cancelled orders with filters
  async getCancelledOrders(params = {}) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.ORDERS}/cancelled`, { params });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch cancelled orders"
      );
    }
  },

  // Get cancellation statistics
  async getCancellationStats() {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.ORDERS}/cancellation-stats`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch cancellation statistics"
      );
    }
  },


    async getOrderTracking(orderId) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.ORDERS}/${orderId}/tracking`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch order tracking"
      );
    }
  },

  async markCouponAsUsed(couponUsageData) {
    try {
      const response = await apiClient.post(`${API_ENDPOINTS.COUPONS}/mark-used`, couponUsageData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to mark coupon as used');
    }
  },
};
