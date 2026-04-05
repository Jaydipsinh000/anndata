import React from 'react';
import { ActionButton } from '../components/AdminComponents';

function ManageTools({ tools, updateStatus }) {
  return (
    <div className="bg-white rounded-[2xl] shadow-sm border border-gray-100 overflow-hidden animate-[fadeIn_0.5s_ease-out]">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h3 className="text-lg font-black text-gray-800">Tractor & Implement Rentals</h3>
        <p className="text-sm font-medium text-gray-500">Supervise tools listed for rent by farmers and agencies.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
            <tr>
              <th className="p-4">Tool Identity</th>
              <th className="p-4">Owner Ref</th>
              <th className="p-4">Rental Rate</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Moderation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {tools.map(tool => (
              <tr key={tool._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-bold text-gray-800">{tool.name}</td>
                <td className="p-4 text-gray-600 font-medium">{tool.user_id?.name || 'Unknown'}</td>
                <td className="p-4">
                  <span className="bg-indigo-50 text-indigo-700 font-bold px-3 py-1 rounded-lg text-sm">₹{tool.rental_price}/day</span>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${tool.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-700'}`}>
                    {tool.status}
                  </span>
                </td>
                <td className="p-4 flex gap-2 justify-end">
                  <ActionButton type="approve" disabled={tool.status === 'approved'} onClick={() => updateStatus('tools', tool._id, 'approved')} />
                  <ActionButton type="reject" disabled={tool.status === 'rejected'} onClick={() => updateStatus('tools', tool._id, 'rejected')} />
                </td>
              </tr>
            ))}
            {tools.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-gray-400 font-bold italic">No tool listings found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageTools;
