/**
 * Common utility functions for the application
 */

/**
 * Format price in Vietnamese Dong (VND)
 */
export const formatPrice = (price) => {
  if (!price && price !== 0) return '0₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(price);
};

/**
 * Format date in Vietnamese locale
 */
export const formatDate = (date, format = 'short') => {
  const options =
    format === 'short'
      ? { year: 'numeric', month: 'short', day: 'numeric' }
      : { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };

  return new Intl.DateTimeFormat('vi-VN', options).format(new Date(date));
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text, length = 100) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

/**
 * Generate slug from text (for URLs)
 */
export const generateSlug = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Check if value is empty (null, undefined, empty string, empty array)
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Deep copy object
 */
export const deepCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Merge arrays and remove duplicates
 */
export const mergeArraysUnique = (arr1, arr2, key = 'id') => {
  const combined = [...arr1, ...arr2];
  const seen = new Set();
  return combined.filter((item) => {
    const id = item[key];
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
};

/**
 * Check if user is online
 */
export const isOnline = () => {
  return navigator.onLine;
};

/**
 * Offline storage helpers
 */
export const OfflineStorage = {
  // Save data for offline use
  save: (key, data) => {
    try {
      if ('indexedDB' in window) {
        // Use IndexedDB for larger data
        const request = indexedDB.open('unigo_db', 1);
        request.onsuccess = (e) => {
          const db = e.target.result;
          const transaction = db.transaction('cache', 'readwrite');
          const store = transaction.objectStore('cache');
          store.put({ key, data, timestamp: Date.now() });
        };
      } else {
        // Fallback to localStorage
        localStorage.setItem(`offline_${key}`, JSON.stringify({ data, timestamp: Date.now() }));
      }
    } catch (error) {
      console.error('OfflineStorage.save error:', error);
    }
  },

  // Retrieve offline data
  get: (key) => {
    try {
      const item = localStorage.getItem(`offline_${key}`);
      return item ? JSON.parse(item).data : null;
    } catch (error) {
      console.error('OfflineStorage.get error:', error);
      return null;
    }
  },

  // Clear offline data
  clear: (key) => {
    try {
      localStorage.removeItem(`offline_${key}`);
    } catch (error) {
      console.error('OfflineStorage.clear error:', error);
    }
  },
};

/**
 * Get query parameter from URL
 */
export const getQueryParam = (param) => {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(param);
};

/**
 * Update URL without reload
 */
export const updateURLParams = (params) => {
  const searchParams = new URLSearchParams(window.location.search);
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
  });
  window.history.replaceState(null, '', `?${searchParams.toString()}`);
};

/**
 * Scroll to element smoothly
 */
export const scrollToElement = (elementId, offset = 80) => {
  const element = document.getElementById(elementId);
  if (element) {
    const top = element.offsetTop - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
};

/**
 * Detect mobile device
 */
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export default {
  formatPrice,
  formatDate,
  truncateText,
  generateSlug,
  isValidEmail,
  isEmpty,
  deepCopy,
  mergeArraysUnique,
  isOnline,
  OfflineStorage,
  getQueryParam,
  updateURLParams,
  scrollToElement,
  isMobileDevice,
  formatFileSize,
};
