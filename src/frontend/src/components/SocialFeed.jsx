import React from 'react';

const SOCIAL_LINKS = [
  {
    platform: 'TikTok',
    handle: '@mon_nho_unigo',
    description: 'Xem Món Nhỏ làm đồ, review vòng tay, và những video nhỏ đáng yêu.',
    href: 'https://www.tiktok.com/@mon_nho_unigo',
    cta: 'Theo dõi TikTok',
  },
  {
    platform: 'Facebook',
    handle: 'Unigo – Món Nhỏ',
    description: 'Ảnh sản phẩm mới nhất, khuyến mãi và câu chuyện từ xưởng nhỏ.',
    href: 'https://www.facebook.com/profile.php?id=61582809680392',
    cta: 'Like Fanpage',
  },
];

export default function SocialFeed() {
  return (
    <section className="py-20 px-6 bg-brand-cream">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4 fade-up">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark">
            Theo dõi hành trình
          </h2>
          <p className="text-brand-purple/60 text-sm sm:text-base max-w-xs sm:text-right">
            Món Nhỏ hay đăng quá trình làm đồ lên đây.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 fade-up">
          {SOCIAL_LINKS.map((s) => (
            <a
              key={s.platform}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col justify-between bg-white rounded-2xl border border-brand-pink/20 p-8 hover:border-brand-purple/30 hover:shadow-md hover:shadow-brand-purple/10 transition-all duration-300"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-purple/60 mb-1">
                  {s.platform}
                </p>
                <p className="font-serif text-xl font-bold text-brand-dark mb-3 group-hover:text-brand-purple transition-colors">
                  {s.handle}
                </p>
                <p className="text-brand-text/70 text-sm leading-relaxed">
                  {s.description}
                </p>
              </div>
              <p className="mt-8 text-sm font-semibold text-brand-purple group-hover:text-brand-dark transition-colors flex items-center gap-1">
                {s.cta}
                <span className="inline-block translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
