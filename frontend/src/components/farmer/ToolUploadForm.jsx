import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

function ToolUploadForm({ isOpen, onClose, onSuccess }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    price: '',
    rental_price: '',
    rental_duration: '1 day'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const res = await fetch('/api/tools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        onSuccess(data);
        onClose();
      } else {
        setError(data.message || 'Failed to list tool');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-[scaleIn_0.3s_ease-out]">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-10">
          <X size={24} className="text-gray-600" />
        </button>

        <div className="p-10">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">{t('toolForm.title')}</h2>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-bold border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="font-bold text-gray-500 mb-2 text-xs uppercase tracking-widest block">{t('toolForm.name')}</label>
              <input 
                type="text" required placeholder="Ex. Mahindra Tractor, Seed Drill..."
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all font-medium"
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
               <label className="font-bold text-gray-500 mb-2 text-xs uppercase tracking-widest block">{t('toolForm.stock')}</label>
               <input 
                 type="number" required min="1"
                 className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all font-medium"
                 value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})}
               />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-gray-500 mb-2 text-xs uppercase tracking-widest block">{t('toolForm.price')}</label>
                <input 
                  type="number" required min="0"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all font-medium"
                  value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
                />
              </div>
              <div>
                <label className="font-bold text-gray-500 mb-2 text-xs uppercase tracking-widest block">{t('toolForm.rentPrice')}</label>
                <input 
                  type="number" required min="0" placeholder="Optional"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all font-medium"
                  value={formData.rental_price} onChange={e => setFormData({...formData, rental_price: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-gray-500 mb-2 text-xs uppercase tracking-widest block">{t('toolForm.rentDuration')}</label>
              <input 
                type="text" required placeholder="Ex. 1 Day, 1 Hour"
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all font-medium"
                value={formData.rental_duration} onChange={e => setFormData({...formData, rental_duration: e.target.value})}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gray-900 text-white font-extrabold text-lg p-5 rounded-2xl hover:bg-black transition-colors shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed mt-4 transform hover:-translate-y-1"
            >
              {loading ? t('toolForm.submitting') : t('toolForm.submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ToolUploadForm;
