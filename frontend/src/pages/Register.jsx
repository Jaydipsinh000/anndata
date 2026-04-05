import { useState } from 'react';
import Navbar from '../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sprout } from 'lucide-react';

function Register() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    password: '',
    role: 'farmer'
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('userInfo', JSON.stringify(data));
        navigate('/home');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred during registration. Please check if the backend is running.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e8f5e9] to-[#c8e6c9] flex flex-col font-sans selection:bg-[#006400] selection:text-white relative overflow-hidden">
      {/* Background Animated Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-[#66bb6a] rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-float"></div>
      <div className="absolute bottom-[20%] right-[-5%] w-[400px] h-[400px] bg-[#2e7d32] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-float-delayed"></div>
      
      <Navbar />

      <div className="flex-grow flex items-center justify-center p-4 my-8 z-10">
        <div className="glass-effect p-8 md:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-xl animate-[fadeIn_0.5s_ease-out] relative">
          
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-gradient-to-br from-[#006400] to-[#2ecc71] rounded-2xl shadow-xl flex items-center justify-center text-white transform rotate-3">
             <Sprout size={40} className="transform -rotate-3" />
          </div>

          <h2 className="text-[#1b431b] text-3xl font-extrabold mb-8 text-center mt-6 tracking-tight">
            {t('auth.registerTitle')}
          </h2>
          
          {error && (
            <div className="bg-red-50/80 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-6 shadow-sm backdrop-blur-sm">
              <p className="font-bold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col group">
              <label className="font-bold text-gray-700 mb-2 text-sm uppercase tracking-wider group-focus-within:text-[#006400] transition-colors">{t('auth.fullName')}</label>
              <input type="text" className="p-4 bg-white/70 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006400] focus:bg-white shadow-inner transition-all duration-300" 
                     value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="John Doe" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col group">
                <label className="font-bold text-gray-700 mb-2 text-sm uppercase tracking-wider group-focus-within:text-[#006400] transition-colors">{t('auth.email')}</label>
                <input type="email" className="p-4 bg-white/70 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006400] focus:bg-white shadow-inner transition-all duration-300" 
                       value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required placeholder="you@example.com" />
              </div>
              <div className="flex flex-col group">
                <label className="font-bold text-gray-700 mb-2 text-sm uppercase tracking-wider group-focus-within:text-[#006400] transition-colors">{t('auth.mobile')}</label>
                <input type="text" className="p-4 bg-white/70 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006400] focus:bg-white shadow-inner transition-all duration-300" 
                       value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} required placeholder="+91 90000 00000" />
              </div>
            </div>

            <div className="flex flex-col group">
              <label className="font-bold text-gray-700 mb-2 text-sm uppercase tracking-wider group-focus-within:text-[#006400] transition-colors">{t('auth.address')}</label>
              <textarea className="p-4 bg-white/70 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006400] focus:bg-white shadow-inner transition-all duration-300 resize-none h-24" 
                        value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required placeholder="123 Farm Lane, Village..."></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col group">
                <label className="font-bold text-gray-700 mb-2 text-sm uppercase tracking-wider group-focus-within:text-[#006400] transition-colors">{t('auth.password')}</label>
                <input type="password" className="p-4 bg-white/70 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006400] focus:bg-white shadow-inner transition-all duration-300" 
                       value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required placeholder="••••••••" />
              </div>
              <div className="flex flex-col group">
                <label className="font-bold text-gray-700 mb-2 text-sm uppercase tracking-wider group-focus-within:text-[#006400] transition-colors">{t('auth.role')}</label>
                <div className="relative">
                  <select className="w-full p-4 bg-white/70 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006400] focus:bg-white shadow-inner transition-all duration-300 appearance-none font-medium" 
                          value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                    <option value="farmer">{t('auth.roleFarmer')}</option>
                    <option value="worker">{t('auth.roleWorker')}</option>
                    <option value="buyer">{t('auth.roleBuyer')}</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" className="mt-8 bg-gradient-to-r from-[#006400] to-[#2ecc71] hover:from-[#004d00] hover:to-[#228b22] text-white font-bold p-4 rounded-xl transition-all duration-300 shadow-[0_10px_20px_rgba(0,100,0,0.2)] hover:shadow-[0_15px_25px_rgba(0,100,0,0.3)] hover:-translate-y-1 transform text-lg">
              {t('auth.registerBtn')}
            </button>
          </form>

          <div className="mt-8 text-center text-gray-600 font-medium pb-2 border-t border-gray-200/50 pt-6">
            {t('auth.alreadyHaveAccount')} <Link to="/login" className="text-[#006400] font-bold hover:underline transition-all hover:text-[#2ecc71] ml-1">{t('auth.loginHere')}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
