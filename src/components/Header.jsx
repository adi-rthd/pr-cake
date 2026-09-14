import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, User, CakeSlice } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';
import SavedDetailsModal from './SavedDetailsModal';

const Header = ({ searchTerm = '', setSearchTerm = () => {} }) => {
  const { cartItems, setIsCartOpen } = useCart();
  const { settings } = useSettings();
  const { language, changeLanguage, t } = useLanguage();
  
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const [activeSection, setActiveSection] = useState('home');
  const [isSavedDetailsOpen, setIsSavedDetailsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if scrolled to the bottom of the page
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
        setActiveSection('contact');
        return;
      }

      const sections = ['home', 'cakes', 'about', 'contact'];
      let current = 'home';
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E6DFD3]">
      <div className="container mx-auto px-4 lg:px-6 py-3 lg:py-4 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-0">
        
        <div className="flex items-center justify-between w-full md:w-auto">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <CakeSlice className="w-5 h-5 lg:w-6 lg:h-6 text-brand-brown" strokeWidth={2} />
            <span className="font-serif text-2xl lg:text-3xl font-bold tracking-tight text-brand-brown">
              {settings?.storeName || 'PR Cake'}
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-brand-rose ml-1 mt-1.5 lg:mt-2"></div>
          </div>

          {/* Right side controls - Mobile only */}
          <div className="flex md:hidden items-center gap-2">
            <div className="flex bg-[#F4F0E8] rounded-full p-0.5 border border-[#E6DFD3]">
              <button
                onClick={() => changeLanguage('en')}
                className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all ${language === 'en' ? 'bg-white text-brand-brown shadow-sm' : 'text-stone-500 hover:text-brand-brown'}`}
              >
                EN
              </button>
              <button
                onClick={() => changeLanguage('gu')}
                className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all ${language === 'gu' ? 'bg-white text-brand-brown shadow-sm' : 'text-stone-500 hover:text-brand-brown'}`}
              >
                GU
              </button>
            </div>
            
            <button 
              onClick={() => setIsSavedDetailsOpen(true)}
              className="p-2 text-stone-500 hover:text-brand-brown transition-colors bg-white rounded-full border border-[#E6DFD3] shadow-sm flex items-center justify-center shrink-0"
              aria-label="User Account"
            >
              <User className="w-4 h-4" />
            </button>
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-stone-500 hover:text-brand-brown transition-colors bg-white rounded-full border border-[#E6DFD3] shadow-sm group shrink-0"
              aria-label="Cart"
            >
              <ShoppingBag className="w-4 h-4 group-hover:scale-105 transition-transform" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-rose text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm ring-2 ring-[#FAF7F2]">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-10 text-[13px] font-medium text-stone-600 tracking-wider">
          <a href="#home" className={`transition-colors py-2 border-b-2 ${activeSection === 'home' ? 'text-brand-brown border-brand-brown' : 'border-transparent hover:text-brand-brown'}`}>{t('home')}</a>
          <a href="#cakes" className={`transition-colors py-2 border-b-2 ${activeSection === 'cakes' ? 'text-brand-brown border-brand-brown' : 'border-transparent hover:text-brand-brown'}`}>{t('cakes')}</a>
          <a href="#about" className={`transition-colors py-2 border-b-2 ${activeSection === 'about' ? 'text-brand-brown border-brand-brown' : 'border-transparent hover:text-brand-brown'}`}>{t('about')}</a>
          <a href="#contact" className={`transition-colors py-2 border-b-2 ${activeSection === 'contact' ? 'text-brand-brown border-brand-brown' : 'border-transparent hover:text-brand-brown'}`}>{t('contact')}</a>
        </nav>

        {/* Right side controls - Desktop/Tablet + Search for Mobile */}
        <div className="flex items-center gap-3 lg:gap-5 w-full md:w-auto">
          
          {/* Search Bar */}
          <div className="flex-1 md:flex-none flex items-center bg-white border border-[#E6DFD3] rounded-full px-3 lg:px-4 py-2 shadow-sm transition-all focus-within:ring-2 focus-within:ring-brand-rose/20 focus-within:border-brand-rose">
            <Search className="w-4 h-4 text-stone-400 shrink-0" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="bg-transparent border-none outline-none text-sm ml-2 w-full md:w-32 placeholder:text-stone-400 text-brand-brown" 
            />
          </div>

          {/* Desktop right controls */}
          <div className="hidden md:flex items-center gap-3 lg:gap-5">
            {/* Language Toggle */}
            <div className="flex bg-[#F4F0E8] rounded-full p-1 border border-[#E6DFD3]">
              <button
                onClick={() => changeLanguage('en')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${language === 'en' ? 'bg-white text-brand-brown shadow-sm' : 'text-stone-500 hover:text-brand-brown'}`}
              >
                EN
              </button>
              <button
                onClick={() => changeLanguage('gu')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${language === 'gu' ? 'bg-white text-brand-brown shadow-sm' : 'text-stone-500 hover:text-brand-brown'}`}
              >
                GU
              </button>
            </div>

            {/* User & Cart */}
            <button 
              onClick={() => setIsSavedDetailsOpen(true)}
              className="p-2.5 text-stone-500 hover:text-brand-brown transition-colors bg-white rounded-full border border-[#E6DFD3] shadow-sm flex items-center justify-center shrink-0"
              aria-label="User Account"
            >
              <User className="w-4 h-4" />
            </button>
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-stone-500 hover:text-brand-brown transition-colors bg-white rounded-full border border-[#E6DFD3] shadow-sm group shrink-0"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-rose text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm ring-2 ring-[#FAF7F2]">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

      </div>

      {isSavedDetailsOpen && (
        <SavedDetailsModal onClose={() => setIsSavedDetailsOpen(false)} />
      )}
    </header>
  );
};

export default Header;
