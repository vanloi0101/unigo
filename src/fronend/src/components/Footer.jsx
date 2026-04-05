import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#2a2432] text-gray-300 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="md:col-span-2">
          <a href="#" className="font-serif font-bold text-3xl text-white mb-6 block">Món Nhỏ ♡</a>
          <p className="text-gray-400 max-w-sm mb-8 leading-relaxed">Thương hiệu trang sức handmade dành riêng cho thế hệ trẻ. Mang thiết kế thanh lịch, chất liệu bền bỉ và giá thành hợp lý.</p>
        </div>
        <div>
          <h4 className="text-white font-bold text-lg mb-6 uppercase tracking-wider text-sm">Chính sách</h4>
          <ul className="space-y-4 text-gray-400 font-medium">
            <li><a href="#" className="hover:text-white transition-colors">Hướng dẫn đo size</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Chính sách vận chuyển</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Chính sách đổi trả</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Bảo hành sản phẩm</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold text-lg mb-6 uppercase tracking-wider text-sm">Liên hệ</h4>
          <ul className="space-y-4 text-gray-400 font-medium">
            <li className="flex items-start gap-3"><span>Quận Bình Thạnh, TP. Hồ Chí Minh (Chỉ bán Online)</span></li>
            <li className="flex items-center gap-3"><a href="tel:0346450546" className="hover:text-white transition-colors">0346.450.546</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 font-medium">
        <p>© 2026 Món Nhỏ Handmade. All rights reserved.</p>
        <p>Designed with ❤ for Gen Z</p>
      </div>
    </footer>
  );
}
