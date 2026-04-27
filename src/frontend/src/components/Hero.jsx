import React, { useEffect, useState, useCallback } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import useBannerStore from '../store/useBannerStore';

// Default banner content (fallback when no data from API)
const DEFAULT_CONTENT = {
  badge: '✨ Collection 2026 Đã Ra Mắt',
  title: 'Vòng tay xinh',
  subtitle: 'Chạm đến trái tim',
  description: 'Trang sức handmade thiết kế riêng. Chất liệu an toàn, không gỉ sét. Món quà nhỏ bé mang ngàn ý nghĩa cho ngày thêm vui.',
  buttonText: 'Xem Bộ Sưu Tập',
  buttonLink: '#products',
  button2Text: 'Câu chuyện của Mận',
  button2Link: '#about',
};

const DEFAULT_IMAGE = 'https://placehold.co/800x1000/FFE5DD/9B7BAE?text=Hero+Image';

export default function Hero() {
  const { bannerContent, bannerImages, fetchActiveBanner, isLoading } = useBannerStore();
  
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch banner data on mount
  useEffect(() => {
    fetchActiveBanner();
  }, [fetchActiveBanner]);

  // Get active images only
  const activeImages = bannerImages.filter(img => img.isActive);
  const hasImages = activeImages.length > 0;

  // Auto-advance slider
  useEffect(() => {
    if (activeImages.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % activeImages.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [activeImages.length]);

  // Navigation handlers
  const goToPrev = useCallback(() => {
    setCurrentSlide(prev => (prev - 1 + activeImages.length) % activeImages.length);
  }, [activeImages.length]);

  const goToNext = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % activeImages.length);
  }, [activeImages.length]);

  // Use API content or fallback to defaults
  const content = bannerContent || DEFAULT_CONTENT;
  const currentImage = hasImages ? activeImages[currentSlide]?.imageUrl : DEFAULT_IMAGE;

  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
        {/* Text Content */}
        <div className="flex-1 text-center md:text-left">
          {content.badge && (
            <span className="inline-block py-1 px-3 rounded-full bg-white border border-brand-pink text-brand-purple text-sm font-semibold mb-6 shadow-sm">
              {content.badge}
            </span>
          )}
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 text-brand-dark leading-tight">
            {content.title}
            {content.subtitle && (
              <>
                <br />
                <span className="text-gradient">{content.subtitle}</span>
              </>
            )}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-lg mx-auto md:mx-0 leading-relaxed">
            {content.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start flex-wrap">
            {content.buttonText && (
              <a 
                href={content.buttonLink || '#products'} 
                className="bg-brand-dark text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-black transition-all shadow-xl shadow-brand-dark/20 flex items-center justify-center gap-2"
              >
                {content.buttonText}
              </a>
            )}
            {content.button2Text && (
              <a 
                href={content.button2Link || '#about'} 
                className="bg-white text-brand-dark border-2 border-brand-dark/10 px-8 py-4 rounded-full font-semibold text-lg hover:border-brand-dark transition-all flex items-center justify-center"
              >
                {content.button2Text}
              </a>
            )}
          </div>
        </div>

        {/* Image Slider */}
        <div className="flex-1 relative">
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white transform rotate-3 hover:rotate-0 transition-transform duration-500">
            {/* Loading State */}
            {isLoading ? (
              <div className="w-full h-[400px] md:h-[500px] bg-gray-100 animate-pulse flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                {/* Main Image */}
                <img 
                  src={currentImage} 
                  alt={hasImages ? activeImages[currentSlide]?.caption || 'Banner' : 'Hero'} 
                  className="w-full h-[400px] md:h-[500px] object-cover transition-opacity duration-500"
                  loading="lazy"
                />

                {/* Navigation Arrows (only if multiple images) */}
                {hasImages && activeImages.length > 1 && (
                  <>
                    <button
                      onClick={goToPrev}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-brand-dark p-3 rounded-full shadow-lg transition-all hover:scale-110"
                      aria-label="Previous image"
                    >
                      <FaChevronLeft size={16} />
                    </button>
                    <button
                      onClick={goToNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-brand-dark p-3 rounded-full shadow-lg transition-all hover:scale-110"
                      aria-label="Next image"
                    >
                      <FaChevronRight size={16} />
                    </button>
                  </>
                )}

                {/* Dot Indicators (only if multiple images) */}
                {hasImages && activeImages.length > 1 && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {activeImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          idx === currentSlide 
                            ? 'bg-white scale-110 shadow-lg' 
                            : 'bg-white/50 hover:bg-white/80'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
