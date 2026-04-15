import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Store, ShoppingCart, Sprout, Wheat, MapPin, Tag, Package, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import CheckoutModal from '../components/CheckoutModal';

function Marketplace() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); // all, ready, growing
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [organicFilter, setOrganicFilter] = useState(false);
  
  // Advance Booking Modal
  const [bookingModal, setBookingModal] = useState(null);
  const [checkoutItem, setCheckoutItem] = useState(null);
  const [bidForm, setBidForm] = useState({ requested_qty: '', offered_price: '' });

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

  useEffect(() => {
    fetch('/api/crops') // This fetches all globally approved crops
      .then(res => res.json())
      .then(data => setCrops(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handlePlaceBooking = async (e) => {
    e.preventDefault();
    if (!userInfo) return navigate('/login');
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        },
        body: JSON.stringify({
          crop_id: bookingModal._id,
          farmer_id: bookingModal.user_id._id,
          requested_qty: bidForm.requested_qty,
          offered_price: bidForm.offered_price,
          order_type: 'advance_booking'
        })
      });
      if (res.ok) {
        setBookingModal(null);
        navigate('/bookings');
      }
    } catch (err) { console.error(err); }
  };

  const handleBuyNow = async (crop) => {
    if (!userInfo) return navigate('/login');
    const toastId = toast.loading('Connecting securely to server...');
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        },
        body: JSON.stringify({
          crop_id: crop._id,
          farmer_id: crop.user_id?._id || crop.user_id,
          order_type: 'marketplace_purchase',
          requested_qty: 1,
          offered_price: crop.price,
          requirements: 'Direct marketplace purchase'
        })
      });

      if (res.ok) {
        const booking = await res.json();
        toast.dismiss(toastId);
        setCheckoutItem({ ...crop, booking_id: booking._id, quantity: crop.available_qty || crop.stock, unit: crop.expected_yield_unit || 'kg', price_per_unit: crop.price });
      } else {
        toast.error('Unable to connect to server. Please try again.', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error('Unable to connect to server. Please try again.', { id: toastId });
    }
  };

  const filteredCrops = crops.filter(c => {
    if (filterType === 'ready' && c.type === 'growing') return false;
    if (filterType === 'growing' && c.type !== 'growing') return false;
    if (categoryFilter !== 'All' && (c.category || 'Other') !== categoryFilter) return false;
    if (organicFilter && !c.is_organic) return false;
    if (searchTerm && !c.crop_name?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const readyCrops = filteredCrops.filter(c => c.type !== 'growing');
  const growingCrops = filteredCrops.filter(c => c.type === 'growing');

  if (loading) return <div className="min-h-screen bg-[#f8fafc]"><Navbar /><div className="text-center py-20 font-bold animate-pulse">Loading Trading Floor...</div></div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-20">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-[#004d00] py-20 px-4 mb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/background.png')] bg-cover mix-blend-overlay opacity-10"></div>
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-green-100 font-bold mb-6 border border-white/20 backdrop-blur-md">
            <Store size={18} /> Central Market
          </div>
          <h2 className="text-white text-4xl md:text-6xl font-black mb-4 leading-tight">National Crop Exchange</h2>
          <p className="text-green-100 text-lg font-medium max-w-2xl">Purchase harvested crops for immediate delivery or place advance bookings on growing fields to secure your supply chain.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Filters */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-10 relative z-20 -mt-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
             <div className="relative w-full md:w-1/2">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input type="text" placeholder="Search for wheat, rice, corn..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-[#006400] transition-all font-medium" />
             </div>
             
             <div className="flex gap-2 w-full md:w-auto bg-gray-100 p-1.5 rounded-2xl overflow-x-auto shrink-0">
               <button onClick={() => setFilterType('all')} className={`px-6 py-2.5 rounded-xl font-bold transition-colors whitespace-nowrap ${filterType === 'all' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}>All Assets</button>
               <button onClick={() => setFilterType('ready')} className={`px-6 py-2.5 rounded-xl font-bold transition-colors whitespace-nowrap flex items-center gap-2 ${filterType === 'ready' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}><Wheat size={16}/> Ready Crops</button>
               <button onClick={() => setFilterType('growing')} className={`px-6 py-2.5 rounded-xl font-bold transition-colors whitespace-nowrap flex items-center gap-2 ${filterType === 'growing' ? 'bg-green-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}><Sprout size={16}/> Advance Bookings</button>
             </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-100">
             <div className="flex items-center gap-2">
               <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Category:</span>
               <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold text-gray-700 outline-none focus:border-green-500">
                 <option value="All">All Categories</option>
                 <option value="Grains">Grains</option>
                 <option value="Vegetables">Vegetables</option>
                 <option value="Fruits">Fruits</option>
                 <option value="Spices">Spices</option>
                 <option value="Other">Other</option>
               </select>
             </div>
             
             <label className="flex items-center gap-2 cursor-pointer group">
               <div className={`w-10 h-6 flex items-center bg-gray-300 rounded-full p-1 duration-300 ease-in-out ${organicFilter ? 'bg-green-500' : ''}`}>
                 <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${organicFilter ? 'translate-x-4' : ''}`}></div>
               </div>
               <span className="text-sm font-bold text-gray-600 group-hover:text-green-600 transition-colors">Organic Certified Only</span>
             </label>
          </div>
        </div>

        {/* Ready Crops */}
        {(filterType === 'all' || filterType === 'ready') && readyCrops.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-2"><Wheat className="text-orange-600" size={28}/> Immediate Sale</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {readyCrops.map(crop => (
                <div key={crop._id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all group flex flex-col relative justify-between">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="text-xl font-black text-gray-800 capitalize">{crop.crop_name}</h3>
                       <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-700">Ready</span>
                    </div>
                    <div className="space-y-3 mb-6 mt-4">
                       <div className="bg-gray-50 p-3 rounded-2xl flex justify-between items-center text-sm">
                         <span className="text-gray-500 font-bold">Available Qty</span>
                         <span className="font-black text-gray-800">{crop.available_qty || crop.stock || 0} {crop.expected_yield_unit || 'kg'}</span>
                       </div>
                       <div className="bg-gray-50 p-3 rounded-2xl flex justify-between items-center text-sm">
                         <span className="text-gray-500 font-bold">Quality</span>
                         <span className="font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded uppercase">{crop.quality_grade || 'A'}</span>
                       </div>
                       <div className="bg-gray-50 p-3 rounded-2xl flex justify-between items-center text-sm">
                         <span className="text-gray-500 font-bold">Price</span>
                         <span className="font-black text-green-700 text-lg">₹{crop.price}</span>
                       </div>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 border-t border-gray-100">
                    <button onClick={() => handleBuyNow(crop)} className="w-full py-3 bg-[#006400] hover:bg-[#004d00] text-white rounded-xl font-black transition-colors flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5">
                       <ShoppingCart size={18} /> Buy Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Growing Crops */}
        {(filterType === 'all' || filterType === 'growing') && growingCrops.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-2"><Sprout className="text-green-600" size={28}/> Advance Bookings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {growingCrops.map(crop => (
                <div key={crop._id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all group flex flex-col justify-between relative border-t-4 border-t-green-500">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="text-xl font-black text-gray-800 capitalize">{crop.crop_name}</h3>
                       <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-green-100 text-green-700">Growing</span>
                    </div>
                    <div className="space-y-3 mb-6 mt-4">
                       <div className="bg-gray-50 p-3 rounded-2xl flex justify-between items-center text-sm">
                         <span className="text-gray-500 font-bold">Est. Yield</span>
                         <span className="font-black text-gray-800">{crop.expected_yield_qty} {crop.expected_yield_unit}</span>
                       </div>
                       <div className="bg-gray-50 p-3 rounded-2xl flex flex-col gap-1 text-sm">
                         <span className="text-gray-500 font-bold">Est. Harvest Date</span>
                         <span className="font-black text-gray-800">{crop.expected_harvest_date ? new Date(crop.expected_harvest_date).toLocaleDateString() : 'TBD'}</span>
                       </div>
                       <div className="bg-gray-50 p-3 rounded-2xl flex flex-col gap-1 text-sm bg-green-50/50">
                         <span className="text-green-600 font-bold text-xs uppercase">Asking Price</span>
                         <span className="font-black text-green-700 text-xl">₹{crop.price}</span>
                       </div>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 border-t border-green-100">
                    {crop.reserved_qty >= crop.expected_yield_qty ? (
                      <button disabled className="w-full py-3 bg-gray-200 text-gray-500 rounded-xl font-black cursor-not-allowed border border-gray-300">
                        ⏳ Already Booked
                      </button>
                    ) : (
                      <button onClick={() => { setBookingModal(crop); setBidForm({ offered_price: crop.price, requested_qty: crop.expected_yield_qty }); }} className="w-full py-3 bg-[#FF9800] hover:bg-[#F57C00] text-white rounded-xl font-black transition-colors flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5 shadow-orange-500/20">
                         <Package size={18} /> Book Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Booking Modal */}
      {bookingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl p-8 border border-gray-100 relative">
            <h3 className="text-2xl font-black text-gray-800 mb-2">Advance Booking</h3>
            <p className="text-gray-500 text-sm font-medium mb-6">You are placing a pre-harvest bid for <span className="font-bold text-gray-700">{bookingModal.crop_name}</span>. The admin desk will negotiate and finalize your contract.</p>
            
            <form onSubmit={handlePlaceBooking} className="space-y-4">
              <div className="bg-green-50 p-4 rounded-2xl border border-green-100 flex justify-between items-center mb-6">
                <span className="text-green-800 font-bold text-sm">Asking Price is</span>
                <span className="text-2xl font-black text-green-700">₹{bookingModal.price}</span>
              </div>

              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">Your Offer Price (₹)</label>
                <input required type="number" min="0" value={bidForm.offered_price} onChange={e => setBidForm({...bidForm, offered_price: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-lg font-black focus:outline-none focus:ring-2 focus:ring-[#FF9800] transition-shadow"/>
              </div>

              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">Required Quantity ({bookingModal.expected_yield_unit})</label>
                <input required type="number" min="1" max={bookingModal.expected_yield_qty} value={bidForm.requested_qty} onChange={e => setBidForm({...bidForm, requested_qty: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-lg font-black focus:outline-none focus:ring-2 focus:ring-[#FF9800] transition-shadow"/>
              </div>

              <div className="flex gap-3 pt-4 mt-2 border-t border-gray-100">
                <button type="submit" className="flex-1 bg-[#FF9800] hover:bg-[#F57C00] text-white py-4 rounded-xl font-black transition-colors shadow-md shadow-orange-500/20 text-sm">Pay Deposit & Send Bid</button>
                <button type="button" onClick={() => setBookingModal(null)} className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-bold text-sm transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {checkoutItem && <CheckoutModal item={checkoutItem} onClose={() => setCheckoutItem(null)} />}
    </div>
  );
}

export default Marketplace;
