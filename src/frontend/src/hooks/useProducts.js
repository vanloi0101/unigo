import { useQuery } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';

const fetchProducts = async () => {
  try {
    // HTTP GET request tới backend API
    // axiosClient.interceptors.response đã trả về response.data trực tiếp
    // Nên response ở đây là: { success, message, data: { products: [...], pagination: {...} }, statusCode }
    const response = await axiosClient.get('/products');

    // response đã là response.data từ interceptor, nên lấy response.data.products
    const products = response.data?.products;
    
    if (Array.isArray(products)) {
      return products;
    }

    console.warn('Unexpected API response structure:', response);
    console.warn('Expected: { data: { products: [...], pagination: {...} } }');
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
