import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import { Leaf, Tractor, Globe, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import WeatherWidget from '../components/WeatherWidget';
import AiCropDoctor from '../components/AiCropDoctor';
import FarmerCropCalendar from '../components/farmer/FarmerCropCalendar';

function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('userInfo');
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] font-sans overflow-x-hidden selection:bg-[#006400] selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center text-center text-white px-5 pt-8 pb-32 overflow-hidden bg-gradient-to-br from-[#004d00] via-[#006400] to-[#002800]">
        
        {/* Animated Orbs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-green-400/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute inset-0 bg-[url('/images/background.png')] bg-cover bg-center mix-blend-overlay opacity-20"></div>

        <div className="relative z-20 max-w-4xl mx-auto flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8 animate-[fadeIn_1s_ease-out]">
             <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-ping"></span>
             <span className="text-xs font-bold text-green-100 tracking-wider uppercase">{t('home.heroBadge', 'Empowering Indian Agriculture')}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black mb-6 leading-tight tracking-tight drop-shadow-md animate-[fadeIn_1.2s_ease-out]">
            {t('home.heroTitle', 'Empowering Farmers, Enriching Lives')}
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl font-medium text-green-50/90 max-w-2xl mb-10 leading-relaxed drop-shadow animate-[fadeIn_1.4s_ease-out]">
            {t('home.heroSubtitle', 'Direct marketplace, modern land management, and AI-driven agricultural solutions for a prosperous tomorrow.')}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto animate-[fadeIn_1.6s_ease-out]">
            {!isLoggedIn ? (
              <button 
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-[#FF9800] text-white rounded-2xl font-bold text-lg hover:bg-[#e68a00] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(255,152,0,0.4)] transition-all duration-300 w-full sm:w-auto shadow-xl cursor-pointer"
              >
                {t('home.getStarted', 'Get Started Now')}
              </button>
            ) : (
              <button 
                onClick={() => navigate('/profile')}
                className="px-8 py-4 bg-white text-[#006400] rounded-2xl font-bold text-lg hover:bg-green-50 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all duration-300 w-full sm:w-auto cursor-pointer"
              >
                {t('nav.profile', 'Profile')}
              </button>
            )}

            {/* Smart Crop Calendar Trigger Button */}
            <button 
              onClick={() => setIsCalendarModalOpen(true)}
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl font-black text-lg hover:from-amber-600 hover:to-orange-700 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(245,158,11,0.4)] transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-2.5 cursor-pointer shadow-xl border border-amber-300/30"
            >
              <CalendarIcon size={22} />
              <span>📅 ખેતી કૅલેન્ડર (Crop Calendar)</span>
            </button>

            <button 
              onClick={() => navigate('/marketplace')}
              className="px-8 py-4 bg-transparent border-2 border-white/40 text-white rounded-2xl font-bold text-lg hover:bg-white/10 hover:-translate-y-1 hover:border-white transition-all duration-300 w-full sm:w-auto backdrop-blur-sm cursor-pointer"
            >
              {t('home.exploreMarket', 'Explore Market')}
            </button>
          </div>

          <div className="mt-16 flex justify-center animate-[fadeIn_1.6s_ease-out]">
             <WeatherWidget />
          </div>
        </div>
        
        {/* Curved Bottom Separator */}
        <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-none z-10">
          <svg className="relative block w-full h-[80px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-[#f8fafc]"></path>
          </svg>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="max-w-7xl mx-auto px-5 pb-16 relative z-20 -mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Tractor size={32} />, title: t('home.featLandTitle', 'Smart Land Management'), desc: t('home.featLandDesc', 'Digital land records, soil health tracking, and resource allocation.') },
            { icon: <Globe size={32} />, title: t('home.featMarketTitle', 'Direct Market Access'), desc: t('home.featMarketDesc', 'Bypass middlemen and sell your produce directly to verified buyers.') },
            { icon: <Leaf size={32} />, title: t('home.featOrganicTitle', 'Sustainable Practices'), desc: t('home.featOrganicDesc', 'Expert guidance and community support for modern organic farming.') }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-[0_20px_40px_rgba(0,100,0,0.1)] hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center text-[#006400] mb-6 group-hover:bg-[#006400] group-hover:text-white transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3 text-[#1b431b]">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed font-medium">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* AI Doctor Section */}
      <section className="max-w-6xl mx-auto px-5 pb-24 relative z-20">
         <AiCropDoctor />
      </section>

      {/* Crop Calendar Modal Popup */}
      {isCalendarModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-5xl w-full my-auto">
             <FarmerCropCalendar onClose={() => setIsCalendarModalOpen(false)} />
          </div>
        </div>
      )}

      {/* Content Section */}
      <section className="max-w-5xl mx-auto p-5 pb-24 text-center">
        <h2 className="text-4xl font-extrabold mb-8 text-[#1b431b] flex items-center justify-center gap-3">
           <Leaf className="text-[#2ecc71]" />
           {t('home.aboutTitle', 'About Anndata')}
           <Leaf className="text-[#2ecc71] transform -scale-x-100" />
        </h2>
        <div className="glass-effect p-10 md:p-14 rounded-[2.5rem] text-gray-700 leading-relaxed text-lg lg:text-xl font-medium shadow-xl">
          <p className="mb-6">
            {t('home.aboutP1')}
          </p>
          <p className="text-[#006400] font-bold">
            {t('home.aboutP2')}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#004d00] to-[#006400] text-white text-center py-10 w-full mt-auto mt-20 relative overflow-hidden">
        <div className="absolute top-[-50px] left-[-50px] w-32 h-32 bg-white/5 rounded-full blur-[20px]"></div>
        <div className="absolute bottom-[-50px] right-[-50px] w-32 h-32 bg-white/5 rounded-full blur-[20px]"></div>
        
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black">અન્નદાતા</span>
          </div>
          <p className="m-0 text-green-100/60 font-medium text-sm">
            &copy; {new Date().getFullYear()} {t('home.copyright', 'Anndata Portal. Cultivating a better tomorrow.')}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
