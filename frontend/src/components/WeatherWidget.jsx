import { useState, useEffect } from 'react';
import { CloudRain, Sun, Wind, Droplets, Loader2, MapPin, Sparkles } from 'lucide-react';

function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const headers = userInfo ? { Authorization: `Bearer ${userInfo.token}` } : {};
        const res = await fetch('/api/ai/weather', { headers });
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
    fetchWeather();
  }, []);

  if (loading) return (
     <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg flex items-center justify-center min-h-[120px]">
        <Loader2 className="animate-spin text-white w-8 h-8" />
     </div>
  );

  if (!weather) return null;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg text-white space-y-4">
       <div className="flex justify-between items-start">
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-green-200 mb-1 flex items-center gap-1"><MapPin size={12}/> {weather.city}</h4>
            <p className="font-bold text-sm">{weather.condition}</p>
          </div>
          <div className="bg-white/20 p-2.5 rounded-xl">
            {weather.condition.toLowerCase().includes('rain') ? <CloudRain size={24} className="text-blue-200" /> : <Sun size={24} className="text-yellow-300" />}
          </div>
       </div>

       <div className="text-5xl font-black tracking-tighter">
          {weather.temp_c}°<span className="text-2xl text-green-100">C</span>
       </div>

       <div className="flex gap-4 border-t border-white/20 pt-3">
          <div className="flex items-center gap-2">
             <Droplets size={16} className="text-blue-300" />
             <span className="font-bold text-sm tracking-wide">{weather.humidity}% HD</span>
          </div>
          <div className="flex items-center gap-2">
             <Wind size={16} className="text-gray-300" />
             <span className="font-bold text-sm tracking-wide">{weather.wind_kmh} km/h</span>
          </div>
       </div>

       {weather.smartAdvice && (
         <div className="bg-emerald-950/40 border border-emerald-400/30 rounded-xl p-3 text-xs font-medium text-emerald-100 flex items-start gap-2">
           <Sparkles size={16} className="text-yellow-300 shrink-0 mt-0.5" />
           <span>{weather.smartAdvice}</span>
         </div>
       )}
    </div>
  );
}

export default WeatherWidget;

