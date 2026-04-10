import { useState, useEffect, useMemo } from 'react';
import { Truck, CheckCircle, XCircle, MessageSquare, IndianRupee, Package, Search, Loader2, Send } from 'lucide-react';
import Swal from 'sweetalert2';

function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [negotiatingId, setNegotiatingId] = useState(null);
  const [counterForm, setCounterForm] = useState({ price: '', qty: '', message: '' });
  const [filterStatus, setFilterStatus] = useState('all');
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings/admin', { headers: { Authorization: `Bearer ${userInfo.token}` } });
      if (res.ok) { const data = await res.json(); setBookings(Array.isArray(data) ? data : []); }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleUpdateStatus = async (id, status, message) => {
    try {
      let msg = message;
      if (msg === undefined) {
         const { value: text } = await Swal.fire({
           title: 'Admin Note',
           input: 'text',
           inputPlaceholder: 'Optional admin note...',
           showCancelButton: true,
           confirmButtonColor: '#006400'
         });
         if (text === undefined) return; // User cancelled
         msg = text;
      }

      await fetch(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
        body: JSON.stringify({ status, message: msg })
      });
      fetchBookings();
    } catch (e) { console.error(e); }
  };

  const handleNegotiate = async (id) => {
    try {
      await fetch(`/api/bookings/${id}/negotiate`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
        body: JSON.stringify(counterForm)
      });
      setNegotiatingId(null);
      setCounterForm({ price: '', qty: '', message: '' });
      fetchBookings();
    } catch (e) { console.error(e); }
  };

  const stats = useMemo(() => {
    let pending = 0, negotiating = 0, accepted = 0, total = bookings.length;
    bookings.forEach(b => {
      if (b.status === 'pending') pending++;
      if (b.status === 'negotiating') negotiating++;
      if (['accepted', 'completed', 'buyer_confirmed'].includes(b.status)) accepted++;
    });
    return { total, pending, negotiating, accepted };
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    if (filterStatus === 'all') return bookings;
    return bookings.filter(b => b.status === filterStatus);
  }, [bookings, filterStatus]);

  const statusColor = (s) => {
    if (['accepted','completed','buyer_confirmed'].includes(s)) return 'bg-green-100 text-green-700';
    if (s === 'negotiating') return 'bg-indigo-100 text-indigo-700';
    if (s === 'rejected') return 'bg-red-100 text-red-700';
    return 'bg-orange-100 text-orange-700';
  };

  if (loading) return <div className="p-8 font-bold text-gray-500 flex items-center gap-2"><Loader2 className="animate-spin" size={20}/> Loading Deal Desk...</div>;

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm text-center">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Orders</p>
          <p className="text-3xl font-black text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-orange-50/50 p-5 rounded-[2rem] border border-orange-100 shadow-sm text-center">
          <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Pending</p>
          <p className="text-3xl font-black text-orange-700">{stats.pending}</p>
        </div>
        <div className="bg-indigo-50/50 p-5 rounded-[2rem] border border-indigo-100 shadow-sm text-center">
          <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Negotiating</p>
          <p className="text-3xl font-black text-indigo-700">{stats.negotiating}</p>
        </div>
        <div className="bg-green-50/50 p-5 rounded-[2rem] border border-green-100 shadow-sm text-center">
          <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1">Deals Closed</p>
          <p className="text-3xl font-black text-green-700">{stats.accepted}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm w-max">
        {['all', 'pending', 'negotiating', 'accepted', 'rejected'].map(tab => (
          <button key={tab} onClick={() => setFilterStatus(tab)} className={`px-5 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${filterStatus === tab ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredBookings.map(book => (
          <div key={book._id} className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-100">
              <div>
                <h4 className="font-black text-xl text-gray-800">{book.crop_id?.crop_name || 'Unknown Crop'}</h4>
                <p className="text-xs text-gray-500 font-medium mt-1">{book.order_type === 'advance_booking' ? '🌱 Advance Booking' : '🌾 Marketplace Purchase'}</p>
              </div>
              <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${statusColor(book.status)}`}>
                {(book.status || '').replace(/_/g, ' ')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-2xl mb-4">
              <div><p className="text-[10px] font-black text-gray-400 uppercase">Farmer</p><p className="font-bold text-gray-800">{book.farmer_id?.name} <span className="text-gray-400 text-xs">({book.farmer_id?.mobile})</span></p></div>
              <div><p className="text-[10px] font-black text-gray-400 uppercase">Buyer</p><p className="font-bold text-gray-800">{book.buyer_id?.name} <span className="text-gray-400 text-xs">({book.buyer_id?.mobile})</span></p></div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-green-50 border border-green-100 p-3 rounded-xl text-center">
                <p className="text-[10px] font-black text-green-600 uppercase mb-1">Offered Price</p>
                <p className="font-black text-green-700 text-lg">₹{book.offered_price}</p>
              </div>
              <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl text-center">
                <p className="text-[10px] font-black text-blue-600 uppercase mb-1">Qty</p>
                <p className="font-black text-blue-700 text-lg">{book.requested_qty}</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl text-center">
                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Total Value</p>
                <p className="font-black text-gray-800 text-lg">₹{((book.requested_qty || 0) * (book.offered_price || 0)).toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* Negotiation Log (Chat View) */}
            {book.negotiation_log && book.negotiation_log.length > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-[1.5rem] p-4 mb-4 flex flex-col gap-3 max-h-48 overflow-y-auto custom-scrollbar shadow-inner">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center sticky top-0 bg-gray-50/90 py-1 z-10 backdrop-blur-sm rounded-lg">Negotiation History</p>
                {book.negotiation_log.map((entry, i) => {
                  const isAdmin = entry.by === 'admin';
                  return (
                    <div key={i} className={`flex flex-col w-3/4 ${isAdmin ? 'self-end items-end' : 'self-start items-start'}`}>
                       <span className="text-[10px] font-black uppercase text-gray-400 mb-1 px-1 tracking-widest">
                         {isAdmin ? 'System Admin' : 'Buyer'} &bull; {new Date(entry.date || Date.now()).toLocaleDateString()}
                       </span>
                       <div className={`p-3 rounded-2xl text-xs font-medium shadow-sm border ${isAdmin ? 'bg-[#006400] text-white border-[#004d00] rounded-tr-sm' : 'bg-white text-gray-800 border-gray-200 rounded-tl-sm'}`}>
                          <p className="font-black text-sm mb-1">
                             <span className={isAdmin ? 'text-green-200' : 'text-gray-400'}>₹</span>{entry.price} 
                             <span className={isAdmin ? 'text-green-300 mx-1' : 'text-gray-300 mx-1'}>×</span> 
                             {entry.qty} units
                          </p>
                          <p className={`italic ${isAdmin ? 'text-green-50' : 'text-gray-600'}`}>"{entry.message || 'No additional note'}"</p>
                       </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Counter-Offer Panel */}
            {negotiatingId === book._id && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 space-y-3 mb-4 animate-[fadeIn_0.3s_ease-out]">
                <p className="text-xs font-black text-indigo-800 uppercase tracking-widest flex items-center gap-1"><MessageSquare size={14}/> Send Counter-Offer</p>
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" placeholder="Your Price ₹" value={counterForm.price} onChange={e => setCounterForm({...counterForm, price: e.target.value})} className="p-3 rounded-xl border border-indigo-200 text-sm font-medium focus:outline-none" />
                  <input type="number" placeholder="Qty" value={counterForm.qty} onChange={e => setCounterForm({...counterForm, qty: e.target.value})} className="p-3 rounded-xl border border-indigo-200 text-sm font-medium focus:outline-none" />
                </div>
                <input type="text" placeholder="Message to buyer..." value={counterForm.message} onChange={e => setCounterForm({...counterForm, message: e.target.value})} className="w-full p-3 rounded-xl border border-indigo-200 text-sm font-medium focus:outline-none" />
                <div className="flex gap-2">
                  <button onClick={() => handleNegotiate(book._id)} className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl text-xs hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1"><Send size={14}/> Send Counter</button>
                  <button onClick={() => setNegotiatingId(null)} className="px-4 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl text-xs">Cancel</button>
                </div>
              </div>
            )}

            {/* Actions */}
            {!['completed', 'rejected', 'buyer_confirmed'].includes(book.status) && (
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button onClick={() => setNegotiatingId(book._id)} className="flex-1 py-2.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1">
                  <MessageSquare size={14}/> Negotiate
                </button>
                <button onClick={() => handleUpdateStatus(book._id, 'accepted')} className="flex-1 py-2.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1">
                  <CheckCircle size={14}/> Accept Deal
                </button>
                <button onClick={() => handleUpdateStatus(book._id, 'rejected')} className="py-2.5 px-4 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-bold text-xs transition-colors">
                  <XCircle size={14}/>
                </button>
              </div>
            )}
            {book.status === 'accepted' && (
              <button onClick={() => handleUpdateStatus(book._id, 'completed', 'Final settlement confirmed by admin.')} className="w-full mt-4 py-3 bg-[#006400] text-white hover:bg-[#004d00] rounded-xl font-bold text-xs transition-colors shadow-md">
                Finalize & Complete Sale
              </button>
            )}
          </div>
        ))}
        {filteredBookings.length === 0 && <div className="col-span-full bg-white rounded-[2rem] p-16 text-center font-bold text-gray-400 border border-gray-100 shadow-sm text-xl italic">No orders matching this filter.</div>}
      </div>
    </div>
  );
}

export default ManageBookings;
