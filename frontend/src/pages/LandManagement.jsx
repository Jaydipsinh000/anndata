import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useTranslation } from 'react-i18next';
import { Map, MapPin, Plus, Clock, XCircle, CheckCircle, FileText, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LandUploadForm from '../components/farmer/LandUploadForm';

function LandManagement() {
  const { t } = useTranslation();
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  useEffect(() => {
    const userInfoStr = localStorage.getItem('userInfo');
    if(!userInfoStr) {
      setLands([]);
      setLoading(false);
      return;
    }
    const token = JSON.parse(userInfoStr).token;
    
    fetch('/api/lands', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setLands(data);
        else setLands([]);
        setLoading(false);
      })
      .catch(err => {
        setLands([]);
        setLoading(false);
      });
  }, []);

  const deleteLand = async (id) => {
    const userInfoStr = localStorage.getItem('userInfo');
    if(!userInfoStr) return;
    const token = JSON.parse(userInfoStr).token;
    
    // Optional optimistic UI update
    const previousLands = [...lands];
    setLands(lands.filter(l => l._id !== id));

    try {
      const res = await fetch(`/api/lands/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if(!res.ok) throw new Error('Failed to delete');
    } catch (err) {
      // Revert if failed
      setLands(previousLands);
      console.error('Error deleting land:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-20 selection:bg-[#006400] selection:text-white">
      <Navbar />
      
      <div className="bg-gradient-to-r from-[#004d00] to-[#2ecc71] py-16 px-4 mb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/background.png')] bg-cover mix-blend-overlay opacity-20"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="w-24 h-24 bg-white/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border-4 border-white/30 shadow-2xl backdrop-blur-md">
            <Map size={48} className="text-white" />
          </div>
          <h2 className="text-white text-4xl md:text-5xl font-extrabold mb-2 drop-shadow-md">
            {t('land.heroTitle')}
          </h2>
          <p className="text-green-100 font-medium text-lg max-w-2xl mx-auto">
            {t('land.heroSubtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="flex flex-col md:flex-row justify-end items-center bg-transparent mb-8">
             <button onClick={() => setIsUploadOpen(true)} className="bg-[#006400] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#228b22] transition-colors shadow-xl flex items-center gap-2 transform hover:-translate-y-1">
               <Plus size={20} /> {t('land.postProperty')}
             </button>
        </div>

        {loading ? (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-[#006400] rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">Loading...</p>
          </div>
        ) : lands.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
            <Map className="mx-auto text-gray-300 mb-4" size={64} />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{t('land.noProperties')}</h3>
            <p className="text-gray-500">{t('land.noPropertiesDesc')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lands.map(land => (
              <div key={land._id} className="bg-white rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden flex flex-col relative group">
                
                {land.status === 'rejected' && <div className="absolute inset-0 bg-red-500/5 mix-blend-overlay z-0 pointer-events-none"></div>}
                
                <div className="p-8 pb-4 relative z-10 border-b border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                       <h3 className="text-3xl font-black text-[#1b431b] mb-1">{land.area_in_acres} <span className="text-xl text-gray-400">Acres</span></h3>
                       <p className="flex items-center gap-1 text-gray-500 font-medium text-sm">
                         <MapPin size={16} className="text-[#006400]" /> {land.location}
                       </p>
                     </div>
                     <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-inner">
                        {t('land.for')} {land.purpose}
                     </span>
                  </div>
                </div>

                <div className="p-8 flex-grow flex flex-col relative z-10 bg-white">
                   {land.status === 'pending' && (
                      <div className="bg-orange-50 border border-orange-100 text-orange-700 p-5 rounded-2xl mb-4 flex items-start gap-4">
                         <Clock className="shrink-0 mt-0.5" />
                         <div>
                            <p className="font-bold">{t('land.pendingReview')}</p>
                            <p className="text-sm font-medium opacity-80 mt-1">{t('land.pendingMsg')}</p>
                         </div>
                      </div>
                   )}

                   {land.status === 'rejected' && (
                      <div className="bg-red-50 border border-red-100 text-red-700 p-5 rounded-2xl mb-4 flex flex-col gap-3">
                         <div className="flex items-start gap-4">
                           <XCircle className="shrink-0 mt-0.5" />
                           <div className="flex-1">
                              <p className="font-bold">{t('land.proposalDeclined')}</p>
                              <p className="text-sm font-medium bg-red-100/50 p-2 mt-2 rounded border border-red-200">{land.admin_message || "Your proposal did not meet current requirements."}</p>
                           </div>
                         </div>
                         <button 
                           onClick={() => deleteLand(land._id)}
                           className="self-end mt-2 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md transition-colors active:scale-95"
                         >
                           <Trash2 size={16} /> Acknowledge & Remove
                         </button>
                      </div>
                   )}

                   {land.status === 'rented_to_company' && (
                      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 text-indigo-900 p-6 rounded-3xl mb-4 shadow-sm relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
                         <div className="flex items-start gap-4 relative z-10">
                            <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg"><FileText className="shrink-0" size={24} /></div>
                            <div className="w-full">
                               <p className="font-bold uppercase tracking-widest text-[10px] text-indigo-500 mb-1">Corporate Lease Active</p>
                               <h4 className="font-black text-xl mb-4">Official Agreement</h4>
                               
                               <div className="space-y-4">
                                  <div className="flex justify-between items-end border-b border-indigo-200/50 pb-2">
                                    <div className="text-sm">
                                      <p className="text-indigo-400 font-bold uppercase tracking-widest text-[10px]">Start Date</p>
                                      <p className="font-bold">{land.contract_start_date ? new Date(land.contract_start_date).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                    <div className="text-right text-sm">
                                      <p className="text-indigo-400 font-bold uppercase tracking-widest text-[10px]">End Date</p>
                                      <p className="font-bold">{land.contract_end_date ? new Date(land.contract_end_date).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                  </div>

                                  <div className="flex justify-between items-center bg-white/60 p-3 rounded-xl border border-indigo-100">
                                     <span className="text-xs font-bold text-indigo-500 uppercase">Payout Schedule</span>
                                     <span className="font-black text-indigo-700 capitalize">{(land.payout_frequency || '').replace('-', ' ')}</span>
                                  </div>
                                  
                                  <p className="text-sm font-medium bg-white/70 p-4 rounded-xl border border-indigo-100 shadow-sm italic text-indigo-800">
                                    "{land.admin_message}"
                                  </p>
                               </div>
                            </div>
                         </div>
                      </div>
                   )}

                   {(land.status === 'partnership_active' || land.status === 'sold') && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-[#006400] p-5 rounded-2xl mb-4 flex items-start gap-4 shadow-inner">
                         <CheckCircle className="shrink-0 mt-0.5" />
                         <div>
                            <p className="font-bold uppercase tracking-widest text-[10px] bg-[#006400] text-white inline-block px-2 py-0.5 rounded-md mb-1">{land.status.replace(/_/g, ' ')}</p>
                            <p className="font-black text-lg mb-1">{t('land.dealFinalized')}</p>
                            <p className="text-sm font-bold bg-white/70 p-3 mt-2 rounded-xl border border-green-100 shadow-sm">{land.admin_message}</p>
                         </div>
                      </div>
                   )}

                   <div className="mt-auto space-y-3 pt-6 border-t border-dashed border-gray-200">
                      <div className="flex justify-between items-center text-sm font-bold">
                         <span className="text-gray-400">Asking Price</span>
                         <span className="text-[#006400]">₹ {land.price.toLocaleString()}</span>
                      </div>
                   </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <LandUploadForm 
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={(newLand) => setLands([newLand, ...lands])}
      />
    </div>
  );
}

export default LandManagement;
