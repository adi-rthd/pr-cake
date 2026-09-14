import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useCakes } from '../../context/CakeContext';
import { useToast } from '../../context/ToastContext';

const CATEGORIES = ['Best Seller', 'Trending', 'Seasonal', 'Offers'];

const AddEditCakeForm = ({ existingCake, onComplete }) => {
  const { addCake, editCake } = useCakes();
  const { addToast } = useToast();
  
  const [formData, setFormData] = useState(existingCake || {
    name: '',
    basePrice: '',
    originalPrice: '',
    imageUrl: '',
    categories: [],
    available: true,
    status: 'Active',
    cakeType: 'Others',
    occasion: 'Regular',
    flavour: '',
    isVegetarian: true
  });

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
      addToast('Product updated successfully');
    } else {
      await addCake(dataToSubmit);
      addToast('Product added successfully');
    }
    onComplete();
  };

  return (
    <div className="flex flex-col h-full bg-stone-50">
      <div className="flex justify-between items-center p-6 border-b border-stone-200 bg-white">
        <h2 className="text-xl font-bold text-stone-800 font-serif">
          {existingCake ? 'Edit Product' : 'Add New Product'}
        </h2>
        <button onClick={onComplete} className="p-2 hover:bg-stone-100 rounded-full text-stone-500 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <form id="cake-form" onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1">Product Name</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-rose focus:border-brand-rose outline-none transition-all" />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1">Image URL</label>
              <input required type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-rose focus:border-brand-rose outline-none transition-all" placeholder="https://..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1">Base Price (₹)</label>
                <input required type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-rose outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1">Discount Price (₹)</label>
                <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-rose outline-none" placeholder="Optional" />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-sm font-semibold text-stone-700 mb-2">Category Tags</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <label key={cat} className={`flex items-center px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                  formData.categories.includes(cat) ? 'bg-brand-rose border-brand-rose text-white shadow-sm' : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                }`}>
                  <input type="checkbox" checked={formData.categories.includes(cat)} onChange={() => handleCategoryToggle(cat)} className="hidden" />
                  <span className="text-sm font-medium">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-2 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Cake Type</label>
              <select name="cakeType" value={formData.cakeType} onChange={handleChange} className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-rose outline-none bg-white">
                <option value="Chocolate">Chocolate</option>
                <option value="Fruit">Fruit</option>
                <option value="Premium">Premium</option>
                <option value="Custom">Custom</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Occasion</label>
              <select name="occasion" value={formData.occasion} onChange={handleChange} className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-rose outline-none bg-white">
                <option value="Regular">Regular</option>
                <option value="Birthday">Birthday</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Wedding">Wedding</option>
              </select>
            </div>
          </div>

          <div className="pt-2 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Flavour Profile</label>
              <input type="text" name="flavour" value={formData.flavour} onChange={handleChange} placeholder="e.g. Rich Chocolate Truffle" className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-rose outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Dietary Preference</label>
              <label className="flex items-center gap-3 p-3 border border-stone-200 rounded-xl cursor-pointer bg-white">
                <input type="checkbox" name="isVegetarian" checked={formData.isVegetarian} onChange={handleChange} className="w-5 h-5 text-brand-veg rounded focus:ring-brand-veg border-stone-300" />
                <span className="font-medium text-stone-700">100% Vegetarian</span>
              </label>
            </div>
          </div>

          <div className="pt-2 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-rose outline-none bg-white">
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Inventory</label>
              <label className="flex items-center gap-3 p-3 border border-stone-200 rounded-xl cursor-pointer bg-white">
                <input type="checkbox" name="available" checked={formData.available} onChange={handleChange} className="w-5 h-5 text-brand-rose rounded focus:ring-brand-rose border-stone-300" />
                <span className="font-medium text-stone-700">In Stock</span>
              </label>
            </div>
          </div>
        </form>
      </div>

      <div className="p-6 border-t border-stone-200 bg-white">
        <button type="submit" form="cake-form" className="w-full bg-stone-800 hover:bg-black text-white py-3.5 rounded-xl font-bold shadow-lg transition-all active:scale-95">
          {existingCake ? 'Save Changes' : 'Publish Product'}
        </button>
      </div>
    </div>
  );
};

export default AddEditCakeForm;
