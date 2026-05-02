import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/logo_unigo.png';

export default function Footer() {
  return (
    <footer className="bg-[#2a2432] text-gray-300 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="md:col-span-2">
          <Link to="/" className="mb-6 block hover:opacity-85 transition-opacity">
            <img src={logoImg} alt="Món Nhỏ Handmade Jewelry" className="h-16 w-auto object-contain brightness-0 invert" />
          </Link>
          <p className="text-gray-400 max-w-sm mb-8 leading-relaxed">Thương hiệu trang sức handmade dành riêng cho thế hệ trẻ. Mang thiết kế thanh lịch, chất liệu bền bỉ và giá thành hợp lý.</p>
        </div>
        <div>
          <h4 className="text-white font-bold text-lg mb-6 uppercase tracking-wider text-sm">Khám phá</h4>
          <ul className="space-y-4 text-gray-400 font-medium">
            <li><Link to="/products" className="hover:text-white transition-colors">Sản phẩm</Link></li>
            <li><Link to="/tin-tuc" className="hover:text-white transition-colors">Tin tức & Blog</Link></li>
            <li><Link to="/help" className="hover:text-white transition-colors">Hướng dẫn đo size</Link></li>
            <li><Link to="/help" className="hover:text-white transition-colors">Chính sách vận chuyển</Link></li>
            <li><Link to="/help" className="hover:text-white transition-colors">Chính sách đổi trả</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold text-lg mb-6 uppercase tracking-wider text-sm">Liên hệ</h4>
          <ul className="space-y-4 text-gray-400 font-medium">
            <li className="flex items-start gap-3"><span>Quận Bình Thạnh, TP. Hồ Chí Minh (Chỉ bán Online)</span></li>
            <li className="flex items-center gap-3"><a href="tel:0346450546" className="hover:text-white transition-colors">0346.450.546</a></li>
            <li className="flex items-center gap-3"><a href="https://zalo.me/0346450546" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Zalo: 0346.450.546</a></li>
            <li className="flex items-center gap-3"><a href="https://www.facebook.com/profile.php?id=61582809680392" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Facebook</a></li>
            <li className="flex items-center gap-3"><a href="https://www.tiktok.com/@mon_nho_unigo" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">TikTok: @mon_nho_unigo</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 font-medium">
        <p>© 2026 Món Nhỏ Handmade. Tất cả các quyền được bảo lưu.</p>
        <p>Hàng thủ công từ TP. Hồ Chí Minh</p>
      </div>
    </footer>
  );
}
