import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Crops from './pages/Crops';
import Marketplace from './pages/Marketplace';
import AdminPanel from './pages/admin/AdminPanel';
import LandManagement from './pages/LandManagement';
import Profile from './pages/Profile';
import Tools from './pages/Tools';
import Partnerships from './pages/Partnerships';
import Bookings from './pages/Bookings';
import Services from './pages/Services';
import ProtectedRoute from './components/ProtectedRoute';

function LanguageSelector() {
  const { i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(localStorage.getItem('selectedLang') || 'en');
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('selectedLang', selectedLang);
    i18n.changeLanguage(selectedLang);
  }, [selectedLang, i18n]);

  const langs = [
    { code: 'gu', label: 'ગુજરાતી (Gujarati)', flag: '🌾' },
    { code: 'hi', label: 'हिंदी (Hindi)', flag: '🇮🇳' },
    { code: 'en', label: 'English', flag: '🌍' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f5e9] via-[#c8e6c9] to-[#a5d6a7] flex flex-col justify-center items-center font-sans p-4 relative overflow-hidden">
      {/* Background Animated Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#66bb6a] rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-float"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#2e7d32] rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-float-delayed"></div>
      
      <div className="max-w-xl w-full text-center glass-effect p-10 md:p-14 rounded-[2rem] relative z-10">
        <div className="mx-auto w-24 h-24 mb-6 rounded-3xl bg-white shadow-xl flex items-center justify-center p-2 transform -rotate-3 transition-transform hover:rotate-0 duration-300">
           <img src="/images/logo.jpeg" alt="Logo" className="w-full h-full object-cover rounded-2xl" />
        </div>

        <h1 className="text-4xl font-extrabold mb-4 text-[#1b431b]">
          Welcome to <span className="text-gradient">અન્નદાતા</span>
        </h1>
        <p className="text-gray-600 mb-8 text-lg font-medium">Please select your preferred language to continue</p>

        <div className="flex flex-col gap-4 my-6">
          {langs.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLang(lang.code)}
              className={`relative flex items-center justify-between px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${
                selectedLang === lang.code 
                  ? 'bg-gradient-to-r from-[#006400] to-[#228b22] text-white shadow-lg shadow-green-900/30 transform scale-[1.02]' 
                  : 'bg-white/60 text-gray-800 hover:bg-white hover:shadow-md border border-white/50'
              }`}
            >
              <div className="flex items-center gap-3 text-lg">
                <span className="text-2xl">{lang.flag}</span>
                {lang.label}
              </div>
              {selectedLang === lang.code && (
                <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#006400]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button 
            onClick={() => navigate(`/home`)}
            className="flex items-center justify-center gap-2 w-full px-6 py-4 rounded-2xl font-bold text-[#1b431b] bg-white border border-green-100 hover:bg-gray-50 hover:border-green-200 transition-all shadow-sm hover:shadow group"
          >
            <span>Continue as Guest</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
          <button 
             onClick={() => navigate(`/login`)}
             className="flex items-center justify-center gap-2 w-full px-6 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-[#FF9800] to-[#F57C00] hover:from-[#F57C00] hover:to-[#EF6C00] transition-all shadow-md hover:shadow-lg shadow-orange-500/30 transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
            <span>Login / Register</span>
          </button>
        </div>
      </div>
    </div>
  );
}

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster position="top-right" 
               toastOptions={{
                 style: { background: '#333', color: '#fff', borderRadius: '1rem', fontWeight: 'bold' },
                 success: { style: { background: '#006400' } },
                 error: { style: { background: '#ef4444' } }
               }} 
      />
      <Router>
        <Routes>
          <Route path="/" element={<LanguageSelector />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes - All logged in users */}
          <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
          <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
          <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          
          {/* Protected Routes - Admin only */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><AdminPanel /></ProtectedRoute>} />
          
          {/* Protected Routes - Farmer only */}
          <Route path="/crops" element={<ProtectedRoute allowedRoles={['farmer']}><Crops /></ProtectedRoute>} />
          <Route path="/lands" element={<ProtectedRoute allowedRoles={['farmer']}><LandManagement /></ProtectedRoute>} />
          <Route path="/tools" element={<ProtectedRoute allowedRoles={['farmer']}><Tools /></ProtectedRoute>} />
          <Route path="/partnerships" element={<ProtectedRoute allowedRoles={['farmer']}><Partnerships /></ProtectedRoute>} />

          <Route path="/*" element={<Home />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
