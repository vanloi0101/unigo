import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogAPI } from '../api/apiServices';
import { BlogCard } from './blog';

/**
 * BlogPreview - Hiển thị bài viết mới nhất trên trang chủ
 */
const BlogPreview = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const response = await blogAPI.getLatestPosts(3);
        if (response.success) {
          setPosts(response.data);
        }
      } catch (err) {
        console.error('Error fetching latest posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestPosts();
  }, []);

  if (loading) {
    return (
      <section className="py-10 sm:py-12 md:py-16 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
          <div className="flex items-baseline justify-between mb-6 sm:mb-8 md:mb-10">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-dark">
              Tin tức & Bài viết
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-brand-pink/10 rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-[16/10] bg-brand-pink/20" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-brand-pink/20 rounded w-3/4" />
                  <div className="h-4 bg-brand-pink/20 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return (
      <section className="py-10 sm:py-12 md:py-16 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
          <div className="flex items-baseline justify-between mb-6 fade-up">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-dark">Tin tức & Bài viết</h2>
          </div>
          <p className="text-brand-text/60 text-sm fade-up">
            Chưa có bài viết nào. Ghé lại sớm nhé.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 sm:py-12 md:py-16 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
        {/* Header */}
        <div className="flex items-baseline justify-between mb-6 sm:mb-8 md:mb-10 fade-up">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-brand-dark">
            Tin tức & Bài viết
          </h2>
          <Link
            to="/tin-tuc"
            className="text-sm font-medium text-brand-purple hover:text-brand-dark transition-colors flex-shrink-0"
          >
            Xem tất cả →
          </Link>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 fade-up">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-6 sm:mt-8 md:mt-10 fade-up">
          <Link
            to="/tin-tuc"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-brand-purple text-white font-medium rounded-full hover:bg-brand-dark transition-colors shadow-lg shadow-brand-purple/30 text-sm sm:text-base min-h-[44px] touch-manipulation"
          >
            Xem tất cả bài viết
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
