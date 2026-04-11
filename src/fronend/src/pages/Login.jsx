import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';
import { FaGem, FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';

// Schema validation
const loginSchema = z.object({
  email: z.string().email({ message: "Email không đúng định dạng!" }),
  password: z.string().min(6, { message: "Mật khẩu phải từ 6 ký tự trở lên!" })
});

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuthStore();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const from = location.state?.from?.pathname || '/admin';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@unigo.com',
      password: 'admin123'
    }
  });

  const onSubmit = async (data) => {
    try {
      const response = await axiosClient.post('/auth/login', {
        email: data.email,
        password: data.password,
      });

      if (response.data?.success) {
        login(response.data.user, response.data.token);
        toast.success("✅ Đăng nhập thành công!");
        navigate(from, { replace: true });
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Sai Email hoặc mật khẩu.";
      toast.error(errorMessage);
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration - animated blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute -bottom-8 right-0 w-72 h-72 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

      {/* Back to Home Button */}
      <div className="absolute top-6 left-6 z-10">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-brand-purple hover:text-brand-pink transition-colors font-medium text-sm"
        >
          ← Quay lại trang chủ
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-brand-purple to-brand-pink shadow-xl hover:shadow-2xl transition-all">
            <FaGem className="text-white text-2xl animate-bounce" />
          </div>
        </div>

        {/* Title */}
        <h1 className="mt-6 text-center text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-pink">
          Món Nhỏ Admin
        </h1>
        <p className="mt-3 text-center text-sm text-gray-600 font-medium">
          Quản lý sản phẩm và đơn hàng của bạn
        </p>
      </div>

      {/* Form Container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 w-full">
        <div className="bg-white/95 backdrop-blur-xl py-8 px-6 shadow-2xl rounded-2xl border border-white/40">
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                <FaEnvelope className="inline mr-2 text-brand-purple" />
                Email Admin
              </label>
              <input
                type="email"
                {...register('email')}
                autoComplete="email"
                className={`appearance-none block w-full px-4 py-3 border-2 rounded-lg transition-all placeholder-gray-400 focus:outline-none font-medium text-gray-800 ${
                  errors.email 
                    ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300' 
                    : 'border-gray-200 bg-gray-50 focus:ring-2 focus:ring-brand-purple focus:border-brand-purple hover:border-purple-300'
                }`}
                placeholder="admin@unigo.com"
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 font-medium flex items-center">
                  ⚠️ {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                <FaLock className="inline mr-2 text-brand-purple" />
                Mật khẩu
              </label>
              <input
                type="password"
                {...register('password')}
                autoComplete="current-password"
                className={`appearance-none block w-full px-4 py-3 border-2 rounded-lg transition-all placeholder-gray-400 focus:outline-none font-medium text-gray-800 ${
                  errors.password 
                    ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300' 
                    : 'border-gray-200 bg-gray-50 focus:ring-2 focus:ring-brand-purple focus:border-brand-purple hover:border-purple-300'
                }`}
                placeholder="••••••••"
                disabled={isSubmitting}
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 font-medium flex items-center">
                  ⚠️ {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 shadow-lg ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-brand-purple to-brand-pink hover:shadow-xl hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Đang đăng nhập...</span>
                  </>
                ) : (
                  <>
                    <FaSignInAlt className="text-lg" />
                    <span>Đăng Nhập Admin</span>
                  </>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Hoặc</span>
              </div>
            </div>

            {/* Demo Credentials */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-lg p-4">
              <p className="text-xs font-semibold text-gray-700 mb-2">🔓 Tài khoản Demo (sẵn có):</p>
              <div className="space-y-1 text-xs text-gray-600 font-medium">
                <p><span className="text-brand-purple font-bold">Email:</span> admin@unigo.com</p>
                <p><span className="text-brand-purple font-bold">Password:</span> admin123</p>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-center text-xs text-gray-500">
              © 2026 Món Nhỏ Handmade. Mọi quyền được bảo vệ.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
