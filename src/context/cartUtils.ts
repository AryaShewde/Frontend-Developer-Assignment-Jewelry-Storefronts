// Utility functions for cart operations

export const generateCartId = (): string => {
  return `cart_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
};

export const generateItemId = (): string => {
  return `item_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
};