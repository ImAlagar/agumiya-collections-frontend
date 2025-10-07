// src/contexts/ProductsContext.jsx
import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { productService } from "../services/api/productService";

// ========================
// 🔹 Action Types
// ========================
const PRODUCT_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_PRODUCTS: "SET_PRODUCTS",
  SET_PRODUCT: "SET_PRODUCT",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
  SET_FILTERS: "SET_FILTERS",
  SET_PAGINATION: "SET_PAGINATION",
  UPDATE_PRODUCT: "UPDATE_PRODUCT",
  DELETE_PRODUCT: "DELETE_PRODUCT",
  SET_SYNC_STATUS: "SET_SYNC_STATUS",
};

// ========================
// 🔹 Initial State
// ========================
const initialState = {
  products: [],
  currentProduct: null,
  isLoading: false,
  isSyncLoading: false,
  error: null,
  filters: {
    categories: [],
    minPrice: null,
    maxPrice: null,
    inStock: 'all',
    limit: 12,
    page: 1
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false,
    limit: 12,
  },
};

// ========================
// 🔹 Reducer
// ========================
const productsReducer = (state, action) => {
  switch (action.type) {
    case PRODUCT_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case PRODUCT_ACTIONS.SET_PRODUCTS:
      const { products, pagination } = action.payload;
      return {
        ...state,
        products: Array.isArray(products) ? products : [],
        pagination: { ...state.pagination, ...pagination },
        isLoading: false,
        error: null,
      };

    case PRODUCT_ACTIONS.SET_PRODUCT:
      return { ...state, currentProduct: action.payload, isLoading: false, error: null };

    case PRODUCT_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false, isSyncLoading: false };

    case PRODUCT_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };

    case PRODUCT_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };

    case PRODUCT_ACTIONS.SET_PAGINATION:
      return { ...state, pagination: { ...state.pagination, ...action.payload } };

    case PRODUCT_ACTIONS.UPDATE_PRODUCT:
      const updatedProduct = action.payload;
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === updatedProduct.id ? updatedProduct : p
        ),
        currentProduct:
          state.currentProduct?.id === updatedProduct.id
            ? updatedProduct
            : state.currentProduct,
      };

    case PRODUCT_ACTIONS.DELETE_PRODUCT:
      const productId = action.payload;
      return {
        ...state,
        products: state.products.filter((p) => p.id !== productId),
        currentProduct:
          state.currentProduct?.id === productId ? null : state.currentProduct,
      };

    case PRODUCT_ACTIONS.SET_SYNC_STATUS:
      return {
        ...state,
        isSyncLoading: action.payload.isSyncing,
        syncStatus: { ...state.syncStatus, ...action.payload },
      };

    default:
      return state;
  }
};

