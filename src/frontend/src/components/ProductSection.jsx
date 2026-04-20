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
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 fade-up">
          <span className="inline-block text-[10px] sm:text-xs font-semibold tracking-widest text-brand-purple uppercase mb-2 sm:mb-3 bg-purple-50 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full">
            Bộ sưu tập
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-brand-dark mb-2 sm:mb-4">
            Sản Phẩm Nổi Bật
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg px-2">
            Khám phá những mẫu vòng tay được yêu thích nhất. Thiết kế độc quyền từ Món Nhỏ.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
          ) : error ? (
            <div className="col-span-full text-center py-16">
              <div className="text-5xl mb-4">😞</div>
              <h3 className="text-xl font-semibold text-brand-dark mb-2">Không thể tải sản phẩm</h3>
              <p className="text-gray-500 mb-6">{error}</p>
              <button
                onClick={() => fetchProducts(1, 8)}
                className="bg-brand-purple text-white px-6 py-3 rounded-full font-semibold hover:bg-brand-dark transition-colors"
              >
                🔄 Thử lại
              </button>
            </div>
          ) : preview.length > 0 ? (
            preview.map((p) => (
              <ProductCard key={p.id} product={p} onOpen={onOpen} />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10">
              Chưa có sản phẩm nào.
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

