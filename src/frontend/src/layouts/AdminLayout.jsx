import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { FaHome, FaBox, FaPenNib, FaCog, FaBars, FaTimes, FaBell, FaUserCircle } from 'react-icons/fa';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { label: 'Tổng quan', icon: FaHome, path: '/admin' },
    { label: 'Sản phẩm', icon: FaBox, path: '/admin/products' },
    { label: 'Bài viết', icon: FaPenNib, path: '/admin/posts' },
    { label: 'Cài đặt', icon: FaCog, path: '/admin/settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 shadow-sm transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          {sidebarOpen && <h1 className="text-lg font-bold text-brand-purple">Món Nhỏ Admin</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            {sidebarOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-brand-light transition text-gray-600 hover:text-brand-purple"
              title={!sidebarOpen ? item.label : ''}
            >
              <item.icon size={20} />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Footer Menu */}
        <div className="px-3 py-6 border-t border-gray-200 space-y-2">
          <button
            onClick={() => window.location.href = '/'}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-brand-light hover:text-brand-purple transition text-sm"
          >
            <span className="text-xl">←</span>
            {sidebarOpen && <span>Quay lại trang chủ</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className="h-16 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-6">
          <h2 className="text-xl font-semibold text-gray-800">Admin Dashboard</h2>
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
              <FaBell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
              <FaUserCircle size={32} className="text-brand-purple" />
              <div className="text-sm">
                <p className="font-semibold text-gray-800">Admin</p>
                <p className="text-gray-500">Quản trị viên</p>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
