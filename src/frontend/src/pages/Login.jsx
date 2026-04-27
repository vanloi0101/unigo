import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';
import { FaSignInAlt } from 'react-icons/fa';
import AuthLayout from '../components/AuthLayout';
import { useCart } from '../contexts/CartContext';

// Schema validation
const loginSchema = z.object({
  email: z.string().email({ message: "Email không đúng định dạng!" }),
  password: z.string().min(6, { message: "Mật khẩu phải từ 6 ký tự trở lên!" })
});

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user } = useAuthStore();
  const { checkAndShowSyncModal, fetchCartCount } = useCart();
  
  useEffect(() => {
    if (isAuthenticated) {
      // Redirect dựa trên role
      if (user?.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      const response = await axiosClient.post('/auth/login', {
        email: data.email,
        password: data.password,
      });

      // Response structure: { success: true, data: { user, token } }
      if (response?.data?.user && response?.data?.token) {
        const loggedInUser = response.data.user;
        login(loggedInUser, response.data.token);
        toast.success("✅ Đăng nhập thành công!");
        
        // Fetch cart count after login
        await fetchCartCount();
        
        // Check if there are guest cart items and show sync modal
        checkAndShowSyncModal();
        
        // Redirect dựa trên role: ADMIN -> /admin, CUSTOMER -> trang chủ hoặc trang trước đó
        if (loggedInUser.role === 'ADMIN') {
          navigate('/admin', { replace: true });
        } else {
          // Customer: nếu đang cố vào admin thì về trang chủ, còn lại về trang trước đó
          const redirectTo = from.startsWith('/admin') ? '/' : from;
          navigate(redirectTo, { replace: true });
        }
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Sai Email hoặc mật khẩu.";
      toast.error(errorMessage);
      console.error('Login error:', error);
    }
  };

  return (
    <AuthLayout
      title="Chào mừng trở lại."
      subtitle="Đăng nhập để tiếp tục mua sắm"
    >
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            
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
                <p className="mt-2 text-sm text-red-600 font-medium flex items-center">
                  ⚠️ {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-brand-dark mb-2">
                Mật khẩu
              </label>
              <input
                type="password"
                {...register('password')}
                autoComplete="new-password"
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
                    <span>Đang đăng nhập...</span>
                  </>
                ) : (
                  <>
                    <FaSignInAlt className="text-lg" />
                    <span>Đăng Nhập</span>
                  </>
                )}
              </button>
            </div>

            {/* Register Link */}
            <p className="text-center text-sm text-gray-600">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="text-brand-purple font-semibold hover:text-brand-dark transition-colors">
                Đăng ký ngay
              </Link>
            </p>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-center text-xs text-gray-400">
              © 2026 Món Nhỏ Handmade. Mọi quyền được bảo vệ.
            </p>
          </div>
    </AuthLayout>
  );
}
