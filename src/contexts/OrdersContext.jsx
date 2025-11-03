import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import { orderService } from "../services/api/orderService";

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
      
      // Build search query properly for your schema
      let searchQuery = {};
      if (currentFilters.search) {
        const searchTerm = currentFilters.search.trim();
        
        // Try to parse as order ID first
        const orderId = parseInt(searchTerm);
        if (!isNaN(orderId)) {
          // Search by order ID
          searchQuery = {
            OR: [
              { id: { equals: orderId } },
              { razorpayOrderId: { contains: searchTerm, mode: 'insensitive' } },
              { printifyOrderId: { contains: searchTerm, mode: 'insensitive' } }
            ]
          };
        } else {
          // Search by customer information from user relation
          searchQuery = {
            OR: [
              { razorpayOrderId: { contains: searchTerm, mode: 'insensitive' } },
              { printifyOrderId: { contains: searchTerm, mode: 'insensitive' } },
              { trackingNumber: { contains: searchTerm, mode: 'insensitive' } },
              { 
                user: {
                  OR: [
                    { name: { contains: searchTerm, mode: 'insensitive' } },
                    { email: { contains: searchTerm, mode: 'insensitive' } },
                    { phone: { contains: searchTerm, mode: 'insensitive' } }
                  ]
                }
              },
              // Search in order items product names
              {
                items: {
                  some: {
                    product: {
                      name: { contains: searchTerm, mode: 'insensitive' }
                    }
                  }
                }
              }
            ]
          };
        }
      }

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
        // Add the search query to params
        ...(Object.keys(searchQuery).length > 0 && { searchQuery })
      };

      // Clean up empty params
      Object.keys(params).forEach((k) => !params[k] && delete params[k]);

      const response = await orderService.getAllOrders(params);

      if (response.success && response.data) {
        // ✅ FIX: Handle the nested orders structure
        let ordersArray = [];
        let paginationData = {};

        // Check for nested orders.orders structure
        if (response.data.orders && response.data.orders.orders && Array.isArray(response.data.orders.orders)) {
          ordersArray = response.data.orders.orders;
          paginationData = response.data.orders.pagination || response.data.pagination || {};
        } 
        // Check for direct orders array
        else if (Array.isArray(response.data.orders)) {
          ordersArray = response.data.orders;
          paginationData = response.data.pagination || {};
        }
        // Check for data.orders array
        else if (Array.isArray(response.data.data)) {
          ordersArray = response.data.data;
          paginationData = response.data.pagination || response.data.meta || {};
        }
        // Fallback: if response.data itself is an array
        else if (Array.isArray(response.data)) {
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

        dispatch({
          type: ORDER_ACTIONS.SET_ORDERS,
          payload: { 
            orders: ordersArray, 
            pagination: paginationData 
          },
        });

      } else {
        throw new Error(response.message || "Failed to fetch orders");
      }
    } catch (error) {
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
      dispatch({ type: ORDER_ACTIONS.SET_LOADING, payload: true });
      const response = await orderService.getOrderTracking(orderId);

      if (response.success) {
        dispatch({ type: ORDER_ACTIONS.SET_ORDER_TRACKING, payload: response.data });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch({ type: ORDER_ACTIONS.SET_ERROR, payload: error.message });
    }
  }, []);

  // ✅ Fetch Single Order
  const fetchOrderById = useCallback(async (id) => {
    try {
      dispatch({ type: ORDER_ACTIONS.SET_LOADING, payload: true });
      const response = await orderService.getOrderById(id);

      if (response.success) {
        dispatch({ type: ORDER_ACTIONS.SET_ORDER, payload: response.data });
      } else throw new Error(response.message);
    } catch (error) {
      dispatch({ type: ORDER_ACTIONS.SET_ERROR, payload: error.message });
    }
  }, []);

  // ✅ Create Order
  const createOrder = useCallback(async (orderData) => {
    try {

      const response = await orderService.createOrder(orderData);
      if (response.success) {
        return { success: true, order: response.data };
      } else throw new Error(response.message);
    } catch (error) {
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
    const response = await orderService.updateOrderStatus(
      orderId,
      statusData
    );
    if (response.success) {
      dispatch({ type: ORDER_ACTIONS.UPDATE_ORDER, payload: response.data });
      return { success: true };
    } else throw new Error(response.message);
  } catch (error) {
    dispatch({ type: ORDER_ACTIONS.SET_ERROR, payload: error.message });
    return { success: false };
  }
}, []);

  // ✅ Retry Printify Order
  const retryPrintifyOrder = useCallback(async (orderId) => {
    try {
      const response = await orderService.retryPrintifyOrder(orderId);
      if (response.success) {
        dispatch({ type: ORDER_ACTIONS.UPDATE_ORDER, payload: response.data });
        return { success: true };
      } else throw new Error(response.message);
    } catch (error) {

      dispatch({ type: ORDER_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false };
    }
  }, []);

  // ✅ Fetch Order Stats
  const fetchOrderStats = useCallback(async () => {
    try {

      const response = await orderService.getOrderStats();


      if (response && response.success) {
        dispatch({ type: ORDER_ACTIONS.SET_STATS, payload: response.data });

        const result = {
          success: true,
          stats: response.data,
        };
        return result;
      } else {
        const result = {
          success: false,
          error: response?.message || "No success flag in response",
          stats: null,
        };
        return result;
      }
    } catch (error) {

      const result = {
        success: false,
        error: error.message,
        stats: null,
      };
      return result;
    }
  }, []);

  const setFilters = useCallback((newFilters) => {
    dispatch({ type: ORDER_ACTIONS.SET_FILTERS, payload: newFilters });
  }, []);

  const updateFilters = useCallback(
    (newFilters) => {
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
      const response = await orderService.cancelOrder(orderId, reason);
      
      if (response.success) {
        dispatch({ type: ORDER_ACTIONS.UPDATE_ORDER_STATUS, payload: response.data });
        return { success: true, order: response.data };
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  // ✅ Admin Cancels Order
  const adminCancelOrder = useCallback(async (orderId, reason) => {
    try {
      const response = await orderService.adminCancelOrder(orderId, reason);
      
      if (response.success) {
        dispatch({ type: ORDER_ACTIONS.UPDATE_ORDER_STATUS, payload: response.data });
        return { success: true, order: response.data };
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  // ✅ Process Refund
  const processRefund = useCallback(async (orderId, reason) => {
    try {
      dispatch({ type: ORDER_ACTIONS.SET_REFUND_LOADING, payload: true });
      
      const response = await orderService.processRefund(orderId, reason);
      
      if (response.success) {
        dispatch({ type: ORDER_ACTIONS.UPDATE_ORDER_STATUS, payload: response.data });
        return { success: true, refund: response.data };
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: ORDER_ACTIONS.SET_REFUND_LOADING, payload: false });
    }
  }, []);

  // ✅ Retry Refund
  const retryRefund = useCallback(async (orderId) => {
    try {
      dispatch({ type: ORDER_ACTIONS.SET_REFUND_LOADING, payload: true });
      
      const response = await orderService.retryRefund(orderId);
      
      if (response.success) {
        dispatch({ type: ORDER_ACTIONS.UPDATE_ORDER_STATUS, payload: response.data });
        return { success: true, refund: response.data };
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
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
      limit: filters.limit || 10, // Use the filter limit or default to 10
      ...filters
    };

    const response = await orderService.getCancelledOrders(params);
    
    if (response.success) {
      // Extract orders and pagination data from the API response
      const orders = response.data.data || [];
      const pagination = response.data.meta || {
        currentPage: page,
        totalPages: 1,
        totalCount: orders.length,
        hasNext: false,
        hasPrev: false,
        limit: params.limit
      };

      dispatch({
        type: ORDER_ACTIONS.SET_CANCELLED_ORDERS,
        payload: { 
          orders, 
          pagination: {
            currentPage: pagination.page || pagination.currentPage || page,
            totalPages: pagination.totalPages || 1,
            totalCount: pagination.total || pagination.totalCount || orders.length,
            hasNext: pagination.hasNext || false,
            hasPrev: pagination.hasPrev || false,
            limit: pagination.limit || params.limit
          }
        }
      });
      
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    dispatch({ type: ORDER_ACTIONS.SET_ERROR, payload: error.message });
  }
}, []);

  // ✅ Fetch Cancellation Statistics
  const fetchCancellationStats = useCallback(async () => {
    try {
      const response = await orderService.getCancellationStats();
      
      if (response.success) {
        dispatch({ type: ORDER_ACTIONS.SET_CANCELLATION_STATS, payload: response.data });
        return { success: true, stats: response.data };
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
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
    throw new Error("useOrders must be used within a OrdersProvider");
  }
  return context;
};
