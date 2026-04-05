import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Leaf, Sprout, Tractor, Globe } from 'lucide-react';

function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-[#1a1a1a] font-sans overflow-x-hidden selection:bg-[#006400] selection:text-white">
      <Navbar />
      
      {/* Dynamic Hero Section */}
      <section className="relative min-h-[650px] flex items-center justify-center p-5 pt-20 pb-32 mb-16 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#004d00] via-[#006400] to-[#2ecc71] opacity-95"></div>
          {/* Subtle noise/texture overlay if you had one, using css bg blend */}
          <div className="absolute inset-0 bg-[url('/images/background.png')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
          
          {/* Animated decorative blobs */}
          <div className="absolute top-0 left-10 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] mix-blend-screen animate-float"></div>
          <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-[#a5d6a7]/20 rounded-full blur-[80px] mix-blend-screen animate-float-delayed"></div>
        </div>

        <div className="z-10 text-center max-w-4xl mx-auto px-4 mt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect-dark border border-white/20 text-green-100 text-sm font-bold mb-8 animate-[fadeIn_0.8s_ease-out]">
            <Sprout size={16} className="text-green-400" />
            Empowering Modern Agriculture
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-white leading-tight drop-shadow-xl animate-[fadeIn_1s_ease-out]">
            {t('home.welcome')}
          </h1>
          
          <p className="text-xl md:text-2xl text-green-50 max-w-2xl mx-auto mb-10 font-medium leading-relaxed drop-shadow-sm animate-[fadeIn_1.2s_ease-out]">
            {t('home.subtitle') || "Connecting farmers with resources, markets, and communities for a sustainable future."}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-[fadeIn_1.4s_ease-out]">
            {!localStorage.getItem('userInfo') ? (
              <button 
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-white text-[#006400] rounded-2xl font-bold text-lg hover:bg-green-50 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all duration-300 w-full sm:w-auto"
              >
                {t('home.getStarted') || "Get Started"}
              </button>
            ) : (
              <button 
                onClick={() => navigate('/profile')}
                className="px-8 py-4 bg-white text-[#006400] rounded-2xl font-bold text-lg hover:bg-green-50 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all duration-300 w-full sm:w-auto"
              >
                {t('nav.profile') || "Go to Profile"}
              </button>
            )}
            <button 
              onClick={() => navigate('/marketplace')}
              className="px-8 py-4 bg-transparent border-2 border-white/40 text-white rounded-2xl font-bold text-lg hover:bg-white/10 hover:-translate-y-1 hover:border-white transition-all duration-300 w-full sm:w-auto backdrop-blur-sm"
            >
              Explore Market
            </button>
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
      <section className="max-w-7xl mx-auto px-5 pb-24 relative z-20 -mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Tractor size={32} />, title: "Smart Land Management", desc: "Digital land records, soil health tracking, and resource allocation." },
            { icon: <Globe size={32} />, title: "Direct Market Access", desc: "Bypass middlemen and sell your produce directly to verified buyers." },
            { icon: <Leaf size={32} />, title: "Sustainable Practices", desc: "Expert guidance and community support for modern organic farming." }
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

      {/* Content Section */}
      <section className="max-w-5xl mx-auto p-5 pb-24 text-center">
        <h2 className="text-4xl font-extrabold mb-8 text-[#1b431b] flex items-center justify-center gap-3">
           <Leaf className="text-[#2ecc71]" />
           {t('home.aboutTitle') || "About Anndata"}
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
            &copy; {new Date().getFullYear()} Anndata Portal. Cultivating a better tomorrow.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
