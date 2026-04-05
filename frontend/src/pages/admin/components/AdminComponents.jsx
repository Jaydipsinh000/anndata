import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

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
      <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl transform transition-transform scale-100">
         <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-black text-gray-800">Review {isRent ? 'Lease' : (isPartnership ? 'Partnership' : 'Sale')} Deal</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XCircle size={24}/></button>
         </div>

         <div className="space-y-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-sm font-bold text-gray-500 mb-1">Applicant</p>
              <p className="text-gray-800 font-medium">{land.farmer_id?.name || 'Unknown'}</p>
            </div>

            {isRent && (
               <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
                  <p className="text-xs font-black text-indigo-800 uppercase tracking-widest mb-2">Corporate Contract Dates</p>
                  <label className="text-xs text-indigo-600 font-bold mb-1 block">Contract Start Date</label>
                  <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} className="w-full rounded-xl border border-indigo-200 p-2 text-sm bg-white" />
                  <p className="text-xs text-indigo-500 mt-2 font-medium">Duration: {land.lease_duration_years} Years</p>
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

         <div className="flex gap-4">
            <button 
              onClick={() => { onSubmit('lands', land._id, 'rejected', message, {}); onClose(); }} 
              className="flex-1 bg-red-100 text-red-600 font-bold py-3 rounded-xl hover:bg-red-200 transition-colors"
            >
              Reject Proposal
            </button>
            <button 
              onClick={() => { 
                const dealStatus = land.purpose === 'partnership' ? 'partnership_active' : (land.purpose === 'lease' ? 'rented_to_company' : 'sold');
                
                let extraData = {};
                if (land.purpose === 'lease' && startDate) {
                   const start = new Date(startDate);
                   const end = new Date(startDate);
                   end.setFullYear(end.getFullYear() + (land.lease_duration_years || 5));
                   extraData = { contract_start_date: start.toISOString(), contract_end_date: end.toISOString() };
                }

                onSubmit('lands', land._id, dealStatus, message, extraData); 
                onClose(); 
              }} 
              className="flex-1 bg-[#006400] text-white font-bold py-3 rounded-xl hover:bg-[#004d00] transition-colors shadow-lg"
            >
              Accept Deal
            </button>
         </div>
      </div>
    </div>
  );
}
