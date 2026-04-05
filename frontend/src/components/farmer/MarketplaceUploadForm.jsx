import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

function MarketplaceUploadForm({ isOpen, onClose, onSuccess }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    crop_name: '',
    quantity: '',
    unit: 'kg',
    price_per_unit: '',
    location: ''
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
      const res = await fetch('/api/marketplace', {
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
        setError(data.message || 'Failed to add item');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#004d00]/30 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-[scaleIn_0.3s_ease-out]">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-10">
          <X size={24} className="text-gray-600" />
        </button>

        <div className="p-10">
          <h2 className="text-4xl font-extrabold text-[#1b431b] mb-6">{t('marketForm.title')}</h2>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-bold border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="font-bold text-[#1b431b] mb-2 text-xs uppercase tracking-widest block">{t('marketForm.cropName')}</label>
              <input 
                type="text" required 
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#006400] focus:ring-1 focus:ring-[#006400] transition-all font-medium"
                value={formData.crop_name} onChange={e => setFormData({...formData, crop_name: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-[#1b431b] mb-2 text-xs uppercase tracking-widest block">{t('marketForm.quantity')}</label>
                <input 
                  type="number" required min="1"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#006400] focus:ring-1 focus:ring-[#006400] transition-all font-medium"
                  value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})}
                />
              </div>
              <div>
                <label className="font-bold text-[#1b431b] mb-2 text-xs uppercase tracking-widest block">{t('marketForm.unit')}</label>
                <select 
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#006400] focus:ring-1 focus:ring-[#006400] transition-all font-medium text-gray-700"
                  value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})}
                >
                  <option value="kg">{t('marketForm.unitOptions.kg')}</option>
                  <option value="ton">{t('marketForm.unitOptions.ton')}</option>
                  <option value="quintal">{t('marketForm.unitOptions.quintal')}</option>
                  <option value="pieces">{t('marketForm.unitOptions.pieces')}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-[#1b431b] mb-2 text-xs uppercase tracking-widest block">{t('marketForm.pricePerUnit')}</label>
                <input 
                  type="number" required min="1"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#006400] focus:ring-1 focus:ring-[#006400] transition-all font-medium"
                  value={formData.price_per_unit} onChange={e => setFormData({...formData, price_per_unit: e.target.value})}
                />
              </div>
              <div className="col-span-1">
                <label className="font-bold text-[#1b431b] mb-2 text-xs uppercase tracking-widest block">{t('marketForm.location')}</label>
                <input 
                  type="text" required
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#006400] focus:ring-1 focus:ring-[#006400] transition-all font-medium"
                  value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#006400] text-white font-extrabold text-lg p-5 rounded-2xl hover:bg-[#228b22] transition-colors shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed mt-4 transform hover:-translate-y-1"
            >
              {loading ? t('marketForm.submitting') : t('marketForm.submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MarketplaceUploadForm;
