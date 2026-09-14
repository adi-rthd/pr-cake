import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast Container rendered as a Portal to body to avoid stacking context issues */}
      {typeof document !== 'undefined' && createPortal(
        <div className="fixed bottom-4 right-4 z-[99999] flex flex-col gap-2 pointer-events-none">
          {toasts.map((toast) => (
            <div 
              key={toast.id} 
              className={`pointer-events-auto flex items-center justify-between gap-4 px-4 py-3 rounded-lg shadow-2xl text-sm font-medium animate-slide-in-right ${
                toast.type === 'success' ? 'bg-brand-veg text-white' : 'bg-brand-brown text-white'
              }`}
            >
              <span>{toast.message}</span>
              <button onClick={() => removeToast(toast.id)} className="opacity-80 hover:opacity-100 shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};
