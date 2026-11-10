import { body } from 'express-validator';
import { MENU_CATEGORIES } from '../models/MenuItem.js';
import { handleValidationErrors } from '../middleware/validate.js';

export const validateMenuItem = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Item name is required')
    .isLength({ max: 100 })
    .withMessage('Item name cannot exceed 100 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Item description is required')
    .isLength({ max: 500 })
    .withMessage('Item description cannot exceed 500 characters'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn(MENU_CATEGORIES)
    .withMessage(`Category must be one of: ${MENU_CATEGORIES.join(', ')}`),

  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ gt: 0 })
    .withMessage('Price must be a positive number greater than 0'),

  body('image')
    .trim()
    .notEmpty()
    .withMessage('Image URL is required')
    .isURL()
    .withMessage('Please provide a valid image URL'),

  body('isAvailable')
    .optional()
    .isBoolean()
    .withMessage('isAvailable must be a boolean value'),

  body('prepTimeMinutes')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Prep time must be a non-negative integer'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array of strings'),
];

export { handleValidationErrors };
