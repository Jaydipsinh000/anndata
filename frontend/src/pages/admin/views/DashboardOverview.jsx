import React from 'react';
import { Users, Wheat, Map, Store, TrendingUp, DollarSign, CheckCircle2, ShieldCheck } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

function StatCard({ title, value, icon, color }) {
  return (
    <div className={`bg-white border-l-4 ${color} rounded-2xl p-6 shadow-sm`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">{title}</p>
          <h3 className="text-4xl font-black text-gray-800">{value}</h3>
        </div>
        <div className={`p-4 rounded-xl bg-gray-50`}>{icon}</div>
      </div>
    </div>
  );
}

function DashboardOverview({ stats, userRole }) {
  const isSuper = userRole === 'superadmin';

  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">
       
       {/* Role Badge Banner */}
       <div className={`mb-6 p-4 rounded-2xl border flex items-center justify-between ${isSuper ? 'bg-amber-500/10 border-amber-500/30 text-amber-900' : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-900'}`}>
          <div className="flex items-center gap-3">
             <ShieldCheck size={24} className={isSuper ? 'text-amber-600' : 'text-indigo-600'} />
             <div>
                <h3 className="font-black text-base">{isSuper ? '👑 Super Admin Master Command Desk' : '🛠️ Sub-Admin Operational Work Desk'}</h3>
                <p className="text-xs font-semibold opacity-80">
                   {isSuper ? 'Full System Override & Revenue Analytics Access Enabled' : 'Operational Tasks, Field Audits & Verification Duties Active'}
                </p>
             </div>
          </div>
          <span className="text-xs font-black uppercase px-3 py-1 bg-white rounded-xl shadow-sm border border-gray-200">
             Role: {userRole}
          </span>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard title="Total Farmers" value={stats?.totalFarmers || 0} color="border-green-500" icon={<Users className="text-green-500" size={24} />} />
          <StatCard title="Total Buyers" value={stats?.totalBuyers || 0} color="border-blue-500" icon={<Users className="text-blue-500" size={24} />} />
          <StatCard title="Total Crops" value={stats?.totalCrops || 0} color="border-orange-500" icon={<Wheat className="text-orange-500" size={24} />} />
          <StatCard title="Active Deals" value={stats?.activeDeals || 0} color="border-purple-500" icon={<Map className="text-purple-500" size={24} />} />
          
          {/* Revenue Widget for Super Admin vs Operational Tasks for Sub Admin */}
          {isSuper ? (
            <StatCard title="Total Revenue" value="₹ 4.8L" color="border-amber-500" icon={<DollarSign className="text-amber-500" size={24} />} />
          ) : (
            <StatCard title="Active Tasks" value="3 Pending" color="border-indigo-500" icon={<CheckCircle2 className="text-indigo-500" size={24} />} />
          )}
       </div>

       {/* Super Admin Financial Revenue Charts (Hidden from Sub-Admin) */}
       {isSuper ? (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
           <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2"><TrendingUp className="text-green-600"/> Platform GMV (Gross Revenue Value)</h3>
              <div className="h-72 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={[
                     { name: 'Jan', value: 4000 }, { name: 'Feb', value: 3000 }, { name: 'Mar', value: 5000 },
                     { name: 'Apr', value: 8000 }, { name: 'May', value: 6500 }, { name: 'Jun', value: 9000 }
                   ]}>
                     <defs>
                       <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#006400" stopOpacity={0.3}/>
                         <stop offset="95%" stopColor="#006400" stopOpacity={0}/>
                       </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} />
                     <YAxis axisLine={false} tickLine={false} />
                     <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                     <Area type="monotone" dataKey="value" stroke="#006400" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                   </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>

           <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2"><DollarSign className="text-indigo-600"/> Platform Subscription Revenue</h3>
              <div className="h-72 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={[
                     { name: 'Free Farmers', count: 120 }, { name: 'Verified Pro', count: 45 }, { name: 'Corporate Buyers', count: 15 }
                   ]}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} />
                     <YAxis axisLine={false} tickLine={false} />
                     <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                     <Bar dataKey="count" fill="#4f46e5" radius={[8, 8, 0, 0]} barSize={40} />
                   </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>
         </div>
       ) : (
         /* Sub-Admin Operational Task Summary */
         <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-8">
            <h3 className="text-xl font-black text-gray-800 mb-4 flex items-center gap-2">🛠️ Sub-Admin Daily Operational Checklist</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                  <p className="text-xs font-black text-gray-500 uppercase">1. Land Inspections</p>
                  <p className="text-sm font-bold text-gray-800 mt-1">Verify 7/12 Land Documents in Sanand & Lilapur</p>
               </div>
               <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                  <p className="text-xs font-black text-gray-500 uppercase">2. Farmer Verifications</p>
                  <p className="text-sm font-bold text-gray-800 mt-1">Audit 5 new registered farmer profiles</p>
               </div>
               <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                  <p className="text-xs font-black text-gray-500 uppercase">3. Crop Listings</p>
                  <p className="text-sm font-bold text-gray-800 mt-1">Review market produce prices & photo quality</p>
               </div>
            </div>
         </div>
       )}

       <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-10">
             <Store size={150} />
          </div>
          <h3 className="text-2xl font-black mb-2 relative z-10">System Control Center</h3>
          <p className="text-gray-300 font-medium max-w-2xl relative z-10">
            {isSuper 
              ? 'You are logged in as Super Admin. You have total authority to create Sub-Admins, assign field tasks, approve large land deals, and manage platform finances.'
              : 'You are logged in as Operational Sub-Admin. Complete your assigned tasks, review farmer land documents, and submit inspection notes.'}
          </p>
       </div>
    </div>
  );
}

export default DashboardOverview;
