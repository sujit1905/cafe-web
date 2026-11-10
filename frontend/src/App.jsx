import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

// Context Providers
import { AuthProvider } from './context/AuthContext.jsx';
import { TableProvider } from './context/TableContext.jsx';
import { CartProvider } from './context/CartContext.jsx';

// Layouts
import CustomerLayout from './layouts/CustomerLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';

// Protected Route Guard
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Customer Pages
import HomePage from './pages/HomePage.jsx';
import MenuPage from './pages/MenuPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrderConfirmationPage from './pages/OrderConfirmationPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage.jsx';
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx';
import AdminMenuPage from './pages/admin/AdminMenuPage.jsx';
import AdminOrdersPage from './pages/admin/AdminOrdersPage.jsx';
import AdminQRPage from './pages/admin/AdminQRPage.jsx';

export default function App() {
  return (
    <AuthProvider>
      <TableProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              {/* Customer Facing Routes */}
              <Route element={<CustomerLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route
                  path="/order-confirmation/:orderId"
                  element={<OrderConfirmationPage />}
                />
              </Route>

              {/* Admin Authentication */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* Admin Protected Dashboard Routes */}
              <Route path="/admin" element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                  <Route
                    index
                    element={<Navigate to="/admin/dashboard" replace />}
                  />
                  <Route path="dashboard" element={<AdminDashboardPage />} />
                  <Route path="menu" element={<AdminMenuPage />} />
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="qr" element={<AdminQRPage />} />
                </Route>
              </Route>

              {/* 404 Catch-All */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>

            {/* Global Toast Notification System */}
            <Toaster
              position="top-right"
              richColors
              closeButton
              toastOptions={{
                duration: 3500,
                style: {
                  borderRadius: '1rem',
                  fontFamily: 'Inter, sans-serif',
                },
              }}
            />
          </BrowserRouter>
        </CartProvider>
      </TableProvider>
    </AuthProvider>
  );
}
