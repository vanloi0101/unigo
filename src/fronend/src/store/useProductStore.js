import { create } from 'zustand';
import axiosClient from '../api/axiosClient';

const useProductStore = create((set) => ({
  products: [],
  filteredProducts: [],
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalProducts: 0,

  // Fetch all products
  fetchProducts: async (page = 1, limit = 10, category = null) => {
    set({ isLoading: true, error: null });
    try {
      const params = { page, limit };
      if (category) params.category = category;

      const response = await axiosClient.get('/products', { params });

      set({
        products: response.products,
        currentPage: response.pagination.page,
        totalPages: response.pagination.pages,
        totalProducts: response.pagination.total,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error?.response?.data?.message || 'Lỗi khi tải sản phẩm',
        isLoading: false,
      });
    }
  },

  // Get product by ID
  getProductById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosClient.get(`/products/${id}`);
      set({ isLoading: false });
      return response.product;
    } catch (error) {
      set({
        error: error?.response?.data?.message || 'Lỗi khi tải sản phẩm',
        isLoading: false,
      });
      return null;
    }
  },

  // Create product (admin)
  createProduct: async (productData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosClient.post('/products', productData);
      set((state) => ({
        products: [response.product, ...state.products],
        isLoading: false,
      }));
      return response.product;
    } catch (error) {
      set({
        error: error?.response?.data?.message || 'Lỗi khi tạo sản phẩm',
        isLoading: false,
      });
      return null;
    }
  },

  // Update product (admin)
  updateProduct: async (id, productData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosClient.put(`/products/${id}`, productData);
      set((state) => ({
        products: state.products.map(p => p.id === id ? response.product : p),
        isLoading: false,
      }));
      return response.product;
    } catch (error) {
      set({
        error: error?.response?.data?.message || 'Lỗi khi cập nhật sản phẩm',
        isLoading: false,
      });
      return null;
    }
  },

  // Delete product (admin)
  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosClient.delete(`/products/${id}`);
      set((state) => ({
        products: state.products.filter(p => p.id !== id),
        isLoading: false,
      }));
      return true;
    } catch (error) {
      set({
        error: error?.response?.data?.message || 'Lỗi khi xóa sản phẩm',
        isLoading: false,
      });
      return false;
    }
  },

  // Filter products by category (local)
  filterByCategory: (category) => {
    set((state) => {
      const filtered = category
        ? state.products.filter(p => p.category === category)
        : state.products;
      return { filteredProducts: filtered };
    });
  },

  // Search products (local)
  searchProducts: (query) => {
    set((state) => {
      const filtered = state.products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description?.toLowerCase().includes(query.toLowerCase())
      );
      return { filteredProducts: filtered };
    });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));

export default useProductStore;
