import { useQuery } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';

// Tạm thời fallback dùng mock data nếu API chưa có để UI ko bị vỡ
import mockProducts from '../data/products';

const fetchProducts = async () => {
  try {
    // GỌI API THỰC TẾ
    const response = await axiosClient.get('/products');
    return response; // Dữ liệu đã được axiosClient interceptor lấy ra (response.data)
  } catch (error) {
    console.warn("API chưa sẵn sàng, dùng Mock Data thay thế.");
    // Simulate mạng chạy chậm 1 xíu để test UX loading (ProductSkeleton)
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockProducts;
  }
};

export default function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000, // Cash 5 phút
  });
}
