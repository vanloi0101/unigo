import React from 'react';

/**
 * Hiệu ứng Skeleton dành cho ProductCard sử dụng Tailwind Pulse
 * Skeleton này thay cho component quay tròn Loading Spinner cũ rích.
 */
export default function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-2 sm:p-4 shadow-sm border border-gray-100 animate-pulse h-full flex flex-col">
      {/* Khối hộp Ảnh mô phỏng */}
      <div className="relative aspect-[4/5] mb-3 sm:mb-4 bg-gray-200 rounded-xl sm:rounded-2xl w-full flex-shrink-0"></div>
      
      <div className="space-y-2 sm:space-3 flex-grow flex flex-col">
        {/* Phân loại (Category) */}
        <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/4"></div>
        
        {/* Tiêu đề Sản Phẩm */}
        <div className="h-4 sm:h-5 bg-gray-200 rounded w-3/4"></div>
        
        <div className="flex items-center justify-between pt-2 mt-auto">
          {/* Giá tiền */}
          <div className="h-4 sm:h-5 bg-gray-200 rounded w-1/3"></div>
          
          {/* Nút hành động (Add to Cart icon) */}
          <div className="h-7 w-7 sm:h-8 sm:w-8 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
