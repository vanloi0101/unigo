import React, { useEffect, useState } from 'react';
import { FaUser, FaSignOutAlt, FaShoppingCart, FaQuestionCircle } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import BraceletLogo from './BraceletLogo';
import useAuthStore from '../store/useAuthStore';
import { useCart } from '../contexts/CartContext';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [bounceKey, setBounceKey] = useState(0);
  const { isAuthenticated, user, logout } = useAuthStore();
  const { cartCount, fetchCartCount, clearCartState } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    fetchCartCount();
  }, [fetchCartCount]);

  useEffect(() => {
    if (cartCount > 0) {
      setBounceKey(prev => prev + 1);
    }
  }, [cartCount]);

  const handleLogout = () => {
    logout();
    clearCartState();
    navigate('/');
  };

  return (
    <header className={`fixed w-full top-0 z-40 transition-all duration-300 ${scrolled ? 'shadow-md glass-nav py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 md:gap-2.5 hover:opacity-85 transition-opacity group">
          <BraceletLogo size={36} className="md:hidden" />
          <BraceletLogo size={44} className="hidden md:block" />
          <div className="flex flex-col leading-tight">
            <span className="font-serif font-bold text-lg md:text-xl text-brand-purple group-hover:text-brand-pink transition-colors">Món Nhỏ</span>
            <span className="hidden sm:block text-[9px] md:text-[10px] tracking-widest text-gray-400 uppercase">Handmade Jewelry</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-brand-dark" aria-label="Điều hướng chính">
          <Link to="/" className="hover:text-brand-pink transition-colors">Trang chủ</Link>
          {isHomePage ? (
            <a href="#about" className="hover:text-brand-pink transition-colors">Về Món Nhỏ</a>
          ) : (
            <Link to="/#about" className="hover:text-brand-pink transition-colors">Về Món Nhỏ</Link>
          )}
          <Link to="/products" className="hover:text-brand-pink transition-colors">Sản Phẩm</Link>
          <Link to="/tin-tuc" className="hover:text-brand-pink transition-colors">Tin tức</Link>
          <Link to="/help" className="hover:text-brand-pink transition-colors flex items-center gap-1">
            <FaQuestionCircle className="text-sm" /> Hỗ trợ
          </Link>
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/cart"
            className="relative flex items-center gap-2 text-brand-purple px-4 py-2.5 rounded-full font-medium border-2 border-brand-purple hover:bg-brand-purple hover:text-white transition-all"
          >
            <FaShoppingCart />
            Giỏ hàng
            {cartCount > 0 && (
              <span
                key={bounceKey}
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center animate-bounce-pop"
              >
                {cartCount}
              </span>
            )}
          </Link>
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-full">
                <FaUser className="text-brand-purple text-sm" />
                <span className="text-sm font-medium text-gray-700">{user?.name || 'Admin'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2.5 rounded-full font-medium hover:bg-red-200 transition-colors"
              >
                <FaSignOutAlt className="text-sm" />
                Đăng Xuất
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-2 text-brand-purple px-4 py-2.5 rounded-full font-medium border-2 border-brand-purple hover:bg-brand-purple hover:text-white transition-all"
              >
                <FaUser />
                Đăng Nhập
              </Link>
              <a href="https://zalo.me/0346450546" target="_blank" rel="noreferrer" className="bg-brand-purple text-white px-5 py-2.5 rounded-full font-medium hover:bg-brand-dark transition-colors shadow-lg shadow-brand-purple/30">
                Tư vấn Zalo
              </a>
            </>
          )}
        </div>

        {/* Mobile: cart icon + zalo button */}
        <div className="md:hidden flex items-center gap-2">
          <a
            href="https://zalo.me/0346450546"
            target="_blank"
            rel="noreferrer"
            className="text-xs bg-brand-purple text-white px-3 py-1.5 rounded-full font-medium"
          >
            Zalo
          </a>
          <Link to="/cart" className="relative p-2 text-brand-purple">
            <FaShoppingCart className="text-xl" />
            {cartCount > 0 && (
              <span
                key={bounceKey}
                className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center px-0.5 animate-bounce-pop"
              >
                {cartCount}
              </span>
            )}
          </Link>
        </div>

      </div>
    </header>
  );
}
