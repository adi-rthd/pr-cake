import React from 'react';
import { Leaf, Truck, ShieldCheck, Heart, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const FeaturesBanner = ({ onOpenBuilder }) => {
  const { t } = useLanguage();

  const features = [
    { icon: Leaf, title: t('feat1Title') || 'Fresh Ingredients', sub: t('feat1Sub') || 'No Preservatives' },
    { icon: ShieldCheck, title: t('safeHygienic') || '100% Vegetarian', sub: t('safeHygienicSub') || 'Pure & Safe' },
    { icon: Heart, title: t('madeWithLove') || 'Custom Orders', sub: t('madeWithLoveSub') || 'Made Just for You' },
    { icon: Truck, title: t('feat3Title') || 'Store Pickup Only', sub: t('feat3Sub') || 'Bardoli, Gujarat' }
  ];

  return (
    <div className="container mx-auto px-6 mb-16">
      
      {/* Custom Cake Promotional Banner */}
      <div className="w-full bg-[#E8DCCB] rounded-[2rem] overflow-hidden flex flex-col md:flex-row items-center justify-between mb-12 shadow-sm border border-[#D4C4B1]">
        <div className="p-10 md:p-16 flex-1">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-brown mb-4 leading-tight">
            {t('designUniqueCake') || 'Design a Cake\nas Unique as Your Moment'}
          </h2>
          <p className="text-stone-700 font-medium mb-8 max-w-sm text-lg">
            {t('chooseBaseFlavour') || 'Choose the base, flavour, frosting, toppings and more.'}
          </p>
          <button 
            onClick={onOpenBuilder}
            className="bg-brand-brown hover:bg-[#2D1B19] text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg flex items-center justify-center gap-2 group w-fit"
          >
            {t('startCustomizing') || 'Start Customizing'} 
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        <div className="w-full md:w-1/2 h-[300px] md:h-[400px] relative hidden md:block">
          <img 
            src="https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=800&q=80" 
            alt="Custom Cake"
            className="absolute inset-0 w-full h-full object-cover rounded-l-[4rem]"
          />
        </div>
      </div>

      {/* Feature Icons Below Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 px-4">
        {features.map((feat, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white border border-[#E6DFD3] flex items-center justify-center shrink-0 shadow-sm text-brand-brown">
              <feat.icon className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <div>
              <h4 className="font-bold text-brand-brown text-sm mb-0.5">{feat.title}</h4>
              <p className="text-xs text-stone-500">{feat.sub}</p>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default FeaturesBanner;
