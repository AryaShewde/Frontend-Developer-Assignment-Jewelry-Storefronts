import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../utils/format';
import { getProductUrl } from '../api';

const FREE_SHIPPING_THRESHOLD = 500;

export const CartDrawer: React.FC = () => {
  const {
    cart,
    itemCount,
    isCartOpen,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
    getSubtotal,
  } = useCart();

  const drawerRef = useRef<HTMLDivElement>(null);
  const subtotal = getSubtotal();
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const amountAwayFromFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  // Close drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };

    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div
          ref={drawerRef}
          className="w-screen max-w-md bg-background border-l border-border flex flex-col shadow-2xl transition-transform duration-300 ease-in-out"
        >
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-border flex items-center justify-between bg-neutral-50/50">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold tracking-tight text-foreground font-brand-display">
                Shopping Bag ({itemCount})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-full hover:bg-neutral-200/60 text-muted hover:text-foreground transition-colors touch-target flex items-center justify-center"
              aria-label="Close bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="px-4 sm:px-6 py-3 bg-neutral-100/60 border-b border-border text-xs">
            {amountAwayFromFreeShipping === 0 ? (
              <div className="flex items-center text-emerald-700 font-medium">
                <Truck className="w-4 h-4 mr-1.5 shrink-0" />
                <span>You qualify for <strong>Free Insured Express Delivery</strong>!</span>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex justify-between text-muted">
                  <span>Add <strong>{formatPrice(amountAwayFromFreeShipping)}</strong> for free shipping</span>
                  <span className="font-semibold text-foreground">{Math.round(freeShippingProgress)}%</span>
                </div>
                <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all duration-300 rounded-full"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 divide-y divide-border/60">
            {cart.items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-muted">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground text-base">Your shopping bag is empty</h3>
                  <p className="text-xs text-muted max-w-xs">
                    Explore our fine jewelry collections from Aurelle, Gemma &amp; Grove, and Lustre.
                  </p>
                </div>
                <div className="pt-2 flex flex-col w-full gap-2">
                  <Link
                    to="/aurelle/engagement-rings"
                    onClick={closeCart}
                    className="w-full py-2.5 px-4 text-xs font-semibold rounded-md border border-border text-foreground hover:bg-neutral-50 text-center transition-colors"
                  >
                    Aurelle Engagement Rings
                  </Link>
                  <Link
                    to="/gemma-grove/gemstone-rings"
                    onClick={closeCart}
                    className="w-full py-2.5 px-4 text-xs font-semibold rounded-md border border-border text-foreground hover:bg-neutral-50 text-center transition-colors"
                  >
                    Gemma &amp; Grove Gemstones
                  </Link>
                  <Link
                    to="/lustre/moissanite-rings"
                    onClick={closeCart}
                    className="w-full py-2.5 px-4 text-xs font-semibold rounded-md border border-border text-foreground hover:bg-neutral-50 text-center transition-colors"
                  >
                    Lustre Moissanite Collection
                  </Link>
                </div>
              </div>
            ) : (
              cart.items.map((item) => {
                const itemUrl = item.brandId && item.slug ? getProductUrl(item.brandId, item.slug) : null;

                return (
                  <div key={item.id} className="pt-4 first:pt-0 flex space-x-4">
                    {/* Thumbnail */}
                    <div className="w-20 h-20 rounded-md border border-border bg-neutral-100 overflow-hidden shrink-0">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.productName || 'Jewelry item'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted">
                          <Sparkles className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <h4 className="text-sm font-semibold text-foreground leading-snug line-clamp-1">
                            {itemUrl ? (
                              <Link
                                to={itemUrl}
                                onClick={closeCart}
                                className="hover:underline hover:text-primary transition-colors"
                              >
                                {item.productName || `Design #${item.productId}`}
                              </Link>
                            ) : (
                              item.productName || `Design #${item.productId}`
                            )}
                          </h4>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-neutral-400 hover:text-red-500 p-1 rounded transition-colors touch-target flex items-center justify-center -mr-2 -mt-1"
                            aria-label={`Remove ${item.productName || 'item'} from bag`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {item.variantName && (
                          <p className="text-xs text-muted mt-0.5">
                            {item.variantName}
                          </p>
                        )}

                        <div className="text-xs font-bold text-primary mt-1">
                          {formatPrice(item.price || 0)}
                        </div>
                      </div>

                      {/* Quantity row */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-border rounded">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-neutral-100 text-foreground transition-colors disabled:opacity-40"
                            aria-label="Decrease quantity"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2 text-xs font-semibold text-foreground min-w-[1.75rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-neutral-100 text-foreground transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="text-xs font-bold text-foreground">
                          {formatPrice((item.price || 0) * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Summary (if items present) */}
          {cart.items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-border bg-neutral-50/50 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span className="font-bold text-foreground text-sm">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Insured Shipping</span>
                  <span className="text-emerald-700 font-medium">
                    {subtotal >= FREE_SHIPPING_THRESHOLD ? 'FREE' : '$25.00'}
                  </span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Taxes</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="pt-2 border-t border-border flex justify-between items-baseline">
                <span className="text-sm font-semibold text-foreground">Estimated Total</span>
                <span className="text-lg font-bold text-primary">
                  {formatPrice(subtotal >= FREE_SHIPPING_THRESHOLD ? subtotal : subtotal + 25)}
                </span>
              </div>

              {/* Action buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    alert('Order checkout simulation: In accordance with assignment scope, checkout is a UI demonstration. Your bag state is preserved.');
                  }}
                  className="w-full py-3 px-4 rounded-md font-semibold text-sm transition-all shadow-sm hover:opacity-95 flex items-center justify-center space-x-2"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--background)',
                  }}
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <div className="flex items-center justify-between text-xs text-muted pt-1">
                  <button
                    onClick={clearCart}
                    className="hover:text-red-500 underline transition-colors"
                  >
                    Clear bag
                  </button>
                  <button
                    onClick={closeCart}
                    className="hover:text-foreground underline transition-colors"
                  >
                    Continue shopping
                  </button>
                </div>
              </div>

              {/* Trust signals */}
              <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] text-muted border-t border-border/60">
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>30-Day Risk-Free Returns</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Truck className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>Fully Insured Transport</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
