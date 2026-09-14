import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useToast } from './ToastContext';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

const DEFAULT_SETTINGS = {
  whatsappNumber: "919265287961",
  storeName: "PR Cake",
  heroTitle: "Home-baked with *love*",
  heroSubtext: "Artisanal, 100% vegetarian cakes crafted for your special moments.",
  pickupMessage: "Store Pickup Only (No Delivery)",
  enableFilter: false,
  customizations: [
    { name: "Premium Flavor", price: 100 },
    { name: "Fondant Finish", price: 200 },
    { name: "Custom Topper", price: 50 }
  ]
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    try {
      const settingsRef = doc(db, 'settings', 'storeConfig');
      const unsubscribe = onSnapshot(settingsRef, (docSnap) => {
        if (docSnap.exists()) {
          setSettings(docSnap.data());
        } else {
          // If document doesn't exist, we fallback to default, maybe even initialize it
          setDoc(settingsRef, DEFAULT_SETTINGS).catch(err => console.error("Could not init settings doc", err));
          setSettings(DEFAULT_SETTINGS);
        }
        setLoading(false);
      }, (err) => {
        console.error("Settings fetch failed", err);
        setLoading(false);
      });

      return unsubscribe;
    } catch (err) {
      console.error("Firebase init failed for settings", err);
      setLoading(false);
    }
  }, []);

  const updateSettings = async (newSettings) => {
    try {
      const settingsRef = doc(db, 'settings', 'storeConfig');
      await setDoc(settingsRef, newSettings, { merge: true });
      addToast('Store settings updated successfully');
    } catch (err) {
      console.error("Failed to update settings:", err);
      addToast('Failed to update store settings', 'error');
      throw err;
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
