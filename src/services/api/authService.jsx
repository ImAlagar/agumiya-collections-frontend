// src/services/api/authService.js
import apiClient from '../../config/api.js';
import { API_ENDPOINTS, USER_TYPES, STORAGE_KEYS } from '../../config/constants.jsx';
import { storageManager } from '../storage/storageManager';

export const authService = {
  // ------------------ ADMIN METHODS ------------------
  async loginAdmin(credentials) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.ADMIN_LOGIN, credentials);
      const data = response.data;

      if (data?.success && data?.token) {
        // Save admin token & details
        storageManager.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token, USER_TYPES.ADMIN);
        storageManager.setItem(STORAGE_KEYS.USER_TYPE, USER_TYPES.ADMIN, USER_TYPES.ADMIN);
        storageManager.setItem(STORAGE_KEYS.USER_DATA, data.admin, USER_TYPES.ADMIN);
      }

      return data;
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Admin login failed' 
      };
    }
  },

  async getAdminProfile() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN_PROFILE);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get admin profile');
    }
  },

  async forgotAdminPassword(email) { // Changed parameter to accept just email string
    try {
      // Send email as string directly, not as object
      const response = await apiClient.post(API_ENDPOINTS.ADMIN_FORGOT_PASSWORD, { email });
      return response.data;
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to send reset email' 
      };
    }
  },

  async resetAdminPassword(resetData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.ADMIN_RESET_PASSWORD, resetData);
      return response.data;
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Password reset failed' 
      };
    }
  },


  // ------------------ USER METHODS ------------------
  async loginUser(credentials) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.USER_LOGIN, credentials);
      const data = response.data;

      if (data?.success && data?.token) {
        // Save user token & details
        storageManager.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token, USER_TYPES.USER);
        storageManager.setItem(STORAGE_KEYS.USER_TYPE, USER_TYPES.USER, USER_TYPES.USER);
        storageManager.setItem(STORAGE_KEYS.USER_DATA, data.user, USER_TYPES.USER);
      }

      return data;
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'User login failed' 
      };
    }
  },

  async registerUser(userData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.USER_REGISTER, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },


  async forgotUserPassword(email) { // Changed parameter to accept just email string
    try {
      // Send email as string directly, not as object
      const response = await apiClient.post(API_ENDPOINTS.USER_FORGOT_PASSWORD, { email });
      return response.data;
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to send reset email' 
      };
    }
  },

  async resetUserPassword(resetData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.USER_RESET_PASSWORD, resetData);
      return response.data;
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Password reset failed' 
      };
    }
  },

  async getUserProfile() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USER_PROFILE);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get user profile');
    }
  },

  async updateProfile(profileData) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.USER_UPDATE_PROFILE, profileData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Profile update failed');
    }
  },

  // ------------------ COMMON METHODS ------------------
  async logout() {
    try {
      await apiClient.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.warn('Logout API call failed:', error);
    }

    // Clear all tokens (user & admin)
    storageManager.clearAllAuth();
    return { success: true };
  }
};
