import React from 'react';
import { ActionButton } from '../components/AdminComponents';

function ManageUsers({ users, updateStatus }) {
  return (
    <div className="bg-white rounded-[2xl] shadow-sm border border-gray-100 overflow-hidden animate-[fadeIn_0.5s_ease-out]">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h3 className="text-lg font-black text-gray-800">User Governance</h3>
        <p className="text-sm font-medium text-gray-500">Manage account permissions and verify farmers.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Contact / Email</th>
              <th className="p-4">System Role</th>
              <th className="p-4">Verification</th>
              <th className="p-4 text-right">Moderation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map(u => (
              <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-bold text-gray-800">{u.name}</td>
                <td className="p-4 text-gray-600 font-medium">{u.email} <br/><span className="text-xs text-gray-400">{u.mobile}</span></td>
                <td className="p-4">
                   <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{u.role}</span>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.status === 'pending' ? 'bg-orange-100 text-orange-600' : (u.status === 'blocked' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700')}`}>
                    {u.status || 'pending'}
                  </span>
                </td>
                <td className="p-4 flex gap-2 justify-end">
                  <ActionButton type="approve" disabled={u.status === 'approved'} onClick={() => updateStatus('users', u._id, 'approved')} />
                  <ActionButton type="reject" disabled={u.status === 'blocked'} onClick={() => updateStatus('users', u._id, 'blocked')} />
                </td>
              </tr>
            ))}
            {users.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-gray-400 font-bold italic">No users found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageUsers;
