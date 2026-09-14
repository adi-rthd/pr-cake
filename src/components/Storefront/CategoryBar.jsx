import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const categories = [
  { id: 'chocolate', name: 'Chocolate', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&q=80' },
  { id: 'vanilla', name: 'Vanilla', image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=300&q=80' },
  { id: 'pineapple', name: 'Pineapple', image: 'https://images.unsplash.com/photo-1559598467-f8b76c8155d0?w=300&q=80' },
  { id: 'redVelvet', name: 'Red Velvet', image: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=300&q=80' },
  { id: 'butterscotch', name: 'Butterscotch', image: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=300&q=80' },
  { id: 'fruitCakes', name: 'Fruit Cakes', image: 'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=300&q=80' },
  { id: 'cheeseCakes', name: 'Cheese Cakes', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=300&q=80' },
];

const CategoryBar = () => {
  const { t } = useLanguage();

  return (
    <div className="w-full bg-[#FAF7F2] py-12 border-b border-[#E6DFD3]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex overflow-x-auto pb-6 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0 gap-6 md:gap-8 justify-start md:justify-center items-center">
          
          {categories.map((cat) => (
            <div key={cat.id} className="flex flex-col items-center gap-3 cursor-pointer group shrink-0">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full p-1 border-2 border-transparent group-hover:border-brand-rose transition-colors duration-300">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover rounded-full shadow-sm"
                />
              </div>
              <span className="text-xs md:text-sm font-semibold text-stone-600 group-hover:text-brand-brown transition-colors">
                {t(cat.id) || cat.name}
              </span>
            </div>
          ))}

          {/* View All */}
          <div className="flex flex-col items-center gap-3 cursor-pointer group shrink-0 ml-4">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white border border-[#E6DFD3] flex items-center justify-center group-hover:border-brand-brown transition-colors duration-300 shadow-sm">
              <span className="text-2xl text-stone-400 group-hover:text-brand-brown">→</span>
            </div>
            <span className="text-xs md:text-sm font-semibold text-stone-600 group-hover:text-brand-brown transition-colors">
              {t('viewAll') || 'View All'}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CategoryBar;
