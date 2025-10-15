// src/services/api/reviewService.js
import apiClient from '../../config/api.js';
import { API_ENDPOINTS } from '../../config/constants.jsx';

export const reviewService = {
  // ------------------ USER REVIEW METHODS ------------------
  async createReview(reviewData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.REVIEWS.CREATE, reviewData);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create review',
        error: error.response?.data,
        validationErrors: error.response?.data?.errors
      };
    }
  },

  async createReviewWithImages(formData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.REVIEWS.CREATE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create review with images',
        error: error.response?.data?.message || 'Failed to create review with images'
      };
    }
  },

  async getUserReviews(page = 1, limit = 10) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.REVIEWS.USER_REVIEWS, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch user reviews',
        data: { reviews: [], totalCount: 0, totalPages: 0, currentPage: 1 }
      };
    }
  },

  async updateReview(reviewId, updateData) {
    try {
      const response = await apiClient.put(`${API_ENDPOINTS.REVIEWS.BASE}/${reviewId}`, updateData);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update review'
      };
    }
  },

  async deleteReview(reviewId) {
    try {
      const response = await apiClient.delete(`${API_ENDPOINTS.REVIEWS.BASE}/${reviewId}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete review'
      };
    }
  },


  async markHelpful(reviewId, isHelpful) {
    try {
      const response = await apiClient.post(`${API_ENDPOINTS.REVIEWS.BASE}/${reviewId}/helpful`, {
        isHelpful
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to mark helpful'
      };
    }
  },

  async reportReview(reviewId, reason) {
    try {
      const response = await apiClient.post(`${API_ENDPOINTS.REVIEWS.BASE}/${reviewId}/report`, {
        reason
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to report review'
      };
    }
  },

  // ------------------ PUBLIC REVIEW METHODS ------------------
  getProductReviews: async (productId, filters = {}) => {
    try {

      
      // Ensure all parameters are properly formatted
      const params = {
        sortBy: filters.sortBy || 'helpful',
        rating: filters.rating === 'all' ? undefined : filters.rating,
        page: filters.page || 1,
        limit: filters.limit || 5
      };

      // Remove undefined parameters
      Object.keys(params).forEach(key => {
        if (params[key] === undefined || params[key] === null) {
          delete params[key];
        }
      });


      const response = await apiClient.get(`/reviews/product/${productId}`, {
        params: params,
        paramsSerializer: {
          indexes: null
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('❌ API call failed:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      
      // Throw a more descriptive error
      const errorMessage = error.response?.data?.message || 
                          `Failed to fetch reviews: ${error.message}`;
      throw new Error(errorMessage);
    }
  },

  // ------------------ ADMIN REVIEW METHODS ------------------
  async getPendingReviews(page = 1, limit = 10) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.REVIEWS.ADMIN_PENDING, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch pending reviews',
        data: { reviews: [], totalCount: 0, totalPages: 0, currentPage: 1 }
      };
    }
  },

  async approveReview(reviewId) {
    try {
      // FIXED: Use the correct endpoint structure - /reviews/admin/{id}/approve
      const response = await apiClient.patch(`${API_ENDPOINTS.REVIEWS.ADMIN_APPROVE}/${reviewId}/approve`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to approve review'
      };
    }
  },

  async rejectReview(reviewId, reason) {
    try {
      // ✅ Correct: Use the base admin endpoint and build the full path
      const response = await apiClient.delete(
        `${API_ENDPOINTS.REVIEWS.ADMIN_REJECT}/${reviewId}/reject`,
        { data: { reason } }  // Note: axios uses `data` for DELETE body
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to reject review'
      };
    }
  },

  // ------------------ ENHANCED ADMIN METHODS ------------------
  async getAdminReviews(filters = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.REVIEWS.ADMIN_ALL, {
        params: filters
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch admin reviews',
        data: { 
          reviews: [], 
          totalCount: 0, 
          totalPages: 0, 
          currentPage: 1,
          stats: {}
        }
      };
    }
  },

  async getAdminReviewStats() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.REVIEWS.ADMIN_STATS);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch review stats',
        data: {}
      };
    }
  },

  async bulkApproveReviews(reviewIds) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.REVIEWS.ADMIN_BULK_APPROVE, {
        reviewIds
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to bulk approve reviews'
      };
    }
  },

  async bulkDeleteReviews(reviewIds) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.REVIEWS.ADMIN_BULK_DELETE, {
        reviewIds
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to bulk delete reviews'
      };
    }
  }
};