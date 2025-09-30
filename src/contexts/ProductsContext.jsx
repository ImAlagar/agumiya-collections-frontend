// src/contexts/ProductsContext.jsx
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { productService } from '../services/api/productService';
import apiClient from '../config/api';

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
  isSyncLoading: false,
  error: null,
  filters: {
    search: '',
    category: 'All',
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
        products: Array.isArray(products) ? products : [],
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

// In your ProductsContext.jsx - Update the fetchProducts function
const fetchProducts = useCallback(async (page = state.pagination.currentPage, filters = {}) => {
  try {
    dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });
    
    const currentFilters = { ...state.filters, ...filters };
    
    const params = {
      page: page || 1,
      limit: currentFilters.limit || 10,
      sortBy: currentFilters.sortBy || 'name',
      sortOrder: currentFilters.sortOrder || 'asc'
    };

    if (currentFilters.search && currentFilters.search.trim() !== '') {
      params.search = currentFilters.search.trim();
    }

    if (currentFilters.category && currentFilters.category !== 'All') {
      params.category = currentFilters.category;
    }

    if (currentFilters.inStock && currentFilters.inStock !== 'all') {
      params.inStock = currentFilters.inStock;
    }


    const hasFilters = params.search || params.category || params.inStock;
    const endpoint = hasFilters ? '/products/filter' : '/products';

    const response = await apiClient.get(endpoint, { params });

    // SIMPLE EXTRACTION - Try the most likely paths
    let products = [];
    let paginationData = {};

    // Try common structures
    if (response.data?.data?.products) {
      products = response.data.data.products;
      paginationData = response.data.data.pagination || {};
    } else if (response.data?.data?.data) {
      products = response.data.data.data;
      paginationData = response.data.data.meta || {};
    } else if (response.data?.products) {
      products = response.data.products;
      paginationData = response.data.pagination || {};
    } else if (Array.isArray(response.data?.data)) {
      products = response.data.data;
      paginationData = response.data.meta || {};
    } else if (Array.isArray(response.data)) {
      products = response.data;
    }

    // Final fallback
    if (!Array.isArray(products)) {
      products = [];
    }


    dispatch({
      type: PRODUCT_ACTIONS.SET_PRODUCTS,
      payload: {
        products: products,
        pagination: {
          currentPage: paginationData.currentPage || page,
          totalPages: paginationData.totalPages || 1,
          totalCount: paginationData.totalCount || products.length,
          hasNext: paginationData.hasNext || false,
          hasPrev: paginationData.hasPrev || false
        }
      }
    });

  } catch (error) {
    console.error('💥 Fetch products error:', error);
    dispatch({ 
      type: PRODUCT_ACTIONS.SET_ERROR, 
      payload: error.message || 'Failed to load products. Please try again.' 
    });
  }
}, [state.filters, state.pagination.currentPage]);


  // Get product by ID
const getProductById = useCallback(async (id) => {
  try {
    dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });
    
    const response = await productService.getProductById(id);
    
    
    let productData = null;
    
    // Handle multiple possible response formats
    if (response && typeof response === 'object') {
      // Format 1: Standard API response { success: true, data: {...} }
      if (response.success && response.data) {
        productData = response.data;
      }
      // Format 2: Nested structure { data: { data: {...} } }
      else if (response.data && response.data.data) {
        productData = response.data.data;
      }
      // Format 3: Direct product data { id: ..., name: ... }
      else if (response.id) {
        productData = response;
      }
      // Format 4: Response is the data directly
      else if (response.data) {
        productData = response.data;
      }
      // Format 5: Try to find product in any property
      else {
        // Look for an object with an id property
        for (const key in response) {
          if (response[key] && typeof response[key] === 'object' && response[key].id) {
            productData = response[key];
            break;
          }
        }
      }
    }
    
    
    if (productData && productData.id) {
      dispatch({ type: PRODUCT_ACTIONS.SET_PRODUCT, payload: productData });
      return productData;
    } else {
      throw new Error('Product not found or invalid response format');
    }
    
  } catch (error) {
    console.error('💥 Get product by ID error:', error);
    
    let errorMessage = 'Failed to load product. Please try again.';
    
    if (error.response) {
      if (error.response.status === 404) {
        errorMessage = 'Product not found. It may have been removed or does not exist.';
      } else if (error.response.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      }
    } else if (error.request) {
      errorMessage = 'Network error. Please check your internet connection.';
    } else {
      errorMessage = error.message || errorMessage;
    }
    
    dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: errorMessage });
    throw new Error(errorMessage);
  }
}, []);


  // Set filters
  const setFilters = useCallback((newFilters) => {
    dispatch({ type: PRODUCT_ACTIONS.SET_FILTERS, payload: newFilters });
  }, []);

  // Update filters and fetch products
  const updateFilters = useCallback(async (newFilters) => {
    dispatch({ type: PRODUCT_ACTIONS.SET_FILTERS, payload: newFilters });
    
    requestAnimationFrame(() => {
      fetchProducts(1);
    });
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

  // Fetch product by ID (alias for getProductById)
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

  // Update product
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

  // Delete product
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


  // Add this function to your ProductsContext.jsx
const getSimilarProducts = useCallback(async (productId, limit = 4) => {
  try {
    const response = await productService.getSimilarProducts(productId, limit);
    
    
    if (response.success) {
      let similarProducts = [];
      
      if (response.data?.data) {
        similarProducts = response.data.data;
      } else if (response.data) {
        similarProducts = response.data;
      } else if (Array.isArray(response)) {
        similarProducts = response;
      }
      
      return similarProducts;
    } else {
      throw new Error(response.message || 'Failed to fetch similar products');
    }
  } catch (error) {
    console.error('💥 Get similar products error:', error);
    // Don't throw error for similar products - return empty array instead
    return [];
  }
}, []);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: PRODUCT_ACTIONS.CLEAR_ERROR });
  }, []);

  const value = {
    // State
    ...state,
    
    // Actions
    fetchProducts,
    fetchProductById,
    getProductById,
    getSimilarProducts,
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
      type: "tween",
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