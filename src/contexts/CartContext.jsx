import React, { createContext, useContext, useReducer, useEffect } from 'react';
import logger from '../utils/logger';

const CartContext = createContext();

// Generate user-specific cart key
const getCartKey = (userId = 'guest') => `agumiya_cart_${userId}`;

// Load cart from localStorage
const loadCartFromStorage = (userId = 'guest') => {
  try {
    const cartKey = getCartKey(userId);
    const savedCart = localStorage.getItem(cartKey);
    return savedCart ? JSON.parse(savedCart) : { items: [] };
  } catch (error) {
    logger.error(`Cart load failed for user: ${userId}`, error);
    return { items: [] };
  }
};

// Save cart to localStorage
const saveCartToStorage = (cartState, userId = 'guest') => {
  try {
    const cartKey = getCartKey(userId);
    localStorage.setItem(cartKey, JSON.stringify(cartState));
    logger.debug(`Cart saved: ${cartState.items?.length || 0} items for ${userId}`);
  } catch (error) {
    logger.error(`Failed to save cart for user: ${userId}`, error);
  }
};

// Reducer
const cartReducer = (state, action) => {
  let newState;

  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id && item.variantId === action.payload.variantId
      );
      if (existingItem) {
        newState = {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id && item.variantId === action.payload.variantId
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      } else {
        newState = { ...state, items: [...state.items, action.payload] };
      }
      logger.info(`🛒 Added to cart: ${action.payload.name} (x${action.payload.quantity})`);
      break;
    }

    case 'REMOVE_FROM_CART':
      newState = {
        ...state,
        items: state.items.filter(
          (item) =>
            !(item.id === action.payload.id && item.variantId === action.payload.variantId)
        ),
      };
      logger.info(`🗑️ Removed item from cart: ${action.payload.id}`);
      break;

    case 'UPDATE_QUANTITY':
      newState = {
        ...state,
        items: state.items
          .map((item) =>
            item.id === action.payload.id && item.variantId === action.payload.variantId
              ? { ...item, quantity: action.payload.quantity }
              : item
          )
          .filter((item) => item.quantity > 0),
      };
      logger.info(
        `🔢 Updated quantity for ${action.payload.id} → ${action.payload.quantity}`
      );
      break;

    case 'CLEAR_CART':
      newState = { ...state, items: [] };
      logger.info('🧹 Cart cleared');
      break;

    case 'LOAD_CART':
      newState = {
        ...state,
        items: action.payload.items || [],
        currentUserId: action.payload.userId || 'guest',
      };
      logger.info(
        `📦 Loaded cart for ${newState.currentUserId} with ${newState.items.length} items`
      );
      break;

    case 'SWITCH_USER_CART':
      newState = {
        ...state,
        items: action.payload.items || [],
        currentUserId: action.payload.userId,
      };
      logger.info(
        `🔁 Switched to cart of ${action.payload.userId} (${newState.items.length} items)`
      );
      break;

    case 'RESET_TO_GUEST':
      newState = { items: [], currentUserId: 'guest' };
      logger.info('👤 Reset cart to guest mode');
      break;

    default:
      return state;
  }

  return newState;
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    currentUserId: 'guest',
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = loadCartFromStorage('guest');
    dispatch({
      type: 'LOAD_CART',
      payload: { items: savedCart.items, userId: 'guest' },
    });
  }, []);

  // Save to localStorage whenever cart or user changes
  useEffect(() => {
    if (state.currentUserId && state.items) {
      saveCartToStorage({ items: state.items }, state.currentUserId);
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
      ...product,
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
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: { id: productId, variantId, quantity },
      });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Handle user login
  const handleUserLogin = (userId) => {
    try {
      if (userId && userId !== state.currentUserId) {
        logger.info(`🔐 User logging in: ${userId}`);

        // Save current guest cart before switching
        if (state.items.length > 0 && state.currentUserId === 'guest') {
          saveCartToStorage({ items: state.items }, 'guest');
        }

        // Load user's cart
        const userCart = loadCartFromStorage(userId);
        dispatch({
          type: 'SWITCH_USER_CART',
          payload: { items: userCart.items, userId },
        });

        logger.info(`✅ User cart loaded: ${userCart.items.length} items`);
      }
    } catch (error) {
      logger.error(`❌ Failed to switch to user cart: ${userId}`, error);
    }
  };

  // Handle user logout
  const handleUserLogout = () => {
    try {
      logger.info(`🚪 User logging out: ${state.currentUserId}`);

      if (state.currentUserId !== 'guest' && state.items.length > 0) {
        saveCartToStorage({ items: state.items }, state.currentUserId);
      }

      const guestCart = loadCartFromStorage('guest');
      dispatch({
        type: 'SWITCH_USER_CART',
        payload: { items: guestCart.items, userId: 'guest' },
      });

      logger.info(`✅ Switched to guest cart (${guestCart.items.length} items)`);
    } catch (error) {
      logger.error('❌ Error during logout cart switch:', error);
    }
  };

  const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems: state.items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        handleUserLogin,
        handleUserLogout,
        total,
        totalItems,
        currentUserId: state.currentUserId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    logger.error('useCart called outside CartProvider');
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
