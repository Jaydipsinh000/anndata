import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Calendar, PenTool, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

function ToolCalendarModal({ item, onClose }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [qty, setQty] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');

  if (!item) return null;

  const isRent = item._tradeType === 'Rent';
  
  let basePrice = isRent ? item.rent_price : item.price;
  
  // Calculate total days
  let days = 1;
  if (isRent && startDate && endDate) {
     const start = new Date(startDate);
     const end = new Date(endDate);
     if (end >= start) {
        days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;
     }
  }
  
  const totalPrice = isRent ? (basePrice * qty * days) : (basePrice * qty);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (isRent && !startDate) return toast.error("Please select a start date.");
    if (isRent && !endDate) return toast.error("Please select an end date.");
    if (isRent && new Date(endDate) < new Date(startDate)) return toast.error("End date cannot be before start date.");

    setLoading(true);

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const payload = {
        tool_id: item._id,
        booking_type: isRent ? 'rent' : 'purchase',
        requested_qty: qty,
        message
      };
      
      if (isRent) {
         payload.start_date = startDate;
         payload.end_date = endDate;
      }

      const res = await fetch('/api/tool-bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        toast.error(data.message || 'Booking failed.');
        setLoading(false);
      }
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-lg overflow-hidden rounded-[2rem] shadow-2xl animate-[fadeIn_0.2s_ease-out]">
        
        {success ? (
          <div className="p-12 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <ShieldCheck size={48} className="text-[#006400]" />
            </div>
            <h2 className="text-3xl font-black text-gray-800 mb-2">Booking Sent!</h2>
            <p className="text-gray-500 font-medium mb-8">The owner has received your request. It will appear in your Tool Bookings dashboard.</p>
            <button 
              onClick={onClose}
              className="w-full bg-[#006400] text-white font-bold py-4 rounded-2xl hover:bg-[#228b22] transition-colors shadow-md"
            >
              Close
            </button>
          </div>
        ) : (
          <div>
            <div className="bg-indigo-600 p-6 flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
                 <PenTool size={120} />
              </div>
              <h2 className="text-xl font-black text-white flex items-center gap-2 relative z-10">
                {isRent ? 'Schedule Tool Rental' : 'Purchase Tool'}
              </h2>
              <button onClick={onClose} className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors relative z-10 text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleBooking} className="p-8">
              <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-2xl mb-6">
                 <h3 className="font-bold text-xl text-gray-900 mb-1">{item.tool_name}</h3>
                 <p className="text-sm font-medium text-gray-500 mb-4">{item.user_id?.name}</p>
                 
                 <div className="flex justify-between items-center pt-4 border-t border-indigo-200 border-dashed">
                    <span className="font-medium text-indigo-800">Rate</span>
                    <span className="font-black text-indigo-700 text-lg">₹{basePrice.toLocaleString()} <span className="text-xs text-indigo-400 font-bold uppercase">{isRent ? `per day` : `to own`}</span></span>
                 </div>
              </div>

              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="font-bold text-gray-700 mb-2 text-xs uppercase tracking-widest block">Units Required</label>
                  <input 
                    type="number" min="1" max={item.stock} required
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-black text-lg"
                    value={qty} onChange={e => setQty(Number(e.target.value))}
                  />
                  <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase text-right">Max Stock: {item.stock}</p>
                </div>

                {isRent && (
                   <>
                     <div>
                       <label className="font-bold text-gray-700 mb-2 text-xs uppercase tracking-widest flex items-center gap-1"><Calendar size={12}/> Start Date</label>
                       <input 
                         type="date" required
                         min={new Date().toISOString().split('T')[0]}
                         className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm"
                         value={startDate} onChange={e => setStartDate(e.target.value)}
                       />
                     </div>
                     <div>
                       <label className="font-bold text-gray-700 mb-2 text-xs uppercase tracking-widest flex items-center gap-1"><Calendar size={12}/> End Date</label>
                       <input 
                         type="date" required
                         min={startDate || new Date().toISOString().split('T')[0]}
                         className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm"
                         value={endDate} onChange={e => setEndDate(e.target.value)}
                       />
                     </div>
                   </>
                )}

                <div className="col-span-2">
                  <label className="font-bold text-gray-700 mb-2 text-xs uppercase tracking-widest block">Message to Owner</label>
                  <input 
                    type="text" placeholder="Optional notes for pickup..."
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                    value={message} onChange={e => setMessage(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-between items-end mb-6 bg-gray-900 text-white p-5 rounded-2xl shadow-lg">
                 <div>
                    <span className="font-bold text-gray-400 uppercase tracking-widest text-xs flex block pb-1">Due {isRent ? 'for Booking' : 'Amount'}</span>
                    <span className="text-3xl font-black text-white flex items-baseline gap-1">₹{totalPrice.toLocaleString()} {isRent && <span className="text-sm text-gray-400">({days} days)</span>}</span>
                 </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-indigo-600 text-white font-extrabold text-lg p-5 rounded-2xl hover:bg-indigo-700 transition-colors shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? 'Processing...' : `Confirm ${isRent ? 'Rental Request' : 'Purchase'}`}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default ToolCalendarModal;
