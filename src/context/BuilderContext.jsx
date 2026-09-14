import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useToast } from './ToastContext';

const BuilderContext = createContext();

export const useBuilder = () => useContext(BuilderContext);

export const BuilderProvider = ({ children }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    try {
      const optionsCollection = collection(db, 'builderSettings');
      const unsubscribe = onSnapshot(optionsCollection, (snapshot) => {
        const fetchedOptions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOptions(fetchedOptions);
        setLoading(false);
      }, (err) => {
        console.error("Firebase fetch failed", err);
        addToast("Error loading builder settings from server", "error");
        setLoading(false);
      });

      return unsubscribe;
    } catch (err) {
      console.error("Firebase init failed", err);
      setLoading(false);
    }
  }, [addToast]);

  const addOption = async (data) => {
    try {
      await addDoc(collection(db, 'builderSettings'), data);
    } catch (err) {
      console.error("Failed to add option to Firebase:", err);
      addToast("Failed to add option", "error");
      throw err;
    }
  };

  const editOption = async (id, data) => {
    try {
      const optRef = doc(db, 'builderSettings', id);
      await updateDoc(optRef, data);
    } catch (err) {
      console.error("Failed to edit option in Firebase:", err);
      addToast("Failed to update option", "error");
      throw err;
    }
  };

  const deleteOption = async (id) => {
    try {
      await deleteDoc(doc(db, 'builderSettings', id));
    } catch (err) {
      console.error("Failed to delete option in Firebase:", err);
      addToast("Failed to delete option", "error");
      throw err;
    }
  };

  const value = {
    options,
    loading,
    addOption,
    editOption,
    deleteOption
  };

  return (
    <BuilderContext.Provider value={value}>
      {children}
    </BuilderContext.Provider>
  );
};
