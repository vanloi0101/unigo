import React from 'react';

const BADGES = [
  { label: '100% Thủ Công', note: 'Chăm chút từng hạt cườm' },
  { label: 'Freeship Từ 150k', note: 'Giao toàn quốc' },
  { label: 'Size Tùy Chỉnh', note: 'Vừa vặn mọi cổ tay' },
  { label: 'Hộp Quà + Thiệp Viết Tay', note: 'Miễn phí kèm đơn' },
];

export default function TrustBadges() {
  return (
    <section className="py-5 border-y border-brand-pink/30 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-6">
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 sm:gap-x-12">
          {BADGES.map((item, i) => (
            <li key={i} className="flex items-baseline gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-purple">
                {item.label}
              </span>
              <span className="hidden sm:inline text-xs text-brand-purple/50">
                — {item.note}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
