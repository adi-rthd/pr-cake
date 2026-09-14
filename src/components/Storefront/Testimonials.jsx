import React from 'react';
import { Star } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useReviews } from '../../context/ReviewContext';

const getInitials = (name) => {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

const Testimonials = () => {
  const { t } = useLanguage();
  const { reviews, loading } = useReviews();

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12 mb-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-rose"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 mb-8">
      <h2 className="text-2xl font-serif font-bold text-stone-800 mb-8">{t('whatCustomersSay')}</h2>
      
      {reviews.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-stone-100 flex items-center justify-center text-center">
          <p className="text-stone-500 font-medium">{t('noReviews')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map(review => (
            <div key={review.id} className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 flex flex-col justify-between h-full">
              <p className="text-sm text-stone-500 mb-6 italic leading-relaxed">"{review.text}"</p>
              
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-10 h-10 rounded-full bg-[#F0EBE1] text-brand-brown font-bold flex items-center justify-center shrink-0 shadow-sm border border-stone-200/50">
                  {getInitials(review.name)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-800 mb-0.5 line-clamp-1">{review.name}</h4>
                  <div className="flex gap-0.5">
                    {[...Array(review.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Testimonials;
