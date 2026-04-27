import React, { useEffect, useState } from 'react';
import { FaWifi, FaExclamationTriangle } from 'react-icons/fa';

/**
 * OfflineBanner - Shows when user loses internet connection
 */
const OfflineBanner = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-red-500 text-white p-4 shadow-lg flex items-center justify-center gap-2 z-50">
      <FaExclamationTriangle className="text-xl" />
      <p className="text-sm font-medium">
        Bạn đang ngoài tuyến. Một số tính năng có thể không khả dụng.
      </p>
    </div>
  );
};

/**
 * Online Status Hook
 */
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

export default OfflineBanner;
