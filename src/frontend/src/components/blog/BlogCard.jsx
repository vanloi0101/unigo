import React from 'react';
import { Link } from 'react-router-dom';

/**
 * BlogCard - Card hiển thị bài viết trong danh sách
 */
const BlogCard = ({ post, variant = 'default' }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Variant: featured (lớn), default (vừa), compact (nhỏ)
  if (variant === 'featured') {
    return (
      <article className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
        <Link to={`/tin-tuc/${post.slug}`} className="block">
          <div className="relative aspect-[16/9] overflow-hidden">
            <img
              src={post.thumbnail || '/placeholder-blog.jpg'}
              alt={post.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {post.category && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-brand-purple text-white text-xs font-medium rounded-full">
                {post.category.name}
              </span>
            )}
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 line-clamp-2 group-hover:text-brand-pink transition-colors font-serif">
              {post.title}
            </h2>
            {post.shortDescription && (
              <p className="mt-3 text-gray-600 line-clamp-3">
                {post.shortDescription}
              </p>
            )}
            <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
              {post.author && (
                <div className="flex items-center gap-2">
                  {post.author.avatar ? (
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {post.author.name?.charAt(0)}
                      </span>
                    </div>
                  )}
                  <span className="font-medium text-gray-700">{post.author.name}</span>
                </div>
              )}
              <span>•</span>
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              {post.estimatedReadingTime > 0 && (
                <>
                  <span>•</span>
                  <span>{post.estimatedReadingTime} phút đọc</span>
                </>
              )}
            </div>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className="group flex gap-4">
        <Link to={`/tin-tuc/${post.slug}`} className="flex-shrink-0">
          <img
            src={post.thumbnail || '/placeholder-blog.jpg'}
            alt={post.title}
            className="w-20 h-20 object-cover rounded-lg"
            loading="lazy"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <Link to={`/tin-tuc/${post.slug}`}>
            <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-brand-pink transition-colors">
              {post.title}
            </h4>
          </Link>
          <time className="text-xs text-gray-500 mt-1 block">
            {formatDate(post.publishedAt)}
          </time>
        </div>
      </article>
    );
  }

  // Default variant
  return (
    <article className="group bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 h-full flex flex-col">
      <Link to={`/tin-tuc/${post.slug}`} className="block flex-shrink-0">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={post.thumbnail || '/placeholder-blog.jpg'}
            alt={post.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {post.category && (
            <span className="absolute top-2 left-2 sm:top-3 sm:left-3 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-brand-purple text-white text-[10px] sm:text-xs font-medium rounded">
              {post.category.name}
            </span>
          )}
        </div>
      </Link>
      <div className="p-2.5 sm:p-4 flex flex-col flex-grow">
        <Link to={`/tin-tuc/${post.slug}`}>
          <h3 className="text-sm sm:text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-brand-pink transition-colors min-h-[2.5rem] sm:min-h-[3.5rem]">
            {post.title}
          </h3>
        </Link>
        {post.shortDescription && (
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-600 line-clamp-2 hidden sm:block">
            {post.shortDescription}
          </p>
        )}
        <div className="mt-auto pt-2 sm:pt-3 flex items-center justify-between text-[10px] sm:text-xs text-gray-500">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          <div className="flex items-center gap-2 sm:gap-3">
            {post.estimatedReadingTime > 0 && (
              <span className="hidden sm:inline">{post.estimatedReadingTime} phút đọc</span>
            )}
            {post.views > 0 && (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {post.views}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
