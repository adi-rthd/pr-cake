import React, { useState } from 'react';
import { useReviews } from '../../context/ReviewContext';
import { useToast } from '../../context/ToastContext';
import { Star, Trash2, Edit2, Plus } from 'lucide-react';

const ManageReviews = () => {
  const { reviews, loading, addReview, updateReview, deleteReview } = useReviews();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    text: '',
    rating: 5
  });
  
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateReview(editingId, formData);
        addToast('Review updated successfully!');
      } else {
        await addReview(formData);
        addToast('Review added successfully!');
      }
      setFormData({ name: '', text: '', rating: 5 });
      setEditingId(null);
    } catch (error) {
      addToast('Error saving review', 'error');
    }
  };

  const handleEdit = (review) => {
    setEditingId(review.id);
    setFormData({
      name: review.name,
      text: review.text,
      rating: review.rating || 5
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview(id);
        addToast('Review deleted');
      } catch (error) {
        addToast('Error deleting review', 'error');
      }
    }
  };

  if (loading) return <div className="p-8 text-stone-500 animate-pulse">Loading reviews...</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Form Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
        <h2 className="text-xl font-serif font-bold text-brand-brown mb-6">
          {editingId ? 'Edit Review' : 'Add New Review'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1">Customer Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#F0EBE1] outline-none"
                placeholder="e.g. Aditi Shah"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1">Star Rating (1-5)</label>
              <select 
                value={formData.rating}
                onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}
                className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#F0EBE1] outline-none"
              >
                {[5, 4, 3, 2, 1].map(num => (
                  <option key={num} value={num}>{num} Stars</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1">Review Text</label>
            <textarea 
              value={formData.text}
              onChange={(e) => setFormData({...formData, text: e.target.value})}
              required
              rows={3}
              className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#F0EBE1] outline-none resize-none"
              placeholder="What did the customer say?"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button 
              type="submit"
              className="bg-brand-brown hover:bg-stone-700 text-white px-6 py-2.5 rounded-full font-bold transition-all flex items-center gap-2"
            >
              {editingId ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {editingId ? 'Update Review' : 'Add Review'}
            </button>
            {editingId && (
              <button 
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ name: '', text: '', rating: 5 });
                }}
                className="bg-stone-100 hover:bg-stone-200 text-stone-600 px-6 py-2.5 rounded-full font-bold transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
        <h2 className="text-xl font-serif font-bold text-brand-brown mb-6">Live Reviews</h2>
        
        {reviews.length === 0 ? (
          <div className="text-center py-12 text-stone-500 bg-stone-50 rounded-xl">
            No reviews yet. Add one above!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.map(review => (
              <div key={review.id} className="border border-stone-200 p-5 rounded-2xl relative group">
                <div className="flex gap-1 mb-2">
                  {[...Array(review.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                  ))}
                </div>
                <p className="text-sm text-stone-600 italic mb-4 line-clamp-3">"{review.text}"</p>
                <h4 className="font-bold text-sm text-stone-800">{review.name}</h4>
                {review.cakeName && (
                  <p className="text-[11px] text-brand-rose font-medium mt-1">Product: {review.cakeName}</p>
                )}

                <div className="absolute top-4 right-4 flex opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(review)} className="p-1.5 text-stone-400 hover:text-brand-brown transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(review.id)} className="p-1.5 text-stone-400 hover:text-brand-rose transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageReviews;
