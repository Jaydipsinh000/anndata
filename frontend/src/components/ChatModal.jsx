import { useState, useEffect, useRef } from 'react';
import { XCircle, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

function ChatModal({ booking, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/messages/${booking._id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error("Failed to fetch messages", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // Poll every 5 seconds for Vercel compatibility instead of WebSockets
    const intervalId = setInterval(fetchMessages, 5000);
    return () => clearInterval(intervalId);
  }, [booking._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        },
        body: JSON.stringify({
          booking_id: booking._id,
          text: newMessage
        })
      });
      if (res.ok) {
        const data = await res.json();
        setMessages([...messages, data]);
        setNewMessage('');
      } else {
        toast.error("Failed to send message");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-[2rem] w-full max-w-lg h-[80vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#004d00] to-[#2ecc71] p-6 flex justify-between items-center text-white shrink-0">
          <div>
            <h3 className="text-xl font-black">Deal Discussion</h3>
            <p className="text-green-100 text-xs font-bold uppercase tracking-wider">{booking.crop_id?.crop_name} • Order #{booking._id.substring(18)}</p>
          </div>
          <button onClick={onClose} className="text-white hover:text-green-200 transition-colors bg-white/10 p-2 rounded-full">
            <XCircle size={24}/>
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50/50 space-y-4">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="animate-spin text-[#006400]" size={32} />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
              <p className="font-bold text-lg mb-1">Start the negotiation</p>
              <p className="text-sm">Messages are securely tied to this specific deal.</p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isMe = msg.sender?._id === userInfo?._id;
              return (
                <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[75%] p-4 rounded-2xl ${isMe ? 'bg-[#006400] text-white rounded-tr-none shadow-md shadow-green-900/10' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-sm'}`}>
                     <p className="text-sm font-medium">{msg.text}</p>
                  </div>
                  <div className="flex gap-2 items-center mt-1">
                     <span className="text-[10px] font-bold text-gray-400 uppercase">{isMe ? 'You' : msg.sender?.role}</span>
                     <span className="text-[9px] text-gray-300">{new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Action Input */}
        {booking.status === 'completed' || booking.status === 'rejected' ? (
          <div className="p-6 bg-gray-100 text-center text-gray-500 font-bold border-t border-gray-200">
             This deal is finalized. Chat is archived.
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-3 shrink-0">
            <input 
              type="text" 
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Type your message..." 
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#006400]"
            />
            <button 
              type="submit" 
              disabled={!newMessage.trim()}
              className="bg-[#006400] text-white p-3 rounded-xl hover:bg-[#004d00] transition-colors shadow-md disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ChatModal;
