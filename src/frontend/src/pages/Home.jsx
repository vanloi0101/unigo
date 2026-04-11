import React, { useState } from 'react';
import Hero from '../components/Hero';
import TrustBadges from '../components/TrustBadges';
import ProductSection from '../components/ProductSection';
import ProductModal from '../components/ProductModal';
import About from '../components/About';
import SocialFeed from '../components/SocialFeed';
import useFadeUp from '../hooks/useFadeUp';
import SEO from '../components/common/SEO'; // <--- Thêm Component SEO

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useFadeUp();

  const handleOpen = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
    document.body.classList.add('no-scroll');
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedProduct(null);
    document.body.classList.remove('no-scroll');
  };

  return (
    <>
      <SEO 
        title="Trang Chủ" 
        description="Chào mừng bạn đến với Món Nhỏ Handmade. Nơi cung cấp những mẫu vòng tay ấn tượng nhất." 
      />
      <Hero />
      <TrustBadges />
      <ProductSection onOpen={handleOpen} />
      <About />
      <SocialFeed />
      <ProductModal open={modalOpen} product={selectedProduct} onClose={handleClose} />
    </>
  );
}
