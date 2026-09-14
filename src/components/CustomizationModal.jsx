import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Star, Leaf, Check, MessageCircle, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useBuilder } from '../context/BuilderContext';
import { useReviews } from '../context/ReviewContext';
import { useLanguage } from '../context/LanguageContext';
import Price from './Price';

const CustomizationModal = ({ cake, onClose }) => {
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const { t } = useLanguage();
  
  const { options, loading: builderLoading } = useBuilder();
  const { reviews, addReview } = useReviews();
  
  const [totalPrice, setTotalPrice] = useState(0);

  // Derived builder options
  const weights = options.filter(o => o.category === 'weight' && o.inStock);
  const toppings = options.filter(o => o.category === 'topping' && o.inStock);

  // Derived reviews
  const productReviews = reviews.filter(r => r.productId === cake.id);
  const averageRating = productReviews.length > 0 
    ? productReviews.reduce((acc, curr) => acc + (curr.rating || 5), 0) / productReviews.length 
    : 0;

  // Customization state
  const [weight, setWeight] = useState(null); 
  const [selectedAddons, setSelectedAddons] = useState({});
  const [customMessage, setCustomMessage] = useState('');

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  // Initialize default weight
  useEffect(() => {
    if (!builderLoading && weights.length > 0 && !weight) {
      setWeight(weights[0]);
    }
  }, [builderLoading, weights, weight]);

  const getWeightMultiplier = (weightName) => {
    if (!weightName) return 1;
    const normalized = weightName.toLowerCase().replace(/\s+/g, '');
    if (normalized.includes('1/2') || normalized.includes('0.5')) return 0.6;
    
    const match = normalized.match(/([0-9.]+)(?=kg)/);
    if (match) {
        const val = parseFloat(match[1]);
        if (!isNaN(val)) return val === 2 ? 1.8 : val;
    }
    
    return 1;
  };

  useEffect(() => {
    const multiplier = getWeightMultiplier(weight?.name);
    let base = cake.basePrice * multiplier;
    
    // Add dynamically selected customizations (toppings)
    toppings.forEach(addon => {
      if (selectedAddons[addon.name]) {
        base += Number(addon.price);
      }
    });

    setTotalPrice(Math.round(base));
  }, [weight, selectedAddons, cake.basePrice, toppings]);

  const toggleAddon = (addonName) => {
    setSelectedAddons(prev => ({
      ...prev,
      [addonName]: !prev[addonName]
    }));
  };

  // Prevent body scrolling when modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const handleAddToCart = () => {
    const activeAddons = [];
    toppings.forEach(addon => {
      if (selectedAddons[addon.name]) {
        activeAddons.push({ name: addon.name, price: Number(addon.price) });
      }
    });

    const customizations = {
      weight: weight ? weight.name : 'Standard',
      addons: activeAddons,
      customMessage: customMessage.trim() || null
    };
    
    addToCart(cake, 1, customizations, totalPrice);
    addToast(t('addedToCart') || 'Added to cart!');
    onClose();
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await addReview({
        productId: cake.id,
        cakeName: cake.name,
        name: reviewName,
        text: reviewText,
        rating: reviewRating
      });
      addToast(t('reviewSubmitted') || 'Review submitted successfully!');
      setShowReviewForm(false);
      setReviewName('');
      setReviewText('');
      setReviewRating(5);
    } catch (error) {
      addToast(t('reviewError') || 'Error submitting review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center sm:p-6 md:p-12 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-md transition-opacity" onClick={onClose}></div>
      
      {/* Modal Container */}
      <div className="relative bg-white sm:rounded-[2rem] shadow-2xl w-full max-w-5xl flex flex-col md:flex-row h-[100dvh] sm:h-auto sm:max-h-[calc(100dvh-32px)] md:max-h-[90dvh] overflow-hidden animate-slide-up sm:animate-fade-in border border-[#E6DFD3]">
        
        {/* Left Side: Large Image (Desktop only) */}
        <div className="hidden md:block w-1/2 bg-[#FAF7F2] relative shrink-0 min-h-0 overflow-hidden">
          <img 
            src={cake.imageUrl || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80'} 
            alt={cake.name} 
            className="absolute inset-0 w-full h-full object-cover" 
          />
          {cake.isVegetarian !== false && (
            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur text-brand-veg text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 border border-[#E6DFD3]">
              <Leaf className="w-3.5 h-3.5" /> 100% Vegetarian
            </div>
          )}
        </div>

        {/* Right Side: Details & Configuration (The Scroll Architecture) */}
        <div className="w-full md:w-1/2 flex flex-col relative min-h-0 bg-white overflow-hidden">
          
          {/* Header - Fixed */}
          <div className="shrink-0 flex items-center justify-between p-4 md:p-6 border-b border-[#E6DFD3] bg-white z-10">
            <h2 className="text-lg md:text-xl font-serif font-bold text-brand-brown truncate pr-4">{cake.name}</h2>
            <button onClick={onClose} className="shrink-0 bg-stone-100 hover:bg-stone-200 p-2 rounded-full transition-colors text-stone-500">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-6 md:p-8 custom-scrollbar relative">
            
            {/* Mobile Image (Inside scroll so it moves away) */}
            <div className="md:hidden relative h-56 mb-6 rounded-2xl overflow-hidden bg-[#FAF7F2] shrink-0 border border-[#E6DFD3]">
              <img 
                src={cake.imageUrl || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80'} 
                alt={cake.name} 
                className="absolute inset-0 w-full h-full object-cover" 
              />
              {cake.isVegetarian !== false && (
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-brand-veg text-xs font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1 border border-[#E6DFD3]">
                  <Leaf className="w-3 h-3" /> Veg
                </div>
              )}
            </div>

            {/* Header Info */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-xs font-medium text-amber-500 mb-3">
                {productReviews.length > 0 ? (
                  <>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.round(averageRating) ? 'fill-current' : 'text-stone-300'}`} />
                      ))}
                    </div>
                    <span className="text-stone-500 font-bold ml-1">{averageRating.toFixed(1)}</span>
                    <span className="text-stone-500">({productReviews.length} {productReviews.length === 1 ? (t('review') || 'Review') : (t('reviews') || 'Reviews')})</span>
                  </>
                ) : (
                  <span className="text-stone-500 bg-stone-100 px-2 py-1 rounded-md">{t('noReviewsYet') || 'No reviews yet'}</span>
                )}
              </div>
              <p className="text-stone-500 text-sm leading-relaxed mb-6 font-medium">
                {cake.description || t('shopBannerSubtext') || 'Freshly baked, 100% vegetarian cakes for every occasion.'}
              </p>
              <div className="flex items-baseline gap-2">
                <Price amount={Math.round(cake.basePrice * getWeightMultiplier(weight?.name))} size="xlarge" className="text-brand-brown" />
              </div>
            </div>

            <hr className="border-[#E6DFD3] mb-8" />

            {/* Config: Weight */}
            {weights.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-brand-brown uppercase tracking-wider text-xs">{t('selectWeight') || 'Select Weight'}</h4>
                  <span className="text-[10px] text-stone-400 font-medium">{t('required') || 'Required'}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {weights.map(w => (
                    <label key={w.id} className={`flex flex-col items-center justify-center py-3 px-4 rounded-xl cursor-pointer border-2 transition-all flex-1 min-w-[100px] ${weight?.id === w.id ? 'border-brand-brown bg-[#FAF7F2]' : 'border-[#E6DFD3] hover:border-stone-300 bg-white'}`}>
                      <input type="radio" name="weight" checked={weight?.id === w.id} onChange={() => setWeight(w)} className="hidden" />
                      <span className={`font-bold text-sm mb-1 ${weight?.id === w.id ? 'text-brand-brown' : 'text-stone-600'}`}>{w.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Config: Add-ons */}
            {toppings.length > 0 && (
              <div className="mb-8">
                <h4 className="font-bold text-brand-brown uppercase tracking-wider text-xs mb-4">{t('addonsAndMessage') || 'Add-ons'}</h4>
                <div className="space-y-3">
                  {toppings.map((addon) => (
                    <label key={addon.id} className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors ${selectedAddons[addon.name] ? 'border-brand-brown bg-[#FAF7F2]' : 'border-[#E6DFD3] hover:border-stone-300 bg-white'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${selectedAddons[addon.name] ? 'bg-brand-brown border-brand-brown' : 'border-stone-300 bg-white'}`}>
                          {selectedAddons[addon.name] && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                        </div>
                        <input 
                          type="checkbox" 
                          checked={!!selectedAddons[addon.name]} 
                          onChange={() => toggleAddon(addon.name)} 
                          className="hidden" 
                        />
                        <div className="flex items-center gap-3">
                          {addon.image && <img src={addon.image} className="w-8 h-8 rounded-md object-cover border border-[#E6DFD3]" alt="" />}
                          <span className={`font-semibold text-sm ${selectedAddons[addon.name] ? 'text-brand-brown' : 'text-stone-700'}`}>{addon.name}</span>
                        </div>
                      </div>
                      <Price amount={addon.price} prefix="+" className="text-sm font-bold text-stone-500" />
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Config: Message */}
            <div className="mb-10">
              <h4 className="font-bold text-brand-brown uppercase tracking-wider text-xs mb-4">{t('messageOptional') || 'Message on Cake'}</h4>
              <input 
                type="text" 
                placeholder="e.g. Happy Anniversary!"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full p-4 border border-[#E6DFD3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8DCCB] focus:border-brand-brown bg-white transition-all text-base font-medium text-brand-brown"
                maxLength={40}
              />
            </div>

            <hr className="border-[#E6DFD3] mb-8" />

            {/* Reviews Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold text-brand-brown uppercase tracking-wider text-xs flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" /> {t('customerReviews') || 'Customer Reviews'}
                </h4>
                <button 
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="text-xs font-bold text-brand-rose hover:text-brand-rose/80 transition-colors"
                >
                  {showReviewForm ? (t('cancel') || 'Cancel') : (t('writeReview') || 'Write a Review')}
                </button>
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <form onSubmit={handleReviewSubmit} className="bg-[#FAF7F2] p-5 rounded-xl border border-[#E6DFD3] mb-6 animate-fade-in space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">{t('yourName') || 'Your Name'}</label>
                    <input 
                      required 
                      type="text" 
                      value={reviewName} 
                      onChange={e => setReviewName(e.target.value)} 
                      className="w-full p-3 border border-[#E6DFD3] rounded-lg focus:outline-none focus:border-brand-brown text-base"
                      placeholder="e.g. Aditi"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">{t('rating') || 'Rating'}</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(num => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setReviewRating(num)}
                          className={`p-2 rounded-lg border transition-colors ${reviewRating >= num ? 'bg-amber-50 border-amber-200 text-amber-500' : 'bg-white border-[#E6DFD3] text-stone-300'}`}
                        >
                          <Star className={`w-5 h-5 ${reviewRating >= num ? 'fill-current' : ''}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">{t('yourReview') || 'Your Review'}</label>
                    <textarea 
                      required 
                      value={reviewText} 
                      onChange={e => setReviewText(e.target.value)} 
                      className="w-full p-3 border border-[#E6DFD3] rounded-lg focus:outline-none focus:border-brand-brown text-base resize-none h-24"
                      placeholder="What did you think of this cake?"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={submittingReview}
                    className="w-full bg-brand-brown hover:bg-[#2D1B19] text-white py-3 rounded-lg font-bold text-sm transition-colors disabled:opacity-50"
                  >
                    {submittingReview ? (t('submitting') || 'Submitting...') : (t('submitReview') || 'Submit Review')}
                  </button>
                </form>
              )}

              {/* Review List */}
              <div className="space-y-4">
                {productReviews.length === 0 ? (
                  <div className="text-center py-8 text-stone-500 text-sm border border-dashed border-[#E6DFD3] rounded-xl bg-stone-50">
                    {t('noReviewsSubtext') || 'Be the first to review this delicious cake!'}
                  </div>
                ) : (
                  productReviews.map(review => (
                    <div key={review.id} className="p-4 border border-[#E6DFD3] rounded-xl bg-white shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#E6DFD3] flex items-center justify-center text-brand-brown">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-stone-800">{review.name}</p>
                            <div className="flex text-amber-400">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < (review.rating || 5) ? 'fill-current' : 'text-stone-300'}`} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] text-stone-400 font-medium">
                          {review.createdAt?.toDate ? review.createdAt.toDate().toLocaleDateString() : 'Recent'}
                        </span>
                      </div>
                      <p className="text-sm text-stone-600 leading-relaxed mt-3 break-words">{review.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Footer - Fixed */}
          <div className="shrink-0 p-4 md:p-6 border-t border-[#E6DFD3] bg-white flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.02)] pb-[max(16px,env(safe-area-inset-bottom))]">
            <div>
              <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold mb-1">{t('total') || 'Total'}</p>
              <Price amount={totalPrice} size="large" className="text-brand-brown leading-none" />
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="bg-brand-brown hover:bg-[#2D1B19] text-white px-8 sm:px-10 py-3.5 rounded-full font-bold shadow-lg transition-all active:scale-95 flex items-center gap-2 text-sm sm:text-base"
            >
              {t('addToCart') || 'Add to Cart'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );

  // Render modal at the root level using React Portal to escape any transformed parents
  return createPortal(modalContent, document.body);
};

export default CustomizationModal;
