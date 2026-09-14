import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';
import { CakeSlice, MapPin } from 'lucide-react';

const Footer = () => {
  const { language, changeLanguage, t } = useLanguage();
  const { settings } = useSettings();

  return (
    <footer id="contact" className="bg-[#FAF7F2] border-t border-[#E6DFD3] pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand & Mission */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <CakeSlice className="w-5 h-5 text-brand-brown" strokeWidth={2} />
              <span className="font-serif text-2xl font-bold tracking-tight text-brand-brown">
                {settings?.storeName || 'PR Cake'}
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-brand-rose ml-1 mt-1"></div>
            </div>
            <p className="text-sm text-stone-500 font-medium leading-relaxed mb-6">
              {t('heroSubtextFallback') || 'Artisanal, 100% vegetarian cakes crafted for your special moments.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-brand-brown mb-6 uppercase tracking-wider text-xs">{t('exploreCakes') || 'Explore'}</h4>
            <ul className="space-y-4 text-sm font-medium text-stone-500">
              <li><a href="#home" className="hover:text-brand-brown transition-colors">{t('home')}</a></li>
              <li><a href="#cakes" className="hover:text-brand-brown transition-colors">{t('cakes')}</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); document.querySelector('button[onClick*="setIsBuilderOpen"]')?.click(); }} className="hover:text-brand-brown transition-colors">{t('customCakes')}</a></li>
              <li><a href="#about" className="hover:text-brand-brown transition-colors">{t('about')}</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-brand-brown mb-6 uppercase tracking-wider text-xs">Support</h4>
            <ul className="space-y-4 text-sm font-medium text-stone-500">
              <li><a href="#contact" className="hover:text-brand-brown transition-colors">{t('contact')}</a></li>
              <li><a href="#" className="hover:text-brand-brown transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-brand-brown transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Store Info */}
          <div>
            <h4 className="font-bold text-brand-brown mb-6 uppercase tracking-wider text-xs">{t('storePickupOnly') || 'Store Pickup'}</h4>
            <div className="flex gap-3 text-sm font-medium text-stone-500 leading-relaxed mb-6">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-stone-400" />
              <p>123 Bakery Lane,<br/>Bardoli, Gujarat 394601</p>
            </div>
            
            <h4 className="font-bold text-brand-brown mb-4 uppercase tracking-wider text-xs">{t('chooseLanguage') || 'Language'}</h4>
            <div className="flex bg-white rounded-full p-1 border border-[#E6DFD3] w-fit">
              <button
                onClick={() => changeLanguage('en')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${language === 'en' ? 'bg-brand-brown text-white shadow-sm' : 'text-stone-500 hover:text-brand-brown'}`}
              >
                English
              </button>
              <button
                onClick={() => changeLanguage('gu')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${language === 'gu' ? 'bg-brand-brown text-white shadow-sm' : 'text-stone-500 hover:text-brand-brown'}`}
              >
                ગુજરાતી
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#E6DFD3] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-medium text-stone-400">
            <span className="w-4 h-4 bg-white border border-[#E6DFD3] rounded-full flex items-center justify-center shadow-sm">
              <span className="w-1.5 h-1.5 bg-brand-veg rounded-full"></span>
            </span>
            <span>100% Vegetarian</span>
          </div>
          <p className="text-xs text-stone-400 font-medium">
            &copy; {new Date().getFullYear()} {settings?.storeName || 'PR Cake'}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
