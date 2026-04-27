import React, { useEffect, useState } from 'react';
import { FaGem, FaBars, FaTimes, FaUser, FaSignOutAlt, FaShoppingCart, FaQuestionCircle } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { useCart } from '../contexts/CartContext';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    // Clear API cart state but keep guest cart in localStorage
    clearCartState();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className={`fixed w-full top-0 z-40 transition-all duration-300 ${scrolled ? 'shadow-md glass-nav py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="font-serif font-bold text-2xl text-brand-purple flex items-center gap-2 hover:text-brand-pink transition-colors">
          <FaGem className="text-xl text-brand-pink" /> Món Nhỏ
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-medium text-brand-dark" aria-label="Điều hướng chính">
          <Link to="/" className="hover:text-brand-pink transition-colors">Trang chủ</Link>
          {isHomePage ? (
            <a href="#about" className="hover:text-brand-pink transition-colors">Về Mận</a>
          ) : (
            <Link to="/#about" className="hover:text-brand-pink transition-colors">Về Mận</Link>
          )}
          <Link to="/products" className="hover:text-brand-pink transition-colors">Sản Phẩm</Link>
          <Link to="/tin-tuc" className="hover:text-brand-pink transition-colors">Tin tức</Link>
          <Link to="/help" className="hover:text-brand-pink transition-colors flex items-center gap-1">
            <FaQuestionCircle className="text-sm" /> Hỗ trợ
          </Link>
        </nav>

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

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-2xl text-brand-dark" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {mobileMenuOpen ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden bg-white shadow-lg mt-2 mx-6 rounded-lg p-4 space-y-3" role="navigation" aria-label="Menu điều hướng">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block text-brand-dark hover:text-brand-pink font-medium py-2">Trang chủ</Link>
          {isHomePage ? (
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block text-brand-dark hover:text-brand-pink font-medium py-2">Về Mận</a>
          ) : (
            <Link to="/#about" onClick={() => setMobileMenuOpen(false)} className="block text-brand-dark hover:text-brand-pink font-medium py-2">Về Mận</Link>
          )}
          <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="block text-brand-dark hover:text-brand-pink font-medium py-2">Sản Phẩm</Link>
          <Link to="/tin-tuc" onClick={() => setMobileMenuOpen(false)} className="block text-brand-dark hover:text-brand-pink font-medium py-2">Tin tức</Link>
          <Link to="/help" onClick={() => setMobileMenuOpen(false)} className="block text-brand-dark hover:text-brand-pink font-medium py-2 flex items-center gap-2">
            <FaQuestionCircle className="text-sm" /> Hỗ trợ
          </Link>
          <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="relative block text-brand-purple hover:text-brand-dark font-medium py-2 flex items-center gap-2">
            <FaShoppingCart /> Giỏ hàng
            {cartCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center ml-auto">
                {cartCount}
              </span>
            )}
          </Link>
          <hr className="my-3" />
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg">
                <FaUser className="text-brand-purple text-sm" />
                <span className="text-sm font-medium text-gray-700">{user?.name || 'Admin'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-red-100 text-red-600 px-4 py-2.5 rounded-lg font-medium hover:bg-red-200 transition-colors"
              >
                <FaSignOutAlt className="text-sm" />
                Đăng Xuất
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login"
                className="block text-center text-brand-purple px-4 py-2.5 rounded-lg font-medium border-2 border-brand-purple hover:bg-brand-purple hover:text-white transition-all"
              >
                Đăng Nhập
              </Link>
              <a href="https://zalo.me/0346450546" target="_blank" rel="noreferrer" className="block text-center bg-brand-purple text-white px-5 py-2.5 rounded-lg font-medium hover:bg-brand-dark transition-colors">
                Tư vấn Zalo
              </a>
            </>
          )}
        </div>
      )}
    </header>
  );
}
