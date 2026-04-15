import React from 'react';
import { Users, Wheat, Map, Store, TrendingUp, DollarSign } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

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

function DashboardOverview({ stats }) {
  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard title="Total Farmers" value={stats?.totalFarmers || 0} color="border-green-500" icon={<Users className="text-green-500" size={24} />} />
          <StatCard title="Total Buyers" value={stats?.totalBuyers || 0} color="border-blue-500" icon={<Users className="text-blue-500" size={24} />} />
          <StatCard title="Total Crops" value={stats?.totalCrops || 0} color="border-orange-500" icon={<Wheat className="text-orange-500" size={24} />} />
          <StatCard title="Total Deals" value={stats?.activeDeals || 0} color="border-purple-500" icon={<Map className="text-purple-500" size={24} />} />
          <StatCard title="Subscriptions" value={stats?.subscriptions || 12} color="border-teal-500" icon={<Store className="text-teal-500" size={24} />} />
       </div>

       {/* Analytics Section */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
         <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2"><TrendingUp className="text-green-600"/> Platform GMV (Gross Value)</h3>
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
            <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2"><DollarSign className="text-indigo-600"/> Subscription Revenue</h3>
            <div className="h-72 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={[
                   { name: 'Free', count: 120 }, { name: 'Pro', count: 45 }, { name: 'Enterprise', count: 5 }
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

       <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-10">
             <Store size={150} />
          </div>
          <h3 className="text-2xl font-black mb-2 relative z-10">System Control Center</h3>
          <p className="text-gray-300 font-medium max-w-2xl relative z-10">Use the sidebar to navigate through moderation workflows, confirm pending partnerships, or monitor the AI ecosystem. All platform-wide changes reflect globally immediately.</p>
       </div>
    </div>
  );
}

export default DashboardOverview;
