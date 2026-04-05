import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import DashboardOverview from './views/DashboardOverview';
import ManageLands from './views/ManageLands';
import ManagePartnerships from './views/ManagePartnerships';
import ManageUsers from './views/ManageUsers';
import ManageCrops from './views/ManageCrops';
import ManageTools from './views/ManageTools';
import ManageMarketplace from './views/ManageMarketplace';
import ManageBookings from './views/ManageBookings';

function AdminPanel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isAdmin, setIsAdmin] = useState(false);

  // Global Admin State
  const [stats, setStats] = useState({ totalUsers: 0, totalCrops: 0, pendingCrops: 0, marketItems: 0 });
  const [users, setUsers] = useState([]);
  const [crops, setCrops] = useState([]);
  const [lands, setLands] = useState([]);
  const [tools, setTools] = useState([]);
  const [marketplaceItems, setMarketplaceItems] = useState([]);
  const [partnerships, setPartnerships] = useState([]);

  useEffect(() => {
    const userInfoMap = localStorage.getItem('userInfo');
    if(!userInfoMap) { navigate('/login'); return; }
    
    const parsedUser = JSON.parse(userInfoMap);
    if(parsedUser.role !== 'admin' && parsedUser.role !== 'superadmin') { navigate('/'); return; }
    
    setIsAdmin(true);
    fetchData(parsedUser.token);
  }, [navigate]);

  const fetchData = async (token) => {
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [newStats, newUsers, newCrops, newLands, newTools, newMarket, newPartnerships] = await Promise.all([
        fetch('/api/admin/stats', { headers }).then(r => r.json()),
        fetch('/api/admin/users', { headers }).then(r => r.json()),
        fetch('/api/admin/crops', { headers }).then(r => r.json()),
        fetch('/api/admin/lands', { headers }).then(r => r.json()),
        fetch('/api/admin/tools', { headers }).then(r => r.json()),
        fetch('/api/admin/marketplace', { headers }).then(r => r.json()),
        fetch('/api/partnerships', { headers }).then(r => r.json())
      ]);
      setStats(newStats); setUsers(newUsers); setCrops(newCrops); setLands(newLands || []);
      setTools(newTools || []); setMarketplaceItems(newMarket || []); 
      setPartnerships(Array.isArray(newPartnerships) ? newPartnerships : []);
    } catch(err) { console.error('Failed to fetch admin data', err); }
  };

  const updateStatus = async (type, id, status, extraData = {}) => {
    const token = JSON.parse(localStorage.getItem('userInfo')).token;
    await fetch(`/api/admin/${type}/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status, ...extraData })
    });
    fetchData(token); 
  };

  if(!isAdmin) return null;

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans selection:bg-[#006400] selection:text-white">
      {/* Sidebar Component */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
         {/* Top Header */}
         <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 px-8 py-5 flex items-center justify-between">
            <h2 className="text-xl font-black text-gray-800 capitalize flex items-center gap-2">
              <span className="w-2 h-8 bg-[#006400] rounded-full inline-block"></span>
              {activeTab.replace('-', ' ')}
            </h2>
            <div className="flex items-center gap-4">
               {/* Quick Info / Avatar Placeholder */}
               <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-gray-800">Super Admin</p>
                  <p className="text-[10px] uppercase font-black tracking-wider text-green-600">System Online</p>
               </div>
               <div className="w-10 h-10 rounded-full bg-green-100 border-2 border-white shadow-md flex items-center justify-center font-black text-[#006400]">
                 SA
               </div>
            </div>
         </header>

         {/* Dynamic View Rendering */}
         <div className="p-8 max-w-7xl mx-auto w-full">
            {activeTab === 'overview' && <DashboardOverview stats={stats} />}
            {activeTab === 'lands' && <ManageLands lands={lands} updateStatus={updateStatus} />}
            {activeTab === 'partnerships' && <ManagePartnerships partnerships={partnerships} onRefresh={() => fetchData(JSON.parse(localStorage.getItem('userInfo')).token)} />}
            {activeTab === 'users' && <ManageUsers users={users} updateStatus={updateStatus} />}
            {activeTab === 'crops' && <ManageCrops crops={crops} updateStatus={updateStatus} />}
            {activeTab === 'tools' && <ManageTools tools={tools} updateStatus={updateStatus} />}
            {activeTab === 'marketplace' && <ManageMarketplace items={marketplaceItems} updateStatus={updateStatus} />}
            {activeTab === 'bookings' && <ManageBookings />}
         </div>
      </main>
    </div>
  );
}

export default AdminPanel;
