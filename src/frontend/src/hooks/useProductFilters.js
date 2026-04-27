import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

/**
 * useProductFilters Hook - Manages URL state for product filters
 * Keeps filters in sync with URL for shareable links and browser back/forward
 */
export const useProductFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = {
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')) : 0,
    maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')) : 999999999,
    page: searchParams.get('page') ? parseInt(searchParams.get('page')) : 1,
    sort: searchParams.get('sort') || 'newest', // newest, popular, price-low, price-high
  };

  const updateFilters = useCallback(
    (newFilters) => {
      const params = new URLSearchParams(searchParams);

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value || value === 0) {
          params.set(key, String(value));
        } else {
          params.delete(key);
        }
      });

      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  const setCategory = useCallback(
    (category) => updateFilters({ category, page: 1 }), // Reset to page 1 when changing category
    [updateFilters]
  );

  const setSearch = useCallback(
    (search) => updateFilters({ search, page: 1 }),
    [updateFilters]
  );

  const setPriceRange = useCallback(
    (minPrice, maxPrice) => updateFilters({ minPrice, maxPrice, page: 1 }),
    [updateFilters]
  );

  const setPage = useCallback(
    (page) => updateFilters({ page }),
    [updateFilters]
  );

  const setSort = useCallback(
    (sort) => updateFilters({ sort }),
    [updateFilters]
  );

  const clearFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  return {
    filters,
    updateFilters,
    setCategory,
    setSearch,
    setPriceRange,
    setPage,
    setSort,
    clearFilters,
  };
};

export default useProductFilters;
