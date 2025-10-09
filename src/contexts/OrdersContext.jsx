import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import { orderService } from "../services/api/orderService";
import logger from "../utils/logger"; // ✅ Add professional logger

const ORDER_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_ORDERS: "SET_ORDERS",
  SET_ORDER: "SET_ORDER",
  SET_ORDER_TRACKING: "SET_ORDER_TRACKING", // 👈 ADD THIS
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
  SET_FILTERS: "SET_FILTERS",
  SET_PAGINATION: "SET_PAGINATION",
  UPDATE_ORDER: "UPDATE_ORDER",
  SET_STATS: "SET_STATS",
  SET_CANCELLED_ORDERS: "SET_CANCELLED_ORDERS",
  SET_CANCELLATION_STATS: "SET_CANCELLATION_STATS",
  UPDATE_ORDER_STATUS: "UPDATE_ORDER_STATUS",
  SET_REFUND_LOADING: "SET_REFUND_LOADING",
};

const initialState = {
  orders: [],
  currentOrder: null,
  currentOrderTracking: null,
  cancelledOrders: [],
  cancellationStats: null,
  refundLoading: false,
  isLoading: false,
  error: null,
  stats: null,
  filters: {
    search: "",
    status: "all",
    paymentStatus: "all",
    sortBy: "createdAt",
    sortOrder: "desc",
    limit: 5, // Changed from 12 to 5
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false,
    limit: 5, // Changed from 12 to 5
  },
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
        error: null,
      };

    case ORDER_ACTIONS.SET_ORDER:
      return { ...state, currentOrder: action.payload, isLoading: false };
    case ORDER_ACTIONS.SET_ORDER_TRACKING: // 👈 ADD THIS CASE
      return { ...state, currentOrderTracking: action.payload, isLoading: false };
    case ORDER_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    case ORDER_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    case ORDER_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
        pagination: { ...state.pagination, currentPage: 1 },
      };
    case ORDER_ACTIONS.UPDATE_ORDER:
      const updated = action.payload;
      return {
        ...state,
        orders: state.orders.map((o) => (o.id === updated.id ? updated : o)),
        currentOrder:
          state.currentOrder?.id === updated.id ? updated : state.currentOrder,
      };
    case ORDER_ACTIONS.SET_STATS:
      return { ...state, stats: action.payload };
    case ORDER_ACTIONS.SET_CANCELLED_ORDERS:
      return {
        ...state,
        cancelledOrders: action.payload.orders,
        pagination: { ...state.pagination, ...action.payload.pagination },
        isLoading: false,
      };
    case ORDER_ACTIONS.SET_CANCELLATION_STATS:
      return { ...state, cancellationStats: action.payload };
    case ORDER_ACTIONS.UPDATE_ORDER_STATUS:
      const updatedOrder = action.payload;
      return {
        ...state,
        orders: state.orders.map(order => 
          order.id === updatedOrder.id ? updatedOrder : order
        ),
        currentOrder: state.currentOrder?.id === updatedOrder.id ? updatedOrder : state.currentOrder,
        cancelledOrders: state.cancelledOrders.map(order => 
          order.id === updatedOrder.id ? updatedOrder : order
        ),
      };
    case ORDER_ACTIONS.SET_REFUND_LOADING:
      return { ...state, refundLoading: action.payload };
    default:
      return state;
  }
};

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ordersReducer, initialState);

