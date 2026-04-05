import React from 'react';
import { LayoutDashboard, Map, Users, Wheat, Hammer, Store, Target, LogOut, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
  { id: 'lands', label: 'Land Deals', icon: <Map size={20} /> },
  { id: 'partnerships', label: 'Partnership Ops', icon: <Target size={20} /> },
  { id: 'users', label: 'Users & Farmers', icon: <Users size={20} /> },
  { id: 'crops', label: 'Crop Database', icon: <Wheat size={20} /> },
  { id: 'tools', label: 'Tool Rentals', icon: <Hammer size={20} /> },
  { id: 'marketplace', label: 'Marketplace', icon: <Store size={20} /> },
];

function AdminSidebar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();

  return (
    <aside className="w-72 bg-[#004d00] text-green-50 flex flex-col min-h-screen sticky top-0 shadow-2xl relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute inset-0 bg-[url('/images/background.png')] bg-cover mix-blend-overlay opacity-10 pointer-events-none"></div>
      
      {/* Brand Header */}
      <div className="p-8 pb-4 relative z-10">
        <div className="flex items-center gap-3 mb-8">
           <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm border border-white/30">
              <Shield size={28} className="text-white" />
           </div>
           <div>
              <h1 className="font-black text-2xl tracking-wide text-white">Anndata</h1>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9800] bg-orange-950/50 px-2 py-0.5 rounded-md">Control Center</span>
           </div>
        </div>
        <p className="text-xs uppercase font-black text-green-300 tracking-widest mb-4">Modules</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 relative z-10 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-r from-green-500/90 to-green-600/90 text-white shadow-lg shadow-green-900/50 scale-[1.02] border border-green-400/30' 
                  : 'text-green-200 hover:bg-green-800/50 hover:text-white'
              }`}
            >
              <div className={isActive ? 'text-white' : 'text-green-400 opacity-80'}>{item.icon}</div>
              <span className="text-[15px]">{item.label}</span>
              {isActive && <div className="ml-auto w-2 h-2 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />}
            </button>
          );
        })}
      </nav>

      {/* Footer Controls */}
      <div className="p-6 relative z-10 mt-auto">
        <button
          onClick={() => {
            localStorage.removeItem('userInfo');
            navigate('/login');
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-red-100 bg-red-900/50 border border-red-800 hover:bg-red-600 hover:text-white transition-all group shadow-lg"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          Log Out Securely
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
