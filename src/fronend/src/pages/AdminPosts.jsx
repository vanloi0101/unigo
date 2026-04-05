import React, { useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

export default function AdminPosts() {
  const [posts] = useState([
    {
      id: 1,
      title: 'Hướng Dẫn Chọn Vòng Tay Phù Hợp Với Cổ Tay GenZ',
      author: 'Admin',
      category: 'Hướng Dẫn',
      views: 324,
      publishedAt: '2024-03-20',
      status: 'Đã Công Bố',
    },
    {
      id: 2,
      title: '5 Xu Hướng Vòng Tay Tài Chính Năm 2024',
      author: 'Admin',
      category: 'Xu Hướng',
      views: 512,
      publishedAt: '2024-03-18',
      status: 'Đã Công Bố',
    },
    {
      id: 3,
      title: 'Chăm Sóc Vòng Tay Handmade Để Bền Lâu',
      author: 'Admin',
      category: 'Chăm Sóc',
      views: 289,
      publishedAt: '2024-03-15',
      status: 'Đã Công Bố',
    },
    {
      id: 4,
      title: 'Câu Chuyện Về Những Vòng Tay Anh Em Thân Thiết',
      author: 'Admin',
      category: 'Câu Chuyện',
      views: 156,
      publishedAt: '2024-03-12',
      status: 'Nháp',
    },
  ]);

  const handleAddPost = () => {
    alert('Chức năng đang phát triển ở Giai đoạn 2');
  };

  const handleEdit = (post) => {
    alert(`Chức năng đang phát triển ở Giai đoạn 2\n\nSẽ chỉnh sửa: ${post.title}`);
  };

  const handleDelete = (post) => {
    alert(`Chức năng đang phát triển ở Giai đoạn 2\n\nSẽ xóa: ${post.title}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản Lý Bài Viết</h1>
          <p className="text-gray-600 mt-2">Tổng cộng: {posts.length} bài viết</p>
        </div>
        <button
          onClick={handleAddPost}
          className="flex items-center gap-2 bg-brand-purple text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-semibold shadow-lg"
        >
          <FaPlus /> Viết Bài Mới
        </button>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
        <div className="flex items-center gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            className="flex-1 min-w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-purple"
          />
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-purple">
            <option value="">Tất cả danh mục</option>
            <option value="huongdan">Hướng Dẫn</option>
            <option value="xuthuong">Xu Hướng</option>
            <option value="chamson">Chăm Sóc</option>
            <option value="cauchuyện">Câu Chuyện</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-purple">
            <option value="">Tất cả trạng thái</option>
            <option value="published">Đã Công Bố</option>
            <option value="draft">Nháp</option>
          </select>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Tiêu Đề</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Danh Mục</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Tác Giả</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Lượt Xem</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Trạng Thái</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-800 line-clamp-2">{post.title}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-600">{post.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-600">{post.author}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center justify-center min-w-[2rem] px-2 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                      {post.views}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                      post.status === 'Đã Công Bố'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                        title="Chỉnh sửa"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(post)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                        title="Xóa"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
