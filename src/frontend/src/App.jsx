import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import Login from './pages/Login'; // <--- Thêm Login Page
import Register from './pages/Register'; // <--- Thêm Register Page
import CartPage from './pages/CartPage'; // <--- Thêm Cart Page
import BlogListPage from './pages/BlogListPage'; // <--- Blog Module
import BlogDetailPage from './pages/BlogDetailPage'; // <--- Blog Module
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminPosts from './pages/AdminPosts';
import AdminSettings from './pages/AdminSettings';
import AdminBanner from './pages/AdminBanner'; // <--- Thêm Banner Management
import HelpPage from './pages/HelpPage'; // <--- Help Page
import ProtectedRoute from './components/common/ProtectedRoute'; // <--- Thêm Protected Route
import TestProducts from './pages/TestProducts';

// Cart Sync Modal
import CartSyncModal from './components/cart/CartSyncModal';

export default function App() {
  return (
    <HelmetProvider>
      <Router>
        <Toaster position="top-center" />
        {/* Cart Sync Modal - shows when user logs in with guest cart items */}
        <CartSyncModal />
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<CartPage />} />
            {/* Blog Routes */}
            <Route path="/tin-tuc" element={<BlogListPage />} />
            <Route path="/tin-tuc/danh-muc/:slug" element={<BlogListPage />} />
            <Route path="/tin-tuc/:slug" element={<BlogDetailPage />} />
            {/* Help Page */}
            <Route path="/help" element={<HelpPage />} />
          </Route>
          
          {/* Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Test page — kiểm tra API trực tiếp */}
          <Route path="/test-products" element={<TestProducts />} />

          {/* Admin Routes (Đã được bảo vệ) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/banner" element={<AdminBanner />} />
              <Route path="/admin/posts" element={<AdminPosts />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </HelmetProvider>
  );
}
