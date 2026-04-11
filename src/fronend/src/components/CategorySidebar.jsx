import React, { useMemo } from 'react';
import { FiFilter, FiX } from 'react-icons/fi';

/**
 * CategorySidebar - Bộ lọc danh mục sản phẩm
 * 
 * Props:
 * - products: mảng sản phẩm từ API
 * - selectedCategory: danh mục được chọn hiện tại
 * - onCategoryChange: callback khi chọn danh mục
 * - isLoading: trạng thái tải dữ liệu
 * - onClose: callback đóng sidebar (dành cho mobile)
 */
export default function CategorySidebar({
  products = [],
  selectedCategory = 'all',
  onCategoryChange,
  isLoading = false,
  onClose = null,
  isMobileOpen = false,
}) {
  // Trích xuất danh sách category độc nhất từ mảng sản phẩm
  const categories = useMemo(() => {
    if (!Array.isArray(products)) return [];
    
    const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))];
    return uniqueCategories.sort();
  }, [products]);

  const handleCategoryClick = (category) => {
    onCategoryChange(category);
    // Đóng sidebar nếu trên mobile
    if (onClose) {
      onClose();
    }
  };

  const handleReset = () => {
    onCategoryChange('all');
    if (onClose) {
      onClose();
    }
  };

  return (
    <aside className={`
      fixed md:relative left-0 top-0 h-full md:h-auto z-40 md:z-auto
      w-64 md:w-56 bg-white md:bg-transparent 
      transform transition-transform duration-300
      ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      border-r border-gray-200 md:border-r-0 md:border-t md:border-t-gray-200
      md:sticky md:top-0
    `}>
      {/* Close button (mobile only) */}
      {onClose && (
        <div className="md:hidden sticky top-0 bg-white px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <FiFilter className="w-5 h-5" />
            Lọc Danh Mục
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Đóng"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Sidebar content */}
      <div className="p-4 md:p-0 space-y-3">
        {/* Header (desktop only) */}
        <div className="hidden md:block md:sticky md:top-0 md:bg-white md:pt-4 md:pb-2">
          <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
            <FiFilter className="w-5 h-5" />
            Danh Mục
          </h3>
        </div>

        {/* Tất cả sản phẩm */}
        <button
          onClick={handleReset}
          disabled={isLoading}
          className={`
            w-full text-left px-4 py-3 rounded-lg transition-all font-medium
            flex items-center justify-between
            ${selectedCategory === 'all'
              ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/30'
              : 'text-gray-700 hover:bg-gray-50'
            }
            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
          `}
        >
          <span>Tất Cả</span>
          <span className="text-sm opacity-70">({products.length})</span>
        </button>

        {/* Danh sách danh mục */}
        <div className="space-y-2">
          {isLoading ? (
            // Skeleton loading
            Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="px-4 py-3 bg-gray-100 rounded-lg animate-pulse h-10"
              />
            ))
          ) : categories.length > 0 ? (
            categories.map((category) => {
              const count = products.filter(p => p.category === category).length;
              const isSelected = selectedCategory === category;

              return (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  disabled={isLoading}
                  className={`
                    w-full text-left px-4 py-3 rounded-lg transition-all font-medium capitalize
                    flex items-center justify-between
                    ${isSelected
                      ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/30'
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
                  `}
                >
                  <span>{category}</span>
                  <span className="text-sm opacity-70">({count})</span>
                </button>
              );
            })
          ) : (
            <p className="text-gray-500 text-sm px-4 py-3">Không có danh mục</p>
          )}
        </div>

        {/* Info */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-500 px-4">
          <p>Chọn một danh mục để lọc sản phẩm</p>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden -z-10"
          onClick={onClose}
        />
      )}
    </aside>
  );
}
