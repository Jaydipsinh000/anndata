import React from 'react';
import { Users, Wheat, Map, Store } from 'lucide-react';

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
          <StatCard title="Active Deals" value={stats?.activeDeals || 0} color="border-purple-500" icon={<Map className="text-purple-500" size={24} />} />
          <StatCard title="Completed Sales" value={stats?.completedSales || 0} color="border-teal-500" icon={<Store className="text-teal-500" size={24} />} />
       </div>

       <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black text-gray-800 mb-2">Welcome to your Control Center</h3>
          <p className="text-gray-500 font-medium">Use the sidebar to navigate through moderation workflows, confirm pending partnerships, or update task lists. All changes reflect globally immediately.</p>
       </div>
    </div>
  );
}

export default DashboardOverview;
