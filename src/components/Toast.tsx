import React, { useEffect } from 'react';
import { CheckCircle2, X, ShoppingBag } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../utils/format';

export interface ToastItem {
  id: string;
  productName: string;
  variantName?: string;
  price?: number;
  imageUrl?: string;
}

interface ToastProps {
  item: ToastItem | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ item, onClose }) => {
  const { openCart } = useCart();

  useEffect(() => {
    if (!item) return;

    const timer = setTimeout(() => {
      onClose();
    }, 4500);

    return () => clearTimeout(timer);
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-white border border-gray-200 shadow-2xl rounded-lg p-4 animate-slide-up"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start justify-between pb-2 border-b border-gray-100">
        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-700">
          <CheckCircle2 className="w-4 h-4" />
          <span>Added to Shopping Bag</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-1 -mr-1 -mt-1 rounded transition-colors touch-target flex items-center justify-center"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center space-x-3 pt-3">
        {item.imageUrl && (
          <img
            src={item.imageUrl}
            alt={item.productName}
            className="w-12 h-12 object-cover rounded border border-gray-200 shrink-0 bg-gray-50"
          />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{item.productName}</p>
          {item.variantName && <p className="text-xs text-gray-500 truncate">{item.variantName}</p>}
          {typeof item.price === 'number' && (
            <p className="text-xs font-bold text-primary mt-0.5">{formatPrice(item.price)}</p>
          )}
        </div>
      </div>

      <div className="mt-3 pt-2 flex space-x-2">
        <button
          onClick={() => {
            onClose();
            openCart();
          }}
          className="flex-1 py-2 px-3 text-xs font-semibold rounded bg-primary text-white hover:bg-primary/90 transition-colors flex items-center justify-center space-x-1.5"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>View Bag</span>
        </button>
        <button
          onClick={onClose}
          className="py-2 px-3 text-xs font-medium rounded border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
};
