import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { User, PhoneCall, MapPin, Search, Star, Briefcase, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

function Services() {
  const { t } = useTranslation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Quick Post modal state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [formData, setFormData] = useState({
    service_title: '', category: 'Labor', location: '', rate: '', rate_type: 'per day', description: '', contact_number: ''
  });

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePostService = async (e) => {
    e.preventDefault();
    if (!userInfo) return toast.error("Please login to post a service");

    const loadingToast = toast.loading('Posting service...');
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
        body: JSON.stringify({...formData, rate: Number(formData.rate)})
      });
      if (res.ok) {
        toast.success('Service Listed Successfully!', { id: loadingToast });
        setIsUploadOpen(false);
        fetchServices();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Failed to list service', { id: loadingToast });
      }
    } catch (e) {
      toast.error('Server error', { id: loadingToast });
    }
  };

  const filteredServices = services.filter(s => {
    if (categoryFilter !== 'All' && s.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-20">
      <Navbar />
      
      {/* Hero */}
      <div className="bg-[#0f172a] py-20 px-4 mb-10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <Briefcase size={48} className="text-blue-400 mx-auto mb-6" />
          <h2 className="text-white text-4xl md:text-5xl font-black mb-4">Agri-Services & Labour</h2>
          <p className="text-gray-400 text-lg font-medium max-w-2xl mx-auto">Hire local labor, transporters, and agricultural advisory services to elevate your farming operations.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-3xl shadow-sm border border-gray-100 mb-8 gap-4">
           <div className="flex gap-2 w-full md:w-auto bg-gray-100 p-1.5 rounded-2xl overflow-x-auto shrink-0">
             {['All', 'Labor', 'Transportation', 'Soil Testing', 'Veterinary', 'Advisory', 'Other'].map(cat => (
               <button 
                 key={cat}
                 onClick={() => setCategoryFilter(cat)} 
                 className={`px-5 py-2.5 rounded-xl font-bold transition-colors whitespace-nowrap ${categoryFilter === cat ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
               >
                 {cat}
               </button>
             ))}
           </div>
           
           <button onClick={() => {
              if(!userInfo) return toast.error("Please login to list your service");
              setIsUploadOpen(true);
           }} className="w-full md:w-auto bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-blue-700 transition-colors shadow-lg flex items-center justify-center gap-2">
             <Plus size={18} /> Offer a Service
           </button>
        </div>

        {/* Listings */}
        {loading ? (
           <div className="text-center py-20 font-bold text-gray-400 animate-pulse">Loading Services...</div>
        ) : filteredServices.length === 0 ? (
           <div className="bg-white rounded-[2rem] p-16 text-center shadow-sm border border-gray-100">
             <Briefcase className="mx-auto text-gray-300 mb-4" size={48}/>
             <h4 className="text-xl font-black text-gray-400">No Services found for "{categoryFilter}"</h4>
           </div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {filteredServices.map(service => (
               <div key={service._id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all group flex flex-col relative overflow-hidden">
                 {/* Top row */}
                 <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded mb-2 inline-block">{service.category}</span>
                      <h3 className="text-xl font-black text-gray-800 leading-tight">{service.service_title}</h3>
                    </div>
                    {service.provider_id?.trust_score && service.provider_id.trust_score >= 80 && (
                       <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold">
                         <Star size={12} className="fill-yellow-500 text-yellow-500"/> Pro
                       </span>
                    )}
                 </div>

                 <p className="text-gray-500 text-sm font-medium line-clamp-2 mb-6">{service.description || 'No description provided.'}</p>

                 <div className="space-y-3 mb-6 flex-grow">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="bg-gray-50 p-2 rounded-lg text-gray-400"><User size={16}/></div>
                      <span className="font-bold text-gray-700">{service.provider_id?.name || 'Local Provider'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="bg-gray-50 p-2 rounded-lg text-gray-400"><MapPin size={16}/></div>
                      <span className="font-bold text-gray-700">{service.location}</span>
                    </div>
                 </div>

                 <div className="pt-4 border-t border-gray-100 flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Service Rate</p>
                      <p className="text-xl font-black text-blue-700">₹{service.rate} <span className="text-xs text-gray-500 font-medium normal-case">/ {service.rate_type.replace('per ', '')}</span></p>
                    </div>
                 </div>

                 <a href={`tel:${service.contact_number || service.provider_id?.mobile}`} className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-md">
                   <PhoneCall size={18} /> Contact Provider
                 </a>
               </div>
             ))}
           </div>
        )}
      </div>

      {/* Upload/List Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-[2rem] w-full max-w-lg p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
              <h3 className="text-2xl font-black text-gray-800 mb-6">Offer a Service</h3>
              <form onSubmit={handlePostService} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Service Title</label>
                  <input required type="text" value={formData.service_title} onChange={e => setFormData({...formData, service_title: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500" placeholder="e.g. Tractor with Driver" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Category</label>
                     <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500">
                       {['Labor', 'Transportation', 'Soil Testing', 'Veterinary', 'Advisory', 'Other'].map(cat => <option key={cat}>{cat}</option>)}
                     </select>
                   </div>
                   <div>
                     <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Location / Area</label>
                     <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500" placeholder="e.g. Surat, Gujarat" />
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Rate (₹)</label>
                     <input required type="number" value={formData.rate} onChange={e => setFormData({...formData, rate: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500" placeholder="e.g. 500" />
                   </div>
                   <div>
                     <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Rate Type</label>
                     <select value={formData.rate_type} onChange={e => setFormData({...formData, rate_type: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500">
                       <option value="per hour">Per Hour</option>
                       <option value="per day">Per Day</option>
                       <option value="flat fee">Flat Fee</option>
                       <option value="per acre">Per Acre</option>
                     </select>
                   </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Contact Number (Optional)</label>
                  <input type="text" value={formData.contact_number} onChange={e => setFormData({...formData, contact_number: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500" placeholder="Defaults to your registered mobile" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Description</label>
                  <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 min-h-[100px]" placeholder="Describe your service..." />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition">Post Service</button>
                  <button type="button" onClick={() => setIsUploadOpen(false)} className="px-6 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition">Cancel</button>
                </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}

export default Services;
