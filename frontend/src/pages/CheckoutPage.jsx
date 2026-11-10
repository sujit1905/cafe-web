import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShoppingBag,
  ArrowLeft,
  CheckCircle,
  MapPin,
  Phone,
  User,
  Mail,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '../hooks/useCart.js';
import { useTable } from '../hooks/useTable.js';
import { createOrder } from '../services/orderService.js';
import { formatPrice } from '../utils/formatters.js';
import Spinner from '../components/Spinner.jsx';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, tax, total, clearCart } = useCart();
  const { tableNumber, setTableNumber, customerPhone, setCustomerPhone } = useTable();

  // Form state
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState(customerPhone || '');
  const [email, setEmail] = useState('');
  const [orderType, setOrderType] = useState(tableNumber ? 'Dine-in' : 'Dine-in');
  const [table, setTable] = useState(tableNumber || '');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Sync phone if loaded from table context
  useEffect(() => {
    if (customerPhone && !phone) {
      setPhone(customerPhone);
    }
  }, [customerPhone, phone]);

  // Sync table if loaded from table context
  useEffect(() => {
    if (tableNumber && !table) {
      setTable(tableNumber);
    }
  }, [tableNumber, table]);

  // If cart is empty, redirect back to menu
  useEffect(() => {
    if (items.length === 0 && !loading) {
      navigate('/menu', { replace: true });
    }
  }, [items, loading, navigate]);

  if (items.length === 0) {
    return null;
  }

  const validate = () => {
    const errs = {};
    if (!customerName.trim()) {
      errs.customerName = 'Customer name is required';
    }
    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (!cleanPhone) {
      errs.phone = 'Phone number is required';
    } else if (cleanPhone.length < 7) {
      errs.phone = 'Please enter a valid phone number';
    }

    if (orderType === 'Dine-in' && !table.trim()) {
      errs.table = 'Table number is required for Dine-in orders';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please complete all required fields');
      return;
    }

    setLoading(true);
    try {
      // Save phone and table to context/storage for user convenience
      setCustomerPhone(phone.trim());
      if (orderType === 'Dine-in') {
        setTableNumber(table.trim());
      }

      // Format payload matching backend schema
      const orderPayload = {
        customerName: customerName.trim(),
        customerPhone: phone.trim(),
        customerEmail: email.trim() || undefined,
        orderType,
        tableNumber: orderType === 'Dine-in' ? table.trim() : undefined,
        notes: notes.trim() || undefined,
        items: items.map((item) => ({
          menuItemId: item._id,
          menuItem: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        subtotal,
        tax,
        total,
      };

      const res = await createOrder(orderPayload);
      const createdOrder = res.data?.data || res.data?.order || res.data;
      const orderId = createdOrder?._id || createdOrder?.id || 'new';

      toast.success('Order placed successfully!');
      clearCart();

      navigate(`/order-confirmation/${orderId}`, {
        state: { order: createdOrder },
      });
    } catch (err) {
      console.error('Order creation error:', err);
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to place order. Please try again or check with staff.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 text-xs font-semibold text-latte hover:text-espresso transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </Link>
      </div>

      <div className="pb-8 border-b border-border">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-espresso">
          Checkout &amp; Review
        </h1>
        <p className="text-sm text-latte mt-1">
          Review your selection and enter your service preferences.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Order Summary */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-sm space-y-6 order-2 lg:order-1">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <h2 className="font-serif text-lg font-bold text-espresso flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-terracotta" />
              <span>Your Order ({items.length})</span>
            </h2>
            <Link
              to="/menu"
              className="text-xs font-semibold text-terracotta hover:underline"
            >
              Edit Cart
            </Link>
          </div>

          {/* Items List */}
          <div className="divide-y divide-border/60 max-h-80 overflow-y-auto pr-1 space-y-3">
            {items.map((item) => (
              <div key={item._id} className="pt-3 first:pt-0 flex gap-3 items-center">
                <div className="w-14 h-14 rounded-xl bg-ivory-dark overflow-hidden flex-shrink-0 border border-border">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-serif text-latte">
                      ☕
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-espresso truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-latte">
                    {formatPrice(item.price)} × {item.quantity}
                  </p>
                </div>

                <span className="text-sm font-bold text-espresso">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Breakdown */}
          <div className="pt-4 border-t border-border space-y-2.5 text-sm">
            <div className="flex justify-between text-latte">
              <span>Subtotal</span>
              <span className="font-medium text-espresso">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-latte">
              <span>Estimated Tax (5%)</span>
              <span className="font-medium text-espresso">{formatPrice(tax)}</span>
            </div>
            <div className="pt-3 border-t border-border flex justify-between items-baseline">
              <span className="text-base font-bold text-espresso">Total Amount</span>
              <span className="font-serif text-2xl font-bold text-terracotta">
                {formatPrice(total)}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Service Details Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-sm order-1 lg:order-2">
          <h2 className="font-serif text-xl font-bold text-espresso mb-1">
            Service &amp; Contact Details
          </h2>
          <p className="text-xs text-latte mb-6">
            We will use your contact details to announce your order status.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Customer Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-latte mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-latte" />
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    if (errors.customerName) setErrors({ ...errors, customerName: '' });
                  }}
                  placeholder="e.g. Jane Doe"
                  className={`w-full pl-10 pr-4 py-2.5 bg-ivory/40 border rounded-xl text-sm text-espresso focus:outline-none focus:ring-2 focus:ring-terracotta/40 ${
                    errors.customerName ? 'border-rose-500' : 'border-border focus:border-terracotta'
                  }`}
                />
              </div>
              {errors.customerName && (
                <p className="mt-1 text-xs text-rose-600">{errors.customerName}</p>
              )}
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-latte mb-1.5">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-latte" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors({ ...errors, phone: '' });
                    }}
                    placeholder="+91 98765 43210"
                    className={`w-full pl-10 pr-4 py-2.5 bg-ivory/40 border rounded-xl text-sm text-espresso focus:outline-none focus:ring-2 focus:ring-terracotta/40 ${
                      errors.phone ? 'border-rose-500' : 'border-border focus:border-terracotta'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-latte mb-1.5">
                  Email (Optional)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-latte" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-ivory/40 border border-border rounded-xl text-sm text-espresso focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:border-terracotta"
                  />
                </div>
              </div>
            </div>

            {/* Order Type Radio Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-latte mb-2">
                Order Type *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setOrderType('Dine-in')}
                  className={`py-3 px-4 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                    orderType === 'Dine-in'
                      ? 'bg-espresso text-white border-espresso shadow-sm'
                      : 'bg-ivory/40 text-espresso border-border hover:bg-white'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>Dine-in</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType('Takeaway')}
                  className={`py-3 px-4 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                    orderType === 'Takeaway'
                      ? 'bg-espresso text-white border-espresso shadow-sm'
                      : 'bg-ivory/40 text-espresso border-border hover:bg-white'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Takeaway</span>
                </button>
              </div>
            </div>

            {/* Table Number if Dine-in */}
            {orderType === 'Dine-in' && (
              <div className="animate-in fade-in duration-200">
                <label className="block text-xs font-semibold uppercase tracking-wider text-latte mb-1.5">
                  Table Number *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-latte" />
                  <input
                    type="text"
                    value={table}
                    onChange={(e) => {
                      setTable(e.target.value);
                      if (errors.table) setErrors({ ...errors, table: '' });
                    }}
                    placeholder="e.g. 5 or T-05"
                    className={`w-full pl-10 pr-4 py-2.5 bg-ivory/40 border rounded-xl text-sm text-espresso focus:outline-none focus:ring-2 focus:ring-terracotta/40 ${
                      errors.table ? 'border-rose-500' : 'border-border focus:border-terracotta'
                    }`}
                  />
                </div>
                {errors.table && (
                  <p className="mt-1 text-xs text-rose-600">{errors.table}</p>
                )}
              </div>
            )}

            {/* Order Notes */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-latte mb-1.5">
                Special Requests / Barista Notes
              </label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-3 w-4 h-4 text-latte" />
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Oat milk preference, extra hot, no cinnamon..."
                  className="w-full pl-10 pr-4 py-2.5 bg-ivory/40 border border-border rounded-xl text-sm text-espresso focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:border-terracotta resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-terracotta hover:bg-terracotta-dark text-white rounded-2xl text-base font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-60"
              >
                {loading ? (
                  <Spinner size="sm" color="white" />
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Place Order • {formatPrice(total)}</span>
                  </>
                )}
              </button>
              <p className="text-center text-[11px] text-latte mt-2">
                By placing this order, you agree to table-side payment upon delivery.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
