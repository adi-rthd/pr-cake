import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Plus, Trash2, Menu } from 'lucide-react';
import AddEditCakeForm from '../../components/Admin/AddEditCakeForm';
import CatalogList from '../../components/Admin/CatalogList';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import StoreSettings from '../../components/Admin/StoreSettings';
import ManageReviews from '../../components/Admin/ManageReviews';
import ManageBuilder from '../../components/Admin/ManageBuilder';
import ManageMarketing from '../../components/Admin/ManageMarketing';


const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('catalog');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCake, setEditingCake] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleEdit = (cake) => {
    setEditingCake(cake);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingCake(null);
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col md:flex-row bg-stone-50">
      
      {/* Mobile Top Navigation */}
      <div className="md:hidden bg-stone-900 text-white p-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <button onClick={() => setIsMobileSidebarOpen(true)} className="p-1 hover:bg-stone-800 rounded">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold font-serif italic">PR Cake</h1>
        <div className="w-6"></div> {/* Spacer to center title */}
      </div>

      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isMobileSidebarOpen}
        setIsOpen={setIsMobileSidebarOpen}
      />
      
      <main className="w-full flex-1 h-full overflow-y-auto p-4 md:p-8">
        {activeTab === 'catalog' && (
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-stone-800 font-serif">Catalog Management</h2>
                <p className="text-stone-500 mt-1">Manage your cakes, pricing, and availability.</p>
              </div>
              <button 
                onClick={() => setIsFormOpen(true)}
                className="bg-brand-rose hover:bg-brand-rose-hover text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-sm transition-all"
              >
                <Plus className="w-5 h-5" /> Add Product
              </button>
            </div>

            <CatalogList onEdit={handleEdit} />
          </div>
        )}

        {activeTab === 'orders' && (
          <AdminOrdersTab />
        )}

        {activeTab === 'reviews' && (
          <ManageReviews />
        )}

        {activeTab === 'builder' && (
          <ManageBuilder />
        )}

        {activeTab === 'marketing' && (
          <ManageMarketing />
        )}

        {activeTab === 'settings' && (
          <StoreSettings />
        )}
      </main>

      {/* Slide-out Form Panel */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-stone-900/20 backdrop-blur-sm" onClick={closeForm}></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl animate-slide-in-right overflow-y-auto">
            <AddEditCakeForm existingCake={editingCake} onComplete={closeForm} />
          </div>
        </div>
      )}
    </div>
  );
};

