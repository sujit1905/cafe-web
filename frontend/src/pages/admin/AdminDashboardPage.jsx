import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  UtensilsCrossed,
  ArrowRight,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { getOrderStats, getOrders, updateOrderStatus } from '../../services/orderService.js';
import { getMenuItems } from '../../services/menuService.js';
import StatCard from '../../components/StatCard.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import OrderDetailsModal from '../../components/OrderDetailsModal.jsx';
import Spinner from '../../components/Spinner.jsx';
import { formatPrice, formatDate, formatOrderNumber } from '../../utils/formatters.js';
import { toast } from 'sonner';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    ordersToday: 0,
    pendingOrders: 0,
    totalMenuItems: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchDashboardData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    try {
      // 1. Fetch Stats
      const [statsRes, ordersRes, menuRes] = await Promise.allSettled([
        getOrderStats(),
        getOrders({ limit: 10, sort: '-createdAt' }),
        getMenuItems(),
      ]);

      let rev = 0;
      let todayCount = 0;
      let pendingCount = 0;
      let menuCount = 0;

      if (statsRes.status === 'fulfilled') {
        const s = statsRes.value.data?.data || statsRes.value.data || {};
        rev = s.totalRevenue || s.revenue || 0;
        todayCount = s.todaysOrders || s.ordersToday || s.today || 0;
        pendingCount = s.pendingOrders || s.pending || 0;
        menuCount = s.totalMenuItems || s.menuItems || 0;
      }

      if (ordersRes.status === 'fulfilled') {
        const rawData = ordersRes.value.data?.data || ordersRes.value.data || {};
        // getAllOrders returns { orders: [...], pagination: {...} }
        const orderList = Array.isArray(rawData)
          ? rawData
          : Array.isArray(rawData.orders)
          ? rawData.orders
          : [];
        setRecentOrders(orderList);

        // Fallback calculations if stats endpoint didn't provide them
        if (statsRes.status !== 'fulfilled' || !statsRes.value.data) {
          rev = orderList.reduce((sum, ord) => sum + (ord.total || 0), 0);
          pendingCount = orderList.filter((ord) => ord.status === 'Pending').length;
          todayCount = orderList.length;
        }
      }

      if (menuRes.status === 'fulfilled') {
        menuCount = menuRes.value.length;
      }

      setStats({
        totalRevenue: rev,
        ordersToday: todayCount,
        pendingOrders: pendingCount,
        totalMenuItems: menuCount,
      });
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();

    // Auto refresh every 30 seconds
    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      fetchDashboardData(true);
    } catch (err) {
      toast.error('Failed to update order status');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header with Quick Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-espresso">
            Dashboard Overview
          </h1>
          <p className="text-xs text-latte mt-1">
            Real-time performance metrics and live order stream.
          </p>
        </div>

        <button
          onClick={() => fetchDashboardData(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-xl text-xs font-semibold text-espresso hover:bg-ivory transition-colors shadow-sm self-start sm:self-auto"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 text-terracotta ${
              refreshing ? 'animate-spin' : ''
            }`}
          />
          <span>{refreshing ? 'Refreshing...' : 'Refresh Feed'}</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={formatPrice(stats.totalRevenue)}
          accent={true}
          helperText="Gross sales across completed orders"
        />
        <StatCard
          icon={ShoppingBag}
          label="Orders Today"
          value={stats.ordersToday}
          helperText="Live customer transactions"
        />
        <StatCard
          icon={Clock}
          label="Pending Orders"
          value={stats.pendingOrders}
          helperText="Awaiting barista preparation"
        />
        <StatCard
          icon={UtensilsCrossed}
          label="Menu Items"
          value={stats.totalMenuItems}
          helperText="Active items in catalog"
        />
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold text-espresso">
              Recent Orders
            </h2>
            <p className="text-xs text-latte mt-0.5">
              Latest 10 orders received from tables &amp; takeaways.
            </p>
          </div>

          <Link
            to="/admin/orders"
            className="text-xs font-semibold text-terracotta hover:underline inline-flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <Spinner size="md" color="terracotta" />
            <p className="mt-3 text-xs text-latte">Loading orders stream...</p>
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="p-12 text-center text-latte">
            <p className="text-sm">No recent orders found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-ivory/60 border-b border-border text-[11px] font-semibold uppercase tracking-wider text-latte">
                  <th className="py-3.5 px-6">Order #</th>
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-6">Items</th>
                  <th className="py-3.5 px-6">Total</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Placed At</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-sm">
                {recentOrders.map((order) => {
                  const orderNum =
                    order.orderNumber || order._id?.slice(-6)?.toUpperCase();
                  const itemCount = Array.isArray(order.items)
                    ? order.items.reduce(
                        (sum, it) => sum + (it.quantity || 1),
                        0
                      )
                    : 1;

                  return (
                    <tr
                      key={order._id}
                      onClick={() => setSelectedOrder(order)}
                      className="hover:bg-ivory/40 transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-6 font-mono text-xs font-bold text-espresso">
                        #{formatOrderNumber(orderNum)}
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-semibold text-espresso">
                          {order.customerName || 'Guest'}
                        </p>
                        <p className="text-xs text-latte">
                          {order.orderType || 'Dine-in'}
                          {order.tableNumber && ` • Table ${order.tableNumber}`}
                        </p>
                      </td>
                      <td className="py-4 px-6 text-espresso text-xs font-medium">
                        {itemCount} {itemCount === 1 ? 'item' : 'items'}
                      </td>
                      <td className="py-4 px-6 font-bold text-espresso">
                        {formatPrice(order.total)}
                      </td>
                      <td className="py-4 px-6">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="py-4 px-6 text-xs text-latte">
                        {formatDate(order.createdAt)}
                      </td>
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
