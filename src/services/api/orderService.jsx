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

  // Create order (for user)
  async createOrder(orderData) {
    try {

      const response = await apiClient.post(API_ENDPOINTS.ORDERS, orderData);
      return response.data;
    } catch (error) {
      console.error("❌ Order creation API error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      // ✅ Enhanced error handling with validation details
      if (error.response?.status === 422) {
        const validationErrors =
          error.response.data?.errors || error.response.data?.message;
        const errorMsg =
          typeof validationErrors === "string"
            ? validationErrors
            : "Validation failed. Please check your input.";
        throw new Error(errorMsg);
      }

      if (error.response?.status === 400) {
        throw new Error(
          error.response.data?.message || "Bad request. Please check your data."
        );
      }

      throw new Error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to create order. Please try again."
      );
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

  // User cancels their own order
  async cancelOrder(orderId, reason = "Cancelled by customer") {
    try {
      const response = await apiClient.post(
        `${API_ENDPOINTS.ORDERS}/${orderId}/cancel`,
        { reason }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to cancel order"
      );
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
