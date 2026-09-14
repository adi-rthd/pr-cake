import React from 'react';
import { ArrowRight, Leaf, Heart, Store } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const ShopBanner = ({ onOpenBuilder }) => {
  const { t } = useLanguage();

  return (
    <div id="home" className="w-full bg-[#FAF7F2]">
      <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12">

        {/* Left Side (Text) */}
        <div className="w-full md:w-1/2 flex flex-col justify-center z-10">
          <div className="flex items-center gap-2 text-[10px] font-bold text-brand-rose uppercase tracking-[0.2em] mb-6">
            <span>{t('freshlyBaked') || 'FRESHLY BAKED'}</span>
            <span className="w-1 h-1 rounded-full bg-brand-brown/30"></span>
            <span>{t('hundredPercentVeg') || '100% VEGETARIAN'}</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-brand-brown font-serif leading-[1.1] tracking-tight mb-6">
            {t('homemadeCakesForEveryCelebration') || 'Homemade Cakes for Every Celebration'}
          </h1>

          <p className="text-stone-600 text-lg md:text-xl max-w-md font-medium tracking-wide leading-relaxed mb-10">
            {t('madeWithRealIngredients') || 'Made with real ingredients, pure love and a touch of happiness.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
            <a href="#cakes" className="w-full sm:w-auto bg-brand-brown hover:bg-[#2D1B19] text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg flex items-center justify-center gap-2 group">
              {t('orderNow') || 'Order Now'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <button onClick={onOpenBuilder} className="w-full sm:w-auto bg-white hover:bg-stone-50 text-brand-brown border border-[#E6DFD3] px-8 py-4 rounded-full font-bold transition-all shadow-sm flex items-center justify-center">
              {t('customizeYourCake') || 'Customize Your Cake'}
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-[#E6DFD3]/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                <Leaf className="w-5 h-5 text-brand-veg" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="font-bold text-brand-brown text-sm">{t('feat1Title') || '100% Vegetarian'}</h4>
                <p className="text-xs text-stone-500">{t('feat1Sub') || 'Pure & Safe'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5 text-brand-rose" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="font-bold text-brand-brown text-sm">{t('feat2Title') || 'Made with Love'}</h4>
                <p className="text-xs text-stone-500">{t('feat3Title') || 'Freshly Baked'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
                <Store className="w-5 h-5 text-stone-600" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="font-bold text-brand-brown text-sm">{t('storePickupOnly') || 'Store Pickup Only'}</h4>
                <p className="text-xs text-stone-500">{t('noDelivery') || 'No Delivery'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side (Image) */}
        <div className="w-full md:w-1/2 relative">
          <div className="absolute inset-0 bg-brand-rose/10 rounded-full blur-3xl transform translate-x-10 translate-y-10"></div>
          <img
            src="src\assets\banner.png"
            alt="Delicious Chocolate Cake"
            className="relative w-full h-[500px] lg:h-[600px] object-cover rounded-[2rem] shadow-2xl border border-white/50"
          />
        </div>

      </div>
    </div>
  );
};

export default ShopBanner;
