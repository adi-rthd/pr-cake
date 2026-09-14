import React, { useState, useRef, useEffect } from 'react';
import { Filter, X, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import Price from '../Price';

const FilterDropdown = ({ filters, setFilters, clearFilters }) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cakeTypes = ['All', 'Chocolate', 'Fruit', 'Premium', 'Custom', 'Others'];
  const occasions = ['All', 'Birthday', 'Anniversary', 'Wedding', 'Regular'];

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${isOpen ? 'bg-stone-800 text-white border-stone-800' : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'}`}
      >
        <Filter className="w-4 h-4" />
        <span className="text-sm font-bold">{t('filter')}</span>
        {Object.keys(filters).length > 0 && filters.category !== 'All' && (
          <span className="w-2 h-2 rounded-full bg-brand-rose"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white border border-stone-200 rounded-2xl shadow-xl z-50 p-6 animate-fade-in origin-top-right">
          
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif font-bold text-lg text-stone-800">{t('filter')}</h3>
            <button 
              onClick={clearFilters}
              className="text-xs font-bold text-brand-rose hover:text-brand-rose-hover uppercase tracking-wider"
            >
              {t('clearAll')}
            </button>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h4 className="text-sm font-bold text-stone-800 mb-3">{t('priceRange')}</h4>
            <input 
              type="range" 
              min="0" 
              max="3000" 
              step="100"
              value={filters.maxPrice} 
              onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
              className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-800"
            />
            <div className="flex justify-between text-xs font-bold text-stone-500 mt-2">
              <Price amount={0} size="xsmall" />
              <Price amount={filters.maxPrice} size="xsmall" />
            </div>
          </div>

          {/* Category Tags */}
          <div className="mb-6">
            <h4 className="text-sm font-bold text-stone-800 mb-3">Category Tags</h4>
            <div className="flex flex-wrap gap-2">
              {['All', 'Best Seller', 'Trending', 'Seasonal', 'Offers'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilters(prev => ({ ...prev, category: cat }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${filters.category === cat ? 'bg-brand-rose text-white shadow-sm' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cake Type */}
          <div className="mb-6">
            <h4 className="text-sm font-bold text-stone-800 mb-3">{t('cakeType')}</h4>
            <div className="grid grid-cols-2 gap-2">
              {cakeTypes.map(type => (
                <label key={type} className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-4 h-4 rounded shadow-sm border flex items-center justify-center transition-colors ${filters.cakeType === type ? 'bg-stone-800 border-stone-800 text-white' : 'bg-white border-stone-200 text-transparent group-hover:border-stone-400'}`}>
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </div>
                  <span className="text-xs font-medium text-stone-600 group-hover:text-stone-800 transition-colors">
                    {t(type.toLowerCase()) || type}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Occasion */}
          <div className="mb-6">
            <h4 className="text-sm font-bold text-stone-800 mb-3">{t('occasion')}</h4>
            <div className="grid grid-cols-2 gap-2">
              {occasions.map(occ => (
                <label key={occ} className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-4 h-4 rounded shadow-sm border flex items-center justify-center transition-colors ${filters.occasion === occ ? 'bg-stone-800 border-stone-800 text-white' : 'bg-white border-stone-200 text-transparent group-hover:border-stone-400'}`}>
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </div>
                  <span className="text-xs font-medium text-stone-600 group-hover:text-stone-800 transition-colors">
                    {t(occ.toLowerCase()) || occ}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Dietary Preference */}
          <div className="border-t border-stone-100 pt-4">
            <h4 className="text-sm font-bold text-stone-800 mb-3">{t('dietaryPreference')}</h4>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-4 h-4 rounded shadow-sm border flex items-center justify-center transition-colors ${filters.isVegetarianOnly ? 'bg-brand-veg border-brand-veg text-white' : 'bg-white border-stone-200 text-transparent group-hover:border-stone-400'}`}>
                <Check className="w-3 h-3" strokeWidth={3} />
              </div>
              <span className="text-xs font-bold text-stone-700">
                100% Vegetarian Only
              </span>
              <input 
                type="checkbox" 
                checked={filters.isVegetarianOnly} 
                onChange={(e) => setFilters(prev => ({ ...prev, isVegetarianOnly: e.target.checked }))} 
                className="hidden" 
              />
            </label>
          </div>

        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
