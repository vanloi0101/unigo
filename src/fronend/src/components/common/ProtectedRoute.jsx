import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

// Bảo vệ Route Admin
export default function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  // Nếu người dùng chưa đăng nhập (lấy từ Zustand / localStorage), chuyển hướng sang trang Login 
  // và lưu route người dùng đang cố gắng vào qua state `from` để chuyển lại sau đăng nhập.
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Nếu đã đăng nhập, render các Components Admin con bên trong (qua <Outlet />)
  return <Outlet />;
}
