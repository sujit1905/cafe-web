import { Router } from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderStats,
  getOrderById,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { validateOrder, handleValidationErrors } from '../validators/orderValidator.js';
import { protect } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = Router();

/**
 * @openapi
 * /api/orders:
 *   post:
 *     summary: Place a new cafe order (authoritative DB pricing)
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerName
 *               - customerPhone
 *               - orderType
 *               - items
 *             properties:
 *               customerName:
 *                 type: string
 *                 example: Sarah Jenkins
 *               customerPhone:
 *                 type: string
 *                 example: "+1 555-987-6543"
 *               customerEmail:
 *                 type: string
 *                 example: sarah.j@example.com
 *               orderType:
 *                 type: string
 *                 enum: [Dine-in, Takeaway]
 *                 example: Dine-in
 *               tableNumber:
 *                 type: string
 *                 example: "Table 4"
 *               notes:
 *                 type: string
 *                 example: Extra hot latte, please
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - menuItemId
 *                     - quantity
 *                   properties:
 *                     menuItemId:
 *                       type: string
 *                       example: 655e1a2f9b8c3d4e5f6a7b8d
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Bad request or item unavailable
 *       422:
 *         description: Validation error
 */
router.post('/', apiLimiter, validateOrder, handleValidationErrors, createOrder);

/**
 * @openapi
 * /api/orders:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, Confirmed, Preparing, Ready, Completed, Cancelled]
 *       - in: query
 *         name: orderType
 *         schema:
 *           type: string
 *           enum: [Dine-in, Takeaway]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by orderNumber, customerName, or customerPhone
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Paginated orders list
 *       401:
 *         description: Unauthorized
 */
router.get('/', protect, getAllOrders);

/**
 * @openapi
 * /api/orders/stats:
 *   get:
 *     summary: Get dashboard statistics for orders and revenue
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Operational statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalOrders:
 *                   type: number
 *                 todaysOrders:
 *                   type: number
 *                 pendingOrders:
 *                   type: number
 *                 totalRevenue:
 *                   type: number
 *                 todaysRevenue:
 *                   type: number
 *                 totalMenuItems:
 *                   type: number
 *       401:
 *         description: Unauthorized
 */
router.get('/stats', protect, getOrderStats);

/**
 * @openapi
 * /api/orders/{id}:
 *   get:
 *     summary: Get single order by MongoDB ID or orderNumber
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId or Order Number (e.g. BB-20241115-0042)
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 */
router.get('/:id', getOrderById);

/**
 * @openapi
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Update order status (Admin only)
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Confirmed, Preparing, Ready, Completed, Cancelled]
 *                 example: Confirmed
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid status transition or payload
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
router.patch('/:id/status', protect, updateOrderStatus);

export default router;
