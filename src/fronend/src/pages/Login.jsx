import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';

// 1. Tạo Schema định dạng (Zod Schema Validation)
const loginSchema = z.object({
  email: z.string().email({ message: "Email không đúng định dạng!" }),
  password: z.string().min(6, { message: "Mật khẩu phải từ 6 ký tự trở lên!" })
});

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuthStore();
  
  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Nơi user bị đá về Login từ ProtectedRoute.
  const from = location.state?.from?.pathname || '/admin';

  // 2. Chắp nối Zod với React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  // 3. Hàm xử lý nộp đơn (submit)
  const onSubmit = async (data) => {
    try {
      // Call API to login
      const response = await axiosClient.post('/auth/login', {
        email: data.email,
        password: data.password,
      });

      if (response.success) {
        // Store user info and token
        login(response.user, response.token);
        toast.success("Chào mừng quay lại Admin!");
        
        // Navigate to the page user was trying to access, or dashboard
        navigate(from, { replace: true });
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Sai Email hoặc mật khẩu.";
      toast.error(errorMessage);
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Đăng Nhập Quản Trị Hệ Thống
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Nhập thông tin tài khoản của bạn
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            
            {/* Field Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Admin</label>
              <div className="mt-1">
                <input
                  type="email"
                  {...register('email')}
                  className={`appearance-none block w-full px-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-purple focus:border-brand-purple sm:text-sm`}
                  placeholder="admin@example.com"
                  disabled={isSubmitting}
                />
              </div>
              {/* Lỗi Đỏ Field Email */}
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Field Mật khẩu */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
              <div className="mt-1">
                <input
                  type="password"
                  {...register('password')}
                  className={`appearance-none block w-full px-3 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-purple focus:border-brand-purple sm:text-sm`}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                />
              </div>
              {/* Lỗi Đỏ Password */}
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isSubmitting
                    ? 'bg-purple-400 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang đăng nhập...
                  </>
                ) : (
                  'Đăng Nhập'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
