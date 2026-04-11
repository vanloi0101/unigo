import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './index.css';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import Login from './pages/Login'; // <--- Thêm Login Page
import CartPage from './pages/CartPage'; // <--- Thêm Cart Page
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminPosts from './pages/AdminPosts';
import AdminSettings from './pages/AdminSettings';
import ProtectedRoute from './components/common/ProtectedRoute'; // <--- Thêm Protected Route

export default function App() {
  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<CartPage />} />
        </Route>
        
        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Admin Routes (Đã được bảo vệ) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/posts" element={<AdminPosts />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
