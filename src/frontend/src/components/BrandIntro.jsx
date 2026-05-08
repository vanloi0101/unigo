import React from 'react';
import { Link } from 'react-router-dom';

const VALUES = [
  {
    icon: '💎',
    title: 'Chất lượng',
    desc: 'Mỗi sản phẩm được kiểm tra kỹ lưỡng trước khi đến tay bạn. Đổi trả trong 7 ngày nếu có lỗi.',
  },
  {
    icon: '💜',
    title: 'Cảm xúc',
    desc: 'Không chỉ là một chiếc vòng — mỗi sản phẩm mang tên riêng, câu chuyện riêng và ý nghĩa riêng.',
  },
  {
    icon: '🤝',
    title: 'Kết nối',
    desc: 'Xây dựng cộng đồng khách hàng gần gũi, hiểu được tâm lý và nhu cầu của giới trẻ.',
  },
  {
    icon: '🌿',
    title: 'Tận tâm',
    desc: 'Hỗ trợ khách hàng nhanh chóng qua Zalo, Facebook và TikTok. Luôn lắng nghe và phản hồi.',
  },
];

export default function BrandIntro() {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-brand-cream to-white">
      <div className="max-w-6xl mx-auto">

        {/* Quote lớn ở giữa */}
        <div className="text-center mb-16 fade-up">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-brand-purple/60 mb-4">
            Thương hiệu Món Nhỏ
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-brand-dark leading-snug mb-6">
            Không cần to lớn.{' '}
            <span className="text-gradient">Chỉ cần đúng lúc,</span>
            <br className="hidden md:block" /> đúng người.
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Món Nhỏ là thương hiệu phụ kiện handmade dành cho giới trẻ — nơi mỗi chiếc vòng tay
            là một món quà nhỏ mang giá trị cảm xúc lớn.
          </p>
        </div>

        {/* 4 giá trị cốt lõi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {VALUES.map((v, i) => (
            <div
              key={i}
              className="fade-up bg-white rounded-2xl p-7 shadow-sm border border-brand-pink/20 hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-center"
            >
              <div className="text-4xl mb-4">{v.icon}</div>
              <h3 className="font-bold text-brand-dark text-lg mb-2">{v.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center fade-up">
          <Link
            to="/ve-chung-toi"
            className="inline-flex items-center gap-2 text-brand-purple font-semibold border-2 border-brand-purple px-7 py-3 rounded-full hover:bg-brand-purple hover:text-white transition-all duration-300"
          >
            Đọc câu chuyện của Món Nhỏ →
          </Link>
        </div>
      </div>
    </section>
  );
}
