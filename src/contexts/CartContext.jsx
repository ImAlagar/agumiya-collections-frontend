// src/contexts/CartContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('agumiya_cart');
    return savedCart ? JSON.parse(savedCart) : { items: [] };
  } catch (error) {
    console.error('Error loading cart from storage:', error);
    return { items: [] };
  }
};

// Save cart to localStorage
const saveCartToStorage = (cartState) => {
  try {
    localStorage.setItem('agumiya_cart', JSON.stringify(cartState));
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
        ).filter(item => item.quantity > 0) // Remove items with quantity 0
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
        items: action.payload.items || []
      };
      break;

    default:
      return state;
  }

  // Save to localStorage after every state change
  saveCartToStorage(newState);
  return newState;
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: []
  });

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = loadCartFromStorage();
    dispatch({ type: 'LOAD_CART', payload: savedCart });
  }, []);

  const addToCart = (product) => {
    // Ensure product has required fields
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

  const total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems: state.items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      total,
      totalItems
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