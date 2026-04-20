import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';
import { FaGem, FaEnvelope, FaLock, FaUser, FaUserPlus, FaEye, FaEyeSlash } from 'react-icons/fa';

// Schema validation
const registerSchema = z.object({
  fullName: z.string()
    .min(1, { message: "Vui lòng nhập họ tên!" })
    .min(2, { message: "Họ tên phải từ 2 ký tự trở lên!" }),
  email: z.string()
    .min(1, { message: "Vui lòng nhập email!" })
    .email({ message: "Email không đúng định dạng!" }),
  password: z.string()
    .min(1, { message: "Vui lòng nhập mật khẩu!" })
    .min(6, { message: "Mật khẩu phải từ 6 ký tự trở lên!" }),
  confirmPassword: z.string()
    .min(1, { message: "Vui lòng xác nhận mật khẩu!" })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp!",
  path: ["confirmPassword"],
});

export default function Register() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      const response = await axiosClient.post('/auth/register', {
        email: data.email,
        password: data.password,
        name: data.fullName,  // Backend expects "name", not "fullName"
      });

      // Success
      toast.success("🎉 Đăng ký thành công! Vui lòng đăng nhập.");
      navigate('/login', { replace: true });
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại!";
      toast.error(errorMessage);
      console.error('Register error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration - animated blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute -bottom-8 right-0 w-72 h-72 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

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
          Đăng ký
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Tạo tài khoản để trải nghiệm mua sắm tuyệt vời
        </p>
      </div>

      {/* Form Container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 w-full">
        <div className="bg-white/95 backdrop-blur-xl py-8 px-6 shadow-2xl rounded-2xl border border-white/40">
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            
            {/* Full Name Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                <FaUser className="inline mr-2 text-brand-purple" />
                Họ và tên
              </label>
              <input
                type="text"
                {...register('fullName')}
                autoComplete="off"
                className={`appearance-none block w-full px-4 py-3 border-2 rounded-lg transition-all placeholder-gray-400 focus:outline-none font-medium text-gray-800 ${
                  errors.fullName 
                    ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300' 
                    : 'border-gray-200 bg-gray-50 focus:ring-2 focus:ring-brand-purple focus:border-brand-purple hover:border-purple-300'
                }`}
                placeholder="Nhập họ và tên của bạn"
                disabled={isSubmitting}
              />
              {errors.fullName && (
                <p className="mt-2 text-sm text-red-600 font-medium flex items-center">
                  ⚠️ {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                <FaEnvelope className="inline mr-2 text-brand-purple" />
                Email
              </label>
              <input
                type="email"
                {...register('email')}
                autoComplete="new-email"
                className={`appearance-none block w-full px-4 py-3 border-2 rounded-lg transition-all placeholder-gray-400 focus:outline-none font-medium text-gray-800 ${
                  errors.email 
                    ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300' 
                    : 'border-gray-200 bg-gray-50 focus:ring-2 focus:ring-brand-purple focus:border-brand-purple hover:border-purple-300'
                }`}
                placeholder="Nhập email của bạn"
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
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  autoComplete="new-password"
                  className={`appearance-none block w-full px-4 py-3 pr-12 border-2 rounded-lg transition-all placeholder-gray-400 focus:outline-none font-medium text-gray-800 ${
                    errors.password 
                      ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300' 
                      : 'border-gray-200 bg-gray-50 focus:ring-2 focus:ring-brand-purple focus:border-brand-purple hover:border-purple-300'
                  }`}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-brand-purple transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 font-medium flex items-center">
                  ⚠️ {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                <FaLock className="inline mr-2 text-brand-purple" />
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  autoComplete="new-password"
                  className={`appearance-none block w-full px-4 py-3 pr-12 border-2 rounded-lg transition-all placeholder-gray-400 focus:outline-none font-medium text-gray-800 ${
                    errors.confirmPassword 
                      ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300' 
                      : 'border-gray-200 bg-gray-50 focus:ring-2 focus:ring-brand-purple focus:border-brand-purple hover:border-purple-300'
                  }`}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-brand-purple transition-colors"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600 font-medium flex items-center">
                  ⚠️ {errors.confirmPassword.message}
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
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <FaUserPlus className="text-lg" />
                    <span>Đăng Ký</span>
                  </>
                )}
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Đã có tài khoản?{' '}
                <Link to="/login" className="text-brand-purple font-semibold hover:text-brand-pink transition-colors">
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-500">
          Bằng việc đăng ký, bạn đồng ý với{' '}
          <a href="#" className="text-brand-purple hover:text-brand-pink transition-colors">
            Điều khoản sử dụng
          </a>{' '}
          và{' '}
          <a href="#" className="text-brand-purple hover:text-brand-pink transition-colors">
            Chính sách bảo mật
          </a>
        </p>
      </div>
    </div>
  );
}
