import { create } from 'zustand';

// Load cart from localStorage on initialization
const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Error loading cart from storage:', error);
    return [];
  }
};

const useCartStore = create((set) => ({
  items: loadCartFromStorage(),
  
  // Add item to cart
  addToCart: (product, quantity = 1) => {
    set((state) => {
      const existingItem = state.items.find(item => item.id === product.id);
      
      let newItems;
      if (existingItem) {
        // Update quantity if item exists
        newItems = state.items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        newItems = [...state.items, { ...product, quantity }];
      }
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(newItems));
      return { items: newItems };
    });
  },

  // Remove item from cart
  removeFromCart: (productId) => {
    set((state) => {
      const newItems = state.items.filter(item => item.id !== productId);
      localStorage.setItem('cart', JSON.stringify(newItems));
      return { items: newItems };
    });
  },

  // Update item quantity
  updateQuantity: (productId, quantity) => {
    set((state) => {
      let newItems;
      if (quantity <= 0) {
        newItems = state.items.filter(item => item.id !== productId);
      } else {
        newItems = state.items.map(item =>
          item.id === productId
            ? { ...item, quantity }
            : item
        );
      }
      localStorage.setItem('cart', JSON.stringify(newItems));
      return { items: newItems };
    });
  },

  // Get total items
  getTotalItems: () => {
    return useCartStore.getState().items.reduce((total, item) => total + item.quantity, 0);
  },

  // Get total price
  getTotalPrice: () => {
    return useCartStore.getState().items.reduce(
      (total, item) => total + (item.price * item.quantity), 
      0
    );
  },

  // Clear cart
  clearCart: () => {
    localStorage.removeItem('cart');
    set({ items: [] });
  }
}));

export default useCartStore;
