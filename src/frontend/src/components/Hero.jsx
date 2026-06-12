import React, { useEffect, useState, useCallback } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import useBannerStore from '../store/useBannerStore';

const DEFAULT_CONTENT = {
  badge: '✨ Collection 2026 Đã Ra Mắt',
  title: 'Vòng tay xinh',
  subtitle: 'Chạm đến trái tim',
  description: 'Trang sức handmade thiết kế riêng. Chất liệu an toàn, không gỉ sét. Món quà nhỏ bé mang ngàn ý nghĩa cho ngày thêm vui.',
  buttonText: 'Xem Bộ Sưu Tập',
  buttonLink: '#products',
  button2Text: 'Câu chuyện của Món Nhỏ',
  button2Link: '#about',
};

const DEFAULT_IMAGE = 'https://placehold.co/800x1000/FFE5DD/9B7BAE?text=Hero+Image';

export default function Hero() {
  const { bannerContent, bannerImages, fetchActiveBanner, isLoading } = useBannerStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    fetchActiveBanner();
  }, [fetchActiveBanner]);

  const activeImages = bannerImages.filter((img) => img.isActive);
  const hasImages = activeImages.length > 0;

  useEffect(() => {
    setCurrentSlide((prev) => {
      if (activeImages.length === 0) return 0;
      return prev >= activeImages.length ? 0 : prev;
    });
    setImageLoaded(false);
  }, [activeImages.length, currentSlide]);

  useEffect(() => {
    if (activeImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [activeImages.length]);

  const goToPrev = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + activeImages.length) % activeImages.length);
  }, [activeImages.length]);

  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % activeImages.length);
  }, [activeImages.length]);

  const content = bannerContent || DEFAULT_CONTENT;
  const currentImage = hasImages ? activeImages[currentSlide]?.imageUrl : DEFAULT_IMAGE;
  const currentAlt = hasImages ? activeImages[currentSlide]?.caption || 'Banner' : 'Hero';

  return (
    <section id="hero" className="relative overflow-hidden px-4 pb-16 pt-28 sm:px-6 md:pb-24 md:pt-36 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-10 md:gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(320px,540px)]">
        <div className="text-center md:text-left">
          {content.badge && (
            <span className="mb-6 inline-block rounded-full border border-brand-pink bg-white px-3 py-1 text-sm font-semibold text-brand-purple shadow-sm">
              {content.badge}
            </span>
          )}
          <h1 className="mb-6 font-serif text-4xl font-bold leading-tight text-brand-dark sm:text-5xl md:text-6xl lg:text-7xl">
            {content.title}
            {content.subtitle && (
              <>
                <br />
                <span className="text-gradient">{content.subtitle}</span>
              </>
            )}
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg md:mx-0 md:text-xl">
            {content.description}
          </p>
          <div className="flex flex-col flex-wrap justify-center gap-4 sm:flex-row md:justify-start">
            {content.buttonText && (
              <a
                href={content.buttonLink || '#products'}
                className="flex items-center justify-center gap-2 rounded-full bg-brand-dark px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-brand-dark/20 transition-all hover:bg-black"
              >
                {content.buttonText}
              </a>
            )}
            {content.button2Text && (
              <a
                href={content.button2Link || '#about'}
                className="flex items-center justify-center rounded-full border-2 border-brand-dark/10 bg-white px-8 py-4 text-lg font-semibold text-brand-dark transition-all hover:border-brand-dark"
              >
                {content.button2Text}
              </a>
            )}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[540px]">
          <div className="hero-frame relative overflow-hidden rounded-[2.5rem] border-4 border-white bg-[#fff8f5] shadow-xl">
            <div className="hero-media relative aspect-[4/5] w-full">
              <div className={`absolute inset-0 flex items-center justify-center bg-gray-100 transition-opacity duration-300 ${isLoading || !imageLoaded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="h-16 w-16 rounded-full border-4 border-brand-purple border-t-transparent animate-spin"></div>
              </div>
              <img
                key={currentImage}
                src={currentImage}
                alt={currentAlt}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                loading="eager"
                fetchpriority="high"
                decoding="async"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(true)}
              />

              {hasImages && activeImages.length > 1 && (
                <>
                  <button
                    onClick={goToPrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-3 text-brand-dark shadow-lg transition-all hover:scale-110 hover:bg-white"
                    aria-label="Previous image"
                  >
                    <FaChevronLeft size={16} />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-3 text-brand-dark shadow-lg transition-all hover:scale-110 hover:bg-white"
                    aria-label="Next image"
                  >
                    <FaChevronRight size={16} />
                  </button>
                </>
              )}

              {hasImages && activeImages.length > 1 && (
                <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
                  {activeImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-3 w-3 rounded-full transition-all ${idx === currentSlide ? 'scale-110 bg-white shadow-lg' : 'bg-white/50 hover:bg-white/80'}`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
