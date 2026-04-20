import React from 'react';
import { Link } from 'react-router-dom';
import BlogCard from './BlogCard';

/**
 * BlogSidebar - Sidebar cho trang blog
 * Hiển thị categories, featured posts, popular posts
 */
const BlogSidebar = ({ 
  categories = [], 
  featuredPosts = [], 
  popularPosts = [],
  currentCategory = null,
}) => {
  return (
    <aside className="space-y-8">
      {/* Search Box */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <form action="/tin-tuc" method="GET" className="relative">
          <input
            type="text"
            name="keyword"
            placeholder="Tìm kiếm bài viết..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none text-sm"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </form>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Danh mục</h3>
          <ul className="space-y-2">
            <li>
              <Link
                to="/tin-tuc"
                className={`flex items-center justify-between py-2 px-3 rounded-lg transition-colors ${
                  !currentCategory
                    ? 'bg-purple-50 text-brand-purple'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>Tất cả bài viết</span>
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  to={`/tin-tuc/danh-muc/${category.slug}`}
                  className={`flex items-center justify-between py-2 px-3 rounded-lg transition-colors ${
                    currentCategory === category.slug
                      ? 'bg-purple-50 text-brand-purple'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{category.name}</span>
                  {category._count?.posts > 0 && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {category._count.posts}
                    </span>
                  )}
                </Link>
                
                {/* Sub-categories */}
                {category.children && category.children.length > 0 && (
                  <ul className="ml-4 mt-2 space-y-1">
                    {category.children.map((child) => (
                      <li key={child.id}>
                        <Link
                          to={`/tin-tuc/danh-muc/${child.slug}`}
                          className={`block py-1.5 px-3 text-sm rounded transition-colors ${
                            currentCategory === child.slug
                              ? 'text-brand-purple'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            <span className="inline-flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-pink" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Bài viết nổi bật
            </span>
          </h3>
          <div className="space-y-4">
            {featuredPosts.map((post) => (
              <BlogCard key={post.id} post={post} variant="compact" />
            ))}
          </div>
        </div>
      )}

      {/* Popular Posts */}
      {popularPosts.length > 0 && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            <span className="inline-flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
              Xem nhiều nhất
            </span>
          </h3>
          <div className="space-y-4">
            {popularPosts.map((post, index) => (
              <div key={post.id} className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/tin-tuc/${post.slug}`}
                    className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-brand-pink transition-colors"
                  >
                    {post.title}
                  </Link>
                  <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {post.views} lượt xem
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Newsletter */}
      <div className="bg-gradient-to-br from-brand-purple to-brand-dark rounded-xl p-5 text-white">
        <h3 className="text-lg font-semibold mb-2">Đăng ký nhận tin</h3>
        <p className="text-purple-100 text-sm mb-4">
          Nhận thông báo khi có bài viết mới
        </p>
        <form className="space-y-3">
          <input
            type="email"
            placeholder="Email của bạn"
            className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 placeholder-purple-200 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <button
            type="submit"
            className="w-full py-2.5 bg-white text-brand-purple font-medium rounded-lg hover:bg-purple-50 transition-colors"
          >
            Đăng ký
          </button>
        </form>
      </div>
    </aside>
  );
};

export default BlogSidebar;
