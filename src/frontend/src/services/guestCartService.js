/**
 * Guest Cart Service
 * Manages shopping cart for non-authenticated users using localStorage
 * Uses constant key: TEMP_GUEST_CART_V1
 */

const GUEST_CART_KEY = 'TEMP_GUEST_CART_V1';

/**
 * Get guest cart items from localStorage
 * @returns {Array} Array of cart items [{productId, quantity, product}]
 */
export const getGuestCart = () => {
  try {
    const cartData = localStorage.getItem(GUEST_CART_KEY);
    if (!cartData) return [];
    
    const parsed = JSON.parse(cartData);
    if (!Array.isArray(parsed)) {
      console.warn('Invalid guest cart data, resetting to empty array');
      return [];
    }
    return parsed;
  } catch (error) {
    console.error('Error parsing guest cart:', error);
    // Clear corrupted data
    localStorage.removeItem(GUEST_CART_KEY);
    return [];
  }
};

/**
 * Save guest cart to localStorage
 * @param {Array} cartItems - Array of cart items
 */
export const saveGuestCart = (cartItems) => {
  try {
    if (!Array.isArray(cartItems)) {
      console.error('Cannot save non-array to guest cart');
      return false;
    }
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cartItems));
    return true;
  } catch (error) {
    console.error('Error saving guest cart:', error);
    return false;
  }
};

/**
 * Add product to guest cart
 * @param {Object} product - Product object with id, name, price, imageUrl, etc.
 * @param {number} quantity - Quantity to add (default: 1)
 * @returns {Array} Updated cart items
 */
export const addToGuestCart = (product, quantity = 1) => {
  if (!product || !product.id) {
    console.error('Invalid product for guest cart');
    return getGuestCart();
  }

  const cartItems = getGuestCart();
  const existingIndex = cartItems.findIndex(item => item.productId === product.id);

  if (existingIndex !== -1) {
    // Update quantity if product exists
    cartItems[existingIndex].quantity += quantity;
  } else {
    // Add new item with product data for display
    cartItems.push({
      productId: product.id,
      quantity,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl || product.image,
        originalPrice: product.originalPrice,
      },
      isGuest: true, // Flag to identify guest items
    });
  }

  saveGuestCart(cartItems);
  return cartItems;
};

/**
 * Update item quantity in guest cart
 * @param {number} productId - Product ID
 * @param {number} newQuantity - New quantity
 * @returns {Array} Updated cart items
 */
export const updateGuestCartQuantity = (productId, newQuantity) => {
  const cartItems = getGuestCart();
  
  if (newQuantity <= 0) {
    return removeFromGuestCart(productId);
  }

  const updatedItems = cartItems.map(item => 
    item.productId === productId 
      ? { ...item, quantity: newQuantity }
      : item
  );

  saveGuestCart(updatedItems);
  return updatedItems;
};

/**
 * Remove product from guest cart
 * @param {number} productId - Product ID to remove
 * @returns {Array} Updated cart items
 */
export const removeFromGuestCart = (productId) => {
  const cartItems = getGuestCart();
  const updatedItems = cartItems.filter(item => item.productId !== productId);
  saveGuestCart(updatedItems);
  return updatedItems;
};

/**
 * Clear entire guest cart
 */
export const clearGuestCart = () => {
  localStorage.removeItem(GUEST_CART_KEY);
};

/**
 * Check if guest cart has items
 * @returns {boolean}
 */
export const hasGuestCartItems = () => {
  return getGuestCart().length > 0;
};

/**
 * Get total quantity of items in guest cart
 * @returns {number}
 */
export const getGuestCartTotalQuantity = () => {
  return getGuestCart().reduce((sum, item) => sum + item.quantity, 0);
};

/**
 * Get total price of guest cart
 * @returns {number}
 */
export const getGuestCartTotalPrice = () => {
  return getGuestCart().reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + (price * item.quantity);
  }, 0);
};

/**
 * Get cart items formatted for sync API
 * @returns {Array} Array of {productId, quantity}
 */
export const getGuestCartForSync = () => {
  return getGuestCart().map(item => ({
    productId: item.productId,
    quantity: item.quantity
  }));
};

export default {
  getGuestCart,
  saveGuestCart,
  addToGuestCart,
  updateGuestCartQuantity,
  removeFromGuestCart,
  clearGuestCart,
  hasGuestCartItems,
  getGuestCartTotalQuantity,
  getGuestCartTotalPrice,
  getGuestCartForSync,
  GUEST_CART_KEY,
};
