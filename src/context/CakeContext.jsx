import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useToast } from './ToastContext';

const CakeContext = createContext();

export const useCakes = () => useContext(CakeContext);

export const CakeProvider = ({ children }) => {
  const [cakes, setCakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    try {
      const cakesCollection = collection(db, 'cakes');
      const unsubscribe = onSnapshot(cakesCollection, (snapshot) => {
        const fetchedCakes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCakes(fetchedCakes);
        setLoading(false);
      }, (err) => {
        console.error("Firebase fetch failed", err);
        addToast("Error loading catalog from server", "error");
        setLoading(false);
      });

      return unsubscribe;
    } catch (err) {
      console.error("Firebase init failed", err);
      setLoading(false);
    }
  }, [addToast]);

  const addCake = async (cakeData) => {
    try {
      await addDoc(collection(db, 'cakes'), cakeData);
    } catch (err) {
      console.error("Failed to add cake to Firebase:", err);
      addToast("Failed to add product", "error");
      throw err;
    }
  };

  const editCake = async (id, updatedData) => {
    try {
      const cakeRef = doc(db, 'cakes', id);
      await updateDoc(cakeRef, updatedData);
    } catch (err) {
      console.error("Failed to edit cake in Firebase:", err);
      addToast("Failed to update product", "error");
      throw err;
    }
  };

  const deleteCake = async (id) => {
    try {
      await deleteDoc(doc(db, 'cakes', id));
    } catch (err) {
      console.error("Failed to delete cake in Firebase:", err);
      addToast("Failed to delete product", "error");
      throw err;
    }
  };

  const value = {
    cakes,
    loading,
    addCake,
    editCake,
    deleteCake
  };

  return (
    <CakeContext.Provider value={value}>
      {children}
    </CakeContext.Provider>
  );
};
