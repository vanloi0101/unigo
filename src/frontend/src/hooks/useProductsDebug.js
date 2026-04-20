import { useEffect, useRef } from 'react';
import useProductStore from '../store/useProductStore';

/**
 * Debug hook để theo dõi khi nào products thay đổi
 * Giúp phát hiện: re-render thừa, stale state, reference changes
 */
export function useProductsDebug(componentName = 'Component') {
  const { products, isLoading, error, fetchProducts } = useProductStore();
  const prevProductsRef = useRef(null);
  const renderCountRef = useRef(0);

  useEffect(() => {
    renderCountRef.current += 1;

    // So sánh reference
    const refChanged = prevProductsRef.current !== products;
    
    // So sánh content
    let contentChanged = false;
    if (prevProductsRef.current?.length !== products?.length) {
      contentChanged = true;
    } else if (products.length > 0) {
      const prevIds = prevProductsRef.current?.map(p => p.id).join(',');
      const currIds = products.map(p => p.id).join(',');
      contentChanged = prevIds !== currIds;
    }

    console.log(`🔍 [${componentName}] Render #${renderCountRef.current}:`, {
      productCount: products.length,
      isLoading,
      errorMsg: error,
      refChanged: refChanged ? '📍 Reference changed' : '❌ Same reference',
      contentChanged: contentChanged ? '📦 Content changed' : '❌ Same content',
      productIds: products.map(p => p.id),
    });

    prevProductsRef.current = products;
  }, [products, isLoading, error, componentName]);

  return { products, isLoading, error, fetchProducts };
}

export default useProductsDebug;
