import { useState, useEffect } from 'react';
import { Truck, CheckCircle, XCircle } from 'lucide-react';

function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings/admin', {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const message = prompt('Optional admin note for the parties involved:');
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
        body: JSON.stringify({ status, message })
      });
      if (res.ok) fetchBookings();
    } catch (e) { console.error(e); }
  };

  if (loading) return <div className="p-8 font-bold text-gray-500">Loading Bookings...</div>;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
        <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
          <Truck size={24} />
        </div>
        <h2 className="text-2xl font-black text-gray-800 tracking-tight">Advance Bookings (EOI)</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bookings.map(book => (
          <div key={book._id} className="border border-gray-100 p-5 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-lg text-gray-800">{book.crop_id?.crop_name}</span>
                <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${
                  book.status === 'pending' ? 'bg-orange-50 text-orange-600' :
                  book.status === 'farmer_accepted' ? 'bg-blue-50 text-blue-600' :
                  book.status === 'admin_approved' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                }`}>
                  {book.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2 mb-4">Cost: <b>₹{book.estimated_cost}</b></p>
              
              <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-3 rounded-xl mb-4">
                 <div><span className="text-gray-400 block text-xs font-bold">Farmer</span> <b>{book.farmer_id?.name} ({book.farmer_id?.mobile})</b></div>
                 <div><span className="text-gray-400 block text-xs font-bold">Buyer</span> <b>{book.buyer_id?.name} ({book.buyer_id?.mobile})</b></div>
              </div>
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
              <button onClick={() => handleUpdateStatus(book._id, 'admin_approved')} className="flex-1 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg font-bold text-sm transition-colors">
                Finalize Contract
              </button>
              <button onClick={() => handleUpdateStatus(book._id, 'rejected')} className="flex-1 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-bold text-sm transition-colors">
                Reject
              </button>
            </div>
          </div>
        ))}
        {bookings.length === 0 && <p className="text-gray-500 font-medium">No bookings found.</p>}
      </div>
    </div>
  );
}

export default ManageBookings;
