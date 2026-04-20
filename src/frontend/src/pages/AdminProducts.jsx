import React, { useEffect, useState, useRef } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import useProductStore from '../store/useProductStore';
import toast from 'react-hot-toast';

// Validation Schema
const productSchema = z.object({
  name: z.string().min(3, { message: "Tên sản phẩm phải ít nhất 3 ký tự" }),
  description: z.string().optional(),
  price: z.number().positive({ message: "Giá phải lớn hơn 0" }),
  imageFile: z.any().optional(), // file input (FormData)
  stock: z.number().nonnegative({ message: "Kho phải >= 0" }),
  category: z.string().optional(),
});

export default function AdminProducts() {
  const {
    products,
    isLoading,
    isLoadingMore,
    hasMore,
    totalProducts,
    error,
    fetchProducts,
    loadMoreProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProductStore();

  const hasFetchedRef = useRef(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
  });

  // Fetch products once on mount
  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchProducts(1); // dùng pageLimit mặc định từ store (20)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      // Strip the file input from the plain JSON payload
      const { imageFile: _imageFile, ...jsonData } = data;
      const file = _imageFile && _imageFile.length ? _imageFile[0] : null;

      let payload = jsonData; // plain JSON (no FileList noise)

      if (file) {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description || '');
        formData.append('price', String(data.price));
        formData.append('stock', String(data.stock || 0));
        formData.append('category', data.category || '');
        // Multer expects field name 'image'
        formData.append('image', file);
        payload = formData;
      }

      if (editingId) {
        const updated = await updateProduct(editingId, payload);
        if (!updated) throw new Error('Cập nhật sản phẩm thất bại');
        toast.success('Cập nhật sản phẩm thành công!');
      } else {
        const created = await createProduct(payload);
        if (!created) throw new Error('Tạo sản phẩm thất bại');
        toast.success('Thêm sản phẩm thành công!');
      }

      // Store already updated locally — no refetch needed
      reset();
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      toast.error(error?.message || 'Có lỗi xảy ra');
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    reset(product);
    setShowForm(true);
  };

  const handleDelete = async (productId, productName) => {
    if (window.confirm(`Bạn có chắc muốn xóa "${productName}"?`)) {
      const success = await deleteProduct(productId);
      if (success) {
        toast.success('Xóa sản phẩm thành công!');
        // Store filters state locally — no refetch needed
      } else {
        // Get error message from store's error state
        const errorMsg = useProductStore.getState().error || 'Không thể xóa sản phẩm, vui lòng thử lại';
        toast.error(errorMsg);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    reset();
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = !categoryFilter || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản Lý Sản Phẩm</h1>
          <p className="text-gray-600 mt-2">
            Hiển thị: <span className="font-semibold">{products.length}</span>
            {totalProducts > products.length && (
              <span className="text-gray-400"> / {totalProducts} sản phẩm</span>
            )}
          </p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            reset();
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 bg-brand-purple text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-semibold shadow-lg"
        >
          <FaPlus /> {showForm ? 'Đóng' : 'Thêm Sản Phẩm'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <h2 className="text-xl font-bold mb-4">
            {editingId ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Tên Sản Phẩm *</label>
                <input
                  type="text"
                  {...register('name')}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-brand-purple focus:ring-1"
                  placeholder="Vd: Vòng tay mặt sáng"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Giá (VNĐ) *</label>
                <input
                  type="number"
                  {...register('price', { valueAsNumber: true })}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-brand-purple focus:ring-1"
                  placeholder="50000"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                )}
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Kho Hàng *</label>
                <input
                  type="number"
                  {...register('stock', { valueAsNumber: true })}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-brand-purple focus:ring-1"
                  placeholder="10"
                />
                {errors.stock && (
                  <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Danh Mục</label>
                <select
                  {...register('category')}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-brand-purple focus:ring-1"
                >
                  <option value="">Chọn danh mục</option>
                  <option value="dihoc">Đi Học</option>
                  <option value="tinhban">Tình Bạn</option>
                  <option value="pastel">Pastel Năng Động</option>
                </select>
              </div>

              {/* Image file input (replace URL input) */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Ảnh Sản Phẩm</label>
                <input
                  type="file"
                  accept="image/*"
                  {...register('imageFile')}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-brand-purple focus:ring-1"
                />
                {errors.imageFile && (
                  <p className="text-red-500 text-sm mt-1">{errors.imageFile.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Mô Tả</label>
                <textarea
                  {...register('description')}
                  rows="3"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-brand-purple focus:ring-1"
                  placeholder="Mô tả chi tiết về sản phẩm..."
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-brand-purple text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
              >
                {isSubmitting ? 'Đang lưu...' : editingId ? 'Cập Nhật' : 'Thêm'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
        <div className="flex items-center gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-purple"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-purple"
          >
            <option value="">Tất cả danh mục</option>
            <option value="dihoc">Đi Học</option>
            <option value="pastel">Pastel</option>
            <option value="tinhban">Tình Bạn</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Đang tải sản phẩm...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : (
          <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Ảnh
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Tên Sản Phẩm
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Danh Mục
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Giá
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Kho
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">
                    Hành Động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">N/A</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-800">{product.name}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{product.category || '-'}</td>
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {product.price.toLocaleString()} VNĐ
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                          product.stock > 0
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {product.stock} cái
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                          title="Chỉnh sửa"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
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
            {filteredProducts.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                Không có sản phẩm nào phù hợp.
              </div>
            )}
          </div>

          {/* Nút tải thêm — chỉ hiện khi không có filter và còn sản phẩm chưa load */}
          {!searchQuery && !categoryFilter && hasMore && (
            <div className="flex justify-center pt-4">
              <button
                onClick={() => loadMoreProducts()}
                disabled={isLoadingMore}
                className="px-8 py-3 bg-brand-purple text-white rounded-lg hover:bg-purple-700 transition font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoadingMore ? 'Đang tải...' : `Tải thêm (còn ${totalProducts - products.length} sản phẩm)`}
              </button>
            </div>
          )}
          </>
        )}
      </div>
    </div>
  );
}
