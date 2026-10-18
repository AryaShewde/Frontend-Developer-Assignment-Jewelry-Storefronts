import { createContext } from 'react';

export interface CartContextType {
  cart: import('../types').Cart;
  itemCount: number;
  addItem: (productId: string, variantId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);