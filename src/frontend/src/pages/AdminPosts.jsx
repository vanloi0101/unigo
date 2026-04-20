import React, { useState, useEffect, useCallback } from 'react';
import { FaEdit, FaTrash, FaPlus, FaEye, FaEyeSlash, FaSpinner, FaSearch, FaTimes, FaImage, FaUpload, FaCopy } from 'react-icons/fa';
import { blogAPI } from '../api/apiServices';

// ==================== POST FORM MODAL ====================
function PostFormModal({ isOpen, onClose, post, categories, authors, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    content: '',
    categoryId: '',
    authorId: '',
    status: 'DRAFT',
    thumbnail: null,
    contentImages: [],
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
  });
  const [previewUrl, setPreviewUrl] = useState('');
  const [contentImagePreviews, setContentImagePreviews] = useState([]);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        shortDescription: post.shortDescription || '',
        content: post.content || '',
        categoryId: post.categoryId || '',
        authorId: post.authorId || '',
        status: post.status || 'DRAFT',
        thumbnail: null,
        contentImages: [],
        metaTitle: post.metaTitle || '',
        metaDescription: post.metaDescription || '',
        metaKeywords: post.metaKeywords || '',
      });
      setPreviewUrl(post.thumbnail || '');
      setContentImagePreviews([]);
      setUploadedUrls([]);
    } else {
      setFormData({
        title: '',
        shortDescription: '',
        content: '',
        categoryId: '',
        authorId: '',
        status: 'DRAFT',
        thumbnail: null,
        contentImages: [],
        metaTitle: '',
        metaDescription: '',
        metaKeywords: '',
      });
      setPreviewUrl('');
      setContentImagePreviews([]);
      setUploadedUrls([]);
    }
  }, [post, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, thumbnail: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Handle multiple content images
  const handleContentImagesChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setContentImagePreviews(prev => [...prev, ...previews]);
    
    // Upload images immediately
    setUploadingImages(true);
    try {
      const fd = new FormData();
      files.forEach(file => fd.append('images', file));
      
      const response = await blogAPI.uploadContentImages(fd);
      if (response.success && response.data?.urls) {
        setUploadedUrls(prev => [...prev, ...response.data.urls]);
      }
    } catch (err) {
      console.error('Error uploading content images:', err);
      alert('Lỗi tải ảnh: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploadingImages(false);
    }
  };

  // Copy URL to clipboard and insert into content
  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    alert('Đã copy URL: ' + url);
  };

  // Insert image tag into content
  const handleInsertImage = (url) => {
    const imageTag = `<img src="${url}" alt="" class="w-full rounded-lg my-4" />`;
    setFormData(prev => ({
      ...prev,
      content: prev.content + '\n' + imageTag
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            {post ? 'Chỉnh Sửa Bài Viết' : 'Viết Bài Mới'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <FaTimes className="text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-purple"
              placeholder="Nhập tiêu đề bài viết..."
            />
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
            <textarea
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-purple resize-none"
              placeholder="Mô tả ngắn gọn về bài viết..."
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung *</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-purple resize-none"
              placeholder="Nội dung bài viết (hỗ trợ HTML)..."
            />
          </div>

          {/* Content Images Upload */}
          <div className="border border-dashed border-gray-300 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaUpload className="inline mr-2" />
              Tải ảnh cho nội dung (chọn nhiều ảnh)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleContentImagesChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-purple"
            />
            {uploadingImages && (
              <div className="flex items-center gap-2 mt-2 text-brand-purple">
                <FaSpinner className="animate-spin" />
                <span>Đang tải ảnh lên...</span>
              </div>
            )}
            {uploadedUrls.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Ảnh đã tải ({uploadedUrls.length}):</p>
                <div className="grid grid-cols-3 gap-2">
                  {uploadedUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img src={url} alt="" className="w-full h-20 object-cover rounded" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleCopyUrl(url)}
                          className="p-1.5 bg-white rounded text-xs hover:bg-gray-100"
                          title="Copy URL"
                        >
                          <FaCopy />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertImage(url)}
                          className="p-1.5 bg-brand-purple text-white rounded text-xs hover:bg-brand-dark"
                          title="Chèn vào nội dung"
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Category & Author */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-purple"
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tác giả</label>
              <select
                name="authorId"
                value={formData.authorId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-purple"
              >
                <option value="">-- Chọn tác giả --</option>
                {authors.map(author => (
                  <option key={author.id} value={author.id}>{author.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh đại diện</label>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-purple"
                />
              </div>
              {previewUrl && (
                <div className="w-24 h-24 border rounded-lg overflow-hidden">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-purple"
            >
              <option value="DRAFT">Nháp</option>
              <option value="PUBLISHED">Công bố</option>
            </select>
          </div>

          {/* SEO Fields */}
          <details className="border border-gray-200 rounded-lg">
            <summary className="px-4 py-2 cursor-pointer font-medium text-gray-700 hover:bg-gray-50">
              Cài đặt SEO (tùy chọn)
            </summary>
            <div className="p-4 space-y-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-purple"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-purple resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Keywords</label>
                <input
                  type="text"
                  name="metaKeywords"
                  value={formData.metaKeywords}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-purple"
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
            </div>
          </details>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-brand-purple text-white rounded-lg hover:bg-brand-dark transition disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading && <FaSpinner className="animate-spin" />}
              {post ? 'Cập nhật' : 'Tạo bài viết'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==================== CONFIRM MODAL ====================
function ConfirmModal({ isOpen, onClose, onConfirm, title, message, isLoading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading && <FaSpinner className="animate-spin" />}
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================
export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showPostModal, setShowPostModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  // Pagination
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  // ==================== DATA FETCHING ====================
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await blogAPI.adminGetPosts(
        pagination.page, 
        pagination.limit, 
        filterStatus || null, 
        filterCategory || null
      );
      setPosts(response.data || []);
      if (response.pagination) {
        setPagination(prev => ({ ...prev, ...response.pagination }));
      }
    } catch (err) {
      console.error('Fetch posts error:', err);
      setError('Không thể tải danh sách bài viết');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filterCategory, filterStatus]);

  const fetchCategories = async () => {
    try {
      const response = await blogAPI.adminGetCategories();
      setCategories(response.data || []);
    } catch (err) {
      console.error('Fetch categories error:', err);
      // Create default category if none exists
      try {
        await blogAPI.adminCreateCategory({ name: 'Tin tức', slug: 'tin-tuc', description: 'Tin tức chung' });
        const retry = await blogAPI.adminGetCategories();
        setCategories(retry.data || []);
      } catch (createErr) {
        console.error('Create default category error:', createErr);
      }
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await blogAPI.adminGetAuthors();
      setAuthors(response.data || []);
    } catch (err) {
      console.error('Fetch authors error:', err);
      // Create default author if none exists
      try {
        await blogAPI.adminCreateAuthor({ name: 'Admin', slug: 'admin', email: 'admin@unigo.vn' });
        const retry = await blogAPI.adminGetAuthors();
        setAuthors(retry.data || []);
      } catch (createErr) {
        console.error('Create default author error:', createErr);
      }
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchAuthors();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // ==================== HANDLERS ====================
  const handleAddPost = () => {
    setSelectedPost(null);
    setShowPostModal(true);
  };

  const handleEditPost = (post) => {
    setSelectedPost(post);
    setShowPostModal(true);
  };

  const handleDeletePost = (post) => {
    setSelectedPost(post);
    setShowDeleteModal(true);
  };

  const handleTogglePublish = async (post) => {
    try {
      setActionLoading(true);
      if (post.status === 'PUBLISHED') {
        await blogAPI.adminUnpublishPost(post.id);
      } else {
        await blogAPI.adminPublishPost(post.id);
      }
      fetchPosts();
    } catch (err) {
      console.error('Toggle publish error:', err);
      alert('Không thể thay đổi trạng thái bài viết');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitPost = async (formData) => {
    try {
      setActionLoading(true);
      
      // Prepare data: convert empty strings to null for optional fields
      const prepareData = () => {
        // Check if there's a file upload
        const hasFile = formData.thumbnail instanceof File;
        
        if (hasFile) {
          // Use FormData for file upload
          const fd = new FormData();
          fd.append('title', formData.title);
          fd.append('content', formData.content);
          fd.append('status', formData.status || 'DRAFT');
          if (formData.shortDescription) fd.append('shortDescription', formData.shortDescription);
          if (formData.categoryId) fd.append('categoryId', formData.categoryId);
          if (formData.authorId) fd.append('authorId', formData.authorId);
          if (formData.metaTitle) fd.append('metaTitle', formData.metaTitle);
          if (formData.metaDescription) fd.append('metaDescription', formData.metaDescription);
          if (formData.metaKeywords) fd.append('metaKeywords', formData.metaKeywords);
          fd.append('thumbnail', formData.thumbnail);
          return fd;
        } else {
          // Use JSON for regular requests
          return {
            title: formData.title,
            content: formData.content,
            status: formData.status || 'DRAFT',
            shortDescription: formData.shortDescription || null,
            categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
            authorId: formData.authorId ? parseInt(formData.authorId) : null,
            metaTitle: formData.metaTitle || null,
            metaDescription: formData.metaDescription || null,
            metaKeywords: formData.metaKeywords || null,
          };
        }
      };
      
      const data = prepareData();
      
      if (selectedPost) {
        await blogAPI.adminUpdatePost(selectedPost.id, data);
      } else {
        await blogAPI.adminCreatePost(data);
      }
      setShowPostModal(false);
      fetchPosts();
    } catch (err) {
      console.error('Submit post error:', err);
      alert('Không thể lưu bài viết: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setActionLoading(true);
      await blogAPI.adminDeletePost(selectedPost.id);
      setShowDeleteModal(false);
      fetchPosts();
    } catch (err) {
      console.error('Delete post error:', err);
      alert('Không thể xóa bài viết');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchPosts();
  };

  // ==================== STATUS DISPLAY ====================
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'PUBLISHED':
        return { text: 'Đã Công Bố', className: 'bg-green-100 text-green-700' };
      case 'DRAFT':
        return { text: 'Nháp', className: 'bg-yellow-100 text-yellow-700' };
      case 'ARCHIVED':
        return { text: 'Lưu Trữ', className: 'bg-gray-100 text-gray-700' };
      default:
        return { text: status, className: 'bg-gray-100 text-gray-700' };
    }
  };

  // ==================== RENDER ====================
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản Lý Bài Viết</h1>
          <p className="text-gray-600 mt-2">Tổng cộng: {pagination.total} bài viết</p>
        </div>
        <button
          onClick={handleAddPost}
          className="flex items-center gap-2 bg-brand-purple text-white px-6 py-3 rounded-lg hover:bg-brand-dark transition font-semibold shadow-lg"
        >
          <FaPlus /> Viết Bài Mới
        </button>
      </div>

      {/* Filter Section */}
      <form onSubmit={handleSearch} className="bg-white rounded-lg shadow p-4 border border-gray-100">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-64 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-purple"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-purple"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-purple"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="PUBLISHED">Đã Công Bố</option>
            <option value="DRAFT">Nháp</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-brand-purple text-white rounded-lg hover:bg-brand-dark transition"
          >
            Tìm kiếm
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="animate-spin text-3xl text-brand-purple" />
        </div>
      )}

      {/* Empty State */}
      {!loading && posts.length === 0 && (
        <div className="bg-white rounded-lg shadow border border-gray-100 p-12 text-center">
          <FaImage className="mx-auto text-6xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Chưa có bài viết nào</h3>
          <p className="text-gray-500 mb-4">Bắt đầu tạo bài viết đầu tiên của bạn</p>
          <button
            onClick={handleAddPost}
            className="inline-flex items-center gap-2 bg-brand-purple text-white px-6 py-2 rounded-lg hover:bg-brand-dark transition"
          >
            <FaPlus /> Viết Bài Mới
          </button>
        </div>
      )}

      {/* Posts Table */}
      {!loading && posts.length > 0 && (
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
                {posts.map((post) => {
                  const status = getStatusDisplay(post.status);
                  return (
                    <tr key={post.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {post.thumbnail && (
                            <img
                              src={post.thumbnail}
                              alt={post.title}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          )}
                          <span className="font-medium text-gray-800 line-clamp-2">{post.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-600">{post.category?.name || '-'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-600">{post.author?.name || '-'}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center justify-center min-w-[2rem] px-2 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                          {post.viewCount || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${status.className}`}>
                          {status.text}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleTogglePublish(post)}
                            className={`p-2 rounded-lg transition ${
                              post.status === 'PUBLISHED'
                                ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                                : 'bg-green-100 text-green-600 hover:bg-green-200'
                            }`}
                            title={post.status === 'PUBLISHED' ? 'Chuyển thành nháp' : 'Công bố'}
                          >
                            {post.status === 'PUBLISHED' ? <FaEyeSlash /> : <FaEye />}
                          </button>
                          <button
                            onClick={() => handleEditPost(post)}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                            title="Chỉnh sửa"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                            title="Xóa"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Trang {pagination.page} / {pagination.totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page <= 1}
                  className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page >= pagination.totalPages}
                  className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Post Form Modal */}
      <PostFormModal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        post={selectedPost}
        categories={categories}
        authors={authors}
        onSubmit={handleSubmitPost}
        isLoading={actionLoading}
      />

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa"
        message={`Bạn có chắc muốn xóa bài viết "${selectedPost?.title}"? Hành động này không thể hoàn tác.`}
        isLoading={actionLoading}
      />
    </div>
  );
}
