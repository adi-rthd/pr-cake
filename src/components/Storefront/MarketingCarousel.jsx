import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { Loader2 } from 'lucide-react';

const MarketingCarousel = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'marketing_showcase'), (snapshot) => {
      const fetchedItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      fetchedItems.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return b.createdAt.toMillis() - a.createdAt.toMillis();
      });
      setItems(fetchedItems);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-[#FAF7F2] py-16 border-b border-[#E6DFD3] flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-brown" />
      </div>
    );
  }

  if (items.length === 0) {
    return null; // Hide if no marketing items exist
  }

  // Duplicate items for the seamless infinite loop
  const duplicatedItems = [...items, ...items, ...items, ...items]; // Quadruple to ensure it fills wide screens

  return (
    <div className="w-full bg-[#FAF7F2] py-16 md:py-20 border-b border-[#E6DFD3] overflow-hidden relative">
      
      {/* Section Heading */}
      <div className="flex flex-col items-center justify-center text-center mb-10 px-4 relative z-20">
        <span className="text-sm font-semibold tracking-widest text-brand-rose mb-2 uppercase">Portfolio</span>
        <h2 className="font-serif text-3xl md:text-4xl text-stone-800 font-bold">Our Amazing Past Orders</h2>
        <p className="text-stone-500 mt-3 max-w-2xl">
          A glimpse into the beautiful, 100% vegetarian custom cakes we've crafted for our happy customers.
        </p>
      </div>

      <div className="relative">
        {/* Fade Overlays for edges */}
        <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#FAF7F2] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#FAF7F2] to-transparent z-10 pointer-events-none"></div>
        
        <div className="max-w-none flex">
          <div className="animate-marquee-ltr flex gap-8 md:gap-12 pl-8 md:pl-12">
          {duplicatedItems.map((item, index) => (
            <div key={`${item.id}-${index}`} className="flex flex-col items-center gap-4 group shrink-0 w-40 md:w-56 cursor-pointer">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full p-1.5 border-2 border-transparent group-hover:border-brand-rose transition-colors duration-500 relative overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover rounded-full shadow-lg group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="text-center px-2">
                <h3 className="font-serif font-bold text-lg md:text-xl text-brand-brown mb-1 group-hover:text-brand-rose transition-colors">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-xs md:text-sm text-stone-500 font-medium line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingCarousel;
