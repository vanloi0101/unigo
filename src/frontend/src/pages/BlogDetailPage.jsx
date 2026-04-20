import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { blogAPI } from '../api/apiServices';
import {
  ReadingProgress,
  TableOfContents,
  BlogContent,
  ShareButtons,
  BlogCard,
} from '../components/blog';

/**
 * BlogDetailPage - Trang chi tiết bài viết
 * Route: /tin-tuc/:slug
 */
const BlogDetailPage = () => {
  const { slug } = useParams();
  
  // State
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await blogAPI.getPostBySlug(slug);
        
        if (response.success) {
          setPost(response.data);
          setRelatedPosts(response.relatedPosts || []);
        } else {
          setError('Bài viết không tồn tại');
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        if (err.response?.status === 404) {
          setError('Bài viết không tồn tại');
        } else {
          setError('Đã xảy ra lỗi khi tải bài viết');
        }
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
      // Scroll to top
      window.scrollTo(0, 0);
    }
  }, [slug]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="aspect-video bg-gray-200 rounded-xl" />
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{error || 'Không tìm thấy bài viết'}</h1>
          <p className="text-gray-600 mb-6">Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <Link
            to="/tin-tuc"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-purple text-white rounded-lg hover:bg-brand-dark transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại tin tức
          </Link>
        </div>
      </div>
    );
  }

  const currentUrl = window.location.href;

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{post.metaTitle || post.title} | UniGo</title>
        <meta name="description" content={post.metaDescription || post.shortDescription} />
        <meta name="keywords" content={post.metaKeywords} />
        
        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.ogTitle || post.title} />
        <meta property="og:description" content={post.ogDescription || post.shortDescription} />
        <meta property="og:image" content={post.ogImage || post.thumbnail} />
        <meta property="og:url" content={currentUrl} />
        <meta property="article:published_time" content={post.publishedAt} />
        <meta property="article:modified_time" content={post.updatedAt} />
        {post.author && <meta property="article:author" content={post.author.name} />}
        {post.category && <meta property="article:section" content={post.category.name} />}
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.shortDescription} />
        <meta name="twitter:image" content={post.thumbnail} />
        
        <link rel="canonical" href={currentUrl} />
      </Helmet>

      {/* Reading Progress Bar */}
      <ReadingProgress />

      <article className="min-h-screen bg-brand-light">
        {/* Hero Section */}
        <header className="bg-gradient-to-b from-brand-light to-white pt-8 pb-4">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <Link to="/" className="hover:text-brand-pink">Trang chủ</Link>
                <span>/</span>
                <Link to="/tin-tuc" className="hover:text-brand-pink">Tin tức</Link>
                {post.category && (
                  <>
                    <span>/</span>
                    <Link to={`/tin-tuc/danh-muc/${post.category.slug}`} className="hover:text-brand-pink">
                      {post.category.name}
                    </Link>
                  </>
                )}
              </nav>

              {/* Category Badge */}
              {post.category && (
                <Link
                  to={`/tin-tuc/danh-muc/${post.category.slug}`}
                  className="inline-block px-3 py-1 bg-purple-100 text-brand-purple text-sm font-medium rounded-full mb-4 hover:bg-purple-200 transition-colors"
                >
                  {post.category.name}
                </Link>
              )}

              {/* Title */}
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight mb-6 font-serif">
                {post.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
                {/* Author */}
                {post.author && (
                  <Link to={`/tin-tuc/tac-gia/${post.author.slug}`} className="flex items-center gap-2 hover:text-brand-pink">
                    {post.author.avatar ? (
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-sm font-bold text-brand-purple">
                          {post.author.name?.charAt(0)}
                        </span>
                      </div>
                    )}
                    <span className="font-medium">{post.author.name}</span>
                  </Link>
                )}

                <span className="text-gray-300">|</span>

                {/* Date */}
                <time dateTime={post.publishedAt} className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(post.publishedAt)}
                </time>

                {/* Reading Time */}
                {post.estimatedReadingTime > 0 && (
                  <>
                    <span className="text-gray-300">|</span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {post.estimatedReadingTime} phút đọc
                    </span>
                  </>
                )}

                {/* Views */}
                {post.views > 0 && (
                  <>
                    <span className="text-gray-300">|</span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {post.views.toLocaleString()} lượt xem
                    </span>
                  </>
                )}
              </div>

              {/* Short Description */}
              {post.shortDescription && (
                <p className="text-lg text-gray-600 leading-relaxed border-l-4 border-brand-pink pl-4 italic">
                  {post.shortDescription}
                </p>
              )}
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {post.thumbnail && (
          <div className="container mx-auto px-4 py-6">
            <div className="max-w-4xl mx-auto">
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-full aspect-video object-cover rounded-2xl shadow-lg"
                loading="eager"
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
            {/* Article Content */}
            <div className="flex-1 max-w-4xl">
              {/* Table of Contents (Mobile) */}
              <div className="lg:hidden mb-8">
                <TableOfContents content={post.content} />
              </div>

              {/* Content */}
              <BlogContent content={post.content} />

              {/* Tags */}
              {post.metaKeywords && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {post.metaKeywords.split(',').map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Share Buttons */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <ShareButtons
                  url={currentUrl}
                  title={post.title}
                  description={post.shortDescription}
                />
              </div>

              {/* Author Bio */}
              {post.author && post.author.bio && (
                <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                  <div className="flex items-start gap-4">
                    {post.author.avatar ? (
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-xl font-bold text-brand-purple">
                          {post.author.name?.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <Link
                        to={`/tin-tuc/tac-gia/${post.author.slug}`}
                        className="text-lg font-semibold text-gray-900 hover:text-brand-purple"
                      >
                        {post.author.name}
                      </Link>
                      <p className="mt-1 text-gray-600 text-sm">{post.author.bio}</p>
                      <div className="mt-3 flex gap-3">
                        {post.author.facebook && (
                          <a href={post.author.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                          </a>
                        )}
                        {post.author.twitter && (
                          <a href={post.author.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                          </a>
                        )}
                        {post.author.website && (
                          <a href={post.author.website} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Table of Contents (Desktop) */}
            <aside className="hidden lg:block lg:w-72 flex-shrink-0">
              <div className="sticky top-24">
                <TableOfContents content={post.content} sticky />
              </div>
            </aside>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="bg-gray-50 py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Bài viết liên quan</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <BlogCard key={relatedPost.id} post={relatedPost} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Back to Blog */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Link
              to="/tin-tuc"
              className="inline-flex items-center gap-2 text-brand-purple hover:text-brand-dark font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Quay lại trang tin tức
            </Link>
          </div>
        </div>
      </article>
    </>
  );
};

export default BlogDetailPage;
