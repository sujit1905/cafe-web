import Order, { ORDER_STATUSES } from '../models/Order.js';
import {
  processOrderItems,
  isValidTransition,
  getAggregatedStats,
  ALLOWED_STATUS_TRANSITIONS,
} from '../services/orderService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * @desc    Create a new customer order with authoritative database pricing
 * @route   POST /api/orders
 * @access  Public
 */
export const createOrder = async (req, res, next) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      orderType,
      tableNumber,
      notes,
      items,
    } = req.body;

    // Validate and process items with database prices (never client prices)
    const { builtItems, subtotal, tax, totalAmount } = await processOrderItems(items);

    // Create the order document
    const newOrder = await Order.create({
      customerName,
      customerPhone,
      customerEmail: customerEmail || '',
      orderType,
      tableNumber: orderType === 'Dine-in' ? tableNumber : undefined,
      notes: notes || '',
      items: builtItems,
      subtotal,
      tax,
      totalAmount,
      status: 'Pending',
    });

    return successResponse(
      res,
      newOrder,
      'Order placed successfully',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all orders with pagination, status filter, and search
 * @route   GET /api/orders
 * @access  Private/Admin
 */
export const getAllOrders = async (req, res, next) => {
  try {
    const {
      status,
      search,
      page = 1,
      limit = 20,
      orderType,
    } = req.query;

    const query = {};

    // Filter by order status
    if (status && status !== 'All') {
      if (ORDER_STATUSES.includes(status)) {
        query.status = status;
      }
    }

    // Filter by order type
    if (orderType && ['Dine-in', 'Takeaway'].includes(orderType)) {
      query.orderType = orderType;
    }

    // Search across orderNumber, customerName, or customerPhone
    if (search && search.trim() !== '') {
      const escaped = search.trim().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      query.$or = [
        { orderNumber: { $regex: escaped, $options: 'i' } },
        { customerName: { $regex: escaped, $options: 'i' } },
        { customerPhone: { $regex: escaped, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [orders, totalOrders] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Order.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalOrders / limitNum);

    return successResponse(
      res,
      {
        orders,
        pagination: {
          total: totalOrders,
          totalPages,
          currentPage: pageNum,
          limit: limitNum,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        },
      },
      'Orders retrieved successfully',
      200
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get operational order statistics for dashboard
 * @route   GET /api/orders/stats
 * @access  Private/Admin
 */
export const getOrderStats = async (req, res, next) => {
  try {
    const stats = await getAggregatedStats();
    return successResponse(
      res,
      stats,
      'Order statistics calculated successfully',
      200
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get order by ID or orderNumber
 * @route   GET /api/orders/:id
 * @access  Public (or authenticated)
 */
export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let order;
    // Check if queried by MongoDB ObjectId or human-readable orderNumber
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id);
    } else {
      order = await Order.findOne({ orderNumber: id });
    }

    if (!order) {
      return errorResponse(res, 'Order not found', 404);
    }

    return successResponse(res, order, 'Order retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update order status with validation transition check
 * @route   PATCH /api/orders/:id/status
 * @access  Private/Admin
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !ORDER_STATUSES.includes(status)) {
      return errorResponse(
        res,
        `Invalid status. Status must be one of: ${ORDER_STATUSES.join(', ')}`,
        400
      );
    }

    const order = await Order.findById(id);
    if (!order) {
      return errorResponse(res, 'Order not found', 404);
    }

    // Validate status transition
    if (!isValidTransition(order.status, status)) {
      const allowedNext = ALLOWED_STATUS_TRANSITIONS[order.status] || [];
      return errorResponse(
        res,
        `Cannot transition order status from '${order.status}' to '${status}'. Allowed transitions: [${allowedNext.join(', ')}]`,
        400
      );
    }

    order.status = status;
    await order.save();

    return successResponse(
      res,
      order,
      `Order status updated to ${status}`,
      200
    );
  } catch (error) {
    next(error);
  }
};

export default {
  createOrder,
  getAllOrders,
  getOrderStats,
  getOrderById,
  updateOrderStatus,
};
