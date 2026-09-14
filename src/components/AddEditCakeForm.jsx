import React, { useState } from 'react';
import { useCakes } from '../context/CakeContext';

const AddEditCakeForm = ({ existingCake, onComplete }) => {
  const { addCake, editCake } = useCakes();
  const [formData, setFormData] = useState(existingCake || {
    name: '',
    basePrice: '',
    originalPrice: '',
    imageUrl: '',
    categories: [],
    available: true
  });

  const CATEGORIES = ['Best Seller', 'Trending', 'Seasonal', 'Offers'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCategoryToggle = (cat) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      basePrice: Number(formData.basePrice),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null
    };

    if (existingCake) {
      await editCake(existingCake.id, dataToSubmit);
    } else {
      await addCake(dataToSubmit);
    }
    onComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl border border-brand-pink-light">
      <h3 className="font-bold text-lg text-brand-brown border-b pb-2">{existingCake ? 'Edit Cake' : 'Add New Cake'}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cake Name</label>
          <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input required type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full border rounded p-2" placeholder="https://..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (₹)</label>
          <input required type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (₹) - For Strike-through/Offers</label>
          <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <label key={cat} className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded border border-gray-200 cursor-pointer hover:bg-gray-100">
              <input 
                type="checkbox" 
                checked={formData.categories.includes(cat)}
                onChange={() => handleCategoryToggle(cat)}
                className="rounded text-brand-pink focus:ring-brand-pink"
              />
              <span className="text-sm">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            name="available" 
            checked={formData.available}
            onChange={handleChange}
            className="rounded text-brand-pink focus:ring-brand-pink w-5 h-5"
          />
          <span className="font-medium text-gray-700">Available In Stock</span>
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onComplete} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-brand-brown text-white rounded hover:bg-[#4a332a]">Save Cake</button>
      </div>
    </form>
  );
};

export default AddEditCakeForm;
