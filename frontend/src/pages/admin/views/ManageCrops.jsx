import React from 'react';
import { ActionButton } from '../components/AdminComponents';

function ManageCrops({ crops, updateStatus }) {
  return (
    <div className="bg-white rounded-[2xl] shadow-sm border border-gray-100 overflow-hidden animate-[fadeIn_0.5s_ease-out]">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h3 className="text-lg font-black text-gray-800">Crop Database</h3>
        <p className="text-sm font-medium text-gray-500">Approve public listings submitted by local farmers.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
            <tr>
              <th className="p-4">Harvest</th>
              <th className="p-4">Farmer</th>
              <th className="p-4">Area / Yield</th>
              <th className="p-4">Quality Verification</th>
              <th className="p-4 text-right">Moderation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {crops.map(crop => (
              <tr key={crop._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-bold text-gray-800">{crop.name} <br/><span className="text-[10px] uppercase text-gray-400">{crop.season}</span></td>
                <td className="p-4 text-gray-600 font-medium">{crop.user_id?.name || 'Unknown'}</td>
                <td className="p-4 text-gray-600 font-medium">{crop.area_value} {crop.area_unit}<br/><span className="text-xs text-green-600">{crop.expected_yield} kg</span></td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${crop.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-700'}`}>
                    {crop.status}
                  </span>
                </td>
                <td className="p-4 flex gap-2 justify-end">
                  <ActionButton type="approve" disabled={crop.status === 'approved'} onClick={() => updateStatus('crops', crop._id, 'approved')} />
                  <ActionButton type="reject" disabled={crop.status === 'rejected'} onClick={() => updateStatus('crops', crop._id, 'rejected')} />
                </td>
              </tr>
            ))}
            {crops.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-gray-400 font-bold italic">No crops submitted.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageCrops;
