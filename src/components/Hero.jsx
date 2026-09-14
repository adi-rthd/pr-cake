import React from 'react';
import { ArrowRight, Leaf, Heart, Truck } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';

const Hero = () => {
  const { settings } = useSettings();
  const { t } = useLanguage();

  return (
    <div className="relative bg-[#FFF9F5] overflow-hidden pt-16 pb-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
          
          {/* Left Text */}
          <div className="flex-1 z-10 w-full">
            <div className="relative inline-block mb-6">
              <h2 className="text-5xl md:text-6xl lg:text-[4.5rem] font-bold text-stone-800 font-serif leading-[1.1] tracking-tight whitespace-nowrap">
                {t('heroTitleMain')}
              </h2>
              {/* The overlapping cursive 'love' */}
              <div className="text-6xl md:text-7xl lg:text-[6rem] text-brand-rose -mt-2 md:-mt-4 lg:-mt-6 ml-0 md:ml-4 tracking-normal" style={{ fontFamily: 'var(--font-cursive)' }}>
                {t('heroTitleHighlight')}
              </div>
            </div>
            
            <p className="text-stone-500 text-base md:text-lg max-w-lg mb-10 font-light tracking-wide leading-relaxed">
              {settings?.heroSubtext === 'Artisanal, 100% vegetarian cakes crafted for your special moments.' || !settings?.heroSubtext ? t('heroSubtextFallback') : settings.heroSubtext}
            </p>
            
            <a href="#cakes" className="bg-brand-rose hover:bg-brand-rose-hover text-white px-8 py-3.5 rounded-full font-bold shadow-md shadow-brand-rose/20 transition-all flex items-center justify-center gap-2 mb-16 w-max">
              {t('orderNow')} <ArrowRight className="w-4 h-4" />
            </a>

            {/* Feature Icons Row */}
            <div className="flex flex-wrap gap-8 items-center pt-8 border-t border-stone-200/50">
              <div className="flex items-start gap-3">
                <div className="bg-white p-2.5 rounded-full shadow-sm text-brand-rose">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-800">{t('feat1Title')}</h4>
                  <p className="text-[11px] text-stone-500">{t('feat1Sub')}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-white p-2.5 rounded-full shadow-sm text-brand-rose">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-800">{t('feat2Title')}</h4>
                  <p className="text-[11px] text-stone-500">{t('feat2Sub')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-white p-2.5 rounded-full shadow-sm text-brand-rose">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-800">{t('feat3Title')}</h4>
                  <p className="text-[11px] text-stone-500">{t('feat3Sub')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-1 w-full flex items-center justify-center lg:justify-end gap-6 xl:gap-10">
            <img 
              src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1000&q=80" 
              alt="Delicious Cake"
              className="w-full max-w-[380px] xl:max-w-[450px] aspect-[4/3] object-cover rounded-[2rem] shadow-xl"
            />
            {/* Floating text block (Side-by-side) */}
            <div className="hidden lg:block w-40 xl:w-48 shrink-0">
              <h3 className="text-xl xl:text-2xl font-serif font-bold text-stone-800 leading-tight mb-2" dangerouslySetInnerHTML={{ __html: t('heroSideTitle') }}>
              </h3>
              <p className="text-[10px] xl:text-xs text-stone-500 mb-4">
                {t('heroSideSub')}
              </p>
              <a href="#cakes" className="bg-white hover:bg-stone-50 text-stone-800 px-4 py-2 rounded-full text-[10px] xl:text-xs font-bold shadow-sm border border-stone-100 flex items-center justify-center gap-1 transition-colors w-max">
                {t('exploreCakes')} <ArrowRight className="w-3 h-3 text-brand-rose" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;
