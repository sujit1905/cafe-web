import { body } from 'express-validator';
import { ORDER_TYPES } from '../models/Order.js';
import { handleValidationErrors } from '../middleware/validate.js';

export const validateOrder = [
  body('customerName')
    .trim()
    .notEmpty()
    .withMessage('Customer name is required')
    .isLength({ max: 100 })
    .withMessage('Customer name cannot exceed 100 characters'),

  body('customerPhone')
    .trim()
    .notEmpty()
    .withMessage('Customer phone is required')
    .matches(/^[+]?[0-9\s\-()]{7,15}$/)
    .withMessage('Customer phone must be a valid phone number (7-15 digits, optional +, spaces, dashes, or parentheses)'),

  body('customerEmail')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('orderType')
    .trim()
    .notEmpty()
    .withMessage('Order type is required')
    .isIn(ORDER_TYPES)
    .withMessage(`Order type must be one of: ${ORDER_TYPES.join(', ')}`),

  body('tableNumber')
    .custom((value, { req }) => {
      if (req.body.orderType === 'Dine-in') {
        if (!value || typeof value !== 'string' || value.trim().length === 0) {
          throw new Error('Table number is required for Dine-in orders');
        }
      }
      return true;
    }),

  body('items')
    .isArray({ min: 1 })
    .withMessage('Order items must be a non-empty array'),

  body('items.*.menuItemId')
    .notEmpty()
    .withMessage('Each item must contain a menuItemId')
    .isMongoId()
    .withMessage('Invalid menuItemId format (must be a valid MongoDB ObjectId)'),

  body('items.*.quantity')
    .notEmpty()
    .withMessage('Item quantity is required')
    .isInt({ min: 1 })
    .withMessage('Quantity must be an integer greater than or equal to 1'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),
];

export { handleValidationErrors };
