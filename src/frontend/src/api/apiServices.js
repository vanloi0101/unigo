import axiosClient from './axiosClient';

/**
 * Tập hợp tất cả các API calls cho ứng dụng
 * Giúp tập trung các requests vào một chỗ dễ quản lý
 */

// ==================== AUTH SERVICES ====================
export const authAPI = {
  register: (email, password, fullName) =>
    axiosClient.post('/auth/register', { email, password, fullName }),

  login: (email, password) =>
    axiosClient.post('/auth/login', { email, password }),

  getProfile: () =>
    axiosClient.get('/auth/profile'),

  logout: () =>
    axiosClient.post('/auth/logout'),
};

// ==================== PRODUCT SERVICES ====================
export const productAPI = {
  getAll: (page = 1, limit = 50, category = null) => {
    const params = { page, limit };
    if (category) params.category = category;
    return axiosClient.get('/products', { params });
  },

  getById: (id) =>
    axiosClient.get(`/products/${id}`),

  create: (productData) =>
    axiosClient.post('/products', productData),

  update: (id, productData) =>
    axiosClient.put(`/products/${id}`, productData),

  delete: (id) =>
    axiosClient.delete(`/products/${id}`),
};

// ==================== ORDER SERVICES ====================
export const orderAPI = {
  create: (items, shippingAddress) =>
    axiosClient.post('/orders', { items, shippingAddress }),

  getUserOrders: (page = 1, limit = 10) =>
    axiosClient.get('/orders', { params: { page, limit } }),

  getById: (id) =>
    axiosClient.get(`/orders/${id}`),

  getAllOrders: (page = 1, limit = 10, status = null) => {
    const params = { page, limit };
    if (status) params.status = status;
    return axiosClient.get('/orders/admin/all', { params });
  },

  updateStatus: (id, status) =>
    axiosClient.put(`/orders/${id}/status`, { status }),
};

// ==================== BANNER SERVICES ====================
export const bannerAPI = {
  // Public - Get active banner for homepage
  getActive: () =>
    axiosClient.get('/banner'),

  // Admin - Banner Content
  getAllContents: () =>
    axiosClient.get('/banner/admin/contents'),

  getContentById: (id) =>
    axiosClient.get(`/banner/admin/contents/${id}`),

  createContent: (data) =>
    axiosClient.post('/banner/admin/contents', data),

  updateContent: (id, data) =>
    axiosClient.put(`/banner/admin/contents/${id}`, data),

  deleteContent: (id) =>
    axiosClient.delete(`/banner/admin/contents/${id}`),

  // Admin - Banner Images
  getAllImages: () =>
    axiosClient.get('/banner/admin/images'),

  uploadImage: (formData) =>
    axiosClient.post('/banner/admin/images', formData),

  updateImage: (id, formData) =>
    axiosClient.put(`/banner/admin/images/${id}`, formData),

  deleteImage: (id) =>
    axiosClient.delete(`/banner/admin/images/${id}`),

  updateImageSortOrder: (images) =>
    axiosClient.put('/banner/admin/images/sort', { images }),

  toggleImageActive: (id) =>
    axiosClient.put(`/banner/admin/images/${id}/toggle`),
};

