import { useState, useEffect } from 'react';
import { Sprout, Map, Scale, IndianRupee, User, Mail, Loader2, Wheat, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Crops() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eoiCrop, setEoiCrop] = useState(null);
  const [successMsg, setSuccessMsg] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [requirements, setRequirements] = useState('');

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    fetch('/api/crops')
      .then(res => res.json())
      .then(data => {
        setCrops(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-[#006400] selection:text-white pb-20">
      <Navbar />
      
      {/* Header section with gradient background */}
      <div className="bg-gradient-to-r from-[#004d00] to-[#2ecc71] py-16 px-4 mb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/background.png')] bg-cover mix-blend-overlay opacity-20"></div>
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <h2 className="text-white text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-md">
            Listed Crops
          </h2>
          <p className="text-green-100 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Discover locally grown crops straight from our trusted farmers.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#006400]">
            <Loader2 className="w-12 h-12 animate-spin mb-4" />
            <p className="font-bold text-xl">Loading crops...</p>
          </div>
        ) : crops.filter(c => c.status === 'approved').length === 0 ? (
          <div className="glass-effect rounded-[2rem] p-16 text-center shadow-sm max-w-2xl mx-auto border border-gray-100 mt-10">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Wheat className="w-12 h-12 text-[#2ecc71]" />
            </div>
            <h3 className="text-2xl font-bold text-[#1b431b] mb-2">No active crops available</h3>
            <p className="text-gray-500 text-lg">Check back later for new supply listings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {crops.filter(c => c.status === 'approved').map(crop => (
              <div key={crop._id} className="bg-white rounded-[1.5rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_20px_40px_rgba(0,100,0,0.1)] hover:-translate-y-2 transition-all duration-300 group flex flex-col h-full">
                
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-[#006400] group-hover:bg-[#006400] group-hover:text-white transition-colors">
                      <Sprout size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-[#1b431b] capitalize">{crop.crop_name}</h3>
                  </div>
                  
                  <span className={`px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm border ${
                    crop.status === 'approved' 
                      ? 'bg-green-50 text-green-700 border-green-200' 
                      : 'bg-orange-50 text-orange-700 border-orange-200'
                  }`}>
                    {crop.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8 flex-grow">
                  <div className="bg-gray-50 rounded-xl p-3 flex flex-col justify-center">
                     <div className="flex items-center text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
                       <Sprout className="w-3 h-3 mr-1" /> Season
                     </div>
                     <span className="font-semibold text-gray-800 capitalize">{crop.season}</span>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-3 flex flex-col justify-center">
                     <div className="flex items-center text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
                       <Map className="w-3 h-3 mr-1" /> Area
                     </div>
                     <span className="font-semibold text-gray-800">{crop.area_value} {crop.area_unit}</span>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-3 flex flex-col justify-center">
                     <div className="flex items-center text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
                       <Scale className="w-3 h-3 mr-1" /> Yield
                     </div>
                     <span className="font-semibold text-gray-800">{crop.expected_yield}</span>
                  </div>
                  
                  <div className="bg-green-50/50 border border-green-100 rounded-xl p-3 flex flex-col justify-center">
                     <div className="flex items-center text-[#006400] text-xs font-bold uppercase tracking-wider mb-1">
                       <IndianRupee className="w-3 h-3 mr-1" /> Price/Unit
                     </div>
                     <span className="font-bold text-xl text-[#006400]">₹{crop.price}</span>
                  </div>
                </div>

                {/* Farmer Info */}
                <div className="pt-5 border-t border-gray-100 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      <User size={16} />
                    </div>
                    <span className="font-bold text-gray-700">{crop.user_id?.name || 'Unknown Farmer'}</span>
                  </div>
                  
                  <button onClick={() => userInfo ? setEoiCrop(crop) : navigate('/login')} className="flex items-center gap-2 text-white bg-[#006400] px-4 py-2 rounded-xl hover:bg-[#004d00] hover:shadow-md font-semibold transition-all duration-300">
                    <Mail size={16} /> Book
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Expression of Interest Modal */}
      {eoiCrop && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative">
            <button onClick={() => setEoiCrop(null)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"><XCircle size={24}/></button>
            <h3 className="text-2xl font-black text-gray-800 mb-2">Advance Contract EOI</h3>
            <p className="text-gray-500 font-medium text-sm mb-6">Send an Expression of Interest to block {eoiCrop.expected_yield}kg of {eoiCrop.crop_name} before harvest.</p>
            
            <div className="bg-green-50 p-4 rounded-xl border border-green-100 mb-6">
               <p className="text-xs font-black text-green-800 uppercase tracking-widest mb-1">Estimated Cost</p>
               <p className="text-xl font-bold text-green-700">₹{(eoiCrop.price * eoiCrop.expected_yield).toLocaleString()} INR</p>
            </div>

            <textarea 
               className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-[#006400] transition-all min-h-[100px] text-sm mb-6" 
               placeholder="Any specific requirements regarding moisture, delivery logistics, or payment terms?"
               value={requirements}
               onChange={(e) => setRequirements(e.target.value)}
            ></textarea>
            
            <button 
               disabled={submitting}
               onClick={async () => { 
                 setSubmitting(true);
                 try {
                   const res = await fetch('/api/bookings', {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
                     body: JSON.stringify({
                       crop_id: eoiCrop._id,
                       farmer_id: eoiCrop.user_id._id || eoiCrop.user_id,
                       requirements,
                       estimated_cost: eoiCrop.price * eoiCrop.expected_yield
                     })
                   });
                   if(res.ok) {
                     setEoiCrop(null); 
                     setSuccessMsg(true);
                     setRequirements('');
                   } else {
                     alert("Failed to submit EOI");
                   }
                 } catch(e) {
                   alert("Network error.");
                 } finally {
                   setSubmitting(false);
                 }
               }} 
               className="w-full bg-[#006400] text-white font-bold py-4 rounded-xl hover:bg-[#004d00] transition-colors shadow-lg disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Binding EOI'}
            </button>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {successMsg && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-[fadeIn_0.3s_ease-out]">
          <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl text-center transform scale-100 transition-transform">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-[#006400]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h3 className="text-2xl font-black text-[#1b431b] mb-3">Request Sent!</h3>
            <p className="text-gray-600 font-medium text-[15px] mb-8 leading-relaxed">
              Your Expression of Interest profile has been dispatched. The farmer and admin will review your request and contact you for legal formalities.
            </p>
            <button 
              onClick={() => setSuccessMsg(false)} 
              className="w-full bg-gradient-to-r from-[#006400] to-[#2ecc71] hover:from-[#004d00] hover:to-[#228b22] text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-green-500/30"
            >
              Okay, Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Crops;
