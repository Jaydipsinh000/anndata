import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useTranslation } from 'react-i18next';
import { Map, MapPin, Plus, Clock, XCircle, CheckCircle, FileText, Trash2, Award, Handshake, Landmark } from 'lucide-react';
import { translateText } from '../utils/translate';
import LandUploadForm from '../components/farmer/LandUploadForm';
import OfficialAgreementModal from '../components/farmer/OfficialAgreementModal';

function LandManagement() {
  const { t, i18n } = useTranslation();
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedAgreementLand, setSelectedAgreementLand] = useState(null);

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
        console.error(err);
        setLands([]);
        setLoading(false);
      });
  }, []);

  const deleteLand = async (id) => {
    const userInfoStr = localStorage.getItem('userInfo');
    if(!userInfoStr) return;
    const token = JSON.parse(userInfoStr).token;
    
    const previousLands = [...lands];
    setLands(lands.filter(l => l._id !== id));

    try {
      const res = await fetch(`/api/lands/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if(!res.ok) throw new Error('Failed to delete');
    } catch (err) {
      setLands(previousLands);
      console.error('Error deleting land:', err);
    }
  };

  // Helper date formatters
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(i18n.language === 'gu' ? 'gu-IN' : (i18n.language === 'hi' ? 'hi-IN' : 'en-IN'), { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  const getStartDate = (land) => {
    if (land.contract_start_date) return formatDate(land.contract_start_date);
    if (land.createdAt) return formatDate(land.createdAt);
    return formatDate(new Date());
  };

  const getEndDate = (land) => {
    if (land.contract_end_date) return formatDate(land.contract_end_date);
    const start = land.contract_start_date ? new Date(land.contract_start_date) : (land.createdAt ? new Date(land.createdAt) : new Date());
    const years = land.lease_duration_years || 5;
    const end = new Date(start);
    end.setFullYear(end.getFullYear() + years);
    return formatDate(end);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-20 selection:bg-[#006400] selection:text-white">
      <Navbar />
      
      {/* Hero Header */}
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
                        {t('land.for')} {translateText(land.purpose)}
                     </span>
                  </div>
                </div>

                <div className="p-8 flex-grow flex flex-col relative z-10 bg-white">
                   {/* PENDING REVIEW */}
                   {land.status === 'pending' && (
                      <div className="bg-orange-50 border border-orange-100 text-orange-700 p-5 rounded-2xl mb-4 flex items-start gap-4">
                         <Clock className="shrink-0 mt-0.5" />
                         <div>
                            <p className="font-bold">{t('land.pendingReview')}</p>
                            <p className="text-sm font-medium opacity-80 mt-1">{t('land.pendingMsg')}</p>
                         </div>
                      </div>
                   )}

                   {/* REJECTED */}
                   {land.status === 'rejected' && (
                      <div className="bg-red-50 border border-red-100 text-red-700 p-5 rounded-2xl mb-4 flex flex-col gap-3">
                         <div className="flex items-start gap-4">
                           <XCircle className="shrink-0 mt-0.5" />
                           <div className="flex-1">
                              <p className="font-bold">{t('land.proposalDeclined')}</p>
                              <p className="text-sm font-medium bg-red-100/50 p-2 mt-2 rounded border border-red-200">{translateText(land.admin_message) || "Your proposal did not meet current requirements."}</p>
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

                   {/* 1. CORPORATE LEASE ACTIVE CARD (RENT) */}
                   {land.status === 'rented_to_company' && (
                      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 border-2 border-indigo-400/80 text-white p-6 rounded-3xl mb-4 shadow-xl relative overflow-hidden group/card">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
                         
                         <div className="flex items-center justify-between mb-4 border-b border-indigo-700/50 pb-3">
                            <div className="flex items-center gap-2 text-indigo-300 font-black text-xs uppercase tracking-widest">
                               <Award size={18} className="shrink-0 text-indigo-400" />
                               <span>Corporate Lease Active</span>
                            </div>
                            <span className="bg-indigo-400/20 text-indigo-200 border border-indigo-400/40 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                               Verified Lease
                            </span>
                         </div>

                         <div className="space-y-3">
                            <div className="bg-white/10 p-3 rounded-2xl border border-white/10 flex justify-between items-center text-xs">
                               <div>
                                  <span className="text-indigo-200 font-bold block text-[9px] uppercase tracking-wider">Start Date</span>
                                  <span className="font-extrabold text-white text-sm">{getStartDate(land)}</span>
                               </div>
                               <div className="text-right">
                                  <span className="text-indigo-200 font-bold block text-[9px] uppercase tracking-wider">End Date</span>
                                  <span className="font-extrabold text-indigo-300 text-sm">{getEndDate(land)}</span>
                               </div>
                            </div>

                            <div className="bg-white/5 p-3 rounded-2xl border border-white/10 flex justify-between items-center text-xs">
                               <span className="text-indigo-200 font-bold">Payout Schedule:</span>
                               <span className="font-black text-emerald-400 capitalize">{translateText(land.payout_frequency || 'Yearly')}</span>
                            </div>

                            <button 
                              onClick={() => setSelectedAgreementLand(land)}
                              className="w-full mt-2 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer"
                            >
                               <FileText size={16} /> View Corporate Lease Deed (લીઝ કરાર જુઓ)
                            </button>
                         </div>
                      </div>
                   )}

                   {/* 2. CORPORATE PARTNERSHIP ACTIVE CARD */}
                   {land.status === 'partnership_active' && (
                      <div className="bg-gradient-to-br from-emerald-950 via-teal-950 to-emerald-900 border-2 border-emerald-400/80 text-white p-6 rounded-3xl mb-4 shadow-xl relative overflow-hidden">
                         <div className="flex items-center justify-between mb-4 border-b border-emerald-700/50 pb-3">
                            <div className="flex items-center gap-2 text-emerald-300 font-black text-xs uppercase tracking-widest">
                               <Handshake size={18} className="shrink-0 text-emerald-400" />
                               <span>Joint Venture Active</span>
                            </div>
                            <span className="bg-emerald-400/20 text-emerald-200 border border-emerald-400/40 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                               50-50 Partnership
                            </span>
                         </div>

                         <div className="space-y-3">
                            <div className="bg-white/10 p-3 rounded-2xl border border-white/10 flex justify-between items-center text-xs">
                               <div>
                                  <span className="text-emerald-200 font-bold block text-[9px] uppercase tracking-wider">Venture Term</span>
                                  <span className="font-extrabold text-white text-sm">{getStartDate(land)} - {getEndDate(land)}</span>
                               </div>
                            </div>

                            <div className="bg-white/5 p-3 rounded-2xl border border-white/10 flex justify-between items-center text-xs">
                               <span className="text-emerald-200 font-bold">Profit Sharing:</span>
                               <span className="font-black text-amber-300">{land.profit_sharing_ratio || '50-50 Split'}</span>
                            </div>

                            <button 
                              onClick={() => setSelectedAgreementLand(land)}
                              className="w-full mt-2 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
                            >
                               <FileText size={16} /> View Partnership Contract (ભાગીદારી કરાર જુઓ)
                            </button>
                         </div>
                      </div>
                   )}

                   {/* 3. SOLD CARD */}
                   {land.status === 'sold' && (
                      <div className="bg-gradient-to-br from-amber-950 via-stone-900 to-amber-900 border-2 border-amber-500/80 text-white p-6 rounded-3xl mb-4 shadow-xl relative overflow-hidden">
                         <div className="flex items-center justify-between mb-4 border-b border-amber-700/50 pb-3">
                            <div className="flex items-center gap-2 text-amber-300 font-black text-xs uppercase tracking-widest">
                               <Landmark size={18} className="shrink-0 text-amber-400" />
                               <span>Property Transferred</span>
                            </div>
                            <span className="bg-amber-400/20 text-amber-200 border border-amber-400/40 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                               Title Deed Sold
                            </span>
                         </div>

                         <div className="space-y-3">
                            <div className="bg-white/10 p-3 rounded-2xl border border-white/10 flex justify-between items-center text-xs">
                               <span className="text-amber-200 font-bold">Transfer Date:</span>
                               <span className="font-black text-white">{getStartDate(land)}</span>
                            </div>

                            <button 
                              onClick={() => setSelectedAgreementLand(land)}
                              className="w-full mt-2 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
                            >
                               <FileText size={16} /> View Title Transfer Deed (વેચાણ પત્ર જુઓ)
                            </button>
                         </div>
                      </div>
                   )}

                   <div className="mt-auto space-y-3 pt-6 border-t border-dashed border-gray-200">
                      <div className="flex justify-between items-center text-sm font-bold">
                         <span className="text-gray-400">{land.purpose === 'partnership' ? 'Partnership Capital' : (land.purpose === 'sell' ? 'Asking Price' : 'Annual Rent')}</span>
                         <span className="text-[#006400] text-lg font-black">₹ {land.price.toLocaleString()}</span>
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

      {/* ULTRA PROFESSIONAL MULTILINGUAL AGREEMENT CERTIFICATE MODAL */}
      <OfficialAgreementModal 
        land={selectedAgreementLand} 
        onClose={() => setSelectedAgreementLand(null)} 
      />

    </div>
  );
}

export default LandManagement;
