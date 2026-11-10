# Brew & Bite – Cafe Menu & Order Management Backend

Production-grade RESTful API backend for **Brew & Bite**, an artisan cafe menu and live order management system. Built with Node.js, Express.js, and MongoDB Atlas.

---

## 🚀 Features

- **Menu Management**: Categorized cafe menu (Coffee, Tea, Cold Beverages, Desserts, Snacks, Breakfast) with search, filtering, price sorting, and pagination.
- **Authoritative Order Processing**: Client prices are never trusted — item prices are dynamically verified and calculated directly against MongoDB snapshots with automated 5% tax.
- **Order Lifecycle & Transitions**: State machine enforcing allowed transitions (`Pending` ➔ `Confirmed` ➔ `Preparing` ➔ `Ready` ➔ `Completed` / `Cancelled`).
- **Dashboard & Analytics**: Operational metrics (`totalOrders`, `todaysOrders`, `totalRevenue`, `todaysRevenue`, `pendingOrders`).
- **Authentication & Security**: JWT-based authentication for administrative actions, bcrypt password hashing (salt 12), Helmet security headers, CORS protection, and rate limiting.
- **OpenAPI 3.0 / Swagger**: Interactive API explorer at `/api/docs`.

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js             # Mongoose MongoDB connection
│   │   └── swagger.js        # Swagger / OpenAPI 3.0 configuration
│   ├── controllers/
│   │   ├── authController.js  # Admin login and profile
│   │   ├── menuController.js  # Menu CRUD and queries
│   │   └── orderController.js # Order placement, tracking, status updates
│   ├── middleware/
│   │   ├── auth.js           # JWT verification and route guard
│   │   ├── errorHandler.js   # Centralized error handler
│   │   ├── rateLimiter.js    # Express rate limiters
│   │   └── validate.js       # express-validator error interceptor
│   ├── models/
│   │   ├── MenuItem.js       # Menu item schema and search index
│   │   ├── Order.js          # Order schema with snapshot items
│   │   └── User.js           # Admin user schema with bcrypt hook
│   ├── routes/
│   │   ├── authRoutes.js     # /api/auth
│   │   ├── healthRoutes.js   # /api/health
│   │   ├── menuRoutes.js     # /api/menu
│   │   └── orderRoutes.js    # /api/orders
│   ├── services/
│   │   └── orderService.js   # Pricing logic and stats aggregation
│   ├── utils/
│   │   ├── apiResponse.js    # Uniform JSON response helpers
│   │   ├── generateToken.js  # JWT signing helper
│   │   └── seed.js           # Database seeder with 25 items & admin
│   ├── validators/
│   │   ├── authValidator.js
│   │   ├── menuValidator.js
│   │   └── orderValidator.js
│   ├── app.js                # Express app setup
│   └── server.js             # Application entrypoint
├── .dockerignore
├── .env.example
├── .gitignore
├── Dockerfile
├── package.json
└── README.md
```

---

## 🛠️ Environment Variables

Create a `.env` file in `backend/` based on `.env.example`:

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Port for the Express server | `5000` |
| `MONGODB_URI` | MongoDB Atlas or local connection string | *Required* |
| `JWT_SECRET` | Secret key for signing JWT tokens | *Required* |
| `CLIENT_URL` | Allowed frontend origin for CORS | `http://localhost:5173` |
| `ADMIN_EMAIL` | Default administrator email | `admin@brewandbite.com` |
| `ADMIN_PASSWORD` | Default administrator password | `Admin@12345` |
| `NODE_ENV` | Environment (`development` / `production`) | `development` |
| `SEED_ON_START` | Seed database automatically on startup (`true` / `false`) | `false` |

---

## 💻 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your MongoDB Atlas URI and JWT Secret
```

### 3. Seed Database
Seeds 25 realistic cafe items and creates the default admin user:
```bash
npm run seed
```

**Default Admin Credentials:**
- Email: `admin@brewandbite.com`
- Password: `Admin@12345`

### 4. Run Development Server
```bash
npm run dev
```

### 5. Production Start
```bash
npm start
```

---

## 📖 API Endpoints

Interactive Swagger UI documentation is available at `http://localhost:5000/api/docs`.

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Authenticate admin & receive JWT |
| `GET` | `/api/auth/me` | Admin | Retrieve current admin profile |

### Menu (`/api/menu`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/menu` | Public | List menu items (search, category, sort, page) |
| `GET` | `/api/menu/:id` | Public | Retrieve single menu item by ID |
| `POST` | `/api/menu` | Admin | Create a new menu item |
| `PUT` | `/api/menu/:id` | Admin | Update an existing menu item |
| `DELETE` | `/api/menu/:id` | Admin | Remove a menu item |

### Orders (`/api/orders`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Public | Place order (prices calculated server-side) |
| `GET` | `/api/orders` | Admin | List orders (filters: status, type, search) |
| `GET` | `/api/orders/stats` | Admin | Get metrics (revenue, order counts, pending) |
| `GET` | `/api/orders/:id` | Public / Admin | Get order details by ID or order number |
| `PATCH` | `/api/orders/:id/status`| Admin | Update order status (`Pending` ➔ `Confirmed`...) |

### System Health (`/api/health`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | System uptime & MongoDB connection status |

---

## 🐳 Docker Deployment

To build and run using Docker:

```bash
docker build -t brew-and-bite-backend .
docker run -p 5000:5000 --env-file .env brew-and-bite-backend
```
