/**
 * Utility để manage React Query invalidation
 * Dùng để sync dữ liệu giữa Zustand store và React Query cache
 */
import { QueryClient } from '@tanstack/react-query';

let queryClient;

export const setQueryClient = (client) => {
  queryClient = client;
};

export const getQueryClient = () => {
  return queryClient;
};

/**
 * Invalidate products query cache
 * Dùng khi Zustand store update để sync với React Query
 */
export const invalidateProductsQuery = async () => {
  if (!queryClient) return;
  
  await queryClient.invalidateQueries({
    queryKey: ['products'],
    exact: false,
  });
};

/**
 * Prefetch products query
 */
export const prefetchProductsQuery = async () => {
  if (!queryClient) return;
  
  await queryClient.prefetchQuery({
    queryKey: ['products'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
