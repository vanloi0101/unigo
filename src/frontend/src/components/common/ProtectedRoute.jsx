import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

// Bảo vệ Route Admin - chỉ cho phép user có role ADMIN
export default function ProtectedRoute({ requireAdmin = true }) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // Nếu người dùng chưa đăng nhập, chuyển hướng sang trang Login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Kiểm tra quyền ADMIN nếu route yêu cầu
  if (requireAdmin && user?.role !== 'ADMIN') {
    // User đã đăng nhập nhưng không phải ADMIN -> về trang chủ
    return <Navigate to="/" replace />;
  }

  // Đã đăng nhập và có quyền phù hợp, render các Components con
  return <Outlet />;
}
