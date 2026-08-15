import { useState, useEffect } from 'react';
import { CloudRain, Sun, Wind, Droplets, Loader2, MapPin, Sparkles, Search } from 'lucide-react';

function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Get farmer's default location from userInfo
  const userInfoStr = localStorage.getItem('userInfo');
  const parsedUser = userInfoStr ? JSON.parse(userInfoStr) : null;
  const userLocation = parsedUser 
    ? ([parsedUser.village, parsedUser.taluka, parsedUser.district].filter(Boolean).join(', ') || parsedUser.address || 'Ahmedabad')
    : 'Ahmedabad';

  const fetchWeather = async (targetCity) => {
    setLoading(true);
    try {
      const headers = parsedUser ? { Authorization: `Bearer ${parsedUser.token}` } : {};
      const cityToFetch = targetCity || userLocation;
      const res = await fetch(`/api/ai/weather?city=${encodeURIComponent(cityToFetch)}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setWeather(data);
      }
    } catch (err) {
      console.error("Weather fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(userLocation);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      fetchWeather(searchCity.trim());
      setIsEditing(false);
    }
  };

  if (loading && !weather) return (
     <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg flex items-center justify-center min-h-[140px]">
        <Loader2 className="animate-spin text-white w-8 h-8" />
     </div>
  );

  if (!weather) return null;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg text-white space-y-4 transition-all">
       {/* Location Header & Search toggle */}
       <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            {isEditing ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="ગામ / તાલુકો / શહેર..."
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full px-3 py-1 bg-white/20 border border-white/40 rounded-xl text-xs text-white placeholder-white/70 focus:outline-none font-bold"
                  autoFocus
                />
                <button type="submit" className="p-1 bg-green-500 rounded-lg text-white text-xs font-bold px-2">
                  ખાસ
                </button>
              </form>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className="text-left group cursor-pointer"
                title="ક્લિક કરીને તમારું ગામ/સ્થળ બદલો"
              >
                <h4 className="text-xs font-black uppercase tracking-widest text-green-200 mb-1 flex items-center gap-1 group-hover:text-yellow-300 transition-colors">
                  <MapPin size={12}/> {weather.city}
                  <Search size={10} className="ml-1 opacity-70 group-hover:opacity-100" />
                </h4>
                <p className="font-bold text-sm leading-none">{weather.condition}</p>
              </button>
            )}
          </div>

          <div className="bg-white/20 p-2.5 rounded-xl shrink-0">
            {weather.condition.toLowerCase().includes('rain') ? <CloudRain size={24} className="text-blue-200" /> : <Sun size={24} className="text-yellow-300" />}
          </div>
       </div>

       {/* Temperature */}
       <div className="text-5xl font-black tracking-tighter">
          {weather.temp_c}°<span className="text-2xl text-green-100">C</span>
       </div>

       {/* Humidity & Wind */}
       <div className="flex gap-4 border-t border-white/20 pt-3">
          <div className="flex items-center gap-2">
             <Droplets size={16} className="text-blue-300" />
             <span className="font-bold text-sm tracking-wide">{weather.humidity}% ભેજ</span>
          </div>
          <div className="flex items-center gap-2">
             <Wind size={16} className="text-gray-300" />
             <span className="font-bold text-sm tracking-wide">{weather.wind_kmh} km/h પવન</span>
          </div>
       </div>

       {/* Smart Gujarati Agricultural Weather Advice */}
       {weather.smartAdvice && (
         <div className="bg-emerald-950/40 border border-emerald-400/30 rounded-xl p-3 text-xs font-medium text-emerald-100 flex items-start gap-2">
           <Sparkles size={16} className="text-yellow-300 shrink-0 mt-0.5" />
           <span className="leading-relaxed">{weather.smartAdvice}</span>
         </div>
       )}
    </div>
  );
}

export default WeatherWidget;
