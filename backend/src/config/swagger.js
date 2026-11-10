import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Brew & Bite API',
      version: '1.0.0',
      description:
        'RESTful API documentation for Brew & Bite - Cafe Menu & Order Management System',
      contact: {
        name: 'Brew & Bite API Team',
        email: 'admin@brewandbite.com',
      },
    },
    servers: [
      {
        url: process.env.SERVER_URL || 'http://localhost:5000',
        description: 'Primary API Server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description:
            'Enter your Bearer token in the format: `Bearer <JWT_TOKEN>`',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '655e1a2f9b8c3d4e5f6a7b8c' },
            name: { type: 'string', example: 'Brew & Bite Admin' },
            email: { type: 'string', example: 'admin@brewandbite.com' },
            role: { type: 'string', example: 'admin' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        MenuItem: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '655e1a2f9b8c3d4e5f6a7b8d' },
            name: { type: 'string', example: 'Flat White' },
            description: {
              type: 'string',
              example: 'Smooth double espresso with velvety microfoam milk',
            },
            category: {
              type: 'string',
              enum: [
                'Coffee',
                'Tea',
                'Cold Beverages',
                'Desserts',
                'Snacks',
                'Breakfast',
              ],
              example: 'Coffee',
            },
            price: { type: 'number', example: 4.5 },
            image: {
              type: 'string',
              example:
                'https://images.unsplash.com/photo-1495474472589-7f7f3a6d7377?w=600&q=80',
            },
            isAvailable: { type: 'boolean', example: true },
            prepTimeMinutes: { type: 'number', example: 5 },
            tags: {
              type: 'array',
              items: { type: 'string' },
              example: ['Hot', 'Espresso', 'Popular'],
            },
          },
        },
        Order: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '655e1a2f9b8c3d4e5f6a7b8e' },
            orderNumber: { type: 'string', example: 'BB-20241115-0042' },
            customerName: { type: 'string', example: 'John Doe' },
            customerPhone: { type: 'string', example: '+1 555-0199' },
            customerEmail: { type: 'string', example: 'john@example.com' },
            orderType: {
              type: 'string',
              enum: ['Dine-in', 'Takeaway'],
              example: 'Dine-in',
            },
            tableNumber: { type: 'string', example: 'T-04' },
            notes: { type: 'string', example: 'Extra hot with oat milk' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  menuItem: { type: 'string' },
                  name: { type: 'string' },
                  price: { type: 'number' },
                  quantity: { type: 'integer' },
                  subtotal: { type: 'number' },
                },
              },
            },
            subtotal: { type: 'number', example: 9.0 },
            tax: { type: 'number', example: 0.45 },
            totalAmount: { type: 'number', example: 9.45 },
            status: {
              type: 'string',
              enum: [
                'Pending',
                'Confirmed',
                'Preparing',
                'Ready',
                'Completed',
                'Cancelled',
              ],
              example: 'Pending',
            },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
  apis: [path.join(__dirname, '../routes/*.js')],
};

export const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
