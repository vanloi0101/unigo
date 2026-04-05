import React from 'react';
import useCartStore from '../store/useCartStore';
import toast from 'react-hot-toast';

export default function ProductCard({ product, onOpen }) {
  const { addToCart } = useCartStore();

  const handleAddToCart = () => {
    addToCart(product, 1);
    toast.success(`Đã thêm ${product.name} vào giỏ hàng!`);
  };

  return (
    <article className="group product-card bg-white rounded-3xl p-3 border border-gray-100 relative">
      {product.tag && <div className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full text-red-500 shadow-sm">{product.tag}</div>}
      <div className="overflow-hidden rounded-2xl relative aspect-[4/5] bg-gray-50 cursor-pointer" onClick={() => onOpen(product)}>
        <img src={product.image} alt={product.name} className="w-full h-full object-cover img-zoom" loading="lazy" />
        <div className="absolute inset-0 bg-brand-dark/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button className="bg-white/80 px-4 py-2 rounded-full font-medium text-sm">Xem nhanh</button>
        </div>
      </div>
      <div className="pt-5 pb-3 px-2 text-center">
        <h3 className="font-serif font-bold text-lg text-brand-dark mb-1">{product.name}</h3>
        <p className="text-[#e2948a] font-bold text-lg mb-4">
          {product.originalPrice && <span className="text-sm text-gray-400 line-through font-normal mr-2">{product.originalPrice}</span>}
          {product.price}
        </p>
        <div className="flex gap-2">
          {/* Nút thêm vào giỏ hàng */}
          <button 
            onClick={handleAddToCart}
            className="flex-1 bg-brand-light border border-brand-pink text-brand-purple hover:bg-brand-purple hover:text-white hover:border-brand-purple font-semibold py-2.5 rounded-full transition-colors text-sm"
          >
            Thêm Giỏ Hàng
          </button>
        </div>
      </div>
    </article>
  );
}
