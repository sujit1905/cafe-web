import React, { useEffect } from 'react';
import { X, Calendar, MapPin, Phone, Mail, FileText, ShoppingBag } from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';
import { formatPrice, formatDate, formatOrderNumber } from '../utils/formatters.js';
import { ORDER_STATUSES } from '../utils/constants.js';

export default function OrderDetailsModal({
  isOpen,
  onClose,
  order,
  onStatusChange,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !order) return null;

  const orderNum = order.orderNumber || order._id?.slice(-6)?.toUpperCase();
  const items = order.items || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-espresso/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-border z-10 animate-in zoom-in-95 duration-200 my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-latte hover:text-espresso p-1.5 rounded-full hover:bg-ivory transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-border">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="font-serif text-2xl font-bold text-espresso">
                Order #{formatOrderNumber(orderNum)}
              </h3>
              <StatusBadge status={order.status} />
            </div>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-latte">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(order.createdAt || order.date)}</span>
            </div>
          </div>

          {/* Quick status change if allowed */}
          {onStatusChange && (
            <div className="flex items-center gap-2">
              <label className="text-xs text-latte font-medium">Status:</label>
              <select
                value={order.status}
                onChange={(e) => onStatusChange(order._id, e.target.value)}
                className="text-xs font-semibold py-1.5 px-3 bg-ivory border border-border rounded-lg text-espresso focus:outline-none focus:ring-1 focus:ring-terracotta"
              >
                {ORDER_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Customer & Service Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5 border-b border-border text-sm">
          <div className="space-y-2 bg-ivory/50 p-4 rounded-2xl border border-border/50">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-latte block">
              Customer Details
            </span>
            <p className="font-semibold text-espresso">
              {order.customerName || 'Guest'}
            </p>
            {order.customerPhone && (
              <p className="text-xs text-latte flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-terracotta" />
                {order.customerPhone}
              </p>
            )}
            {order.customerEmail && (
              <p className="text-xs text-latte flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-terracotta" />
                {order.customerEmail}
              </p>
            )}
          </div>

          <div className="space-y-2 bg-ivory/50 p-4 rounded-2xl border border-border/50">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-latte block">
              Service Type
            </span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-espresso">
                {order.orderType || (order.tableNumber ? 'Dine-in' : 'Takeaway')}
              </span>
              {order.tableNumber && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-terracotta/10 text-terracotta font-semibold text-xs border border-terracotta/20">
                  <MapPin className="w-3 h-3" />
                  Table {order.tableNumber}
                </span>
              )}
            </div>
            {order.notes && (
              <div className="pt-1 text-xs text-latte flex items-start gap-1.5">
                <FileText className="w-3.5 h-3.5 text-terracotta flex-shrink-0 mt-0.5" />
                <span className="italic">"{order.notes}"</span>
              </div>
            )}
          </div>
        </div>

        {/* Itemized Order List */}
        <div className="py-5 border-b border-border">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-latte mb-3 flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5 text-terracotta" />
            Items Ordered ({items.length})
          </h4>
          <div className="divide-y divide-border/60 max-h-60 overflow-y-auto pr-1">
            {items.map((item, index) => {
              const name = item.name || item.menuItem?.name || 'Menu Item';
              const price = item.price || item.menuItem?.price || 0;
              const qty = item.quantity || 1;
              const lineTotal = price * qty;

              return (
                <div
                  key={item._id || index}
                  className="py-2.5 flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-ivory flex items-center justify-center text-xs font-bold text-espresso border border-border">
                      {qty}×
                    </span>
                    <div>
                      <p className="font-medium text-espresso">{name}</p>
                      <p className="text-xs text-latte">{formatPrice(price)} each</p>
                    </div>
                  </div>
                  <span className="font-semibold text-espresso">
                    {formatPrice(lineTotal)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Totals */}
        <div className="pt-5 space-y-2 text-sm">
          <div className="flex justify-between text-latte">
            <span>Subtotal</span>
            <span className="text-espresso font-medium">
              {formatPrice(order.subtotal || order.total * 0.95)}
            </span>
          </div>
          <div className="flex justify-between text-latte">
            <span>Taxes (5%)</span>
            <span className="text-espresso font-medium">
              {formatPrice(order.tax || (order.total ? order.total * 0.05 : 0))}
            </span>
          </div>
          <div className="pt-2 border-t border-border flex justify-between text-base font-bold text-espresso">
            <span>Total</span>
            <span className="font-serif text-xl text-terracotta">
              {formatPrice(order.total)}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-espresso hover:bg-espresso-light text-white rounded-xl text-sm font-medium transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
