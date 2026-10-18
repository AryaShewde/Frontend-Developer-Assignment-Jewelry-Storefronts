import React, { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Cart, CartItem } from '../types';
import { generateCartId, generateItemId } from './cartUtils';
import { CartContext } from './cartContextDef';
import type { CartContextType } from './cartContextDef';

const initialCart: Cart = {
  id: generateCartId(),
  items: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart>(() => {
    // Try to load cart from localStorage on initialization
    try {
      const savedCart = localStorage.getItem('jewelry-store-cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        // Validate the parsed cart has required properties
        if (parsedCart && parsedCart.items && Array.isArray(parsedCart.items)) {
          return {
            ...initialCart,
            ...parsedCart,
            items: parsedCart.items.map((item: unknown) => {
              const cartItem = item as { id?: string; productId: string; variantId: string; quantity: number; addedAt: string };
              return {
                ...cartItem,
                id: cartItem.id || generateItemId(),
              };
            }),
          };
        }
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
    return initialCart;
  });

  // Save cart to localStorage whenever it changes
  React.useEffect(() => {
    try {
      localStorage.setItem('jewelry-store-cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [cart]);

  const addItem = useCallback((productId: string, variantId: string, quantity: number) => {
    if (quantity <= 0) {
      return;
    }

    setCart(prevCart => {
      // Check if item already exists in cart
      const existingItemIndex = prevCart.items.findIndex(
        item => item.productId === productId && item.variantId === variantId
      );

      let updatedItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        updatedItems = [...prevCart.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        };
      } else {
        // Add new item
        const newItem: CartItem = {
          id: generateItemId(),
          productId,
          variantId,
          quantity,
          addedAt: new Date().toISOString(),
        };
        updatedItems = [...prevCart.items, newItem];
      }

      return {
        ...prevCart,
        items: updatedItems,
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setCart(prevCart => ({
      ...prevCart,
      items: prevCart.items.filter(item => item.id !== itemId),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setCart(prevCart => ({
      ...prevCart,
      items: prevCart.items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      ),
      updatedAt: new Date().toISOString(),
    }));
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setCart({
      ...initialCart,
      id: generateCartId(),
    });
  }, []);

  const getTotalItems = useCallback(() => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  }, [cart.items]);

  const getSubtotal = useCallback(() => {
    // In Phase 0, we'll return 0 as we don't have product price data yet
    // In later phases, this will calculate actual subtotal using product prices
    return 0;
  }, []);

  const value: CartContextType = {
    cart,
    itemCount: getTotalItems(),
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getSubtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};