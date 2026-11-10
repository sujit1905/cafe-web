import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ArrowRight,
  ShoppingBag,
  Share2,
  Printer,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { getOrderById } from '../services/orderService.js';
import StatusBadge from '../components/StatusBadge.jsx';
import Spinner from '../components/Spinner.jsx';
import { formatPrice, formatDate, formatOrderNumber } from '../utils/formatters.js';

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const location = useLocation();

  const [order, setOrder] = useState(() => location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (!order && orderId && orderId !== 'new') {
      const fetchOrder = async () => {
        setLoading(true);
        try {
          const res = await getOrderById(orderId);
          const data = res.data?.data || res.data?.order || res.data;
          if (isMounted) setOrder(data);
        } catch (err) {
          console.error('Failed to fetch order:', err);
          if (isMounted) setError('Order details could not be loaded.');
        } finally {
          if (isMounted) setLoading(false);
        }
      };
      fetchOrder();
    }
    return () => {
      isMounted = false;
    };
  }, [orderId, order]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'Brew & Bite Order',
          text: `Check my order #${orderNum} at Brew & Bite!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Order link copied to clipboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
        <Spinner size="lg" color="terracotta" />
        <p className="mt-4 text-sm text-latte">Fetching order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto my-16 text-center bg-white p-8 rounded-3xl border border-border space-y-4">
        <h2 className="font-serif text-2xl font-bold text-espresso">Order Details</h2>
        <p className="text-sm text-latte">
          {error || 'Thank you! Your order has been dispatched to the kitchen.'}
        </p>
        <Link
          to="/menu"
          className="inline-block px-6 py-2.5 bg-terracotta text-white rounded-xl text-sm font-semibold"
        >
          Return to Menu
        </Link>
      </div>
    );
  }

  const orderNum = order.orderNumber || order._id?.slice(-6)?.toUpperCase();
  const items = order.items || [];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Confirmation Card */}
      <div className="bg-white rounded-3xl border border-border shadow-xl p-6 sm:p-10 space-y-8 animate-in zoom-in-95 duration-300">
        {/* Success Header */}
        <div className="text-center space-y-3 pb-6 border-b border-border">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 block">
            Payment On Delivery
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-espresso">
            Order Placed Successfully!
          </h1>

          <p className="text-sm text-latte max-w-md mx-auto">
            Our kitchen team has received your order and is handcrafting your selections now.
          </p>

          <div className="pt-2">
            <span className="text-xs text-latte block">Order Reference</span>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-espresso tracking-wider mt-0.5">
              BB-{formatOrderNumber(orderNum)}
            </div>
            <div className="mt-2 flex justify-center">
              <StatusBadge status={order.status || 'Pending'} />
            </div>
          </div>
        </div>

        {/* Preparation Banner */}
        <div className="bg-ivory p-4 rounded-2xl border border-border flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-espresso">
                Estimated Preparation Time
              </p>
              <p className="text-sm text-latte">10 – 15 minutes</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-terracotta bg-white px-3 py-1.5 rounded-xl border border-border">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Freshly Poured</span>
          </div>
        </div>

        {/* Guest & Table Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-ivory/40 p-4 rounded-2xl border border-border/60">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-latte block">
              Customer Info
            </span>
            <p className="font-semibold text-espresso mt-0.5">
              {order.customerName || 'Cafe Guest'}
            </p>
            {order.customerPhone && (
              <p className="text-xs text-latte mt-0.5 flex items-center gap-1">
                <Phone className="w-3 h-3 text-terracotta" />
                {order.customerPhone}
              </p>
            )}
          </div>

          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-latte block">
              Service Details
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-medium text-espresso">
                {order.orderType || (order.tableNumber ? 'Dine-in' : 'Takeaway')}
              </span>
              {order.tableNumber && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-terracotta/10 text-terracotta font-bold text-xs border border-terracotta/20">
                  <MapPin className="w-3 h-3" />
                  Table {order.tableNumber}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Itemized Order Summary */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-latte mb-3 flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5 text-terracotta" />
            Ordered Items ({items.length})
          </h3>

          <div className="divide-y divide-border/60">
            {items.map((item, idx) => {
              const name = item.name || item.menuItem?.name || 'Handcrafted Selection';
              const price = item.price || item.menuItem?.price || 0;
              const qty = item.quantity || 1;

              return (
                <div key={idx} className="py-2.5 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-ivory-dark flex items-center justify-center text-xs font-bold text-espresso">
                      {qty}×
                    </span>
                    <span className="font-medium text-espresso">{name}</span>
                  </div>
                  <span className="font-semibold text-espresso">
                    {formatPrice(price * qty)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Pricing Calculation */}
          <div className="pt-4 mt-2 border-t border-border space-y-2 text-sm">
            <div className="flex justify-between text-latte">
              <span>Subtotal</span>
              <span className="font-medium text-espresso">
                {formatPrice(order.subtotal || order.total * 0.95)}
              </span>
            </div>
            <div className="flex justify-between text-latte">
              <span>Taxes (5%)</span>
              <span className="font-medium text-espresso">
                {formatPrice(order.tax || order.total * 0.05)}
              </span>
            </div>
            <div className="pt-2 border-t border-border flex justify-between text-base font-bold text-espresso">
              <span>Total Bill</span>
              <span className="font-serif text-2xl text-terracotta">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </div>

        {order.notes && (
          <div className="p-3.5 rounded-xl bg-ivory border border-border text-xs text-latte">
            <strong className="text-espresso">Barista Note:</strong> "{order.notes}"
          </div>
        )}

        {/* Instructions */}
        <div className="text-center text-xs text-latte bg-ivory-dark/40 p-4 rounded-2xl border border-border">
          <p className="font-medium text-espresso">
            Please show this page to our staff when your order is served at your table.
          </p>
          <p className="mt-1">Placed on {formatDate(order.createdAt || new Date())}</p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 print:hidden">
          <Link
            to="/menu"
            className="w-full sm:w-auto px-6 py-3 bg-terracotta hover:bg-terracotta-dark text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <span>Back to Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-5 py-3 bg-white hover:bg-ivory border border-border text-espresso rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4 text-latte" />
            <span>Print Receipt</span>
          </button>

          <button
            onClick={handleShare}
            className="w-full sm:w-auto px-5 py-3 bg-white hover:bg-ivory border border-border text-espresso rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Share2 className="w-4 h-4 text-latte" />
            <span>Share Link</span>
          </button>
        </div>
      </div>
    </div>
  );
}
