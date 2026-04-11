import React, { createContext, useState, useCallback } from 'react';
import axiosClient from '../api/axiosClient';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = useCallback(async () => {
    try {
      const data = await axiosClient.get('/cart');
      const items = data.items || [];
      const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalQuantity);
    } catch (error) {
      console.error('Failed to fetch cart count:', error);
    }
  }, []);

  const value = {
    cartCount,
    fetchCartCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error('useCart phải được dùng bên trong CartProvider');
  }
  return context;
}
