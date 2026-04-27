import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/formatPrice';

// Default placeholder image
const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"%3E%3Crect fill="%23f3f4f6" width="400" height="500"/%3E%3Ctext x="200" y="250" text-anchor="middle" dy=".3em" fill="%23999" font-size="18"%3ENo Image%3C/text%3E%3C/svg%3E';

export default function ProductCard({ product, onOpen, featured = false }) {
  const navigate = useNavigate();
  const { addItemToCart, isLoggedIn } = useCart();
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Safe image URL with fallback
  // Priority: imageUrl > image > PLACEHOLDER_IMAGE
  const imageUrl = product?.imageUrl || product?.image || PLACEHOLDER_IMAGE;

  // Log missing images for debugging
  if (!product?.imageUrl && !product?.image) {
    console.warn(`⚠️ Product ${product.id} (${product.name}) has no imageUrl`, { product });
  }

  const handleAddToCart = async () => {
    if (isAdding) return;
    
    try {
      setIsAdding(true);
      const result = await addItemToCart(product, 1);
      
      if (result.success) {
        if (isLoggedIn()) {
          toast.success('Đã thêm vào giỏ hàng thành công');
        } else {
          toast.success(
            <div>
              <p className="font-medium">Đã thêm vào giỏ hàng tạm</p>
              <p className="text-xs text-gray-500 mt-1">Đăng nhập để lưu giỏ hàng vĩnh viễn</p>
            </div>
          );
        }
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error(error.response?.data?.message || 'Không thể thêm vào giỏ hàng');
    } finally {
      setIsAdding(false);
    }
  };

  // Handle image load error
  const handleImageError = () => {
    console.warn(`⚠️ Image failed to load for product ${product.id}: ${imageUrl}`);
    setImageError(true);
  };

  if (featured) {
    return (
      <article className="group product-card bg-white rounded-2xl sm:rounded-3xl border border-brand-purple/10 relative h-full flex flex-col sm:flex-row overflow-hidden">
        {product.tag && (
          <div className="absolute top-4 left-4 z-10 bg-white/90 text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-red-500 shadow-sm">
            {product.tag}
          </div>
        )}
        {/* Image — left column */}
        <div
          className="overflow-hidden relative sm:w-2/5 aspect-[4/5] sm:aspect-auto bg-gray-50 cursor-pointer flex-shrink-0"
          onClick={() => navigate(`/products/${product.id}`)}
        >
          <img
            src={imageError ? PLACEHOLDER_IMAGE : imageUrl}
            alt={product.name}
            className="w-full h-full object-cover img-zoom"
            loading="lazy"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-brand-dark/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onOpen(product); }}
              className="bg-white/90 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium text-xs sm:text-sm shadow hover:bg-white transition-colors"
            >
              Xem nhanh
            </button>
          </div>
        </div>
        {/* Content — right column */}
        <div className="flex-1 p-5 sm:p-8 flex flex-col justify-between">
          <div>
            <span className="inline-block text-xs font-semibold text-brand-purple bg-brand-purple/10 px-2.5 py-1 rounded-full mb-3">
              Nổi bật
            </span>
            <h3
              onClick={() => navigate(`/products/${product.id}`)}
              className="font-serif font-bold text-xl sm:text-2xl text-brand-dark mb-2 cursor-pointer hover:text-brand-purple transition-colors leading-snug"
            >
              {product.name}
            </h3>
            <p className="text-[#e2948a] font-bold text-lg sm:text-xl">
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through font-normal mr-2">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {product.price ? formatPrice(product.price) : 'N/A'}
            </p>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="flex-1 bg-brand-purple text-white font-semibold py-3 rounded-full hover:bg-brand-dark transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAdding ? 'Đang thêm...' : 'Thêm Giỏ Hàng'}
            </button>
            <button
              onClick={() => navigate(`/products/${product.id}`)}
              className="px-5 py-3 rounded-full border-2 border-brand-purple text-brand-purple font-semibold text-sm hover:bg-brand-purple hover:text-white transition-colors"
            >
              Xem
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group product-card bg-white rounded-2xl sm:rounded-3xl p-2 sm:p-3 border border-brand-purple/10 relative h-full flex flex-col">
      {product.tag && <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 bg-white/90 backdrop-blur text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-red-500 shadow-sm">{product.tag}</div>}
      <div className="overflow-hidden rounded-xl sm:rounded-2xl relative aspect-[4/5] bg-gray-50 cursor-pointer flex-shrink-0" onClick={() => navigate(`/products/${product.id}`)}>
        <img 
          src={imageError ? PLACEHOLDER_IMAGE : imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover img-zoom" 
          loading="lazy"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-brand-dark/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onOpen(product); }}
            className="bg-white/90 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium text-xs sm:text-sm shadow hover:bg-white transition-colors"
          >
            Xem nhanh
          </button>
        </div>
      </div>
      <div className="pt-3 sm:pt-5 pb-2 sm:pb-3 px-1 sm:px-2 text-center flex flex-col flex-grow">
        <h3
          onClick={() => navigate(`/products/${product.id}`)}
          className="font-serif font-bold text-sm sm:text-lg text-brand-dark mb-1 line-clamp-2 min-h-[2.5rem] sm:min-h-[3.5rem] cursor-pointer hover:text-brand-purple transition-colors"
        >
          {product.name}
        </h3>
        <p className="text-[#e2948a] font-bold text-sm sm:text-lg mb-2 sm:mb-4">
          {product.originalPrice && <span className="text-[10px] sm:text-sm text-gray-400 line-through font-normal mr-1 sm:mr-2">{formatPrice(product.originalPrice)}</span>}
          {product.price ? formatPrice(product.price) : 'N/A'}
        </p>
        <div className="flex gap-2 mt-auto">
          {/* Nút thêm vào giỏ hàng */}
          <button 
            onClick={handleAddToCart}
            disabled={isAdding}
            className="flex-1 bg-brand-light border border-brand-pink text-brand-purple hover:bg-brand-purple hover:text-white hover:border-brand-purple font-semibold py-2 sm:py-2.5 rounded-full transition-colors text-xs sm:text-sm min-h-[40px] touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAdding ? 'Đang thêm...' : 'Thêm Giỏ Hàng'}
          </button>
        </div>
      </div>
    </article>
  );
}
