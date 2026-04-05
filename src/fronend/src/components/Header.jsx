import React, { useEffect, useState } from 'react';
import { FaGem, FaBars } from 'react-icons/fa';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed w-full top-0 z-40 transition-all duration-300 ${scrolled ? 'shadow-md glass-nav py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a href="#" className="font-serif font-bold text-2xl text-brand-purple flex items-center gap-2">
          <FaGem className="text-xl text-brand-pink" /> Món Nhỏ
        </a>

        <nav className="hidden md:flex gap-8 font-medium text-brand-dark">
          <a href="#hero" className="hover:text-brand-pink transition-colors">Trang chủ</a>
          <a href="#about" className="hover:text-brand-pink transition-colors">Về Mận</a>
          <a href="#products" className="hover:text-brand-pink transition-colors">Sản phẩm</a>
        </nav>

        <div className="hidden md:block">
          <a href="https://zalo.me/0346450546" target="_blank" rel="noreferrer" className="bg-brand-purple text-white px-5 py-2.5 rounded-full font-medium hover:bg-brand-dark transition-colors shadow-lg shadow-brand-purple/30">
            Tư vấn Zalo
          </a>
        </div>

        <button className="md:hidden text-2xl text-brand-dark" aria-label="Mở menu">
          <FaBars />
        </button>
      </div>
    </header>
  );
}
