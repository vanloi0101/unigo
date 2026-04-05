import React from 'react';
import { FaTimes } from 'react-icons/fa';

export default function ProductModal({ open, product, onClose }) {
  if (!open || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" aria-modal="true" role="dialog">
      <div className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur text-brand-dark rounded-full flex items-center justify-center hover:bg-brand-pink transition-colors">
          <FaTimes />
        </button>

        <div className="md:w-1/2 bg-gray-50 flex-shrink-0">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover max-h-[50vh] md:max-h-none" />
        </div>

        <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center overflow-y-auto">
          <div className="uppercase tracking-widest text-xs font-bold text-brand-purple mb-2">Món Nhỏ Handmade</div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark mb-2">{product.name}</h2>
          <div className="flex items-center gap-4 mb-6">
            <p className="text-2xl font-bold text-[#e2948a]">{product.price}</p>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">Còn hàng</span>
          </div>

          <p className="text-gray-600 mb-8 leading-relaxed text-lg">{product.desc}</p>

          <div className="mt-8 flex gap-4">
            <a href={`https://zalo.me/0346450546?text=Mình muốn đặt ${encodeURIComponent(product.name)} giá ${product.price}`} target="_blank" rel="noreferrer" className="flex-1 bg-brand-dark text-white text-center py-4 rounded-full font-bold hover:bg-black transition-colors shadow-lg shadow-brand-dark/20">Đặt hàng qua Zalo</a>
            {product.shopeeLink && (
              <a href={product.shopeeLink} target="_blank" rel="noreferrer" className="flex-1 bg-orange-500 text-white text-center py-4 rounded-full font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20">Mua trên Shopee</a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
