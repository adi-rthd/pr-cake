import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const LanguageModal = () => {
  const { hasSelected, changeLanguage } = useLanguage();

  if (hasSelected) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#FAF8F5]/90 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm p-8 text-center border border-stone-100">
        <h2 className="text-2xl font-serif text-brand-brown mb-2">Choose your language</h2>
        <h3 className="text-xl font-serif text-brand-brown mb-8 opacity-80">તમારી ભાષા પસંદ કરો</h3>
        
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => changeLanguage('en')}
            className="w-full bg-[#F0EBE1] hover:bg-[#e6dfd1] text-brand-brown py-4 rounded-full font-bold transition-all"
          >
            English
          </button>
          <button 
            onClick={() => changeLanguage('gu')}
            className="w-full bg-[#F0EBE1] hover:bg-[#e6dfd1] text-brand-brown py-4 rounded-full font-bold transition-all"
          >
            ગુજરાતી (Gujarati)
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageModal;
