import { useQuery } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';

const fetchProducts = async () => {
  try {
    // axiosClient interceptor returns response.data directly
    // API shape: { success, products: [...], pagination: {...} }
    const response = await axiosClient.get('/products');
    const products = response.products;
    if (Array.isArray(products)) {
      return products;
    }
    return [];
  } catch (error) {
    throw error;
  }
};

export default function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000, // Cache 5 phút
  });
}
