import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useProductStore from '../store/useProductStore';
import ProductCard from './ProductCard';
import ProductSkeleton from './common/ProductSkeleton';
import { FiArrowRight } from 'react-icons/fi';

export default function ProductSection({ onOpen }) {
  const { products, isLoading, error, fetchProducts, totalProducts } = useProductStore();

  // Fetch 8 sản phẩm cho trang chủ
  useEffect(() => {
    fetchProducts(1, 8);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Chỉ lấy 8 sản phẩm đầu
  const preview = products.slice(0, 8);

  return (
    <section id="products" className="py-12 sm:py-16 md:py-20 lg:py-24 px-3 sm:px-4 md:px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header — left-aligned with product count right */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 sm:mb-12 lg:mb-16 fade-up gap-4">
          <div>
            <span className="text-[10px] sm:text-xs font-semibold tracking-widest text-brand-purple uppercase mb-2 sm:mb-3 block">
              Bộ sưu tập
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-brand-dark">
              Sản Phẩm Nổi Bật
            </h2>
          </div>
          {!isLoading && !error && totalProducts > 0 && (
            <p className="text-brand-purple/60 text-sm sm:text-base shrink-0">
              {totalProducts} sản phẩm
            </p>
          )}
        </div>

        {/* Grid — first card featured (2-col span) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
          ) : error ? (
            <div className="col-span-full text-center py-16">
              <h3 className="text-xl font-semibold text-brand-dark mb-2">Không thể tải sản phẩm</h3>
              <p className="text-brand-purple/60 mb-6">{error}</p>
              <button
                onClick={() => fetchProducts(1, 8)}
                className="bg-brand-purple text-white px-6 py-3 rounded-full font-semibold hover:bg-brand-dark transition-colors"
              >
                Thử lại
              </button>
            </div>
          ) : preview.length > 0 ? (
            preview.map((p, index) => (
              <div key={p.id} className={index === 0 ? 'col-span-2' : ''}>
                <ProductCard product={p} onOpen={onOpen} featured={index === 0} />
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center">
              <p className="font-serif text-2xl text-brand-dark mb-2">Chưa có sản phẩm nào.</p>
              <p className="text-brand-purple/60 text-sm">Ghé lại sớm nhé — Món Nhỏ đang làm thêm.</p>
            </div>
          )}
        </div>

        {/* Nút Xem Thêm */}
        {!isLoading && !error && totalProducts > 8 && (
          <div className="text-center mt-14 fade-up">
            <p className="text-gray-400 text-sm mb-4">
              Đang hiển thị 8 / {totalProducts} sản phẩm
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-3 bg-brand-purple text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-brand-dark transition-all shadow-lg shadow-brand-purple/30 group"
            >
              Xem Tất Cả Sản Phẩm
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}

        {/* Nếu chỉ có <= 8 sản phẩm thì vẫn có link */}
        {!isLoading && !error && preview.length > 0 && totalProducts <= 8 && (
          <div className="text-center mt-14 fade-up">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-brand-purple font-semibold hover:text-brand-dark transition-colors"
            >
              Xem trang sản phẩm <FiArrowRight />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

