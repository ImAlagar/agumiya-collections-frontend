// src/services/api/authService.js
import apiClient from '../../config/api.js';
import { API_ENDPOINTS, USER_TYPES, STORAGE_KEYS } from '../../config/constants.jsx';
import { storageManager } from '../storage/storageManager';

// Unified error handler
const handleServiceError = (error, defaultMessage) => {
  const message = error.apiMessage || error.response?.data?.message || error.message || defaultMessage;
  throw new Error(message);
};

export const authService = {
  // ------------------ ADMIN METHODS ------------------
  async loginAdmin(credentials) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.ADMIN_LOGIN, credentials);
      const data = response.data;

      if (data?.success && data?.token) {
        storageManager.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token, USER_TYPES.ADMIN);
        storageManager.setItem(STORAGE_KEYS.USER_TYPE, USER_TYPES.ADMIN, USER_TYPES.ADMIN);
        storageManager.setItem(STORAGE_KEYS.USER_DATA, data.admin, USER_TYPES.ADMIN);
      }

      return data;
    } catch (error) {
      return handleServiceError(error, 'Admin login failed');
    }
  },

  async getAdminProfile() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN_PROFILE);
      return response.data;
    } catch (error) {
      throw handleServiceError(error, 'Failed to get admin profile');
    }
  },

  async forgotAdminPassword(email) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.ADMIN_FORGOT_PASSWORD, { email });
      return response.data;
    } catch (error) {
      throw handleServiceError(error, 'Failed to send reset email');
    }
  },

  async resetAdminPassword(resetData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.ADMIN_RESET_PASSWORD, resetData);
      return response.data;
    } catch (error) {
      throw handleServiceError(error, 'Password reset failed');
    }
  },

  // ------------------ USER METHODS ------------------
  async loginUser(credentials) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.USER_LOGIN, credentials);
      const data = response.data;

      if (data?.success && data?.token) {
        storageManager.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token, USER_TYPES.USER);
        storageManager.setItem(STORAGE_KEYS.USER_TYPE, USER_TYPES.USER, USER_TYPES.USER);
        storageManager.setItem(STORAGE_KEYS.USER_DATA, data.user, USER_TYPES.USER);
      }

      return data;
    } catch (error) {
      throw handleServiceError(error, 'User login failed');
    }
  },

  async registerUser(userData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.USER_REGISTER, userData);
      return response.data;
    } catch (error) {
      throw handleServiceError(error, 'Registration failed');
    }
  },

  async forgotUserPassword(email) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.USER_FORGOT_PASSWORD, { email });
      return response.data;
    } catch (error) {
      throw handleServiceError(error, 'Failed to send reset email');
    }
  },

  async resetUserPassword(resetData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.USER_RESET_PASSWORD, resetData);
      return response.data;
    } catch (error) {
      throw handleServiceError(error, 'Password reset failed');
    }
  },

  async getUserProfile() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USER_PROFILE);
      return response.data;
    } catch (error) {
      throw handleServiceError(error, 'Failed to get user profile');
    }
  },

  async updateProfile(profileData) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.USER_UPDATE_PROFILE, profileData);
      return response.data;
    } catch (error) {
      throw handleServiceError(error, 'Profile update failed');
    }
  },

  // ------------------ COMMON METHODS ------------------
  async logout() {
    try {
      await apiClient.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.warn('Logout API call failed:', error);
    }

    storageManager.clearAllAuth();
    return { success: true };
  }
};