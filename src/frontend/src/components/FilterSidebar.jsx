import React, { useCallback } from 'react';
import { FiFilter, FiX, FiSearch, FiChevronDown } from 'react-icons/fi';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const CATEGORIES = [
  { value: '', label: 'Tất Cả' },
  { value: 'vong-tay', label: 'Vòng Tay' },
  { value: 'day-chuyen', label: 'Dây Chuyền' },
  { value: 'bong-tai', label: 'Bông Tai' },
  { value: 'nhan', label: 'Nhẫn' },
  { value: 'khac', label: 'Khác' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price-low', label: 'Giá thấp → cao' },
  { value: 'price-high', label: 'Giá cao → thấp' },
  { value: 'popular', label: 'Phổ biến nhất' },
];

const MAX_PRICE = 2000000;

const formatVND = (value) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

/**
 * FilterSidebar — Sidebar lọc sản phẩm với:
 * - Tìm kiếm theo tên
 * - Lọc theo danh mục
 * - Khoảng giá (rc-slider)
 * - Sắp xếp
 * - Mobile drawer overlay
 */
export default function FilterSidebar({
  filters,
  onSearchChange,
  onCategoryChange,
  onPriceChange,
  onSortChange,
  onClearFilters,
  products = [],
  totalCount = 0,
  isOpen = false,
  onClose,
}) {
  const hasActiveFilters =
    filters.category ||
    filters.search ||
    filters.minPrice > 0 ||
    filters.maxPrice < MAX_PRICE ||
    filters.sort !== 'newest';

  const handlePriceChange = useCallback(
    ([min, max]) => {
      onPriceChange(min, max);
    },
    [onPriceChange]
  );

  // Đếm số sản phẩm trong mỗi category từ danh sách đang có
  const countByCategory = useCallback(
    (catValue) => {
      if (!catValue) return totalCount;
      return products.filter((p) => p.category === catValue).length;
    },
    [products, totalCount]
  );

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 text-base">
          <FiFilter className="w-4 h-4 text-brand-purple" />
          Bộ Lọc
        </h3>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-xs text-brand-purple hover:text-brand-dark font-semibold underline underline-offset-2"
            >
              Xóa tất cả
            </button>
          )}
          {/* Close button (mobile) */}
          <button
            onClick={onClose}
            className="md:hidden p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Đóng bộ lọc"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
        {/* Search */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Tìm kiếm
          </label>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tên sản phẩm..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/40 focus:border-brand-purple transition-all"
            />
            {filters.search && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Danh mục
          </label>
          <div className="space-y-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => { onCategoryChange(cat.value); onClose?.(); }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all flex items-center justify-between
                  ${filters.category === cat.value
                    ? 'bg-brand-purple text-white font-semibold shadow-sm shadow-brand-purple/30'
                    : 'text-gray-700 hover:bg-gray-50 font-medium'
                  }`}
              >
                <span>{cat.label}</span>
                {!cat.value && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${filters.category === cat.value ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {totalCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            Khoảng giá
          </label>
          <div className="px-1">
            <Slider
              range
              min={0}
              max={MAX_PRICE}
              step={10000}
              value={[filters.minPrice || 0, filters.maxPrice >= MAX_PRICE ? MAX_PRICE : (filters.maxPrice || MAX_PRICE)]}
              onChange={handlePriceChange}
              styles={{
                track: { backgroundColor: '#7c3aed' },
                handle: { borderColor: '#7c3aed', backgroundColor: '#7c3aed', opacity: 1, boxShadow: '0 0 0 3px rgba(124,58,237,0.15)' },
                rail: { backgroundColor: '#e5e7eb' },
              }}
            />
          </div>
          <div className="flex items-center justify-between mt-3 text-xs text-gray-500 font-medium">
            <span className="bg-gray-100 px-2 py-1 rounded-lg">
              {formatVND(filters.minPrice || 0)}
            </span>
            <span className="text-gray-300">—</span>
            <span className="bg-gray-100 px-2 py-1 rounded-lg">
              {filters.maxPrice >= MAX_PRICE ? 'Không giới hạn' : formatVND(filters.maxPrice || MAX_PRICE)}
            </span>
          </div>
          {(filters.minPrice > 0 || (filters.maxPrice && filters.maxPrice < MAX_PRICE)) && (
            <button
              onClick={() => onPriceChange(0, MAX_PRICE)}
              className="mt-2 text-xs text-brand-purple hover:underline"
            >
              Đặt lại khoảng giá
            </button>
          )}
        </div>

        {/* Sort */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Sắp xếp
          </label>
          <div className="relative">
            <select
              value={filters.sort || 'newest'}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/40 focus:border-brand-purple bg-white cursor-pointer transition-all"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:relative left-0 top-0 h-full md:h-auto z-50 md:z-auto
          w-72 md:w-56 bg-white
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0 shadow-none'}
          md:rounded-2xl md:border md:border-gray-100 md:shadow-sm
          flex flex-col
        `}
        aria-label="Bộ lọc sản phẩm"
      >
        {sidebarContent}
      </aside>
    </>
  );
}
