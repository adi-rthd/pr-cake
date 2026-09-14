import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import Price from '../Price';

const SidebarFilter = ({ filters, setFilters, clearFilters }) => {
  const { t } = useLanguage();
  
  // Accordion state
  const [openSections, setOpenSections] = useState({
    occasion: false,
    weight: false,
    flavour: false
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCakeTypeChange = (type) => {
    if (type === 'All') {
      setFilters(prev => ({ ...prev, category: 'All' }));
    } else {
      setFilters(prev => ({ ...prev, category: type }));
    }
  };

  const cakeTypes = ['All', 'Chocolate', 'Fruit', 'Premium', 'Others'];

  return (
    <div className="bg-[#F9F7F4] p-6 rounded-2xl border border-stone-100">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-serif font-bold text-xl text-stone-800">{t('filter')}</h3>
        <button 
          onClick={clearFilters}
          className="text-[10px] font-bold text-brand-rose hover:text-brand-rose-hover uppercase tracking-wider"
        >
          {t('clearAll')}
        </button>
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <h4 className="text-sm font-bold text-stone-800 mb-4">{t('priceRange')}</h4>
        <input 
          type="range" 
          min="0" 
          max="2000" 
          value={filters.maxPrice} 
          onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
          className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-800"
        />
        <div className="flex justify-between text-xs font-bold text-stone-500 mt-2">
          <Price amount={0} size="xsmall" />
          <Price amount={filters.maxPrice} size="xsmall" />
        </div>
      </div>

      {/* Cake Type */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-stone-800 mb-4">{t('cakeType')}</h4>
        <div className="space-y-3">
          {cakeTypes.map(type => (
            <label key={type} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-4 h-4 rounded shadow-sm border flex items-center justify-center transition-colors ${filters.category === type ? 'bg-stone-800 border-stone-800 text-white' : 'bg-white border-stone-200 text-transparent group-hover:border-stone-400'}`}>
                <Check className="w-3 h-3" strokeWidth={3} />
              </div>
              <span className="text-xs text-stone-600 group-hover:text-stone-800 transition-colors">
                {t(type.toLowerCase()) || type}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Accordions */}
      <div className="border-t border-stone-200 py-4">
        <button onClick={() => toggleSection('occasion')} className="flex items-center justify-between w-full text-left">
          <span className="text-xs font-bold text-stone-800">{t('occasion')}</span>
          <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${openSections.occasion ? 'rotate-180' : ''}`} />
        </button>
      </div>
      
      <div className="border-t border-stone-200 py-4">
        <button onClick={() => toggleSection('weight')} className="flex items-center justify-between w-full text-left">
          <span className="text-xs font-bold text-stone-800">{t('weight')}</span>
          <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${openSections.weight ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <div className="border-t border-stone-200 py-4">
        <button onClick={() => toggleSection('flavour')} className="flex items-center justify-between w-full text-left">
          <span className="text-xs font-bold text-stone-800">{t('flavour')}</span>
          <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${openSections.flavour ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Dietary Preference */}
      <div className="border-t border-stone-200 pt-4 pb-2">
        <h4 className="text-xs font-bold text-stone-800 mb-4">{t('dietaryPreference')}</h4>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="w-4 h-4 rounded shadow-sm border flex items-center justify-center transition-colors bg-stone-800 border-stone-800 text-white">
            <Check className="w-3 h-3" strokeWidth={3} />
          </div>
          <span className="text-xs text-stone-600 group-hover:text-stone-800 transition-colors">
            100% Vegetarian
          </span>
        </label>
      </div>

    </div>
  );
};

export default SidebarFilter;
