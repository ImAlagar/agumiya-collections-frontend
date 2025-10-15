// src/contexts/ReviewContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { reviewService } from '../services/api/reviewService';

const ReviewContext = createContext();

const reviewReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PRODUCT_REVIEWS':
      return {
        ...state,
        productReviews: {
          ...state.productReviews,
          [action.payload.productId]: action.payload.reviews
        },
        productStats: {
          ...state.productStats,
          [action.payload.productId]: action.payload.stats
        }
      };
    case 'SET_USER_REVIEWS':
      return {
        ...state,
        userReviews: action.payload
      };
    case 'ADD_REVIEW':
      return {
        ...state,
        userReviews: [action.payload, ...state.userReviews]
      };
    case 'UPDATE_REVIEW':
      return {
        ...state,
        userReviews: state.userReviews.map(review =>
          review.id === action.payload.id ? action.payload : review
        )
      };
    case 'DELETE_REVIEW':
      return {
        ...state,
        userReviews: state.userReviews.filter(review => review.id !== action.payload)
      };
    case 'TOGGLE_HELPFUL':
      return {
        ...state,
        productReviews: Object.keys(state.productReviews).reduce((acc, productId) => {
          acc[productId] = state.productReviews[productId].map(review =>
            review.id === action.payload.reviewId
              ? { ...review, helpfulCount: action.payload.newCount, hasVoted: action.payload.hasVoted }
              : review
          );
          return acc;
        }, {})
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
};

const initialState = {
  productReviews: {},
  productStats: {},
  userReviews: [],
  loading: false,
  error: null
};

export const ReviewProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reviewReducer, initialState);

// src/contexts/ReviewContext.js
const fetchProductReviews = async (productId, filters = {}) => {
  try {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    
    // Try with minimal parameters first
    const minimalFilters = {
      page: filters.page || 1,
      limit: filters.limit || 5
    };

    // Only add sortBy and rating if they're not default values
    if (filters.sortBy && filters.sortBy !== 'helpful') {
      minimalFilters.sortBy = filters.sortBy;
    }
    if (filters.rating && filters.rating !== 'all') {
      minimalFilters.rating = filters.rating;
    }


    const response = await reviewService.getProductReviews(productId, minimalFilters);
    
    if (response.success) {
      const stats = response.data.summary ? {
        averageRating: response.data.summary.averageRating,
        totalReviews: response.data.summary.totalReviews,
        ratingDistribution: response.data.summary.ratingDistribution,
        totalHelpfulVotes: response.data.summary.totalHelpfulVotes
      } : {};
      
      dispatch({
        type: 'SET_PRODUCT_REVIEWS',
        payload: {
          productId,
          reviews: response.data.reviews || [],
          stats: stats
        }
      });
    }
    return response;
  } catch (error) {
    console.error('💥 Error in fetchProductReviews:', error);
    
    // Try fallback: fetch without any filters
    try {
      const fallbackResponse = await reviewService.getProductReviews(productId, {});
      
      if (fallbackResponse.success) {
        const stats = fallbackResponse.data.summary ? {
          averageRating: fallbackResponse.data.summary.averageRating,
          totalReviews: fallbackResponse.data.summary.totalReviews,
          ratingDistribution: fallbackResponse.data.summary.ratingDistribution,
          totalHelpfulVotes: fallbackResponse.data.summary.totalHelpfulVotes
        } : {};
        
        dispatch({
          type: 'SET_PRODUCT_REVIEWS',
          payload: {
            productId,
            reviews: fallbackResponse.data.reviews || [],
            stats: stats
          }
        });
        return fallbackResponse;
      }
    } catch (fallbackError) {
      console.error('💥 Fallback also failed:', fallbackError);
    }
    
    const errorMessage = error.response?.data?.message || error.message;
    dispatch({ type: 'SET_ERROR', payload: errorMessage });
    throw error;
  } finally {
    dispatch({ type: 'SET_LOADING', payload: false });
  }
};

  const fetchUserReviews = async (filters = {}) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await reviewService.getUserReviews(filters);
      
      if (response.success) {
        dispatch({
          type: 'SET_USER_REVIEWS',
          payload: response.data.reviews || []
        });
      }
      return response;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createReview = async (reviewData) => {
    try {
      const response = await reviewService.createReview(reviewData);
      
      if (response.success) {
        dispatch({ type: 'ADD_REVIEW', payload: response.data });
      }
      return response;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const updateReview = async (reviewId, reviewData) => {
    try {
      const response = await reviewService.updateReview(reviewId, reviewData);
      
      if (response.success) {
        dispatch({ type: 'UPDATE_REVIEW', payload: response.data });
      }
      return response;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      const response = await reviewService.deleteReview(reviewId);
      
      if (response.success) {
        dispatch({ type: 'DELETE_REVIEW', payload: reviewId });
      }
      return response;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

const toggleHelpfulVote = async (reviewId) => {
  try {
    // Find the current review to get the current vote state
    let currentHelpfulState = false;
    
    // Search through all product reviews to find this specific review
    Object.keys(state.productReviews).forEach(productId => {
      const review = state.productReviews[productId].find(r => r.id === reviewId);
      if (review && review.hasVoted !== undefined) {
        currentHelpfulState = review.hasVoted;
      }
    });

    // Toggle the state
    const newHelpfulState = !currentHelpfulState;


    const response = await reviewService.markHelpful(reviewId, newHelpfulState);
    
    if (response.success) {
      dispatch({
        type: 'TOGGLE_HELPFUL',
        payload: {
          reviewId,
          newCount: response.data.helpfulCount,
          hasVoted: response.data.hasVoted
        }
      });
      
    } else {
      console.error('❌ Helpful vote failed:', response.message);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: response.message || 'Failed to toggle helpful vote' 
      });
    }
    return response;
  } catch (error) {
    const errorMessage = error.message || 'Failed to toggle helpful vote';
    console.error('💥 Helpful vote error:', errorMessage);
    dispatch({ type: 'SET_ERROR', payload: errorMessage });
    throw error;
  }
};

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const value = {
    ...state,
    fetchProductReviews,
    fetchUserReviews,
    createReview,
    updateReview,
    deleteReview,
    toggleHelpfulVote,
    clearError
  };

  return (
    <ReviewContext.Provider value={value}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewProvider');
  }
  return context;
};