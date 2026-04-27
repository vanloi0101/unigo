import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiShoppingCart, FiMinus, FiPlus, FiShare2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaBolt } from 'react-icons/fa';
import useProductStore from '../store/useProductStore';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/formatPrice';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import ProductSkeleton from '../components/common/ProductSkeleton';
import SEO from '../components/common/SEO';

const PLACEHOLDER =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"%3E%3Crect fill="%23f3f4f6" width="400" height="500"/%3E%3Ctext x="200" y="250" text-anchor="middle" dy=".3em" fill="%23999" font-size="18"%3ENo Image%3C/text%3E%3C/svg%3E';

// ─────────────────────────────────────────
// Sub-component: Image Gallery
// ─────────────────────────────────────────
function ImageGallery({ images = [], name = '' }) {
  const [activeIdx, setActiveIdx] = useState(0);

  const safeImages = images.length > 0 ? images : [PLACEHOLDER];
  const src = safeImages[activeIdx] || PLACEHOLDER;

  const prev = () => setActiveIdx((i) => (i - 1 + safeImages.length) % safeImages.length);
  const next = () => setActiveIdx((i) => (i + 1) % safeImages.length);

  return (
    <div className="flex flex-col gap-3">
      {/* Main image with zoom */}
      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gray-50 group">
        <Zoom zoomMargin={24}>
          <img
            src={src}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
          />
        </Zoom>

        {/* Arrow nav (only if multiple images) */}
        {safeImages.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur shadow flex items-center justify-center text-gray-700 hover:bg-white transition-all opacity-0 group-hover:opacity-100"
              aria-label="Ảnh trước"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur shadow flex items-center justify-center text-gray-700 hover:bg-white transition-all opacity-0 group-hover:opacity-100"
              aria-label="Ảnh sau"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Zoom hint */}
        <div className="absolute bottom-3 right-3 bg-black/40 text-white text-[10px] px-2 py-1 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          🔍 Bấm để phóng to
        </div>
      </div>

      {/* Thumbnail strip */}
      {safeImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {safeImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                idx === activeIdx ? 'border-brand-purple shadow-md' : 'border-transparent opacity-60 hover:opacity-90'
              }`}
              aria-label={`Ảnh ${idx + 1}`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = PLACEHOLDER; }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// Sub-component: Quantity Selector
// ─────────────────────────────────────────
function QuantitySelector({ value, onChange, max = 99 }) {
  return (
    <div className="flex items-center gap-0 border border-gray-200 rounded-xl overflow-hidden w-fit">
      <button
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
        aria-label="Giảm"
      >
        <FiMinus className="w-4 h-4" />
      </button>
      <span className="w-12 text-center font-semibold text-gray-800 text-sm select-none">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
        aria-label="Tăng"
      >
        <FiPlus className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────
// Sub-component: Sticky Add to Cart Bar
// ─────────────────────────────────────────
function StickyCartBar({ product, quantity, onAddToCart, isAdding }) {
  const [visible, setVisible] = useState(false);
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []);

  if (!product) return <div ref={sentinelRef} />;

  return (
    <>
      {/* Sentinel placed at Add to Cart button position */}
      <div ref={sentinelRef} />

      {/* Sticky bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-2xl px-4 py-3 transition-transform duration-300 ${
          visible ? 'translate-y-0' : 'translate-y-full'
        }`}
        aria-hidden={!visible}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          {/* Product mini info */}
          <img
            src={product.imageUrl || product.image || PLACEHOLDER}
            alt={product.name}
            className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-gray-100"
            onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-gray-900 truncate">{product.name}</p>
            <p className="text-brand-purple font-bold text-sm">{formatPrice(product.price)}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="hidden sm:block text-xs text-gray-500 font-medium">×{quantity}</span>
            <button
              onClick={onAddToCart}
              disabled={isAdding}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand-purple text-white rounded-xl text-sm font-bold hover:bg-brand-dark active:scale-95 transition-all disabled:opacity-60"
            >
              <FiShoppingCart className="w-4 h-4" />
              {isAdding ? 'Đang thêm...' : 'Thêm vào giỏ'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────
// Sub-component: Related Products
// ─────────────────────────────────────────
function RelatedProducts({ currentId, category, onOpen }) {
  const { products, fetchProducts, isLoading } = useProductStore();

  useEffect(() => {
    if (category) {
      fetchProducts(1, 12, { category });
    } else {
      fetchProducts(1, 12);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId, category]);

  const related = products
    .filter((p) => p.id !== currentId)
    .slice(0, 4);

  if (!isLoading && related.length === 0) return null;

  return (
    <section className="mt-16 pt-10 border-t border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Sản Phẩm Liên Quan</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
          : related.map((p) => (
              <ProductCard key={p.id} product={p} onOpen={onOpen} />
            ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// Main: ProductDetail Page
// ─────────────────────────────────────────
export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItemToCart, isLoggedIn } = useCart();
  const { getProductById } = useProductStore();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // Quick view modal for related products
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);

  // Fetch product
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    setQuantity(1);

    getProductById(id).then((data) => {
      if (cancelled) return;
      if (data) {
        setProduct(data);
      } else {
        setError('Không tìm thấy sản phẩm.');
      }
      setIsLoading(false);
    });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAddToCart = useCallback(async () => {
    if (!product || isAdding) return;
    setIsAdding(true);
    try {
      const result = await addItemToCart(product, quantity);
      if (result?.success !== false) {
        toast.success(
          isLoggedIn()
            ? `Đã thêm ${quantity} sản phẩm vào giỏ hàng`
            : 'Đã thêm vào giỏ hàng tạm'
        );
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Không thể thêm vào giỏ hàng');
    } finally {
      setIsAdding(false);
    }
  }, [product, quantity, isAdding, addItemToCart, isLoggedIn]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({ title: product?.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Đã sao chép link sản phẩm!');
    }
  }, [product]);

  const handleOpenModal = useCallback((p) => {
    setModalProduct(p);
    setModalOpen(true);
    document.body.classList.add('no-scroll');
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setModalProduct(null);
    document.body.classList.remove('no-scroll');
  }, []);

  // Build images array — product may only have single imageUrl
  const images = product
    ? [product.imageUrl, product.image].filter(Boolean)
    : [];

  // ── Loading state ──
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 animate-pulse">
            <div className="aspect-[4/5] bg-gray-200 rounded-2xl" />
            <div className="space-y-4 pt-4">
              <div className="h-3 bg-gray-200 rounded w-1/4" />
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-6 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-full mt-6" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded w-4/6" />
              <div className="flex gap-3 mt-10">
                <div className="h-12 bg-gray-200 rounded-xl flex-1" />
                <div className="h-12 bg-gray-200 rounded-xl flex-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Error state ──
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy sản phẩm</h2>
          <p className="text-gray-500 mb-6 text-sm">{error || 'Sản phẩm này không tồn tại hoặc đã bị xóa.'}</p>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-3 bg-brand-purple text-white rounded-xl font-semibold hover:bg-brand-dark transition-colors"
          >
            Xem tất cả sản phẩm
          </button>
        </div>
      </div>
    );
  }

  const inStock = product.stock === undefined || product.stock === null || product.stock > 0;

  return (
    <>
      <SEO
        title={`${product.name} - Món Nhỏ Handmade`}
        description={product.description || `Mua ${product.name} tại Món Nhỏ Handmade. Thiết kế độc quyền, chất lượng đảm bảo.`}
      />

      <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-brand-purple transition-colors">Trang chủ</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-brand-purple transition-colors">Sản phẩm</Link>
            <span>/</span>
            <span className="text-gray-800 font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>

          {/* Back button (mobile) */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-purple transition-colors mb-5 md:hidden"
          >
            <FiArrowLeft className="w-4 h-4" />
            Quay lại
          </button>

          {/* Main layout: image + info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-start">
            {/* Image Gallery */}
            <div className="md:sticky md:top-24">
              <ImageGallery images={images} name={product.name} />
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              {/* Category badge */}
              {product.category && (
                <Link
                  to={`/products?category=${encodeURIComponent(product.category)}`}
                  className="inline-block w-fit text-xs font-bold text-brand-purple bg-purple-50 px-3 py-1 rounded-full hover:bg-purple-100 transition-colors mb-3"
                >
                  {product.category}
                </Link>
              )}

              {/* Name */}
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-3">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-bold text-[#e2948a]">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-lg text-gray-400 line-through font-normal">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </span>
                  </>
                )}
              </div>

              {/* Stock badge */}
              <div className="mb-6">
                {inStock ? (
                  <span className="inline-flex items-center gap-1.5 text-green-700 bg-green-50 text-xs font-bold px-3 py-1.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Còn hàng {product.stock != null && `(${product.stock} sp)`}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-red-600 bg-red-50 text-xs font-bold px-3 py-1.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    Hết hàng
                  </span>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Mô tả</h3>
                  <p className="text-gray-600 leading-relaxed text-[15px]">{product.description}</p>
                </div>
              )}

              {/* Divider */}
              <hr className="border-gray-100 mb-6" />

              {/* Quantity + Add to Cart — Sentinel for sticky bar */}
              <StickyCartBar
                product={product}
                quantity={quantity}
                onAddToCart={handleAddToCart}
                isAdding={isAdding}
              />

              <div className="space-y-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Số lượng</p>
                    <QuantitySelector
                      value={quantity}
                      onChange={setQuantity}
                      max={product.stock || 99}
                    />
                  </div>
                  <div className="flex-1" />
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-purple transition-colors py-2 px-3 rounded-xl hover:bg-gray-100"
                    aria-label="Chia sẻ sản phẩm"
                  >
                    <FiShare2 className="w-4 h-4" />
                    Chia sẻ
                  </button>
                </div>

                {/* CTA buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding || !inStock}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-purple text-white rounded-xl font-bold hover:bg-brand-dark active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-brand-purple/30"
                  >
                    <FiShoppingCart className="w-5 h-5" />
                    {isAdding ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
                  </button>

                  <a
                    href={`https://zalo.me/0346450546?text=Mình muốn đặt ${encodeURIComponent(product.name)} giá ${formatPrice(product.price)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-dark text-white rounded-xl font-bold hover:bg-black active:scale-[0.98] transition-all shadow-lg shadow-brand-dark/20"
                  >
                    <FaBolt className="w-4 h-4" />
                    Đặt qua Zalo
                  </a>
                </div>

                {/* Shopee link */}
                {product.shopeeLink && (
                  <a
                    href={product.shopeeLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors w-full"
                  >
                    🛒 Mua trên Shopee
                  </a>
                )}
              </div>

              {/* Trust badges */}
              <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-3 gap-3 text-center">
                {[
                  { icon: '🔒', label: 'Thanh toán an toàn' },
                  { icon: '🚚', label: 'Giao hàng nhanh' },
                  { icon: '🔄', label: 'Đổi trả 7 ngày' },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center gap-1">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-[11px] text-gray-500 font-medium leading-tight">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Related Products */}
          <RelatedProducts
            currentId={product.id}
            category={product.category}
            onOpen={handleOpenModal}
          />
        </div>
      </div>

      {/* Quick View Modal (for related products) */}
      <ProductModal open={modalOpen} product={modalProduct} onClose={handleCloseModal} />
    </>
  );
}
