import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useTranslation } from 'react-i18next';
import { User, MapPin, Mail, Phone, LogOut, Settings, Plus, Sprout, Shield, CheckCircle, Crown, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import CropUploadForm from '../components/farmer/CropUploadForm';

function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  const [isCropFormOpen, setIsCropFormOpen] = useState(false);
  const [myCrops, setMyCrops] = useState([]);
  const [liveUserStats, setLiveUserStats] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [submittingSub, setSubmittingSub] = useState(false);

  useEffect(() => {
    const userInfoMap = localStorage.getItem('userInfo');
    if(userInfoMap) {
      const parsedUser = JSON.parse(userInfoMap);
      setUser(parsedUser);
      
      // Fetch live user stats
      fetch('/api/auth/profile', {
        headers: { Authorization: `Bearer ${parsedUser.token}` }
      })
      .then(res => res.json())
      .then(data => setLiveUserStats(data))
      .catch(err => console.error(err));

      // Fetch Subscriptions
      fetch('/api/subscriptions/my', {
         headers: { Authorization: `Bearer ${parsedUser.token}` }
      })
      .then(res => res.json())
      .then(data => setSubscription(data))
      .catch(err => console.error(err));

      // If user is a farmer, fetch their crops
      if(parsedUser.role === 'farmer') {
        fetch('/api/crops/mycrops', {
          headers: { Authorization: `Bearer ${parsedUser.token}` }
        })
        .then(res => res.json())
        .then(data => setMyCrops(data))
        .catch(err => console.error(err));
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const onCropAdded = (newCrop) => {
    setMyCrops([newCrop, ...myCrops]);
  };

  const handleUpgradeSubscription = async (plan_name) => {
    setSubmittingSub(true);
    const loadingToast = toast.loading(`Upgrading to ${plan_name}...`);
    try {
       const res = await fetch('/api/subscriptions/upgrade', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
          body: JSON.stringify({ plan_name, duration_days: 30 }) // 30 day cycle
       });
       if (res.ok) {
          const updatedSub = await res.json();
          setSubscription(updatedSub);
          toast.success(`Successfully upgraded to ${plan_name}!`, { id: loadingToast });
       } else {
          toast.error('Upgrade failed', { id: loadingToast });
       }
    } catch (e) {
       toast.error('Server error', { id: loadingToast });
    } finally {
       setSubmittingSub(false);
    }
  };

  if(!user) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-20 selection:bg-[#006400] selection:text-white">
      <Navbar />
      
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-[#004d00] to-[#2ecc71] py-16 px-4 mb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/background.png')] bg-cover mix-blend-overlay opacity-20"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="w-28 h-28 bg-white/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border-4 border-white/30 shadow-2xl backdrop-blur-md transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <User size={56} className="text-white" />
          </div>
          <h2 className="text-white text-4xl md:text-5xl font-extrabold mb-2 drop-shadow-md">
            {t('profile.title') || 'Your Profile'}
          </h2>
          <p className="text-green-100 font-bold text-lg uppercase tracking-widest">{user.role}</p>
          
          {/* Trust Metrics Badge */}
          {liveUserStats && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 animate-[fadeIn_0.5s_ease-out]">
              <div className="bg-white/10 border border-white/20 backdrop-blur-md px-6 py-3 rounded-2xl flex items-center gap-3 shadow-lg">
                <Shield className={liveUserStats.trust_score > 70 ? "text-yellow-400" : "text-green-300"} size={26} />
                <div className="text-left">
                  <p className="text-white/70 text-[10px] font-black uppercase tracking-widest">Trust Score</p>
                  <p className="text-white font-black text-xl">{liveUserStats.trust_score} <span className="text-sm font-medium text-white/60">/ 100</span></p>
                </div>
              </div>
              <div className="bg-white/10 border border-white/20 backdrop-blur-md px-6 py-3 rounded-2xl flex items-center gap-3 shadow-lg">
                <CheckCircle className="text-blue-300" size={26} />
                <div className="text-left">
                  <p className="text-white/70 text-[10px] font-black uppercase tracking-widest">Completed Deals</p>
                  <p className="text-white font-black text-xl">{liveUserStats.completed_deals}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Action Bar (Farmer Specific) */}
        {user.role === 'farmer' && (
          <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
            <div>
              <h3 className="text-2xl font-bold text-[#1b431b]">Farmer Dashboard</h3>
              <p className="text-gray-500 font-medium">Manage your listings and crops</p>
            </div>
            <button 
              onClick={() => setIsCropFormOpen(true)}
              className="flex items-center gap-2 bg-[#006400] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#228b22] hover:-translate-y-0.5 transition-all shadow-md hover:shadow-green-900/30">
              <Plus size={20} />
              Sell New Crop
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info Column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden animate-[fadeIn_0.5s_ease-out]">
              <div className="p-8">
                <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                  <h3 className="text-2xl font-bold text-[#1b431b]">{t('profile.personalInfo') || 'Personal Info'}</h3>
                  <button className="text-gray-400 hover:text-[#006400] transition-colors"><Settings size={24} /></button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl group border border-transparent hover:border-green-100 hover:bg-green-50/50 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#006400] shadow-sm group-hover:scale-110 transition-transform">
                      <User size={24} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-gray-400 uppercase">{t('auth.fullName') || 'Full Name'}</p>
                      <p className="text-lg font-bold text-[#1b431b] truncate">{user.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl group border border-transparent hover:border-green-100 hover:bg-green-50/50 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#006400] shadow-sm group-hover:scale-110 transition-transform">
                      <Mail size={24} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-gray-400 uppercase">{t('auth.email') || 'Email Address'}</p>
                      <p className="text-lg font-bold text-[#1b431b] truncate">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl group border border-transparent hover:border-green-100 hover:bg-green-50/50 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#006400] shadow-sm group-hover:scale-110 transition-transform">
                      <Phone size={24} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-gray-400 uppercase">{t('auth.mobile') || 'Mobile Number'}</p>
                      <p className="text-lg font-bold text-[#1b431b] truncate">{user.mobile || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl group border border-transparent hover:border-green-100 hover:bg-green-50/50 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#006400] shadow-sm group-hover:scale-110 transition-transform">
                      <MapPin size={24} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-gray-400 uppercase">{t('auth.address') || 'Address'}</p>
                      <p className="text-lg font-bold text-[#1b431b] truncate">{user.address || 'No address'}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                   <div className="relative z-10">
                     <h4 className="font-black text-lg flex items-center gap-2 mb-2"><Crown className="text-yellow-400"/> Subscription Tier</h4>
                     
                     {subscription ? (
                        <>
                           <p className="text-gray-300 text-sm mb-4">Current Plan: <span className="font-bold text-white tracking-widest uppercase">{subscription.plan_name}</span></p>
                           {subscription.plan_name === 'Free' && (
                              <button 
                                 disabled={submittingSub}
                                 onClick={() => handleUpgradeSubscription('Pro')}
                                 className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-gray-900 font-black py-3 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-50"
                              >
                                 {submittingSub ? <Loader2 className="animate-spin" size={16}/> : 'Upgrade to Pro - ₹999/mo'}
                              </button>
                           )}
                           {subscription.plan_name !== 'Free' && (
                              <div className="bg-white/10 border border-yellow-500/30 rounded-xl p-3 text-center">
                                 <p className="text-xs text-yellow-100 font-bold tracking-widest uppercase">Premium Active</p>
                                 <p className="text-[10px] text-gray-400 mt-1">Valid until: {new Date(subscription.expiry_date).toLocaleDateString()}</p>
                              </div>
                           )}
                        </>
                     ) : (
                        <p className="text-sm text-gray-400"><Loader2 className="animate-spin inline" size={16}/> Loading...</p>
                     )}
                   </div>
                </div>
                
                <div className="mt-10 pt-6 border-t border-gray-100 flex justify-center">
                  <button 
                    onClick={handleLogout}
                    className="flex w-full justify-center items-center gap-2 bg-red-50 text-red-600 font-bold py-3 px-8 rounded-xl hover:bg-red-500 hover:text-white transition-colors duration-300 shadow-sm"
                  >
                    <LogOut size={20} />
                    {t('profile.logout') || 'Sign Out'}
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* Secondary Content Column */}
          <div className="lg:col-span-2">
            {user.role === 'farmer' ? (
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 h-full">
                <h3 className="text-xl font-bold text-[#1b431b] mb-6 flex items-center gap-2">
                   <Sprout className="text-[#2ecc71]" /> My Active Crop Listings
                </h3>
                
                {myCrops && myCrops.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myCrops.map(crop => (
                      <div key={crop._id} className="p-5 border border-gray-200 rounded-2xl hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                           <h4 className="font-bold text-lg text-gray-800">{crop.crop_name}</h4>
                           <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-lg uppercase">{crop.status || 'Pending'}</span>
                        </div>
                        <p className="text-gray-500 text-sm mb-4">Season: <span className="font-semibold text-gray-700">{crop.season}</span></p>
                        
                        <div className="flex justify-between items-center text-sm">
                           <div>
                             <p className="text-gray-400 uppercase text-[10px] font-bold">Qty / Stock</p>
                             <p className="font-bold text-gray-800">{crop.stock} kg</p>
                           </div>
                           <div className="text-right">
                             <p className="text-gray-400 uppercase text-[10px] font-bold">Price</p>
                             <p className="font-bold text-[#006400]">₹{crop.price}/kg</p>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 px-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500 mb-4 font-medium">You haven't listed any crops for sale yet.</p>
                    <button onClick={() => setIsCropFormOpen(true)} className="text-[#006400] font-bold hover:underline">Click here to add your first crop</button>
                  </div>
                )}
              </div>
            ) : user.role === 'admin' ? (
               <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 h-full flex flex-col justify-center items-center text-center">
                 <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                    <Shield className="text-[#006400]" size={32} />
                 </div>
                 <h3 className="text-2xl font-bold text-gray-800 mb-2">Admin Control</h3>
                 <p className="text-gray-500 max-w-sm mb-6">You have administrative privileges to manage crops and users.</p>
                 <Link to="/admin" className="bg-[#006400] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#228b22] transition-colors shadow-[0_10px_20px_rgba(0,100,0,0.2)] hover:-translate-y-1">
                   Open Admin Dashboard
                 </Link>
               </div>
            ) : user.role === 'buyer' ? (
               <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 h-full">
                 <h3 className="text-xl font-bold text-[#1b431b] mb-6 flex items-center gap-2">
                    <Shield className="text-[#2ecc71]" /> My Enterprise Dashboard
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 text-center shadow-sm">
                       <h4 className="font-black text-3xl text-orange-600 mb-2">0</h4>
                       <p className="text-sm font-bold text-orange-800 uppercase tracking-widest">Pending EOIs</p>
                    </div>
                    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 text-center shadow-sm">
                       <h4 className="font-black text-3xl text-indigo-600 mb-2">0</h4>
                       <p className="text-sm font-bold text-indigo-800 uppercase tracking-widest">Active Bookings</p>
                    </div>
                 </div>
                 <div className="mt-8 text-center py-12 px-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                    <p className="text-gray-500 mb-4 font-medium">Your Expression of Interest (EOI) contracts will appear here once finalized by the administration.</p>
                    <Link to="/crops" className="text-[#006400] font-bold hover:underline">Explore Farmer Supply Chain</Link>
                 </div>
               </div>
            ) : user.role === 'worker' ? (
               <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 h-full flex flex-col justify-center items-center text-center">
                 <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                    <Settings className="text-blue-600 opacity-80" size={32} />
                 </div>
                 <h3 className="text-2xl font-bold text-gray-800 mb-2">Worker Portal</h3>
                 <p className="text-gray-500 max-w-sm mb-6">Browse partnership farms requiring labor or rent tractors and tools to offer your harvesting services.</p>
                 <Link to="/tools" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30">
                   Find Tools to Rent
                 </Link>
               </div>
            ) : null}
          </div>

        </div>
      </div>

      <CropUploadForm 
        isOpen={isCropFormOpen} 
        onClose={() => setIsCropFormOpen(false)} 
        onSuccess={onCropAdded} 
      />
    </div>
  );
}

export default Profile;
