import React, { useMemo, useState, useEffect } from 'react';
import useProductStore from '../store/useProductStore';
import ProductCard from './ProductCard';
import ProductSkeleton from './common/ProductSkeleton';

export default function ProductSection({ onOpen }) {
  const [currentCategory, setCurrentCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dùng Zustand store để lấy dữ liệu (shared state)
  const { products, isLoading, error, fetchProducts } = useProductStore();

  // Fetch dữ liệu khi component mount (chỉ 1 lần)
  useEffect(() => {
    if (products.length === 0) {
      fetchProducts(1, 100);
    }
    // Dependency chỉ tracking products.length để tránh infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    // products là mảng từ store
    if (!Array.isArray(products)) {
      console.log('❌ ProductSection: products không phải array', products);
      return [];
    }
    
    console.log('🔍 ProductSection DEBUG:', {
      totalProducts: products.length,
      currentCategory,
      searchQuery,
      productsList: products.map(p => ({id: p.id, name: p.name, category: p.category}))
    });
    
    const result = products.filter((p) => {
      const matchCat = currentCategory === 'all' || p.category === currentCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const passes = matchCat && matchSearch;
      
      console.log(`  - Product ID ${p.id} (${p.name}): cat=${p.category} matchCat=${matchCat}, matchSearch=${matchSearch}, passes=${passes}`);
      
      return passes;
    });
    
    console.log('✅ ProductSection: filtered count =', result.length);
    
    return result;
  }, [currentCategory, searchQuery, products]);

  return (
    <section id="products" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 fade-up">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-brand-dark mb-4">Sản Phẩm Nổi Bật</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">Khám phá những mẫu vòng tay được yêu thích nhất. Thiết kế độc quyền từ Món Nhỏ.</p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 fade-up">
          <div className="flex flex-wrap gap-2 justify-center bg-white p-2 rounded-full shadow-sm border border-gray-100">
            <button onClick={() => setCurrentCategory('all')} className={`${currentCategory === 'all' ? 'bg-brand-dark text-white' : 'text-gray-600 hover:bg-gray-50'} px-6 py-2.5 rounded-full font-medium transition-all text-sm`}>Tất cả</button>
            <button onClick={() => setCurrentCategory('dihoc')} className={`${currentCategory === 'dihoc' ? 'bg-brand-dark text-white' : 'text-gray-600 hover:bg-gray-50'} px-6 py-2.5 rounded-full font-medium transition-all text-sm`}>Thanh Lịch</button>
            <button onClick={() => setCurrentCategory('tinhban')} className={`${currentCategory === 'tinhban' ? 'bg-brand-dark text-white' : 'text-gray-600 hover:bg-gray-50'} px-6 py-2.5 rounded-full font-medium transition-all text-sm`}>Tình Bạn</button>
            <button onClick={() => setCurrentCategory('pastel')} className={`${currentCategory === 'pastel' ? 'bg-brand-dark text-white' : 'text-gray-600 hover:bg-gray-50'} px-6 py-2.5 rounded-full font-medium transition-all text-sm`}>Pastel Năng Động</button>
          </div>
          <div className="relative w-full md:w-72">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Tìm kiếm sản phẩm..." className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-200 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition-all bg-white shadow-sm text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading ? (
            // Hiển thị 8 Skeletons khi đang load dữ liệu
            Array.from({ length: 8 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))
          ) : error ? (
            <div className="col-span-full text-center py-16">
              <div className="inline-block">
                <div className="text-5xl mb-4">😞</div>
                <h3 className="text-xl font-semibold text-brand-dark mb-2">Oops! Có lỗi xảy ra</h3>
                <p className="text-gray-500 mb-6">
                  Không thể tải sản phẩm lúc này. Vui lòng thử lại sau.
                </p>
                {error && (
                  <p className="text-sm text-gray-400 mb-4">
                    ({error})
                  </p>
                )}
                <button
                  onClick={() => fetchProducts(1, 100)}
                  className="bg-brand-purple text-white px-6 py-3 rounded-full font-semibold hover:bg-brand-dark transition-colors"
                >
                  🔄 Thử lại
                </button>
              </div>
            </div>
          ) : filtered.length > 0 ? (
            filtered.map((p) => (
              <ProductCard key={p.id} product={p} onOpen={onOpen} />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10">
              Không tìm thấy sản phẩm nào phù hợp.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