// ========================
// 🔹 Context Setup
// ========================
const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productsReducer, initialState);
  const filtersRef = useRef(state.filters);

  useEffect(() => {
    filtersRef.current = state.filters;
  }, [state.filters]);

  // ========================
  // 🔸 Fetch Products - FIXED VERSION
  // ========================
  const fetchProducts = useCallback(async (page = 1, filters = {}) => {
    try {
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });

      const currentFilters = { ...filtersRef.current, ...filters, page };
      
      // Prepare API parameters
      const apiFilters = {
        page: currentFilters.page || 1,
        limit: currentFilters.limit || 12,
      };

      if (currentFilters.categories && currentFilters.categories.length > 0) {
        apiFilters.categories = currentFilters.categories[0]; // ✅ send single selected category
      }

      // Add price filters
      if (currentFilters.minPrice !== null && currentFilters.minPrice !== undefined) {
        apiFilters.minPrice = currentFilters.minPrice;
      }

      if (currentFilters.maxPrice !== null && currentFilters.maxPrice !== undefined) {
        apiFilters.maxPrice = currentFilters.maxPrice;
      }

      // Add stock filter
      if (currentFilters.inStock && currentFilters.inStock !== 'all') {
        apiFilters.inStock = currentFilters.inStock === 'true'; // ✅ correct comparison
      }

      console.log('🔍 Fetching products with API filters:', apiFilters);

      // Use the filter endpoint
      const response = await productService.getFilteredProducts(apiFilters);
      
      if (response.success) {
        const products = response.data?.data || [];
        const paginationData = response.data?.pagination || {};

        const mappedPagination = {
          currentPage: paginationData.currentPage || page,
          totalPages: paginationData.totalPages || 1,
          totalCount: paginationData.totalCount || products.length,
          limit: paginationData.limit || currentFilters.limit || 12,
          hasNext: paginationData.hasNext !== undefined
            ? paginationData.hasNext
            : (paginationData.currentPage || page) < (paginationData.totalPages || 1),
          hasPrev: paginationData.hasPrev !== undefined
            ? paginationData.hasPrev
            : (paginationData.currentPage || page) > 1,
        };

        dispatch({
          type: PRODUCT_ACTIONS.SET_PRODUCTS,
          payload: { products, pagination: mappedPagination },
        });

        // Update filters in state
        dispatch({
          type: PRODUCT_ACTIONS.SET_FILTERS,
          payload: currentFilters
        });
      } else {
        throw new Error(response.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("💥 Fetch products error:", error);
      console.error("💥 Error details:", error.response?.data);
      
      dispatch({
        type: PRODUCT_ACTIONS.SET_ERROR,
        payload: error.response?.data?.message || error.message || "Failed to load products. Please try again.",
      });
    }
  }, []);

  // ========================
  // 🔸 Update Page Size
  // ========================
  const updatePageSize = useCallback(
    async (newLimit) => {
      await fetchProducts(1, { limit: newLimit });
    },
    [fetchProducts]
  );

  // ========================
  // 🔸 Get Product by ID
  // ========================
  const getProductById = useCallback(async (id) => {
    try {
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });
      const response = await productService.getProductById(id);
      
      let productData = response.data || response;

      if (productData?.id) {
        dispatch({ type: PRODUCT_ACTIONS.SET_PRODUCT, payload: productData });
        return productData;
      } else {
        throw new Error("Product not found or invalid response format");
      }
    } catch (error) {
      console.error("💥 Get product by ID error:", error);
      let errorMessage = "Failed to load product. Please try again.";
      if (error.response) {
        if (error.response.status === 404)
          errorMessage = "Product not found. It may have been removed.";
        else if (error.response.status === 500)
          errorMessage = "Server error. Please try again later.";
      } else if (error.request) {
        errorMessage = "Network error. Please check your internet connection.";
      } else {
        errorMessage = error.message || errorMessage;
      }
      dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: errorMessage });
      throw new Error(errorMessage);
    }
  }, []);

  // ========================
  // 🔸 Filter Functions - FIXED
  // ========================
  const setFilters = useCallback(
    (newFilters) => {
      dispatch({ type: PRODUCT_ACTIONS.SET_FILTERS, payload: newFilters });
    },
    []
  );

  const updateFilters = useCallback(
    async (newFilters) => {
      await fetchProducts(1, newFilters);
    },
    [fetchProducts]
  );

  // ========================
  // 🔸 Sync Products
  // ========================
  const syncProducts = useCallback(
    async (shopId = "23342579") => {
      try {
        dispatch({
          type: PRODUCT_ACTIONS.SET_SYNC_STATUS,
          payload: {
            isSyncing: true,
            message: "Starting sync... This may take a few minutes.",
          },
        });

        const response = await productService.syncProducts(shopId);

        if (response.success) {
          dispatch({
            type: PRODUCT_ACTIONS.SET_SYNC_STATUS,
            payload: {
              isSyncing: false,
              message: response.data?.message || "Products synced successfully!",
              lastSync: new Date().toISOString(),
              count: response.data?.count,
              published: response.data?.published,
            },
          });

          setTimeout(() => {
            fetchProducts(1);
          }, 2000);

          return {
            success: true,
            count: response.data?.count,
            published: response.data?.published,
            message: response.data?.message,
          };
        } else {
          throw new Error(response.message || "Sync failed");
        }
      } catch (error) {
        console.error("💥 Sync products error:", error);
        let errorMessage = "Failed to sync products. Please try again.";
        if (error.message.includes("timeout"))
          errorMessage =
            "Sync is taking longer than expected. Products are being processed.";
        else if (error.response)
          errorMessage = error.response.data?.message || errorMessage;

        dispatch({
          type: PRODUCT_ACTIONS.SET_SYNC_STATUS,
          payload: { isSyncing: false, message: errorMessage },
        });
        dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: errorMessage });
        return { success: false, error: errorMessage };
      }
    },
    [fetchProducts]
  );

  // ========================
  // 🔸 Update / Delete
  // ========================
  const updateProduct = useCallback(async (id, productData) => {
    try {
      const response = await productService.updateProduct(id, productData);
      if (response.success) {
        dispatch({ type: PRODUCT_ACTIONS.UPDATE_PRODUCT, payload: response.data });
        return { success: true, product: response.data };
      } else throw new Error(response.message || "Update failed");
    } catch (error) {
      dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  }, []);

  const deleteProduct = useCallback(async (id) => {
    try {
      const response = await productService.deleteProduct(id);
      if (response.success) {
        dispatch({ type: PRODUCT_ACTIONS.DELETE_PRODUCT, payload: id });
        return { success: true };
      } else throw new Error(response.message || "Delete failed");
    } catch (error) {
      dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  }, []);

  // ========================
  // 🔸 Get Similar Products
  // ========================
  const getSimilarProducts = useCallback(async (productId, limit = 4) => {
    try {
      const response = await productService.getSimilarProducts(productId, limit);
      
      if (response.success) {
        return response.data || [];
      } else if (Array.isArray(response)) {
        return response;
      } else if (response.data) {
        return Array.isArray(response.data) ? response.data : [];
      }
      
      return [];
    } catch (error) {
      console.error("💥 Get similar products error:", error);
      return [];
    }
  }, []);

  // ========================
  // 🔸 Clear Error
  // ========================
  const clearError = useCallback(() => {
    dispatch({ type: PRODUCT_ACTIONS.CLEAR_ERROR });
  }, []);

  // ========================
  // 🔹 Context Value
  // ========================
  const value = {
    ...state,
    fetchProducts,
    getProductById,
    getSimilarProducts,
    syncProducts,
    updateProduct,
    deleteProduct,
    setFilters,
    updateFilters,
    updatePageSize,
    clearError,
  };

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};

// ========================
// 🔹 Hook
// ========================
export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) throw new Error("useProducts must be used within a ProductsProvider");
  return context;
};

// ========================
// 🔹 Animation Variants
// ========================
export const staggerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "tween", stiffness: 100 } },
};

export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

export const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};