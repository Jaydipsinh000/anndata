import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Clock, CheckCircle, Circle, MapPin, Coins, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Partnerships() {
  const [partnerships, setPartnerships] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPartnerships = async () => {
    try {
      const userInfoMap = localStorage.getItem('userInfo');
      if(!userInfoMap) { navigate('/login'); return; }
      const userInfo = JSON.parse(userInfoMap);
      
      const res = await fetch('/api/partnerships/my', {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      const data = await res.json();
      setPartnerships(Array.isArray(data) ? data : []);
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPartnerships(); }, []);

  const completeTask = async (pId, taskId) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    await fetch(`/api/partnerships/${pId}/tasks/toggle`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
      body: JSON.stringify({ taskId, is_completed: true })
    });
    fetchPartnerships();
  };

  if(loading) return <div className="min-h-screen bg-[#f8fafc]"><Navbar /><div className="text-center py-20 text-xl font-bold">Loading Operations...</div></div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-20">
      <Navbar />
      
      <div className="bg-gradient-to-r from-[#FF9800] to-[#F57C00] py-16 px-4 mb-10 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/background.png')] bg-cover mix-blend-overlay opacity-20"></div>
        <div className="w-24 h-24 bg-white/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border-4 border-white/30 shadow-2xl backdrop-blur-md">
            <Target size={48} className="text-white" />
        </div>
        <h2 className="text-white text-4xl md:text-5xl font-extrabold mb-2 relative z-10 drop-shadow-md">Partnership Operations</h2>
        <p className="text-orange-100 font-medium text-lg relative z-10">Track your daily tasks and financial ledger.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {partnerships.length === 0 ? (
           <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-gray-100">
             <h3 className="text-2xl font-black text-gray-800 mb-2">No Active Partnerships</h3>
             <p className="text-gray-500 font-medium">Your approved farming operations will appear here.</p>
           </div>
        ) : (
           <div className="grid gap-8">
              {partnerships.map((p) => {
                 const expenses = p.expenses || [];
                 const tasks = p.tasks || [];
                 let totalExpense = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

                 return (
                 <div key={p._id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header Spec */}
                    <div className="bg-orange-50/50 p-6 border-b border-orange-100/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                       <div>
                          <div className="flex gap-2 mb-2">
                             <span className="bg-[#FF9800] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">{p.status}</span>
                             <span className="bg-green-100 text-[#006400] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1"><MapPin size={10} /> {p.land_id?.location || 'Unknown'}</span>
                          </div>
                          <h3 className="text-2xl font-black text-gray-800">Assigned: {p.assigned_crop}</h3>
                          <p className="text-sm text-gray-500 font-medium mt-1">Profit Share: {p.land_id?.profit_sharing_ratio || '50/50'}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-orange-600 font-bold uppercase tracking-widest text-[10px] mb-1">Total Project Investment</p>
                          <p className="text-3xl font-black text-gray-800">₹{totalExpense.toLocaleString()}</p>
                       </div>
                    </div>

                    <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                       {/* LEFT: Task Tracker */}
                       <div>
                          <div className="flex flex-col gap-1 mb-6">
                             <h4 className="font-black text-lg flex items-center gap-2"><Clock className="text-[#FF9800]" /> Work To-Do List</h4>
                             <p className="text-xs text-gray-500 font-medium">Check off tasks as you complete them.</p>
                          </div>

                          {tasks.length === 0 ? (
                             <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center text-gray-500 font-bold italic">No tasks assigned yet.</div>
                          ) : (
                             <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[1.4rem] before:-translate-x-px md:before:ml-[1.45rem] md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-gray-200 before:to-transparent">
                                {tasks.map(task => (
                                   <div key={task._id} className={`relative flex items-start gap-4 transition-all duration-300 ${task.is_completed ? 'opacity-60' : 'opacity-100'}`}>
                                      <div className="relative z-10 shrink-0 mt-1">
                                         {task.is_completed ? (
                                            <CheckCircle className="text-green-500 bg-white" size={28} />
                                         ) : (
                                            <Circle className="text-gray-300 bg-white fill-white" size={28} />
                                         )}
                                      </div>
                                      <div className={`flex-1 p-5 rounded-2xl border transition-all ${task.is_completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-orange-200 shadow-sm'}`}>
                                         <div className="flex justify-between items-start gap-2 mb-2">
                                            <h5 className={`font-bold ${task.is_completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>{task.title}</h5>
                                            {task.due_date && <span className="shrink-0 text-[10px] font-black uppercase tracking-widest text-orange-600 bg-orange-50 px-2 py-1 rounded-md">{new Date(task.due_date).toLocaleDateString()}</span>}
                                         </div>
                                         <p className="text-sm text-gray-600 font-medium leading-relaxed mb-4">{task.description}</p>
                                         
                                         {!task.is_completed && (
                                            <button onClick={() => completeTask(p._id, task._id)} className="w-full bg-[#FF9800] hover:bg-[#F57C00] text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-orange-500/20 active:scale-[0.98]">
                                              Mark as Completed
                                            </button>
                                         )}
                                      </div>
                                   </div>
                                ))}
                             </div>
                          )}
                       </div>

                       {/* RIGHT: Expense Ledger */}
                       <div>
                          <div className="flex flex-col gap-1 mb-6">
                             <h4 className="font-black text-lg flex items-center gap-2"><Coins className="text-[#006400]" /> Financial Ledger</h4>
                             <p className="text-xs text-gray-500 font-medium">Record of investments to be split at harvest.</p>
                          </div>

                          {expenses.length === 0 ? (
                             <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center text-gray-500 font-bold italic">No expenses logged yet.</div>
                          ) : (
                             <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                                <ul className="divide-y divide-gray-100">
                                   {expenses.map((exp, i) => (
                                      <li key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                         <div>
                                            <p className="font-bold text-gray-800 text-sm">{exp.description}</p>
                                            <p className="text-xs text-gray-400 font-medium">{new Date(exp.date).toLocaleDateString()} • Borne by <span className="font-bold uppercase text-gray-600">{exp.borne_by}</span></p>
                                         </div>
                                         <div className="font-black text-[#006400] text-lg">
                                            ₹{(exp.amount || 0).toLocaleString()}
                                         </div>
                                      </li>
                                   ))}
                                </ul>
                             </div>
                          )}
                       </div>

                    </div>
                 </div>
                 );
              })}
           </div>
        )}
      </div>
    </div>
  );
}

export default Partnerships;
