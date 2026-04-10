import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { Loader2, Mail, CheckCircle, XCircle, Clock, Send, ShieldCheck, User, IndianRupee, Package, MessageSquare, Sprout, Wheat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [growingCrops, setGrowingCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingModal, setBookingModal] = useState(null);
  const [bidForm, setBidForm] = useState({ requested_qty: '', offered_price: '', requirements: '' });
  const [submitting, setSubmitting] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
  const navigate = useNavigate();
  const isBuyer = userInfo?.role === 'buyer';

  useEffect(() => {
    if(!userInfo) return navigate('/login');
    fetchBookings();
    if(isBuyer) fetchGrowingCrops();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings/my', { headers: { Authorization: `Bearer ${userInfo.token}` } });
      if (res.ok) { const data = await res.json(); setBookings(Array.isArray(data) ? data : []); }
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchGrowingCrops = async () => {
    try {
      const res = await fetch('/api/crops/growing');
      if (res.ok) { const data = await res.json(); setGrowingCrops(Array.isArray(data) ? data : []); }
    } catch(e) { console.error(e); }
  };

  const handleUpdateStatus = async (id, status) => {
    if (!window.confirm(`Are you sure you want to ${status} this request?`)) return;
    try {
      await fetch(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
        body: JSON.stringify({ status })
      });
      fetchBookings();
    } catch(e) { console.error(e); }
  };

  const handlePlaceBooking = async (crop) => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
        body: JSON.stringify({
          crop_id: crop._id,
          farmer_id: crop.user_id?._id || crop.user_id,
          order_type: 'advance_booking',
          requested_qty: Number(bidForm.requested_qty),
          offered_price: Number(bidForm.offered_price),
          requirements: bidForm.requirements,
          estimated_cost: Number(bidForm.requested_qty) * Number(bidForm.offered_price)
        })
      });
      if (res.ok) {
        setBookingModal(null);
        setBidForm({ requested_qty: '', offered_price: '', requirements: '' });
        fetchBookings();
        toast.success("Booking placed successfully!");
      } else {
        const err = await res.json();
        toast.error(err.message || 'Booking failed');
      }
    } catch(e) { console.error(e); }
    finally { setSubmitting(false); }
  };

  const statusColor = (s) => {
    if (['accepted','completed','buyer_confirmed'].includes(s)) return 'bg-green-100 text-green-700';
    if (s === 'negotiating') return 'bg-indigo-100 text-indigo-700';
    if (s === 'rejected') return 'bg-red-100 text-red-700';
    return 'bg-orange-100 text-orange-700';
  };

  if (loading) return <div className="min-h-screen bg-[#f8fafc]"><Navbar /><div className="flex justify-center py-20"><Loader2 className="w-12 h-12 text-[#006400] animate-spin" /></div></div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-20">
      <Navbar />

      <div className="bg-gradient-to-r from-[#004d00] to-[#2ecc71] py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/background.png')] bg-cover mix-blend-overlay opacity-20"></div>
        <h2 className="text-white text-4xl md:text-5xl font-extrabold mb-2 relative z-10 drop-shadow-md">Advance Bookings</h2>
        <p className="text-green-100 text-lg relative z-10">Book future crops and track your negotiation pipeline.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">

        {/* Growing Crops Available for Booking (Buyer Only) */}
        {isBuyer && growingCrops.length > 0 && (
          <div className="mb-10">
            <h3 className="text-xl font-black text-gray-800 mb-4 flex items-center gap-2"><Sprout className="text-green-600" size={22}/> Future Crops Available for Booking</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {growingCrops.map(crop => (
                <div key={crop._id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-green-100 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-green-700 bg-green-100 px-3 py-1 rounded-xl">Growing</span>
                      <h4 className="text-xl font-black text-gray-800 mt-2 capitalize">{crop.crop_name}</h4>
                      <p className="text-xs text-gray-500 font-medium mt-1">{crop.user_id?.name} • {crop.land_id?.location || 'Unknown'}</p>
                    </div>
                    <Sprout className="text-green-500" size={24}/>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                    <div className="bg-gray-50 p-3 rounded-xl"><p className="text-[10px] font-black text-gray-400 uppercase mb-1">Expected Yield</p><p className="font-bold text-gray-800">{crop.expected_yield_qty} {crop.expected_yield_unit}</p></div>
                    <div className="bg-gray-50 p-3 rounded-xl"><p className="text-[10px] font-black text-gray-400 uppercase mb-1">Harvest Date</p><p className="font-bold text-gray-800">{crop.expected_harvest_date ? new Date(crop.expected_harvest_date).toLocaleDateString() : 'TBD'}</p></div>
                    <div className="bg-green-50 border border-green-100 p-3 rounded-xl col-span-2"><p className="text-[10px] font-black text-green-600 uppercase mb-1">Expected Price/Unit</p><p className="font-black text-green-700 text-xl">₹{crop.price}</p></div>
                  </div>
                  <button onClick={() => { setBookingModal(crop); setBidForm({...bidForm, offered_price: crop.price}); }} className="w-full bg-[#006400] text-white font-bold py-3 rounded-xl hover:bg-[#004d00] transition-colors shadow-md flex items-center justify-center gap-2">
                    <Package size={16}/> Place Advance Booking
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Booking Contracts */}
        <h3 className="text-xl font-black text-gray-800 mb-4 flex items-center gap-2"><Mail className="text-indigo-600" size={22}/> My Booking Contracts</h3>
        {bookings.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-16 text-center shadow-sm border border-gray-100">
            <Mail className="mx-auto text-gray-300 mb-4" size={48}/>
            <h4 className="text-xl font-black text-gray-400">No bookings yet</h4>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map(b => (
              <div key={b._id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-100">
                  <div>
                    <h4 className="text-xl font-black text-gray-800">{b.crop_id?.crop_name || 'Unknown Crop'}</h4>
                    <p className="text-xs text-gray-500 font-medium mt-1">{b.order_type === 'advance_booking' ? '🌱 Advance Booking' : '🌾 Purchase'}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${statusColor(b.status)}`}>
                    {(b.status || '').replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div className="bg-gray-50 p-3 rounded-xl"><p className="text-[10px] font-black text-gray-400 uppercase mb-1">Qty</p><p className="font-bold text-gray-800">{b.requested_qty || '-'} {b.crop_id?.expected_yield_unit || 'kg'}</p></div>
                  <div className="bg-green-50 border border-green-100 p-3 rounded-xl"><p className="text-[10px] font-black text-green-600 uppercase mb-1">Offered Price</p><p className="font-black text-green-700">₹{b.offered_price || b.estimated_cost}</p></div>
                </div>

                {/* Negotiation Log */}
                {b.negotiation_log && b.negotiation_log.length > 1 && (
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-4">
                    <p className="text-[10px] font-black text-indigo-800 uppercase tracking-widest mb-2 flex items-center gap-1"><MessageSquare size={12}/> Negotiation History</p>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {b.negotiation_log.map((entry, i) => (
                        <div key={i} className={`text-xs p-2 rounded-lg ${entry.by === 'admin' ? 'bg-white border border-indigo-200 text-indigo-700' : 'bg-indigo-100 text-indigo-600'}`}>
                          <span className="font-black uppercase">{entry.by}</span>: ₹{entry.price} × {entry.qty} — {entry.message}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {b.admin_message && (
                  <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 mb-4">
                    <p className="text-[10px] font-black text-blue-800 uppercase mb-1">Admin Notes</p>
                    <p className="text-sm text-blue-700 font-medium">{b.admin_message}</p>
                  </div>
                )}

                {/* Farmer Actions */}
                {userInfo.role === 'farmer' && b.status === 'pending' && (
                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <button onClick={() => handleUpdateStatus(b._id, 'rejected')} className="flex-1 py-3 text-red-600 font-bold bg-red-50 hover:bg-red-100 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
                      <XCircle size={16}/> Decline
                    </button>
                    <button onClick={() => handleUpdateStatus(b._id, 'farmer_accepted')} className="flex-1 py-3 text-white font-bold bg-[#006400] hover:bg-[#004d00] rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 text-sm">
                      <CheckCircle size={16}/> Accept
                    </button>
                  </div>
                )}

                {/* Buyer Confirm (when farmer harvested) */}
                {isBuyer && b.status === 'farmer_harvested' && (
                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <button onClick={() => handleUpdateStatus(b._id, 'rejected')} className="flex-1 py-3 text-red-600 font-bold bg-red-50 hover:bg-red-100 rounded-xl transition-colors text-sm">Release</button>
                    <button onClick={() => handleUpdateStatus(b._id, 'buyer_confirmed')} className="flex-1 py-3 text-white font-bold bg-green-600 hover:bg-green-700 rounded-xl transition-colors shadow-md text-sm">Confirm Purchase</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {bookingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-gray-800">Place Advance Bid</h3>
              <button onClick={() => setBookingModal(null)} className="text-gray-400 hover:text-gray-600"><XCircle size={24}/></button>
            </div>

            <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-6">
              <p className="text-xs font-black text-green-800 uppercase tracking-widest mb-1">{bookingModal.crop_name}</p>
              <p className="text-sm text-green-700 font-medium">Available: {bookingModal.expected_yield_qty} {bookingModal.expected_yield_unit} • Listed at ₹{bookingModal.price}/{bookingModal.expected_yield_unit}</p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Quantity You Want ({bookingModal.expected_yield_unit})</label>
                <input type="number" value={bidForm.requested_qty} onChange={e => setBidForm({...bidForm, requested_qty: e.target.value})} placeholder="e.g. 100" className="w-full p-4 rounded-xl border border-gray-200 font-medium text-sm focus:outline-none focus:border-green-400" />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Your Offered Price (₹ per {bookingModal.expected_yield_unit})</label>
                <input type="number" value={bidForm.offered_price} onChange={e => setBidForm({...bidForm, offered_price: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200 font-medium text-sm focus:outline-none focus:border-green-400" />
              </div>
              <textarea placeholder="Optional: requirements, delivery notes..." value={bidForm.requirements} onChange={e => setBidForm({...bidForm, requirements: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200 font-medium text-sm focus:outline-none min-h-[80px]" />

              {bidForm.requested_qty && bidForm.offered_price && (
                <div className="bg-gray-50 p-4 rounded-xl text-center">
                  <p className="text-xs text-gray-500 font-bold mb-1">Estimated Total</p>
                  <p className="text-2xl font-black text-[#006400]">₹{(Number(bidForm.requested_qty) * Number(bidForm.offered_price)).toLocaleString('en-IN')}</p>
                </div>
              )}
            </div>

            <button disabled={submitting || !bidForm.requested_qty || !bidForm.offered_price} onClick={() => handlePlaceBooking(bookingModal)} className="w-full bg-[#006400] text-white font-bold py-4 rounded-xl hover:bg-[#004d00] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? 'Submitting...' : 'Submit Booking Bid'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bookings;
