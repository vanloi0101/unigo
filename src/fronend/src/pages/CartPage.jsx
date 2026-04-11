import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axiosClient from '../api/axiosClient';
import { useCart } from '../contexts/CartContext';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingItemId, setLoadingItemId] = useState(null);
  const { fetchCartCount } = useCart();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const data = await axiosClient.get('/cart');
      setCartItems(data.items || []);
      fetchCartCount();
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Vui lòng đăng nhập để xem giỏ hàng');
        window.location.href = '/login';
      } else {
        toast.error(error.response?.data?.message || 'Không thể tải giỏ hàng');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setLoadingItemId(itemId);
      await axiosClient.put(`/cart/items/${itemId}`, {
        quantity: newQuantity
      });

      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
      toast.success('Cập nhật số lượng thành công');
      fetchCartCount();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể cập nhật số lượng');
    } finally {
      setLoadingItemId(null);
    }
  };

  const handleRemoveItem = async (itemId) => {
    const isConfirmed = window.confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?');
    if (!isConfirmed) return;

    try {
      setLoadingItemId(itemId);
      await axiosClient.delete(`/cart/items/${itemId}`);

      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
      toast.success('Đã xóa khỏi giỏ hàng');
      fetchCartCount();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể xóa sản phẩm');
    } finally {
      setLoadingItemId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Giỏ hàng trống</h2>
          <p className="text-gray-600 mb-6">Hãy thêm sản phẩm để tiếp tục mua sắm</p>
          <a
            href="/"
            className="inline-block bg-brand-purple text-white px-6 py-2 rounded-full font-semibold hover:bg-brand-dark transition-colors"
          >
            Tiếp tục mua sắm
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Giỏ hàng của bạn</h1>

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
                {cartItems.map((item) => (
                  <tr key={item.id} className={`hover:bg-gray-50 transition-colors ${loadingItemId === item.id ? 'opacity-60' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.product?.image || item.image}
                          alt={item.product?.name || item.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-800">{item.product?.name || item.name}</h3>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-gray-800 font-semibold">
                        {(item.product?.price || item.price)?.toLocaleString('vi-VN')} đ
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={loadingItemId === item.id || item.quantity <= 1}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center font-semibold text-gray-700"
                        >
                          -
                        </button>
                        <span className="text-gray-800 font-semibold w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={loadingItemId === item.id}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center font-semibold text-gray-700"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-brand-purple font-bold text-lg">
                        {((item.product?.price || item.price) * item.quantity)?.toLocaleString('vi-VN')} đ
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={loadingItemId === item.id}
                        className="px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 px-6 py-4 border-t flex justify-between items-center">
            <div className="text-lg font-semibold text-gray-700">Tổng cộng:</div>
            <div className="text-3xl font-bold text-brand-purple">
              {cartItems
                .reduce((sum, item) => sum + (item.product?.price || item.price) * item.quantity, 0)
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
          <button
            onClick={() => {
              toast.success('Chức năng thanh toán sẽ được cập nhật soon!');
            }}
            className="flex-1 bg-brand-purple text-white px-6 py-3 rounded-full font-semibold hover:bg-brand-dark transition-colors"
          >
            Thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}
