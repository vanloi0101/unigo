import React, { useEffect, useState, useCallback } from 'react';
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import useProductStore from '../store/useProductStore';
import { useProductFilters } from '../hooks/useProductFilters';
import { useDebounce } from '../hooks/useDebounce';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import ProductSkeleton from '../components/common/ProductSkeleton';
import EmptyState from '../components/common/EmptyState';
import SEO from '../components/common/SEO';

const MAX_PRICE = 2000000;

export default function Products() {
  const { filters, setCategory, setSearch, setPriceRange, setSort, clearFilters, setPage } = useProductFilters();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Local search input — debounced before hitting URL/API
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const debouncedSearch = useDebounce(searchInput, 400);

  const { products, isLoading, error, fetchProducts, loadMoreProducts, hasMore, isLoadingMore, totalProducts } = useProductStore();

  // Sync debounced search → URL
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      setSearch(debouncedSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Fetch whenever URL filters change
  useEffect(() => {
    fetchProducts(filters.page, null, {
      category: filters.category,
      search: filters.search,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice < MAX_PRICE ? filters.maxPrice : undefined,
      sort: filters.sort,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.category, filters.search, filters.minPrice, filters.maxPrice, filters.sort, filters.page]);

  const handleSearchChange = useCallback((value) => {
    setSearchInput(value);
  }, []);

  const handleCategoryChange = useCallback((cat) => {
    setCategory(cat);
  }, [setCategory]);

  const handlePriceChange = useCallback((min, max) => {
    setPriceRange(min, max);
  }, [setPriceRange]);

  const handleSortChange = useCallback((sort) => {
    setSort(sort);
  }, [setSort]);

  const handleClearFilters = useCallback(() => {
    setSearchInput('');
    clearFilters();
  }, [clearFilters]);

  const handleOpenProduct = useCallback((product) => {
    setSelectedProduct(product);
    setModalOpen(true);
    document.body.classList.add('no-scroll');
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setSelectedProduct(null);
    document.body.classList.remove('no-scroll');
  }, []);

  const hasActiveFilters =
    filters.category ||
    filters.search ||
    filters.minPrice > 0 ||
    (filters.maxPrice && filters.maxPrice < MAX_PRICE) ||
    filters.sort !== 'newest';

  return (
    <>
      <SEO
        title="Sản Phẩm - Món Nhỏ Handmade"
        description="Khám phá bộ sưu tập sản phẩm handmade chính hãng từ Món Nhỏ. Vòng tay ấn tượng với thiết kế độc quyền."
      />

      <div className="min-h-screen bg-[oklch(98%_0.008_30)] pt-16 sm:pt-20">
        {/* Page header */}
        <div className="bg-[oklch(99%_0.006_30)] border-b border-[oklch(88%_0.04_340/0.25)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-brand-dark font-serif">Sản Phẩm</h1>
                <p className="text-sm text-gray-500 mt-1">
                  {isLoading ? 'Đang tải...' : (
                    <>
                      Hiển thị <span className="font-semibold text-gray-700">{products.length}</span>
                      {totalProducts > 0 && (
                        <> / <span className="font-semibold text-gray-700">{totalProducts}</span></>
                      )} sản phẩm
                      {hasActiveFilters && (
                        <button
                          onClick={handleClearFilters}
                          className="ml-3 text-brand-purple hover:text-brand-dark underline underline-offset-2 text-xs font-semibold"
                        >
                          Xóa bộ lọc
                        </button>
                      )}
                    </>
                  )}
                </p>
              </div>

              {/* Mobile filter toggle */}
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="md:hidden flex items-center gap-2 px-4 py-2.5 bg-brand-purple text-white rounded-xl hover:bg-brand-dark transition-colors text-sm font-semibold min-h-[44px]"
                aria-label="Mở bộ lọc"
              >
                <FiFilter className="w-4 h-4" />
                Lọc
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-white/80 inline-block" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Main layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="flex gap-6 lg:gap-8">
            {/* Filter Sidebar */}
            <div className="hidden md:block md:w-52 lg:w-60 flex-shrink-0 sticky top-20 self-start">
              <FilterSidebar
                filters={{ ...filters, minPrice: filters.minPrice || 0, maxPrice: filters.maxPrice || MAX_PRICE }}
                onSearchChange={handleSearchChange}
                onCategoryChange={handleCategoryChange}
                onPriceChange={handlePriceChange}
                onSortChange={handleSortChange}
                onClearFilters={handleClearFilters}
                products={products}
                totalCount={totalProducts}
                isOpen={true}
                onClose={() => {}}
              />
            </div>

            {/* Mobile Sidebar Drawer — hidden on md+ to prevent duplicate rendering */}
            <div className="md:hidden">
              <FilterSidebar
                filters={{ ...filters, minPrice: filters.minPrice || 0, maxPrice: filters.maxPrice || MAX_PRICE }}
                onSearchChange={handleSearchChange}
                onCategoryChange={handleCategoryChange}
                onPriceChange={handlePriceChange}
                onSortChange={handleSortChange}
                onClearFilters={handleClearFilters}
                products={products}
                totalCount={totalProducts}
                isOpen={isMobileSidebarOpen}
                onClose={() => setIsMobileSidebarOpen(false)}
              />
            </div>

            {/* Product Grid */}
            <div className="flex-1 min-w-0">
              {/* Active filter tags */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {filters.search && (
                    <span className="flex items-center gap-1.5 bg-brand-purple/10 text-brand-purple text-xs font-semibold px-3 py-1.5 rounded-full">
                      Tìm: "{filters.search}"
                      <button onClick={() => { setSearchInput(''); setSearch(''); }} className="hover:text-brand-dark">
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.category && (
                    <span className="flex items-center gap-1.5 bg-brand-purple/10 text-brand-purple text-xs font-semibold px-3 py-1.5 rounded-full">
                      Danh mục: {filters.category}
                      <button onClick={() => setCategory('')} className="hover:text-brand-dark">
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {(filters.minPrice > 0 || (filters.maxPrice && filters.maxPrice < MAX_PRICE)) && (
                    <span className="flex items-center gap-1.5 bg-brand-purple/10 text-brand-purple text-xs font-semibold px-3 py-1.5 rounded-full">
                      Giá đã lọc
                      <button onClick={() => setPriceRange(0, MAX_PRICE)} className="hover:text-brand-dark">
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}

              {/* Error state */}
              {error && !isLoading && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800">
                  <p className="font-semibold text-sm">Có lỗi xảy ra</p>
                  <p className="text-xs mt-1 opacity-80">{error}</p>
                  <button
                    onClick={() => fetchProducts(1, null, filters)}
                    className="mt-3 text-xs font-semibold text-red-600 hover:text-red-800 underline"
                  >
                    Thử lại
                  </button>
                </div>
              )}

              {/* Grid */}
              {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                  {Array.from({ length: 8 }).map((_, idx) => (
                    <div key={idx} className={idx === 0 ? 'col-span-2' : ''}>
                      <ProductSkeleton />
                    </div>
                  ))}
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                  {products.map((product, index) => (
                    <div
                      key={product.id}
                      className={index === 0 ? 'col-span-2' : ''}
                    >
                      <ProductCard
                        product={product}
                        onOpen={handleOpenProduct}
                        featured={index === 0}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  type={filters.search ? 'search' : 'products'}
                  action={hasActiveFilters ? handleClearFilters : null}
                  actionLabel="Xóa bộ lọc"
                />
              )}

              {/* Load more */}
              {!isLoading && hasMore && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={() => loadMoreProducts({ category: filters.category, search: filters.search })}
                    disabled={isLoadingMore}
                    className="px-10 py-3 bg-brand-purple text-white rounded-full font-semibold hover:bg-brand-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
                  >
                    {isLoadingMore
                      ? 'Đang tải...'
                      : `Xem thêm (còn ${totalProducts - products.length} sản phẩm)`}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <ProductModal
        open={modalOpen}
        product={selectedProduct}
        onClose={handleCloseModal}
      />
    </>
  );
}

