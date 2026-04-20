import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { blogAPI } from '../api/apiServices';
import { BlogCard, BlogSidebar } from '../components/blog';

/**
 * BlogListPage - Trang danh sách bài viết
 * Routes: /tin-tuc, /tin-tuc/danh-muc/:slug
 */
const BlogListPage = () => {
  const [searchParams] = useSearchParams();
  const { slug: categorySlug } = useParams();
  
  // State
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const keyword = searchParams.get('keyword') || '';
  const currentPage = parseInt(searchParams.get('page') || '1');

  // Fetch sidebar data
  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        const [categoriesRes, featuredRes, popularRes] = await Promise.all([
          blogAPI.getCategoryTree(),
          blogAPI.getFeaturedPosts(5),
          blogAPI.getPopularPosts(5),
        ]);

        if (categoriesRes.success) setCategories(categoriesRes.data);
        if (featuredRes.success) setFeaturedPosts(featuredRes.data);
        if (popularRes.success) setPopularPosts(popularRes.data);
      } catch (err) {
        console.error('Error fetching sidebar data:', err);
      }
    };

    fetchSidebarData();
  }, []);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        let response;

        if (keyword) {
          // Search mode
          response = await blogAPI.searchPosts(keyword, currentPage, 12);
        } else if (categorySlug) {
          // Category filter mode
          response = await blogAPI.getPostsByCategory(categorySlug, currentPage, 12);
          if (response.category) {
            setCategory(response.category);
          }
        } else {
          // Default: all posts
          response = await blogAPI.getPosts(currentPage, 12);
          setCategory(null);
        }

        if (response.success) {
          setPosts(response.data);
          setPagination(response.pagination || { page: currentPage, totalPages: 1, total: response.data.length });
        } else {
          setError('Không thể tải danh sách bài viết');
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Đã xảy ra lỗi khi tải bài viết');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [categorySlug, keyword, currentPage]);

  // Page title
  const getPageTitle = () => {
    if (keyword) return `Tìm kiếm: "${keyword}"`;
    if (category) return category.name;
    return 'Tin tức';
  };

  // Pagination component
  const Pagination = () => {
    if (pagination.totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= pagination.totalPages; i++) {
      pages.push(i);
    }

    return (
      <nav className="flex justify-center gap-2 mt-10">
        {currentPage > 1 && (
          <a
            href={`?page=${currentPage - 1}${keyword ? `&keyword=${keyword}` : ''}`}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            ← Trước
          </a>
        )}
        
        {pages.map((page) => (
          <a
            key={page}
            href={`?page=${page}${keyword ? `&keyword=${keyword}` : ''}`}
            className={`px-4 py-2 rounded-lg ${
              page === currentPage
                ? 'bg-brand-purple text-white'
                : 'border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </a>
        ))}

        {currentPage < pagination.totalPages && (
          <a
            href={`?page=${currentPage + 1}${keyword ? `&keyword=${keyword}` : ''}`}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Sau →
          </a>
        )}
      </nav>
    );
  };

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{getPageTitle()} | UniGo</title>
        <meta name="description" content={category?.description || 'Tin tức và bài viết mới nhất từ UniGo'} />
        <meta property="og:title" content={`${getPageTitle()} | UniGo`} />
        <meta property="og:description" content={category?.description || 'Tin tức và bài viết mới nhất từ UniGo'} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="min-h-screen bg-brand-light pt-16 sm:pt-20">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-brand-purple to-brand-dark py-8 sm:py-10 lg:py-16">
          <div className="container mx-auto px-3 sm:px-4 md:px-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center font-serif">
              {getPageTitle()}
            </h1>
            {category?.description && (
              <p className="mt-4 text-purple-100 text-center max-w-2xl mx-auto">
                {category.description}
              </p>
            )}
            {keyword && (
              <p className="mt-4 text-purple-100 text-center">
                Tìm thấy {pagination.total} kết quả
              </p>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 lg:py-10">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Posts Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
                      <div className="aspect-[16/10] bg-gray-200" />
                      <div className="p-4 space-y-3">
                        <div className="h-5 bg-gray-200 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 rounded w-full" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-600">{error}</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500">Không có bài viết nào</p>
                </div>
              ) : (
                <>
                  {/* Featured Post (first post) */}
                  {!keyword && !categorySlug && posts.length > 0 && (
                    <div className="mb-8">
                      <BlogCard post={posts[0]} variant="featured" />
                    </div>
                  )}

                  {/* Posts Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                    {(keyword || categorySlug ? posts : posts.slice(1)).map((post) => (
                      <BlogCard key={post.id} post={post} />
                    ))}
                  </div>

                  {/* Pagination */}
                  <Pagination />
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:w-80 flex-shrink-0">
              <BlogSidebar
                categories={categories}
                featuredPosts={featuredPosts}
                popularPosts={popularPosts}
                currentCategory={categorySlug}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogListPage;