const fetchOrders = useCallback(
  async (page = 1, filters = {}) => {
    try {
      dispatch({ type: ORDER_ACTIONS.SET_LOADING, payload: true });
      const currentFilters = { ...state.filters, ...filters };
      const params = {
        page,
        limit: currentFilters.limit,
        search: currentFilters.search,
        status: currentFilters.status === "all" ? "" : currentFilters.status,
        paymentStatus:
          currentFilters.paymentStatus === "all"
            ? ""
            : currentFilters.paymentStatus,
        sortBy: currentFilters.sortBy,
        sortOrder: currentFilters.sortOrder,
      };

      // Clean up empty params
      Object.keys(params).forEach((k) => !params[k] && delete params[k]);

      console.log('🔄 [OrdersContext] fetchOrders called with:', { page, params });

      const response = await orderService.getAllOrders(params);

      console.log('📊 [OrdersContext] FULL API RESPONSE:', response);

      if (response.success && response.data) {
        // ✅ FIX: Handle the nested orders structure
        let ordersArray = [];
        let paginationData = {};

        // Check for nested orders.orders structure
        if (response.data.orders && response.data.orders.orders && Array.isArray(response.data.orders.orders)) {
          console.log('📦 [OrdersContext] Found nested orders.orders structure');
          ordersArray = response.data.orders.orders;
          paginationData = response.data.orders.pagination || response.data.pagination || {};
        } 
        // Check for direct orders array
        else if (Array.isArray(response.data.orders)) {
          console.log('📦 [OrdersContext] Found direct orders array');
          ordersArray = response.data.orders;
          paginationData = response.data.pagination || {};
        }
        // Check for data.orders array
        else if (Array.isArray(response.data.data)) {
          console.log('📦 [OrdersContext] Found data.data array');
          ordersArray = response.data.data;
          paginationData = response.data.pagination || response.data.meta || {};
        }
        // Fallback: if response.data itself is an array
        else if (Array.isArray(response.data)) {
          console.log('📦 [OrdersContext] Response.data is array');
          ordersArray = response.data;
          paginationData = {};
        }

        // Ensure pagination has required fields
        paginationData = {
          currentPage: paginationData.currentPage || page,
          totalPages: paginationData.totalPages || Math.ceil((paginationData.totalCount || ordersArray.length) / (params.limit || 5)),
          totalCount: paginationData.totalCount || ordersArray.length,
          limit: paginationData.limit || params.limit || 5,
          hasNext: paginationData.hasNext || false,
          hasPrev: paginationData.hasPrev || false
        };

        console.log('✅ [OrdersContext] Final processed data:', {
          ordersCount: ordersArray.length,
          ordersArray: ordersArray,
          paginationData: paginationData
        });

        // Log first order structure if available
        if (ordersArray.length > 0) {
          console.log('📦 [OrdersContext] First order sample:', ordersArray[0]);
        }

        dispatch({
          type: ORDER_ACTIONS.SET_ORDERS,
          payload: { 
            orders: ordersArray, 
            pagination: paginationData 
          },
        });

        logger.info(`✅ Loaded ${ordersArray.length} orders successfully`);
      } else {
        console.error('❌ [OrdersContext] API returned failure or no data');
        throw new Error(response.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error('💥 [OrdersContext] fetchOrders error:', error);
      logger.error(`❌ Fetch orders failed: ${error.message}`);
      dispatch({
        type: ORDER_ACTIONS.SET_ERROR,
        payload: error.message || "Failed to load orders",
      });
    }
  },
  [state.filters]
);
    // ✅ Fetch Order Tracking (NEW METHOD)
  const fetchOrderTracking = useCallback(async (orderId) => {
    try {
      logger.info(`📍 Fetching order tracking for #${orderId}`);
      dispatch({ type: ORDER_ACTIONS.SET_LOADING, payload: true });
      const response = await orderService.getOrderTracking(orderId);

      if (response.success) {
        dispatch({ type: ORDER_ACTIONS.SET_ORDER_TRACKING, payload: response.data });
        logger.info(`✅ Order tracking #${orderId} fetched successfully`);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      logger.error(`❌ Fetch order tracking #${orderId} failed: ${error.message}`);
      dispatch({ type: ORDER_ACTIONS.SET_ERROR, payload: error.message });
    }
  }, []);

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
      logger.info(
        `🧾 Creating new order for user: ${orderData.userId || "unknown"}`
      );
      const response = await orderService.createOrder(orderData);
      if (response.success) {
        logger.info(`✅ Order created: ${response.data?.id}`);
        return { success: true, order: response.data };
      } else throw new Error(response.message);
    } catch (error) {
      logger.error(`❌ Create order failed: ${error.message}`);
      dispatch({
        type: ORDER_ACTIONS.SET_ERROR,
        payload: error.message,
      });
      return { success: false, error: error.message };
    }
  }, []);

  // ✅ Update Order Status
  const updateOrderStatus = useCallback(async (orderId, statusData) => {
    try {
      logger.info(`⚙️ Updating order #${orderId} → ${statusData.status}`);
      const response = await orderService.updateOrderStatus(
        orderId,
        statusData
      );
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
      logger.error(
        `❌ Retry Printify order #${orderId} failed: ${error.message}`
      );
      dispatch({ type: ORDER_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false };
    }
  }, []);

  // ✅ Fetch Order Stats
  // Debug version to see exactly what's happening
  const fetchOrderStats = useCallback(async () => {
    try {
      console.log("🔄 [DEBUG] fetchOrderStats called");

      logger.info("📊 Fetching order statistics...");
      const response = await orderService.getOrderStats();

      console.log("📊 [DEBUG] orderService response:", response);

      if (response && response.success) {
        dispatch({ type: ORDER_ACTIONS.SET_STATS, payload: response.data });
        logger.info("✅ Order statistics fetched successfully");

        const result = {
          success: true,
          stats: response.data,
        };
        console.log("✅ [DEBUG] Returning success:", result);
        return result;
      } else {
        const result = {
          success: false,
          error: response?.message || "No success flag in response",
          stats: null,
        };
        console.log("❌ [DEBUG] Returning failure:", result);
        return result;
      }
    } catch (error) {
      console.error("💥 [DEBUG] fetchOrderStats error:", error);
      logger.error(`❌ Fetch order stats failed: ${error.message}`);

      const result = {
        success: false,
        error: error.message,
        stats: null,
      };
      console.log("❌ [DEBUG] Returning error result:", result);
      return result;
    }
  }, []);

  const setFilters = useCallback((newFilters) => {
    logger.info(`🔍 Updating filters: ${JSON.stringify(newFilters)}`);
    dispatch({ type: ORDER_ACTIONS.SET_FILTERS, payload: newFilters });
  }, []);

  const updateFilters = useCallback(
    (newFilters) => {
      logger.info(`🔄 Filters applied: ${JSON.stringify(newFilters)}`);
      dispatch({ type: ORDER_ACTIONS.SET_FILTERS, payload: newFilters });
      fetchOrders(1);
    },
    [fetchOrders]
  );

  const clearError = useCallback(() => {
    dispatch({ type: ORDER_ACTIONS.CLEAR_ERROR });
  }, []);


  const fetchUserOrders = useCallback(async () => {
  try {
    dispatch({ type: ORDER_ACTIONS.SET_LOADING, payload: true });
    const response = await orderService.getUserOrders(); // You'll need to create this method
    
    if (response.success) {
      dispatch({
        type: ORDER_ACTIONS.SET_ORDERS,
        payload: { 
          orders: response.orders || response.data || [],
          pagination: response.pagination || { currentPage: 1, totalPages: 1, totalCount: response.orders?.length || 0 }
        }
      });
    } else {
      throw new Error(response.message || 'Failed to fetch user orders');
    }
  } catch (error) {
    dispatch({ type: ORDER_ACTIONS.SET_ERROR, payload: error.message });
  }
}, []);


  // ✅ User Cancels Order
  const cancelOrder = useCallback(async (orderId, reason) => {
    try {
      logger.info(`🗑️ User cancelling order #${orderId}: ${reason}`);
      const response = await orderService.cancelOrder(orderId, reason);
      
      if (response.success) {
        dispatch({ type: ORDER_ACTIONS.UPDATE_ORDER_STATUS, payload: response.data });
        logger.info(`✅ Order #${orderId} cancelled successfully`);
        return { success: true, order: response.data };
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      logger.error(`❌ Cancel order #${orderId} failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  }, []);

  // ✅ Admin Cancels Order
  const adminCancelOrder = useCallback(async (orderId, reason) => {
    try {
      logger.info(`👨‍💼 Admin cancelling order #${orderId}: ${reason}`);
      const response = await orderService.adminCancelOrder(orderId, reason);
      
      if (response.success) {
        dispatch({ type: ORDER_ACTIONS.UPDATE_ORDER_STATUS, payload: response.data });
        logger.info(`✅ Admin cancelled order #${orderId} successfully`);
        return { success: true, order: response.data };
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      logger.error(`❌ Admin cancel order #${orderId} failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  }, []);

  // ✅ Process Refund
  const processRefund = useCallback(async (orderId, reason) => {
    try {
      dispatch({ type: ORDER_ACTIONS.SET_REFUND_LOADING, payload: true });
      logger.info(`💰 Processing refund for order #${orderId}`);
      
      const response = await orderService.processRefund(orderId, reason);
      
      if (response.success) {
        dispatch({ type: ORDER_ACTIONS.UPDATE_ORDER_STATUS, payload: response.data });
        logger.info(`✅ Refund processed for order #${orderId}`);
        return { success: true, refund: response.data };
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      logger.error(`❌ Process refund #${orderId} failed: ${error.message}`);
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: ORDER_ACTIONS.SET_REFUND_LOADING, payload: false });
    }
  }, []);

  // ✅ Retry Refund
  const retryRefund = useCallback(async (orderId) => {
    try {
      dispatch({ type: ORDER_ACTIONS.SET_REFUND_LOADING, payload: true });
      logger.info(`🔄 Retrying refund for order #${orderId}`);
      
      const response = await orderService.retryRefund(orderId);
      
      if (response.success) {
        dispatch({ type: ORDER_ACTIONS.UPDATE_ORDER_STATUS, payload: response.data });
        logger.info(`✅ Refund retried successfully for order #${orderId}`);
        return { success: true, refund: response.data };
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      logger.error(`❌ Retry refund #${orderId} failed: ${error.message}`);
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: ORDER_ACTIONS.SET_REFUND_LOADING, payload: false });
    }
  }, []);

  // ✅ Fetch Cancelled Orders
  const fetchCancelledOrders = useCallback(async (page = 1, filters = {}) => {
    try {
      dispatch({ type: ORDER_ACTIONS.SET_LOADING, payload: true });
      
      const params = {
        page,
        limit: 10,
        ...filters
      };

      const response = await orderService.getCancelledOrders(params);
      
      if (response.success) {
        const orders = response.data.data || [];
        const pagination = response.data.meta || {
          currentPage: page,
          totalPages: Math.ceil(orders.length / 10),
          totalCount: orders.length
        };

        dispatch({
          type: ORDER_ACTIONS.SET_CANCELLED_ORDERS,
          payload: { orders, pagination }
        });
        
        logger.info(`✅ Loaded ${orders.length} cancelled orders`);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      logger.error(`❌ Fetch cancelled orders failed: ${error.message}`);
      dispatch({ type: ORDER_ACTIONS.SET_ERROR, payload: error.message });
    }
  }, []);

  // ✅ Fetch Cancellation Statistics
  const fetchCancellationStats = useCallback(async () => {
    try {
      const response = await orderService.getCancellationStats();
      
      if (response.success) {
        dispatch({ type: ORDER_ACTIONS.SET_CANCELLATION_STATS, payload: response.data });
        logger.info("✅ Cancellation statistics fetched successfully");
        return { success: true, stats: response.data };
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      logger.error(`❌ Fetch cancellation stats failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  }, []);


  const value = {
    ...state,
    createOrder,
    fetchOrders,
    fetchUserOrders,
    fetchOrderById,
    fetchOrderTracking,
    fetchOrderStats,
    updateOrderStatus,
    retryPrintifyOrder,
    setFilters,
    updateFilters,
    cancelOrder,
    adminCancelOrder,
    processRefund,
    retryRefund,
    fetchCancelledOrders,
    fetchCancellationStats,
    clearError,
  };

  return (
    <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    logger.error("❌ useOrders used outside OrdersProvider");
    throw new Error("useOrders must be used within a OrdersProvider");
  }
  return context;
};
