import React from 'react';
import { Cake, ShoppingCart, Settings, LogOut, Star, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const { logout } = useAuth();

  const navItems = [
    { id: 'catalog', label: 'Catalog', icon: Cake },
    { id: 'builder', label: 'Cake Builder', icon: Star },
    { id: 'marketing', label: 'Marketing Showcase', icon: ImageIcon },
    { id: 'orders', label: 'Orders (Mock)', icon: ShoppingCart },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`w-64 flex-shrink-0 h-full overflow-y-auto bg-stone-900 text-stone-300 flex flex-col fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:translate-x-0 md:static ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-stone-800">
          <h1 className="text-2xl font-bold text-white font-serif italic">PR Cake</h1>
          <p className="text-xs text-stone-500 uppercase tracking-widest mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === item.id 
                ? 'bg-brand-rose text-white shadow-md' 
                : 'hover:bg-stone-800 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-stone-800">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
    </>
  );
};

export default AdminSidebar;
