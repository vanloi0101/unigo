import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import AuthLayout from '../components/AuthLayout';

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
    <AuthLayout
      title="Tạo tài khoản."
      subtitle="Đăng ký để bắt đầu mua sắm cùng Món Nhỏ"
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} autoComplete="off">

        {/* Full Name Field */}
        <div>
          <label className="block text-sm font-semibold text-brand-dark mb-2">
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
            <p className="mt-2 text-sm text-red-600 font-medium">⚠️ {errors.fullName.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-semibold text-brand-dark mb-2">
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
            <p className="mt-2 text-sm text-red-600 font-medium">⚠️ {errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-semibold text-brand-dark mb-2">
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
            <p className="mt-2 text-sm text-red-600 font-medium">⚠️ {errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block text-sm font-semibold text-brand-dark mb-2">
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
            <p className="mt-2 text-sm text-red-600 font-medium">⚠️ {errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center items-center gap-2 py-3 px-4 rounded-full font-semibold text-white transition-all duration-300 ${
              isSubmitting
                ? 'bg-brand-purple/40 cursor-not-allowed'
                : 'bg-brand-purple hover:bg-brand-dark hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 shadow-lg shadow-brand-purple/20'
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
              <span>Đăng Ký</span>
            )}
          </button>
        </div>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-brand-purple font-semibold hover:text-brand-dark transition-colors">
            Đăng nhập ngay
          </Link>
        </p>

        {/* Terms */}
        <p className="text-center text-xs text-gray-400">
          Bằng việc đăng ký, bạn đồng ý với{' '}
          <a href="#" className="text-brand-purple hover:text-brand-dark transition-colors">Điều khoản sử dụng</a>
          {' '}và{' '}
          <a href="#" className="text-brand-purple hover:text-brand-dark transition-colors">Chính sách bảo mật</a>
        </p>
      </form>
    </AuthLayout>
  );
}
