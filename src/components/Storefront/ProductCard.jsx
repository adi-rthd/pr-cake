import React from 'react';
import { ShoppingCart, Flame, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useReviews } from '../../context/ReviewContext';
import Price from '../Price';

const ProductCard = ({ cake, onCustomize }) => {
  const { t } = useLanguage();
  const { reviews } = useReviews();

  const isBestSeller = cake.categories?.includes('Best Seller');
  const isTrending = cake.categories?.includes('Trending');
  const isNew = cake.categories?.includes('New');

  const productReviews = reviews.filter(r => r.productId === cake.id);
  const averageRating = productReviews.length > 0 
    ? productReviews.reduce((acc, curr) => acc + (curr.rating || 5), 0) / productReviews.length 
    : 0;

  return (
    <div className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full shadow-sm border border-[#E6DFD3]">
      
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#FAF7F2]">
        <img 
          src={cake.imageUrl || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80'} 
          alt={cake.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out block"
        />
        
        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {isBestSeller && (
            <span className="bg-white/90 backdrop-blur text-brand-brown text-[10px] font-bold px-2.5 py-1 rounded-sm shadow-sm flex items-center gap-1 uppercase tracking-widest">
              <Flame className="w-3 h-3 text-brand-rose" /> Best Seller
            </span>
          )}
          {isTrending && (
            <span className="bg-[#FAF7F2]/90 backdrop-blur text-brand-brown text-[10px] font-bold px-2.5 py-1 rounded-sm shadow-sm flex items-center gap-1 uppercase tracking-widest">
              <Sparkles className="w-3 h-3 text-amber-500" /> Trending
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow relative bg-white">
        <h3 className="font-serif font-bold text-lg text-brand-brown mb-1 leading-snug line-clamp-1">{cake.name}</h3>
        
        {/* Real Rating Display */}
        {productReviews.length > 0 ? (
          <div className="flex items-center gap-1 text-[11px] font-medium text-stone-500 mb-3">
            <svg className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            <span className="text-stone-700">{averageRating.toFixed(1)}</span>
            <span>({productReviews.length})</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-[11px] font-medium text-stone-400 mb-3">
            {t('noReviewsYet') || 'No reviews yet'}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-baseline gap-2">
            <Price amount={cake.basePrice} className="text-[17px] font-bold text-brand-brown" />
            {cake.originalPrice && cake.originalPrice > cake.basePrice && (
              <Price amount={cake.originalPrice} className="text-xs font-medium text-stone-400 line-through" />
            )}
          </div>
          
          <button 
            onClick={onCustomize}
            className="bg-brand-brown hover:bg-[#2D1B19] text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm"
            aria-label="Customize and Order"
          >
            <span className="text-xl leading-none font-light mb-0.5">+</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
