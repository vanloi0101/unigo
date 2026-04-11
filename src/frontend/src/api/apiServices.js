import axiosClient from './axiosClient';

/**
 * Tập hợp tất cả các API calls cho ứng dụng
 * Giúp tập trung các requests vào một chỗ dễ quản lý
 */

// ==================== AUTH SERVICES ====================
export const authAPI = {
  register: (email, password, name) =>
    axiosClient.post('/auth/register', { email, password, name }),

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

// ==================== EXPORT ALL ====================
export default {
  auth: authAPI,
  products: productAPI,
  orders: orderAPI,
};
