import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Save } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';

const SavedDetailsModal = ({ onClose }) => {
  const { t } = useLanguage();
  const { addToast } = useToast();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("pr_cake_user_profile");
      if (saved) {
        const profile = JSON.parse(saved);
        setName(profile.name || "");
        setPhone(profile.phone || "");
      }
    } catch {
      // Ignore invalid localStorage data
    }

    // Prevent body scrolling
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem("pr_cake_user_profile", JSON.stringify({ name, phone }));
      setIsSaved(true);
      addToast(t('savedDetailsSuccess') || 'Your details have been saved on this device.', 'default');
      setTimeout(() => {
        setIsSaved(false);
        onClose();
      }, 1500);
    } catch {
      addToast('Error saving details', 'error');
    }
  };

  return ReactDOM.createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 m-4 overflow-hidden animate-fade-in flex flex-col max-h-[calc(100dvh-2rem)] pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
        onClick={(e) => e.stopPropagation()}
      >
        
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-full transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold font-serif text-brand-brown mb-2 pr-8">{t('savedDetails') || 'Saved Details'}</h2>
        
        <div className="overflow-y-auto custom-scrollbar pr-2 mb-6">
          <p className="text-sm font-medium text-stone-500 mb-6 leading-relaxed">
            {t('savedDetailsHelper') || 'Your details are saved on this device for faster checkout. No account creation required.'}
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-brand-brown uppercase tracking-widest mb-1.5">{t('defaultName') || 'Default Name'}</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul"
                className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-brown/10 focus:border-brand-brown bg-white transition-all text-base font-medium text-brand-brown"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-brand-brown uppercase tracking-widest mb-1.5">{t('defaultWhatsApp') || 'Default WhatsApp Number'}</label>
              <input 
                type="tel" 
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-brown/10 focus:border-brand-brown bg-white transition-all text-base font-medium text-brand-brown"
              />
            </div>
          </div>
        </div>

        <div className="mt-auto pt-2">
          <button 
            onClick={handleSave}
            className="w-full bg-brand-brown hover:bg-[#2D1B19] text-white px-8 py-3 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 shadow-md shadow-brand-brown/20 shrink-0"
          >
            {isSaved ? (
              <>{t('savedStatus') || 'Saved'} <span className="text-lg">✓</span></>
            ) : (
              <>{t('saveOnThisDevice') || 'Save on this Device'} <Save className="w-4 h-4" /></>
            )}
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};

export default SavedDetailsModal;
