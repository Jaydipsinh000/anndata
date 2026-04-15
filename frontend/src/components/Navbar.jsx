import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const navigate = useNavigate();

  const userInfo = localStorage.getItem('userInfo');
  const isLoggedIn = !!userInfo;
  const userRole = isLoggedIn ? JSON.parse(userInfo).role : null;

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = isLoggedIn
    ? [
        { name: t('nav.home', 'Home'), path: '/home' },
        ...(userRole === 'admin' || userRole === 'superadmin' ? [{ name: 'Admin Panel', path: '/admin' }] : []),
        ...(userRole === 'farmer' ? [
            { name: t('nav.lands', 'Lands'), path: '/lands' },
            { name: t('nav.crops', 'My Crops'), path: '/crops' },
            { name: t('nav.partnerships', 'Partnerships'), path: '/partnerships' },
            { name: t('nav.bookings', 'My Bookings'), path: '/bookings' },
            { name: t('nav.tools', 'Tools'), path: '/tools' },
            { name: 'Services', path: '/services' },
            { name: t('nav.marketplace', 'Marketplace'), path: '/marketplace' }
        ] : []),
        ...(userRole === 'buyer' ? [
            { name: t('nav.bookings', 'My Bookings'), path: '/bookings' },
            { name: 'Services', path: '/services' },
            { name: t('nav.marketplace', 'Marketplace'), path: '/marketplace' }
        ] : []),
        ...(userRole === 'worker' ? [
            { name: t('nav.tools', 'Tool Rentals'), path: '/tools' },
            { name: 'Services', path: '/services' }
        ] : []),
        { name: t('nav.profile', 'Profile'), path: '/profile' }
      ]
    : [
        { name: t('nav.home', 'Home'), path: '/home' },
        { name: 'Services', path: '/services' },
        { name: t('nav.marketplace', 'Marketplace'), path: '/marketplace' }
      ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
      <div className={`mx-4 sm:mx-6 md:mx-auto max-w-7xl rounded-2xl glass-effect-dark px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between text-white transition-all`}>
        {/* Logo & Title */}
        <Link to="/home" className="flex items-center gap-3 decoration-none hover:opacity-90 transition-opacity">
          <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-white border border-white/20 shadow-lg flex items-center justify-center overflow-hidden transition-transform duration-300 hover:scale-105 hover:-rotate-3 p-1">
            <img src="/images/logo.jpeg" alt="Anndata Logo" className="w-full h-full object-cover rounded-lg" />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-xl sm:text-[1.7rem] font-black tracking-wider m-0 leading-none text-transparent bg-clip-text bg-gradient-to-r from-white to-green-200">અન્નદાતા</h1>
            <p className="text-[#a5d6a7] font-semibold text-xs sm:text-sm m-0 leading-none tracking-wide">Anndata Portal</p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8">
          <ul className="flex space-x-8 list-none m-0 p-0 font-medium items-center">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className={`relative text-white/90 decoration-none hover:text-white transition-colors duration-300 py-2 text-sm uppercase tracking-wider font-bold group`}
                  >
                    {link.name}
                    <span className={`absolute bottom-0 left-0 h-[2px] bg-green-400 transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Auth Buttons */}
          <div className="flex gap-3 items-center ml-4 border-l border-white/20 pl-6">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="bg-red-500/20 hover:bg-red-500/40 border border-red-500/50 text-white font-bold py-2 px-5 rounded-xl transition-all duration-300 text-sm cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:-translate-y-0.5">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="text-green-50 font-bold py-2 px-4 rounded-xl hover:bg-white/10 transition-colors text-sm border border-transparent hover:border-white/20">
                  Login
                </Link>
                <Link to="/register" className="bg-gradient-to-r from-[#FF9800] to-[#F57C00] hover:from-[#F57C00] hover:to-[#EF6C00] text-white font-bold py-2 px-6 rounded-xl transition-all duration-300 text-sm shadow-[0_0_15px_rgba(255,152,0,0.4)] hover:shadow-[0_0_25px_rgba(255,152,0,0.6)] hover:-translate-y-0.5">
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Hamburger Icon */}
        <button 
          className="md:hidden flex flex-col justify-center items-center h-10 w-10 z-50 focus:outline-none rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
          onClick={toggleMenu}
        >
          {isOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity" onClick={toggleMenu}></div>
      )}

      {/* Mobile Nav dropdown */}
      <nav
        className={`absolute top-full left-4 right-4 mt-2 glass-effect-dark rounded-2xl md:hidden overflow-hidden transition-all duration-300 transform origin-top border border-white/20 z-40 ${
          isOpen ? 'scale-y-100 opacity-100 shadow-2xl' : 'scale-y-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="p-4 flex flex-col gap-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`block w-full text-center py-3 rounded-xl font-bold transition-colors ${
                  isActive ? 'bg-white/20 text-white' : 'text-green-50 hover:bg-white/10'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            );
          })}
          
          <div className="my-2 border-t border-white/20"></div>
          
          {isLoggedIn ? (
            <button 
              onClick={() => { handleLogout(); setIsOpen(false); }}
              className="w-full text-center py-3 rounded-xl font-bold bg-red-500/20 text-red-100 hover:bg-red-500/40 border border-red-500/30 transition-colors"
            >
              Logout
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <Link to="/login" onClick={() => setIsOpen(false)} className="w-full text-center py-3 rounded-xl font-bold bg-white text-[#004d00] hover:bg-green-50 transition-colors">
                Login
              </Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="w-full text-center py-3 rounded-xl font-bold bg-gradient-to-r from-[#FF9800] to-[#F57C00] text-white hover:from-[#F57C00] transition-colors">
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
