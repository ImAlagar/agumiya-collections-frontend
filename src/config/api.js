// src/config/api/apiClient.js
import axios from 'axios';
import { storageManager } from '../services/storage/storageManager.jsx'; // Import the instance
import { USER_TYPES, STORAGE_KEYS } from '../config/constants.jsx';

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Enhanced token expiration handler
const handleTokenExpiration = async (error) => {
  try {
    // Clear all auth data using the storage manager
    storageManager.clearAllAuth();
    
    // Only redirect if we're in a browser environment and not already on a login page
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const isLoginPage = currentPath.includes('login');
      
      if (!isLoginPage) {
        const isAdminRoute = currentPath.startsWith('/admin');
        const loginPath = isAdminRoute ? '/admin/login' : '/login';
        window.location.href = loginPath;
      }
    }
  } catch (logoutError) {
    console.error('Error during token expiration handling:', logoutError);
  }
  
  return Promise.reject(error);
};

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = storageManager.getItem(STORAGE_KEYS.AUTH_TOKEN, USER_TYPES.USER) || 
                  storageManager.getItem(STORAGE_KEYS.AUTH_TOKEN, USER_TYPES.ADMIN);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - FIXED: Proper error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Only handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        return handleTokenExpiration(error);
      }
    }
    
    // Handle other errors without redirecting
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data);
    } else if (error.code === 'NETWORK_ERROR' || !error.response) {
      console.error('Network error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;