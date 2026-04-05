import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, MapPin, Leaf, ShieldCheck, Handshake, UploadCloud, CheckCircle2 } from 'lucide-react';

function LandUploadForm({ isOpen, onClose, onSuccess }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    area_value: '',
    location: '',
    mapUrl: '',
    
    // Quality
    soil_type: '',
    water_source: 'none',
    irrigation_system: 'none',
    electricity: false,
    
    // Privacy Verification
    images: [],
    video: null,
    otp_verified: false,
    self_declared: false,
    
    // Purpose
    purpose: 'lease',
    price: '',
    lease_duration_years: 5,
    extendable: false,
    payout_frequency: 'half-yearly',
    negotiable: true,
    profit_sharing_ratio: '50/50',
    farmer_contribution: 'land_only',
    partnership_notes: ''
  });

  if (!isOpen) return null;

  const nextStep = () => {
    setError(null);
    if (step === 1) {
      if (!formData.area_value || !formData.location) {
        return setError('Area and Location are required.');
      }
    }
    if (step === 2) {
      if (!formData.soil_type) return setError('Please select a soil type.');
    }
    if (step === 3) {
      if (!formData.self_declared) return setError('You must check the self-declaration box.');
      if (!formData.otp_verified) return setError('Missing mobile verification.');
      if (formData.images.length === 0) return setError('At least one image is required for verification.');
    }
    setStep(s => s + 1);
  };

  const handleMediaUpload = async (e) => {
    const files = e.target.files;
    if(!files || files.length === 0) return;
    
    const formDataUpload = new FormData();
    for (let i = 0; i < files.length; i++) {
       formDataUpload.append('media', files[i]);
    }

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload
      });
      const data = await res.json();
      if(res.ok) {
        setFormData(prev => ({ ...prev, images: [...prev.images, ...data.paths] }));
      } else {
        setError(data.message || 'Error uploading files');
      }
    } catch(err) {
      setError('Upload failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const payload = {
         ...formData,
         area_in_acres: Number(formData.area_value),
         price: Number(formData.price || 0),
         owner_type: 'farmer',
         map_pin: { url: formData.mapUrl },
         privacy_verified: formData.otp_verified && formData.self_declared
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
        setStep(1); // reset
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
      <div className="absolute inset-0 bg-[#004d00]/40 backdrop-blur-[8px]" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-[scaleIn_0.3s_ease-out]">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-20">
           <X size={24} className="text-gray-600" />
        </button>

        {/* Stepper Header */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 border-b border-gray-200 shrink-0">
           <h2 className="text-3xl font-extrabold text-[#1b431b] mb-6">Secure Land Listing</h2>
           <div className="flex items-center justify-between relative relative z-10 before:absolute before:top-1/2 before:-translate-y-1/2 before:w-full before:h-1 before:bg-gray-200 before:-z-10">
             {[
               { num: 1, icon: <MapPin size={20}/>, label: 'Basic Info' },
               { num: 2, icon: <Leaf size={20}/>, label: 'Quality' },
               { num: 3, icon: <ShieldCheck size={20}/>, label: 'Verification' },
               { num: 4, icon: <Handshake size={20}/>, label: 'Purpose' }
             ].map((s) => (
                <div key={s.num} className="flex flex-col items-center gap-2">
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-sm ${step >= s.num ? 'bg-[#006400] text-white' : 'bg-white text-gray-400 border border-gray-200'}`}>
                      {s.icon}
                   </div>
                   <span className={`text-[10px] font-bold uppercase tracking-widest ${step >= s.num ? 'text-[#006400]' : 'text-gray-400'}`}>{s.label}</span>
                </div>
             ))}
           </div>
        </div>

        {/* Form Body */}
        <div className="p-8 overflow-y-auto flex-grow bg-white">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-bold border border-red-100 flex items-center gap-2">
              <X className="shrink-0" /> {error}
            </div>
          )}

          <div className="space-y-6">
            
            {/* STEP 1: Basic */}
            {step === 1 && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-[fadeIn_0.3s_ease]">
                 <div className="col-span-1 md:col-span-2">
                    <label className="font-bold text-[#1b431b] mb-2 text-xs uppercase tracking-widest block">Land Title (Optional)</label>
                    <input type="text" placeholder="e.g. Fertile Mango Farm near River" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#006400]" />
                 </div>
                 <div>
                    <label className="font-bold text-[#1b431b] mb-2 text-xs uppercase tracking-widest block">Area (Acres)*</label>
                    <input type="number" step="0.1" value={formData.area_value} onChange={e => setFormData({...formData, area_value: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#006400]" />
                 </div>
                 <div>
                    <label className="font-bold text-[#1b431b] mb-2 text-xs uppercase tracking-widest block">Location (Village, District)*</label>
                    <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#006400]" />
                 </div>
                 <div className="col-span-1 md:col-span-2">
                    <label className="font-bold text-[#1b431b] mb-2 text-xs uppercase tracking-widest block">Google Maps Link</label>
                    <input type="url" placeholder="https://maps.google.com/..." value={formData.mapUrl} onChange={e => setFormData({...formData, mapUrl: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#006400]" />
                    <p className="text-xs text-gray-400 mt-2 font-medium">Adding a map link drastically increases buyer trust.</p>
                 </div>
               </div>
            )}

            {/* STEP 2: Quality */}
            {step === 2 && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-[fadeIn_0.3s_ease]">
                 <div>
                    <label className="font-bold text-[#1b431b] mb-2 text-xs uppercase tracking-widest block">Soil Type*</label>
                    <select value={formData.soil_type} onChange={e => setFormData({...formData, soil_type: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#006400]">
                       <option value="">Select Soil Type</option>
                       <option value="black">Black Soil</option>
                       <option value="red">Red Soil</option>
                       <option value="alluvial">Alluvial</option>
                       <option value="sandy">Sandy</option>
                       <option value="clay">Clay</option>
                    </select>
                 </div>
                 <div>
                    <label className="font-bold text-[#1b431b] mb-2 text-xs uppercase tracking-widest block">Water Source</label>
                    <select value={formData.water_source} onChange={e => setFormData({...formData, water_source: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#006400]">
                       <option value="none">None</option>
                       <option value="borewell">Borewell</option>
                       <option value="canal">Canal</option>
                       <option value="rain-fed">Rain-fed</option>
                    </select>
                 </div>
                 <div>
                    <label className="font-bold text-[#1b431b] mb-2 text-xs uppercase tracking-widest block">Irrigation System</label>
                    <select value={formData.irrigation_system} onChange={e => setFormData({...formData, irrigation_system: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#006400]">
                       <option value="none">None</option>
                       <option value="drip">Drip Irrigation</option>
                       <option value="sprinkler">Sprinkler</option>
                       <option value="manual">Manual/Flooding</option>
                    </select>
                 </div>
                 <div className="flex items-center mt-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={formData.electricity} onChange={e => setFormData({...formData, electricity: e.target.checked})} className="w-6 h-6 text-[#006400] rounded focus:ring-0 cursor-pointer" />
                      <span className="font-bold text-[#1b431b]">Electricity Available (3-Phase)</span>
                    </label>
                 </div>
               </div>
            )}

            {/* STEP 3: Privacy Verification */}
            {step === 3 && (
               <div className="space-y-6 animate-[fadeIn_0.3s_ease]">
                  <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl text-blue-800">
                     <p className="font-bold flex items-center gap-2 mb-2"><ShieldCheck className="shrink-0" /> Privacy First Verification</p>
                     <p className="text-sm font-medium">We do NOT ask for Aadhaar or sensitive land documents here. Just verify your mobile number and upload recent photos to build trust.</p>
                  </div>

                  <div className="bg-white border rounded-2xl p-6">
                     <div className="flex items-center justify-between mb-4">
                        <label className="font-bold text-gray-700">Mobile OTP Verification*</label>
                        {formData.otp_verified ? (
                           <span className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full text-xs flex items-center gap-1"><CheckCircle2 size={14}/> Verified</span>
                        ) : (
                           <button onClick={(e) => { e.preventDefault(); setFormData({...formData, otp_verified: true}) }} className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold">Request OTP</button>
                        )}
                     </div>
                     <p className="text-xs text-gray-400">Clicking 'Request OTP' will auto-verify for this demo.</p>
                  </div>

                  <div className="bg-white border rounded-2xl p-6">
                     <label className="font-bold text-gray-700 mb-4 block">Visual Proof (Upload 3-5 Photos)*</label>
                     <div className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-colors text-center cursor-pointer relative">
                         <input type="file" multiple accept="image/*,video/mp4" onChange={handleMediaUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                         <UploadCloud className="mx-auto text-gray-400 mb-2" size={32} />
                         <p className="font-bold text-gray-600">Click or Drag media here</p>
                         <p className="text-xs mt-1 text-gray-400">Images help buyers verify your land remotely.</p>
                     </div>
                     {formData.images.length > 0 && (
                        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                           {formData.images.map((img, idx) => (
                             <img key={idx} src={img} alt="Uploaded" className="h-16 w-16 object-cover rounded-lg border border-gray-200" />
                           ))}
                        </div>
                     )}
                  </div>

                  <label className="flex items-start gap-4 p-4 border border-green-200 bg-green-50 rounded-2xl cursor-pointer">
                      <input type="checkbox" checked={formData.self_declared} onChange={e => setFormData({...formData, self_declared: e.target.checked})} className="w-6 h-6 mt-0.5 text-[#006400] rounded focus:ring-0 cursor-pointer" />
                      <div>
                        <span className="font-bold text-[#006400] block mb-1">Owner Declaration*</span>
                        <span className="text-xs text-[#006400] font-medium block">I solemnly declare that I own or hold valid legal rights to lease/sell this parcel of land.</span>
                      </div>
                  </label>
               </div>
            )}

            {/* STEP 4: Purpose */}
            {step === 4 && (
               <div className="animate-[fadeIn_0.3s_ease]">
                  <div className="flex bg-gray-100 p-2 rounded-2xl mb-8">
                    {[
                      {id: 'lease', label: 'Rent Out'}, 
                      {id: 'sell', label: 'Sell Property'}, 
                      {id: 'partnership', label: 'Corporate Partnership'}
                    ].map(p => (
                       <button 
                         key={p.id} onClick={(e) => { e.preventDefault(); setFormData({...formData, purpose: p.id}); }}
                         className={`flex-1 text-center py-3 rounded-xl font-bold transition-all text-sm ${formData.purpose === p.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                       >
                          {p.label}
                       </button>
                    ))}
                  </div>

                  {formData.purpose === 'lease' && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                           <label className="font-bold text-gray-700 mb-2 text-xs uppercase tracking-widest block">Expected Rent / Year (₹)*</label>
                           <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#006400]" />
                        </div>
                        <div>
                           <label className="font-bold text-gray-700 mb-2 text-xs uppercase tracking-widest block">Lease Duration (Years)</label>
                           <input type="number" value={formData.lease_duration_years} onChange={e => setFormData({...formData, lease_duration_years: Number(e.target.value)})} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#006400]" />
                        </div>
                        <div className="flex items-center mt-4">
                           <label className="flex items-center gap-3 cursor-pointer">
                             <input type="checkbox" checked={formData.extendable} onChange={e => setFormData({...formData, extendable: e.target.checked})} className="w-5 h-5 text-[#006400] rounded focus:ring-0 cursor-pointer" />
                             <span className="font-bold text-gray-700 text-sm">Contract is Extendable</span>
                           </label>
                        </div>
                     </div>
                  )}

                  {formData.purpose === 'sell' && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                           <label className="font-bold text-gray-700 mb-2 text-xs uppercase tracking-widest block">Total Asking Price (₹)*</label>
                           <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#006400]" />
                        </div>
                        <div className="flex items-center mt-4 md:mt-8">
                           <label className="flex items-center gap-3 cursor-pointer">
                             <input type="checkbox" checked={formData.negotiable} onChange={e => setFormData({...formData, negotiable: e.target.checked})} className="w-5 h-5 text-[#006400] rounded focus:ring-0 cursor-pointer" />
                             <span className="font-bold text-gray-700 text-sm">Price is Negotiable</span>
                           </label>
                        </div>
                     </div>
                  )}

                  {formData.purpose === 'partnership' && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                           <label className="font-bold text-gray-700 mb-2 text-xs uppercase tracking-widest block">Profit Model</label>
                           <select value={formData.profit_sharing_ratio} onChange={e => setFormData({...formData, profit_sharing_ratio: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#006400]">
                              <option value="50/50">50-50 Split</option>
                              <option value="Custom">Custom Negotiation</option>
                           </select>
                        </div>
                        <div>
                           <label className="font-bold text-gray-700 mb-2 text-xs uppercase tracking-widest block">Your Contribution</label>
                           <select value={formData.farmer_contribution} onChange={e => setFormData({...formData, farmer_contribution: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#006400]">
                              <option value="land_only">Provide Land Only</option>
                              <option value="land_labor">Land & Manual Labor</option>
                           </select>
                        </div>
                        <div className="col-span-1 md:col-span-2">
                           <label className="font-bold text-gray-700 mb-2 text-xs uppercase tracking-widest block">Partnership Notes</label>
                           <textarea rows="3" value={formData.partnership_notes} onChange={e => setFormData({...formData, partnership_notes: e.target.value})} placeholder="Any specific requirements regarding crops or investment..." className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#006400]"></textarea>
                        </div>
                     </div>
                  )}

               </div>
            )}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="bg-gray-50 p-6 border-t border-gray-200 flex justify-between items-center shrink-0">
           {step > 1 ? (
              <button type="button" onClick={() => setStep(s => s - 1)} className="px-6 py-3 font-bold text-gray-500 hover:text-gray-800 transition-colors">
                Back
              </button>
           ) : <div/>}

           {step < 4 ? (
              <button type="button" onClick={nextStep} className="bg-[#1b431b] text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-[#004d00] transition-colors">
                Next Step
              </button>
           ) : (
              <button type="button" disabled={loading} onClick={handleSubmit} className="bg-[#006400] text-white px-8 py-3 rounded-xl font-bold shadow-[0_10px_20px_rgba(0,100,0,0.2)] hover:bg-[#228b22] hover:-translate-y-1 transition-all disabled:opacity-50">
                {loading ? 'Submitting secure claim...' : 'Submit Final Application'}
              </button>
           )}
        </div>

      </div>
    </div>
  );
}

export default LandUploadForm;