// Simple internal component for the Orders Tab
import { collection, onSnapshot, query, orderBy, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';

const AdminOrdersTab = () => {
  const [customOrders, setCustomOrders] = React.useState([]);
  const [standardOrders, setStandardOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Fetch all orders from Firestore
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        shortId: '#' + doc.id.slice(-6).toUpperCase(),
        ...doc.data()
      }));
      
      setStandardOrders(data.filter(order => order.orderType === 'standard' || !order.orderType));
      setCustomOrders(data.filter(order => order.orderType === 'custom'));
      setLoading(false);
    });

    return unsub;
  }, []);

  const updateOrderStatus = async (docId, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', docId), { status: newStatus });
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const deleteOrder = async (docId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteDoc(doc(db, 'orders', docId));
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Ready for Pickup': return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'Pending WhatsApp':
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  if (loading) return <div className="py-20 text-center text-stone-500">Loading Orders...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-12">
      
      {/* Standard Orders Table */}
      <div>
        <h2 className="text-3xl font-bold text-stone-800 font-serif mb-6">Standard Orders</h2>
        {standardOrders.length === 0 ? (
          <div className="p-10 text-center bg-white rounded-2xl border border-stone-100 text-stone-500">No standard orders found.</div>
        ) : (
          <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-x-auto overflow-y-hidden whitespace-nowrap">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-sm text-stone-500">
                  <th className="p-4 font-bold">Order ID</th>
                  <th className="p-4 font-bold">Date</th>
                  <th className="p-4 font-bold">Customer</th>
                  <th className="p-4 font-bold">Items</th>
                  <th className="p-4 font-bold">Subtotal</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {standardOrders.map(order => (
                  <tr key={order.id} className="hover:bg-stone-50">
                    <td className="p-4 font-mono font-bold text-brand-brown">{order.orderId || order.shortId}</td>
                    <td className="p-4 text-sm text-stone-600">
                      {order.createdAt?.toDate ? new Date(order.createdAt.toDate()).toLocaleString() : new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="p-4 text-sm">
                      <p className="font-bold text-stone-800">{order.customer.name}</p>
                      <p className="text-stone-500">{order.customer.phone}</p>
                      <p className="text-stone-500 text-xs mt-1">Pickup: {order.customer.date} @ {order.customer.time}</p>
                    </td>
                    <td className="p-4 text-sm text-stone-600">
                      <ul className="list-disc pl-4 space-y-1">
                        {order.items.map((item, i) => (
                          <li key={i}>{item.quantity}x {item.name}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-4 font-bold text-stone-800">₹{order.subtotal}</td>
                    <td className="p-4">
                      <select 
                        value={order.status || 'Pending WhatsApp'}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border outline-none cursor-pointer appearance-none ${getStatusColor(order.status)}`}
                      >
                        <option value="Pending WhatsApp" className="bg-white text-stone-800">Pending WhatsApp</option>
                        <option value="Confirmed" className="bg-white text-stone-800">Confirmed</option>
                        <option value="Ready for Pickup" className="bg-white text-stone-800">Ready for Pickup</option>
                        <option value="Cancelled" className="bg-white text-stone-800">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => deleteOrder(order.id)}
                        className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Order"
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

      {/* Custom Orders Grid */}
      <div>
        <h2 className="text-3xl font-bold text-stone-800 font-serif mb-6">Custom Cake Quotes</h2>
        {customOrders.length === 0 ? (
          <div className="p-10 text-center bg-white rounded-2xl border border-stone-100 text-stone-500">No custom orders found.</div>
        ) : (
          <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-x-auto overflow-y-hidden whitespace-nowrap">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-sm text-stone-500">
                  <th className="p-4 font-bold">Order ID</th>
                  <th className="p-4 font-bold">Date</th>
                  <th className="p-4 font-bold">Customer</th>
                  <th className="p-4 font-bold">Items</th>
                  <th className="p-4 font-bold">Subtotal</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {customOrders.map(order => (
                  <tr key={order.id} className="hover:bg-stone-50">
                    <td className="p-4 font-mono font-bold text-brand-brown">{order.orderId || order.shortId}</td>
                    <td className="p-4 text-sm text-stone-600">
                      {order.createdAt?.toDate ? new Date(order.createdAt.toDate()).toLocaleString() : new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="p-4 text-sm">
                      <p className="font-bold text-stone-800">{order.customer?.name}</p>
                      <p className="text-stone-500">{order.customer?.phone}</p>
                      <p className="text-stone-500 text-xs mt-1">Pickup: {order.customer?.date} @ {order.customer?.time}</p>
                    </td>
                    <td className="p-4 text-sm text-stone-600">
                      <ul className="space-y-4">
                        {order.items?.map((item, i) => (
                          <li key={i}>
                            <p className="font-bold text-stone-800">{item.quantity}x {item.name}</p>
                            <ul className="text-xs text-stone-500 mt-1 space-y-1 list-none">
                              {item.customizations?.weight && <li>• Weight: {item.customizations.weight}</li>}
                              {item.customizations?.flavour && item.customizations.flavour !== 'None' && <li>• Flavour: {item.customizations.flavour}</li>}
                              {item.customizations?.frosting && item.customizations.frosting !== 'None' && <li>• Frosting: {item.customizations.frosting}</li>}
                              {item.customizations?.addons && item.customizations.addons.length > 0 && <li>• Toppings: {item.customizations.addons.map(a => a.name).join(', ')}</li>}
                              {item.customizations?.customMessage && <li>• Message: "{item.customizations.customMessage}"</li>}
                            </ul>
                            {item.customizations?.customImageUrl && (
                              <img src={item.customizations.customImageUrl} alt="Reference" className="mt-2 w-20 h-20 object-cover rounded-lg border border-stone-200" />
                            )}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-4 font-bold text-stone-800">₹{order.subtotal || order.total}</td>
                    <td className="p-4">
                      <select 
                        value={order.status || 'Pending WhatsApp'}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border outline-none cursor-pointer appearance-none ${getStatusColor(order.status)}`}
                      >
                        <option value="Pending WhatsApp" className="bg-white text-stone-800">Pending WhatsApp</option>
                        <option value="Confirmed" className="bg-white text-stone-800">Confirmed</option>
                        <option value="Ready for Pickup" className="bg-white text-stone-800">Ready for Pickup</option>
                        <option value="Cancelled" className="bg-white text-stone-800">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => deleteOrder(order.id)}
                        className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Order"
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

    </div>
  );
};

export default AdminDashboard;
