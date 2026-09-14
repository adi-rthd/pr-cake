import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronRight, ChevronLeft, Info, Check, Upload, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { useBuilder } from '../../context/BuilderContext';
import Price from '../Price';

const CakeBuilderModal = ({ onClose }) => {
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const { t } = useLanguage();
  const { options, loading } = useBuilder();

  // Categories
  const bases = options.filter(o => o.category === 'base' && o.inStock);
  const weights = options.filter(o => o.category === 'weight' && o.inStock);
  const flavours = options.filter(o => o.category === 'flavour' && o.inStock);
  const frostings = options.filter(o => o.category === 'frosting' && o.inStock);
  const toppings = options.filter(o => o.category === 'topping' && o.inStock);

  const [step, setStep] = useState(1);
  const STEPS = ['Base', 'Flavour', 'Frosting', 'Toppings', 'Message', 'Review'];

  // State selections
  const [base, setBase] = useState(null);
  const [weight, setWeight] = useState(null);
  const [flavour, setFlavour] = useState(null);
  const [frosting, setFrosting] = useState(null);
  const [selectedToppings, setSelectedToppings] = useState({});
  const [message, setMessage] = useState('');
  const [referenceFile, setReferenceFile] = useState(null);
  const [designStyle, setDesignStyle] = useState('Standard');

  // Auto-select first available options when data loads
  useEffect(() => {
    if (!loading) {
      if (bases.length > 0 && !base) setBase(bases[0]);
      if (weights.length > 0 && !weight) setWeight(weights[0]);
    }
  }, [loading, options]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const toggleTopping = (id) => {
    setSelectedToppings(prev => ({ ...prev, [id]: !prev[id] }));
  };

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

  const calculateTotal = () => {
    if (!base || !weight) return 0;

    const multiplier = weight.price < 10 ? weight.price : getWeightMultiplier(weight.name);
    let total = (base.price || 0) * multiplier;

    if (flavour) total += flavour.price;
    if (frosting) total += frosting.price;
    toppings.forEach(t => {
      if (selectedToppings[t.id]) total += t.price;
    });
    return Math.round(total);
  };

  const handleAddToCart = () => {
    if (!base || !weight) {
      addToast('Please select a base and weight', 'error');
      setStep(1);
      return;
    }

    const activeToppings = toppings.filter(tOpt => selectedToppings[tOpt.id]).map(tOpt => ({
      name: t(tOpt.name) || tOpt.name,
      price: tOpt.price
    }));

    const mockCake = {
      id: 'custom-' + Date.now(),
      name: `Custom ${t(base.name) || base.name}`,
      basePrice: calculateTotal(),
      imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=400',
    };

    const customizations = {
      weight: t(weight.name) || weight.name,
      base: t(base.name) || base.name,
      flavour: flavour ? (t(flavour.name) || flavour.name) : 'None',
      frosting: frosting ? (t(frosting.name) || frosting.name) : 'None',
      addons: activeToppings,
      customMessage: message,
      style: designStyle,
      isCustomQuote: true,
      referenceFile: referenceFile
    };

    addToCart(mockCake, 1, customizations, calculateTotal());
    addToast('Cake added to cart!', 'default');
    onClose();
  };

  const nextStep = () => {
    if (step < 6) setStep(step + 1);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"></div>
        <div className="relative bg-white p-8 rounded-3xl flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-stone-200 border-t-[#4A3525] rounded-full animate-spin mb-4"></div>
          <p className="font-bold text-stone-600">Loading Builder Options...</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center sm:p-6 overflow-hidden">
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      <div className="relative bg-white sm:rounded-3xl shadow-2xl w-full h-[100dvh] sm:h-auto max-w-2xl overflow-hidden flex flex-col sm:max-h-[calc(100dvh-32px)] md:max-h-[90dvh] animate-fade-in">

        {/* Header & Progress */}
        <div className="py-4 px-6 md:py-4 md:px-6 bg-white border-b border-[#E6DFD3] z-10 shrink-0">
          <div className="flex justify-between items-start mb-8">
            <div>
              <span className="text-[10px] font-bold text-brand-rose uppercase tracking-[0.2em] mb-2 block">{t('designUniqueCake') || "DESIGN YOUR CAKE"}</span>
              <h2 className="text-3xl font-bold font-serif text-brand-brown">Build Custom Cake</h2>
              <p className="text-sm font-medium text-stone-500 mt-2">Step {step} of 6 &bull; {STEPS[step - 1]}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-[#FAF7F2] rounded-full transition-colors text-stone-400 border border-transparent hover:border-[#E6DFD3]">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="relative flex items-center justify-between max-w-lg mx-auto">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-[#E6DFD3] -z-10"></div>
            {STEPS.map((s, idx) => {
              const num = idx + 1;
              const isActive = step === num;
              const isPast = step > num;
              return (
                <div key={s} className="flex flex-col items-center gap-2 bg-white px-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${isActive ? 'bg-brand-brown text-white shadow-md' :
                    isPast ? 'bg-brand-brown text-white' : 'bg-white border border-[#E6DFD3] text-stone-300'
                    }`}>
                    {isPast ? <Check className="w-4 h-4" strokeWidth={3} /> : num}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Body Scrollable Area */}
        <div className="flex-1 min-h-0 overflow-y-auto p-6 custom-scrollbar bg-white">

          {/* STEP 1: BASE & WEIGHT */}
          {step === 1 && (
            <div className="animate-fade-in space-y-8">
              <div className="flex flex-col sm:flex-row gap-6 items-start justify-between bg-[#FAF7F2] p-6 rounded-[2rem] border border-[#E6DFD3]">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-brand-brown">Select Base</h3>
                  <p className="text-sm text-stone-500 mt-2 font-medium">Choose the cake base that sets the perfect foundation for your design.</p>
                </div>

                {/* Helper Box */}
                <div className="bg-white border border-[#E6DFD3] p-4 rounded-2xl flex items-start gap-3 sm:w-72 shrink-0 shadow-sm">
                  <div className="bg-[#FAF7F2] p-2 rounded-xl text-brand-brown">
                    <Info className="w-4 h-4" />
                  </div>
                  <p className="text-[11px] text-stone-500 leading-relaxed font-medium">
                    Not sure? Each base gives a different taste and texture. You can always change it later.
                  </p>
                </div>
              </div>

              {/* 2x2 Grid for Base */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {bases.map(b => (
                  <div
                    key={b.id}
                    onClick={() => setBase(b)}
                    className={`relative flex flex-col cursor-pointer rounded-2xl transition-all border-2 bg-white overflow-hidden group ${base?.id === b.id ? 'border-brand-brown shadow-md' : 'border-[#E6DFD3] hover:border-brand-rose/50 shadow-sm'}`}
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden bg-[#FAF7F2] relative">
                      <img src={b.image || 'src\assets\long_banner.png'} alt={b.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>

                    <div className="p-5 bg-white flex flex-col justify-between flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold text-brand-brown text-lg leading-tight">{t(b.name) || b.name}</p>
                          <Price amount={b.price} className="text-sm font-medium text-stone-500 mt-1 block" />
                        </div>
                        <div className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center transition-colors border-2 ${base?.id === b.id ? 'bg-brand-brown border-brand-brown text-white' : 'border-[#E6DFD3]'}`}>
                          {base?.id === b.id && <Check className="w-4 h-4" strokeWidth={3} />}
                        </div>
                      </div>
                      {b.description && (
                        <p className="text-xs text-stone-500 leading-relaxed mt-2 line-clamp-2">{b.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-[#E6DFD3]">
                <h3 className="font-serif font-bold text-brand-brown text-xl mb-4">Select Weight</h3>
                <div className="flex flex-wrap gap-4">
                  {weights.map(w => (
                    <button
                      key={w.id}
                      onClick={() => setWeight(w)}
                      className={`px-8 py-3 rounded-full font-bold text-sm transition-all border-2 ${weight?.id === w.id
                        ? 'bg-brand-brown text-white border-brand-brown shadow-md'
                        : 'bg-white text-stone-600 border-[#E6DFD3] hover:border-brand-brown/50 shadow-sm'
                        }`}
                    >
                      {t(w.name) || w.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: FLAVOUR */}
          {step === 2 && (
            <div className="animate-fade-in max-w-lg mx-auto">
              <h3 className="text-2xl font-serif font-bold text-brand-brown mb-2">Select Flavour</h3>
              <p className="text-sm text-stone-500 mb-8 font-medium">Choose your cake's core flavour profile.</p>
              <div className="space-y-4">
                {flavours.map(f => (
                  <div
                    key={f.id}
                    onClick={() => setFlavour(f)}
                    className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer border-2 bg-white transition-all ${flavour?.id === f.id ? 'border-brand-brown bg-[#FAF7F2] shadow-sm' : 'border-[#E6DFD3] hover:border-brand-rose/50 shadow-sm'}`}
                  >
                    <div className="flex items-center gap-4">
                      {f.image ? (
                        <div className="w-14 h-14 rounded-full overflow-hidden relative shadow-sm border border-[#E6DFD3] shrink-0 bg-white">
                          <img src={f.image} className="absolute inset-0 w-full h-full object-cover block" alt="" />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-[#FAF7F2] border border-[#E6DFD3] shrink-0" />
                      )}
                      <span className={`font-bold text-base ${flavour?.id === f.id ? 'text-brand-brown' : 'text-stone-700'}`}>{t(f.name) || f.name}</span>
                    </div>
                    <div className="flex items-center gap-5">
                      {f.price > 0 ? (
                        <Price amount={f.price} prefix="+" className="text-sm font-bold text-stone-500" />
                      ) : (
                        <span className="text-sm font-bold text-stone-500">Included</span>
                      )}
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors border-2 ${flavour?.id === f.id ? 'bg-brand-brown border-brand-brown text-white' : 'border-[#E6DFD3]'}`}>
                        {flavour?.id === f.id && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: FROSTING */}
          {step === 3 && (
            <div className="animate-fade-in max-w-lg mx-auto">
              <h3 className="text-2xl font-serif font-bold text-brand-brown mb-2">Select Frosting</h3>
              <p className="text-sm text-stone-500 mb-8 font-medium">The perfect outer layer for your cake.</p>
              <div className="space-y-4">
                {frostings.map(f => (
                  <div
                    key={f.id}
                    onClick={() => setFrosting(f)}
                    className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer border-2 bg-white transition-all ${frosting?.id === f.id ? 'border-brand-brown bg-[#FAF7F2] shadow-sm' : 'border-[#E6DFD3] hover:border-brand-rose/50 shadow-sm'}`}
                  >
                    <div className="flex items-center gap-4">
                      {f.image ? <img src={f.image} className="w-14 h-14 rounded-full object-cover shadow-sm border border-[#E6DFD3]" alt="" /> : <div className="w-14 h-14 rounded-full bg-[#FAF7F2] border border-[#E6DFD3]" />}
                      <span className={`font-bold text-base ${frosting?.id === f.id ? 'text-brand-brown' : 'text-stone-700'}`}>{t(f.name) || f.name}</span>
                    </div>
                    <div className="flex items-center gap-5">
                      {f.price > 0 ? (
                        <Price amount={f.price} prefix="+" className="text-sm font-bold text-stone-500" />
                      ) : (
                        <span className="text-sm font-bold text-stone-500">Included</span>
                      )}
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors border-2 ${frosting?.id === f.id ? 'bg-brand-brown border-brand-brown text-white' : 'border-[#E6DFD3]'}`}>
                        {frosting?.id === f.id && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: TOPPINGS */}
          {step === 4 && (
            <div className="animate-fade-in max-w-lg mx-auto">
              <h3 className="text-2xl font-serif font-bold text-brand-brown mb-2">Add Toppings (Optional)</h3>
              <p className="text-sm text-stone-500 mb-8 font-medium">Elevate your cake with premium additions.</p>
              <div className="space-y-4">
                {toppings.map(tOption => (
                  <label key={tOption.id} className={`flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition-all ${selectedToppings[tOption.id] ? 'bg-[#FAF7F2] border-brand-brown shadow-sm' : 'bg-white border-[#E6DFD3] hover:border-brand-rose/50 shadow-sm'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center border-2 transition-colors ${selectedToppings[tOption.id] ? 'bg-brand-brown border-brand-brown text-white' : 'border-[#E6DFD3] bg-white'}`}>
                        {selectedToppings[tOption.id] && <Check className="w-4 h-4" strokeWidth={3} />}
                      </div>
                      <input
                        type="checkbox"
                        checked={!!selectedToppings[tOption.id]}
                        onChange={() => toggleTopping(tOption.id)}
                        className="hidden"
                      />
                      {tOption.image ? <img src={tOption.image} className="w-12 h-12 rounded-lg object-cover shadow-sm border border-[#E6DFD3]" alt="" /> : <div className="w-12 h-12 rounded-lg bg-[#FAF7F2] border border-[#E6DFD3]" />}
                      <span className={`font-bold text-base ${selectedToppings[tOption.id] ? 'text-brand-brown' : 'text-stone-700'}`}>{t(tOption.name) || tOption.name}</span>
                    </div>
                    <Price amount={tOption.price} prefix="+" className="text-sm font-bold text-stone-500" />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: MESSAGE & UPLOAD */}
          {step === 5 && (
            <div className="animate-fade-in max-w-lg mx-auto space-y-8">
              <div>
                <h3 className="text-2xl font-serif font-bold text-brand-brown mb-2">Cake Message</h3>
                <p className="text-sm text-stone-500 mb-4 font-medium">What should we write on the cake?</p>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="e.g., Happy Birthday John!"
                  className="w-full p-6 border-2 border-[#E6DFD3] rounded-2xl outline-none focus:border-brand-brown focus:ring-4 focus:ring-brand-brown/10 resize-none h-32 bg-white shadow-sm transition-all font-medium text-brand-brown text-base"
                ></textarea>
              </div>

              <div>
                <h3 className="text-xl font-serif font-bold text-brand-brown mb-2">Reference Image</h3>
                <p className="text-sm text-stone-500 mb-4 font-medium">Have a specific design in mind? Upload a reference.</p>

                {referenceFile ? (
                  <div className="relative rounded-xl border border-stone-200 p-2 flex items-center gap-4 bg-[#FAF7F2]">
                    <img
                      src={URL.createObjectURL(referenceFile)}
                      alt="Reference Preview"
                      className="w-16 h-16 object-cover rounded-lg border border-stone-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-stone-800 truncate">{referenceFile.name}</p>
                      <p className="text-xs text-stone-500">{(referenceFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button
                      onClick={() => setReferenceFile(null)}
                      className="p-2 text-stone-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-stone-300 rounded-xl p-6 text-center hover:bg-stone-50 transition-colors cursor-pointer relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) setReferenceFile(e.target.files[0]);
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="w-8 h-8 text-stone-400 mx-auto mb-3" />
                    <p className="text-sm font-bold text-stone-600">Click to upload reference design (Optional)</p>
                    <p className="text-xs text-stone-400 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 6: REVIEW */}
          {step === 6 && (
            <div className="animate-fade-in max-w-lg mx-auto space-y-6">
              <h3 className="text-2xl font-serif font-bold text-brand-brown mb-6">Review Order</h3>

              <div className="bg-[#FAF7F2] p-8 rounded-[2rem] border border-[#E6DFD3] space-y-5 shadow-sm">
                <div className="flex justify-between items-center pb-4 border-b border-[#F2EAE1]">
                  <span className="text-sm font-bold text-stone-500">Base</span>
                  <span className="text-sm font-bold text-stone-800">{base ? (t(base.name) || base.name) : '-'}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-[#F2EAE1]">
                  <span className="text-sm font-bold text-stone-500">Weight</span>
                  <span className="text-sm font-bold text-stone-800">{weight ? (t(weight.name) || weight.name) : '-'}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-[#F2EAE1]">
                  <span className="text-sm font-bold text-stone-500">Flavour</span>
                  <div className="text-right">
                    <span className="text-sm font-bold text-stone-800 block">{flavour ? (t(flavour.name) || flavour.name) : 'None'}</span>
                    {flavour && flavour.price > 0 ? (
                      <Price amount={flavour.price} prefix="+" className="text-xs text-stone-500" />
                    ) : (
                      <Price amount={0} prefix="+" className="text-xs text-stone-500" />
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-[#F2EAE1]">
                  <span className="text-sm font-bold text-stone-500">Frosting</span>
                  <div className="text-right">
                    <span className="text-sm font-bold text-stone-800 block">{frosting ? (t(frosting.name) || frosting.name) : 'None'}</span>
                    {frosting && frosting.price > 0 ? (
                      <Price amount={frosting.price} prefix="+" className="text-xs text-stone-500" />
                    ) : (
                      <Price amount={0} prefix="+" className="text-xs text-stone-500" />
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-[#F2EAE1]">
                  <span className="text-sm font-bold text-stone-500">Message</span>
                  <span className="text-sm font-bold text-stone-800">{message || 'None'}</span>
                </div>

                {toppings.filter(tOpt => selectedToppings[tOpt.id]).length > 0 && (
                  <div className="pt-2">
                    <span className="text-sm font-bold text-stone-500 mb-3 block">Toppings</span>
                    {toppings.filter(tOpt => selectedToppings[tOpt.id]).map(tOpt => (
                      <div key={tOpt.id} className="flex justify-between items-center mb-2 pl-4">
                        <span className="text-sm font-medium text-stone-800">• {t(tOpt.name) || tOpt.name}</span>
                        <Price amount={tOpt.price} prefix="+" className="text-sm font-bold text-stone-500" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="py-4 px-6 md:px-8 md:py-4 bg-white border-t border-[#E6DFD3] flex items-center justify-between shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.02)] pb-[calc(1rem+env(safe-area-inset-bottom))] sm:pb-4 md:pb-4">
          <div className="flex items-center gap-4 sm:gap-6">
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full border border-[#E6DFD3] text-stone-400 hover:text-brand-brown hover:bg-[#FAF7F2] transition-colors shrink-0">
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}
            <div>
              <p className="text-[9px] sm:text-[10px] text-stone-400 uppercase tracking-widest font-bold mb-0.5 sm:mb-1">Total</p>
              <Price amount={calculateTotal()} size="xlarge" className="text-xl sm:text-2xl text-brand-brown leading-none" />
            </div>
          </div>

          {step < 6 ? (
            <button
              onClick={nextStep}
              className="bg-brand-brown hover:bg-[#2D1B19] text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full font-bold transition-all flex items-center gap-2 shadow-lg active:scale-95 text-sm sm:text-base"
            >
              Next Step <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className="bg-brand-brown hover:bg-[#2D1B19] text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full font-bold shadow-lg transition-all active:scale-95 flex items-center gap-2 text-sm sm:text-base"
            >
              Add to Cart <Check className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default CakeBuilderModal;
