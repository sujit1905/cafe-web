import { Router } from 'express';
import {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../controllers/menuController.js';
import { validateMenuItem, handleValidationErrors } from '../validators/menuValidator.js';
import { protect } from '../middleware/auth.js';

const router = Router();

/**
 * @openapi
 * /api/menu:
 *   get:
 *     summary: Retrieve list of menu items with optional filtering and search
 *     tags: [Menu]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, description, or tags
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [Coffee, Tea, Cold Beverages, Desserts, Snacks, Breakfast]
 *         description: Filter items by category
 *       - in: query
 *         name: isAvailable
 *         schema:
 *           type: boolean
 *         description: Filter items by availability
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price_asc, price_desc, name_asc, name_desc, newest]
 *         description: Sort ordering
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
 *         description: A paginated list of menu items
 */
router.get('/', getAllMenuItems);

/**
 * @openapi
 * /api/menu/{id}:
 *   get:
 *     summary: Get a single menu item by ID
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the menu item
 *     responses:
 *       200:
 *         description: Menu item details
 *       404:
 *         description: Menu item not found
 */
router.get('/:id', getMenuItemById);

/**
 * @openapi
 * /api/menu:
 *   post:
 *     summary: Create a new menu item
 *     tags: [Menu]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - category
 *               - price
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *                 example: Hazelnut Cappuccino
 *               description:
 *                 type: string
 *                 example: Fresh espresso with roasted hazelnut syrup and thick foam
 *               category:
 *                 type: string
 *                 example: Coffee
 *               price:
 *                 type: number
 *                 example: 5.25
 *               image:
 *                 type: string
 *                 example: https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80
 *               isAvailable:
 *                 type: boolean
 *                 default: true
 *               prepTimeMinutes:
 *                 type: number
 *                 default: 5
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Nutty", "Hot", "Signature"]
 *     responses:
 *       201:
 *         description: Menu item created successfully
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation error
 */
router.post('/', protect, validateMenuItem, handleValidationErrors, createMenuItem);

/**
 * @openapi
 * /api/menu/{id}:
 *   put:
 *     summary: Update an existing menu item by ID
 *     tags: [Menu]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the menu item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MenuItem'
 *     responses:
 *       200:
 *         description: Menu item updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Menu item not found
 *       422:
 *         description: Validation error
 */
router.put('/:id', protect, validateMenuItem, handleValidationErrors, updateMenuItem);

/**
 * @openapi
 * /api/menu/{id}:
 *   delete:
 *     summary: Delete a menu item by ID
 *     tags: [Menu]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the menu item
 *     responses:
 *       200:
 *         description: Menu item deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Menu item not found
 */
router.delete('/:id', protect, deleteMenuItem);

export default router;
