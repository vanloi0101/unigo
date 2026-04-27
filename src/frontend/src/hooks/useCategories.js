import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';

/**
 * Fetch all categories
 */
export const useCategories = (options = {}) => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axiosClient.get('/categories');
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};

/**
 * Create category mutation
 */
export const useCreateCategory = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await axiosClient.post('/categories', data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      
      if (options.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error) => {
      console.error('Create category error:', error);
      if (options.onError) {
        options.onError(error);
      }
    },
  });
};

/**
 * Update category mutation
 */
export const useUpdateCategory = (categoryId, options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await axiosClient.put(`/categories/${categoryId}`, data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      
      if (options.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error) => {
      console.error('Update category error:', error);
      if (options.onError) {
        options.onError(error);
      }
    },
  });
};

/**
 * Delete category mutation
 */
export const useDeleteCategory = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ categoryId, moveTo = null, deleteProducts = false }) => {
      const response = await axiosClient.delete(`/categories/${categoryId}`, {
        data: { moveTo, deleteProducts },
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      
      if (options.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error) => {
      console.error('Delete category error:', error);
      if (options.onError) {
        options.onError(error);
      }
    },
  });
};

/**
 * Reorder categories mutation
 */
export const useReorderCategories = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categories) => {
      const response = await axiosClient.post('/categories/reorder/bulk', {
        categories,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      
      if (options.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error) => {
      console.error('Reorder categories error:', error);
      if (options.onError) {
        options.onError(error);
      }
    },
  });
};

export default {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useReorderCategories,
};
