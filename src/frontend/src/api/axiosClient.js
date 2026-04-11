import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// ==================== REQUEST INTERCEPTOR ====================
// Tự động thêm Authorization Bearer token từ localStorage nếu có
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==================== RESPONSE INTERCEPTOR ====================
// Xử lý response và lỗi toàn cục
axiosClient.interceptors.response.use(
  (response) => {
    // Trả về data từ response, bỏ wrapping axios
    return response.data;
  },
  (error) => {
    // Xử lý token hết hạn: xóa token và redirect
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // window.location.href = '/login';  // Optional: uncomment để auto redirect
    }
    
    // Trả về error cho consumer
    return Promise.reject(error);
  }
);

export default axiosClient;
