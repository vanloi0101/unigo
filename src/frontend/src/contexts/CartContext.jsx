import React, { createContext, useState, useCallback, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import {
  getGuestCart,
  addToGuestCart,
  updateGuestCartQuantity,
  removeFromGuestCart,
  clearGuestCart,
  hasGuestCartItems,
  getGuestCartTotalQuantity,
  getGuestCartForSync,
} from '../services/guestCartService';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const [apiCartItems, setApiCartItems] = useState([]);
  const [guestCartItems, setGuestCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);

  // Check if user is logged in
  const isLoggedIn = useCallback(() => {
    return !!localStorage.getItem('token');
  }, []);

  // Load guest cart on mount
  useEffect(() => {
    setGuestCartItems(getGuestCart());
  }, []);

  // Calculate total cart count (API + guest)
  const calculateTotalCount = useCallback((apiItems, guestItems) => {
    const apiCount = apiItems.reduce((sum, item) => sum + item.quantity, 0);
    const guestCount = guestItems.reduce((sum, item) => sum + item.quantity, 0);
    
    // If logged in, count both (API items will be shown, guest items pending sync)
    // If not logged in, only count guest items
    if (isLoggedIn()) {
      return apiCount + guestCount;
    }
    return guestCount;
  }, [isLoggedIn]);

  // Fetch cart from API (for authenticated users)
  const fetchApiCart = useCallback(async () => {
    if (!isLoggedIn()) {
      setApiCartItems([]);
      return [];
    }

    try {
      const data = await axiosClient.get('/cart');
      const items = data.items || [];
      setApiCartItems(items);
      return items;
    } catch (error) {
      console.error('Failed to fetch API cart:', error);
      setApiCartItems([]);
      return [];
    }
  }, [isLoggedIn]);

  // Fetch cart count (updates badge)
  const fetchCartCount = useCallback(async () => {
    try {
      const currentGuestItems = getGuestCart();
      setGuestCartItems(currentGuestItems);

      if (isLoggedIn()) {
        const apiItems = await fetchApiCart();
        setCartCount(calculateTotalCount(apiItems, currentGuestItems));
      } else {
        setCartCount(getGuestCartTotalQuantity());
      }
    } catch (error) {
      console.error('Failed to fetch cart count:', error);
      setCartCount(getGuestCartTotalQuantity());
    }
  }, [isLoggedIn, fetchApiCart, calculateTotalCount]);

  // Add item to cart (handles both guest and authenticated)
  const addItemToCart = useCallback(async (product, quantity = 1) => {
    if (isLoggedIn()) {
      // Authenticated: call API
      try {
        await axiosClient.post('/cart', {
          productId: product.id,
          quantity
        });
        await fetchCartCount();
        return { success: true, message: 'Đã thêm vào giỏ hàng thành công' };
      } catch (error) {
        if (error.response?.status === 401) {
          // Token expired, treat as guest
          const updatedCart = addToGuestCart(product, quantity);
          setGuestCartItems(updatedCart);
          setCartCount(getGuestCartTotalQuantity());
          return { success: true, message: 'Đã thêm vào giỏ hàng tạm thời' };
        }
        throw error;
      }
    } else {
      // Guest: use localStorage
      const updatedCart = addToGuestCart(product, quantity);
      setGuestCartItems(updatedCart);
      setCartCount(getGuestCartTotalQuantity());
      return { success: true, message: 'Đã thêm vào giỏ hàng tạm thời' };
    }
  }, [isLoggedIn, fetchCartCount]);

  // Update guest cart item quantity
  const updateGuestItem = useCallback((productId, newQuantity) => {
    const updatedCart = updateGuestCartQuantity(productId, newQuantity);
    setGuestCartItems(updatedCart);
    fetchCartCount();
  }, [fetchCartCount]);

  // Remove guest cart item
  const removeGuestItem = useCallback((productId) => {
    const updatedCart = removeFromGuestCart(productId);
    setGuestCartItems(updatedCart);
    fetchCartCount();
  }, [fetchCartCount]);

  // Sync guest cart with server after login
  const syncGuestCartWithServer = useCallback(async () => {
    if (!hasGuestCartItems()) {
      return { success: true, message: 'No items to sync' };
    }

    try {
      setIsLoading(true);
      const guestItems = getGuestCartForSync();
      
      await axiosClient.post('/cart/sync', { items: guestItems });
      
      // Clear guest cart after successful sync
      clearGuestCart();
      setGuestCartItems([]);
      
      // Reload cart from server
      await fetchCartCount();
      
      return { success: true, message: 'Đã đồng bộ giỏ hàng thành công' };
    } catch (error) {
      console.error('Failed to sync guest cart:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Không thể đồng bộ giỏ hàng' 
      };
    } finally {
      setIsLoading(false);
    }
  }, [fetchCartCount]);

  // Check if should show sync modal after login
  const checkAndShowSyncModal = useCallback(() => {
    if (isLoggedIn() && hasGuestCartItems()) {
      setShowSyncModal(true);
      return true;
    }
    return false;
  }, [isLoggedIn]);

  // Close sync modal
  const closeSyncModal = useCallback(() => {
    setShowSyncModal(false);
  }, []);

  // Handle merge confirmation
  const handleMergeConfirm = useCallback(async () => {
    const result = await syncGuestCartWithServer();
    closeSyncModal();
    return result;
  }, [syncGuestCartWithServer, closeSyncModal]);

  // Handle merge decline (keep guest cart for next time)
  const handleMergeDecline = useCallback(() => {
    closeSyncModal();
  }, [closeSyncModal]);

  // Get merged cart items for display
  const getMergedCartItems = useCallback(() => {
    if (!isLoggedIn()) {
      // Not logged in: only show guest items
      return guestCartItems.map(item => ({
        ...item,
        id: `guest-${item.productId}`,
        isGuest: true,
      }));
    }

    // Logged in: show API items + guest items (pending sync)
    const apiItemsFormatted = apiCartItems.map(item => ({
      ...item,
      isGuest: false,
    }));

    const guestItemsFormatted = guestCartItems.map(item => ({
      ...item,
      id: `guest-${item.productId}`,
      isGuest: true,
    }));

    return [...apiItemsFormatted, ...guestItemsFormatted];
  }, [isLoggedIn, apiCartItems, guestCartItems]);

  // Clear all cart state (for logout)
  const clearCartState = useCallback(() => {
    setApiCartItems([]);
    setCartCount(getGuestCartTotalQuantity());
    // Note: DO NOT clear guest cart on logout per requirements
  }, []);

  const value = {
    // State
    cartCount,
    apiCartItems,
    guestCartItems,
    isLoading,
    showSyncModal,
    
    // Computed
    isLoggedIn,
    hasGuestCartItems,
    getMergedCartItems,
    
    // Actions
    fetchCartCount,
    fetchApiCart,
    addItemToCart,
    updateGuestItem,
    removeGuestItem,
    syncGuestCartWithServer,
    checkAndShowSyncModal,
    closeSyncModal,
    handleMergeConfirm,
    handleMergeDecline,
    clearCartState,
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
