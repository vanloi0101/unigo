import React from 'react';
import { FaHandSparkles, FaShippingFast, FaRulerHorizontal, FaBoxOpen } from 'react-icons/fa';

export default function TrustBadges() {
  return (
    <section className="py-10 border-y border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div className="flex flex-col items-center gap-2 fade-up">
          <FaHandSparkles className="text-3xl text-brand-purple mb-2" />
          <h3 className="font-semibold text-brand-dark">100% Thủ Công</h3>
          <p className="text-sm text-gray-500">Chăm chút từng hạt cườm</p>
        </div>
        <div className="flex flex-col items-center gap-2 fade-up">
          <FaShippingFast className="text-3xl text-brand-purple mb-2" />
          <h3 className="font-semibold text-brand-dark">Freeship Toàn Quốc</h3>
          <p className="text-sm text-gray-500">Cho đơn hàng từ 150k</p>
        </div>
        <div className="flex flex-col items-center gap-2 fade-up">
          <FaRulerHorizontal className="text-3xl text-brand-purple mb-2" />
          <h3 className="font-semibold text-brand-dark">Size Tùy Chỉnh</h3>
          <p className="text-sm text-gray-500">Vừa vặn mọi cổ tay</p>
        </div>
        <div className="flex flex-col items-center gap-2 fade-up">
          <FaBoxOpen className="text-3xl text-brand-purple mb-2" />
          <h3 className="font-semibold text-brand-dark">Hộp Quà Xinh Xắn</h3>
          <p className="text-sm text-gray-500">Tặng kèm thiệp viết tay</p>
        </div>
      </div>
    </section>
  );
}
