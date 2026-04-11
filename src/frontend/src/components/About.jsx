import React from 'react';

export default function About() {
  return (
    <section id="about" className="py-24 px-6 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-16">
        <div className="flex-1 relative fade-up">
          <div className="absolute -inset-4 bg-brand-pink/20 rounded-[3rem] transform -rotate-3"></div>
          <img src="https://placehold.co/600x600/FFE5DD/9B7BAE?text=Mận+Làm+Đồ" alt="Câu chuyện Món Nhỏ" className="relative rounded-[2.5rem] shadow-xl w-full object-cover aspect-square" />
        </div>
        <div className="flex-1 fade-up">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-brand-dark mb-6">Mỗi chiếc vòng,<br/>một câu chuyện.</h2>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">Chào cậu, mình là Mận. Bắt đầu từ sở thích xỏ hạt lúc rảnh rỗi năm lớp 11, "Món Nhỏ" ra đời với mong muốn mang lại những niềm vui bé xíu nhưng ý nghĩa cho mọi người.</p>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">Tất cả nguyên liệu đều được mình tự tay chọn lọc: thép titanium không gỉ, cườm Nhật chuẩn size, charm tráng men tinh xảo. Vì mình tin rằng, dù là món đồ nhỏ, cũng cần được làm bằng sự tử tế lớn.</p>
        </div>
      </div>
    </section>
  );
}
