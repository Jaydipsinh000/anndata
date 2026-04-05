import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

function LandUploadForm({ isOpen, onClose, onSuccess }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    area_value: '',
    area_unit: 'acres',
    location: '',
    soil_type: '',
    owner_type: 'farmer',
    purpose: 'lease',
    price: '',
    irrigation: 'tube-well',
    lease_duration_years: 7,
    payout_frequency: 'half-yearly',
    partnership_needs: [],
    profit_sharing_ratio: '50/50',
    partnership_duration: '1-season'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate partnership array if partnership
    if(formData.purpose === 'partnership' && formData.partnership_needs.length === 0) {
      setError('Please select at least one type of support required for partnership.');
      setLoading(false);
      return;
    }

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const payload = {
         ...formData,
         area_in_acres: Number(formData.area_value)
      };

      const res = await fetch('/api/lands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (res.ok) {
        onSuccess(data);
        onClose();
      } else {
        setError(data.message || 'Failed to list land');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#004d00]/30 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-[scaleIn_0.3s_ease-out]">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-10">
          <X size={24} className="text-gray-600" />
        </button>

        <div className="p-10">
          <div className="mb-8">
            <h2 className="text-4xl font-extrabold text-[#1b431b] mb-2">{t('landForm.title')}</h2>
            <p className="text-gray-500 font-medium text-lg">{t('landForm.subtitle')}</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-bold border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="col-span-1 md:col-span-2">
                 <label className="font-bold text-[#1b431b] mb-2 text-xs uppercase tracking-widest block">{t('landForm.purpose')}</label>
                 <div className="flex gap-4">
                    {[{id: 'lease', label: t('landForm.rent')}, {id: 'sale', label: t('landForm.sell')}, {id: 'partnership', label: t('landForm.partnership')}].map(p => (
                       <div 
                         key={p.id} 
                         onClick={() => setFormData({...formData, purpose: p.id})}
                         className={`flex-1 text-center py-4 rounded-2xl cursor-pointer font-black transition-all border-2 ${formData.purpose === p.id ? 'border-[#006400] bg-[#006400] text-white shadow-lg transform -translate-y-1' : 'border-gray-200 bg-white text-gray-400 hover:border-[#006400]/30 hover:text-[#006400]'}`}
                       >
                          {p.label}
                       </div>
                    ))}
                 </div>
                 
                 {formData.purpose === 'lease' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 bg-[#006400]/5 p-6 rounded-2xl border border-[#006400]/20 animate-[scaleIn_0.2s_ease-out]">
                       <div>
                          <label className="font-bold text-[#006400] mb-2 text-xs uppercase tracking-widest block">{t('landForm.leaseDuration')}</label>
                          <input 
                            type="number" min="5"
                            className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-[#006400] font-medium text-gray-700"
                            value={formData.lease_duration_years} onChange={e => setFormData({...formData, lease_duration_years: Number(e.target.value)})}
                          />
                       </div>
                       <div>
                          <label className="font-bold text-[#006400] mb-2 text-xs uppercase tracking-widest block">{t('landForm.payoutFreq')}</label>
                          <select 
                            className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-[#006400] font-medium text-gray-700"
                            value={formData.payout_frequency} onChange={e => setFormData({...formData, payout_frequency: e.target.value})}
                          >
                            <option value="half-yearly">{t('landForm.freqOptions.halfYearly')}</option>
                            <option value="yearly">{t('landForm.freqOptions.yearly')}</option>
                          </select>
                       </div>
                    </div>
                 )}

                 {formData.purpose === 'partnership' && (
                    <div className="mt-6 bg-[#FF9800]/5 p-6 rounded-2xl border border-[#FF9800]/20 animate-[scaleIn_0.2s_ease-out]">
                       
                       <div className="mb-6">
                         <label className="font-bold text-[#b26a00] mb-3 text-xs uppercase tracking-widest block">{t('landForm.partnershipNeeds')}</label>
                         <div className="grid grid-cols-2 gap-3">
                           {['tools', 'labor', 'finance', 'seeds'].map(need => (
                             <label key={need} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.partnership_needs.includes(need) ? 'bg-[#FF9800] border-[#FF9800] text-white shadow-md' : 'bg-white border-gray-200 text-gray-600 hover:border-[#FF9800]/40'}`}>
                               <input 
                                 type="checkbox" 
                                 className="hidden"
                                 checked={formData.partnership_needs.includes(need)}
                                 onChange={(e) => {
                                    if(e.target.checked) setFormData({...formData, partnership_needs: [...formData.partnership_needs, need]});
                                    else setFormData({...formData, partnership_needs: formData.partnership_needs.filter(n => n !== need)});
                                 }}
                               />
                               <span className="font-bold text-sm">{t(`landForm.needsOptions.${need}`)}</span>
                             </label>
                           ))}
                         </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div>
                              <label className="font-bold text-[#b26a00] mb-2 text-xs uppercase tracking-widest block">{t('landForm.partnershipDuration')}</label>
                              <select 
                                className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-[#FF9800] font-medium text-gray-700"
                                value={formData.partnership_duration} onChange={e => setFormData({...formData, partnership_duration: e.target.value})}
                              >
                                <option value="1-season">{t('landForm.durationSeason')}</option>
                                <option value="1-year">{t('landForm.durationYear')}</option>
                              </select>
                           </div>
                           <div>
                              <label className="font-bold text-[#b26a00] mb-2 text-xs uppercase tracking-widest block">{t('landForm.profitRatio')}</label>
                              <select 
                                className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-[#FF9800] font-medium text-gray-700"
                                value={formData.profit_sharing_ratio} onChange={e => setFormData({...formData, profit_sharing_ratio: e.target.value})}
                              >
                                <option value="50/50">{t('landForm.ratioFifty')}</option>
                              </select>
                           </div>
                       </div>

                    </div>
                 )}
              </div>

              <div>
                <label className="font-bold text-[#1b431b] mb-2 text-xs uppercase tracking-widest block">{t('landForm.area')}</label>
                <input 
                  type="number" required min="0.1" step="0.1"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#006400] focus:ring-1 focus:ring-[#006400] transition-all font-medium"
                  value={formData.area_value} onChange={e => setFormData({...formData, area_value: e.target.value})}
                />
              </div>

              <div>
                <label className="font-bold text-[#1b431b] mb-2 text-xs uppercase tracking-widest block">{t('landForm.price')}</label>
                <input 
                  type="number" required min="0" step="1"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#006400] focus:ring-1 focus:ring-[#006400] transition-all font-medium"
                  value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="font-bold text-[#1b431b] mb-2 text-xs uppercase tracking-widest block">{t('landForm.location')}</label>
                <input 
                  type="text" required placeholder="Ex. Rampur, Surat"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#006400] focus:ring-1 focus:ring-[#006400] transition-all font-medium"
                  value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
                />
              </div>

              <div>
                <label className="font-bold text-[#1b431b] mb-2 text-xs uppercase tracking-widest block">{t('landForm.soil')}</label>
                <select 
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#006400] focus:ring-1 focus:ring-[#006400] transition-all font-medium text-gray-700"
                  value={formData.soil_type} onChange={e => setFormData({...formData, soil_type: e.target.value})} required
                >
                  <option value="">{t('landForm.soilOptions.select')}</option>
                  <option value="black">{t('landForm.soilOptions.black')}</option>
                  <option value="red">{t('landForm.soilOptions.red')}</option>
                  <option value="alluvial">{t('landForm.soilOptions.alluvial')}</option>
                  <option value="laterite">{t('landForm.soilOptions.laterite')}</option>
                  <option value="arid">{t('landForm.soilOptions.arid')}</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#1b431b] mb-2 text-xs uppercase tracking-widest block">{t('landForm.irrigation')}</label>
                <select 
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#006400] focus:ring-1 focus:ring-[#006400] transition-all font-medium text-gray-700"
                  value={formData.irrigation} onChange={e => setFormData({...formData, irrigation: e.target.value})}
                >
                  <option value="tube-well">{t('landForm.waterOptions.tubeWell')}</option>
                  <option value="canal">{t('landForm.waterOptions.canal')}</option>
                  <option value="rain-fed">{t('landForm.waterOptions.rainFed')}</option>
                  <option value="none">{t('landForm.waterOptions.none')}</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#006400] text-white font-extrabold text-lg p-5 rounded-2xl hover:bg-[#228b22] transition-colors shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed mt-4 transform hover:-translate-y-1"
            >
              {loading ? t('landForm.submitting') : t('landForm.submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LandUploadForm;
