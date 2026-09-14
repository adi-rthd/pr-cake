import React, { useState } from 'react';
import { useCakes } from '../../context/CakeContext';
import ProductCard from './ProductCard';
import FilterDropdown from './FilterDropdown';
import { useSettings } from '../../context/SettingsContext';
import { CakeSlice, ChevronDown, Flame, Cake, Heart, UtensilsCrossed, Apple, Star, Settings2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const TABS = [
  { id: 'All', icon: Settings2 },
  { id: 'Best Seller', icon: Flame },
  { id: 'Birthday', icon: Cake },
  { id: 'Anniversary', icon: Heart },
  { id: 'Chocolate', icon: UtensilsCrossed },
  { id: 'Fruit', icon: Apple },
  { id: 'Premium', icon: Star },
  { id: 'Others', icon: CakeSlice },
];

const ProductGallery = ({ onCustomize, searchTerm = '', setSearchTerm = () => {} }) => {
  const { cakes, loading } = useCakes();
  const { settings } = useSettings();
  const { t } = useLanguage();
  
  const [filters, setFilters] = useState({
    category: 'All', // This maps to array categories (Best Seller, Trending, etc)
    cakeType: 'All', // Backend specific field
    occasion: 'All', // Backend specific field
    maxPrice: 3000,
    isVegetarianOnly: false
  });
  
  const [sortBy, setSortBy] = useState('popular');
  const [isSortOpen, setIsSortOpen] = useState(false);

  const SORT_LABELS = {
    popular: 'Popular',
    price_low: 'Price: Low to High',
    price_high: 'Price: High to Low'
  };

  const clearFilters = () => {
    setFilters({ category: 'All', cakeType: 'All', occasion: 'All', maxPrice: 3000, isVegetarianOnly: false });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-rose"></div>
      </div>
    );
  }

  const filteredCakes = cakes.filter(cake => {
    // 1. Availability check
    if (!cake.available || cake.status !== 'Active') return false;
    
    // 2. Price check
    if (filters.maxPrice && cake.basePrice > filters.maxPrice) return false;
    
    // 3. Category array check (Top Pills)
    if (filters.category !== 'All') {
      if (!cake.categories || !cake.categories.includes(filters.category)) return false;
    }

    // 4. Backend field checks (Dropdown)
    if (filters.cakeType !== 'All' && cake.cakeType !== filters.cakeType) return false;
    if (filters.occasion !== 'All' && cake.occasion !== filters.occasion) return false;
    if (filters.isVegetarianOnly && cake.isVegetarian !== true) return false;

    // 5. Search check
    if (searchTerm.trim()) {
      const normalizedSearch = searchTerm.trim().toLowerCase();
      if (!cake.name.toLowerCase().includes(normalizedSearch)) return false;
    }

    return true;
  });

  const sortedCakes = [...filteredCakes].sort((a, b) => {
    if (sortBy === 'price_low') return a.basePrice - b.basePrice;
    if (sortBy === 'price_high') return b.basePrice - a.basePrice;
    return 0;
  });

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-10 lg:px-16 mb-16 pt-8" id="cakes">
      
      {/* Main Grid Area - Full Width */}
      <div className="w-full">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <span className="text-[10px] font-bold text-brand-rose uppercase tracking-[0.2em] mb-2 block">{t('customersFavourites') || "CUSTOMERS' FAVOURITES"}</span>
            <div className="flex items-baseline gap-3">
              <h2 className="text-4xl font-serif font-bold text-brand-brown">
                {t('bestSellers') || 'Best Sellers'}
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-3 self-start sm:self-auto relative z-20">
            {settings?.enableFilter && <FilterDropdown filters={filters} setFilters={setFilters} clearFilters={clearFilters} />}
            
            <div className="relative">
              <button 
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 bg-white border border-stone-200 px-4 py-2 rounded-lg hover:border-stone-300 transition-colors text-sm font-bold text-stone-700"
              >
                {t(SORT_LABELS[sortBy]) || SORT_LABELS[sortBy]} <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isSortOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-stone-200 rounded-xl shadow-xl z-50 overflow-hidden py-2 animate-fade-in">
                    {Object.entries(SORT_LABELS).map(([key, label]) => (
                      <button 
                        key={key}
                        onClick={() => { setSortBy(key); setIsSortOpen(false); }} 
                        className={`w-full text-left px-4 py-2.5 text-sm font-bold transition-colors ${sortBy === key ? 'text-brand-rose bg-rose-50/50' : 'text-stone-600 hover:bg-stone-50'}`}
                      >
                        {t(label) || label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Grid */}
        {sortedCakes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-[#FAF7F2] rounded-3xl border border-[#E6DFD3] max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-5 text-stone-300 shadow-sm border border-[#E6DFD3]">
              <CakeSlice className="w-8 h-8 text-stone-400" />
            </div>
            <h3 className="text-2xl font-bold text-brand-brown mb-2 font-serif">
              {searchTerm.trim() ? `${t('noCakesMatching') || 'No cakes found matching'} "${searchTerm.trim()}"` : (t('noCakesFound') || 'No cakes found')}
            </h3>
            <p className="text-sm text-stone-500 max-w-sm">
              {searchTerm.trim() ? (t('noCakesMatchingSubtext') || "Try checking your spelling or using more general terms.") : (t('noCakesSubtext') || "We couldn't find any cakes in this category right now.")}
            </p>
            <button 
              onClick={() => {
                if (searchTerm.trim()) {
                  setSearchTerm('');
                } else {
                  clearFilters();
                }
              }} 
              className="mt-6 px-8 py-3 bg-brand-brown hover:bg-[#2D1B19] transition-colors text-white font-bold rounded-full text-sm"
            >
              {searchTerm.trim() ? (t('clearSearch') || 'Clear Search') : (t('clearAll') || 'Clear All')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {sortedCakes.map(cake => (
              <ProductCard key={cake.id} cake={cake} onCustomize={() => onCustomize(cake)} />
            ))}
          </div>
        )}
      </div>
      
    </div>
  );
};

export default ProductGallery;
