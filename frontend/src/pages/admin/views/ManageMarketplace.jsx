import React from 'react';
import { ActionButton } from '../components/AdminComponents';

function ManageMarketplace({ items, updateStatus }) {
  return (
    <div className="bg-white rounded-[2xl] shadow-sm border border-gray-100 overflow-hidden animate-[fadeIn_0.5s_ease-out]">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h3 className="text-lg font-black text-gray-800">Wholesale Marketplace</h3>
        <p className="text-sm font-medium text-gray-500">Approve bulk listings intended for commercial buyers.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
            <tr>
              <th className="p-4">Commodity</th>
              <th className="p-4">Vendor</th>
              <th className="p-4">Pricing</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Moderation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.map(item => (
              <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-bold text-gray-800">{item.name} <br/><span className="text-xs text-gray-400">Stock: {item.quantity} kg</span></td>
                <td className="p-4 text-gray-600 font-medium">{item.farmer_id?.name || 'Unknown'}</td>
                <td className="p-4">
                  <span className="bg-purple-50 text-purple-700 font-bold px-3 py-1 rounded-lg text-sm">₹{item.price}/kg</span>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-700'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-4 flex gap-2 justify-end">
                  <ActionButton type="approve" disabled={item.status === 'available'} onClick={() => updateStatus('marketplace', item._id, 'available')} />
                  <ActionButton type="reject" disabled={item.status === 'rejected'} onClick={() => updateStatus('marketplace', item._id, 'rejected')} />
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-gray-400 font-bold italic">No marketplace listings.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageMarketplace;
