import React from 'react';

export default function Hero() {
  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
        <div className="flex-1 text-center md:text-left">
          <span className="inline-block py-1 px-3 rounded-full bg-white border border-brand-pink text-brand-purple text-sm font-semibold mb-6 shadow-sm">✨ Collection 2026 Đã Ra Mắt</span>
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 text-brand-dark leading-tight">Vòng tay xinh <br/><span className="text-gradient">Chạm đến trái tim</span></h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-lg mx-auto md:mx-0 leading-relaxed">Trang sức handmade thiết kế riêng. Chất liệu an toàn, không gỉ sét. Món quà nhỏ bé mang ngàn ý nghĩa cho ngày thêm vui.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a href="#products" className="bg-brand-dark text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-black transition-all shadow-xl shadow-brand-dark/20 flex items-center justify-center gap-2">Xem Bộ Sưu Tập</a>
            <a href="#about" className="bg-white text-brand-dark border-2 border-brand-dark/10 px-8 py-4 rounded-full font-semibold text-lg hover:border-brand-dark transition-all flex items-center justify-center">Câu chuyện của Mận</a>
          </div>
        </div>

        <div className="flex-1 relative">
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <img src="https://placehold.co/800x1000/FFE5DD/9B7BAE?text=Hero+Image" alt="Hero" className="w-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
