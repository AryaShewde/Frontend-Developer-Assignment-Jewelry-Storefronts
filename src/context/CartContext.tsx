import React, { useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Cart, CartItem } from '../types';
import { generateCartId, generateItemId } from './cartUtils';
import { CartContext } from './cartContextDef';
import type { CartContextType, CartItemDetails } from './cartContextDef';

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
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [cart, setCart] = useState<Cart>(() => {
    try {
      const savedCart = localStorage.getItem('jewelry-store-cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (parsedCart && parsedCart.items && Array.isArray(parsedCart.items)) {
          return {
            ...initialCart,
            ...parsedCart,
            items: parsedCart.items.map((item: unknown) => {
              const cartItem = item as CartItem;
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
  useEffect(() => {
    try {
      localStorage.setItem('jewelry-store-cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [cart]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen(prev => !prev), []);

  const addItem = useCallback(
    (
      productId: string,
      variantId: string,
      quantity: number,
      details?: CartItemDetails
    ) => {
      if (quantity <= 0) return;

      setCart(prevCart => {
        const existingItemIndex = prevCart.items.findIndex(
          item => item.productId === productId && item.variantId === variantId
        );

        let updatedItems: CartItem[];

        if (existingItemIndex >= 0) {
          updatedItems = [...prevCart.items];
          const existing = updatedItems[existingItemIndex];
          updatedItems[existingItemIndex] = {
            ...existing,
            quantity: existing.quantity + quantity,
            productName: details?.productName ?? existing.productName,
            variantName: details?.variantName ?? existing.variantName,
            price: details?.price ?? existing.price,
            imageUrl: details?.imageUrl ?? existing.imageUrl,
            brandId: details?.brandId ?? existing.brandId,
            slug: details?.slug ?? existing.slug,
          };
        } else {
          const newItem: CartItem = {
            id: generateItemId(),
            productId,
            variantId,
            quantity,
            addedAt: new Date().toISOString(),
            productName: details?.productName,
            variantName: details?.variantName,
            price: details?.price,
            imageUrl: details?.imageUrl,
            brandId: details?.brandId,
            slug: details?.slug,
          };
          updatedItems = [...prevCart.items, newItem];
        }

        return {
          ...prevCart,
          items: updatedItems,
          updatedAt: new Date().toISOString(),
        };
      });
    },
    []
  );

  const removeItem = useCallback((itemId: string) => {
    setCart(prevCart => ({
      ...prevCart,
      items: prevCart.items.filter(item => item.id !== itemId),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const updateQuantity = useCallback(
    (itemId: string, quantity: number) => {
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
    },
    [removeItem]
  );

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
    return cart.items.reduce(
      (total, item) => total + (item.price || 0) * item.quantity,
      0
    );
  }, [cart.items]);

  const value: CartContextType = {
    cart,
    itemCount: getTotalItems(),
    isCartOpen,
    openCart,
    closeCart,
    toggleCart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getSubtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
