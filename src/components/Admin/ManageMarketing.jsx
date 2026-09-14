import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { db } from '../../firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { compressImageToBase64 } from '../../utils/imageUtils';
import { useToast } from '../../context/ToastContext';

const ManageMarketing = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageFile: null,
    imagePreview: ''
  });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'marketing_showcase'), (snapshot) => {
      const fetchedItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort by creation time manually or order by createdAt
      fetchedItems.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return b.createdAt.toMillis() - a.createdAt.toMillis();
      });
      setItems(fetchedItems);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const openForm = () => {
    setFormData({ title: '', description: '', imageFile: null, imagePreview: '' });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setFormData({ title: '', description: '', imageFile: null, imagePreview: '' });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ 
        ...prev, 
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.imageFile) {
      addToast('Please provide a title and image', 'error');
      return;
    }

    setIsUploading(true);
    try {
      // Compress the image to Base64 using a Promise and Canvas
      const base64Image = await compressImageToBase64(formData.imageFile, 800, 0.6);

      // Save directly to Firestore
      await addDoc(collection(db, 'marketing_showcase'), {
        title: formData.title,
        description: formData.description,
        imageUrl: base64Image,
        createdAt: serverTimestamp()
      });

      // Clear the form and close modal upon success
      setFormData({ title: '', description: '', imageFile: null, imagePreview: '' });
      addToast('Marketing item added successfully!', 'success');
      closeForm();
    } catch (error) {
      console.error("Upload error:", error);
      addToast('Failed to upload item', 'error');
    } finally {
      // Always reset loading state to prevent the button from freezing
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteDoc(doc(db, 'marketing_showcase', id));
        addToast('Item deleted successfully');
      } catch (error) {
        addToast('Failed to delete item', 'error');
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-stone-800 font-serif">Marketing Showcase</h2>
          <p className="text-stone-500 mt-1">Manage the infinite scrolling marquee on the storefront.</p>
        </div>
        {!isFormOpen && (
          <button 
            onClick={openForm}
            className="bg-brand-rose hover:bg-brand-rose-hover text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-5 h-5" /> Add Item
          </button>
        )}
      </div>

      {isFormOpen ? (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 max-w-2xl animate-fade-in">
          <h3 className="text-xl font-bold font-serif text-stone-800 mb-6">Add Showcase Item</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1">Title</label>
              <input required type="text" value={formData.title} onChange={e => setFormData(p => ({...p, title: e.target.value}))} className="w-full p-3 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-rose" placeholder="e.g. Dreamy White Wedding" />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1">Description (Optional)</label>
              <textarea value={formData.description} onChange={e => setFormData(p => ({...p, description: e.target.value}))} className="w-full p-3 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-rose resize-none h-24" placeholder="Brief description of the cake..." />
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1">Image</label>
              <div className="flex items-center gap-4">
                {formData.imagePreview ? (
                  <div className="w-24 h-24 rounded-xl overflow-hidden border border-stone-200 shrink-0">
                    <img src={formData.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-xl border-2 border-dashed border-stone-300 flex items-center justify-center bg-stone-50 shrink-0 text-stone-400">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
                <input 
                  required 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-stone-50 file:text-stone-700 hover:file:bg-stone-100 cursor-pointer"
                />
              </div>
            </div>
            
            <div className="flex gap-3 pt-4 border-t border-stone-100">
              <button type="button" onClick={closeForm} className="flex-1 px-4 py-3 rounded-xl font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={isUploading} className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-brand-brown hover:bg-[#2D1B19] transition-colors flex justify-center items-center gap-2 disabled:opacity-70">
                {isUploading ? <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</> : 'Save Item'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-stone-500 flex flex-col items-center">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              Loading...
            </div>
          ) : items.length === 0 ? (
            <div className="p-12 text-center text-stone-500">
              No marketing items found. Click "Add Item" to create one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200">
                    <th className="p-4 font-semibold text-stone-600 text-sm">Image</th>
                    <th className="p-4 font-semibold text-stone-600 text-sm">Title</th>
                    <th className="p-4 font-semibold text-stone-600 text-sm hidden md:table-cell">Description</th>
                    <th className="p-4 font-semibold text-stone-600 text-sm text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-stone-100 hover:bg-stone-50/50 transition-colors">
                      <td className="p-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="p-4 font-bold text-stone-800">{item.title}</td>
                      <td className="p-4 text-stone-500 text-sm hidden md:table-cell max-w-xs truncate">{item.description || '-'}</td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageMarketing;
