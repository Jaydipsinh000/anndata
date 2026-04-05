import React, { useState } from 'react';
import { LandReviewModal } from '../components/AdminComponents';
import { ShieldCheck } from 'lucide-react';

function ManageLands({ lands, updateStatus }) {
  const [reviewingLand, setReviewingLand] = useState(null);

  return (
    <div className="bg-white rounded-[2xl] shadow-sm border border-gray-100 overflow-hidden animate-[fadeIn_0.5s_ease-out]">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h3 className="text-lg font-black text-gray-800">Land Deal Applications</h3>
        <p className="text-sm font-medium text-gray-500">Review corporate rent tracks and partnerships.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
            <tr>
              <th className="p-4">Track</th>
              <th className="p-4">Farmer</th>
              <th className="p-4">Location</th>
              <th className="p-4">Area</th>
              <th className="p-4">Trust</th>
              <th className="p-4">Deal Status</th>
              <th className="p-4 text-right">Moderator</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {lands.map(land => (
              <tr key={land._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4">
                   <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${land.purpose === 'lease' ? 'bg-indigo-100 text-indigo-700' : (land.purpose === 'partnership' ? 'bg-orange-100 text-orange-700' : 'bg-gray-200 text-gray-700')}`}>
                     {land.purpose || 'Sale'}
                   </span>
                </td>
                <td className="p-4 font-bold text-gray-800">{land.farmer_id?.name}</td>
                <td className="p-4 font-medium text-gray-600">{land.location}</td>
                <td className="p-4 font-medium text-gray-600">{land.area_value || land.area_in_acres} {land.area_unit || 'Acres'}</td>
                <td className="p-4">
                  {land.trust_badge === 'verified' ? (
                     <span className="flex items-center gap-1 text-[10px] uppercase font-black text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded w-max"><ShieldCheck size={12}/> Verified</span>
                  ) : (
                     <span className="flex items-center gap-1 text-[10px] uppercase font-black text-gray-500 bg-gray-100 border border-gray-200 px-2 py-1 rounded w-max">Pending</span>
                  )}
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${['pending','partnership_active'].includes(land.status) ? 'bg-orange-100 text-orange-600' : (land.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700')}`}>
                    {land.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {land.status === 'rejected' ? (
                    <span className="text-[10px] uppercase font-black tracking-widest text-red-500 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 italic">
                      Deal Closed
                    </span>
                  ) : (
                    <button onClick={() => setReviewingLand(land)} className="bg-gray-900 text-white font-bold text-xs px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-sm active:scale-95">
                      Review Actions
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {lands.length === 0 && <tr><td colSpan="7" className="p-8 text-center text-gray-400 font-bold italic">No land proposals found.</td></tr>}
          </tbody>
        </table>
      </div>

      <LandReviewModal isOpen={!!reviewingLand} onClose={() => setReviewingLand(null)} land={reviewingLand} onSubmit={updateStatus} />
    </div>
  );
}

export default ManageLands;
