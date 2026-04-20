import { useState } from 'react';
import Navbar from '../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Leaf } from 'lucide-react';

function Login() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('userInfo', JSON.stringify(data));
        if (data.role === 'admin' || data.role === 'superadmin') {
           navigate('/admin');
        } else {
           navigate('/home');
        }
      } else {
        setError(t(data.message) || t('auth.loginFailed', 'Login failed'));
      }
    } catch (err) {
      setError(t('auth.errorLogin', 'An error occurred during login. Please check if the backend is running.'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e8f5e9] to-[#c8e6c9] flex flex-col font-sans selection:bg-[#006400] selection:text-white relative overflow-hidden">
      {/* Background Animated Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-[#66bb6a] rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-float"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#006400] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-float-delayed"></div>
      
      <Navbar />

      <div className="flex-grow flex items-center justify-center p-4 z-10">
        <div className="glass-effect p-8 md:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-md animate-[fadeIn_0.5s_ease-out] relative mt-10">
          
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-gradient-to-br from-[#FF9800] to-[#F57C00] rounded-2xl shadow-xl flex items-center justify-center text-white transform -rotate-3 hover:rotate-0 transition-transform">
             <Leaf size={40} className="transform rotate-3" />
          </div>

          <h2 className="text-[#1b431b] text-3xl font-extrabold mb-8 text-center mt-6 tracking-tight">
            {t('auth.loginTitle')}
          </h2>
          
          {error && (
            <div className="bg-red-50/80 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-6 shadow-sm backdrop-blur-sm">
              <p className="font-bold">{t('auth.errorTitle', 'Error')}</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col group">
              <label className="font-bold text-gray-700 mb-2 text-sm uppercase tracking-wider group-focus-within:text-[#006400] transition-colors">{t('auth.email')}</label>
              <input 
                type="email" 
                className="p-4 bg-white/70 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006400] focus:bg-white shadow-inner transition-all duration-300"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                required placeholder={t('auth.placeholderEmail', 'you@example.com')}
              />
            </div>
            
            <div className="flex flex-col group">
              <label className="font-bold text-gray-700 mb-2 text-sm uppercase tracking-wider group-focus-within:text-[#006400] transition-colors">{t('auth.password')}</label>
              <input 
                type="password" 
                className="p-4 bg-white/70 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006400] focus:bg-white shadow-inner transition-all duration-300"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                required placeholder="••••••••"
              />
            </div>

            <button type="submit" className="mt-6 bg-gradient-to-r from-[#006400] to-[#2ecc71] hover:from-[#004d00] hover:to-[#228b22] text-white font-bold p-4 rounded-xl transition-all duration-300 shadow-[0_10px_20px_rgba(0,100,0,0.2)] hover:shadow-[0_15px_25px_rgba(0,100,0,0.3)] hover:-translate-y-1 transform text-lg">
              {t('auth.loginBtn')}
            </button>
          </form>

          <div className="mt-8 text-center text-gray-600 font-medium pb-2 border-t border-gray-200/50 pt-6">
            {t('auth.dontHaveAccount')} <Link to="/register" className="text-[#F57C00] font-bold hover:underline transition-all hover:text-[#EF6C00] ml-1">{t('auth.registerHere')}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
