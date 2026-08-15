import { useState, useEffect } from 'react';
import { MapPin, Phone, User, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import toast from 'react-hot-toast';

function CompleteProfileModal({ isOpen, onClose, onUpdated }) {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    village: '',
    taluka: '',
    district: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userInfoStr = localStorage.getItem('userInfo');
    if (userInfoStr) {
      const user = JSON.parse(userInfoStr);
      setFormData({
        name: user.name || '',
        mobile: user.mobile && user.mobile !== '9999999999' ? user.mobile : '',
        village: user.village || '',
        taluka: user.taluka || '',
        district: user.district || ''
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
    if (!token) return;

    if (!formData.mobile || formData.mobile.length < 10) {
      return toast.error('કૃપા કરીને ૧૦-અંકનો મોબાઈલ નંબર દાખલ કરો.');
    }
    if (!formData.village || !formData.taluka || !formData.district) {
      return toast.error('કૃપા કરીને ગામ, તાલુકો અને જિલ્લો દાખલ કરો.');
    }

    setLoading(true);
    const toastId = toast.loading('પ્રોફાઈલ અપડેટ થઈ રહી છે...');
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('userInfo', JSON.stringify(data));
        toast.success('પ્રોફાઈલ અને સરનામું સફળતાપૂર્વક અપડેટ થયું!', { id: toastId });
        if (onUpdated) onUpdated(data);
        onClose();
      } else {
        toast.error(data.message || 'અપડેટ નિષ્ફળ', { id: toastId });
      }
    } catch (err) {
      toast.error('સર્વર કનેક્શન ક્ષતિ', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn font-sans">
      <div className="bg-slate-900 text-slate-100 rounded-[2.5rem] p-6 md:p-8 max-w-lg w-full shadow-2xl border border-white/10 relative">
         
         <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2.5">
               <div className="w-10 h-10 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black">
                  <ShieldCheck size={22} />
               </div>
               <div>
                  <h3 className="font-extrabold text-base text-white">સરનામું અને મોબાઈલ વિગત પૂર્ણ કરો</h3>
                  <p className="text-[11px] text-slate-400 font-medium">Google Profile Complete (Village, Taluka & Contact)</p>
               </div>
            </div>
            {onClose && (
               <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800">
                  <X size={20} />
               </button>
            )}
         </div>

         <form onSubmit={handleSubmit} className="space-y-4">
            <div>
               <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                  <User size={14} className="text-emerald-400"/> તમારું પૂરું નામ
               </label>
               <input 
                 type="text" 
                 required
                 value={formData.name}
                 onChange={e => setFormData({...formData, name: e.target.value})}
                 className="w-full p-3.5 bg-slate-950 border border-white/10 rounded-xl text-white font-medium text-sm focus:outline-none focus:border-emerald-400"
               />
            </div>

            <div>
               <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                  <Phone size={14} className="text-emerald-400"/> ૧૦-અંકનો સ્માર્ટ મોબાઈલ નંબર (+91)
               </label>
               <input 
                 type="tel" 
                 required
                 maxLength="10"
                 placeholder="98765 43210"
                 value={formData.mobile}
                 onChange={e => setFormData({...formData, mobile: e.target.value.replace(/\D/g,'')})}
                 className="w-full p-3.5 bg-slate-950 border border-white/10 rounded-xl text-white font-mono font-bold text-sm focus:outline-none focus:border-emerald-400"
               />
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/10 space-y-3">
               <p className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin size={14}/> ખેતરનું સ્થાન વિગત (Location Details)
               </p>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                     <label className="text-[11px] font-bold text-slate-300 block mb-1">ગામ / શહેર</label>
                     <input 
                       type="text" 
                       required
                       placeholder="e.g. Lilapur"
                       value={formData.village}
                       onChange={e => setFormData({...formData, village: e.target.value})}
                       className="w-full p-3 bg-slate-900 border border-white/10 rounded-xl text-white font-medium text-xs focus:outline-none focus:border-emerald-400"
                     />
                  </div>

                  <div>
                     <label className="text-[11px] font-bold text-slate-300 block mb-1">તાલુકો</label>
                     <input 
                       type="text" 
                       required
                       placeholder="e.g. Sanand"
                       value={formData.taluka}
                       onChange={e => setFormData({...formData, taluka: e.target.value})}
                       className="w-full p-3 bg-slate-900 border border-white/10 rounded-xl text-white font-medium text-xs focus:outline-none focus:border-emerald-400"
                     />
                  </div>

                  <div>
                     <label className="text-[11px] font-bold text-slate-300 block mb-1">જિલ્લો</label>
                     <input 
                       type="text" 
                       required
                       placeholder="e.g. Ahmedabad"
                       value={formData.district}
                       onChange={e => setFormData({...formData, district: e.target.value})}
                       className="w-full p-3 bg-slate-900 border border-white/10 rounded-xl text-white font-medium text-xs focus:outline-none focus:border-emerald-400"
                     />
                  </div>
               </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#006400] to-emerald-600 hover:from-[#004d00] hover:to-emerald-700 text-white rounded-2xl font-black text-sm transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
               <CheckCircle2 size={18}/> પ્રોફાઈલ અને સરનામું સાચવો (Save Profile)
            </button>
         </form>

      </div>
    </div>
  );
}

export default CompleteProfileModal;
