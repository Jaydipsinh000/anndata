import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, MapPin, Leaf, ShieldCheck, Handshake, UploadCloud, CheckCircle2, Loader2, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

function LandUploadForm({ isOpen, onClose, onSuccess }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    area_value: '',
    location: '',
    landmark: '',
    
    // Quality
    soil_type: 'black',
    water_source: 'borewell',
    irrigation_system: 'drip',
    electricity: true,
    
    // Media & Verification
    images: [],
    self_declared: true,
    
    // Purpose
    purpose: 'lease',
    price: '',
    lease_duration_years: 5,
    extendable: true,
    payout_frequency: 'yearly',
    negotiable: true,
    profit_sharing_ratio: '50/50',
    farmer_contribution: 'land_only',
    partnership_notes: ''
  });

  if (!isOpen) return null;

  const nextStep = () => {
    setError(null);
    if (step === 1) {
      if (!formData.area_value || Number(formData.area_value) <= 0) {
        return setError(t('landForm.errArea', 'Please enter valid land area in acres.'));
      }
      if (!formData.location || !formData.location.trim()) {
        return setError(t('landForm.errLocation', 'Please enter location (Village / District).'));
      }
    }
    setStep(2);
  };

  const handleMediaUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const formDataUpload = new FormData();
    for (let i = 0; i < files.length; i++) {
       formDataUpload.append('media', files[i]);
    }

    const toastId = toast.loading('Uploading photos...');
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload
      });
      const data = await res.json();
      if (res.ok && data.paths) {
        setFormData(prev => ({ ...prev, images: [...prev.images, ...data.paths] }));
        toast.success('Photos attached!', { id: toastId });
      } else {
        toast.error('Could not upload photo', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error('Upload failed', { id: toastId });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.price || Number(formData.price) <= 0) {
      return setError(t('landForm.errPrice', 'Please enter expected price / rent amount.'));
    }

    setLoading(true);
    setError(null);

    try {
      const userInfoStr = localStorage.getItem('userInfo');
      if (!userInfoStr) return setError("Please login to list property");
      const userInfo = JSON.parse(userInfoStr);

      // Default high quality farm fallback image if user uploaded no photo
      const defaultFarmImage = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800";
      const finalImages = formData.images.length > 0 ? formData.images : [defaultFarmImage];

      const payload = {
         title: formData.title.trim() || `Agriculture Land (${formData.area_value} Acres) in ${formData.location}`,
         area_in_acres: Number(formData.area_value),
         location: formData.location.trim(),
         map_pin: { url: formData.landmark ? `Landmark: ${formData.landmark}` : '' },
         soil_type: formData.soil_type,
         water_source: formData.water_source,
         irrigation_system: formData.irrigation_system,
         electricity: formData.electricity,
         images: finalImages,
         privacy_verified: true,
         purpose: formData.purpose,
         price: Number(formData.price),
         lease_duration_years: Number(formData.lease_duration_years || 5),
         extendable: formData.extendable,
         payout_frequency: formData.payout_frequency,
         negotiable: formData.negotiable,
         profit_sharing_ratio: formData.profit_sharing_ratio,
         farmer_contribution: formData.farmer_contribution,
         partnership_notes: formData.partnership_notes,
         owner_type: 'farmer'
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
        toast.success(t('landForm.successMsg', 'Property posted successfully!'));
        onSuccess(data);
        onClose();
        setStep(1);
      } else {
        setError(data.message || 'Failed to list land');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#004d00]/50 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-[scaleIn_0.2s_ease-out]">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors z-20">
           <X size={22} />
        </button>

        {/* Form Header */}
        <div className="bg-gradient-to-r from-[#004d00] to-[#2ecc71] p-6 md:p-8 text-white shrink-0 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
           <h2 className="text-2xl md:text-3xl font-black mb-1 relative z-10">{t('landForm.title', 'Post Land Property')}</h2>
           <p className="text-green-100 text-xs md:text-sm font-medium relative z-10">{t('landForm.subtitle', 'List your land for rent, sale, or corporate partnership.')}</p>
           
           {/* Step Indicator */}
           <div className="flex gap-3 mt-4 relative z-10">
             <div className={`flex-1 h-2 rounded-full transition-all ${step === 1 ? 'bg-white' : 'bg-white/40'}`}></div>
             <div className={`flex-1 h-2 rounded-full transition-all ${step === 2 ? 'bg-white' : 'bg-white/40'}`}></div>
           </div>
        </div>

        {/* Form Content Body */}
        <div className="p-6 md:p-8 overflow-y-auto flex-grow bg-white">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 font-bold border border-red-200 text-sm flex items-center gap-2 animate-fadeIn">
              <X className="shrink-0" size={18} /> {error}
            </div>
          )}

          {step === 1 ? (
             /* STEP 1: Basic & Land Quality Details */
             <div className="space-y-5 animate-fadeIn">
               <h3 className="text-lg font-black text-gray-800 border-b border-gray-100 pb-2 flex items-center gap-2">
                 <MapPin className="text-[#006400]" size={20}/> 1. {t('landForm.basicSection', 'Land & Location Details')}
               </h3>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="font-bold text-gray-700 mb-1.5 text-xs uppercase tracking-wider block">{t('landForm.areaLabel', 'Area in Acres')} *</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      placeholder="e.g. 5.5" 
                      value={formData.area_value} 
                      onChange={e => setFormData({...formData, area_value: e.target.value})} 
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-gray-800 focus:outline-none focus:border-[#006400] text-sm" 
                    />
                 </div>

                 <div>
                    <label className="font-bold text-gray-700 mb-1.5 text-xs uppercase tracking-wider block">{t('landForm.locationLabel', 'Village / City & District')} *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Bardoli, Surat" 
                      value={formData.location} 
                      onChange={e => setFormData({...formData, location: e.target.value})} 
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-gray-800 focus:outline-none focus:border-[#006400] text-sm" 
                    />
                 </div>
               </div>

               <div>
                  <label className="font-bold text-gray-700 mb-1.5 text-xs uppercase tracking-wider block">{t('landForm.titleLabel', 'Farm Title / Name (Optional)')}</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Fertile Mango & Sugarcane Farm" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-medium text-gray-800 focus:outline-none focus:border-[#006400] text-sm" 
                  />
               </div>

               {/* Quality & Facilities */}
               <h3 className="text-lg font-black text-gray-800 border-b border-gray-100 pb-2 pt-2 flex items-center gap-2">
                 <Leaf className="text-[#006400]" size={20}/> {t('landForm.qualitySection', 'Water & Soil Facilities')}
               </h3>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div>
                    <label className="font-bold text-gray-700 mb-1 text-xs uppercase tracking-wider block">{t('landForm.soilLabel', 'Soil Type')}</label>
                    <select 
                      value={formData.soil_type} 
                      onChange={e => setFormData({...formData, soil_type: e.target.value})} 
                      className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-gray-700 focus:outline-none focus:border-[#006400] text-xs"
                    >
                       <option value="black">Black Soil (કાળી માટી)</option>
                       <option value="red">Red Soil (લાલ માટી)</option>
                       <option value="alluvial">Alluvial (ગોરાડુ માટી)</option>
                       <option value="sandy">Sandy (રેતાળ માટી)</option>
                       <option value="clay">Clay (માટીયા)</option>
                       <option value="medium">Medium Soil (મધ્યમ)</option>
                    </select>
                 </div>

                 <div>
                    <label className="font-bold text-gray-700 mb-1 text-xs uppercase tracking-wider block">{t('landForm.waterLabel', 'Water Source')}</label>
                    <select 
                      value={formData.water_source} 
                      onChange={e => setFormData({...formData, water_source: e.target.value})} 
                      className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-gray-700 focus:outline-none focus:border-[#006400] text-xs"
                    >
                       <option value="borewell">Borewell (બોરવેલ)</option>
                       <option value="canal">Canal (નહેર)</option>
                       <option value="rain-fed">Rain-fed (વરસાદ આધારિત)</option>
                       <option value="none">None (કોઈ નહીં)</option>
                    </select>
                 </div>

                 <div>
                    <label className="font-bold text-gray-700 mb-1 text-xs uppercase tracking-wider block">{t('landForm.irrigationLabel', 'Irrigation')}</label>
                    <select 
                      value={formData.irrigation_system} 
                      onChange={e => setFormData({...formData, irrigation_system: e.target.value})} 
                      className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-gray-700 focus:outline-none focus:border-[#006400] text-xs"
                    >
                       <option value="drip">Drip (ટપક સિંચાઈ)</option>
                       <option value="sprinkler">Sprinkler (ફુવારા)</option>
                       <option value="manual">Manual (ધોરીયા)</option>
                       <option value="none">None (કોઈ નહીં)</option>
                    </select>
                 </div>
               </div>

               <label className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.electricity} 
                    onChange={e => setFormData({...formData, electricity: e.target.checked})} 
                    className="w-5 h-5 text-[#006400] rounded focus:ring-0 cursor-pointer" 
                  />
                  <span className="font-bold text-[#006400] text-sm">{t('landForm.electricityLabel', '3-Phase Electricity Available (લાઈટ જોડાણ)')}</span>
               </label>
             </div>
          ) : (
             /* STEP 2: Purpose, Pricing & Optional Photo Attachment */
             <div className="space-y-5 animate-fadeIn">
               <h3 className="text-lg font-black text-gray-800 border-b border-gray-100 pb-2 flex items-center gap-2">
                 <Handshake className="text-[#006400]" size={20}/> 2. {t('landForm.purposeSection', 'Listing Purpose & Pricing')}
               </h3>

               {/* Purpose Selection Tabs */}
               <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                 {[
                   { id: 'lease', label: t('landForm.rentTab', 'Rent Out (ભાડે)') }, 
                   { id: 'sell', label: t('landForm.sellTab', 'Sell (વેચવા)') }, 
                   { id: 'partnership', label: t('landForm.partnershipTab', 'Partnership (ભાગીદારી)') }
                 ].map(p => (
                    <button 
                      key={p.id} 
                      type="button"
                      onClick={() => setFormData({...formData, purpose: p.id})}
                      className={`flex-1 text-center py-3 rounded-xl font-extrabold transition-all text-xs md:text-sm ${formData.purpose === p.id ? 'bg-[#006400] text-white shadow-md' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                       {p.label}
                    </button>
                 ))}
               </div>

               {/* Pricing inputs depending on purpose */}
               <div className="bg-gray-50 border border-gray-200 p-5 rounded-2xl space-y-4">
                  {formData.purpose === 'lease' && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label className="font-bold text-gray-700 mb-1 text-xs uppercase tracking-wider block">{t('landForm.rentAmount', 'Expected Rent Amount (₹ / Year)')} *</label>
                           <input 
                             type="number" 
                             placeholder="e.g. 50000" 
                             value={formData.price} 
                             onChange={e => setFormData({...formData, price: e.target.value})} 
                             className="w-full p-4 bg-white border border-gray-200 rounded-2xl font-black text-gray-800 focus:outline-none focus:border-[#006400] text-sm" 
                           />
                        </div>
                        <div>
                           <label className="font-bold text-gray-700 mb-1 text-xs uppercase tracking-wider block">{t('landForm.leaseYears', 'Lease Duration (Years)')}</label>
                           <input 
                             type="number" 
                             value={formData.lease_duration_years} 
                             onChange={e => setFormData({...formData, lease_duration_years: e.target.value})} 
                             className="w-full p-4 bg-white border border-gray-200 rounded-2xl font-bold text-gray-800 focus:outline-none focus:border-[#006400] text-sm" 
                           />
                        </div>
                     </div>
                  )}

                  {formData.purpose === 'sell' && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label className="font-bold text-gray-700 mb-1 text-xs uppercase tracking-wider block">{t('landForm.totalPrice', 'Total Asking Price (₹)')} *</label>
                           <input 
                             type="number" 
                             placeholder="e.g. 2500000" 
                             value={formData.price} 
                             onChange={e => setFormData({...formData, price: e.target.value})} 
                             className="w-full p-4 bg-white border border-gray-200 rounded-2xl font-black text-gray-800 focus:outline-none focus:border-[#006400] text-sm" 
                           />
                        </div>
                        <div className="flex items-center mt-4">
                           <label className="flex items-center gap-3 cursor-pointer">
                             <input 
                               type="checkbox" 
                               checked={formData.negotiable} 
                               onChange={e => setFormData({...formData, negotiable: e.target.checked})} 
                               className="w-5 h-5 text-[#006400] rounded focus:ring-0 cursor-pointer" 
                             />
                             <span className="font-bold text-gray-700 text-sm">Price is Negotiable (કિંમતમાં ફેરફાર શક્ય)</span>
                           </label>
                        </div>
                     </div>
                  )}

                  {formData.purpose === 'partnership' && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label className="font-bold text-gray-700 mb-1 text-xs uppercase tracking-wider block">Estimated Investment / Year (₹) *</label>
                           <input 
                             type="number" 
                             placeholder="e.g. 100000" 
                             value={formData.price} 
                             onChange={e => setFormData({...formData, price: e.target.value})} 
                             className="w-full p-4 bg-white border border-gray-200 rounded-2xl font-black text-gray-800 focus:outline-none focus:border-[#006400] text-sm" 
                           />
                        </div>
                        <div>
                           <label className="font-bold text-gray-700 mb-1 text-xs uppercase tracking-wider block">Profit Sharing Model</label>
                           <select 
                             value={formData.profit_sharing_ratio} 
                             onChange={e => setFormData({...formData, profit_sharing_ratio: e.target.value})} 
                             className="w-full p-4 bg-white border border-gray-200 rounded-2xl font-bold text-gray-700 focus:outline-none focus:border-[#006400] text-sm"
                           >
                              <option value="50/50">50-50 Profit Split</option>
                              <option value="60/40">60-40 Split</option>
                              <option value="Custom">Custom Discussion</option>
                           </select>
                        </div>
                     </div>
                  )}
               </div>

               {/* Optional Farm Photo Upload (With auto fallback) */}
               <div>
                  <label className="font-bold text-gray-700 mb-2 text-xs uppercase tracking-wider block flex items-center justify-between">
                     <span>{t('landForm.photoUpload', 'Upload Land Photo (Optional)')}</span>
                     <span className="text-gray-400 font-normal text-xs">{t('landForm.optionalBadge', '(No photo? High quality farm image will be assigned automatically)')}</span>
                  </label>
                  
                  <div className="border-2 border-dashed border-gray-300 hover:border-[#006400] bg-gray-50 rounded-2xl p-6 text-center cursor-pointer relative transition-colors">
                     <input type="file" multiple accept="image/*" onChange={handleMediaUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                     <UploadCloud className="mx-auto text-[#006400] mb-2" size={32} />
                     <p className="font-bold text-gray-700 text-sm">{t('landForm.clickUpload', 'Click to Choose Farm Photos')}</p>
                  </div>

                  {formData.images.length > 0 && (
                     <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                        {formData.images.map((img, idx) => (
                          <img key={idx} src={img} alt="Uploaded Farm" className="h-16 w-16 object-cover rounded-xl border border-gray-200 shadow-sm" />
                        ))}
                     </div>
                  )}
               </div>

               {/* Single Click Declaration */}
               <label className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl cursor-pointer">
                   <input 
                     type="checkbox" 
                     checked={formData.self_declared} 
                     onChange={e => setFormData({...formData, self_declared: e.target.checked})} 
                     className="w-5 h-5 mt-0.5 text-[#006400] rounded focus:ring-0 cursor-pointer" 
                   />
                   <div>
                     <span className="font-bold text-[#006400] text-sm block">{t('landForm.declareTitle', 'Owner Self-Declaration & Mobile Verified')}</span>
                     <span className="text-xs text-[#006400] opacity-90 font-medium block">{t('landForm.declareBody', 'I certify that I am the owner or authorized representative of this agricultural property.')}</span>
                   </div>
               </label>
             </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="bg-gray-50 p-6 border-t border-gray-200 flex justify-between items-center shrink-0">
           {step > 1 ? (
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="px-6 py-3 font-bold text-gray-600 hover:text-gray-900 transition-colors text-sm"
              >
                ← {t('landForm.back', 'Back')}
              </button>
           ) : <div/>}

           {step === 1 ? (
              <button 
                type="button" 
                onClick={nextStep} 
                className="bg-[#006400] hover:bg-[#004d00] text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-green-700/20 transition-all text-sm"
              >
                {t('landForm.next', 'Next Step')} →
              </button>
           ) : (
              <button 
                type="button" 
                disabled={loading} 
                onClick={handleSubmit} 
                className="bg-gradient-to-r from-[#006400] to-[#2ecc71] hover:from-[#004d00] hover:to-[#27ae60] text-white px-8 py-3.5 rounded-2xl font-extrabold shadow-xl shadow-green-700/30 transition-all text-sm flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                   <><Loader2 className="animate-spin" size={18}/> {t('landForm.posting', 'Posting Property...')}</>
                ) : (
                   <><CheckCircle2 size={18}/> {t('landForm.submitBtn', 'Submit Property Listing')}</>
                )}
              </button>
           )}
        </div>
      </div>
    </div>
  );
}

export default LandUploadForm;
