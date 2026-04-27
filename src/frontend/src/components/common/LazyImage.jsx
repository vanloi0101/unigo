import React, { useState, useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

/**
 * LazyImage Component - Lazy loads images with skeleton loading
 * Improves performance by deferring image loading until visible
 * Supports both PNG and WebP with fallback
 * 
 * Props:
 * - src: Image source URL
 * - alt: Alt text for accessibility
 * - className: Tailwind classes for styling
 * - placeholderClassName: Skeleton placeholder classes
 * - webp: WebP image source (optional, for modern browsers)
 * - onLoad: Callback when image loads
 * - aspectRatio: CSS aspect-ratio value (e.g., '1/1', '16/9')
 */
const LazyImage = React.forwardRef((
  {
    src,
    alt = 'Image',
    className = '',
    placeholderClassName = '',
    webp = null,
    onLoad = null,
    aspectRatio = null,
    loadingStrategy = 'lazy', // 'lazy' or 'eager'
  },
  ref
) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);
  const { ref: observerRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const shouldLoad = loadingStrategy === 'eager' || inView;

  useEffect(() => {
    const img = imgRef.current;
    if (!img || !shouldLoad) return;

    // Create image to test loading
    const imageToLoad = new Image();

    imageToLoad.onload = () => {
      setIsLoaded(true);
      if (onLoad) onLoad();
    };

    imageToLoad.onerror = () => {
      setError(true);
    };

    // Try WebP first if available
    if (webp) {
      imageToLoad.src = webp;
    } else {
      imageToLoad.src = src;
    }
  }, [src, webp, shouldLoad, onLoad]);

  // Fallback image for error
  const fallbackImage = '/images/placeholder.jpg';

  const imageSrc = error ? fallbackImage : src;
  const imageWebP = error ? null : webp;

  const containerStyle = {
    ...(aspectRatio && { aspectRatio }),
  };

  return (
    <div
      ref={observerRef}
      className={`relative overflow-hidden bg-gray-200 ${className}`}
      style={containerStyle}
    >
      {/* Skeleton Loader */}
      {!isLoaded && (
        <div
          className={`absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse ${placeholderClassName}`}
        />
      )}

      {/* Image Container */}
      {shouldLoad && (
        <picture>
          {imageWebP && <source srcSet={imageWebP} type="image/webp" />}
          <img
            ref={imgRef}
            src={imageSrc}
            alt={alt}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            onError={() => setError(true)}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </picture>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
          <p className="text-gray-500 text-sm text-center px-2">
            Không thể tải ảnh
          </p>
        </div>
      )}
    </div>
  );
});

LazyImage.displayName = 'LazyImage';

export default LazyImage;
