import React from 'react';

/**
 * SVG vòng tay handmade – icon thương hiệu Món Nhỏ
 * Các hạt đá nhỏ sắp xếp thành vòng tròn, màu nhẹ nhàng nữ tính.
 */
export default function BraceletLogo({ size = 48, className = '' }) {
  // 18 hạt quanh vòng tròn bán kính 36
  const R = 36;       // bán kính vòng
  const cx = 50;      // tâm x
  const cy = 50;      // tâm y
  const count = 18;

  // Màu sắc xen kẽ: tím – hồng – kem – tím – hồng ...
  const colors = ['#9B7BAE', '#FFB5B5', '#E8D5F5', '#B89CC8', '#FFCFCF', '#C4A8D8'];
  // Kích thước hạt xen kẽ để trông handmade
  const radii = [5.2, 4.5, 5.8, 4.8, 5.4, 4.3, 5.6, 4.7, 5.1, 4.4, 5.5, 4.9, 5.3, 4.6, 5.7, 4.2, 5.0, 4.8];

  const beads = Array.from({ length: count }, (_, i) => {
    const angle = (i * 2 * Math.PI) / count - Math.PI / 2;
    return {
      x: cx + R * Math.cos(angle),
      y: cy + R * Math.sin(angle),
      r: radii[i % radii.length],
      color: colors[i % colors.length],
      // highlight offset nhỏ tạo cảm giác 3D nhẹ
      hx: cx + R * Math.cos(angle) - radii[i % radii.length] * 0.28,
      hy: cy + R * Math.sin(angle) - radii[i % radii.length] * 0.28,
    };
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Món Nhỏ – vòng tay handmade"
    >
      {/* Vòng kết nối mờ giữa các hạt */}
      <circle cx={cx} cy={cy} r={R} stroke="#D4B8E0" strokeWidth="1.2" strokeDasharray="2 3" fill="none" opacity="0.5" />

      {/* Các hạt đá */}
      {beads.map((b, i) => (
        <g key={i}>
          <circle cx={b.x} cy={b.y} r={b.r} fill={b.color} />
          {/* Highlight nhỏ – ánh sáng nhẹ */}
          <circle cx={b.hx} cy={b.hy} r={b.r * 0.32} fill="white" opacity="0.55" />
        </g>
      ))}

      {/* Hạt charm trung tâm nhỏ – điểm nhấn */}
      <circle cx={cx} cy={cy} r={6} fill="#9B7BAE" opacity="0.15" />
      <circle cx={cx} cy={cy} r={3.5} fill="#9B7BAE" opacity="0.6" />
      <circle cx={cx - 1.2} cy={cy - 1.2} r={1.2} fill="white" opacity="0.7" />
    </svg>
  );
}
