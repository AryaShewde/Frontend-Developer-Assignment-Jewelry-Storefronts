import { useContext } from 'react';
import { CartContext } from '../context/cartContextDef';
import type { CartContextType } from '../context/cartContextDef';

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};