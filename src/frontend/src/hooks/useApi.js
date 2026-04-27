import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from '../api/axiosClient';

/**
 * Custom hooks for common API calls with React Query
 * Provides caching, error handling, and loading states
 */

/**
 * Fetch products with caching
 */
export const useFetchProducts = (filters = {}, options = {}) => {
  const queryKey = ['products', filters];

  return useQuery({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value || value === 0) {
          params.append(key, value);
        }
      });
      const response = await axiosClient.get('/products', { params });
      return response.data;
    },
    ...options,
  });
};

/**
 * Fetch single product by ID
 */
export const useFetchProduct = (productId, options = {}) => {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const response = await axiosClient.get(`/products/${productId}`);
      return response.data;
    },
    enabled: !!productId,
    staleTime: 1000 * 60 * 10, // Keep fresh for 10 minutes
    ...options,
  });
};

/**
 * Fetch categories
 */
export const useFetchCategories = (options = {}) => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axiosClient.get('/categories');
      return response.data;
    },
    staleTime: 1000 * 60 * 30, // Categories change infrequently
    ...options,
  });
};

/**
 * Create product mutation
 */
export const useCreateProduct = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await axiosClient.post('/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate and refetch products
      queryClient.invalidateQueries({ queryKey: ['products'] });
      
      if (options.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error) => {
      console.error('Create product error:', error);
      if (options.onError) {
        options.onError(error);
      }
    },
  });
};

/**
 * Update product mutation
 */
export const useUpdateProduct = (productId, options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await axiosClient.put(`/products/${productId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate both product and products list
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      
      if (options.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error) => {
      console.error('Update product error:', error);
      if (options.onError) {
        options.onError(error);
      }
    },
  });
};

/**
 * Delete product mutation
 */
export const useDeleteProduct = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId) => {
      const response = await axiosClient.delete(`/products/${productId}`);
      return response.data;
    },
    onSuccess: (data, productId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ['product', productId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      
      if (options.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error) => {
      console.error('Delete product error:', error);
      if (options.onError) {
        options.onError(error);
      }
    },
  });
};

/**
 * Fetch user profile
 */
export const useFetchProfile = (options = {}) => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await axiosClient.get('/auth/profile');
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    ...options,
  });
};

/**
 * Fetch user orders
 */
export const useFetchOrders = (filters = {}, options = {}) => {
  const queryKey = ['orders', filters];

  return useQuery({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value || value === 0) {
          params.append(key, value);
        }
      });
      const response = await axiosClient.get('/orders', { params });
      return response.data;
    },
    ...options,
  });
};

export default {
  useFetchProducts,
  useFetchProduct,
  useFetchCategories,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useFetchProfile,
  useFetchOrders,
};
