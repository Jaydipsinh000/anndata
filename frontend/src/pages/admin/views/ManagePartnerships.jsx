import React, { useState } from 'react';
import { Target, Leaf, Sprout, Tractor, IndianRupee, MapPin, Loader2, CheckCircle2 } from 'lucide-react';
import Swal from 'sweetalert2';

function AdminPartnershipCard({ p, onRefresh }) {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [expDesc, setExpDesc] = useState('');
  const [expAmt, setExpAmt] = useState('');
  
  // Profit Settlement State
  const [incomeInput, setIncomeInput] = useState(p.total_income || '');
  const [isSettling, setIsSettling] = useState(false);

  const token = JSON.parse(localStorage.getItem('userInfo'))?.token;

  const handleAction = async (endpoint, payload) => {
    await fetch(`/api/partnerships/${p._id}/${endpoint}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    onRefresh();
  };

  const updateStage = async (stage) => {
    await fetch(`/api/partnerships/${p._id}/basic`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ crop_stage: stage })
    });
    onRefresh();
  };

  const setCropDetails = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Assign Crop Details',
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Crop Name" value="${p.assigned_crop || ''}">` +
        `<input id="swal-input2" class="swal2-input" type="number" placeholder="Expected Yield (Tons)" value="${p.expected_yield_tons || ''}">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#006400',
      preConfirm: () => {
        return [
          document.getElementById('swal-input1').value,
          document.getElementById('swal-input2').value
        ]
      }
    });

    if (formValues && formValues[0]) {
      const crop = formValues[0];
      const yieldAmt = formValues[1];
      await fetch(`/api/partnerships/${p._id}/basic`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ assigned_crop: crop, expected_yield_tons: Number(yieldAmt) || 0 })
      });
      onRefresh();
    }
  };

  const processSettlement = async () => {
     setIsSettling(true);
     const totalExpenses = p.expenses.reduce((acc, curr) => acc + curr.amount, 0);
     const totalInc = Number(incomeInput);
     const netProfit = totalInc - totalExpenses;
     
     // default roughly 50-50, but can be scaled
     const splitRatio = 0.5; // From '50/50' string roughly
     
     await fetch(`/api/partnerships/${p._id}/basic`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
           total_income: totalInc, net_profit: netProfit,
           final_farmer_share: netProfit * splitRatio,
           final_company_share: netProfit * (1 - splitRatio),
           status: 'completed'
        })
     });
     onRefresh();
     setIsSettling(false);
  };

  const stages = ['planning', 'sowing', 'growing', 'harvest'];
  const stageIcons = { 'planning': <Target size={16}/>, 'sowing': <Sprout size={16}/>, 'growing': <Leaf size={16}/>, 'harvest': <Tractor size={16}/> };

  const currentStageIndex = stages.indexOf(p.crop_stage || 'planning');
  const totalExpenses = p.expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className={`bg-white border flex flex-col gap-6 hover:border-gray-300 transition-all rounded-[2rem] p-6 shadow-sm relative overflow-hidden ${p.status === 'completed' ? 'border-green-300 bg-green-50/20' : 'border-gray-200'}`}>
      
      {/* Header Info */}
      <div className="flex justify-between items-start">
        <div>
          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl ${p.status === 'completed' ? 'text-green-700 bg-green-100' : 'text-[#FF9800] bg-orange-50'}`}>{p.status}</span>
          <h4 className="font-black text-2xl text-gray-800 mt-3">{p.farmer_id?.name || 'Farmer'}</h4>
          <p className="text-xs text-gray-500 font-bold flex items-center gap-1 mt-1"><MapPin size={12}/>{p.land_id?.location}</p>
        </div>
        <div className="text-right">
          <button onClick={p.status !== 'completed' ? setCropDetails : undefined} className={`text-sm font-black tracking-wide px-4 py-2 rounded-xl transition-all shadow-sm ${p.status !== 'completed' ? 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:-translate-y-1 transform' : 'text-gray-500 bg-gray-100 cursor-not-allowed'}`}>
             {p.assigned_crop}
          </button>
          <p className="text-[10px] uppercase font-bold text-gray-400 mt-2 tracking-widest">Expected Yield: <span className="text-gray-700">{p.expected_yield_tons || 0} Tons</span></p>
        </div>
      </div>

      {/* Dynamic Progress Timeline */}
      <div className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center relative z-10 before:absolute before:top-1/2 before:-translate-y-1/2 before:w-full before:h-1 before:bg-gray-200 before:-z-10">
         {stages.map((st, idx) => (
            <button 
              key={st} disabled={p.status === 'completed'}
              onClick={() => updateStage(st)}
              className={`flex flex-col items-center gap-2 group transition-all`}
            >
               <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${idx <= currentStageIndex ? 'bg-[#006400] text-white shadow-md' : 'bg-white text-gray-400 border-2 border-gray-200 group-hover:border-[#006400]'}`}>
                  {stageIcons[st]}
               </div>
               <span className={`text-[9px] font-black uppercase tracking-widest ${idx <= currentStageIndex ? 'text-[#006400]' : 'text-gray-400'}`}>{st}</span>
            </button>
         ))}
      </div>

      {p.status !== 'completed' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Add Task Panel */}
          <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
             <h5 className="font-black text-xs uppercase tracking-widest text-blue-800 mb-4">Assign Active Task</h5>
             <input className="w-full text-sm font-medium p-3 mb-2 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white shadow-sm" placeholder="Title (e.g. Treat soil)" value={taskTitle} onChange={e=>setTaskTitle(e.target.value)} />
             <input className="w-full text-xs font-medium p-3 mb-4 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white shadow-sm" placeholder="Instructions..." value={taskDesc} onChange={e=>setTaskDesc(e.target.value)} />
             <button onClick={() => { handleAction('tasks', { title: taskTitle, description: taskDesc }); setTaskTitle(''); setTaskDesc(''); }} className="w-full bg-blue-600 text-white font-bold tracking-wide py-3 rounded-xl text-sm hover:bg-blue-700 shadow-md shadow-blue-600/20 active:scale-[0.98] transition-all">Issue Order</button>
          </div>

          {/* Add Expense Panel */}
          <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100">
             <h5 className="font-black text-xs uppercase tracking-widest text-orange-800 mb-4 flex justify-between">Log Expense <span className="text-gray-500">Vol: ₹{totalExpenses.toLocaleString('en-IN')}</span></h5>
             <input className="w-full text-sm font-medium p-3 mb-2 rounded-xl border border-orange-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-white shadow-sm" placeholder="Invoice (e.g. Seeds)" value={expDesc} onChange={e=>setExpDesc(e.target.value)} />
             <input className="w-full text-xs font-medium p-3 mb-4 rounded-xl border border-orange-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-white shadow-sm" type="number" placeholder="Cost in ₹" value={expAmt} onChange={e=>setExpAmt(e.target.value)} />
             <button onClick={() => { handleAction('expenses', { description: expDesc, amount: expAmt, borne_by: 'company' }); setExpDesc(''); setExpAmt(''); }} className="w-full bg-orange-600 text-white font-bold tracking-wide py-3 rounded-xl text-sm hover:bg-orange-700 shadow-md shadow-orange-600/20 active:scale-[0.98] transition-all">Record Ledger Entry</button>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 p-6 rounded-2xl border border-green-200 text-center">
           <CheckCircle2 className="mx-auto text-green-500 mb-2" size={32} />
           <h4 className="font-black text-xl text-green-900">Partnership Settled</h4>
           <div className="flex justify-around mt-4 text-left">
              <div><p className="text-[10px] uppercase font-bold text-green-600 tracking-widest">Total Revenue</p><p className="font-black text-lg text-green-900">₹{p.total_income?.toLocaleString('en-IN')}</p></div>
              <div><p className="text-[10px] uppercase font-bold text-green-600 tracking-widest">Net Profit</p><p className="font-black text-lg text-green-900">₹{p.net_profit?.toLocaleString('en-IN')}</p></div>
           </div>
        </div>
      )}

      {/* Harvest Profit Settlement Block */}
      {p.crop_stage === 'harvest' && p.status !== 'completed' && (
         <div className="bg-[#004d00] rounded-2xl p-6 text-white shadow-xl animate-[fadeIn_0.5s_ease-out]">
            <h4 className="font-black text-lg flex items-center gap-2 mb-4"><IndianRupee size={20}/> Financial Closure & Profit Split</h4>
            <div className="space-y-4">
               <div>
                 <label className="text-[10px] uppercase font-black text-green-300 tracking-widest block mb-2">Total Gross Income from Harvest Sale (₹)</label>
                 <input type="number" value={incomeInput} onChange={e=>setIncomeInput(e.target.value)} placeholder="e.g. 500000" className="w-full bg-green-900/50 border border-green-700 text-white p-4 rounded-xl focus:outline-none focus:border-green-400 font-bold" />
               </div>
               
               {incomeInput && (
                 <div className="bg-white/10 p-4 rounded-xl">
                    <div className="flex justify-between mb-2"><span className="text-xs font-medium">Gross Revenue</span> <span className="font-bold">₹{Number(incomeInput).toLocaleString('en-IN')}</span></div>
                    <div className="flex justify-between mb-4"><span className="text-xs font-medium text-red-300">Total Expenses Logged</span> <span className="font-bold text-red-300">- ₹{totalExpenses.toLocaleString('en-IN')}</span></div>
                    <div className="flex justify-between border-t border-white/20 pt-2"><span className="text-sm font-black">Net Projected Profit</span> <span className="font-black text-lg text-green-300">₹{(Number(incomeInput) - totalExpenses).toLocaleString('en-IN')}</span></div>
                    
                    <button onClick={processSettlement} disabled={isSettling} className="w-full bg-white text-[#004d00] font-black tracking-widest uppercase text-xs py-4 rounded-xl mt-6 hover:bg-gray-100 transition-colors flex justify-center items-center gap-2">
                       {isSettling ? <Loader2 className="animate-spin" size={16} /> : 'Lock Deal & Disburse Shares'}
                    </button>
                 </div>
               )}
            </div>
         </div>
      )}

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
