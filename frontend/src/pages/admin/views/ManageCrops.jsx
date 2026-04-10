import React, { useState, useMemo } from 'react';
import { ActionButton } from '../components/AdminComponents';
import { Search, Sprout, Wheat, Layers, Clock, CheckCircle2, Package } from 'lucide-react';

function ManageCrops({ crops, updateStatus }) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  const stats = useMemo(() => {
    let growing = 0, ready = 0, pending = 0, approved = 0;
    crops.forEach(c => {
      if (c.type === 'growing') growing++; else ready++;
      if (c.status === 'pending') pending++;
      if (c.status === 'approved' || c.status === 'harvested') approved++;
    });
    return { total: crops.length, growing, ready, pending, approved };
  }, [crops]);

  const filteredCrops = useMemo(() => {
    return crops.filter(c => {
      const matchSearch = (c.crop_name || '').toLowerCase().includes(search.toLowerCase()) || (c.user_id?.name || '').toLowerCase().includes(search.toLowerCase());
      if (!matchSearch) return false;
      if (filterType === 'growing') return c.type === 'growing';
      if (filterType === 'ready') return c.type === 'ready' || !c.type;
      if (filterType === 'pending') return c.status === 'pending';
      return true;
    });
  }, [crops, search, filterType]);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 animate-[fadeIn_0.3s_ease-out]">
        <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm text-center">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total</p>
          <p className="text-3xl font-black text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-green-50/50 p-5 rounded-[2rem] border border-green-100 shadow-sm text-center">
          <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1">Growing</p>
          <p className="text-3xl font-black text-green-700">{stats.growing}</p>
        </div>
        <div className="bg-orange-50/50 p-5 rounded-[2rem] border border-orange-100 shadow-sm text-center">
          <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Ready</p>
          <p className="text-3xl font-black text-orange-700">{stats.ready}</p>
        </div>
        <div className="bg-yellow-50/50 p-5 rounded-[2rem] border border-yellow-100 shadow-sm text-center">
          <p className="text-[10px] font-black text-yellow-600 uppercase tracking-widest mb-1">Pending</p>
          <p className="text-3xl font-black text-yellow-700">{stats.pending}</p>
        </div>
        <div className="bg-blue-50/50 p-5 rounded-[2rem] border border-blue-100 shadow-sm text-center">
          <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Approved</p>
          <p className="text-3xl font-black text-blue-700">{stats.approved}</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden animate-[fadeIn_0.5s_ease-out]">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            {['all', 'growing', 'ready', 'pending'].map(tab => (
              <button key={tab} onClick={() => setFilterType(tab)} className={`px-5 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${filterType === tab ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                {tab}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Search crop or farmer..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400 font-medium" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#f8fafc] text-gray-500 font-black uppercase text-[10px] tracking-widest border-b border-gray-100">
              <tr>
                <th className="p-4">Type</th>
                <th className="p-4">Crop</th>
                <th className="p-4">Farmer</th>
                <th className="p-4">Area / Yield</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock Control</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCrops.map(crop => (
                <tr key={crop._id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="p-4">
                    {crop.type === 'growing' ? (
                      <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-green-700 bg-green-100 px-2 py-1 rounded-lg w-max"><Sprout size={12}/> Growing</span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-orange-700 bg-orange-100 px-2 py-1 rounded-lg w-max"><Wheat size={12}/> Ready</span>
                    )}
                  </td>
                  <td className="p-4">
                    <p className="font-black text-gray-800 capitalize">{crop.crop_name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{crop.season} {crop.quality_grade && crop.quality_grade !== 'Ungraded' ? `• Grade ${crop.quality_grade}` : ''}</p>
                  </td>
                  <td className="p-4 font-medium text-gray-600">{crop.user_id?.name || 'Unknown'}</td>
                  <td className="p-4 text-sm">
                    <p className="font-bold text-gray-800">{crop.area_value} {crop.area_unit}</p>
                    <p className="text-xs text-green-600 font-medium">{crop.type === 'growing' ? `Yield: ${crop.expected_yield_qty || '-'} ${crop.expected_yield_unit || 'kg'}` : `Avail: ${crop.available_qty || crop.stock || 0}`}</p>
                  </td>
                  <td className="p-4 font-black text-[#006400]">₹{crop.price}</td>
                  <td className="p-4 text-sm">
                    {crop.reserved_qty > 0 ? (
                      <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg flex items-center gap-1 w-max"><Package size={10}/> {crop.reserved_qty} reserved</span>
                    ) : (
                      <span className="text-gray-400 text-xs">No reservations</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${crop.status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-200' : (crop.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-700 border-green-200')}`}>
                      {crop.status}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2 justify-end">
                    <ActionButton type="approve" disabled={crop.status === 'approved'} onClick={() => updateStatus('crops', crop._id, 'approved')} />
                    <ActionButton type="reject" disabled={crop.status === 'rejected'} onClick={() => updateStatus('crops', crop._id, 'rejected')} />
                  </td>
                </tr>
              ))}
              {filteredCrops.length === 0 && <tr><td colSpan="8" className="p-12 text-center text-gray-400 font-bold italic text-lg">No crops matching your filters.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageCrops;
