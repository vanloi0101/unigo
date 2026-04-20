import React, { useEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify';
import ProductEmbed from './ProductEmbed';

/**
 * BlogContent - Render nội dung bài viết an toàn
 * Tự động thêm ID cho headings và render product embeds
 */
const BlogContent = ({ content }) => {
  const containerRef = useRef(null);
  const [processedContent, setProcessedContent] = useState('');
  const [productEmbeds, setProductEmbeds] = useState([]);

  useEffect(() => {
    if (!content) return;

    // Parse và xử lý HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');

    // Thêm ID cho headings
    const headings = doc.querySelectorAll('h2, h3');
    headings.forEach((heading, index) => {
      if (!heading.id) {
        heading.id = `heading-${index}`;
      }
    });

    // Tìm và xử lý product embeds
    const productBoxes = doc.querySelectorAll('.product-box[data-product-id]');
    const embeds = [];
    
    productBoxes.forEach((box, index) => {
      const productId = box.getAttribute('data-product-id');
      if (productId) {
        const placeholder = `__PRODUCT_EMBED_${index}__`;
        box.setAttribute('data-placeholder', placeholder);
        box.innerHTML = `<div id="product-embed-${index}"></div>`;
        embeds.push({
          index,
          productId: parseInt(productId),
          placeholder,
        });
      }
    });

    setProductEmbeds(embeds);
    // SECURITY FIX: Sanitize HTML to prevent XSS attacks
    const sanitizedHTML = DOMPurify.sanitize(doc.body.innerHTML, {
      ADD_TAGS: ['iframe'], // Allow iframes for embeds if needed
      ADD_ATTR: ['data-product-id', 'data-placeholder', 'target'], // Allow custom attributes
      FORBID_TAGS: ['script', 'style'], // Explicitly forbid dangerous tags
      FORBID_ATTR: ['onerror', 'onload', 'onclick'], // Forbid event handlers
    });
    setProcessedContent(sanitizedHTML);
  }, [content]);

  // Render product embeds after content is mounted
  useEffect(() => {
    if (!containerRef.current || productEmbeds.length === 0) return;

    // Tìm các placeholder và mount ProductEmbed components
    productEmbeds.forEach(({ index, productId }) => {
      const placeholder = containerRef.current.querySelector(`#product-embed-${index}`);
      if (placeholder && !placeholder.hasChildNodes()) {
        // Dùng React Portal hoặc render trực tiếp
        // Ở đây ta để ProductEmbed render riêng
      }
    });
  }, [processedContent, productEmbeds]);

  if (!content) {
    return null;
  }

  return (
    <div className="relative">
      {/* Main Content */}
      <div
        ref={containerRef}
        className="blog-content prose prose-lg max-w-none
          prose-headings:text-gray-900 prose-headings:font-bold
          prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
          prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
          prose-a:text-brand-purple prose-a:no-underline hover:prose-a:underline
          prose-strong:text-gray-900
          prose-ul:my-4 prose-ol:my-4
          prose-li:text-gray-700 prose-li:my-1
          prose-blockquote:border-l-4 prose-blockquote:border-brand-pink prose-blockquote:bg-purple-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:italic
          prose-img:rounded-xl prose-img:shadow-lg
          prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
          prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl
          prose-table:w-full prose-table:border-collapse
          prose-th:bg-gray-100 prose-th:p-3 prose-th:text-left prose-th:border prose-th:border-gray-200
          prose-td:p-3 prose-td:border prose-td:border-gray-200
        "
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />

      {/* Product Embeds - Render sau content */}
      {productEmbeds.map(({ index, productId }) => {
        const placeholder = containerRef.current?.querySelector(`#product-embed-${index}`);
        if (!placeholder) {
          // Fallback render ở cuối nếu không tìm thấy placeholder
          return <ProductEmbed key={index} productId={productId} />;
        }
        return null;
      })}
    </div>
  );
};

export default BlogContent;
