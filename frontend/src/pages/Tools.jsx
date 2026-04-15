import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Hammer, Truck, PenTool, Search, Tag, MapPin, CheckCircle, Plus } from 'lucide-react';
import ToolUploadForm from '../components/farmer/ToolUploadForm';
import { useTranslation } from 'react-i18next';
import ToolCalendarModal from '../components/ToolCalendarModal';

function Tools() {
  const { t } = useTranslation();
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState(null);

  useEffect(() => {
    fetch('/api/tools')
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) setTools(data);
        else setTools([]);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setTools([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-20 selection:bg-[#006400] selection:text-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-16 px-4 mb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/background.png')] bg-cover mix-blend-overlay opacity-20"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="w-24 h-24 bg-white/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border-4 border-white/20 shadow-xl backdrop-blur-md">
            <Hammer size={48} className="text-white" />
          </div>
          <h2 className="text-white text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg tracking-tight">
            {t('tools.title')}
          </h2>
          <p className="text-gray-300 font-medium text-lg max-w-2xl mx-auto leading-relaxed">
            {t('tools.subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-transparent mb-8 gap-4">
             <div className="relative w-full md:w-1/2">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search tools..." 
                  className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-gray-800 transition-all font-medium shadow-sm"
                />
             </div>
             <button onClick={() => setIsUploadOpen(true)} className="w-full md:w-auto bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-colors shadow-xl flex items-center justify-center gap-2 transform hover:-translate-y-1">
               <Plus size={20} /> {t('tools.listTool')}
             </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          </div>
        ) : tools.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
            <PenTool className="mx-auto text-gray-300 mb-4" size={64} />
            <h3 className="text-2xl font-bold text-gray-800">{t('tools.noTools')}</h3>
            <p className="text-gray-500 mt-2">{t('tools.noToolsDesc')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map(tool => (
              <div key={tool._id} className="bg-white rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden flex flex-col group">
                
                <div className="p-8 border-b border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                     <h3 className="text-2xl font-black text-gray-900 leading-tight">{tool.tool_name}</h3>
                     <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${tool.status === 'active' || tool.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {tool.status}
                     </span>
                  </div>
                  <p className="text-gray-400 font-bold text-sm tracking-widest uppercase">ID: {tool._id.substring(0, 8)}</p>
                </div>

                <div className="p-8 flex-grow flex flex-col bg-gray-50/50">
                   <div className="space-y-4 mb-8">
                     <div className="flex items-center gap-3">
                       <div className="bg-white p-2 rounded-xl shadow-sm"><CheckCircle size={18} className="text-green-600" /></div>
                       <p className="font-bold text-gray-700">{tool.stock} Units Total</p>
                     </div>
                     <div className="flex items-center gap-3">
                       <div className="bg-white p-2 rounded-xl shadow-sm"><MapPin size={18} className="text-blue-500" /></div>
                       <p className="font-bold text-gray-700">{tool.user_id?.name || 'Local Verified Owner'}</p>
                     </div>
                   </div>

                   <div className="mt-auto space-y-3">
                      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center group-hover:border-indigo-100 transition-colors">
                          <span className="text-sm font-bold text-gray-500">{t('tools.buy')}</span>
                          <span className="text-xl font-black text-gray-900">₹{tool.price ? tool.price.toLocaleString() : 'N/A'}</span>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center group-hover:border-indigo-100 transition-colors">
                          <span className="text-sm font-bold text-gray-500">{t('tools.rent')} <span className="text-xs font-medium text-gray-400 block">{tool.rent_duration || 'Daily'}</span></span>
                          <span className="text-xl font-black text-indigo-600">₹{tool.rent_price ? tool.rent_price.toLocaleString() : 'N/A'}</span>
                      </div>
                   </div>

                   <div className="mt-6 flex gap-3">
                      <button onClick={() => setCheckoutItem({...tool, _tradeType: 'Buy'})} className="flex-1 bg-gray-900 text-white font-bold py-3.5 rounded-xl hover:bg-black transition-colors">{t('tools.buy')}</button>
                      <button onClick={() => setCheckoutItem({...tool, _tradeType: 'Rent'})} className="flex-1 bg-indigo-50 text-indigo-600 font-bold py-3.5 rounded-xl hover:bg-indigo-100 transition-colors">{t('tools.rent')}</button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ToolUploadForm 
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={(newTool) => setTools([newTool, ...tools])}
      />

      {checkoutItem && <ToolCalendarModal item={checkoutItem} onClose={() => setCheckoutItem(null)} />}
    </div>
  );
}

export default Tools;
