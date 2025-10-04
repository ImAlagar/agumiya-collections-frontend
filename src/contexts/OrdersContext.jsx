import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { orderService } from '../services/api/orderService';
import logger from '../utils/logger'; // ✅ Add professional logger

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
    limit: 5
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false,
    limit: 5
  }
};

const ordersReducer = (state, action) => {
  switch (action.type) {
    case ORDER_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case ORDER_ACTIONS.SET_ORDERS:
      return {
        ...state,
        orders: action.payload.orders,
        pagination: { ...state.pagination, ...action.payload.pagination },
        isLoading: false,
        error: null
      };
    case ORDER_ACTIONS.SET_ORDER:
      return { ...state, currentOrder: action.payload, isLoading: false };
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
      const updated = action.payload;
      return {
        ...state,
        orders: state.orders.map(o => (o.id === updated.id ? updated : o)),
        currentOrder: state.currentOrder?.id === updated.id ? updated : state.currentOrder
      };
    case ORDER_ACTIONS.SET_STATS:
      return { ...state, stats: action.payload };
    default:
      return state;
  }
};

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ordersReducer, initialState);

  // ✅ Fetch All Orders
const fetchOrders = useCallback(async (page = 1, filters = {}) => {
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

    Object.keys(params).forEach((k) => !params[k] && delete params[k]);

    logger.info(`📦 Fetching orders (page ${page}, filters: ${JSON.stringify(params)})`);

    const response = await orderService.getAllOrders(params);

    if (response.success) {
      // ✅ FIX: Handle the actual API response structure
      const apiData = response.data;
      
      // Your API returns the orders array directly in data
      const ordersArray = apiData.orders || apiData.data || [];
      
      const pagination = {
        currentPage: apiData.currentPage || page,
        totalPages: apiData.totalPages || Math.ceil(ordersArray.length / (params.limit || 5)),
        totalCount: apiData.totalCount || ordersArray.length,
        limit: currentFilters.limit
      };

      dispatch({
        type: ORDER_ACTIONS.SET_ORDERS,
        payload: { orders: ordersArray, pagination }
      });

      logger.info(`✅ Loaded ${ordersArray.length} orders successfully`);
    } else {
      throw new Error(response.message || 'Failed to fetch orders');
    }
  } catch (error) {
    logger.error(`❌ Fetch orders failed: ${error.message}`);
    dispatch({
      type: ORDER_ACTIONS.SET_ERROR,
      payload: error.message || 'Failed to load orders'
    });
  }
}, [state.filters]);

  // ✅ Fetch Single Order
  const fetchOrderById = useCallback(async (id) => {
    try {
      logger.info(`🔍 Fetching order #${id}`);
      dispatch({ type: ORDER_ACTIONS.SET_LOADING, payload: true });
      const response = await orderService.getOrderById(id);

      if (response.success) {
        dispatch({ type: ORDER_ACTIONS.SET_ORDER, payload: response.data });
        logger.info(`✅ Order #${id} fetched successfully`);
      } else throw new Error(response.message);
    } catch (error) {
      logger.error(`❌ Fetch order #${id} failed: ${error.message}`);
      dispatch({ type: ORDER_ACTIONS.SET_ERROR, payload: error.message });
    }
  }, []);

  // ✅ Create Order
  const createOrder = useCallback(async (orderData) => {
    try {
      logger.info(`🧾 Creating new order for user: ${orderData.userId || 'unknown'}`);
      const response = await orderService.createOrder(orderData);
      if (response.success) {
        logger.info(`✅ Order created: ${response.data?.id}`);
        return { success: true, order: response.data };
      } else throw new Error(response.message);
    } catch (error) {
      logger.error(`❌ Create order failed: ${error.message}`);
      dispatch({
        type: ORDER_ACTIONS.SET_ERROR,
        payload: error.message
      });
      return { success: false, error: error.message };
    }
  }, []);

  // ✅ Update Order Status
  const updateOrderStatus = useCallback(async (orderId, statusData) => {
    try {
      logger.info(`⚙️ Updating order #${orderId} → ${statusData.status}`);
      const response = await orderService.updateOrderStatus(orderId, statusData);
      if (response.success) {
        dispatch({ type: ORDER_ACTIONS.UPDATE_ORDER, payload: response.data });
        logger.info(`✅ Order #${orderId} updated successfully`);
        return { success: true };
      } else throw new Error(response.message);
    } catch (error) {
      logger.error(`❌ Update order #${orderId} failed: ${error.message}`);
      dispatch({ type: ORDER_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false };
    }
  }, []);

  // ✅ Retry Printify Order
  const retryPrintifyOrder = useCallback(async (orderId) => {
    try {
      logger.info(`🔁 Retrying Printify order sync for #${orderId}`);
      const response = await orderService.retryPrintifyOrder(orderId);
      if (response.success) {
        dispatch({ type: ORDER_ACTIONS.UPDATE_ORDER, payload: response.data });
        logger.info(`✅ Printify order #${orderId} retried successfully`);
        return { success: true };
      } else throw new Error(response.message);
    } catch (error) {
      logger.error(`❌ Retry Printify order #${orderId} failed: ${error.message}`);
      dispatch({ type: ORDER_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false };
    }
  }, []);

  // ✅ Fetch Order Stats
// Debug version to see exactly what's happening
const fetchOrderStats = useCallback(async () => {
  try {
    console.log('🔄 [DEBUG] fetchOrderStats called');
    
    logger.info('📊 Fetching order statistics...');
    const response = await orderService.getOrderStats();
    
    console.log('📊 [DEBUG] orderService response:', response);
    
    if (response && response.success) {
      dispatch({ type: ORDER_ACTIONS.SET_STATS, payload: response.data });
      logger.info('✅ Order statistics fetched successfully');
      
      const result = {
        success: true,
        stats: response.data
      };
      console.log('✅ [DEBUG] Returning success:', result);
      return result;
    } else {
      const result = {
        success: false,
        error: response?.message || 'No success flag in response',
        stats: null
      };
      console.log('❌ [DEBUG] Returning failure:', result);
      return result;
    }
  } catch (error) {
    console.error('💥 [DEBUG] fetchOrderStats error:', error);
    logger.error(`❌ Fetch order stats failed: ${error.message}`);
    
    const result = {
      success: false,
      error: error.message,
      stats: null
    };
    console.log('❌ [DEBUG] Returning error result:', result);
    return result;
  }
}, []);
  const setFilters = useCallback((newFilters) => {
    logger.info(`🔍 Updating filters: ${JSON.stringify(newFilters)}`);
    dispatch({ type: ORDER_ACTIONS.SET_FILTERS, payload: newFilters });
  }, []);

  const updateFilters = useCallback((newFilters) => {
    logger.info(`🔄 Filters applied: ${JSON.stringify(newFilters)}`);
    dispatch({ type: ORDER_ACTIONS.SET_FILTERS, payload: newFilters });
    fetchOrders(1);
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
    logger.error('❌ useOrders used outside OrdersProvider');
    throw new Error('useOrders must be used within a OrdersProvider');
  }
  return context;
};
