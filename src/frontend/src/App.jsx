import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';

// System Components
import OfflineBanner from './components/common/OfflineBanner';
import ErrorBoundary from './components/common/ErrorBoundary';

// Layouts (small — load eagerly)
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Cart Sync Modal
import CartSyncModal from './components/cart/CartSyncModal';

// ── Lazy-loaded pages (code splitting) ──────────────────────
// Public pages
const Home          = lazy(() => import('./pages/Home'));
const Products      = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const CartPage      = lazy(() => import('./pages/CartPage'));
const BlogListPage  = lazy(() => import('./pages/BlogListPage'));
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage'));
const HelpPage      = lazy(() => import('./pages/HelpPage'));
const Login         = lazy(() => import('./pages/Login'));
const Register      = lazy(() => import('./pages/Register'));
const TestProducts  = lazy(() => import('./pages/TestProducts'));

// Admin pages (heaviest — definitely lazy)
const AdminDashboard  = lazy(() => import('./pages/AdminDashboard'));
const AdminProducts   = lazy(() => import('./pages/AdminProducts'));
const AdminCategories = lazy(() => import('./pages/AdminCategories'));
const AdminBanner     = lazy(() => import('./pages/AdminBanner'));
const AdminPosts      = lazy(() => import('./pages/AdminPosts'));
const AdminSettings   = lazy(() => import('./pages/AdminSettings'));

// ── Page loading fallback ───────────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" aria-live="polite" aria-label="Đang tải trang...">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-brand-purple border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500 font-medium">Đang tải...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <Router>
        <Toaster position="top-center" />
        <OfflineBanner />
        <CartSyncModal />
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={
              <ErrorBoundary><Suspense fallback={<PageLoader />}><Home /></Suspense></ErrorBoundary>
            } />
            <Route path="/products" element={
              <ErrorBoundary><Suspense fallback={<PageLoader />}><Products /></Suspense></ErrorBoundary>
            } />
            <Route path="/products/:id" element={
              <ErrorBoundary><Suspense fallback={<PageLoader />}><ProductDetail /></Suspense></ErrorBoundary>
            } />
            <Route path="/cart" element={
              <ErrorBoundary><Suspense fallback={<PageLoader />}><CartPage /></Suspense></ErrorBoundary>
            } />
            <Route path="/tin-tuc" element={
              <ErrorBoundary><Suspense fallback={<PageLoader />}><BlogListPage /></Suspense></ErrorBoundary>
            } />
            <Route path="/tin-tuc/danh-muc/:slug" element={
              <ErrorBoundary><Suspense fallback={<PageLoader />}><BlogListPage /></Suspense></ErrorBoundary>
            } />
            <Route path="/tin-tuc/:slug" element={
              <ErrorBoundary><Suspense fallback={<PageLoader />}><BlogDetailPage /></Suspense></ErrorBoundary>
            } />
            <Route path="/help" element={
              <ErrorBoundary><Suspense fallback={<PageLoader />}><HelpPage /></Suspense></ErrorBoundary>
            } />
          </Route>

          {/* Auth Pages */}
          <Route path="/login" element={
            <Suspense fallback={<PageLoader />}><Login /></Suspense>
          } />
          <Route path="/register" element={
            <Suspense fallback={<PageLoader />}><Register /></Suspense>
          } />

          {/* Dev test page */}
          <Route path="/test-products" element={
            <Suspense fallback={<PageLoader />}><TestProducts /></Suspense>
          } />

          {/* Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={
                <ErrorBoundary><Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense></ErrorBoundary>
              } />
              <Route path="/admin/categories" element={
                <ErrorBoundary><Suspense fallback={<PageLoader />}><AdminCategories /></Suspense></ErrorBoundary>
              } />
              <Route path="/admin/products" element={
                <ErrorBoundary><Suspense fallback={<PageLoader />}><AdminProducts /></Suspense></ErrorBoundary>
              } />
              <Route path="/admin/banner" element={
                <ErrorBoundary><Suspense fallback={<PageLoader />}><AdminBanner /></Suspense></ErrorBoundary>
              } />
              <Route path="/admin/posts" element={
                <ErrorBoundary><Suspense fallback={<PageLoader />}><AdminPosts /></Suspense></ErrorBoundary>
              } />
              <Route path="/admin/settings" element={
                <ErrorBoundary><Suspense fallback={<PageLoader />}><AdminSettings /></Suspense></ErrorBoundary>
              } />
            </Route>
          </Route>
        </Routes>
      </Router>
    </HelmetProvider>
  );
}
