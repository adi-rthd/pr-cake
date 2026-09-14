import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('prCakeCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('prCakeCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (cake, quantity, customizations, itemTotal) => {
    const newItem = {
      id: Date.now().toString(), // Unique ID for each cart entry (since same cake can have different customizations)
      cakeId: cake.id,
      name: cake.name,
      basePrice: cake.basePrice,
      imageUrl: cake.imageUrl,
      quantity,
      customizations,
      itemTotal
    };
    setCartItems(prev => [...prev, newItem]);
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((total, item) => total + (item.itemTotal * item.quantity), 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    cartTotal,
    isCartOpen,
    setIsCartOpen
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
