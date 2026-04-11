import { useQuery } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';

const fetchProducts = async () => {
  try {
    // HTTP GET request tới backend API
    const response = await axiosClient.get('/products');

    // Response structure: { success, products: [...], pagination: {...} }
    if (response.success && Array.isArray(response.products)) {
      return response.products;
    }

    console.warn('Unexpected API response structure:', response);
    return [];
  } catch (error) {
    console.error('Failed to fetch products:', error.message);
    throw error; // Cho React Query xử lý lỗi
  }
};

export default function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000, // Cache 5 phút
  });
}
