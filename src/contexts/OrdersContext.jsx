// src/contexts/OrdersContext.js
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { orderService } from '../services/api/orderService';

const ORDER_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ORDERS: 'SET_ORDERS',
  SET_ORDER: 'SET_ORDER',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_FILTERS: 'SET_FILTERS',
  SET_PAGINATION: 'SET_PAGINATION',
  UPDATE_ORDER: 'UPDATE_ORDER',
  SET_STATS: 'SET_STATS'
};

const initialState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  stats: null, // Added stats
  filters: {
    search: '',
    status: 'all',
    paymentStatus: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    limit: 10
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false
  }
};

const ordersReducer = (state, action) => {
  switch (action.type) {
    case ORDER_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case ORDER_ACTIONS.SET_ORDERS:
      const { orders, pagination } = action.payload;
      return {
        ...state,
        orders,
        pagination: {
          currentPage: pagination.currentPage || 1,
          totalPages: pagination.totalPages || 1,
          totalCount: pagination.totalCount || 0,
          hasNext: pagination.hasNext || false,
          hasPrev: pagination.hasPrev || false
        },
        isLoading: false,
        error: null
      };

    case ORDER_ACTIONS.SET_ORDER:
      return {
        ...state,
        currentOrder: action.payload,
        isLoading: false,
        error: null
      };

    case ORDER_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };

    case ORDER_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };

    case ORDER_ACTIONS.SET_FILTERS:
      return { 
        ...state, 
        filters: { ...state.filters, ...action.payload },
        pagination: { ...state.pagination, currentPage: 1 }
      };

    case ORDER_ACTIONS.UPDATE_ORDER:
      const updatedOrder = action.payload;
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === updatedOrder.id ? updatedOrder : order
        ),
        currentOrder: state.currentOrder?.id === updatedOrder.id ? updatedOrder : state.currentOrder
      };

    case ORDER_ACTIONS.SET_STATS:
      return {
        ...state,
        stats: action.payload
      };

    default:
      return state;
  }
};

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ordersReducer, initialState);

  const fetchOrders = useCallback(async (page = state.pagination.currentPage, filters = {}) => {
    try {
      dispatch({ type: ORDER_ACTIONS.SET_LOADING, payload: true });
      
      const currentFilters = { ...state.filters, ...filters };
      
      const params = {
        page,
        limit: currentFilters.limit,
        search: currentFilters.search,
        status: currentFilters.status === 'all' ? '' : currentFilters.status,
        paymentStatus: currentFilters.paymentStatus === 'all' ? '' : currentFilters.paymentStatus,
        sortBy: currentFilters.sortBy,
        sortOrder: currentFilters.sortOrder
      };

      // Clean up empty params
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await orderService.getAllOrders(params);
      
      if (response.success) {
        dispatch({
          type: ORDER_ACTIONS.SET_ORDERS,
          payload: {
            orders: response.data.orders || response.data || [],
            pagination: response.data.pagination || {
              currentPage: page,
              totalPages: 1,
              totalCount: response.data.length || 0
            }
          }
        });
      } else {
        throw new Error(response.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Fetch orders error:', error);
      dispatch({ 
        type: ORDER_ACTIONS.SET_ERROR, 
        payload: error.message || 'Failed to load orders. Please try again.' 
      });
    }
  }, [state.filters, state.pagination.currentPage]);

  const fetchOrderById = useCallback(async (id) => {
    try {
      dispatch({ type: ORDER_ACTIONS.SET_LOADING, payload: true });
      const response = await orderService.getOrderById(id);
      
      if (response.success) {
        dispatch({ type: ORDER_ACTIONS.SET_ORDER, payload: response.data });
      } else {
        throw new Error(response.message || 'Failed to fetch order');
      }
    } catch (error) {
      dispatch({ type: ORDER_ACTIONS.SET_ERROR, payload: error.message });
    }
  }, []);

  const fetchOrderStats = useCallback(async () => {
    try {
      const response = await orderService.getOrderStats();
      if (response.success) {
        dispatch({ type: ORDER_ACTIONS.SET_STATS, payload: response.data });
        return { success: true, stats: response.data };
      } else {
        throw new Error(response.message || 'Failed to fetch order stats');
      }
    } catch (error) {
      console.error('Fetch order stats error:', error);
      return { success: false, error: error.message };
    }
  }, []);

  const updateOrderStatus = useCallback(async (orderId, statusData) => {
    try {
      const response = await orderService.updateOrderStatus(orderId, statusData);
      if (response.success) {
        dispatch({ type: ORDER_ACTIONS.UPDATE_ORDER, payload: response.data });
        return { success: true, order: response.data };
      } else {
        throw new Error(response.message || 'Update failed');
      }
    } catch (error) {
      dispatch({ type: ORDER_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  }, []);

  const retryPrintifyOrder = useCallback(async (orderId) => {
    try {
      const response = await orderService.retryPrintifyOrder(orderId);
      if (response.success) {
        dispatch({ type: ORDER_ACTIONS.UPDATE_ORDER, payload: response.data });
        return { success: true, order: response.data };
      } else {
        throw new Error(response.message || 'Retry failed');
      }
    } catch (error) {
      dispatch({ type: ORDER_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  }, []);

  const setFilters = useCallback((newFilters) => {
    dispatch({ type: ORDER_ACTIONS.SET_FILTERS, payload: newFilters });
  }, []);

  const updateFilters = useCallback(async (newFilters) => {
    dispatch({ type: ORDER_ACTIONS.SET_FILTERS, payload: newFilters });
    setTimeout(() => {
      fetchOrders(1);
    }, 0);
  }, [fetchOrders]);

  const clearError = useCallback(() => {
    dispatch({ type: ORDER_ACTIONS.CLEAR_ERROR });
  }, []);

  const value = {
    ...state,
    fetchOrders,
    fetchOrderById,
    fetchOrderStats,
    updateOrderStatus,
    retryPrintifyOrder,
    setFilters,
    updateFilters,
    clearError
  };

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within a OrdersProvider');
  }
  return context;
};