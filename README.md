# ☕ Brew & Bite — Cafe Menu & Order Management System

A production-grade, full-stack **MERN** (MongoDB, Express.js, React, Node.js) cafe ordering application built for the **Brew & Bite** specialty coffee brand. Features QR-based table ordering, real-time order management, an authenticated admin dashboard, and server-side price validation.

---

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| Frontend | *(Deploy to Vercel — see [Deployment](#-deployment))* |
| Backend API | *(Deploy to Render — see [Deployment](#-deployment))* |
| API Docs | `{BACKEND_URL}/api/docs` |

---

## ✨ Features

### Customer Experience
- 🍵 **Full menu browsing** with categories, search, sort, and availability filters
- 📱 **QR-code table ordering** — scan QR code → land on `/menu?table=T05` → welcome modal collects phone number
- 🛒 **Persistent shopping cart** via localStorage with real-time quantity management
- 💳 **Smooth checkout** — customer details, Dine-in/Takeaway, table number, barista notes
- ✅ **Order confirmation** with unique order reference (`BB-YYYYMMDD-XXXX`) and order summary receipt

### Admin Dashboard
- 🔐 **JWT-protected login** with bcrypt password hashing
- 📊 **Live operational metrics** — total revenue, orders today, pending orders, menu item count
- 🍽️ **Full Menu CRUD** — add/edit/delete items with image preview, category, price, availability toggle
- 📋 **Order lifecycle management** — view all orders, filter by status, update status (Pending → Confirmed → Preparing → Ready → Completed / Cancelled)
- 🔲 **QR Code Generator** — generate and download printable QR codes for each table (T01–T20+)

### Technical
- 🔒 **Server-side price validation** — backend ALWAYS recalculates order totals from the database; client-submitted prices are ignored
- 📸 **Historical price snapshots** — ordered items capture name & price at order time; editing menu items never affects past orders
- 📖 **Swagger OpenAPI documentation** at `/api/docs`
- 🛡️ **Rate limiting, Helmet, CORS, and input validation** throughout
- 🏥 **Health check endpoint** at `/api/health` for Render keep-alive pings

---

## 🏗️ Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite 5, Tailwind CSS 3, React Router DOM v6 |
| State Management | React Context API (Cart, Table, Auth) |
| HTTP Client | Axios with interceptors |
| UI Components | Lucide React icons, Sonner toasts, qrcode.react |
| Backend | Node.js 18, Express.js 4 |
| Database | MongoDB Atlas (Mongoose 8) |
| Authentication | JWT (jsonwebtoken) + bcryptjs |
| Validation | express-validator |
| Security | Helmet, CORS, express-rate-limit |
| API Documentation | Swagger UI Express + swagger-jsdoc (OpenAPI 3.0) |
| Dev Database | mongodb-memory-server (auto-fallback for local dev) |

---

## 📁 Folder Structure

```
digole/
├── backend/
│   ├── src/
│   │   ├── config/          # db.js (Atlas + memory fallback), swagger.js
│   │   ├── controllers/     # authController, menuController, orderController
│   │   ├── middleware/      # auth.js, errorHandler.js, rateLimiter.js, validate.js
│   │   ├── models/          # User.js, MenuItem.js, Order.js
│   │   ├── routes/          # authRoutes, menuRoutes, orderRoutes, healthRoutes
│   │   ├── services/        # orderService.js (price processing, stats)
│   │   ├── utils/           # seed.js, generateToken.js, apiResponse.js
│   │   ├── validators/      # authValidator, menuValidator, orderValidator
│   │   ├── app.js           # Express app setup
│   │   └── server.js        # Server entry point
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, CartDrawer, MenuCard, Modals, etc.
│   │   ├── context/         # CartContext, TableContext, AuthContext
│   │   ├── hooks/           # useCart, useTable, useAuth
│   │   ├── layouts/         # CustomerLayout, AdminLayout
│   │   ├── pages/           # HomePage, MenuPage, CheckoutPage, Confirmation
│   │   │   └── admin/       # Login, Dashboard, Menu, Orders, QR pages
│   │   ├── services/        # api.js, menuService, orderService, authService
│   │   └── utils/           # formatters.js, constants.js
│   ├── vercel.json          # SPA routing fallback
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml       # One-command local dev environment
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- MongoDB Atlas account *(or use the built-in in-memory fallback for local dev)*

---

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/brew-and-bite.git
cd brew-and-bite
```

#### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values (see Environment Variables section)
```

#### Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Edit VITE_API_URL if your backend runs on a different port
```

---

### 2. Backend Setup

```bash
cd backend
npm run dev
```

**Without MongoDB Atlas** (local dev): Leave `MONGODB_URI` as the placeholder. The backend automatically starts an in-memory MongoDB instance and seeds it with 25 menu items + an admin user. No database setup required.

**With MongoDB Atlas**: Replace `MONGODB_URI` in `.env` with your Atlas connection string, then run:
```bash
npm run seed    # Populates the database with sample data
npm run dev     # Start the development server
```

The backend starts at: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd frontend
npm run dev
```

The frontend starts at: `http://localhost:5173`

---

### 4. Docker (All-in-One)

Run the entire stack with a single command:

```bash
docker-compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| API Docs | http://localhost:5000/api/docs |
| MongoDB | mongodb://localhost:27017/brewandbite |

Stop all services:
```bash
docker-compose down
```

---

## 🔐 Admin Login

| Field | Value |
|-------|-------|
| URL | `http://localhost:5173/admin/login` |
| Email | `admin@brewandbite.com` |
| Password | `Admin@12345` |

> These credentials can be customized via `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables before seeding.

---

## 🗂️ Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/brewandbite
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@brewandbite.com
ADMIN_PASSWORD=Admin@12345
NODE_ENV=development
SEED_ON_START=false
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000
```

---

## 📐 MongoDB Atlas Setup

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free cluster.
2. Create a database user with read/write access.
3. Add your IP to the IP Access List (or use `0.0.0.0/0` for all IPs during development).
4. Click **Connect → Drivers** and copy the connection string.
5. Replace `MONGODB_URI` in `backend/.env` with the connection string.
6. Run `npm run seed` to populate the database.

---

## 📡 API Endpoints

### Interactive Docs
Swagger UI is available at `http://localhost:5000/api/docs`

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | ❌ | Admin login → returns JWT |
| GET | `/api/auth/me` | ✅ | Get authenticated admin info |

### Menu
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/menu` | ❌ | Get all items (search, category, sort filters) |
| GET | `/api/menu/:id` | ❌ | Get single item |
| POST | `/api/menu` | ✅ Admin | Create menu item |
| PUT | `/api/menu/:id` | ✅ Admin | Update menu item |
| DELETE | `/api/menu/:id` | ✅ Admin | Delete menu item |

### Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/orders` | ❌ | Place customer order (server recalculates totals) |
| GET | `/api/orders` | ✅ Admin | Get all orders (paginated, filterable) |
| GET | `/api/orders/stats` | ✅ Admin | Dashboard metrics |
| GET | `/api/orders/:id` | ❌ | Get order by ID |
| PATCH | `/api/orders/:id/status` | ✅ Admin | Update order status |

### Health
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | ❌ | Server health check (Render keep-alive) |

---

## 📱 QR Code Ordering Flow

1. Admin generates a table QR code at `/admin/qr` (e.g. for Table T05).
2. QR encodes the URL: `https://your-domain.com/menu?table=T05`.
3. Customer scans QR → redirected to menu page.
4. A welcome modal auto-opens showing the detected table number and asking for the customer's phone number.
5. Customer browses, adds items to cart, proceeds to checkout.
6. Table number and phone are pre-filled in checkout form.
7. Order is submitted and stored with the table number.

---

## 🌍 Deployment

### Frontend → Vercel

1. Push the `frontend/` folder to a GitHub repository.
2. Import the repository in [Vercel](https://vercel.com).
3. Set **Root Directory** to `frontend`.
4. Add environment variable: `VITE_API_URL=https://your-render-backend.onrender.com`
5. Deploy. The `vercel.json` already handles SPA routing.

### Backend → Render

1. Push the `backend/` folder to a GitHub repository.
2. Create a new **Web Service** on [Render](https://render.com).
3. Set **Root Directory** to `backend`.
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `node src/server.js`
6. Add all environment variables from `backend/.env.example`.
7. Deploy.

#### Render Keep-Alive
Free Render instances sleep after 15 minutes of inactivity. Ping `/api/health` every 10 minutes using:
- [UptimeRobot](https://uptimerobot.com) (free)
- [cron-job.org](https://cron-job.org) (free)
- Any other external HTTP monitoring service

---

## 📸 Screenshots

> *Screenshots will be added after deployment.*

| Page | Description |
|------|-------------|
| Home | Editorial hero section with featured menu items |
| Menu | Category filter, search, sort, and menu cards grid |
| Cart Drawer | Slide-in cart with quantity controls |
| Checkout | Two-column form with order summary |
| Order Confirmation | Receipt with unique order reference |
| Admin Dashboard | Real-time stats cards and recent orders |
| Admin Menu | CRUD management with modal form |
| Admin Orders | Status management with filter tabs |
| Admin QR | Table QR generator with download |

---

## 🧪 Testing Results

### Backend
- ✅ All 6 source modules pass `node --check` syntax validation
- ✅ Server starts and auto-seeds with in-memory MongoDB fallback
- ✅ `/api/health` returns 200 OK
- ✅ `/api/menu` returns seeded items
- ✅ `/api/auth/login` with correct credentials returns JWT
- ✅ `/api/orders` POST recalculates totals from DB (never trusts client prices)
- ✅ Protected routes return 401 without valid JWT
- ✅ Swagger UI accessible at `/api/docs`

### Frontend
- ✅ Vite production build completes with 0 errors (3.14s, 413KB bundle)
- ✅ All 50 source files pass React/JSX compilation
- ✅ Cart state persists across page navigation via localStorage
- ✅ TableContext detects `?table=XXX` URL parameter on mount
- ✅ ProtectedRoute redirects unauthenticated users to `/admin/login`
- ✅ AuthContext restores JWT session from localStorage on page refresh

---

## 🛠️ Development Commands

```bash
# Backend
npm run dev      # Start with nodemon hot-reload
npm run start    # Production start
npm run seed     # Seed database

# Frontend
npm run dev      # Start Vite dev server
npm run build    # Production build
npm run preview  # Preview production build locally
```

---

## 📝 License

MIT © Brew & Bite
