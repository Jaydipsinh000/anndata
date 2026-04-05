import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Loader2, Mail, CheckCircle, XCircle, Clock, Send, ShieldCheck, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const navigate = useNavigate();

  useEffect(() => {
    if(!userInfo) return navigate('/login');
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings/my', {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      if(!window.confirm(`Are you sure you want to ${status} this request?`)) return;
      
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
        body: JSON.stringify({ status })
      });
      if(res.ok) fetchBookings();
    } catch(e) { console.error(e); }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-20">
      <Navbar />
      <div className="bg-gradient-to-r from-[#004d00] to-[#2ecc71] py-16 px-4 mb-12 shadow-inner">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-white text-5xl font-black mb-4">Advance Bookings</h2>
          <p className="text-green-100 text-xl font-medium max-w-2xl mx-auto">Track your crop pre-booking contracts and Expressions of Interest.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-12 h-12 text-[#006400] animate-spin" /></div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
             <Mail className="mx-auto text-gray-300 mb-4" size={64} />
             <h3 className="text-2xl font-bold text-gray-800">No Bookings Found</h3>
             <p className="text-gray-500">You don't have any Advance Booking contracts yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map(b => (
              <div key={b._id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-shadow relative overflow-hidden">
                <div className="flex justify-between items-start mb-4 border-b border-gray-50 pb-4">
                   <div>
                     <h3 className="text-xl font-bold text-[#1b431b]">{b.crop_id?.crop_name || 'Deleted Crop'}</h3>
                     <p className="text-sm font-medium text-gray-500">Vol: {b.crop_id?.expected_yield} kg</p>
                   </div>
                   <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider ${
                     b.status === 'farmer_accepted' ? 'bg-blue-100 text-blue-700' :
                     b.status === 'admin_approved' ? 'bg-green-100 text-green-700' :
                     b.status === 'rejected' ? 'bg-red-100 text-red-700' :
                     'bg-orange-100 text-orange-700'
                   }`}>
                     {b.status.replace('_', ' ')}
                   </span>
                </div>

                <div className="space-y-3 mb-6">
                   <div className="flex items-start gap-3">
                     <User className="text-gray-400 mt-1" size={18} />
                     <div>
                       <p className="text-xs font-bold text-gray-400 uppercase">Buyer</p>
                       <p className="text-gray-800 font-medium">{b.buyer_id?.name} ({b.buyer_id?.mobile})</p>
                     </div>
                   </div>
                   <div className="flex items-start gap-3">
                     <ShieldCheck className="text-gray-400 mt-1" size={18} />
                     <div>
                       <p className="text-xs font-bold text-gray-400 uppercase">Estimated Value</p>
                       <p className="text-lg font-bold text-[#006400]">₹{b.estimated_cost?.toLocaleString()}</p>
                     </div>
                   </div>
                   <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl">
                     <Clock className="text-gray-400 mt-0.5" size={16} />
                     <div className="flex-1">
                       <p className="text-xs font-bold text-gray-500 uppercase mb-1">Buyer Notes & Requirements</p>
                       <p className="text-gray-700 text-sm">{b.requirements || 'No specific requirements.'}</p>
                     </div>
                   </div>
                   
                   {b.admin_message && (
                     <div className="bg-red-50 p-4 rounded-xl border border-red-100 mt-2">
                       <p className="text-xs font-black text-red-800 uppercase mb-1">Admin Notes</p>
                       <p className="text-sm text-red-700 font-medium">{b.admin_message}</p>
                     </div>
                   )}
                </div>

                {userInfo.role === 'farmer' && b.status === 'pending' && (
                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <button onClick={() => handleUpdateStatus(b._id, 'rejected')} className="flex-1 py-3 text-red-600 font-bold bg-red-50 hover:bg-red-100 rounded-xl transition-colors flex items-center justify-center gap-2">
                      <XCircle size={18}/> Decline
                    </button>
                    <button onClick={() => handleUpdateStatus(b._id, 'farmer_accepted')} className="flex-1 py-3 text-white font-bold bg-[#006400] hover:bg-[#004d00] rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2">
                      <CheckCircle size={18}/> Express Interest
                    </button>
                  </div>
                )}
                
                {b.status === 'farmer_accepted' && (
                  <div className="bg-blue-50 text-blue-700 font-medium text-sm p-4 rounded-xl flex items-center gap-3 border border-blue-100">
                     <Send size={18} className="text-blue-500" />
                     Sent to admin for legal drafting.
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Bookings;
