import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { useBuilder } from '../../context/BuilderContext';
import { useToast } from '../../context/ToastContext';
import { compressImageToBase64 } from '../../utils/imageUtils';

const CATEGORIES = ['base', 'weight', 'flavour', 'frosting', 'topping'];

const ManageBuilder = () => {
  const { options, loading, addOption, editOption, deleteOption } = useBuilder();
  const { addToast } = useToast();
  
  const [activeCat, setActiveCat] = useState('base');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    image: '',
    inStock: true
  });

  const filteredOptions = options.filter(o => o.category === activeCat);

  const openForm = (opt = null) => {
    if (opt) {
      setEditingId(opt.id);
      setFormData({
        name: opt.name || '',
        description: opt.description || '',
        price: opt.price || 0,
        image: opt.image || '',
        inStock: opt.inStock ?? true
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        image: '',
        inStock: true
      });
    }
    setIsFormOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const base64String = await compressImageToBase64(file);
      setFormData(prev => ({ ...prev, image: base64String }));
      addToast('Image compressed and encoded successfully', 'default');
    } catch (error) {
      console.error(error);
      addToast('Image processing failed', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      price: Number(formData.price),
      category: activeCat
    };

    try {
      if (editingId) {
        await editOption(editingId, dataToSubmit);
        addToast('Option updated successfully');
      } else {
        await addOption(dataToSubmit);
        addToast('Option added successfully');
      }
      setIsFormOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this option?")) {
      await deleteOption(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-stone-800 font-serif">Builder Manager</h2>
          <p className="text-stone-500 mt-1">Manage dynamic options for the Custom Cake Builder.</p>
        </div>
        {!isFormOpen && (
          <button 
            onClick={() => openForm()}
            className="bg-brand-rose hover:bg-brand-rose-hover text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-5 h-5" /> Add {activeCat}
          </button>
        )}
      </div>

      <div className="flex border-b border-stone-200 mb-8 overflow-x-auto scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => { setActiveCat(cat); setIsFormOpen(false); }}
            className={`px-6 py-3 font-bold text-sm uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors ${
              activeCat === cat ? 'border-brand-brown text-brand-brown' : 'border-transparent text-stone-400 hover:text-stone-600'
            }`}
          >
            {cat}s
          </button>
        ))}
      </div>

      {isFormOpen ? (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 max-w-2xl animate-fade-in">
          <h3 className="text-xl font-bold font-serif text-stone-800 mb-6">
            {editingId ? `Edit ${activeCat}` : `Add New ${activeCat}`}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1">Name</label>
              <input required type="text" value={formData.name} onChange={e => setFormData(p => ({...p, name: e.target.value}))} className="w-full p-3 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-rose" placeholder="e.g. Vanilla" />
            </div>
            
            {activeCat === 'base' && (
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1">Description</label>
                <textarea required value={formData.description} onChange={e => setFormData(p => ({...p, description: e.target.value}))} className="w-full p-3 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-rose resize-none h-24" placeholder="Brief description of the base..." />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1">
                {activeCat === 'base' ? 'Base Price (₹)' : 'Extra Charge (₹)'}
              </label>
              <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData(p => ({...p, price: e.target.value}))} className="w-full p-3 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-rose" />
              {activeCat === 'weight' && <p className="text-xs text-stone-400 mt-1">For Weight enter multiplier (e.g., 1.5).</p>}
            </div>

            {activeCat === 'base' && (
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Image URL</label>
                <div className="flex items-center gap-4">
                  {formData.image ? (
                    <img src={formData.image} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-stone-200" />
                  ) : (
                    <div className="w-16 h-16 bg-stone-100 rounded-lg flex items-center justify-center text-stone-400">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                  <div className="flex-1">
                    <input type="text" value={formData.image} onChange={e => setFormData(p => ({...p, image: e.target.value}))} className="w-full p-3 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-rose" placeholder="https://example.com/image.jpg" />
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2">
              <label className="flex items-center gap-3 p-3 border border-stone-200 rounded-xl cursor-pointer bg-stone-50 hover:bg-stone-100 transition-colors">
                <input type="checkbox" checked={formData.inStock} onChange={e => setFormData(p => ({...p, inStock: e.target.checked}))} className="w-5 h-5 text-brand-rose rounded focus:ring-brand-rose border-stone-300" />
                <span className="font-bold text-stone-700">In Stock</span>
              </label>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button type="submit" disabled={isUploading} className="flex-1 bg-brand-brown hover:bg-stone-800 text-white py-3 rounded-xl font-bold shadow-md transition-colors disabled:opacity-50">
              Save {activeCat}
            </button>
            <button type="button" onClick={() => setIsFormOpen(false)} className="px-6 py-3 border border-stone-200 text-stone-600 rounded-xl font-bold hover:bg-stone-50 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-stone-500">Loading...</div>
          ) : filteredOptions.length === 0 ? (
            <div className="p-12 text-center text-stone-500">
              No options found for {activeCat}. Click "Add {activeCat}" to create one.
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-stone-50 border-b border-stone-100 text-xs uppercase tracking-wider text-stone-500 font-bold">
                <tr>
                  {activeCat === 'base' && <th className="p-4">Image</th>}
                  <th className="p-4">Name</th>
                  {activeCat === 'base' && <th className="p-4">Description</th>}
                  <th className="p-4">{activeCat === 'base' ? 'Base Price (₹)' : 'Extra Charge (+₹)'}</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredOptions.map(opt => (
                  <tr key={opt.id} className="hover:bg-stone-50 transition-colors">
                    {activeCat === 'base' && (
                      <td className="p-4">
                        {opt.image ? (
                          <img src={opt.image} alt={opt.name} className="w-10 h-10 object-cover rounded shadow-sm" />
                        ) : (
                          <div className="w-10 h-10 bg-stone-100 rounded flex items-center justify-center text-stone-300"><ImageIcon className="w-4 h-4"/></div>
                        )}
                      </td>
                    )}
                    <td className="p-4 font-bold text-stone-800">{opt.name}</td>
                    {activeCat === 'base' && (
                      <td className="p-4 text-stone-600 font-medium max-w-xs truncate">{opt.description || '-'}</td>
                    )}
                    <td className="p-4 text-stone-600 font-medium">
                      {activeCat === 'weight' ? `x${opt.price}` : `₹${opt.price}`}
                    </td>
                    <td className="p-4">
                      {opt.inStock ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
                          <Check className="w-3 h-3" /> In Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-stone-100 text-stone-500">
                          Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => openForm(opt)} className="p-2 text-stone-400 hover:text-brand-brown hover:bg-stone-100 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(opt.id)} className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageBuilder;