// ==================== BLOG/NEWS SERVICES ====================
export const blogAPI = {
  // Public - Posts
  getPosts: (page = 1, limit = 10, categoryId = null) => {
    const params = { page, limit };
    if (categoryId) params.categoryId = categoryId;
    return axiosClient.get('/posts', { params });
  },

  getPostBySlug: (slug) =>
    axiosClient.get(`/posts/${slug}`),

  getFeaturedPosts: (limit = 5) =>
    axiosClient.get('/posts/featured', { params: { limit } }),

  getLatestPosts: (limit = 10) =>
    axiosClient.get('/posts/latest', { params: { limit } }),

  getPopularPosts: (limit = 5) =>
    axiosClient.get('/posts/popular', { params: { limit } }),

  searchPosts: (keyword, page = 1, limit = 10) =>
    axiosClient.get('/posts/search', { params: { keyword, page, limit } }),

  getPostsByCategory: (categorySlug, page = 1, limit = 10) =>
    axiosClient.get(`/posts/category/${categorySlug}`, { params: { page, limit } }),

  // Public - Categories
  getCategories: () =>
    axiosClient.get('/categories'),

  getCategoryTree: () =>
    axiosClient.get('/categories/tree'),

  getCategoryBySlug: (slug) =>
    axiosClient.get(`/categories/${slug}`),

  // Public - Authors
  getAuthors: () =>
    axiosClient.get('/authors'),

  getTopAuthors: (limit = 5) =>
    axiosClient.get('/authors/top', { params: { limit } }),

  getAuthorBySlug: (slug, page = 1, limit = 10) =>
    axiosClient.get(`/authors/${slug}`, { params: { page, limit } }),

  // Admin - Posts
  adminGetPosts: (page = 1, limit = 10, status = null, categoryId = null) => {
    const params = { page, limit };
    if (status) params.status = status;
    if (categoryId) params.categoryId = categoryId;
    return axiosClient.get('/admin/posts', { params });
  },

  adminGetPostById: (id) =>
    axiosClient.get(`/admin/posts/${id}`),

  adminCreatePost: (data) =>
    axiosClient.post('/admin/posts', data),

  adminUpdatePost: (id, data) =>
    axiosClient.put(`/admin/posts/${id}`, data),

  adminDeletePost: (id) =>
    axiosClient.delete(`/admin/posts/${id}`),

  adminToggleFeatured: (id) =>
    axiosClient.patch(`/admin/posts/${id}/featured`),

  adminPublishPost: (id) =>
    axiosClient.patch(`/admin/posts/${id}/publish`),

  adminUnpublishPost: (id) =>
    axiosClient.patch(`/admin/posts/${id}/unpublish`),

  adminBulkUpdateStatus: (ids, status) =>
    axiosClient.patch('/admin/posts/bulk-status', { ids, status }),

  // Admin - Categories
  adminGetCategories: (page = 1, limit = 50) =>
    axiosClient.get('/admin/categories', { params: { page, limit } }),

  adminGetCategoryById: (id) =>
    axiosClient.get(`/admin/categories/${id}`),

  adminCreateCategory: (data) =>
    axiosClient.post('/admin/categories', data),

  adminUpdateCategory: (id, data) =>
    axiosClient.put(`/admin/categories/${id}`, data),

  adminDeleteCategory: (id) =>
    axiosClient.delete(`/admin/categories/${id}`),

  adminToggleCategoryActive: (id) =>
    axiosClient.patch(`/admin/categories/${id}/toggle-active`),

  adminUpdateCategorySortOrder: (categories) =>
    axiosClient.put('/admin/categories/sort-order', { categories }),

  // Admin - Authors
  adminGetAuthors: (page = 1, limit = 20) =>
    axiosClient.get('/admin/authors', { params: { page, limit } }),

  adminGetAuthorById: (id) =>
    axiosClient.get(`/admin/authors/${id}`),

  adminCreateAuthor: (data) =>
    axiosClient.post('/admin/authors', data),

  adminUpdateAuthor: (id, data) =>
    axiosClient.put(`/admin/authors/${id}`, data),

  adminDeleteAuthor: (id) =>
    axiosClient.delete(`/admin/authors/${id}`),

  adminToggleAuthorActive: (id) =>
    axiosClient.patch(`/admin/authors/${id}/toggle-active`),

  // Admin - Upload Content Images
  uploadContentImages: (formData) =>
    axiosClient.post('/admin/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
};

// ==================== EXPORT ALL ====================
export default {
  auth: authAPI,
  products: productAPI,
  orders: orderAPI,
  banner: bannerAPI,
  blog: blogAPI,
};
