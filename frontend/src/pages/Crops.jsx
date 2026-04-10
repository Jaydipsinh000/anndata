import { useState, useEffect } from 'react';
import { Sprout, Wheat, Plus, XCircle, Loader2, Tractor, MapPin, IndianRupee, Calendar, BarChart3, Package, ShieldCheck, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Crops() {
  const [crops, setCrops] = useState([]);
  const [myLands, setMyLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [harvestingId, setHarvestingId] = useState(null);
  const [harvestData, setHarvestData] = useState({ final_qty: '', quality_grade: 'A', selling_price: '' });

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
  const isFarmer = userInfo?.role === 'farmer';

  // Add Crop Form State
  const [cropType, setCropType] = useState('ready');
  const [form, setForm] = useState({
    crop_name: '', land_id: '', area_value: '', area_unit: 'Bigha', season: 'Monsoon', price: '',
    sowing_date: '', expected_harvest_date: '', expected_yield_qty: '', expected_yield_unit: 'kg', advance_booking_enabled: false,
    available_qty: '', quality_grade: 'A'
  });

  const fetchCrops = async () => {
    try {
      const endpoint = isFarmer ? '/api/crops/mycrops' : '/api/crops';
      const headers = userInfo ? { Authorization: `Bearer ${userInfo.token}` } : {};
      const res = await fetch(endpoint, { headers });
      if (res.ok) {
        const data = await res.json();
        setCrops(Array.isArray(data) ? data : []);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchMyLands = async () => {
    if (!isFarmer) return;
    try {
      const res = await fetch('/api/lands/my', { headers: { Authorization: `Bearer ${userInfo.token}` } });
      if (res.ok) { setMyLands(await res.json()); }
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchCrops(); fetchMyLands(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cropType === 'growing' && form.expected_harvest_date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const harvestDate = new Date(form.expected_harvest_date);
      if (harvestDate < today) {
        alert("Harvest date must be in the future");
        return;
      }
    }
    try {
      const body = { ...form, type: cropType };
      const res = await fetch('/api/crops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        setShowAddForm(false);
        setForm({ crop_name: '', land_id: '', area_value: '', area_unit: 'Bigha', season: 'Monsoon', price: '', sowing_date: '', expected_harvest_date: '', expected_yield_qty: '', expected_yield_unit: 'kg', advance_booking_enabled: false, available_qty: '', quality_grade: 'A' });
        fetchCrops();
      }
    } catch (err) { console.error(err); }
  };

  const handleHarvest = async (cropId) => {
    try {
      await fetch(`/api/crops/${cropId}/harvest`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
        body: JSON.stringify(harvestData)
      });
      setHarvestingId(null);
      setHarvestData({ final_qty: '', quality_grade: 'A', selling_price: '' });
      fetchCrops();
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="min-h-screen bg-[#f8fafc]"><Navbar /><div className="text-center py-20 text-xl font-bold animate-pulse">Loading Crop Data...</div></div>;

  const growingCrops = crops.filter(c => c.type === 'growing');
  const readyCrops = crops.filter(c => c.type === 'ready' || !c.type);

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-20">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-r from-[#004d00] to-[#2ecc71] py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/background.png')] bg-cover mix-blend-overlay opacity-20"></div>
        <h2 className="text-white text-4xl md:text-5xl font-extrabold mb-2 relative z-10 drop-shadow-md">
          {isFarmer ? 'My Crop Portfolio' : 'Browse Crops'}
        </h2>
        <p className="text-green-100 text-lg relative z-10">{isFarmer ? 'Track your growing and ready-to-sell crops.' : 'Discover locally produced crops from our farmer network.'}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">

        {/* Add Crop Button (Farmer Only) */}
        {isFarmer && (
          <button onClick={() => setShowAddForm(true)} className="mb-6 flex items-center gap-2 bg-white border-2 border-dashed border-green-300 text-[#006400] font-bold px-6 py-4 rounded-2xl hover:bg-green-50 transition-all w-full justify-center text-lg shadow-sm">
            <Plus size={24} /> List New Crop
          </button>
        )}

        {/* Growing Crops Section */}
        {growingCrops.filter(c => isFarmer || c.status === 'approved').length > 0 && (
          <div className="mb-10">
            <h3 className="text-xl font-black text-gray-800 mb-4 flex items-center gap-2"><Sprout className="text-green-600" size={22}/> Future Crops Available for Booking</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {growingCrops.filter(c => isFarmer || c.status === 'approved').map(crop => (
                <div key={crop._id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-green-100 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-green-700 bg-green-100 px-3 py-1 rounded-xl">{crop.status}</span>
                      <h4 className="text-xl font-black text-gray-800 mt-2 capitalize">{crop.crop_name}</h4>
                    </div>
                    <div className="bg-green-50 p-2 rounded-xl"><Sprout className="text-green-600" size={20}/></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                    <div className="bg-gray-50 p-3 rounded-xl"><p className="text-[10px] font-black text-gray-400 uppercase mb-1">Area</p><p className="font-bold text-gray-800">{crop.area_value} {crop.area_unit}</p></div>
                    <div className="bg-gray-50 p-3 rounded-xl"><p className="text-[10px] font-black text-gray-400 uppercase mb-1">Expected Yield</p><p className="font-bold text-gray-800">{crop.expected_yield_qty} {crop.expected_yield_unit}</p></div>
                    <div className="bg-gray-50 p-3 rounded-xl"><p className="text-[10px] font-black text-gray-400 uppercase mb-1">Harvest Date</p><p className="font-bold text-gray-800">{crop.expected_harvest_date ? new Date(crop.expected_harvest_date).toLocaleDateString() : 'TBD'}</p></div>
                    <div className="bg-green-50 border border-green-100 p-3 rounded-xl"><p className="text-[10px] font-black text-green-600 uppercase mb-1">Price/Unit</p><p className="font-black text-green-700 text-lg">₹{crop.price}</p></div>
                  </div>
                  {crop.advance_booking_enabled && <p className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl w-max mb-3">ADVANCE BOOKING OPEN</p>}

                  {/* Harvest Button for Farmer / Booking for Buyer */}
                  {isFarmer ? (
                    crop.status === 'approved' && (
                      harvestingId === crop._id ? (
                        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 space-y-3 animate-[fadeIn_0.3s_ease-out]">
                          <p className="text-xs font-black text-orange-800 uppercase tracking-widest">Mark as Harvested</p>
                          <input type="number" placeholder="Final Qty Harvested" value={harvestData.final_qty} onChange={e => setHarvestData({...harvestData, final_qty: e.target.value})} className="w-full p-3 rounded-xl border border-orange-200 text-sm font-medium focus:outline-none" />
                          <select value={harvestData.quality_grade} onChange={e => setHarvestData({...harvestData, quality_grade: e.target.value})} className="w-full p-3 rounded-xl border border-orange-200 text-sm font-medium focus:outline-none">
                            <option value="A">Grade A (Premium)</option><option value="B">Grade B (Standard)</option><option value="C">Grade C (Low)</option>
                          </select>
                          <input type="number" placeholder="Selling Price ₹/unit" value={harvestData.selling_price} onChange={e => setHarvestData({...harvestData, selling_price: e.target.value})} className="w-full p-3 rounded-xl border border-orange-200 text-sm font-medium focus:outline-none" />
                          <div className="flex gap-2">
                            <button onClick={() => handleHarvest(crop._id)} className="flex-1 bg-orange-600 text-white font-bold py-3 rounded-xl text-sm hover:bg-orange-700 transition-colors">Confirm Harvest</button>
                            <button onClick={() => setHarvestingId(null)} className="px-4 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl text-sm">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => setHarvestingId(crop._id)} className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl text-sm hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 shadow-md shadow-orange-500/20">
                          <Tractor size={16}/> Mark as Harvested
                        </button>
                      )
                    )
                  ) : (
                    crop.reserved_qty >= crop.expected_yield_qty ? (
                      <button disabled className="w-full bg-gray-200 text-gray-400 font-bold py-3 rounded-xl text-sm cursor-not-allowed border border-gray-300">
                        ⏳ Already Booked
                      </button>
                    ) : (
                      <button onClick={() => navigate('/bookings')} className="w-full bg-[#006400] text-white font-bold py-3 rounded-xl hover:bg-[#004d00] transition-colors shadow-md flex items-center justify-center gap-2 mt-2">
                        📦 Book Now
                      </button>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ready Crops Section */}
        <div>
          <h3 className="text-xl font-black text-gray-800 mb-4 flex items-center gap-2"><Wheat className="text-orange-600" size={22}/> {isFarmer ? 'Ready to Sell' : 'Available Crops'}</h3>
          {readyCrops.filter(c => isFarmer || c.status === 'approved' || c.status === 'harvested').length === 0 ? (
            <div className="bg-white rounded-[2rem] p-16 text-center shadow-sm border border-gray-100">
              <Wheat className="mx-auto text-gray-300 mb-4" size={48}/>
              <h4 className="text-xl font-black text-gray-400">No ready crops yet</h4>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {readyCrops.filter(c => isFarmer || c.status === 'approved' || c.status === 'harvested').map(crop => (
                <div key={crop._id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex gap-2 mb-2">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-xl ${crop.status === 'approved' || crop.status === 'harvested' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600'}`}>{crop.status}</span>
                        {crop.quality_grade && crop.quality_grade !== 'Ungraded' && <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-xl bg-indigo-100 text-indigo-700">Grade {crop.quality_grade}</span>}
                      </div>
                      <h4 className="text-xl font-black text-gray-800 capitalize">{crop.crop_name}</h4>
                    </div>
                    <div className="bg-orange-50 p-2 rounded-xl group-hover:bg-orange-100 transition-colors"><Wheat className="text-orange-600" size={20}/></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                    <div className="bg-gray-50 p-3 rounded-xl"><p className="text-[10px] font-black text-gray-400 uppercase mb-1">Season</p><p className="font-bold text-gray-800">{crop.season}</p></div>
                    <div className="bg-gray-50 p-3 rounded-xl"><p className="text-[10px] font-black text-gray-400 uppercase mb-1">Available</p><p className="font-bold text-gray-800">{crop.available_qty || crop.stock || 0} {crop.expected_yield_unit || 'kg'}</p></div>
                    <div className="bg-gray-50 p-3 rounded-xl"><p className="text-[10px] font-black text-gray-400 uppercase mb-1">Area</p><p className="font-bold text-gray-800">{crop.area_value} {crop.area_unit}</p></div>
                    <div className="bg-green-50 border border-green-100 p-3 rounded-xl"><p className="text-[10px] font-black text-green-600 uppercase mb-1">Price/Unit</p><p className="font-black text-green-700 text-lg">₹{crop.price}</p></div>
                  </div>
                  {crop.reserved_qty > 0 && <p className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl w-max mb-3">📦 {crop.reserved_qty} {crop.expected_yield_unit || 'kg'} Reserved</p>}
                  {!isFarmer && crop.user_id && (
                    <div className="pt-4 border-t border-gray-100 flex flex-col gap-3 mt-auto">
                      <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-black text-gray-500">{(crop.user_id?.name || 'F')[0]}</div>
                        {crop.user_id?.name || 'Farmer'}
                      </div>
                      <button onClick={() => navigate('/marketplace')} className="w-full bg-[#006400] text-white font-bold py-3 rounded-xl hover:bg-[#004d00] transition-colors shadow-md flex items-center justify-center gap-2 text-sm">
                        🛒 Buy Now
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Crop Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
            <div className="px-8 py-6 bg-gray-50 border-b border-gray-100 flex justify-between items-center shrink-0">
              <h3 className="text-2xl font-black text-gray-800">List New Crop</h3>
              <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600"><XCircle size={24}/></button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 overflow-y-auto flex-grow space-y-5">
              {/* Type Toggle */}
              <div className="flex bg-gray-100 rounded-xl overflow-hidden">
                <button type="button" onClick={() => setCropType('growing')} className={`flex-1 py-3 text-sm font-bold transition-colors flex items-center justify-center gap-2 ${cropType === 'growing' ? 'bg-green-600 text-white' : 'text-gray-500 hover:bg-gray-200'}`}>
                  <Sprout size={16}/> Growing
                </button>
                <button type="button" onClick={() => setCropType('ready')} className={`flex-1 py-3 text-sm font-bold transition-colors flex items-center justify-center gap-2 ${cropType === 'ready' ? 'bg-orange-600 text-white' : 'text-gray-500 hover:bg-gray-200'}`}>
                  <Wheat size={16}/> Ready to Sell
                </button>
              </div>

              {/* Common Fields */}
              <input required placeholder="Crop Name (e.g. Wheat, Cotton)" value={form.crop_name} onChange={e => setForm({...form, crop_name: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200 font-medium text-sm focus:outline-none focus:border-green-400" />

              {myLands.length > 0 && (
                <select value={form.land_id} onChange={e => setForm({...form, land_id: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200 font-medium text-sm focus:outline-none">
                  <option value="">Link to Land (Optional)</option>
                  {myLands.map(l => <option key={l._id} value={l._id}>{l.location} — {l.area_value || l.area_in_acres} {l.area_unit || 'Acres'}</option>)}
                </select>
              )}

              <div className="grid grid-cols-2 gap-4">
                <input required type="number" placeholder="Area Value" value={form.area_value} onChange={e => setForm({...form, area_value: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200 font-medium text-sm focus:outline-none" />
                <select value={form.area_unit} onChange={e => setForm({...form, area_unit: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200 font-medium text-sm focus:outline-none">
                  <option>Bigha</option><option>Acre</option><option>Hectare</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <select value={form.season} onChange={e => setForm({...form, season: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200 font-medium text-sm focus:outline-none">
                  <option>Monsoon</option><option>Winter</option><option>Summer</option><option>All Season</option>
                </select>
                <input required type="number" placeholder="Price ₹/unit" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200 font-medium text-sm focus:outline-none" />
              </div>

              {/* Growing-specific */}
              {cropType === 'growing' && (
                <div className="bg-green-50 border border-green-100 rounded-2xl p-5 space-y-4">
                  <p className="text-[10px] font-black text-green-800 uppercase tracking-widest flex items-center gap-1"><Sprout size={12}/> Growing Crop Details</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-[10px] font-bold text-green-600 uppercase block mb-1">Sowing Date</label><input type="date" value={form.sowing_date} onChange={e => setForm({...form, sowing_date: e.target.value})} className="w-full p-3 rounded-xl border border-green-200 text-sm font-medium focus:outline-none" /></div>
                    <div><label className="text-[10px] font-bold text-green-600 uppercase block mb-1">Expected Harvest</label><input type="date" value={form.expected_harvest_date} onChange={e => setForm({...form, expected_harvest_date: e.target.value})} className="w-full p-3 rounded-xl border border-green-200 text-sm font-medium focus:outline-none" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="number" placeholder="Expected Yield Qty" value={form.expected_yield_qty} onChange={e => setForm({...form, expected_yield_qty: e.target.value})} className="w-full p-3 rounded-xl border border-green-200 text-sm font-medium focus:outline-none" />
                    <select value={form.expected_yield_unit} onChange={e => setForm({...form, expected_yield_unit: e.target.value})} className="w-full p-3 rounded-xl border border-green-200 text-sm font-medium focus:outline-none">
                      <option value="kg">KG</option><option value="quintal">Quintal</option><option value="ton">Ton</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer bg-white p-3 rounded-xl border border-green-200">
                    <input type="checkbox" checked={form.advance_booking_enabled} onChange={e => setForm({...form, advance_booking_enabled: e.target.checked})} className="w-5 h-5 accent-green-600" />
                    <span className="text-sm font-bold text-green-800">Enable Advance Booking for Buyers</span>
                  </label>
                </div>
              )}

              {/* Ready-specific */}
              {cropType === 'ready' && (
                <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 space-y-4">
                  <p className="text-[10px] font-black text-orange-800 uppercase tracking-widest flex items-center gap-1"><Wheat size={12}/> Ready Crop Details</p>
                  <input required type="number" placeholder="Available Quantity" value={form.available_qty} onChange={e => setForm({...form, available_qty: e.target.value})} className="w-full p-3 rounded-xl border border-orange-200 text-sm font-medium focus:outline-none" />
                  <select value={form.quality_grade} onChange={e => setForm({...form, quality_grade: e.target.value})} className="w-full p-3 rounded-xl border border-orange-200 text-sm font-medium focus:outline-none">
                    <option value="A">Grade A (Premium)</option><option value="B">Grade B (Standard)</option><option value="C">Grade C (Basic)</option><option value="Ungraded">Ungraded</option>
                  </select>
                </div>
              )}

              <button type="submit" className="w-full bg-[#006400] text-white font-bold py-4 rounded-xl hover:bg-[#004d00] transition-colors shadow-lg text-sm">
                Submit Crop for Approval
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Crops;
