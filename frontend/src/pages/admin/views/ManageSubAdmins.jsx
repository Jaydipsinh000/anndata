import { useState, useEffect } from 'react';
import { UserCheck, Plus, CheckCircle, Clock, ShieldAlert, Award, FileText, Send, User } from 'lucide-react';
import toast from 'react-hot-toast';

function ManageSubAdmins() {
  const [subAdmins, setSubAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Sub-Admin Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '', mobile: '' });

  // Assign Task Modal
  const [assignModalAdmin, setAssignModalAdmin] = useState(null);
  const [taskData, setTaskData] = useState({ task_title: '', description: '', due_date: '' });

  const fetchSubAdmins = () => {
    const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
    if (!token) return;

    fetch('/api/admin/sub-admins', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setSubAdmins(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSubAdmins();
  }, []);

  // Handle Create Sub-Admin
  const handleCreateSubAdmin = async (e) => {
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem('userInfo'))?.token;

    const toastId = toast.loading('Creating Sub-Admin account...');
    try {
      const res = await fetch('/api/admin/create-sub-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newAdmin)
      });
      const data = await res.json();

      if (res.ok) {
        toast.success('Sub-Admin created successfully!', { id: toastId });
        setShowCreateModal(false);
        setNewAdmin({ name: '', email: '', password: '', mobile: '' });
        fetchSubAdmins();
      } else {
        toast.error(data.message || 'Failed to create Sub-Admin', { id: toastId });
      }
    } catch (err) {
      toast.error('Server error creating Sub-Admin', { id: toastId });
    }
  };

  // Handle Assign Task
  const handleAssignTask = async (e) => {
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem('userInfo'))?.token;

    const toastId = toast.loading('Assigning task...');
    try {
      const res = await fetch('/api/admin/assign-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          admin_id: assignModalAdmin._id,
          task_title: taskData.task_title,
          description: taskData.description,
          due_date: taskData.due_date
        })
      });

      if (res.ok) {
        toast.success('Task assigned to Sub-Admin!', { id: toastId });
        setAssignModalAdmin(null);
        setTaskData({ task_title: '', description: '', due_date: '' });
        fetchSubAdmins();
      } else {
        toast.error('Failed to assign task', { id: toastId });
      }
    } catch (err) {
      toast.error('Server error assigning task', { id: toastId });
    }
  };

  return (
    <div className="space-y-6">
       
       {/* Top Banner Header */}
       <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/40 rounded-full text-xs font-black uppercase tracking-widest mb-2">
                <Award size={14} /> Super Admin Work Desk
             </div>
             <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Sub-Admin & Task Delegation Panel</h2>
             <p className="text-slate-300 text-xs md:text-sm font-medium mt-1">
                Manage operational Sub-Admins, assign field verification tasks, and monitor completion metrics.
             </p>
          </div>

          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-2xl font-black text-xs transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer shrink-0"
          >
             <Plus size={18} /> Add New Sub-Admin
          </button>
       </div>

       {/* Sub-Admins Grid */}
       {loading ? (
          <div className="text-center py-16">
             <div className="w-12 h-12 border-4 border-slate-200 border-t-[#006400] rounded-full animate-spin mx-auto mb-3"></div>
             <p className="text-slate-500 text-xs font-bold">Loading Sub-Admins...</p>
          </div>
       ) : subAdmins.length === 0 ? (
          <div className="bg-white p-12 rounded-[2rem] text-center border border-slate-200">
             <UserCheck size={48} className="mx-auto text-slate-300 mb-3"/>
             <h3 className="font-extrabold text-slate-800 text-lg">No Sub-Admins Registered Yet</h3>
             <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                Click "Add New Sub-Admin" above to create operational admin accounts for your team.
             </p>
             <button 
               onClick={() => setShowCreateModal(true)}
               className="px-5 py-2.5 bg-[#006400] text-white rounded-xl font-bold text-xs"
             >
                Create First Sub-Admin
             </button>
          </div>
       ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {subAdmins.map(adm => (
                <div key={adm._id} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 relative flex flex-col justify-between">
                   <div>
                      <div className="flex justify-between items-start mb-4 pb-3 border-b border-slate-100">
                         <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-800 font-black text-lg flex items-center justify-center border border-indigo-200">
                               {adm.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                               <h3 className="font-black text-slate-900 text-base">{adm.name}</h3>
                               <p className="text-xs text-slate-500 font-mono font-medium">{adm.email}</p>
                            </div>
                         </div>
                         <span className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-extrabold uppercase rounded-full">
                            Sub-Admin
                         </span>
                      </div>

                      {/* Assigned Work Tasks List */}
                      <div className="mb-4">
                         <div className="flex justify-between items-center mb-2">
                            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                               <FileText size={14} className="text-[#006400]"/> Assigned Tasks ({adm.assigned_tasks?.length || 0})
                            </h4>
                            <button 
                              onClick={() => setAssignModalAdmin(adm)}
                              className="text-[11px] font-bold text-[#006400] hover:underline flex items-center gap-1"
                            >
                               <Plus size={12}/> Assign New Task
                            </button>
                         </div>

                         {(!adm.assigned_tasks || adm.assigned_tasks.length === 0) ? (
                            <p className="text-xs italic text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-100">
                               No operational tasks currently assigned to this Sub-Admin.
                            </p>
                         ) : (
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                               {adm.assigned_tasks.map((task, idx) => (
                                  <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                                     <div>
                                        <p className="font-extrabold text-slate-900">{task.task_title}</p>
                                        {task.description && <p className="text-[11px] text-slate-500">{task.description}</p>}
                                     </div>
                                     <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase shrink-0 ${task.status === 'completed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'}`}>
                                        {task.status}
                                     </span>
                                  </div>
                               ))}
                            </div>
                         )}
                      </div>
                   </div>

                   <button 
                     onClick={() => setAssignModalAdmin(adm)}
                     className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-extrabold text-xs transition-colors flex items-center justify-center gap-2"
                   >
                      <Plus size={14} /> Assign Operational Task
                   </button>
                </div>
             ))}
          </div>
       )}

       {/* MODAL 1: CREATE SUB-ADMIN */}
       {showCreateModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
             <div className="bg-white rounded-[2.5rem] p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-200">
                <h3 className="font-black text-xl text-slate-900 mb-1 flex items-center gap-2">
                   <UserCheck className="text-[#006400]" size={24}/> Create Sub-Admin Account
                </h3>
                <p className="text-xs text-slate-500 font-medium mb-6">
                   Sub-Admins can manage crops, lands, tools, and user requests under Super Admin supervision.
                </p>

                <form onSubmit={handleCreateSubAdmin} className="space-y-4">
                   <div>
                      <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Full Name</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. Rajesh Kumar (Land Inspector)"
                        value={newAdmin.name} 
                        onChange={e => setNewAdmin({...newAdmin, name: e.target.value})}
                        className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#006400]"
                      />
                   </div>

                   <div>
                      <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Admin Email</label>
                      <input 
                        type="email" 
                        required 
                        placeholder="rajesh.admin@anndata.com"
                        value={newAdmin.email} 
                        onChange={e => setNewAdmin({...newAdmin, email: e.target.value})}
                        className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#006400]"
                      />
                   </div>

                   <div>
                      <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Admin Password</label>
                      <input 
                        type="password" 
                        required 
                        placeholder="••••••••"
                        value={newAdmin.password} 
                        onChange={e => setNewAdmin({...newAdmin, password: e.target.value})}
                        className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#006400]"
                      />
                   </div>

                   <div>
                      <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Mobile Phone</label>
                      <input 
                        type="tel" 
                        required 
                        placeholder="9876543210"
                        value={newAdmin.mobile} 
                        onChange={e => setNewAdmin({...newAdmin, mobile: e.target.value})}
                        className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#006400]"
                      />
                   </div>

                   <div className="flex gap-3 pt-2">
                      <button 
                        type="button" 
                        onClick={() => setShowCreateModal(false)}
                        className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs"
                      >
                         Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="flex-1 py-3 bg-[#006400] text-white rounded-xl font-extrabold text-xs shadow-md"
                      >
                         Create Sub-Admin
                      </button>
                   </div>
                </form>
             </div>
          </div>
       )}

       {/* MODAL 2: ASSIGN WORK TASK */}
       {assignModalAdmin && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
             <div className="bg-white rounded-[2.5rem] p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-200">
                <h3 className="font-black text-lg text-slate-900 mb-1">
                   Assign Work Task to {assignModalAdmin.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium mb-4">
                   Task will be assigned under Super Admin supervision with progress tracking.
                </p>

                <form onSubmit={handleAssignTask} className="space-y-4">
                   <div>
                      <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Task Title / Operational Responsibility</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. Inspect 7/12 Land Records in Lilapur Village"
                        value={taskData.task_title} 
                        onChange={e => setTaskData({...taskData, task_title: e.target.value})}
                        className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#006400]"
                      />
                   </div>

                   <div>
                      <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Task Details & Description</label>
                      <textarea 
                        rows="3"
                        placeholder="e.g. Verify borewell water connection, 3-phase light meter, and 7/12 deed document with farmer."
                        value={taskData.description} 
                        onChange={e => setTaskData({...taskData, description: e.target.value})}
                        className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#006400]"
                      ></textarea>
                   </div>

                   <div className="flex gap-3 pt-2">
                      <button 
                        type="button" 
                        onClick={() => setAssignModalAdmin(null)}
                        className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs"
                      >
                         Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5"
                      >
                         <Send size={16}/> Assign Task
                      </button>
                   </div>
                </form>
             </div>
          </div>
       )}

    </div>
  );
}

export default ManageSubAdmins;
