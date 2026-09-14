import React, { useState, useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const StoreSettings = () => {
  const { settings, updateSettings, loading } = useSettings();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  if (loading || !formData) return <div className="py-8 text-center text-stone-500">Loading settings...</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCustomizationChange = (index, field, value) => {
    const newCustomizations = [...formData.customizations];
    newCustomizations[index][field] = field === 'price' ? Number(value) : value;
    setFormData(prev => ({ ...prev, customizations: newCustomizations }));
  };

  const addCustomization = () => {
    setFormData(prev => ({
      ...prev,
      customizations: [...prev.customizations, { name: '', price: 0 }]
    }));
  };

  const removeCustomization = (index) => {
    const newCustomizations = formData.customizations.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, customizations: newCustomizations }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateSettings(formData);
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-stone-800 font-serif">Store Settings</h2>
        <p className="text-stone-500 mt-1">Configure your branding, messaging, and add-on pricing.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-stone-200">
        
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-brand-brown border-b pb-2">General Info</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1">Store Name</label>
              <input type="text" name="storeName" value={formData.storeName} onChange={handleChange} className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-rose outline-none bg-stone-50" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1">WhatsApp Number (For Checkout)</label>
              <input type="text" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-rose outline-none bg-stone-50" required placeholder="e.g. 919876543210" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-brand-brown border-b pb-2">Storefront Hero</h3>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1">Hero Title</label>
              <p className="text-xs text-stone-500 mb-2">Use asterisks to highlight words in pink (e.g., `Home-baked with *love*`)</p>
              <input type="text" name="heroTitle" value={formData.heroTitle} onChange={handleChange} className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-rose outline-none bg-stone-50" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1">Hero Subtext</label>
              <textarea name="heroSubtext" value={formData.heroSubtext} onChange={handleChange} className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-rose outline-none bg-stone-50 h-24" required></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1">Pickup Message Badge</label>
              <input type="text" name="pickupMessage" value={formData.pickupMessage} onChange={handleChange} className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-rose outline-none bg-stone-50" required />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-brand-brown border-b pb-2">Features</h3>
          <div className="pt-2">
            <label className="flex items-center gap-3 p-4 border border-stone-200 rounded-xl cursor-pointer bg-stone-50 hover:bg-stone-100 transition-colors">
              <input type="checkbox" name="enableFilter" checked={!!formData.enableFilter} onChange={(e) => setFormData(p => ({ ...p, enableFilter: e.target.checked }))} className="w-5 h-5 text-brand-rose rounded focus:ring-brand-rose border-stone-300" />
              <div>
                <span className="font-bold text-stone-700 block">Enable Advanced Filters</span>
                <span className="text-xs text-stone-500">Show the Cake Type, Occasion, and Price filters on the storefront.</span>
              </div>
            </label>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-xl font-bold text-brand-brown">Dynamic Customizations</h3>
            <button type="button" onClick={addCustomization} className="text-sm font-bold text-brand-rose flex items-center gap-1 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors">
              <Plus className="w-4 h-4" /> Add Option
            </button>
          </div>
          
          <div className="space-y-4">
            {formData.customizations.map((cust, index) => (
              <div key={index} className="flex items-center gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-stone-500 mb-1 uppercase tracking-wider">Option Name</label>
                  <input type="text" value={cust.name} onChange={(e) => handleCustomizationChange(index, 'name', e.target.value)} className="w-full p-2.5 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-rose outline-none" required placeholder="e.g. Fondant" />
                </div>
                <div className="w-32">
                  <label className="block text-xs font-semibold text-stone-500 mb-1 uppercase tracking-wider">Price (₹)</label>
                  <input type="number" value={cust.price} onChange={(e) => handleCustomizationChange(index, 'price', e.target.value)} className="w-full p-2.5 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-rose outline-none" required />
                </div>
                <button type="button" onClick={() => removeCustomization(index)} className="mt-5 p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            {formData.customizations.length === 0 && (
              <p className="text-stone-500 italic">No custom add-ons configured.</p>
            )}
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button type="submit" className="bg-stone-800 hover:bg-black text-white px-8 py-3.5 rounded-xl font-bold shadow-lg transition-all active:scale-95">
            Save Settings
          </button>
        </div>

      </form>
    </div>
  );
};

export default StoreSettings;
