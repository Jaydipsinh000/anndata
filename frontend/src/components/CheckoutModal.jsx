import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, CreditCard, ShoppingBag, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

function CheckoutModal({ item, onClose }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [qty, setQty] = useState(1);

  if (!item) return null;

  // Derive price logic
  let basePrice = 0;
  let calculationMode = '';
  
  if(item.price_per_unit) { // Crop Mode
      basePrice = item.price_per_unit;
      calculationMode = `per ${item.unit}`;
  } else if (item.price && item.rental_price) { // Tool Mode (it has both)
      if(item._tradeType === 'Buy') {
         basePrice = item.price;
         calculationMode = `to own`;
         // override max qty for tool purchase to 1 for simplicity, or based on stock
         if(qty > item.quantity) setQty(item.quantity);
      } else {
         basePrice = item.rental_price;
         calculationMode = `per ${item.rental_duration}`;
      }
  }

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const payload = {
        item_id: item._id,
        quantity: qty,
        total_amount: basePrice * qty
      };

      const res = await fetch('/api/marketplace/order', {
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
        toast.error('Checkout failed. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-md overflow-hidden rounded-[2rem] shadow-2xl animate-[scaleIn_0.3s_ease-out]">
        
        {success ? (
          <div className="p-12 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck size={48} className="text-green-600" />
            </div>
            <h2 className="text-3xl font-black text-gray-800 mb-2">{t('checkout.success')}</h2>
            <p className="text-gray-500 font-medium mb-8">Your transaction has been securely processed by Anndata platform.</p>
            <button 
              onClick={onClose}
              className="w-full bg-[#006400] text-white font-bold py-4 rounded-2xl hover:bg-[#228b22] transition-colors"
            >
              Continue Browsing
            </button>
          </div>
        ) : (
          <div>
            <div className="bg-gray-50 p-6 flex justify-between items-center border-b border-gray-100">
              <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                <ShieldCheck className="text-[#006400]" /> {t('checkout.title')}
              </h2>
              <button onClick={onClose} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleCheckout} className="p-8">
              <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl mb-6">
                 <h3 className="font-bold text-xl text-gray-900 mb-1">{item.crop_name || item.name}</h3>
                 <p className="text-sm font-medium text-gray-500 mb-4">{item.location || (item.owner_id && item.owner_id.name)}</p>
                 
                 <div className="flex justify-between items-center pt-4 border-t border-blue-200 border-dashed">
                    <span className="font-medium text-gray-600">Rate</span>
                    <span className="font-black text-[#006400]">₹{basePrice.toLocaleString()} <span className="text-xs text-gray-400 font-bold uppercase">{calculationMode}</span></span>
                 </div>
              </div>

              <div className="mb-8">
                <label className="font-bold text-gray-700 mb-2 text-xs uppercase tracking-widest block">{item.price_per_unit ? 'Quantity Requested' : 'Units'}</label>
                <div className="flex items-center gap-4">
                   <input 
                     type="number" min="1" max={item.quantity} required
                     className="w-24 p-4 text-center bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#006400] font-black text-lg"
                     value={qty} onChange={e => setQty(Number(e.target.value))}
                   />
                   <span className="font-bold text-gray-400 uppercase tracking-widest">{item.unit || 'Units'} <span className="text-xs lowercase normal-case">(Max: {item.quantity})</span></span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-6">
                 <span className="font-bold text-gray-400 uppercase tracking-widest">{t('checkout.total')}</span>
                 <span className="text-4xl font-black text-gray-900">₹{(basePrice * qty).toLocaleString()}</span>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gray-900 text-white font-extrabold text-lg p-5 rounded-2xl hover:bg-black transition-colors shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                   t('checkout.submitting')
                ) : (
                   <><CreditCard size={20} /> {t('checkout.submit')}</>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckoutModal;
