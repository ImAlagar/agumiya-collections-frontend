// src/contexts/ProductsContext.js
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { productService } from '../services/api/productService';

// Action types
const PRODUCT_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_PRODUCTS: 'SET_PRODUCTS',
  SET_PRODUCT: 'SET_PRODUCT',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_FILTERS: 'SET_FILTERS',
  SET_PAGINATION: 'SET_PAGINATION',
  UPDATE_PRODUCT: 'UPDATE_PRODUCT',
  DELETE_PRODUCT: 'DELETE_PRODUCT',
  SET_SYNC_STATUS: 'SET_SYNC_STATUS'
};

// Initial state
const initialState = {
  products: [],
  currentProduct: null,
  isLoading: false,
  isSyncLoading: false, // Added missing state
  error: null,
  filters: {
    search: '',
    category: 'All', // Fixed: default to 'All' instead of empty string
    inStock: 'all',
    sortBy: 'name',
    sortOrder: 'asc',
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

// Reducer
const productsReducer = (state, action) => {
  switch (action.type) {
    case PRODUCT_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case PRODUCT_ACTIONS.SET_PRODUCTS:
      const { products, pagination } = action.payload;
      return {
        ...state,
        products,
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

    case PRODUCT_ACTIONS.SET_PRODUCT:
      return {
        ...state,
        currentProduct: action.payload,
        isLoading: false,
        error: null
      };

    case PRODUCT_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false, isSyncLoading: false };

    case PRODUCT_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };

    case PRODUCT_ACTIONS.SET_FILTERS:
      return { 
        ...state, 
        filters: { ...state.filters, ...action.payload },
        pagination: { ...state.pagination, currentPage: 1 }
      };

    case PRODUCT_ACTIONS.SET_PAGINATION:
      return { ...state, pagination: { ...state.pagination, ...action.payload } };

    case PRODUCT_ACTIONS.UPDATE_PRODUCT:
      const updatedProduct = action.payload;
      return {
        ...state,
        products: state.products.map(product =>
          product.id === updatedProduct.id ? updatedProduct : product
        ),
        currentProduct: state.currentProduct?.id === updatedProduct.id ? updatedProduct : state.currentProduct
      };

    case PRODUCT_ACTIONS.DELETE_PRODUCT:
      const productId = action.payload;
      return {
        ...state,
        products: state.products.filter(product => product.id !== productId),
        currentProduct: state.currentProduct?.id === productId ? null : state.currentProduct
      };

    case PRODUCT_ACTIONS.SET_SYNC_STATUS:
      return {
        ...state,
        isSyncLoading: action.payload.isSyncing,
        syncStatus: { ...state.syncStatus, ...action.payload }
      };

    default:
      return state;
  }
};

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productsReducer, initialState);

  // Fetch all products with proper error handling
  const fetchProducts = useCallback(async (page = state.pagination.currentPage, filters = {}) => {
    try {
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });
      
      // Merge current filters with new filters
      const currentFilters = { ...state.filters, ...filters };
      
      const params = {
        page,
        limit: currentFilters.limit,
        search: currentFilters.search,
        category: currentFilters.category === 'All' ? '' : currentFilters.category,
        inStock: currentFilters.inStock === 'all' ? '' : currentFilters.inStock,
        sortBy: currentFilters.sortBy,
        sortOrder: currentFilters.sortOrder
      };

      // Clean up empty params
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await productService.getAllProducts(params);
      
      if (response.success) {
        dispatch({
          type: PRODUCT_ACTIONS.SET_PRODUCTS,
          payload: {
            products: response.data.products || [],
            pagination: response.data.pagination || {
              currentPage: page,
              totalPages: 1,
              totalCount: 0
            }
          }
        });
      } else {
        throw new Error(response.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Fetch products error:', error);
      dispatch({ 
        type: PRODUCT_ACTIONS.SET_ERROR, 
        payload: error.message || 'Failed to load products. Please try again.' 
      });
    }
  }, [state.filters, state.pagination.currentPage]);

  // Set filters and refetch
  const setFilters = useCallback((newFilters) => {
    dispatch({ type: PRODUCT_ACTIONS.SET_FILTERS, payload: newFilters });
  }, []);

  // Update filters and fetch products
  const updateFilters = useCallback(async (newFilters) => {
    dispatch({ type: PRODUCT_ACTIONS.SET_FILTERS, payload: newFilters });
    // Small timeout to ensure state is updated before fetching
    setTimeout(() => {
      fetchProducts(1);
    }, 0);
  }, [fetchProducts]);

  // Sync products
  const syncProducts = useCallback(async (shopId = '23342579') => {
    try {
      dispatch({ 
        type: PRODUCT_ACTIONS.SET_SYNC_STATUS, 
        payload: { isSyncing: true, message: 'Syncing products...' } 
      });

      const response = await productService.syncProducts(shopId);
      
      if (response.success) {
        dispatch({ 
          type: PRODUCT_ACTIONS.SET_SYNC_STATUS, 
          payload: { 
            isSyncing: false, 
            message: response.data?.message || 'Products synced successfully',
            lastSync: new Date().toISOString()
          } 
        });
        
        // Refresh products after sync
        await fetchProducts(1);
        
        return { success: true, count: response.data?.count };
      } else {
        throw new Error(response.message || 'Sync failed');
      }
    } catch (error) {
      console.error('Sync products error:', error);
      dispatch({ 
        type: PRODUCT_ACTIONS.SET_SYNC_STATUS, 
        payload: { isSyncing: false, message: error.message } 
      });
      dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  }, [fetchProducts]);

  // Other actions remain the same...
  const fetchProductById = useCallback(async (id) => {
    try {
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });
      const response = await productService.getProductById(id);
      
      if (response.success) {
        dispatch({ type: PRODUCT_ACTIONS.SET_PRODUCT, payload: response.data });
      } else {
        throw new Error(response.message || 'Failed to fetch product');
      }
    } catch (error) {
      dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: error.message });
    }
  }, []);

  const updateProduct = useCallback(async (id, productData) => {
    try {
      const response = await productService.updateProduct(id, productData);
      if (response.success) {
        dispatch({ type: PRODUCT_ACTIONS.UPDATE_PRODUCT, payload: response.data });
        return { success: true, product: response.data };
      } else {
        throw new Error(response.message || 'Update failed');
      }
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
      } else {
        throw new Error(response.message || 'Delete failed');
      }
    } catch (error) {
      dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: PRODUCT_ACTIONS.CLEAR_ERROR });
  }, []);

  const value = {
    // State
    ...state,
    
    // Actions
    fetchProducts,
    fetchProductById,
    syncProducts,
    updateProduct,
    deleteProduct,
    setFilters,
    updateFilters,
    clearError
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

// Animation variants
export const staggerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

export const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
};