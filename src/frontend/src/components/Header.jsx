import React, { useEffect, useState } from 'react';
import { FaUser, FaSignOutAlt, FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import BraceletLogo from './BraceletLogo';
import useAuthStore from '../store/useAuthStore';
import { useCart } from '../contexts/CartContext';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [bounceKey, setBounceKey] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const { cartCount, fetchCartCount, clearCartState } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    fetchCartCount();
  }, [fetchCartCount]);

  useEffect(() => {
    if (cartCount > 0) {
      setBounceKey((prev) => prev + 1);
    }
  }, [cartCount]);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', mobileMenuOpen);
    return () => document.body.classList.remove('no-scroll');
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    clearCartState();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navLinks = [
    { label: 'Trang chủ', path: '/' },
    { label: 'Về Món Nhỏ', path: '/ve-chung-toi' },
    { label: 'Sản Phẩm', path: '/products' },
    { label: 'Tin tức', path: '/tin-tuc' },
    { label: 'Hỗ trợ', path: '/help' },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className={`mx-auto max-w-7xl px-4 md:px-6 transition-all duration-300 ${scrolled || mobileMenuOpen ? 'pt-2 md:pt-3' : 'pt-3 md:pt-5'}`}>
        <div className={`rounded-[1.75rem] transition-all duration-300 ${scrolled || mobileMenuOpen ? 'glass-nav shadow-md' : 'bg-white/70 shadow-sm backdrop-blur-md'} ${mobileMenuOpen ? 'rounded-b-[1.25rem]' : ''}`}>
          <div className="flex h-20 items-center justify-between px-4 md:h-24 md:px-6">
            <Link to="/" className="flex items-center gap-2 md:gap-2.5 hover:opacity-85 transition-opacity group" onClick={closeMobileMenu}>
              <BraceletLogo size={36} className="md:hidden" />
              <BraceletLogo size={44} className="hidden md:block" />
              <div className="flex flex-col leading-tight">
                <span className="font-serif text-lg font-bold text-brand-purple transition-colors group-hover:text-brand-pink md:text-xl">Món Nhỏ</span>
                <span className="hidden text-[9px] uppercase tracking-widest text-gray-400 sm:block md:text-[10px]">Handmade Jewelry</span>
              </div>
            </Link>

            <nav className="hidden items-center gap-8 font-medium text-brand-dark md:flex" aria-label="Điều hướng chính">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} className="hover:text-brand-pink transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center gap-3 md:flex">
              <Link
                to="/cart"
                className="relative flex items-center gap-2 rounded-full border-2 border-brand-purple px-4 py-2.5 font-medium text-brand-purple transition-all hover:bg-brand-purple hover:text-white"
              >
                <FaShoppingCart />
                Giỏ hàng
                {cartCount > 0 && (
                  <span
                    key={bounceKey}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white animate-bounce-pop"
                  >
                    {cartCount}
                  </span>
                )}
              </Link>
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 rounded-full bg-purple-50 px-3 py-2">
                    <FaUser className="text-sm text-brand-purple" />
                    <span className="text-sm font-medium text-gray-700">{user?.name || 'Admin'}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-full bg-red-100 px-4 py-2.5 font-medium text-red-600 transition-colors hover:bg-red-200"
                  >
                    <FaSignOutAlt className="text-sm" />
                    Đăng Xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 rounded-full border-2 border-brand-purple px-4 py-2.5 font-medium text-brand-purple transition-all hover:bg-brand-purple hover:text-white"
                  >
                    <FaUser />
                    Đăng Nhập
                  </Link>
                  <a
                    href="https://zalo.me/0346450546"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-brand-purple px-5 py-2.5 font-medium text-white transition-colors hover:bg-brand-dark shadow-lg shadow-brand-purple/30"
                  >
                    Tư vấn Zalo
                  </a>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <Link to="/cart" className="relative p-2 text-brand-purple transition-colors hover:text-brand-pink">
                <FaShoppingCart className="text-xl" />
                {cartCount > 0 && (
                  <span
                    key={bounceKey}
                    className="absolute right-0 top-0 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-0.5 text-[10px] font-bold text-white animate-bounce-pop"
                  >
                    {cartCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setMobileMenuOpen((open) => !open)}
                className="p-2 text-brand-purple transition-colors hover:text-brand-pink"
                aria-label="Mở menu điều hướng"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="border-t border-gray-100 px-4 pb-4 pt-2 md:hidden">
              <nav className="flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={closeMobileMenu}
                    className="rounded-lg px-4 py-3 font-medium text-brand-dark transition-colors hover:bg-brand-cream hover:text-brand-purple"
                  >
                    {link.label}
                  </Link>
                ))}
                <hr className="my-2" />
                <a
                  href="https://zalo.me/0346450546"
                  target="_blank"
                  rel="noreferrer"
                  onClick={closeMobileMenu}
                  className="rounded-lg bg-brand-purple px-4 py-3 text-center font-medium text-white transition-colors hover:bg-brand-dark"
                >
                  Tư vấn Zalo
                </a>
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-2 rounded-lg bg-purple-50 px-4 py-3">
                      <FaUser className="text-sm text-brand-purple" />
                      <span className="text-sm font-medium text-gray-700">{user?.name || 'Admin'}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 rounded-lg px-4 py-3 font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                      <FaSignOutAlt className="text-sm" /> Đăng Xuất
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-center gap-2 rounded-lg border-2 border-brand-purple px-4 py-3 font-medium text-brand-purple transition-colors hover:bg-brand-purple hover:text-white"
                  >
                    <FaUser /> Đăng Nhập
                  </Link>
                )}
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
