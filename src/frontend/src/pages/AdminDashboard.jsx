import React from 'react';
import { FaEye, FaShoppingCart, FaDollarSign, FaPenNib } from 'react-icons/fa';
import useProducts from '../hooks/useProducts';

export default function AdminDashboard() {
  const { data: products = [], isLoading } = useProducts();

  // Mock data for statistics
  const stats = [
    { label: 'Tổng Truy Cập', value: '12,485', icon: FaEye, color: 'bg-blue-100', iconColor: 'text-blue-600' },
    { label: 'Đơn Hàng', value: '328', icon: FaShoppingCart, color: 'bg-purple-100', iconColor: 'text-purple-600' },
    { label: 'Doanh Thu', value: '₫45.2M', icon: FaDollarSign, color: 'bg-green-100', iconColor: 'text-green-600' },
    { label: 'Bài Viết', value: '24', icon: FaPenNib, color: 'bg-orange-100', iconColor: 'text-orange-600' },
  ];

  // Mock top products (dùng data từ React Query)
  const topProducts = products.slice(0, 4).map((p, i) => ({
    ...p,
    views: [1250, 980, 750, 620][i] || 0,
    orders: [45, 32, 28, 18][i] || 0,
  }));

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Tổng Quan</h1>
        <p className="text-gray-600 mt-2">Chào mừng bạn quay lại, Admin! 👋</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon className={`text-xl ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Top Products Table */}
      <div className="bg-white rounded-lg shadow border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">Sản Phẩm Xem Nhiều Nhất</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Sản Phẩm</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Giá</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Lượt Xem</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Đơn Hàng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={product.imageUrl || product.image} alt={product.name} className="w-10 h-10 rounded object-cover" />
                      <span className="font-medium text-gray-800">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{product.price}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center justify-center min-w-[2rem] px-2 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                      {product.views}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center justify-center min-w-[2rem] px-2 h-8 bg-green-100 text-green-600 rounded-full text-sm font-semibold">
                      {product.orders}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-brand-purple to-purple-600 rounded-lg shadow p-6 text-white">
          <h3 className="text-lg font-bold mb-2">Tạo Sản Phẩm Mới</h3>
          <p className="text-purple-100 text-sm mb-4">Thêm sản phẩm mới vào kho</p>
          <button
            onClick={() => alert('Chức năng đang phát triển ở Giai đoạn 2')}
            className="w-full bg-white text-brand-purple font-semibold py-2 rounded-lg hover:bg-purple-50 transition"
          >
            Thêm Sản Phẩm
          </button>
        </div>
      </div>
    </div>
  );
}
