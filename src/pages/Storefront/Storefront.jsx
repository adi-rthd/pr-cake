import React, { useState } from 'react';
import Header from '../../components/Header';
import ShopBanner from '../../components/Storefront/ShopBanner';
import MarketingCarousel from '../../components/Storefront/MarketingCarousel';
import ProductGallery from '../../components/Storefront/ProductGallery';
import FeaturesBanner from '../../components/Storefront/FeaturesBanner';
import CartDrawer from '../../components/CartDrawer';
import CustomizationModal from '../../components/CustomizationModal';
import CakeBuilderModal from '../../components/Storefront/CakeBuilderModal';
import AboutSection from '../../components/Storefront/AboutSection';
import Footer from '../../components/Storefront/Footer';

const Storefront = () => {
  const [selectedCake, setSelectedCake] = useState(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <ShopBanner onOpenBuilder={() => setIsBuilderOpen(true)} />
      <MarketingCarousel />
      <ProductGallery onCustomize={setSelectedCake} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <FeaturesBanner onOpenBuilder={() => setIsBuilderOpen(true)} />
      <AboutSection />
      <Footer />
      <CartDrawer />
      {selectedCake && (
        <CustomizationModal cake={selectedCake} onClose={() => setSelectedCake(null)} />
      )}
      {isBuilderOpen && (
        <CakeBuilderModal onClose={() => setIsBuilderOpen(false)} />
      )}
    </div>
  );
};

export default Storefront;
