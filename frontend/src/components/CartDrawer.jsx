import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../hooks/useCart.js';
import { formatPrice } from '../utils/formatters.js';

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    tax,
    total,
    itemCount,
  } = useCart();
  const navigate = useNavigate();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCartOpen, closeCart]);

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-espresso/50 backdrop-blur-sm transition-opacity duration-300 ease-out"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-border animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="px-6 py-5 bg-ivory border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-espresso text-ivory rounded-lg">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-espresso">
                  Your Order
                </h2>
                <p className="text-xs text-latte">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 rounded-lg text-latte hover:text-espresso hover:bg-ivory-dark transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 rounded-full bg-ivory flex items-center justify-center text-latte mb-4 border border-border">
                  <ShoppingBag className="w-10 h-10 stroke-1" />
                </div>
                <h3 className="font-serif text-lg font-bold text-espresso">
                  Your cart is empty
                </h3>
                <p className="mt-1 text-xs text-latte max-w-[220px]">
                  Browse our handcrafted menu and add your favorite brews and artisan treats.
                </p>
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/menu');
                  }}
                  className="mt-6 px-5 py-2.5 bg-terracotta text-white rounded-xl text-sm font-medium hover:bg-terracotta-dark transition-colors shadow-sm"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              <div className="space-y-4 divide-y divide-border/50">
                {items.map((item) => (
                  <div key={item._id} className="pt-4 first:pt-0 flex gap-4 items-center">
                    {/* Item Image */}
                    <div className="w-16 h-16 rounded-xl bg-ivory-dark overflow-hidden flex-shrink-0 border border-border">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-latte text-xs font-serif">
                          ☕
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-serif font-semibold text-espresso truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-latte mt-0.5">
                        {formatPrice(item.price)} each
                      </p>
                      <p className="text-xs font-semibold text-espresso mt-1">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-1.5 bg-ivory border border-border rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="p-1 rounded hover:bg-white text-espresso transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-semibold px-1.5 min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="p-1 rounded hover:bg-white text-espresso transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-latte hover:text-rose-600 p-1.5 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={clearCart}
                    className="text-xs text-latte hover:text-rose-600 transition-colors underline"
                  >
                    Clear entire order
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 bg-ivory border-t border-border space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-latte">
                  <span>Subtotal</span>
                  <span className="font-medium text-espresso">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-latte">
                  <span>Estimated Tax (5%)</span>
                  <span className="font-medium text-espresso">{formatPrice(tax)}</span>
                </div>
                <div className="pt-2 border-t border-border flex justify-between text-base font-bold text-espresso">
                  <span>Total Amount</span>
                  <span className="font-serif text-lg text-terracotta">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3 px-4 bg-terracotta hover:bg-terracotta-dark text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.99]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
