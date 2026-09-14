import React from 'react';
import { ArrowRight, Leaf, Heart, ShieldCheck, Clock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const AboutSection = () => {
  const { t } = useLanguage();

  return (
    <div id="about" className="container mx-auto px-6 py-12 mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Side: About PR Cake Image & Intro */}
        <div className="relative w-full rounded-[2rem] overflow-hidden group shadow-sm border border-[#E6DFD3] min-h-[400px]">
          <img 
            src="https://images.unsplash.com/photo-1559553156-2e97137af16f?w=800&q=80" 
            alt="Bakery Process"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B19]/90 via-[#2D1B19]/40 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-white leading-tight mb-3" dangerouslySetInnerHTML={{ __html: t('aboutStoryTitle') || 'Happiness in Every Slice' }}></h3>
            <p className="text-sm md:text-base text-stone-200 mb-6 font-medium max-w-md line-clamp-3">
              {t('aboutStoryText')}
            </p>
            <button className="bg-white hover:bg-[#FAF7F2] text-brand-brown px-8 py-3 rounded-full text-sm font-bold shadow-lg flex items-center gap-2 transition-all group-hover:px-9 w-fit">
              {t('ourStory') || 'Our Story'} <ArrowRight className="w-4 h-4 text-brand-brown" />
            </button>
          </div>
        </div>

        {/* Right Side: Why choose us? */}
        <div className="bg-white rounded-[2rem] p-10 md:p-12 border border-[#E6DFD3] flex flex-col justify-center">
          <span className="text-[10px] font-bold text-brand-rose uppercase tracking-[0.2em] mb-3 block">
            {t('moreThanJustCakes') || 'MORE THAN JUST CAKES'}
          </span>
          <h3 className="text-3xl md:text-4xl font-serif font-bold text-brand-brown mb-10 leading-tight">
            {t('whyChooseUs') || 'A commitment to quality'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-6">
            <div className="flex gap-4 group">
              <div className="bg-[#FAF7F2] p-4 rounded-full h-fit border border-[#E6DFD3] text-brand-brown group-hover:bg-brand-brown group-hover:text-white transition-colors duration-300">
                <Leaf className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <div className="pt-1">
                <h4 className="text-base font-bold text-brand-brown mb-1.5">{t('premiumIngredients') || 'Premium Ingredients'}</h4>
                <p className="text-xs text-stone-500 leading-relaxed">{t('premiumIngredientsSub') || 'Only the best goes into our cakes'}</p>
              </div>
            </div>

            <div className="flex gap-4 group">
              <div className="bg-[#FAF7F2] p-4 rounded-full h-fit border border-[#E6DFD3] text-brand-brown group-hover:bg-brand-brown group-hover:text-white transition-colors duration-300">
                <Heart className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <div className="pt-1">
                <h4 className="text-base font-bold text-brand-brown mb-1.5">{t('customOrders') || 'Custom Orders'}</h4>
                <p className="text-xs text-stone-500 leading-relaxed">{t('customOrdersSub') || 'Personalise your cake just the way you want'}</p>
              </div>
            </div>

            <div className="flex gap-4 group">
              <div className="bg-[#FAF7F2] p-4 rounded-full h-fit border border-[#E6DFD3] text-brand-brown group-hover:bg-brand-brown group-hover:text-white transition-colors duration-300">
                <ShieldCheck className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <div className="pt-1">
                <h4 className="text-base font-bold text-brand-brown mb-1.5">{t('hygienicSafe') || 'Hygienic & Safe'}</h4>
                <p className="text-xs text-stone-500 leading-relaxed">{t('hygienicSafeSub') || 'Clean and safe baking practices'}</p>
              </div>
            </div>

            <div className="flex gap-4 group">
              <div className="bg-[#FAF7F2] p-4 rounded-full h-fit border border-[#E6DFD3] text-brand-brown group-hover:bg-brand-brown group-hover:text-white transition-colors duration-300">
                <Clock className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <div className="pt-1">
                <h4 className="text-base font-bold text-brand-brown mb-1.5">{t('timelyDelivery') || 'Timely Pickup'}</h4>
                <p className="text-xs text-stone-500 leading-relaxed">{t('timelyDeliverySub') || 'Fresh cakes, ready on time'}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutSection;
