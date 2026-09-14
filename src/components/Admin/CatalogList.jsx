import React, { useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { useCakes } from '../../context/CakeContext';
import { useToast } from '../../context/ToastContext';

const CatalogList = ({ onEdit }) => {
  const { cakes, loading, deleteCake } = useCakes();
  const { addToast } = useToast();

  const handleDelete = (id) => {
    if(window.confirm('Are you sure you want to delete this product?')) {
      deleteCake(id);
      addToast('Product deleted successfully');
    }
  };

  if (loading) return <div className="py-8 text-center text-stone-500">Loading catalog...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50/50 border-b border-stone-200 text-stone-500 text-sm uppercase tracking-wider">
              <th className="p-4 font-semibold">Product</th>
              <th className="p-4 font-semibold">Pricing</th>
              <th className="p-4 font-semibold">Categories</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {cakes.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-12 text-center text-stone-500">
                  No products found. Add your first cake!
                </td>
              </tr>
            ) : (
              cakes.map(cake => (
                <tr key={cake.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <img src={cake.imageUrl} alt={cake.name} className="w-12 h-12 rounded-lg object-cover border border-stone-200 shadow-sm" />
                      <span className="font-semibold text-stone-800">{cake.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-stone-800">₹{cake.basePrice}</div>
                    {cake.originalPrice && cake.originalPrice > cake.basePrice && (
                      <div className="text-xs text-stone-400 line-through">₹{cake.originalPrice}</div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1.5">
                      {cake.categories?.map((cat, i) => (
                        <span key={i} className="bg-stone-100 text-stone-600 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                      cake.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-600'
                    }`}>
                      {cake.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-1">
                    <button onClick={() => onEdit(cake)} className="p-2 text-stone-400 hover:text-brand-rose hover:bg-rose-50 rounded-lg transition-colors" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(cake.id)} className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CatalogList;
