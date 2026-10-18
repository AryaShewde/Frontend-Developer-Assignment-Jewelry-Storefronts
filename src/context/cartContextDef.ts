import { createContext } from 'react';
import type { Cart } from '../types';

export interface CartItemDetails {
  productName?: string;
  variantName?: string;
  price?: number;
  imageUrl?: string;
  brandId?: 'aurelle' | 'gemma-grove' | 'lustre';
  slug?: string;
}

export interface CartContextType {
  cart: Cart;
  itemCount: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (productId: string, variantId: string, quantity: number, details?: CartItemDetails) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);
