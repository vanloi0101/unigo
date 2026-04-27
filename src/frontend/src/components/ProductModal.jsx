import React, { useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';

const PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"%3E%3Crect fill="%23f3f4f6" width="400" height="500"/%3E%3Ctext x="200" y="250" text-anchor="middle" dy=".3em" fill="%23999" font-size="18"%3ENo Image%3C/text%3E%3C/svg%3E';

const FOCUSABLE_SELECTORS =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function ProductModal({ open, product, onClose }) {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const navigate = useNavigate();

  // Close on Esc + focus trap
  useEffect(() => {
    if (!open) return;

    // Move focus into dialog
    closeButtonRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;

      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = Array.from(dialog.querySelectorAll(FOCUSABLE_SELECTORS));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last  = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open || !product) return null;

  const imageUrl = product.imageUrl || product.image || PLACEHOLDER;
  const price = typeof product.price === 'number' ? formatPrice(product.price) : product.price;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      aria-modal="true"
      role="dialog"
      aria-labelledby="product-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog panel */}
      <div
        ref={dialogRef}
        className="relative w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
      >
        {/* Close button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur text-brand-dark rounded-full flex items-center justify-center hover:bg-brand-pink transition-colors"
          aria-label="Đóng"
        >
          <FaTimes aria-hidden="true" />
        </button>

        {/* Image */}
        <div className="md:w-1/2 bg-gray-50 flex-shrink-0">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover max-h-[50vh] md:max-h-none"
            onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
          />
        </div>

        {/* Info */}
        <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center overflow-y-auto">
          <div className="uppercase tracking-widest text-xs font-bold text-brand-purple mb-2">Món Nhỏ Handmade</div>
          <h2
            id="product-modal-title"
            className="font-serif text-3xl md:text-4xl font-bold text-brand-dark mb-2"
          >
            {product.name}
          </h2>
          <div className="flex items-center gap-4 mb-6">
            <p className="text-2xl font-bold text-[#e2948a]">{price}</p>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">Còn hàng</span>
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed text-base">{product.description || product.desc}</p>

          {/* View detail link */}
          <button
            onClick={() => { onClose(); navigate(`/products/${product.id}`); }}
            className="mb-4 text-sm text-brand-purple underline underline-offset-2 hover:text-brand-dark text-left font-medium w-fit"
          >
            Xem trang chi tiết →
          </button>

          <div className="flex gap-3 flex-wrap">
            <a
              href={`https://zalo.me/0346450546?text=Mình muốn đặt ${encodeURIComponent(product.name)} giá ${price}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 min-w-[120px] bg-brand-dark text-white text-center py-3.5 rounded-full font-bold hover:bg-black transition-colors shadow-lg shadow-brand-dark/20"
            >
              Đặt qua Zalo
            </a>
            {product.shopeeLink && (
              <a
                href={product.shopeeLink}
                target="_blank"
                rel="noreferrer"
                className="flex-1 min-w-[120px] bg-orange-500 text-white text-center py-3.5 rounded-full font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
              >
                Mua trên Shopee
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
