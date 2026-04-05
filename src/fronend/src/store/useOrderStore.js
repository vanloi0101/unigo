import { create } from 'zustand';
import axiosClient from '../api/axiosClient';

const useOrderStore = create((set) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalOrders: 0,

  // Create order
  createOrder: async (items, shippingAddress) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosClient.post('/orders', {
        items,
        shippingAddress,
      });
      set((state) => ({
        orders: [response.order, ...state.orders],
        isLoading: false,
        currentOrder: response.order,
      }));
      return response.order;
    } catch (error) {
      set({
        error: error?.response?.data?.message || 'Lỗi khi tạo đơn hàng',
        isLoading: false,
      });
      return null;
    }
  },

  // Get user orders
  fetchUserOrders: async (page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosClient.get('/orders', {
        params: { page, limit },
      });
      set({
        orders: response.orders,
        currentPage: response.pagination.page,
        totalPages: response.pagination.pages,
        totalOrders: response.pagination.total,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error?.response?.data?.message || 'Lỗi khi tải đơn hàng',
        isLoading: false,
      });
    }
  },

  // Get order by ID
  getOrderById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosClient.get(`/orders/${id}`);
      set({
        currentOrder: response.order,
        isLoading: false,
      });
      return response.order;
    } catch (error) {
      set({
        error: error?.response?.data?.message || 'Lỗi khi tải đơn hàng',
        isLoading: false,
      });
      return null;
    }
  },

  // Get all orders (admin only)
  fetchAllOrders: async (page = 1, limit = 10, status = null) => {
    set({ isLoading: true, error: null });
    try {
      const params = { page, limit };
      if (status) params.status = status;

      const response = await axiosClient.get('/orders/admin/all', { params });
      set({
        orders: response.orders,
        currentPage: response.pagination.page,
        totalPages: response.pagination.pages,
        totalOrders: response.pagination.total,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error?.response?.data?.message || 'Lỗi khi tải đơn hàng',
        isLoading: false,
      });
    }
  },

  // Update order status (admin only)
  updateOrderStatus: async (orderId, status) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosClient.put(`/orders/${orderId}/status`, {
        status,
      });
      set((state) => ({
        orders: state.orders.map(o => o.id === orderId ? response.order : o),
        currentOrder: state.currentOrder?.id === orderId ? response.order : state.currentOrder,
        isLoading: false,
      }));
      return response.order;
    } catch (error) {
      set({
        error: error?.response?.data?.message || 'Lỗi khi cập nhật đơn hàng',
        isLoading: false,
      });
      return null;
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Clear current order
  clearCurrentOrder: () => {
    set({ currentOrder: null });
  },
}));

export default useOrderStore;
