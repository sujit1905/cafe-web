import MenuItem from '../models/MenuItem.js';
import Order, { ORDER_STATUSES } from '../models/Order.js';

/**
 * Valid status transitions mapping
 */
export const ALLOWED_STATUS_TRANSITIONS = {
  Pending: ['Confirmed', 'Cancelled'],
  Confirmed: ['Preparing', 'Cancelled'],
  Preparing: ['Ready', 'Cancelled'],
  Ready: ['Completed', 'Cancelled'],
  Completed: [],
  Cancelled: [],
};

/**
 * Validates order items, ensures availability, snapshots names/prices from DB,
 * and calculates accurate financials.
 *
 * @param {Array<{menuItemId: string, quantity: number}>} items
 * @returns {Promise<{builtItems: Array, subtotal: number, tax: number, totalAmount: number}>}
 */
export const processOrderItems = async (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    const error = new Error('Order must contain at least one item');
    error.statusCode = 400;
    throw error;
  }

  // Extract unique item IDs
  const itemIds = [...new Set(items.map((i) => i.menuItemId))];

  // Fetch items from DB
  const dbMenuItems = await MenuItem.find({ _id: { $in: itemIds } });
  const dbMenuMap = new Map(dbMenuItems.map((item) => [item._id.toString(), item]));

  const builtItems = [];
  let subtotal = 0;

  for (const item of items) {
    const dbItem = dbMenuMap.get(item.menuItemId.toString());

    if (!dbItem) {
      const error = new Error(`Menu item with ID ${item.menuItemId} does not exist`);
      error.statusCode = 404;
      throw error;
    }

    if (!dbItem.isAvailable) {
      const error = new Error(`Menu item "${dbItem.name}" is currently unavailable`);
      error.statusCode = 400;
      throw error;
    }

    const quantity = parseInt(item.quantity, 10);
    if (isNaN(quantity) || quantity < 1) {
      const error = new Error(`Quantity for "${dbItem.name}" must be at least 1`);
      error.statusCode = 400;
      throw error;
    }

    const itemSubtotal = parseFloat((dbItem.price * quantity).toFixed(2));
    subtotal += itemSubtotal;

    builtItems.push({
      menuItem: dbItem._id,
      name: dbItem.name,
      price: dbItem.price,
      quantity,
      subtotal: itemSubtotal,
    });
  }

  subtotal = parseFloat(subtotal.toFixed(2));
  // 5% Cafe Tax
  const tax = parseFloat((subtotal * 0.05).toFixed(2));
  const totalAmount = parseFloat((subtotal + tax).toFixed(2));

  return {
    builtItems,
    subtotal,
    tax,
    totalAmount,
  };
};

/**
 * Checks if a status transition is valid
 * @param {string} currentStatus
 * @param {string} newStatus
 * @returns {boolean}
 */
export const isValidTransition = (currentStatus, newStatus) => {
  if (!ORDER_STATUSES.includes(newStatus)) {
    return false;
  }
  if (currentStatus === newStatus) {
    return true;
  }
  const allowed = ALLOWED_STATUS_TRANSITIONS[currentStatus];
  return Array.isArray(allowed) && allowed.includes(newStatus);
};

/**
 * Calculate dashboard and operations statistics
 */
export const getAggregatedStats = async () => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [
    totalOrders,
    todaysOrders,
    pendingOrders,
    revenueData,
    todaysRevenueData,
    totalMenuItems,
  ] = await Promise.all([
    // Total order count
    Order.countDocuments(),

    // Today's order count
    Order.countDocuments({ createdAt: { $gte: startOfToday } }),

    // Currently pending orders
    Order.countDocuments({ status: 'Pending' }),

    // Total revenue from all non-cancelled orders
    Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]),

    // Today's revenue from non-cancelled orders
    Order.aggregate([
      {
        $match: {
          status: { $ne: 'Cancelled' },
          createdAt: { $gte: startOfToday },
        },
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]),

    // Total active menu items
    MenuItem.countDocuments(),
  ]);

  const totalRevenue = revenueData.length > 0 ? parseFloat(revenueData[0].total.toFixed(2)) : 0;
  const todaysRevenue =
    todaysRevenueData.length > 0 ? parseFloat(todaysRevenueData[0].total.toFixed(2)) : 0;

  return {
    totalOrders,
    todaysOrders,
    pendingOrders,
    totalRevenue,
    todaysRevenue,
    totalMenuItems,
  };
};

export default {
  ALLOWED_STATUS_TRANSITIONS,
  processOrderItems,
  isValidTransition,
  getAggregatedStats,
};
