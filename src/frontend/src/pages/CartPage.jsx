import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axiosClient from '../api/axiosClient';
import { useCart } from '../contexts/CartContext';
import { getGuestCartTotalQuantity } from '../services/guestCartService';

// Zalo contact info
const ZALO_PHONE = '0123456789'; // Replace with actual Zalo number
const ZALO_URL = `https://zalo.me/${ZALO_PHONE}`;

export default function CartPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingItemId, setLoadingItemId] = useState(null);
  
  const { 
    fetchCartCount, 
    fetchApiCart,
    isLoggedIn,
    getMergedCartItems,
    updateGuestItem,
    removeGuestItem,
    guestCartItems,
  } = useCart();

  const [mergedItems, setMergedItems] = useState([]);
  const isUserLoggedIn = isLoggedIn();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setIsLoading(true);
      
      if (isUserLoggedIn) {
        await fetchApiCart();
      }
      
      // Get merged cart items
      const items = getMergedCartItems();
      setMergedItems(items);
      fetchCartCount();
    } catch (error) {
      console.error('Failed to load cart:', error);
      // Still show guest cart even if API fails
      const items = getMergedCartItems();
      setMergedItems(items);
    } finally {
      setIsLoading(false);
    }
  };

  // Update merged items when context changes
  useEffect(() => {
    const items = getMergedCartItems();
    setMergedItems(items);
  }, [getMergedCartItems, guestCartItems]);

  const handleUpdateQuantity = async (item, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setLoadingItemId(item.id);
      
      if (item.isGuest) {
        // Update guest cart item
        updateGuestItem(item.productId, newQuantity);
        setMergedItems(prev => 
          prev.map(i => i.id === item.id ? { ...i, quantity: newQuantity } : i)
        );
        toast.success('Cập nhật số lượng thành công');
      } else {
        // Update API cart item
        await axiosClient.put(`/cart/items/${item.id}`, {
          quantity: newQuantity
        });
        setMergedItems(prev =>
          prev.map(i => i.id === item.id ? { ...i, quantity: newQuantity } : i)
        );
        toast.success('Cập nhật số lượng thành công');
        fetchCartCount();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể cập nhật số lượng');
    } finally {
      setLoadingItemId(null);
    }
  };

  const handleRemoveItem = async (item) => {
    const isConfirmed = window.confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?');
    if (!isConfirmed) return;

    try {
      setLoadingItemId(item.id);
      
      if (item.isGuest) {
        // Remove from guest cart
        removeGuestItem(item.productId);
        setMergedItems(prev => prev.filter(i => i.id !== item.id));
        toast.success('Đã xóa khỏi giỏ hàng');
      } else {
        // Remove from API cart
        await axiosClient.delete(`/cart/items/${item.id}`);
        setMergedItems(prev => prev.filter(i => i.id !== item.id));
        toast.success('Đã xóa khỏi giỏ hàng');
        fetchCartCount();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể xóa sản phẩm');
    } finally {
      setLoadingItemId(null);
    }
  };

  const handleContactZalo = () => {
    window.open(ZALO_URL, '_blank');
  };

  const guestItemCount = getGuestCartTotalQuantity();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  if (mergedItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Giỏ hàng trống</h2>
          <p className="text-gray-600 mb-6">Hãy thêm sản phẩm để tiếp tục mua sắm</p>
          <a
            href="/products"
            className="inline-block bg-brand-purple text-white px-6 py-3 rounded-full font-semibold hover:bg-brand-dark transition-all hover:shadow-lg hover:shadow-brand-purple/25 hover:-translate-y-0.5"
          >
            Tiếp tục mua sắm
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Giỏ hàng của bạn</h1>

        {/* Guest cart notification */}
        {guestItemCount > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-amber-800 font-medium">
                Bạn có <span className="font-bold">{guestItemCount} sản phẩm</span> được lưu tạm thời.
              </p>
              <p className="text-amber-700 text-sm mt-1">
                {isUserLoggedIn 
                  ? 'Vào trang Giỏ hàng để đồng bộ các sản phẩm này với tài khoản.'
                  : 'Đăng nhập để lưu giỏ hàng vĩnh viễn và thanh toán.'}
              </p>
              {!isUserLoggedIn && (
                <a 
                  href="/login" 
                  className="inline-flex items-center gap-1 text-brand-purple font-semibold text-sm mt-2 hover:underline"
                >
                  Đăng nhập ngay
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Sản phẩm</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Đơn giá</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Số lượng</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Thành tiền</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {mergedItems.map((item) => {
                  const productData = item.product || item;
                  const itemPrice = productData?.price || 0;
                  const itemImage = productData?.imageUrl || productData?.image;
                  const itemName = productData?.name || 'Sản phẩm';

                  return (
                    <tr key={item.id} className={`hover:bg-gray-50 transition-colors ${loadingItemId === item.id ? 'opacity-60' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img
                              src={itemImage}
                              alt={itemName}
                              className="w-20 h-20 object-cover rounded"
                            />
                            {item.isGuest && (
                              <div className="absolute -top-2 -right-2 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center" title="Sản phẩm tạm">
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{itemName}</h3>
                            {item.isGuest && (
                              <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded mt-1 inline-block">
                                Chưa lưu
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="text-gray-800 font-semibold">
                          {itemPrice?.toLocaleString('vi-VN')} đ
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                            disabled={loadingItemId === item.id || item.quantity <= 1}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center font-semibold text-gray-700"
                          >
                            -
                          </button>
                          <span className="text-gray-800 font-semibold w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                            disabled={loadingItemId === item.id}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center font-semibold text-gray-700"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-brand-purple font-bold text-lg">
                          {(itemPrice * item.quantity)?.toLocaleString('vi-VN')} đ
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleRemoveItem(item)}
                          disabled={loadingItemId === item.id}
                          className="px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 px-6 py-4 border-t flex justify-between items-center">
            <div className="text-lg font-semibold text-gray-700">Tổng cộng:</div>
            <div className="text-3xl font-bold text-brand-purple">
              {mergedItems
                .reduce((sum, item) => {
                  const price = item.product?.price || item.price || 0;
                  return sum + price * item.quantity;
                }, 0)
                .toLocaleString('vi-VN')}{' '}
              đ
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <a
            href="/"
            className="flex-1 bg-white border-2 border-gray-300 text-gray-800 px-6 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors text-center"
          >
            Tiếp tục mua sắm
          </a>
          
          {isUserLoggedIn ? (
            <button
              onClick={() => {
                toast.success('Chức năng thanh toán sẽ được cập nhật soon!');
              }}
              className="flex-1 bg-brand-purple text-white px-6 py-3 rounded-full font-semibold hover:bg-brand-dark transition-colors"
            >
              Thanh toán
            </button>
          ) : (
            <button
              onClick={handleContactZalo}
              className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 2.17.7 4.18 1.88 5.82L2 22l4.18-1.88C7.82 21.3 9.83 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.85 0-3.57-.63-4.93-1.69l-.35-.26-2.54 1.14 1.14-2.54-.26-.35A7.95 7.95 0 014 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z"/>
              </svg>
              Liên hệ qua Zalo
            </button>
          )}
        </div>

        {/* Login prompt for guests */}
        {!isUserLoggedIn && (
          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-3">
              Muốn thanh toán và lưu giỏ hàng?
            </p>
            <a
              href="/login"
              className="inline-flex items-center gap-2 text-brand-purple font-semibold hover:underline"
            >
              Đăng nhập ngay
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
