import React, { useState } from 'react';

function AdminPartnershipCard({ p, onRefresh }) {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [expDesc, setExpDesc] = useState('');
  const [expAmt, setExpAmt] = useState('');

  const token = JSON.parse(localStorage.getItem('userInfo'))?.token;

  const handleAction = async (endpoint, payload) => {
    await fetch(`/api/partnerships/${p._id}/${endpoint}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    onRefresh();
  };

  const setCrop = async () => {
    const crop = window.prompt('Assign a crop for this operation:', p.assigned_crop);
    if(crop) {
      await fetch(`/api/partnerships/${p._id}/basic`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ assigned_crop: crop })
      });
      onRefresh();
    }
  };

  return (
    <div className="bg-white border flex flex-col gap-4 border-gray-100 hover:border-gray-200 transition-all rounded-3xl p-6 shadow-sm relative overflow-hidden">
      <div className="flex justify-between items-start border-b border-gray-100 pb-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9800] bg-orange-50 px-3 py-1.5 rounded-xl">{p.status}</span>
          <h4 className="font-black text-2xl text-gray-800 mt-3">{p.farmer_id?.name || 'Farmer'}</h4>
          <p className="text-sm text-gray-500 font-bold">{p.land_id?.location}</p>
        </div>
        <div className="text-right">
          <button onClick={setCrop} className="text-sm font-black tracking-wide text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:-translate-y-1 transform px-4 py-2 rounded-xl transition-all shadow-sm">{p.assigned_crop}</button>
          <p className="text-[10px] uppercase font-bold text-gray-400 mt-2 tracking-widest">Share Ratio: {p.land_id?.profit_sharing_ratio}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        {/* Add Task Panel */}
        <div className="bg-blue-50/30 p-5 rounded-2xl border border-blue-100/50">
           <h5 className="font-black text-xs uppercase tracking-widest text-blue-800 mb-4">Assign Daily Task</h5>
           <input className="w-full text-sm font-medium p-3 mb-2 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white" placeholder="What to do? (e.g. Treat soil)" value={taskTitle} onChange={e=>setTaskTitle(e.target.value)} />
           <input className="w-full text-xs font-medium p-3 mb-4 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white" placeholder="Instructions/Methodology..." value={taskDesc} onChange={e=>setTaskDesc(e.target.value)} />
           <button onClick={() => { handleAction('tasks', { title: taskTitle, description: taskDesc }); setTaskTitle(''); setTaskDesc(''); }} className="w-full bg-blue-600 text-white font-bold tracking-wide py-3 rounded-xl text-sm hover:bg-blue-700 shadow-md shadow-blue-600/20 active:scale-[0.98] transition-all">Append Task</button>
        </div>

        {/* Add Expense Panel */}
        <div className="bg-green-50/30 p-5 rounded-2xl border border-green-100/50">
           <h5 className="font-black text-xs uppercase tracking-widest text-green-800 mb-4">Log Invoice/Expense</h5>
           <input className="w-full text-sm font-medium p-3 mb-2 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 outline-none transition-all bg-white" placeholder="Items Bought (e.g. NPK Fertilizer)" value={expDesc} onChange={e=>setExpDesc(e.target.value)} />
           <input className="w-full text-xs font-medium p-3 mb-4 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 outline-none transition-all bg-white" type="number" placeholder="Value in ₹" value={expAmt} onChange={e=>setExpAmt(e.target.value)} />
           <button onClick={() => { handleAction('expenses', { description: expDesc, amount: expAmt, borne_by: 'company' }); setExpDesc(''); setExpAmt(''); }} className="w-full bg-green-600 text-white font-bold tracking-wide py-3 rounded-xl text-sm hover:bg-green-700 shadow-md shadow-green-600/20 active:scale-[0.98] transition-all">Record Ledger Entry</button>
        </div>
      </div>
    </div>
  );
}

function ManagePartnerships({ partnerships, onRefresh }) {
  return (
     <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-[fadeIn_0.5s_ease-out]">
        {partnerships.map(p => <AdminPartnershipCard key={p._id} p={p} onRefresh={onRefresh} />)}
        {partnerships.length === 0 && <div className="col-span-full bg-white rounded-[2rem] p-16 text-center font-bold text-gray-400 border border-gray-100 shadow-sm text-xl italic">No partnerships are actively operating.</div>}
     </div>
  );
}

export default ManagePartnerships;
