import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Price from './Price';

const ProductCard = ({ cake, onCustomize }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 group flex flex-col h-full shadow-sm">
      
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        <img 
          src={cake.imageUrl || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80'} 
          alt={cake.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {cake.categories?.map((cat, idx) => (
            <span key={idx} className="bg-white/90 backdrop-blur-md text-brand-brown text-[9px] font-bold px-2 py-1 rounded-full shadow-sm tracking-wide uppercase">
              {t(cat.toLowerCase().replace(' ', '')) || cat}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow relative">
        <div className="pr-10">
          <h3 className="font-bold text-sm text-stone-800 mb-1 leading-snug line-clamp-1">{cake.name}</h3>
          <div className="flex items-baseline gap-2">
            <Price amount={cake.basePrice} className="text-sm font-bold text-stone-800" />
            {cake.originalPrice && cake.originalPrice > cake.basePrice && (
              <Price amount={cake.originalPrice} className="text-xs text-stone-400 line-through" />
            )}
          </div>
        </div>
        
        {/* Circular Add Button */}
        <button 
          onClick={onCustomize}
          className="absolute bottom-4 right-4 bg-[#FCECEE] hover:bg-brand-rose text-brand-rose hover:text-white w-9 h-9 rounded-full flex items-center justify-center transition-colors shadow-sm"
          aria-label="Customize and Order"
        >
          <ShoppingCart className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
