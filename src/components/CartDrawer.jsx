import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Trash2, Calendar, Clock, User, Phone, ShoppingBag } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';
import Price from './Price';

const CartDrawer = () => {
  const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, cartTotal } = useCart();
  const { addToast } = useToast();
  const { settings } = useSettings();
  const { t } = useLanguage();
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split('T')[0];
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: defaultDate,
    time: '17:00'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("pr_cake_user_profile");
    if (!saved) return;
    try {
      const profile = JSON.parse(saved);
      setFormData(prev => ({
        ...prev,
        name: prev.name || profile.name || "",
        phone: prev.phone || profile.phone || ""
      }));
    } catch {
      // Ignore invalid localStorage data
    }
  }, []);

  if (!isCartOpen) return null;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsSubmitting(true);
    addToast('Processing order...', 'default');
    const storeName = settings?.storeName || 'PR Cake';
    const whatsappNum = settings?.whatsappNumber || '919265287961';
    
    // 1. Generate Order ID
    const shortId = '#' + Math.random().toString(36).substring(2, 8).toUpperCase();
    
    try {
      // Pre-process items: upload reference images
      const processedItems = await Promise.all(cartItems.map(async (item) => {
        if (item.customizations && item.customizations.referenceFile) {
          const file = item.customizations.referenceFile;
          const imageRef = ref(storage, `custom_designs/${Date.now()}_${file.name}`);
          await uploadBytes(imageRef, file);
          const downloadURL = await getDownloadURL(imageRef);
          
          // Remove the raw file object and attach the URL
          const newCustomizations = { ...item.customizations, customImageUrl: downloadURL };
          delete newCustomizations.referenceFile;

          return { ...item, customizations: newCustomizations };
        }
        return item;
      }));

      // 2. Construct Order Payload
      const hasCustomItems = processedItems.some(item => 
        item.isCustomQuote || 
        (item.customizations && (
          item.customizations.isCustomQuote ||
          item.customizations.flavour || 
          item.customizations.frosting
        ))
      );
      const orderType = hasCustomItems ? 'custom' : 'standard';

      const orderPayload = {
        orderId: shortId,
        createdAt: serverTimestamp(),
        customer: formData,
        items: processedItems,
        subtotal: cartTotal,
        type: 'standard_cart',
        orderType: orderType,
        status: 'Pending WhatsApp'
      };

      // 3. Save to Firestore
      await addDoc(collection(db, 'orders'), orderPayload);

      // 4. Construct WhatsApp Message
      const hasCustomQuote = processedItems.some(item => item.isCustomQuote);

      let message = `🎂 *New Order: ${storeName}*\n`;
      message += `*Order ID:* ${shortId}\n`;
      message += `*Name:* ${formData.name}\n`;
      message += `*Phone:* ${formData.phone}\n`;
      message += `*Pickup:* ${formData.date}, ${formData.time}\n\n`;
      
      message += `*Order Details:*\n`;
      processedItems.forEach((item) => {
        message += `${item.quantity}x ${item.name} (${item.customizations.weight})\n`;
        if (item.customizations.base) message += `- Base: ${item.customizations.base}\n`;
        if (item.customizations.addons && item.customizations.addons.length > 0) {
          item.customizations.addons.forEach(addon => {
            message += `- ${addon.name} (+₹${addon.price})\n`;
          });
        }
        if (item.customizations.deliveryDate) message += `- Delivery: ${item.customizations.deliveryDate}\n`;
        if (item.customizations.customMessage) message += `- Message: '${item.customizations.customMessage}'\n`;
        
        if (item.isCustomQuote && item.customizations.customImageUrl) {
          message += `\n*Reference Image:*\n${item.customizations.customImageUrl}\n`;
          message += `\n*${t('customQuoteReq')}*\n`;
        }
        message += `\n`;
      });
      
      message += `*Total:* ₹${cartTotal} ${hasCustomQuote ? '+ Custom Quote' : ''}`;

      // 5. Execute Redirect
      const encodedMessage = encodeURIComponent(message.trim());
      const whatsappUrl = `https://wa.me/${whatsappNum}?text=${encodedMessage}`;
      window.location.href = whatsappUrl;

    } catch (error) {
      console.error('Error during checkout:', error);
      addToast(t('orderError') || 'Failed to process checkout. Please try again.', 'error');
      setIsSubmitting(false);
    }

  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-md transition-opacity"
        onClick={() => setIsCartOpen(false)}
      ></div>
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-[100dvh] shadow-2xl flex flex-col animate-slide-in-right border-l border-[#E6DFD3]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-[#E6DFD3] bg-[#FAF7F2]">
          <h2 className="text-3xl font-bold font-serif text-brand-brown">{t('yourCart')}</h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white rounded-full text-stone-500 hover:text-brand-brown transition-colors border border-transparent hover:border-[#E6DFD3] shadow-sm">
            <X className="w-5 h-5" />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-stone-500 bg-white">
            <div className="w-24 h-24 bg-[#FAF7F2] rounded-full flex items-center justify-center mb-6 border border-[#E6DFD3]">
              <ShoppingBag className="w-10 h-10 text-brand-rose" />
            </div>
            <p className="text-2xl font-serif font-bold text-brand-brown mb-2">{t('cartEmpty')}</p>
            <p className="text-sm font-medium text-stone-500 text-center mb-8">{t('cartEmptySubtext')}</p>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="bg-brand-brown text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#2D1B19] transition-all shadow-lg active:scale-95"
            >
              {t('startShopping')}
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-white">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-[1.5rem] border border-[#E6DFD3] flex gap-4 relative shadow-sm">
                  <img src={item.imageUrl} alt={item.name} className="w-24 h-24 rounded-[1rem] object-cover bg-[#FAF7F2] border border-[#E6DFD3]" />
                  <div className="flex-1 pt-1">
                    <h4 className="font-bold text-brand-brown leading-tight pr-6 font-serif text-lg">{item.name}</h4>
                    <p className="text-xs text-stone-500 font-medium mb-2">{item.customizations?.weight}</p>
                    
                    <ul className="text-[11px] text-stone-400 font-medium space-y-0.5 mb-3">
                      {item.customizations?.addons?.map((addon, idx) => (
                        <li key={idx}>• {addon.name}</li>
                      ))}
                      {item.customizations?.customMessage && <li className="truncate max-w-[150px]">• Msg: "{item.customizations.customMessage}"</li>}
                    </ul>
                    
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-bold text-stone-500 bg-[#FAF7F2] px-3 py-1.5 rounded-full border border-[#E6DFD3]">{t('qty')}: {item.quantity}</span>
                      <Price amount={item.itemTotal} className="text-lg text-brand-brown" />
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      removeFromCart(item.id);
                      addToast('Item removed', 'default');
                    }}
                    className="absolute top-4 right-4 text-stone-400 hover:text-brand-rose p-1.5 transition-colors bg-white border border-transparent hover:border-brand-rose/20 rounded-full shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Checkout Form */}
            <div className="p-6 md:p-8 pb-[calc(1.5rem+env(safe-area-inset-bottom))] bg-[#FAF7F2] border-t border-[#E6DFD3] shadow-[0_-10px_30px_rgba(0,0,0,0.03)] shrink-0">
              <form onSubmit={handleCheckout} className="space-y-4">
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 relative">
                    <User className="absolute left-4 top-3.5 w-4 h-4 text-stone-400" />
                    <input type="text" name="name" required placeholder={t('yourName')} value={formData.name} onChange={handleInputChange} className="w-full pl-11 pr-4 py-3 border border-[#E6DFD3] rounded-2xl focus:ring-2 focus:ring-brand-brown/10 focus:border-brand-brown outline-none text-base bg-white transition-all font-medium text-brand-brown" />
                  </div>
                  <div className="col-span-2 relative">
                    <Phone className="absolute left-4 top-3.5 w-4 h-4 text-stone-400" />
                    <input type="tel" inputMode="tel" name="phone" required placeholder={t('phoneNumber')} value={formData.phone} onChange={handleInputChange} className="w-full pl-11 pr-4 py-3 border border-[#E6DFD3] rounded-2xl focus:ring-2 focus:ring-brand-brown/10 focus:border-brand-brown outline-none text-base bg-white transition-all font-medium text-brand-brown" />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-stone-400" />
                    <input type="date" name="date" required value={formData.date} onChange={handleInputChange} className="w-full pl-11 pr-4 py-3 border border-[#E6DFD3] rounded-2xl focus:ring-2 focus:ring-brand-brown/10 focus:border-brand-brown outline-none text-base bg-white transition-all font-medium text-brand-brown" />
                  </div>
                  <div className="relative">
                    <Clock className="absolute left-4 top-3.5 w-4 h-4 text-stone-400" />
                    <input type="time" name="time" required value={formData.time} onChange={handleInputChange} className="w-full pl-11 pr-4 py-3 border border-[#E6DFD3] rounded-2xl focus:ring-2 focus:ring-brand-brown/10 focus:border-brand-brown outline-none text-base bg-white transition-all font-medium text-brand-brown" />
                  </div>
                </div>

                <div className="pt-5 flex justify-between items-center mb-2">
                  <div className="flex flex-col">
                    <span className="text-stone-400 text-[10px] font-bold uppercase tracking-widest mb-1">{t('subtotal')}</span>
                    <div className="flex items-baseline gap-2">
                      {cartTotal > 0 && <Price amount={cartTotal} size="xlarge" className="text-brand-brown leading-none" />}
                      {cartItems.some(item => item.isCustomQuote) && (
                        <span className="text-xl font-bold font-sans text-brand-brown">
                          {cartTotal > 0 ? '+ Quote' : 'To be quoted'}
                        </span>
                      )}
                    </div>
                  </div>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-brand-brown hover:bg-[#2D1B19] disabled:bg-stone-400 text-white px-8 py-3.5 rounded-full font-bold transition-all active:scale-95 shadow-lg shadow-brand-brown/20"
                  >
                    {isSubmitting ? 'Processing...' : t('confirmOrder') || 'Confirm Order'}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
};

export default CartDrawer;
