import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

// Generate user-specific cart key
const getCartKey = (userId = 'guest') => `agumiya_cart_${userId}`;

// Load cart from localStorage
const loadCartFromStorage = (userId = 'guest') => {
  try {
    const cartKey = getCartKey(userId);
    const savedCart = localStorage.getItem(cartKey);
    
    if (!savedCart) return { items: [] };
    
    const parsedCart = JSON.parse(savedCart);
    
    // 🔥 MIGRATION: Convert old cart items to new structure
    if (parsedCart.items && parsedCart.items.length > 0) {
      const migratedItems = parsedCart.items.map(item => {
        // If it's already in new format, return as is
        if (item.cartItemId) {
          return item;
        }
        
        // 🔥 MIGRATE from old format to new format
        const cartItemId = `${item.id}-${item.variantId || 'default'}`;
        
        return {
          ...item,
          cartItemId,
          // Ensure variant data exists
          variant: item.variant || {
            id: item.variantId,
            title: item.variantTitle || `Variant ${item.variantId}`,
            price: item.price,
            sku: item.sku
          },
          selectedColor: item.color || item.selectedColor,
          selectedSize: item.size || item.selectedSize
        };
      });
      
      return { ...parsedCart, items: migratedItems };
    }
    
    return parsedCart;
  } catch (error) {
    console.error('❌ Error loading cart from storage:', error);
    return { items: [] };
  }
};

// Save cart to localStorage
const saveCartToStorage = (cartState, userId = 'guest') => {
  try {
    const cartKey = getCartKey(userId);
    localStorage.setItem(cartKey, JSON.stringify(cartState));
  } catch (error) {
    console.error('❌ Error saving cart to storage:', error);
  }
};

// Reducer
const cartReducer = (state, action) => {
  let newState;

  switch (action.type) {
    case 'ADD_TO_CART': {
      const { 
        product, 
        variant, 
        quantity = 1,
        selectedColor,  // ✅ Make sure these are passed
        selectedSize,   // ✅ Make sure these are passed
            selectedPhoneModel,
    selectedFinish,
    hasGiftPackaging
      } = action.payload;
      
      // 🔥 CRITICAL: Validate variant data
      if (!variant || !variant.id) {
        console.error('❌ Invalid variant data:', variant);
        return state;
      }

      const variantId = variant.id;
      const cartItemId = `${product.id}-${variantId}`;
      
      const existingItemIndex = state.items.findIndex(
        item => item.cartItemId === cartItemId
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += quantity;
        newState = { ...state, items: updatedItems };
      } else {
        const newItem = {
          cartItemId,
          id: product.id,
          productId: product.id,
          variantId: variantId,
          name: product.name,
          price: variant.price || product.price,
          originalPrice: product.price,
          image: variant.image || product.image || product.images?.[0],
          quantity,
          variant: {
            id: variant.id,
            title: variant.title,
            price: variant.price,
            sku: variant.sku,
            isAvailable: variant.isAvailable,
            isEnabled: variant.isEnabled,
            image: variant.image
          },
          // 🔥 CRITICAL: Store selected size and color
          selectedColor: selectedColor || variant.color || 'Black',
          selectedSize: selectedSize || variant.size || 'M',
              // 🔥 STORE PHONE CASE SPECIFIC DATA
          selectedPhoneModel: selectedPhoneModel,
          selectedFinish: selectedFinish,
          hasGiftPackaging: hasGiftPackaging || false,
          product: {
            id: product.id,
            name: product.name,
            printifyProductId: product.printifyProductId,
            printifyVariants: product.printifyVariants,
            category: product.category
          }
        };
        newState = { ...state, items: [...state.items, newItem] };
      }
      break;
    }
    case 'REMOVE_FROM_CART':
      newState = {
        ...state,
        items: state.items.filter(
          (item) => item.cartItemId !== action.payload.cartItemId // 🔥 FIXED: Changed === to !==
        ),
      };
      
      break;

    case 'UPDATE_QUANTITY':
      newState = {
        ...state,
        items: state.items
          .map((item) =>
            item.cartItemId === action.payload.cartItemId
              ? { ...item, quantity: action.payload.quantity }
              : item
          )
          .filter((item) => item.quantity > 0),
      };
      break;

    case 'CLEAR_CART':
      newState = { ...state, items: [] };
      break;

    case 'LOAD_CART':
      newState = {
        ...state,
        items: action.payload.items || [],
        currentUserId: action.payload.userId || 'guest',
      };
      break;

    case 'SWITCH_USER_CART':
      newState = {
        ...state,
        items: action.payload.items || [],
        currentUserId: action.payload.userId,
      };
      break;

    case 'RESET_TO_GUEST':
      newState = { items: [], currentUserId: 'guest' };
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

  const addToCart = (productData) => {
    const { 
      product, 
      variant, 
      quantity = 1, 
      selectedColor, 
      selectedSize 
    } = productData;

    if (!product || !variant) {
      console.error('❌ Missing product or variant data:', { product, variant });
      return;
    }

    dispatch({ 
      type: 'ADD_TO_CART', 
      payload: {
        product,
        variant,
        quantity,
        selectedColor,
        selectedSize
      }
    });
  };

  // 🔥 FIXED: removeFromCart with proper logging
  const removeFromCart = (cartItemId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { cartItemId } });
  };

  const updateQuantity = (cartItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
    } else {
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: { cartItemId, quantity },
      });
    }
  };

  const clearCart = (callback) => {
    dispatch({ type: 'CLEAR_CART' });
    if (callback) callback();
  };

  // Handle user login
  const handleUserLogin = (userId) => {
    try {
      if (userId && userId !== state.currentUserId) {
        if (state.items.length > 0 && state.currentUserId === 'guest') {
          saveCartToStorage({ items: state.items }, 'guest');
        }

        const userCart = loadCartFromStorage(userId);
        dispatch({
          type: 'SWITCH_USER_CART',
          payload: { items: userCart.items, userId },
        });
      }
    } catch (error) {
      console.error('❌ User login cart switch error:', error);
    }
  };

  // Handle user logout
  const handleUserLogout = () => {
    try {
      if (state.currentUserId !== 'guest' && state.items.length > 0) {
        saveCartToStorage({ items: state.items }, state.currentUserId);
      }

      const guestCart = loadCartFromStorage('guest');
      dispatch({
        type: 'SWITCH_USER_CART',
        payload: { items: guestCart.items, userId: 'guest' },
      });
    } catch (error) {
      console.error('❌ User logout cart switch error:', error);
    }
  };

  const total = state.items.reduce((sum, item) => {
    const itemPrice = item.variant?.price || item.price;
    return sum + (itemPrice * item.quantity);
  }, 0);

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
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};