import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FiFilter, FiX } from 'react-icons/fi';
import useProductStore from '../store/useProductStore';
import CategorySidebar from '../components/CategorySidebar';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import SEO from '../components/common/SEO';

export default function Products() {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const { products, isLoading, error, fetchProducts, loadMoreProducts, hasMore, isLoadingMore, totalProducts } = useProductStore();

  // Lọc sản phẩm theo danh mục — MUST be before any useEffect that reads it
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  // Refetch mỗi khi route thay đổi (bao gồm khi quay lại từ Admin)
  useEffect(() => {
    fetchProducts(1); // dùng pageLimit mặc định từ store (20)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Handle mở product modal
  const handleOpenProduct = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
    document.body.classList.add('no-scroll');
  };

  // Handle đóng product modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
    document.body.classList.remove('no-scroll');
  };

  return (
    <>
      <SEO
        title="Sản Phẩm - Món Nhỏ Handmade"
        description="Khám phá bộ sưu tập sản phẩm handmade chính hãng từ Món Nhỏ. Vòng tay ấn tượng với thiết kế độc quyền."
      />

      <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Sản Phẩm</h1>
                <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                  Tổng số: <span className="font-semibold">{products.length}</span> sản phẩm
                </p>
              </div>

              {/* Mobile filter button */}
              <button
                onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                className="md:hidden flex items-center gap-2 px-3 sm:px-4 py-2 bg-brand-purple text-white rounded-lg hover:bg-brand-dark transition-colors text-sm min-h-[44px] touch-manipulation"
              >
                <FiFilter className="w-4 h-4 sm:w-5 sm:h-5" />
                Lọc
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-8">
            {/* Sidebar */}
            <div className="md:w-48 lg:w-56 flex-shrink-0">
              <CategorySidebar
                products={products}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                isLoading={isLoading}
                onClose={() => setIsMobileSidebarOpen(false)}
                isMobileOpen={isMobileSidebarOpen}
              />
            </div>

            {/* Main product grid */}
            <div className="flex-1 min-w-0">
              {/* Status */}
              {selectedCategory !== 'all' && (
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-gray-600">
                    Đang hiển thị <span className="font-semibold">{filteredProducts.length}</span> sản phẩm
                  </p>
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="text-sm text-brand-purple hover:text-brand-dark transition-colors flex items-center gap-1"
                  >
                    <FiX className="w-4 h-4" />
                    Xóa bộ lọc
                  </button>
                </div>
              )}

              {/* Error state */}
              {error && !isLoading && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                  <p className="font-semibold">Có lỗi xảy ra</p>
                  <p className="text-sm mt-1">{error}</p>
                  <button
                    onClick={() => fetchProducts(1)}
                    className="mt-3 text-sm font-semibold text-red-600 hover:text-red-800 underline"
                  >
                    Thử lại
                  </button>
                </div>
              )}

              {/* Product grid */}
              {isLoading ? (
                // Loading skeleton
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <div key={idx} className="bg-gray-200 rounded-3xl aspect-[4/5] animate-pulse" />
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onOpen={handleOpenProduct}
                    />
                  ))}
                </div>
              ) : (
                // Empty state
                <div className="text-center py-16">
                  <div className="inline-block mb-4">
                    <div className="text-5xl mb-4">🛍️</div>
                    <h3 className="text-xl font-semibold text-gray-800">Không tìm thấy sản phẩm</h3>
                    <p className="text-gray-600 mt-2">
                      Hãy thử chọn một danh mục khác hoặc quay lại sau.
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="mt-6 px-6 py-3 bg-brand-purple text-white rounded-full font-semibold hover:bg-brand-dark transition-colors"
                  >
                    Xem Tất Cả Sản Phẩm
                  </button>
                </div>
              )}

              {/* Nút Tải Thêm — chỉ hiện khi đang show "tất cả" (không filter) và còn sản phẩm */}
              {!isLoading && hasMore && selectedCategory === 'all' && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={() => loadMoreProducts()}
                    disabled={isLoadingMore}
                    className="px-10 py-3 bg-brand-purple text-white rounded-full font-semibold hover:bg-brand-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
                  >
                    {isLoadingMore ? 'Đang tải...' : `Xem thêm (còn ${totalProducts - products.length} sản phẩm)`}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Product modal */}
      <ProductModal
        open={modalOpen}
        product={selectedProduct}
        onClose={handleCloseModal}
      />
    </>
  );
}
