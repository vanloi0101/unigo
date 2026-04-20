import React, { useState, useEffect } from 'react';
import { productAPI } from '../../api/apiServices';

/**
 * ProductEmbed - Render product box trong nội dung bài viết
 * Usage trong content: <div class="product-box" data-product-id="1"></div>
 */
const ProductEmbed = ({ productId }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getById(productId);
        if (response.success) {
          setProduct(response.data);
        } else {
          setError('Không tìm thấy sản phẩm');
        }
      } catch (err) {
        setError('Lỗi khi tải sản phẩm');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="my-6 p-4 border border-gray-200 rounded-lg animate-pulse">
        <div className="flex gap-4">
          <div className="w-24 h-24 bg-gray-200 rounded" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-8 bg-gray-200 rounded w-24" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return null;
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="my-6 p-4 border border-brand-pink/30 rounded-lg bg-purple-50 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <img
            src={product.imageUrl || '/placeholder-product.png'}
            alt={product.name}
            className="w-full sm:w-32 h-32 object-cover rounded-lg"
            loading="lazy"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-1">
            {product.name}
          </h4>
          
          {product.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
              {product.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-auto">
            <span className="text-xl font-bold text-red-600">
              {formatPrice(product.price)}
            </span>

            <a
              href={`/products?id=${product.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-purple text-white text-sm font-medium rounded-lg hover:bg-brand-dark transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Mua ngay
            </a>
          </div>

          {/* Stock info */}
          {product.stock !== undefined && (
            <div className="mt-2">
              {product.stock > 0 ? (
                <span className="text-xs text-green-600">
                  ✓ Còn hàng ({product.stock} sản phẩm)
                </span>
              ) : (
                <span className="text-xs text-red-600">
                  ✗ Hết hàng
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductEmbed;
