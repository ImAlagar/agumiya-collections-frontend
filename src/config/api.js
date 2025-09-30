// src/config/api/apiClient.js
import axios from 'axios';
import { storageManager } from '../services/storage/storageManager.jsx';
import { USER_TYPES, STORAGE_KEYS } from '../config/constants.jsx';

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Enhanced error extraction
const extractErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.response?.data) {
    return typeof error.response.data === 'string' 
      ? error.response.data 
      : JSON.stringify(error.response.data);
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// Enhanced token expiration handler
const handleTokenExpiration = async (error) => {
  try {
    storageManager.clearAllAuth();
    
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

// Response interceptor - FIXED
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401) {
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        return handleTokenExpiration(error);
      }
    }
    
    // Enhance error with extracted message
    error.apiMessage = extractErrorMessage(error);
    
    return Promise.reject(error);
  }
);

export default apiClient;