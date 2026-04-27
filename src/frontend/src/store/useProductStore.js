import { create } from 'zustand';
import axiosClient from '../api/axiosClient';

// Track the latest fetch to ignore stale responses
let fetchId = 0;

const useProductStore = create((set, get) => ({
  products: [],
  filteredProducts: [],
  isLoading: false,
  isLoadingMore: false,   // riêng cho "tải thêm" — không làm ẩn list hiện tại
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalProducts: 0,
  hasMore: false,          // còn sản phẩm chưa load
  pageLimit: 20,           // số sản phẩm mỗi lần tải

  // Fetch all products (REPLACES current list — dùng khi vào trang lần đầu)
  fetchProducts: async (page = 1, limit = null, filters = {}) => {
    const myId = ++fetchId;
    const effectiveLimit = limit ?? get().pageLimit;

    set({ isLoading: true, error: null });
    try {
      const params = { page, limit: effectiveLimit };
      // Support legacy 3rd arg as string (category) or object (filters)
      if (typeof filters === 'string') {
        if (filters) params.category = filters;
      } else {
        if (filters.category) params.category = filters.category;
        if (filters.search) params.search = filters.search;
        if (filters.minPrice !== undefined && filters.minPrice > 0) params.minPrice = filters.minPrice;
        if (filters.maxPrice !== undefined && filters.maxPrice < 999999999) params.maxPrice = filters.maxPrice;
        if (filters.sort && filters.sort !== 'newest') params.sort = filters.sort;
      }

      const response = await axiosClient.get('/products', { params });
      if (myId !== fetchId) return;

      // axiosClient response interceptor returns response.data directly
      // Response structure: { success: true, products: [...], pagination: {...} }
      const productsData = response?.products || [];
      const pagination = response?.pagination || {};

      // Validate products have imageUrl field
      const validatedProducts = productsData.map(product => ({
        ...product,
        imageUrl: product.imageUrl || null, // Explicitly include imageUrl (can be null)
      }));

      set({
        products: validatedProducts,
        currentPage: pagination.currentPage || 1,
        totalPages: pagination.totalPages || 1,
        totalProducts: pagination.totalItems || 0,
        hasMore: pagination.hasNextPage || false,
        isLoading: false,
      });
    } catch (error) {
      if (myId !== fetchId) return;
      set({
        error: error?.response?.data?.message || 'Lỗi khi tải sản phẩm',
        isLoading: false,
      });
    }
  },

  // Tải thêm sản phẩm (APPENDS vào list hiện tại — không thay thế)
  loadMoreProducts: async (category = null) => {
    const state = get();
    if (state.isLoadingMore || !state.hasMore) return;

    const nextPage = state.currentPage + 1;
    const myId = ++fetchId;
    set({ isLoadingMore: true });
    try {
      const params = { page: nextPage, limit: state.pageLimit };
      if (category) params.category = category;

      const response = await axiosClient.get('/products', { params });
      if (myId !== fetchId) return;

      // axiosClient response interceptor returns response.data directly
      const newProducts = response?.products || [];
      const pagination = response?.pagination || {};

      // Validate products have imageUrl field
      const validatedProducts = newProducts.map(product => ({
        ...product,
        imageUrl: product.imageUrl || null,
      }));

      set((s) => ({
        products: [...s.products, ...validatedProducts],
        currentPage: pagination.currentPage || nextPage,
        totalPages: pagination.totalPages || s.totalPages,
        totalProducts: pagination.totalItems || s.totalProducts,
        hasMore: pagination.hasNextPage || false,
        isLoadingMore: false,
      }));
    } catch (error) {
      if (myId !== fetchId) return;
      set({
        error: error?.response?.data?.message || 'Lỗi khi tải thêm sản phẩm',
        isLoadingMore: false,
      });
    }
  },

  // Get product by ID
  getProductById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosClient.get(`/products/${id}`);
      set({ isLoading: false });
      
      // Ensure product has imageUrl property (can be null)
      const product = response?.product || {};
      return {
        ...product,
        imageUrl: product.imageUrl || null,
      };
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
      // For FormData (with image), let axios auto-set Content-Type with boundary
      // DO NOT manually set multipart/form-data — it strips the boundary and breaks multer
      const response = await axiosClient.post('/products', productData);
      const newProduct = response?.product || response?.data?.product;

      if (!newProduct) {
        throw new Error(response?.message || 'Tạo sản phẩm thất bại');
      }

      // Ensure product has imageUrl property
      const validatedProduct = {
        ...newProduct,
        imageUrl: newProduct.imageUrl || null,
      };

      // Refresh từ server để đảm bảo sản phẩm đã được lưu thật sự vào DB
      // (không dùng optimistic update vì sẽ biến mất khi tải lại trang nếu có lỗi)
      const loadedCount = get().products.length;
      await get().fetchProducts(1, Math.max(get().pageLimit, loadedCount + 1));

      return validatedProduct;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Lỗi khi tạo sản phẩm';
      console.error('❌ Create product error:', error?.response?.data || error?.message);
      set({
        error: errorMessage,
        isLoading: false,
      });
      return null;
    }
  },

  // Update product (admin)
  updateProduct: async (id, productData) => {
    set({ isLoading: true, error: null });
    try {
      // For FormData (with image), let axios auto-set Content-Type with boundary
      // DO NOT manually set multipart/form-data — it strips the boundary and breaks multer
      const response = await axiosClient.put(`/products/${id}`, productData);
      const updatedProduct = response?.product || response?.data?.product;

      if (!updatedProduct) {
        throw new Error(response?.message || 'Cập nhật sản phẩm thất bại');
      }

      // Ensure product has imageUrl property
      const validatedProduct = {
        ...updatedProduct,
        imageUrl: updatedProduct.imageUrl || null,
      };

      set((state) => ({
        products: state.products.map(p => p.id === id ? validatedProduct : p),
        isLoading: false,
      }));
      return validatedProduct;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Lỗi khi cập nhật sản phẩm';
      console.error('❌ Update product error:', error?.response?.data || error?.message);
      set({
        error: errorMessage,
        isLoading: false,
      });
      return null;
    }
  },

  // Delete product (admin)
  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosClient.delete(`/products/${id}`);
      
      // Verify response indicates success
      if (!response?.success) {
        throw new Error(response?.message || 'Xóa sản phẩm không thành công');
      }
      
      set((state) => ({
        products: state.products.filter(p => p.id !== id),
        isLoading: false,
      }));
      console.log(`✅ Product ${id} deleted successfully`);
      return true;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Lỗi khi xóa sản phẩm';
      console.error(`❌ Delete product error (ID: ${id}):`, {
        status: error?.response?.status,
        message: errorMessage,
        fullError: error?.response?.data || error?.message,
      });
      set({
        error: errorMessage,
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

  // Refresh products (invalidate cache and refetch)
  refreshProducts: async () => {
    set({ products: [], isLoading: true, error: null });
    try {
      const response = await axiosClient.get('/products', { params: { page: 1, limit: 100 } });
      // axiosClient response interceptor returns response.data directly
      const productsData = response?.products || [];
      const pagination = response?.pagination || {};
      
      // Validate products have imageUrl field
      const validatedProducts = productsData.map(product => ({
        ...product,
        imageUrl: product.imageUrl || null,
      }));
      
      set({
        products: validatedProducts,
        currentPage: pagination.currentPage || 1,
        totalPages: pagination.totalPages || 1,
        totalProducts: pagination.totalItems || 0,
        isLoading: false,
      });
      return validatedProducts;
    } catch (error) {
      set({
        error: error?.response?.data?.message || 'Lỗi khi làm mới sản phẩm',
        isLoading: false,
      });
      return null;
    }
  },
}));

export default useProductStore;
