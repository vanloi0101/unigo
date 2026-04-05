import React from 'react';

/**
 * Hiệu ứng Skeleton dành cho ProductCard sử dụng Tailwind Pulse
 * Skeleton này thay cho component quay tròn Loading Spinner cũ rích.
 */
export default function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse">
      {/* Khối hộp Ảnh mô phỏng */}
      <div className="relative aspect-square mb-4 bg-gray-200 rounded-xl w-full"></div>
      
      <div className="space-y-3">
        {/* Phân loại (Category) */}
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        
        {/* Tiêu đề Sản Phẩm */}
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        
        <div className="flex items-center justify-between pt-2">
          {/* Giá tiền */}
          <div className="h-5 bg-gray-200 rounded w-1/3"></div>
          
          {/* Nút hành động (Add to Cart icon) */}
          <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
