import React, { useState, useMemo } from 'react';
import { LandReviewModal, LeaseDealModal } from '../components/AdminComponents';
import { ShieldCheck, Search, Filter, Layers, CheckCircle2, Clock, MapPin, Handshake, MessageSquare } from 'lucide-react';

function ManageLands({ lands, updateStatus }) {
  const [reviewingLand, setReviewingLand] = useState(null);
  const [leaseDealLand, setLeaseDealLand] = useState(null);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const stats = useMemo(() => {
    let pending = 0, active = 0, discussion = 0;
    lands.forEach(l => {
      if (l.status === 'pending') pending++;
      else if (['rented_to_company', 'partnership_active', 'active', 'sold'].includes(l.status)) active++;
      else if (l.status === 'under_discussion') discussion++;
    });
    return { total: lands.length, pending, active, discussion };
  }, [lands]);

  const filteredLands = useMemo(() => {
    return lands.filter(l => {
      const matchSearch = (l.farmer_id?.name || '').toLowerCase().includes(search.toLowerCase()) || 
                          (l.location || '').toLowerCase().includes(search.toLowerCase());
      if (!matchSearch) return false;
      const purposeMatch = l.purpose || 'sale';
      if (activeFilter === 'All') return true;
      if (activeFilter === 'Rent') return purposeMatch === 'lease';
      if (activeFilter === 'Sell') return purposeMatch === 'sale';
      if (activeFilter === 'Partnership') return purposeMatch === 'partnership';
      if (activeFilter === 'Pending') return l.status === 'pending';
      return true;
    });
  }, [lands, search, activeFilter]);

  return (
    <div className="space-y-6">
      {/* Admin Dashboard Overview Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-[fadeIn_0.3s_ease-out]">
         <div className="bg-white p-6 rounded-[2xl] border border-gray-100 shadow-sm flex items-center justify-between">
            <div><p className="text-sm font-bold text-gray-400 mb-1">Total Requests</p><p className="text-3xl font-black text-gray-800">{stats.total}</p></div>
            <div className="bg-gray-100 p-3 rounded-2xl text-gray-600"><Layers size={24}/></div>
         </div>
         <div className="bg-white p-6 rounded-[2xl] border border-gray-100 shadow-sm flex items-center justify-between">
            <div><p className="text-sm font-bold text-orange-400 mb-1">Pending Approval</p><p className="text-3xl font-black text-orange-600">{stats.pending}</p></div>
            <div className="bg-orange-50 p-3 rounded-2xl text-orange-500"><Clock size={24}/></div>
         </div>
         <div className="bg-white p-6 rounded-[2xl] border border-gray-100 shadow-sm flex items-center justify-between">
            <div><p className="text-sm font-bold text-blue-400 mb-1">Under Discussion</p><p className="text-3xl font-black text-blue-600">{stats.discussion}</p></div>
            <div className="bg-blue-50 p-3 rounded-2xl text-blue-500"><MessageSquare size={24}/></div>
         </div>
         <div className="bg-white p-6 rounded-[2xl] border border-gray-100 shadow-sm flex items-center justify-between">
            <div><p className="text-sm font-bold text-green-400 mb-1">Active Deals</p><p className="text-3xl font-black text-green-600">{stats.active}</p></div>
            <div className="bg-green-50 p-3 rounded-2xl text-green-500"><Handshake size={24}/></div>
         </div>
      </div>

      {/* Main Table View */}
      <div className="bg-white rounded-[2xl] shadow-sm border border-gray-100 overflow-hidden animate-[fadeIn_0.5s_ease-out]">
        
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Filters */}
            <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
               {['All', 'Rent', 'Sell', 'Partnership', 'Pending'].map(tab => (
                 <button 
                   key={tab} onClick={() => setActiveFilter(tab)}
                   className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${activeFilter === tab ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                 >{tab}</button>
               ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
               <input type="text" placeholder="Search farmer or location..." value={search} onChange={e=>setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400 font-medium" />
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
              <tr>
                <th className="p-4">Purpose</th>
                <th className="p-4">Farmer</th>
                <th className="p-4">Location</th>
                <th className="p-4">Area</th>
                <th className="p-4">Trust</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Moderator Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLands.map(land => (
                <tr key={land._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                     <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${land.purpose === 'lease' ? 'bg-indigo-100 text-indigo-700' : (land.purpose === 'partnership' ? 'bg-orange-100 text-orange-700' : 'bg-gray-200 text-gray-700')}`}>
                       {land.purpose || 'Sale'}
                     </span>
                  </td>
                  <td className="p-4 font-bold text-gray-800">{land.farmer_id?.name}</td>
                  <td className="p-4 font-medium text-gray-600 truncate max-w-[150px]"><span className="flex items-center gap-1"><MapPin size={12}/>{land.location}</span></td>
                  <td className="p-4 font-bold text-gray-800">{land.area_value || land.area_in_acres} <span className="text-gray-400 text-xs">{land.area_unit || 'Acres'}</span></td>
                  <td className="p-4">
                    {land.trust_badge === 'verified' ? (
                       <span className="flex items-center gap-1 text-[10px] uppercase font-black text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded w-max shadow-sm"><ShieldCheck size={12}/> Verified</span>
                    ) : (
                       <span className="flex items-center gap-1 text-[10px] uppercase font-black text-gray-500 bg-gray-100 border border-gray-200 px-2 py-1 rounded w-max">Pending</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${['pending','partnership_active', 'active'].includes(land.status) ? 'bg-orange-50 text-orange-600 border-orange-200' : (land.status === 'under_discussion' ? 'bg-blue-50 text-blue-600 border-blue-200' : (land.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-700 border-green-200'))}`}>
                      {land.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-right flex items-center justify-end gap-2">
                    {['rejected', 'sold', 'rented_to_company', 'partnership_active'].includes(land.status) ? (
                      <span className="text-[10px] uppercase font-black tracking-widest text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 italic">
                        Deal Closed
                      </span>
                    ) : (
                      <>
                        {land.status === 'under_discussion' && land.purpose === 'lease' && (
                           <button onClick={() => setLeaseDealLand(land)} className="bg-indigo-600 text-white font-bold text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-all shadow-sm">
                             Start Lease Deal
                           </button>
                        )}
                        <button onClick={() => setReviewingLand(land)} className="bg-gray-900 text-white font-bold text-xs px-4 py-1.5 rounded-lg hover:bg-gray-800 transition-colors shadow-sm active:scale-95">
                          Review
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {filteredLands.length === 0 && <tr><td colSpan="7" className="p-12 text-center text-gray-400 font-bold text-lg italic">No matching land requests found for your filters.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <LandReviewModal isOpen={!!reviewingLand} onClose={() => setReviewingLand(null)} land={reviewingLand} onSubmit={updateStatus} />
      <LeaseDealModal isOpen={!!leaseDealLand} onClose={() => setLeaseDealLand(null)} land={leaseDealLand} onSubmit={updateStatus} />
    </div>
  );
}

export default ManageLands;
