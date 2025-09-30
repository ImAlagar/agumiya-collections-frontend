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
  ADMIN_FORGOT_PASSWORD: '/admin/forgot-password',
  ADMIN_RESET_PASSWORD: '/admin/reset-password',
  
  // User endpoints
  USER_LOGIN: '/users/login',
  USER_REGISTER: '/users/register',
  USER_PROFILE: '/users/profile',
  USER_UPDATE_PROFILE: '/users/profile',
  USER_FORGOT_PASSWORD: '/users/forgot-password',
  USER_RESET_PASSWORD: '/users/reset-password',
  ALL_USERS: '/users',
  
  // Products endpoints
  PRODUCTS: '/products',
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

export const STOCK_STATUS = {
  ALL: 'all',
  IN_STOCK: 'true',
  OUT_OF_STOCK: 'false'
};

export const SORT_OPTIONS = {
  NAME_ASC: { sortBy: 'name', sortOrder: 'asc' },
  NAME_DESC: { sortBy: 'name', sortOrder: 'desc' },
  PRICE_ASC: { sortBy: 'price', sortOrder: 'asc' },
  PRICE_DESC: { sortBy: 'price', sortOrder: 'desc' },
  DATE_ASC: { sortBy: 'createdAt', sortOrder: 'asc' },
  DATE_DESC: { sortBy: 'createdAt', sortOrder: 'desc' }
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

// Pagination defaults
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  SORT_BY: 'name',
  SORT_ORDER: 'asc'
};