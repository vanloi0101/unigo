import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor cho Request: Đính kèm token nếu có
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

// Interceptor cho Response: Xử lý lỗi toàn cục
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Xử lý chung các lỗi authorization (ví dụ: token hết hạn)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Tùy chọn redirect về trang login hoặc bắn event
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
