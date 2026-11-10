import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ClipboardList,
  QrCode,
  LogOut,
  Menu as MenuIcon,
  X,
  Coffee,
  Store,
  User,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';

export default function AdminLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Menu Items', path: '/admin/menu', icon: UtensilsCrossed },
    { name: 'Live Orders', path: '/admin/orders', icon: ClipboardList },
    { name: 'QR Codes', path: '/admin/qr', icon: QrCode },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Get active page title
  const currentNav = navItems.find((item) =>
    location.pathname.startsWith(item.path)
  );
  const pageTitle = currentNav ? currentNav.name : 'Admin Portal';

  return (
    <div className="min-h-screen bg-ivory flex">
      {/* Desktop Sidebar (fixed left) */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-espresso text-ivory border-r border-espresso-light flex-shrink-0">
        {/* Brand */}
        <div className="h-20 flex items-center px-6 border-b border-espresso-light gap-3">
          <div className="w-10 h-10 rounded-xl bg-terracotta flex items-center justify-center text-white shadow-sm">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-lg font-bold tracking-tight text-white leading-tight">
              Brew &amp; Bite
            </h1>
            <span className="text-[10px] tracking-wider uppercase text-ivory/60 font-semibold">
              Management Portal
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-terracotta text-white font-semibold shadow-sm'
                      : 'text-ivory/70 hover:text-white hover:bg-espresso-light'
                  }`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}

          <div className="pt-4 mt-4 border-t border-espresso-light">
            <Link
              to="/"
              target="_blank"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-ivory/60 hover:text-white hover:bg-espresso-light transition-colors"
            >
              <Store className="w-4 h-4 flex-shrink-0" />
              <span>Customer Storefront ↗</span>
            </Link>
          </div>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-espresso-light bg-black/10">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-9 h-9 rounded-full bg-terracotta/20 border border-terracotta/40 flex items-center justify-center text-terracotta">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {user?.name || user?.email || 'Administrator'}
              </p>
              <p className="text-[10px] text-ivory/60 uppercase tracking-wider">
                {user?.role || 'Staff'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-300 hover:text-rose-100 hover:bg-rose-900/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-espresso/60 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />

          <div className="relative w-64 max-w-[80vw] bg-espresso text-ivory flex flex-col z-10 shadow-2xl">
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-5 border-b border-espresso-light">
              <div className="flex items-center gap-2">
                <Coffee className="w-5 h-5 text-terracotta" />
                <span className="font-serif font-bold text-white">Brew &amp; Bite</span>
              </div>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded-lg text-ivory/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-terracotta text-white font-semibold shadow-sm'
                          : 'text-ivory/70 hover:text-white hover:bg-espresso-light'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}

              <div className="pt-4 mt-4 border-t border-espresso-light">
                <Link
                  to="/"
                  target="_blank"
                  className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-ivory/60 hover:text-white"
                >
                  <Store className="w-4 h-4 flex-shrink-0" />
                  <span>Customer Storefront ↗</span>
                </Link>
              </div>
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-espresso-light">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-300 hover:text-rose-100 hover:bg-rose-900/30 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 lg:h-20 bg-white/80 backdrop-blur-md border-b border-border px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-espresso hover:bg-ivory-dark"
              aria-label="Open navigation sidebar"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-espresso">
              {pageTitle}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-latte bg-ivory px-3 py-1.5 rounded-full border border-border">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Portal</span>
            </div>

            <div className="text-right">
              <span className="text-xs font-semibold text-espresso block">
                {user?.name || user?.email?.split('@')[0] || 'Staff User'}
              </span>
              <span className="text-[10px] text-latte block">Administrator</span>
            </div>
          </div>
        </header>

        {/* Page Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
