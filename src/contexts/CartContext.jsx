// src/contexts/CartContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

// Generate user-specific cart key
const getCartKey = (userId = 'guest') => {
  return `agumiya_cart_${userId}`;
};

// Load cart from localStorage
const loadCartFromStorage = (userId = 'guest') => {
  try {
    const cartKey = getCartKey(userId);
    const savedCart = localStorage.getItem(cartKey);
    return savedCart ? JSON.parse(savedCart) : { items: [] };
  } catch (error) {
    console.error('Error loading cart from storage:', error);
    return { items: [] };
  }
};

// Save cart to localStorage
const saveCartToStorage = (cartState, userId = 'guest') => {
  try {
    const cartKey = getCartKey(userId);
    localStorage.setItem(cartKey, JSON.stringify(cartState));
  } catch (error) {
    console.error('Error saving cart to storage:', error);
  }
};

const cartReducer = (state, action) => {
  let newState;

  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => 
        item.id === action.payload.id && item.variantId === action.payload.variantId
      );
      
      if (existingItem) {
        newState = {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id && item.variantId === action.payload.variantId
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      } else {
        newState = {
          ...state,
          items: [...state.items, action.payload]
        };
      }
      break;

    case 'REMOVE_FROM_CART':
      newState = {
        ...state,
        items: state.items.filter(item => 
          !(item.id === action.payload.id && item.variantId === action.payload.variantId)
        )
      };
      break;

    case 'UPDATE_QUANTITY':
      newState = {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id && item.variantId === action.payload.variantId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ).filter(item => item.quantity > 0)
      };
      break;

    case 'CLEAR_CART':
      newState = {
        ...state,
        items: []
      };
      break;

    case 'LOAD_CART':
      newState = {
        ...state,
        items: action.payload.items || [],
        currentUserId: action.payload.userId || 'guest'
      };
      break;

    case 'SWITCH_USER_CART':
      newState = {
        ...state,
        items: action.payload.items || [],
        currentUserId: action.payload.userId
      };
      break;

    case 'RESET_TO_GUEST':
      newState = {
        items: [],
        currentUserId: 'guest'
      };
      break;

    default:
      return state;
  }

  return newState;
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    currentUserId: 'guest'
  });

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = loadCartFromStorage('guest');
    dispatch({ 
      type: 'LOAD_CART', 
      payload: { 
        items: savedCart.items,
        userId: 'guest'
      } 
    });
  }, []);

  // Save to localStorage whenever cart items or user changes
  useEffect(() => {
    if (state.currentUserId && state.items) {
      saveCartToStorage({ items: state.items }, state.currentUserId);
      console.log('💾 Saved cart for user:', state.currentUserId, 'items:', state.items.length);
    }
  }, [state.items, state.currentUserId]);

  const addToCart = (product) => {
    const cartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: product.quantity || 1,
      variantId: product.variantId || 'default',
      ...product
    };
    dispatch({ type: 'ADD_TO_CART', payload: cartProduct });
  };

  const removeFromCart = (productId, variantId = 'default') => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { id: productId, variantId } });
  };

  const updateQuantity = (productId, quantity, variantId = 'default') => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, variantId, quantity } });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Handle user login - switch to user's cart
  const handleUserLogin = (userId) => {
    if (userId && userId !== state.currentUserId) {
      console.log('🔐 User logging in:', userId);
      console.log('🛒 Current cart before login:', state.items.length, 'items');
      
      // Save current guest cart before switching (if there are items)
      if (state.items.length > 0 && state.currentUserId === 'guest') {
        console.log('💾 Saving guest cart before login');
        saveCartToStorage({ items: state.items }, 'guest');
      }
      
      // Load user's cart
      const userCart = loadCartFromStorage(userId);
      console.log('📥 Loading user cart:', userCart.items.length, 'items');
      
      dispatch({ 
        type: 'SWITCH_USER_CART', 
        payload: { 
          items: userCart.items,
          userId: userId
        } 
      });
      
      console.log('✅ User cart loaded successfully');
    }
  };

  // Handle user logout - switch to guest cart
  const handleUserLogout = () => {
    console.log('🔐 User logging out:', state.currentUserId);
    console.log('🛒 Current cart before logout:', state.items.length, 'items');
    
    // Save user's cart before logging out (so they get it back when they login)
    if (state.currentUserId !== 'guest' && state.items.length > 0) {
      console.log('💾 Saving user cart before logout');
      saveCartToStorage({ items: state.items }, state.currentUserId);
    }
    
    // Load guest cart (don't clear it completely)
    const guestCart = loadCartFromStorage('guest');
    console.log('📥 Loading guest cart:', guestCart.items.length, 'items');
    
    dispatch({ 
      type: 'SWITCH_USER_CART', 
      payload: { 
        items: guestCart.items,
        userId: 'guest'
      } 
    });
    
    console.log('✅ Switched to guest cart after logout');
  };

  const total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems: state.items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      handleUserLogin,
      handleUserLogout,
      total,
      totalItems,
      currentUserId: state.currentUserId
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};