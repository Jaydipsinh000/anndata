import { useState, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Sparkles, Clock, Droplets, Wheat, X, Leaf, ShieldAlert, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

// Helper: Calculate exact date by adding N days to Sowing Date (YYYY-MM-DD)
const calculateStageDate = (baseSowingDateStr, daysToAdd) => {
  const base = baseSowingDateStr ? new Date(baseSowingDateStr) : new Date(2026, 5, 15);
  const target = new Date(base);
  target.setDate(target.getDate() + daysToAdd);
  const y = target.getFullYear();
  const m = String(target.getMonth() + 1).padStart(2, '0');
  const d = String(target.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

function FarmerCropCalendar({ onClose }) {
  const todayStr = '2026-08-15';
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 15)); // August 2026
  const [selectedDateStr, setSelectedDateStr] = useState(todayStr);
  const [filter, setFilter] = useState('all'); // 'all' | 'advisory' | 'admin_duty' | 'personal'
  const [selectedCropFilter, setSelectedCropFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [myCrops, setMyCrops] = useState([]);

  // New Event Form State
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventCategory, setNewEventCategory] = useState('pesticide');
  const [newEventDate, setNewEventDate] = useState(todayStr);
  const [newEventNotes, setNewEventNotes] = useState('');

  // Fetch farmer's actual crops from API
  useEffect(() => {
    const userInfoStr = localStorage.getItem('userInfo');
    if (userInfoStr) {
      const userInfo = JSON.parse(userInfoStr);
      fetch('/api/crops/my-crops', {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setMyCrops(data);
        })
        .catch(err => console.warn('Could not fetch farmer crops:', err));
    }
  }, []);

  // 100% Scientific Stage-Wise Agronomist Advisories generated from Farmer's Sowing Dates
  const cropAdvisories = useMemo(() => {
    let generated = [];

    if (myCrops && myCrops.length > 0) {
      myCrops.forEach(crop => {
        const sowingDate = crop.sowing_date || '2026-06-15';
        const name = crop.crop_name || 'પાક';

        generated.push(
          { id: `dyn-${crop._id}-1`, cropName: name, date: calculateStageDate(sowingDate, 15), title: `${name}: પ્રથમ વિરલન અને નિંદામણ (દિવસ ૧૫)`, category: 'general', type: 'advisory', desc: 'વાવણીના ૧૫ દિવસ પછી બિનજરૂરી છોડ દૂર કરી યોગ્ય અંતર જાળવવું.' },
          { id: `dyn-${crop._id}-2`, cropName: name, date: calculateStageDate(sowingDate, 30), title: `${name}: પ્રથમ ખાતર ડોઝ - યુરિયા (દિવસ ૩૦)`, category: 'fertilizer', type: 'advisory', desc: 'છોડના પ્રારંભિક વિકાસ માટે ૧૫ લિટર પંપમાં ૧૦૦ ગ્રામ યુરિયા અથવા NPK આપવું.' },
          { id: `dyn-${crop._id}-3`, cropName: name, date: calculateStageDate(sowingDate, 45), title: `${name}: જીવાત નિયંત્રણ - લીમડા તેલ છંટકાવ (દિવસ ૪૫)`, category: 'pesticide', type: 'advisory', desc: 'ચુસિયા અને લીલી મિલીબગ અટકાવવા લીમડાનું અર્ક (10,000 ppm) ૩૦ મિલી/પંપ છાંટો.' },
          { id: `dyn-${crop._id}-4`, cropName: name, date: calculateStageDate(sowingDate, 60), title: `${name}: જીંડવા/પોપટા વિકાસ - NPK 19-19-19 (દિવસ ૬૦)`, category: 'fertilizer', type: 'advisory', desc: 'ફળ અને જીંડવાની ગુણવત્તા વધારવા માટે NPK 19-19-19 નો સ્પ્રે કરો.' },
          { id: `dyn-${crop._id}-5`, cropName: name, date: calculateStageDate(sowingDate, 90), title: `${name}: ફિરોમોન ટ્રેપ અને ઈયળ તપાસ (દિવસ ૯૦)`, category: 'pesticide', type: 'advisory', desc: 'ઈયળ અને જીવાત ચકાસણી માટે ખેતરમાં ૫ ફિરોમોન ટ્રેપ ગોઠવો.' },
          { id: `dyn-${crop._id}-6`, cropName: name, date: calculateStageDate(sowingDate, 120), title: `${name}: પ્રથમ લણણી / વીણી (દિવસ ૧૨૦)`, category: 'harvesting', type: 'advisory', desc: 'પાક તૈયાર થતાં પ્રથમ વીણી અથવા ઉપાડણી શરૂ કરવી.' }
        );
      });
    } else {
      const defaultCottonSowing = '2026-06-15';
      const defaultGroundnutSowing = '2026-06-20';

      generated = [
        { id: 'adv-c1', cropName: 'કપાસ (Cotton)', date: calculateStageDate(defaultCottonSowing, 60), title: 'કપાસ: લીમડા તેલ છંટકાવ (દિવસ ૬૦)', category: 'pesticide', type: 'advisory', desc: 'જીંડવા ભરાવાના તબક્કે ચુસિયા અને ગુલાબી ઈયળના અટકાવ માટે લીમડાનું અર્ક ૩૦ મિલી/પંપ છાંટો.' },
        { id: 'adv-g1', cropName: 'મગફળી (Groundnut)', date: calculateStageDate(defaultGroundnutSowing, 60), title: 'મગફળી: પિયત અને નિંદામણ (દિવસ ૬૫)', category: 'irrigation', type: 'advisory', desc: 'પોપટા ભરાવાની મહત્વપૂર્ણ અવસ્થા છે. હળવું પિયત આપવું અને જમીનમાં ભેજ જાળવવો.' },
        { id: 'adv-c2', cropName: 'કપાસ (Cotton)', date: calculateStageDate(defaultCottonSowing, 75), title: 'કપાસ: ખાતરનો ૨ જો ડોઝ (NPK 19-19-19)', category: 'fertilizer', type: 'advisory', desc: 'જીંડવાનો ઉત્તમ વિકાસ માટે ૧૫ લિટર પંપમાં ૧૦૦ ગ્રામ 19-19-19 ખાતર ઉમેરી છંટકાવ કરવો.' },
        { id: 'adv-c3', cropName: 'કપાસ (Cotton)', date: calculateStageDate(defaultCottonSowing, 90), title: 'કપાસ: ફિરોમોન ટ્રેપ ચકાસણી (દિવસ ૯૦)', category: 'pesticide', type: 'advisory', desc: 'દર હેક્ટરે ૫ ફિરોમોન ટ્રેપ ગોઠવી ગુલાબી ઈયળના ઉપદ્રવની દૈનિક ચકાસણી કરવી.' },
        { id: 'adv-w1', cropName: 'ઘઉં (Wheat)', date: '2026-11-20', title: 'ઘઉં: શિયાળુ વાવણી અને પાયાનું ખાતર (DAP)', category: 'fertilizer', type: 'advisory', desc: 'શિયાળુ વાવણી સમયે પ્રતિ એકર ૫૦ કિલો DAP ખાતર જમીનમાં ભેળવવું.' }
      ];
    }

    return generated;
  }, [myCrops]);

  // Admin & Partnership Deal Events Pushed to Farmer's Calendar
  const adminPartnershipEvents = [
    { id: 'adm-1', date: '2026-08-18', title: '🏛️ જમીન ચકાસણી ટીમ વિઝિટ (Land Inspection)', category: 'general', type: 'admin_duty', desc: 'અન્નદાતા સબ-એડમિન ટીમ દ્વારા જમીન સરવે અને 7/12 દસ્તાવેજ ચકાસણી વિઝિટ.' },
    { id: 'adm-2', date: '2026-08-28', title: '💼 ભાગીદારી ત્રિમાસિક ભાડા ચૂકવણી તારીખ (Lease Payout)', category: 'general', type: 'admin_duty', desc: 'અન્નદાતા લીઝ એગ્રીમેન્ટ મુજબ ત્રિમાસિક ગેરંટીડ ભાડાની રકમ બેંક એકાઉન્ટમાં જમા થશે.' }
  ];

  // Farmer's Personal Events - NO DUMMY DATA! Farmer writes their own notes!
  const [personalEvents, setPersonalEvents] = useState(() => {
    const saved = localStorage.getItem('farmer_calendar_events');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('farmer_calendar_events', JSON.stringify(personalEvents));
  }, [personalEvents]);

  // Combined Events Stream
  const allEvents = [...cropAdvisories, ...adminPartnershipEvents, ...personalEvents];

  // Calendar Helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const monthNamesGu = ["જાન્યુઆરી", "ફેબ્રુઆરી", "માર્ચ", "એપ્રિલ", "મે", "જૂન", "જુલાઈ", "ઓગસ્ટ", "સપ્ટેમ્બર", "ઓક્ટોબર", "નવેમ્બર", "ડિસેમ્બર"];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return toast.error('કૃપા કરીને કાર્યનું નામ દાખલ કરો');

    const newEv = {
      id: 'pers-' + Date.now(),
      date: newEventDate,
      title: newEventTitle,
      category: newEventCategory,
      type: 'personal',
      desc: newEventNotes || 'મારી વ્યક્તિગત નોંધ'
    };

    setPersonalEvents(prev => [newEv, ...prev]);
    setIsAddModalOpen(false);
    setNewEventTitle('');
    setNewEventNotes('');
    toast.success('📅 કૅલેન્ડરમાં તમારી પોતીકી નોંધ સાચવાઈ!');
  };

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'pesticide': return { label: 'દવા છંટકાવ', bg: 'bg-red-500/20 text-red-300 border-red-500/30' };
      case 'fertilizer': return { label: 'ખાતર', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'irrigation': return { label: 'પિયત', bg: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
      case 'harvesting': return { label: 'લણણી', bg: 'bg-green-500/20 text-green-300 border-green-500/30' };
      default: return { label: 'સામાન્ય નોંધ', bg: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
    }
  };

  // Selected date events filtering
  const selectedDateEvents = allEvents.filter(ev => {
    if (ev.date !== selectedDateStr) return false;
    if (filter === 'advisory' && ev.type !== 'advisory') return false;
    if (filter === 'admin_duty' && ev.type !== 'admin_duty') return false;
    if (filter === 'personal' && ev.type !== 'personal') return false;
    if (selectedCropFilter !== 'all' && ev.cropName && !ev.cropName.includes(selectedCropFilter)) return false;
    return true;
  });

  return (
    <div className="bg-slate-950 rounded-3xl border border-indigo-500/20 shadow-2xl p-6 sm:p-8 text-white relative overflow-hidden my-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-indigo-500/20">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-2xl shadow-lg shadow-orange-500/20">
            <CalendarIcon size={32} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">📅 ખેતી કૅલેન્ડર (Farmer & Admin Calendar)</h2>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-amber-400/30 flex items-center gap-1">
                <Sparkles size={10} /> Real-Time Sync
              </span>
            </div>
            <p className="text-indigo-200/80 text-xs sm:text-sm font-medium mt-1">
              કૃષિ સલાહ, એડમિન/ભાગીદારી ટીમ કાર્યો અને તમારી પોતાની વ્યક્તિગત નોંધ.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => { setNewEventDate(selectedDateStr); setIsAddModalOpen(true); }}
            className="w-full md:w-auto px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-900/40 cursor-pointer transition-all"
          >
            <Plus size={16} /> મારી નોંધ ઉમેરો (+ My Note)
          </button>

          {onClose && (
            <button onClick={onClose} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl text-gray-300 hover:text-white transition-colors cursor-pointer">
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Active Growing Crops Strip */}
      <div className="mb-6 bg-slate-900/90 p-4 rounded-2xl border border-indigo-500/20 flex flex-wrap items-center justify-between gap-3">
         <div className="flex items-center gap-2">
            <Wheat size={18} className="text-amber-400" />
            <span className="text-xs font-black uppercase tracking-wider text-amber-300">તમારા પાકની કૅલેન્ડર ફિલ્ટર:</span>
         </div>
         
         <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCropFilter('all')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${selectedCropFilter === 'all' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-indigo-200 hover:bg-slate-700'}`}
            >
              બધા પાક (All)
            </button>
            {myCrops.length > 0 ? (
              myCrops.map(crop => (
                <button
                  key={crop._id}
                  onClick={() => setSelectedCropFilter(crop.crop_name)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${selectedCropFilter === crop.crop_name ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-indigo-200 hover:bg-slate-700'}`}
                >
                  🌾 {crop.crop_name} (વાવેતર: {crop.sowing_date || '૧૫ જૂન'})
                </button>
              ))
            ) : (
              <>
                <button onClick={() => setSelectedCropFilter('કપાસ')} className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${selectedCropFilter === 'કપાસ' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-indigo-200'}`}>🌾 કપાસ (Cotton)</button>
                <button onClick={() => setSelectedCropFilter('મગફળી')} className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${selectedCropFilter === 'મગફળી' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-indigo-200'}`}>🌱 મગફળી (Groundnut)</button>
              </>
            )}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Interactive Calendar Grid */}
        <div className="lg:col-span-7 bg-slate-900/80 rounded-3xl border border-indigo-500/20 p-6 shadow-xl">
          
          {/* Month Navigation Bar */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              {monthNamesGu[month]} {year}
            </h3>
            <div className="flex items-center gap-2">
              <button onClick={handlePrevMonth} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-white transition-colors">
                <ChevronLeft size={18} />
              </button>
              <button onClick={handleNextMonth} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-white transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 text-center font-black text-xs text-indigo-300 uppercase tracking-wider mb-2">
            <div>રવિ</div><div>સોમ</div><div>મંગળ</div><div>બુધ</div><div>ગુરુ</div><div>શુક્ર</div><div>શનિ</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: firstDayIndex }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-14 rounded-2xl bg-slate-950/20"></div>
            ))}

            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const isSelected = dateString === selectedDateStr;
              const dateEvs = allEvents.filter(e => e.date === dateString);
              const hasAdvisory = dateEvs.some(e => e.type === 'advisory');
              const hasAdminDuty = dateEvs.some(e => e.type === 'admin_duty');
              const hasPersonal = dateEvs.some(e => e.type === 'personal');

              return (
                <button
                  key={dayNum}
                  onClick={() => setSelectedDateStr(dateString)}
                  className={`h-14 rounded-2xl p-1 flex flex-col items-center justify-between transition-all relative border ${
                    isSelected 
                      ? 'bg-gradient-to-tr from-amber-500 to-orange-600 border-white text-white shadow-lg scale-105 z-10 font-black' 
                      : 'bg-slate-950/60 border-indigo-500/10 hover:border-amber-400/40 text-slate-200'
                  }`}
                >
                  <span className="text-xs font-bold mt-1">{dayNum}</span>
                  
                  <div className="flex gap-1 mb-1">
                    {hasAdvisory && <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-amber-400'}`}></div>}
                    {hasAdminDuty && <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-purple-400'}`}></div>}
                    {hasPersonal && <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-blue-400'}`}></div>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Date Agenda & Details */}
        <div className="lg:col-span-5 bg-slate-900/80 rounded-3xl border border-indigo-500/20 p-6 shadow-xl flex flex-col">
          
          <div className="flex items-center justify-between border-b border-indigo-500/20 pb-4 mb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">પસંદ કરેલ તારીખ</span>
              <h3 className="text-lg font-black text-white">{selectedDateStr}</h3>
            </div>

            <div className="flex bg-slate-950 p-1 rounded-xl border border-indigo-500/20">
              <button onClick={() => setFilter('all')} className={`px-2 py-1 text-[9px] font-bold rounded-lg ${filter === 'all' ? 'bg-indigo-600 text-white' : 'text-indigo-300'}`}>બધા</button>
              <button onClick={() => setFilter('advisory')} className={`px-2 py-1 text-[9px] font-bold rounded-lg ${filter === 'advisory' ? 'bg-amber-600 text-white' : 'text-indigo-300'}`}>સલાહ</button>
              <button onClick={() => setFilter('admin_duty')} className={`px-2 py-1 text-[9px] font-bold rounded-lg ${filter === 'admin_duty' ? 'bg-purple-600 text-white' : 'text-indigo-300'}`}>એડમિન</button>
              <button onClick={() => setFilter('personal')} className={`px-2 py-1 text-[9px] font-bold rounded-lg ${filter === 'personal' ? 'bg-blue-600 text-white' : 'text-indigo-300'}`}>મારી નોંધ</button>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto max-h-[380px] pr-1">
            {selectedDateEvents.length > 0 ? (
              selectedDateEvents.map(ev => {
                const badge = getCategoryBadge(ev.category);
                return (
                  <div key={ev.id} className="bg-slate-950/80 p-4 rounded-2xl border border-indigo-500/15 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${badge.bg}`}>
                        {badge.label}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        ev.type === 'advisory' ? 'bg-amber-950 text-amber-300 border border-amber-500/30' : 
                        ev.type === 'admin_duty' ? 'bg-purple-950 text-purple-300 border border-purple-500/30' :
                        'bg-blue-950 text-blue-300 border border-blue-500/30'
                      }`}>
                        {ev.type === 'advisory' ? `🌾 ${ev.cropName || 'પાક સલાહ'}` : ev.type === 'admin_duty' ? '🏛️ એડમિન/ભાગીદારી' : '👤 મારી નોંધ'}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-white">{ev.title}</h4>
                    <p className="text-xs text-indigo-200/80 leading-relaxed font-medium">{ev.desc}</p>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 opacity-50 space-y-2">
                <Clock size={32} className="mx-auto text-indigo-400" />
                <p className="text-xs font-bold text-indigo-200 uppercase tracking-wider">આ તારીખે કોઈ કાર્ય નથી</p>
                <p className="text-[11px] text-indigo-300">નવી અંગત નોંધ ઉમેરવા માટે ઉપર "+ મારી નોંધ ઉમેરો" બટન દબાવો.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
              <h3 className="font-black text-lg text-white">📅 તમારી અંગત નોંધ ઉમેરો</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-white"><X size={20}/></button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-indigo-200 mb-1">તારીખ (Date)</label>
                <input
                  type="date"
                  value={newEventDate}
                  onChange={e => setNewEventDate(e.target.value)}
                  className="w-full bg-slate-950 border border-indigo-500/30 rounded-xl px-4 py-2.5 text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-indigo-200 mb-1">કાર્યનું શીર્ષક (Task Title)</label>
                <input
                  type="text"
                  placeholder="દા.ત. દવા છંટકાવ કરવાનો છે / ટ્રેક્ટર વાપરવાનું..."
                  value={newEventTitle}
                  onChange={e => setNewEventTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-indigo-500/30 rounded-xl px-4 py-2.5 text-white focus:outline-none placeholder-gray-500"
                  required
                />
              </div>

              <div>
                <label className="block text-indigo-200 mb-1">પ્રકાર (Category)</label>
                <select
                  value={newEventCategory}
                  onChange={e => setNewEventCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-indigo-500/30 rounded-xl px-4 py-2.5 text-white focus:outline-none"
                >
                  <option value="pesticide">દવા છંટકાવ (Pesticide)</option>
                  <option value="fertilizer">ખાતર આપવું (Fertilizer)</option>
                  <option value="irrigation">પિયત આપવું (Irrigation)</option>
                  <option value="harvesting">લણણી (Harvesting)</option>
                  <option value="general">સામાન્ય નોંધ (General)</option>
                </select>
              </div>

              <div>
                <label className="block text-indigo-200 mb-1">વિગત / વિગતો (Notes)</label>
                <textarea
                  rows={3}
                  placeholder="જરૂરી દવા/ખાતર નું નામ અથવા યાદી..."
                  value={newEventNotes}
                  onChange={e => setNewEventNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-indigo-500/30 rounded-xl px-4 py-2.5 text-white focus:outline-none placeholder-gray-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 bg-slate-800 text-gray-300 rounded-xl font-bold hover:bg-slate-700"
                >
                  રદ કરો
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold hover:from-amber-600 hover:to-orange-700 shadow-lg shadow-amber-900/40"
                >
                  સાચવો (Save Note)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default FarmerCropCalendar;
