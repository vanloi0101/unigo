import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, image, url }) {
  const siteTitle = 'Món Nhỏ Handmade (Unigo)';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  
  return (
    <Helmet>
      {/* Standard SEO tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || "Đồ handmade độc quyền từ Món Nhỏ"} />
      
      {/* OpenGraph tags for Social Media (Facebook, Zalo) */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || "Đồ handmade độc quyền từ Món Nhỏ"} />
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}
      <meta property="og:type" content="website" />
      
      {/* Twitter tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || "Đồ handmade độc quyền từ Món Nhỏ"} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
}
