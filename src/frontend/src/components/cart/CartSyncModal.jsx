import React from 'react';
import { useCart } from '../../contexts/CartContext';
import { getGuestCartTotalQuantity } from '../../services/guestCartService';

/**
 * Modal to prompt user to merge guest cart after login
 */
export default function CartSyncModal() {
  const { 
    showSyncModal, 
    handleMergeConfirm, 
    handleMergeDecline,
    isLoading,
    guestCartItems 
  } = useCart();

  if (!showSyncModal) return null;

  const itemCount = getGuestCartTotalQuantity();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleMergeDecline}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-purple to-brand-pink p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Giỏ hàng tạm thời</h2>
              <p className="text-white/80 text-sm">Bạn có sản phẩm đang chờ</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-700 font-medium mb-2">
                Chúng tôi tìm thấy <span className="text-brand-purple font-bold">{itemCount} sản phẩm</span> trong giỏ hàng tạm thời của bạn.
              </p>
              <p className="text-gray-500 text-sm">
                Bạn có muốn gộp chúng vào giỏ hàng chính không?
              </p>
            </div>
          </div>

          {/* Preview items */}
          {guestCartItems.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-3 mb-6 max-h-32 overflow-y-auto">
              {guestCartItems.slice(0, 3).map((item, index) => (
                <div key={item.productId} className="flex items-center gap-3 py-2 border-b border-gray-200 last:border-0">
                  <div className="w-10 h-10 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                    {item.product?.imageUrl && (
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {item.product?.name || 'Sản phẩm'}
                    </p>
                    <p className="text-xs text-gray-500">Số lượng: {item.quantity}</p>
                  </div>
                </div>
              ))}
              {guestCartItems.length > 3 && (
                <p className="text-xs text-gray-500 text-center pt-2">
                  +{guestCartItems.length - 3} sản phẩm khác
                </p>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleMergeDecline}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Để sau
            </button>
            <button
              onClick={handleMergeConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-brand-purple text-white rounded-full font-semibold hover:bg-brand-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Đang gộp...
                </>
              ) : (
                'Gộp giỏ hàng'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
