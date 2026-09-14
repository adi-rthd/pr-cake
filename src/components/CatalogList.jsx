import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { useCakes } from '../context/CakeContext';

const CatalogList = ({ onEdit }) => {
  const { cakes, loading, deleteCake } = useCakes();

  if (loading) return <div className="py-8 text-center text-gray-500">Loading catalog...</div>;

  return (
    <div className="bg-white rounded-xl border border-brand-pink-light overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-brand-cream border-b border-brand-pink-light text-brand-brown">
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Categories</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cakes.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">No cakes found. Add one to get started.</td>
              </tr>
            ) : (
              cakes.map(cake => (
                <tr key={cake.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3">
                    <img src={cake.imageUrl} alt={cake.name} className="w-12 h-12 rounded object-cover" />
                  </td>
                  <td className="p-3 font-medium text-gray-800">{cake.name}</td>
                  <td className="p-3">
                    <div>₹{cake.basePrice}</div>
                    {cake.originalPrice && cake.originalPrice > cake.basePrice && (
                      <div className="text-xs text-gray-400 line-through">₹{cake.originalPrice}</div>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {cake.categories?.map((cat, i) => (
                        <span key={i} className="bg-brand-pink-light text-brand-brown text-xs px-2 py-0.5 rounded-full">{cat}</span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${cake.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {cake.available ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button onClick={() => onEdit(cake)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => { if(window.confirm('Delete this cake?')) deleteCake(cake.id); }} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete">
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
