import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  RefreshCw,
  Search,
  Eye,
  Filter,
  CheckCircle,
  Clock,
  MapPin,
  ShoppingBag,
} from 'lucide-react';
import { toast } from 'sonner';
import { getOrders, updateOrderStatus } from '../../services/orderService.js';
import { ORDER_STATUSES } from '../../utils/constants.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import OrderDetailsModal from '../../components/OrderDetailsModal.jsx';
import Spinner from '../../components/Spinner.jsx';
import { formatPrice, formatDate, formatOrderNumber } from '../../utils/formatters.js';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    try {
      const res = await getOrders({ sort: '-createdAt' });
      const rawData = res.data?.data || res.data || {};
      // getAllOrders returns { orders: [...], pagination: {...} }
      const orderList = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData.orders)
        ? rawData.orders
        : [];
      setOrders(orderList);
    } catch (err) {
      console.error('Failed to load orders:', err);
      toast.error('Failed to load live orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();

    // Auto refresh orders every 30 seconds
    const interval = setInterval(() => {
      fetchOrders(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Optimistic update
      setOrders((prev) =>
        prev.map((ord) =>
          ord._id === orderId ? { ...ord, status: newStatus } : ord
        )
      );
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }

      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.error('Status update failed:', err);
      toast.error('Failed to update status');
      fetchOrders(true);
    }
  };

  // Filter orders by status and search query
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === 'All' ||
        (order.status &&
          order.status.toLowerCase() === statusFilter.toLowerCase());

      const query = searchQuery.toLowerCase().trim();
      const orderNum = (
        order.orderNumber ||
        order._id?.slice(-6) ||
        ''
      ).toLowerCase();
      const customer = (order.customerName || '').toLowerCase();
      const table = (order.tableNumber || '').toLowerCase();

      const matchesSearch =
        !query ||
        orderNum.includes(query) ||
        customer.includes(query) ||
        table.includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, searchQuery]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-espresso">
            Order Management
          </h1>
          <p className="text-xs text-latte mt-1">
            Real-time feed of cafe table and takeaway orders.
          </p>
        </div>

        <button
          onClick={() => fetchOrders(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-xl text-xs font-semibold text-espresso hover:bg-ivory transition-colors shadow-sm self-start sm:self-auto"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 text-terracotta ${
              refreshing ? 'animate-spin' : ''
            }`}
          />
          <span>{refreshing ? 'Refreshing...' : 'Refresh Orders'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {['All', ...ORDER_STATUSES].map((st) => {
            const count =
              st === 'All'
                ? orders.length
                : orders.filter((o) => o.status === st).length;

            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  statusFilter === st
                    ? 'bg-espresso text-white shadow-sm'
                    : 'bg-white text-latte hover:text-espresso border border-border/80'
                }`}
              >
                <span>{st}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    statusFilter === st
                      ? 'bg-white/20 text-white'
                      : 'bg-ivory text-latte'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-latte" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order #, Customer, or Table..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-border rounded-xl text-xs text-espresso placeholder-latte focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:border-terracotta shadow-sm"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center">
            <Spinner size="md" color="terracotta" />
            <p className="mt-3 text-xs text-latte">Loading live orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-16 text-center text-latte space-y-3">
            <ShoppingBag className="w-10 h-10 mx-auto opacity-40" />
            <p className="text-sm font-serif font-bold text-espresso">
              No orders found
            </p>
            <p className="text-xs text-latte">
              No orders match the current status filter "{statusFilter}".
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-ivory/60 border-b border-border text-[11px] font-semibold uppercase tracking-wider text-latte">
                  <th className="py-3.5 px-6">Order #</th>
                  <th className="py-3.5 px-6">Customer &amp; Phone</th>
                  <th className="py-3.5 px-6">Service</th>
                  <th className="py-3.5 px-6">Items Ordered</th>
                  <th className="py-3.5 px-6">Total Bill</th>
                  <th className="py-3.5 px-6">Placed At</th>
                  <th className="py-3.5 px-6">Update Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-sm">
                {filteredOrders.map((order) => {
                  const orderNum =
                    order.orderNumber || order._id?.slice(-6)?.toUpperCase();
                  const items = order.items || [];
                  const itemsSummary = items
                    .map((it) => `${it.quantity || 1}× ${it.name || it.menuItem?.name || 'Item'}`)
                    .join(', ');

                  return (
                    <tr
                      key={order._id}
                      onClick={() => setSelectedOrder(order)}
                      className="hover:bg-ivory/40 transition-colors cursor-pointer"
                    >
                      {/* Order # */}
                      <td className="py-4 px-6 font-mono text-xs font-bold text-espresso">
                        #{formatOrderNumber(orderNum)}
                      </td>

                      {/* Customer */}
                      <td className="py-4 px-6">
                        <p className="font-semibold text-espresso">
                          {order.customerName || 'Guest'}
                        </p>
                        <p className="text-xs text-latte">
                          {order.customerPhone || 'No phone provided'}
                        </p>
                      </td>

                      {/* Service / Table */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="font-medium text-espresso">
                            {order.orderType || 'Dine-in'}
                          </span>
                          {order.tableNumber && (
                            <span className="px-2 py-0.5 rounded-full bg-ivory text-terracotta border border-border font-bold">
                              T-{order.tableNumber}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Items */}
                      <td className="py-4 px-6 max-w-xs">
                        <p className="text-xs text-espresso font-medium line-clamp-1">
                          {itemsSummary || `${items.length} items`}
                        </p>
                      </td>

                      {/* Total */}
                      <td className="py-4 px-6 font-bold text-espresso">
                        {formatPrice(order.total)}
                      </td>

                      {/* Placed At */}
                      <td className="py-4 px-6 text-xs text-latte whitespace-nowrap">
                        {formatDate(order.createdAt)}
                      </td>

                      {/* Status Dropdown */}
                      <td
                        className="py-4 px-6"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          className="text-xs font-semibold py-1.5 px-2.5 rounded-lg border border-border bg-white text-espresso focus:outline-none focus:ring-1 focus:ring-terracotta cursor-pointer"
                        >
                          {ORDER_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                          }}
                          className="p-1.5 rounded-lg text-latte hover:text-espresso hover:bg-ivory transition-colors"
                          title="View Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
