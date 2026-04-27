import React from 'react';
import { FaShoppingBag, FaSearch, FaBox, FaExclamationCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

/**
 * EmptyState Component - Displays when no data is available
 * Types: 'products', 'cart', 'search', 'orders', 'categories'
 */
const EmptyState = ({ 
  type = 'products', 
  message = null,
  action = null,
  actionLabel = 'Quay lại',
  actionPath = '/'
}) => {
  const states = {
    products: {
      icon: FaShoppingBag,
      title: 'Không có sản phẩm',
      description: 'Danh mục này hiện không có sản phẩm nào. Hãy thử chọn danh mục khác hoặc quay lại trang chủ.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    cart: {
      icon: FaShoppingBag,
      title: 'Giỏ hàng trống',
      description: 'Bạn chưa thêm sản phẩm nào vào giỏ hàng. Bắt đầu mua sắm ngay để tìm những sản phẩm yêu thích!',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    search: {
      icon: FaSearch,
      title: 'Không tìm thấy kết quả',
      description: 'Từ khóa của bạn không khớp với bất kỳ sản phẩm nào. Hãy thử từ khóa khác hoặc duyệt các danh mục.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    orders: {
      icon: FaBox,
      title: 'Chưa có đơn hàng',
      description: 'Bạn chưa có đơn hàng nào. Bắt đầu mua sắm để tạo đơn hàng đầu tiên!',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    categories: {
      icon: FaBox,
      title: 'Không có danh mục',
      description: 'Chưa có danh mục nào được tạo. Hãy tạo danh mục đầu tiên để bắt đầu.',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
    error: {
      icon: FaExclamationCircle,
      title: 'Có lỗi xảy ra',
      description: 'Không thể tải dữ liệu. Vui lòng thử lại sau.',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  };

  const config = states[type] || states.products;
  const Icon = config.icon;

  return (
    <div className="min-h-64 flex items-center justify-center py-12 px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className={`${config.bgColor} rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6`}>
          <Icon className={`${config.color} text-4xl`} />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {message ? message.title : config.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-6">
          {message ? message.description : config.description}
        </p>

        {/* Action Button */}
        {action ? (
          <button
            onClick={action}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition inline-block"
          >
            {actionLabel}
          </button>
        ) : (
          <Link
            to={actionPath}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition inline-block"
          >
            {actionLabel}
          </Link>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
