import { useState } from 'react';
import { X, Wheat, Camera } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function CropUploadForm({ isOpen, onClose, onSuccess }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    crop_name: '',
    area_value: '',
    area_unit: 'Acre',
    season: 'Monsoon',
    expected_yield: '',
    price: '',
    stock: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const res = await fetch('/api/crops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        },
        body: JSON.stringify({
          ...formData,
          area_size: `${formData.area_value} ${formData.area_unit}`
        })
      });

      const data = await res.json();
      if (res.ok) {
        onSuccess(data);
        onClose();
        setFormData({
          crop_name: '', area_value: '', area_unit: 'Acre',
          season: 'Monsoon', expected_yield: '', price: '', stock: ''
        });
      } else {
        setError(data.message || 'Failed to upload crop');
      }
    } catch (err) {
      setError('Network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-[fadeIn_0.3s_ease-out]">
        <div className="sticky top-0 bg-white/90 backdrop-blur-md z-10 px-8 py-6 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 text-[#006400] flex items-center justify-center">
              <Wheat size={24} />
            </div>
            <h2 className="text-2xl font-bold text-[#1b431b]">Upload New Crop</h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6">
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-medium border border-red-100">{error}</div>}

          {/* Photo Upload Placeholder */}
          <div className="w-full h-40 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 mb-8 cursor-pointer hover:bg-gray-100 hover:border-green-300 transition-colors group">
            <Camera size={32} className="mb-2 group-hover:text-green-500 transition-colors" />
            <span className="font-medium group-hover:text-green-600">Click to upload crop photos</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">Crop Name</label>
              <input type="text" required placeholder="e.g. Organic Basmati Rice"
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#006400]/20 focus:border-[#006400] transition-all outline-none font-medium"
                value={formData.crop_name} onChange={e => setFormData({...formData, crop_name: e.target.value})} />
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">Season</label>
              <select 
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#006400]/20 focus:border-[#006400] transition-all outline-none font-medium"
                value={formData.season} onChange={e => setFormData({...formData, season: e.target.value})}>
                <option value="Monsoon">Kharif (Monsoon)</option>
                <option value="Winter">Rabi (Winter)</option>
                <option value="Summer">Zaid (Summer)</option>
                <option value="All Season">Annual/Perennial</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">Land Area</label>
              <div className="flex gap-2">
                <input type="number" required placeholder="Value" min="0" step="0.1"
                  className="w-1/2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#006400]/20 focus:border-[#006400] transition-all outline-none font-medium"
                  value={formData.area_value} onChange={e => setFormData({...formData, area_value: e.target.value})} />
                <select 
                  className="w-1/2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#006400]/20 focus:border-[#006400] transition-all outline-none font-medium"
                  value={formData.area_unit} onChange={e => setFormData({...formData, area_unit: e.target.value})}>
                  <option value="Acre">Acres</option>
                  <option value="Hectare">Hectares</option>
                  <option value="Bigha">Bigha</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">Expected Yield (kg)</label>
              <input type="number" required placeholder="1000" min="0"
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#006400]/20 focus:border-[#006400] transition-all outline-none font-medium"
                value={formData.expected_yield} onChange={e => setFormData({...formData, expected_yield: e.target.value})} />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">Current Stock (kg)</label>
              <input type="number" required placeholder="Available stock..." min="0"
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#006400]/20 focus:border-[#006400] transition-all outline-none font-medium"
                value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">Asking Price (₹ / kg)</label>
              <input type="number" required placeholder="Price per kg" min="0"
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#006400]/20 focus:border-[#006400] transition-all outline-none font-medium text-[#006400]"
                value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end gap-4">
            <button type="button" onClick={onClose}
              className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-50 rounded-xl transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="bg-gradient-to-r from-[#006400] to-[#2ecc71] hover:from-[#004d00] hover:to-[#228b22] text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-green-500/30 flex items-center gap-2">
              {loading ? 'Publishing...' : 'Publish Crop Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CropUploadForm;
