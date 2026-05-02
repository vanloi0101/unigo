import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaStore, FaNewspaper, FaShoppingCart, FaUser } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import useAuthStore from '../store/useAuthStore';

const navItems = [
  { to: '/',         icon: FaHome,       label: 'Trang chủ' },
  { to: '/products', icon: FaStore,       label: 'Sản phẩm' },
  { to: '/tin-tuc',  icon: FaNewspaper,   label: 'Tin tức'   },
  { to: '/cart',     icon: FaShoppingCart, label: 'Giỏ hàng', isCart: true },
  { to: '/login',    icon: FaUser,        label: 'Tài khoản', isAccount: true },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  const { cartCount } = useCart();
  const { isAuthenticated } = useAuthStore();

  const isActive = (to) => {
    if (to === '/') return pathname === '/';
    return pathname.startsWith(to);
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-100 shadow-[0_-4px_20px_rgba(155,123,174,0.12)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Điều hướng chính"
    >
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ to, icon: Icon, label, isCart, isAccount }) => {
          const active = isActive(to);
          const dest = isAccount && isAuthenticated ? '/profile' : to;

          return (
            <Link
              key={to}
              to={dest}
              className={`relative flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1 px-2 rounded-xl transition-all duration-200
                ${active
                  ? 'text-brand-purple'
                  : 'text-gray-400 hover:text-brand-purple'
                }`}
            >
              {/* Active indicator dot */}
              {active && (
                <span className="absolute -top-0.5 w-5 h-1 bg-brand-purple rounded-full" />
              )}

              <div className="relative">
                <Icon className={`text-xl transition-transform duration-200 ${active ? 'scale-110' : ''}`} />

                {/* Cart badge */}
                {isCart && cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center leading-none px-1">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}

                {/* Login indicator */}
                {isAccount && isAuthenticated && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full border border-white" />
                )}
              </div>

              <span className={`text-[10px] font-medium leading-none ${active ? 'text-brand-purple' : ''}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
