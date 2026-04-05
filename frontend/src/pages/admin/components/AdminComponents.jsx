import React, { useState } from 'react';
import { CheckCircle, XCircle, ShieldCheck, MapPin, Image as ImageIcon } from 'lucide-react';

export function ActionButton({ onClick, type, disabled }) {
  return (
    <button disabled={disabled} onClick={onClick} className={`p-2 rounded-xl transition-all ${disabled ? 'text-gray-300' : (type === 'approve' ? 'text-green-600 hover:bg-green-100' : 'text-red-600 hover:bg-red-100')}`}>
      {type === 'approve' ? <CheckCircle size={20} /> : <XCircle size={20} />}
    </button>
  );
}

export function LandReviewModal({ isOpen, onClose, land, onSubmit }) {
  if (!isOpen || !land) return null;
  const isRent = land.purpose === 'lease';
  const isPartnership = land.purpose === 'partnership';

  const [message, setMessage] = useState('');
  const [startDate, setStartDate] = useState('');

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-3xl w-full max-w-2xl p-8 shadow-2xl transform transition-transform scale-100 max-h-[90vh] overflow-y-auto">
         <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-black text-gray-800">Review {isRent ? 'Lease' : (isPartnership ? 'Partnership' : 'Sale')} Protocol</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XCircle size={24}/></button>
         </div>

         <div className="space-y-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-sm font-bold text-gray-500 mb-1">Applicant</p>
                <p className="text-gray-800 font-medium">{land.farmer_id?.name || 'Unknown'}</p>
              </div>

              <div className={`p-4 rounded-xl border ${land.privacy_verified ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <p className="text-sm font-bold text-gray-500 mb-1 flex items-center gap-1"><ShieldCheck size={16}/> Verification Protocol</p>
                {land.privacy_verified ? (
                   <p className="text-green-700 font-bold text-sm">✓ Mobile Verified<br/>✓ Owner Assured</p>
                ) : (
                   <p className="text-red-700 font-bold text-sm">X Verification Pending</p>
                )}
              </div>
            </div>

            {land.map_pin?.url && (
               <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center justify-between">
                  <div>
                     <p className="text-xs font-black text-blue-800 uppercase tracking-widest mb-1 flex items-center gap-1"><MapPin size={14}/> Land Coordinates</p>
                     <a href={land.map_pin.url} target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline text-sm truncate max-w-[200px] block">{land.map_pin.url}</a>
                  </div>
               </div>
            )}

            {land.images?.length > 0 && (
               <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                 <p className="text-xs font-black text-gray-600 uppercase tracking-widest mb-3 flex items-center gap-1"><ImageIcon size={14}/> Farmer Evidence Data</p>
                 <div className="flex gap-2 overflow-x-auto pb-2">
                    {land.images.map((img, i) => (
                       <a key={i} href={img} target="_blank" rel="noreferrer" className="shrink-0 hover:opacity-80 transition-opacity">
                         <img src={img} className="h-20 w-32 object-cover rounded-lg border border-gray-200 shadow-sm" alt="Land Evidence" />
                       </a>
                    ))}
                 </div>
               </div>
            )}

            {isRent && (
               <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
                  <p className="text-xs font-black text-indigo-800 uppercase tracking-widest mb-2">Corporate Contract Dates</p>
                  <label className="text-xs text-indigo-600 font-bold mb-1 block">Contract Start Date</label>
                  <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} className="w-full rounded-xl border border-indigo-200 p-2 text-sm bg-white" />
                  <p className="text-xs text-indigo-500 mt-2 font-medium">Duration: {land.lease_duration_years || 5} Years</p>
               </div>
            )}

            <div>
              <label className="text-sm font-bold text-gray-700 block mb-2">Admin Remarks (Visible to farmer)</label>
              <textarea 
                value={message} onChange={(e) => setMessage(e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-[#006400] focus:border-transparent transition-all min-h-[100px] text-sm"
                placeholder="Reason for rejection or instructions..."
              />
            </div>
         </div>

         <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => { onSubmit('lands', land._id, 'rejected', message, { trust_badge: 'rejected' }); onClose(); }} 
              className="flex-1 bg-red-100 text-red-600 font-bold py-3 rounded-xl hover:bg-red-200 transition-colors"
            >
              Reject Protocol
            </button>
            <button 
              onClick={() => { onSubmit('lands', land._id, 'under_discussion', message, {}); onClose(); }} 
              className="flex-1 bg-blue-100 text-blue-600 font-bold py-3 rounded-xl hover:bg-blue-200 transition-colors"
            >
              Under Discussion
            </button>
            <button 
              onClick={() => { 
                const dealStatus = land.purpose === 'partnership' ? 'partnership_active' : (land.purpose === 'lease' ? 'rented_to_company' : 'sold');
                
                let extraData = { trust_badge: 'verified' }; // Issue Trust Badge
                if (land.purpose === 'lease' && startDate) {
                   const start = new Date(startDate);
                   const end = new Date(startDate);
                   end.setFullYear(end.getFullYear() + (land.lease_duration_years || 5));
                   extraData = { ...extraData, contract_start_date: start.toISOString(), contract_end_date: end.toISOString() };
                }

                onSubmit('lands', land._id, dealStatus, message, extraData); 
                onClose(); 
              }} 
              className="flex-1 bg-[#006400] text-white font-bold py-3 rounded-xl hover:bg-[#004d00] transition-colors shadow-lg flex flex-col items-center justify-center leading-none"
            >
              <span>Accept Deal</span>
              <span className="text-[10px] font-medium opacity-80 mt-1">Issues "Verified Badge"</span>
            </button>
         </div>
      </div>
    </div>
  );
}

export function LeaseDealModal({ isOpen, onClose, land, onSubmit }) {
  if (!isOpen || !land) return null;
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [nextPaymentDate, setNextPaymentDate] = useState('');
  const [schedule, setSchedule] = useState('monthly');
  const [authPhrase, setAuthPhrase] = useState('');

  const handleConfirm = () => {
    onSubmit('lands', land._id, 'rented_to_company', 'Lease deal initiated automatically.', {
       contract_start_date: new Date(startDate).toISOString(),
       contract_end_date: new Date(endDate).toISOString(),
       next_payment_date: new Date(nextPaymentDate).toISOString(),
       payment_schedule: schedule
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl transform transition-transform scale-100">
         <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-black text-indigo-900">Start Lease Deal</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XCircle size={24}/></button>
         </div>

         <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="text-xs font-bold text-indigo-800 uppercase tracking-widest block mb-1">Start Date</label>
                  <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} className="w-full rounded-xl border border-indigo-200 p-3 text-sm focus:outline-none focus:border-indigo-400" />
               </div>
               <div>
                  <label className="text-xs font-bold text-indigo-800 uppercase tracking-widest block mb-1">End Date</label>
                  <input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} className="w-full rounded-xl border border-indigo-200 p-3 text-sm focus:outline-none focus:border-indigo-400" />
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 border-t border-indigo-100 pt-4">
               <div>
                  <label className="text-xs font-bold text-indigo-800 uppercase tracking-widest block mb-1">Payment Schedule</label>
                  <select value={schedule} onChange={e=>setSchedule(e.target.value)} className="w-full rounded-xl border border-indigo-200 p-3 text-sm focus:outline-none focus:border-indigo-400">
                     <option value="monthly">Monthly</option>
                     <option value="half-yearly">Every 6 Months</option>
                     <option value="yearly">Yearly</option>
                  </select>
               </div>
               <div>
                  <label className="text-xs font-bold text-indigo-800 uppercase tracking-widest block mb-1">First Payment Due</label>
                  <input type="date" value={nextPaymentDate} onChange={e=>setNextPaymentDate(e.target.value)} className="w-full rounded-xl border border-indigo-200 p-3 text-sm focus:outline-none focus:border-indigo-400" />
               </div>
            </div>
         </div>

         <div className="mb-6">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Type "START LEASE" to confirm</label>
            <input type="text" value={authPhrase} onChange={e=>setAuthPhrase(e.target.value)} className="w-full rounded-xl border border-gray-200 p-4 text-sm font-black focus:outline-none focus:border-indigo-500" placeholder="START LEASE" />
         </div>

         <button 
           disabled={authPhrase !== 'START LEASE'}
           onClick={handleConfirm}
           className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
         >
           Activate Lease Contract
         </button>
      </div>
    </div>
  );
}

export function UserDetailModal({ isOpen, onClose, user, lands, partnerships, marketplaceItems, onSubmit }) {
  if (!isOpen || !user) return null;
  const [adminNotes, setAdminNotes] = useState(user.admin_notes || '');
  
  // Compute Analytics Locally
  const userLands = (lands || []).filter(l => l.farmer_id?._id === user._id || l.farmer_id === user._id);
  const approvedLands = userLands.filter(l => !['pending', 'rejected'].includes(l.status));
  const userPartnerships = (partnerships || []).filter(p => p.farmer_id?._id === user._id || p.farmer_id === user._id);
  const userOrders = (marketplaceItems || []).filter(m => m.buyer_id === user._id);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-[4px] flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-[2rem] w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
         {/* DB Header */}
         <div className="px-8 py-6 bg-gray-50 border-b border-gray-100 flex justify-between items-start shrink-0">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-3xl font-black text-gray-800">{user.name}</h3>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.trust_badge === 'verified' ? 'bg-green-100 text-green-700' : (user.trust_badge === 'suspended' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-600')}`}>
                   {user.trust_badge || 'pending'}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-500">{user.email} &bull; {user.mobile} &bull; {user.role.toUpperCase()}</p>
            </div>
            <button onClick={onClose} className="p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"><XCircle size={24}/></button>
         </div>

         {/* Body */}
         <div className="p-8 overflow-y-auto flex-grow bg-white grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Col: Analytics */}
            <div className="lg:col-span-2 space-y-6">
               <h4 className="font-black text-lg text-gray-800 border-b border-gray-100 pb-2">Platform Activity Analytics</h4>
               
               {user.role === 'farmer' ? (
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl text-center">
                       <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Total Submissions</p>
                       <p className="text-2xl font-black text-blue-700">{userLands.length}</p>
                    </div>
                    <div className="bg-green-50 border border-green-100 p-4 rounded-2xl text-center">
                       <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1">Approved Deals</p>
                       <p className="text-2xl font-black text-green-700">{approvedLands.length}</p>
                    </div>
                    <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl text-center">
                       <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Active Partnerships</p>
                       <p className="text-2xl font-black text-indigo-700">{userPartnerships.length}</p>
                    </div>

                    {userLands.length > 0 && (
                       <div className="col-span-full border border-gray-100 rounded-2xl p-4 mt-2 bg-gray-50">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Recent Evidence History</p>
                          <div className="flex gap-2 overflow-x-auto pb-2">
                             {userLands.flatMap(l => l.images || []).slice(0, 5).map((img, i) => (
                                <img key={i} src={img} className="h-16 w-24 object-cover rounded-xl border border-gray-200 shadow-sm" alt="evidence"/>
                             ))}
                          </div>
                       </div>
                    )}
                 </div>
               ) : (
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl text-center">
                       <p className="text-xs font-black text-orange-500 uppercase tracking-widest mb-1">Market Orders Placed</p>
                       <p className="text-3xl font-black text-orange-700">{userOrders.length}</p>
                    </div>
                    <div className="bg-purple-50 border border-purple-100 p-6 rounded-2xl text-center">
                       <p className="text-xs font-black text-purple-500 uppercase tracking-widest mb-1">Standing</p>
                       <p className="text-xl font-black text-purple-700 capitalize">{user.status}</p>
                    </div>
                 </div>
               )}
            </div>

            {/* Right Col: Admin Controls */}
            <div className="space-y-6">
               <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-1"><ShieldCheck size={14}/> Trust Control Panel</p>
                 <div className="space-y-3">
                    <button 
                      onClick={() => onSubmit('users', user._id, 'approved', { trust_badge: 'verified' })}
                      className="w-full bg-green-100 text-green-700 font-bold py-3 rounded-xl hover:bg-green-200 transition-colors text-xs tracking-wide shadow-sm"
                    >
                      Issue VERIFIED Badge
                    </button>
                    <button 
                      onClick={() => onSubmit('users', user._id, 'suspended', { trust_badge: 'suspended' })}
                      className="w-full bg-red-100 text-red-700 font-bold py-3 rounded-xl hover:bg-red-200 transition-colors text-xs tracking-wide shadow-sm"
                    >
                      Suspend Account
                    </button>
                 </div>
               </div>

               <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">Administrative Notes</p>
                 <textarea 
                   className="w-full border border-gray-200 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:border-gray-400 min-h-[120px] bg-white shadow-sm"
                   placeholder="Private notes (Not visible to user)..."
                   value={adminNotes} onChange={e=>setAdminNotes(e.target.value)}
                 />
                 <button 
                   onClick={() => onSubmit('users', user._id, user.status, { admin_notes: adminNotes })}
                   className="w-full mt-3 bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors text-xs tracking-wide shadow-md active:scale-95"
                 >
                   Save Notes / Log Update
                 </button>
               </div>
            </div>

         </div>
      </div>
    </div>
  );
}
