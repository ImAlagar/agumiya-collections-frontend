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
  stats: null,
  filters: {
    search: '',
    status: 'all',
    paymentStatus: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    limit: 5 // Changed from 10 to 5
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false,
    limit: 5 // Added limit here too
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
          ...state.pagination,
          ...pagination
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

  const fetchOrders = useCallback(async (page = 1, filters = {}) => {
    try {
      dispatch({ type: ORDER_ACTIONS.SET_LOADING, payload: true });
      
      const currentFilters = { ...state.filters, ...filters };
      
      const params = {
        page: page || 1,
        limit: currentFilters.limit || 5,
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
        const apiData = response.data;
        
        // Calculate pagination properties
        const currentPage = apiData.currentPage || page;
        const totalPages = apiData.totalPages || 1;
        const totalCount = apiData.totalCount || 0;
        const limit = currentFilters.limit || 5;

        dispatch({
          type: ORDER_ACTIONS.SET_ORDERS,
          payload: {
            orders: apiData.orders || apiData || [],
            pagination: {
              currentPage,
              totalPages,
              totalCount,
              limit,
              hasPrev: currentPage > 1,
              hasNext: currentPage < totalPages
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
  }, [state.filters]);

  // Add page size update function
  const updatePageSize = useCallback(async (newLimit) => {
    // Update filters with new limit
    dispatch({ 
      type: ORDER_ACTIONS.SET_FILTERS, 
      payload: { limit: newLimit } 
    });
    
    // Fetch orders with new page size, reset to page 1
    setTimeout(() => {
      fetchOrders(1, { limit: newLimit });
    }, 0);
  }, [fetchOrders]);

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

  const createOrder = useCallback(async (orderData) => {
    try {
      dispatch({ type: ORDER_ACTIONS.SET_LOADING, payload: true });
      const response = await orderService.createOrder(orderData);
      
      if (response.success) {
        dispatch({ type: ORDER_ACTIONS.SET_LOADING, payload: false });
        return { success: true, order: response.data };
      } else {
        throw new Error(response.message || 'Failed to create order');
      }
    } catch (error) {
      dispatch({ 
        type: ORDER_ACTIONS.SET_ERROR, 
        payload: error.message || 'Failed to create order. Please try again.' 
      });
      return { success: false, error: error.message };
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
    createOrder,
    fetchOrders,
    fetchOrderById,
    fetchOrderStats,
    updateOrderStatus,
    retryPrintifyOrder,
    setFilters,
    updateFilters,
    updatePageSize, // Add this new function
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