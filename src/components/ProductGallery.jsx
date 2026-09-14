import React, { useState } from 'react';
import { useCakes } from '../context/CakeContext';
import ProductCard from './ProductCard';
import { CakeSlice, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const TABS = ['all', 'bestSeller', 'birthday', 'seasonal', 'others'];

const ProductGallery = ({ onCustomize }) => {
  const { cakes, loading } = useCakes();
  const [activeTab, setActiveTab] = useState('all');
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-rose"></div>
      </div>
    );
  }

  const filteredCakes = cakes.filter(cake => {
    if (!cake.available || cake.status !== 'Active') return false;
    if (activeTab === 'all') return true;
    
    if (activeTab === 'others') return cake.originalPrice && cake.originalPrice > cake.basePrice; // Using 'others' as fallback for offers or other tags in this demo
    
    // Mapping keys to match DB strings
    const tabToCat = {
      bestSeller: 'Best Seller',
      birthday: 'Birthday',
      seasonal: 'Seasonal'
    };
    
    return cake.categories && cake.categories.includes(tabToCat[activeTab]);
  });

  return (
    <div className="container mx-auto px-6 py-16">
      
      {/* Category Tabs centered above */}
      <div className="flex overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0 md:flex-wrap md:justify-center gap-2 mb-8">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
              activeTab === tab 
                ? 'bg-[#3a281c] text-white shadow-sm' 
                : 'bg-[#F0EBE1] text-stone-500 hover:bg-[#e6dfd1]'
            }`}
          >
            {t(tab)}
          </button>
        ))}
      </div>

      {/* Header Row */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-serif font-bold text-stone-800 leading-tight">
            {t('popularCakes')}
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Some of our customer favourites
          </p>
        </div>
        <button className="text-xs font-bold text-brand-rose hover:text-brand-rose-hover flex items-center gap-1 transition-colors">
          {t('viewAll')} <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Grid */}
      {filteredCakes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 text-stone-300 shadow-sm">
            <CakeSlice className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-stone-800 mb-1 font-serif">{t('noCakesFound')}</h3>
          <p className="text-xs text-stone-500 max-w-xs">{t('noCakesSubtext')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {filteredCakes.map(cake => (
            <ProductCard key={cake.id} cake={cake} onCustomize={() => onCustomize(cake)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
