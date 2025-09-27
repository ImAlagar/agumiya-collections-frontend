// src/config/constants.js
export const USER_TYPES = {
  ADMIN: 'admin',
  USER: 'user'
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
  USER_TYPE: 'userType',
  PRODUCTS_FILTERS: 'productsFilters'
};

export const API_ENDPOINTS = {
  // Admin endpoints
  ADMIN_LOGIN: '/admin/login',
  ADMIN_PROFILE: '/admin/dashboard',
  
  // User endpoints
  USER_LOGIN: '/users/login',
  USER_REGISTER: '/users/register',
  USER_PROFILE: '/users/profile',
  USER_UPDATE_PROFILE: '/users/profile',
  ALL_USERS: '/users',
  
    // Products endpoints
  PRODUCTS: '/products',         // ✅ remove /api/v1 here
  PRODUCTS_SYNC: '/products/sync',

  ORDERS: '/orders',
  ORDER_STATS: '/orders/stats',

    // Dashboard endpoints
  DASHBOARD_STATS: '/dashboard/stats',
  SALES_OVERVIEW: '/dashboard/sales-overview',
  BEST_SELLING: '/dashboard/best-selling',
  ORDER_VOLUME: '/dashboard/order-volume',
  REFUNDS_RETURNS: '/dashboard/refunds-returns',
  
  // Common
  LOGOUT: '/logout'
};

// Product related constants
export const PRODUCT_CATEGORIES = [
  'All',
  'Accessories',
  'Unisex',
  'Men',
  'Women',
  'Kids',
  'Home & Living',
  'Electronics'
];

export const PRODUCT_STATUS = {
  IN_STOCK: true,
  OUT_OF_STOCK: false
};

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
};

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED'
};

export const ORDER_FILTERS = {
  STATUS: {
    ALL: 'all',
    PENDING: 'PENDING',
    PROCESSING: 'PROCESSING',
    SHIPPED: 'SHIPPED',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED'
  },
  PAYMENT: {
    ALL: 'all',
    PENDING: 'PENDING',
    PAID: 'PAID',
    FAILED: 'FAILED',
    REFUNDED: 'REFUNDED'
  }
};