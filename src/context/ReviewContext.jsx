import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';

const ReviewContext = createContext();

export const useReviews = () => useContext(ReviewContext);

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reviewData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReviews(reviewData);
      setLoading(false);
    }, (error) => {
      console.error("Reviews fetch failed", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addReview = async (review) => {
    try {
      await addDoc(collection(db, 'reviews'), {
        ...review,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Failed to add review to Firebase:", error);
      throw error;
    }
  };

  const updateReview = async (id, updatedData) => {
    try {
      const reviewRef = doc(db, 'reviews', id);
      await updateDoc(reviewRef, updatedData);
    } catch (error) {
      console.error("Failed to update review:", error);
      throw error;
    }
  };

  const deleteReview = async (id) => {
    try {
      const reviewRef = doc(db, 'reviews', id);
      await deleteDoc(reviewRef);
    } catch (error) {
      console.error("Failed to delete review:", error);
      throw error;
    }
  };

  return (
    <ReviewContext.Provider value={{ reviews, loading, addReview, updateReview, deleteReview }}>
      {children}
    </ReviewContext.Provider>
  );
};
