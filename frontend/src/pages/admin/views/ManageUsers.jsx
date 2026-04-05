import React, { useState, useMemo } from 'react';
import { UserDetailModal } from '../components/AdminComponents';
import { Search, Users as UsersIcon, ShieldCheck, UserX, UserMinus, FileText } from 'lucide-react';

function ManageUsers({ users, lands, partnerships, marketplaceItems, updateStatus }) {
  const [inspectingUser, setInspectingUser] = useState(null);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all'); // all, farmer, buyer

  const stats = useMemo(() => {
    let farmers = 0, buyers = 0, verified = 0, suspended = 0;
    users.forEach(u => {
      if (u.role === 'farmer') farmers++;
      if (u.role === 'buyer') buyers++;
      if (u.trust_badge === 'verified') verified++;
      if (u.status === 'suspended' || u.trust_badge === 'suspended') suspended++;
    });
    return { total: users.length, farmers, buyers, verified, suspended };
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchSearch = (u.name || '').toLowerCase().includes(search.toLowerCase()) || 
                          (u.mobile || '').includes(search.toLowerCase());
      if (!matchSearch) return false;
      if (filterRole !== 'all' && u.role !== filterRole) return false;
      // hide superadmins from normal user list mostly
      if (u.role === 'superadmin') return false; 
      return true;
    });
  }, [users, search, filterRole]);

  return (
    <div className="space-y-6">
      
      {/* Overview Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 animate-[fadeIn_0.3s_ease-out]">
         <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Network</p>
            <p className="text-3xl font-black text-gray-800">{stats.total}</p>
         </div>
         <div className="bg-blue-50/50 p-5 rounded-[2rem] border border-blue-100 shadow-sm flex flex-col justify-center items-center text-center">
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Farmers</p>
            <p className="text-3xl font-black text-blue-700">{stats.farmers}</p>
         </div>
         <div className="bg-orange-50/50 p-5 rounded-[2rem] border border-orange-100 shadow-sm flex flex-col justify-center items-center text-center">
            <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Buyers</p>
            <p className="text-3xl font-black text-orange-700">{stats.buyers}</p>
         </div>
         <div className="bg-green-50/50 p-5 rounded-[2rem] border border-green-100 shadow-sm flex flex-col justify-center items-center text-center">
            <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1">Verified Users</p>
            <p className="text-3xl font-black text-green-700">{stats.verified}</p>
         </div>
         <div className="bg-red-50/50 p-5 rounded-[2rem] border border-red-100 shadow-sm flex flex-col justify-center items-center text-center">
            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">Suspended</p>
            <p className="text-3xl font-black text-red-700">{stats.suspended}</p>
         </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden animate-[fadeIn_0.5s_ease-out]">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50">
          
          <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
             {['all', 'farmer', 'buyer'].map(tab => (
               <button 
                 key={tab} onClick={() => setFilterRole(tab)}
                 className={`px-6 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${filterRole === tab ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
               >{tab}</button>
             ))}
          </div>

          <div className="relative w-full md:w-72">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
             <input type="text" placeholder="Search by name or mobile..." value={search} onChange={e=>setSearch(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400 font-medium shadow-sm transition-all" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#f8fafc] text-gray-500 font-black uppercase text-[10px] tracking-widest border-b border-gray-100">
              <tr>
                <th className="p-5">User Profile</th>
                <th className="p-5">Role/Type</th>
                <th className="p-5">Trust Badge</th>
                <th className="p-5">Account Status</th>
                <th className="p-5 text-right">CRM Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map(u => (
                <tr key={u._id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="p-5">
                     <p className="font-black text-gray-800 text-base">{u.name}</p>
                     <p className="text-xs text-gray-500 font-medium mt-1">{u.mobile} &bull; {u.email}</p>
                  </td>
                  <td className="p-5">
                     <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.role === 'farmer' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                       {u.role}
                     </span>
                  </td>
                  <td className="p-5">
                     {u.trust_badge === 'verified' ? (
                       <span className="flex items-center gap-1 w-max px-3 py-1 bg-green-50 border border-green-200 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm">
                         <ShieldCheck size={14}/> Verified
                       </span>
                     ) : (u.trust_badge === 'suspended' ? (
                       <span className="flex items-center gap-1 w-max px-3 py-1 bg-red-50 border border-red-200 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                         <UserMinus size={14}/> Bad Standing
                       </span>
                     ) : (
                       <span className="flex items-center gap-1 w-max px-3 py-1 bg-gray-100 border border-gray-200 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-lg">
                         Unverified
                       </span>
                     ))}
                  </td>
                  <td className="p-5">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${u.status === 'suspended' ? 'text-red-500' : (u.status === 'blocked' ? 'text-gray-500' : 'text-green-600')}`}>
                      {u.status === 'approved' ? 'Active' : u.status}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <button onClick={() => setInspectingUser(u)} className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-800 font-bold text-xs px-4 py-2 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-95">
                      <FileText size={14} className="text-indigo-500" /> View Comprehensive Profile
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && <tr><td colSpan="5" className="p-12 text-center text-gray-400 font-bold italic text-lg">No matching users located in the directory.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <UserDetailModal 
         isOpen={!!inspectingUser} 
         onClose={() => setInspectingUser(null)} 
         user={inspectingUser} 
         lands={lands}
         partnerships={partnerships}
         marketplaceItems={marketplaceItems}
         onSubmit={(type, id, status, extra) => {
            updateStatus(type, id, status, extra);
            setInspectingUser(null);
         }} 
      />
    </div>
  );
}

export default ManageUsers;
