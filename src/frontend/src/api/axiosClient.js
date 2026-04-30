import axios from 'axios';

const rawApiBase =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  'https://positive-reprieve-production-f197.up.railway.app/api';

// Normalize API base URL so requests always target backend routes under /api.
const normalizedApiBase = rawApiBase.replace(/\/+$/, '').endsWith('/api')
  ? rawApiBase.replace(/\/+$/, '')
  : `${rawApiBase.replace(/\/+$/, '')}/api`;

const axiosClient = axios.create({
  baseURL: normalizedApiBase,
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
    // Nếu data là FormData, XÓA Content-Type để browser tự set với boundary đúng
    // Nếu để 'application/json' mặc định, multer sẽ không parse được file
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
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
