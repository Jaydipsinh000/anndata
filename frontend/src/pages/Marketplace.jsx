import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Store, TrendingUp, Search, Leaf, ShieldCheck, MapPin, Tag, Plus, ShoppingCart } from 'lucide-react';
import MarketplaceUploadForm from '../components/farmer/MarketplaceUploadForm';
import { useTranslation } from 'react-i18next';
import CheckoutModal from '../components/CheckoutModal';

function Marketplace() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState(null);

  useEffect(() => {
    fetch('/api/marketplace')
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) setItems(data);
        else setItems([]);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setItems([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-20 selection:bg-[#006400] selection:text-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-[#004d00] py-20 px-4 mb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/background.png')] bg-cover mix-blend-overlay opacity-10"></div>
        
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between relative z-10">
          <div className="text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-green-100 font-bold mb-6 border border-white/20 backdrop-blur-md">
              <Store size={18} /> {t('marketplace.title')}
            </div>
            <h2 className="text-white text-5xl md:text-6xl font-black mb-4 leading-tight">
              {t('marketplace.subtitle')}
            </h2>
            <p className="text-green-100 text-xl font-medium mb-8">No middlemen. Fair prices. Supporting local agriculture.</p>
          </div>
          
          <div className="hidden md:flex gap-6 mt-8 md:mt-0">
             <div className="w-40 h-40 bg-white/10 rounded-3xl border border-white/20 backdrop-blur-md flex flex-col items-center justify-center text-white transform rotate-3 hover:rotate-0 transition-transform shadow-2xl">
                <TrendingUp size={40} className="mb-2 text-green-300" />
                <p className="font-bold">Live Rates</p>
             </div>
             <div className="w-40 h-40 bg-white/10 rounded-3xl border border-white/20 backdrop-blur-md flex flex-col items-center justify-center text-white transform -rotate-3 hover:rotate-0 transition-transform shadow-2xl mt-12">
                <ShieldCheck size={40} className="mb-2 text-blue-300" />
                <p className="font-bold">Verified</p>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-3xl shadow-sm border border-gray-100 mb-10 gap-4 relative z-20 -mt-20">
             <div className="relative w-full md:w-1/2">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search for wheat, rice, corn..." 
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-[#006400] transition-all font-medium"
                />
             </div>
             <button onClick={() => setIsUploadOpen(true)} className="w-full md:w-auto bg-[#006400] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#228b22] transition-colors shadow-lg flex items-center justify-center gap-2">
               <Plus size={20} /> {t('marketplace.sellCrop')}
             </button>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-[#006400] rounded-full animate-spin mx-auto mb-4"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <Store className="mx-auto text-gray-300 mb-4" size={64} />
            <h3 className="text-2xl font-bold text-gray-800">{t('marketplace.noItems')}</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map(item => (
              <div key={item._id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all group flex flex-col">
                <div className="h-48 bg-gray-100 relative overflow-hidden">
                   {/* Placeholder image representation */}
                   <div className="absolute inset-0 bg-[#004d00]/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <Leaf size={64} className="text-[#004d00]/20" />
                   </div>
                   <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg font-bold text-[#006400] shadow-sm text-sm">
                      ₹{item.price_per_unit}/{item.unit}
                   </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                     <h3 className="text-xl font-black text-gray-800">{item.crop_name}</h3>
                     <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-black tracking-wider ${item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {item.status}
                     </span>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                     <p className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                       <Tag size={16} className="text-[#006400]" /> {item.quantity} {item.unit} available
                     </p>
                     <p className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                       <MapPin size={16} className="text-blue-500" /> {item.location}
                     </p>
                  </div>

                  <div className="mt-auto">
                    <button onClick={() => setCheckoutItem(item)} className="w-full py-3 bg-gray-50 hover:bg-[#006400] text-[#006400] hover:text-white rounded-xl font-black transition-colors flex items-center justify-center gap-2 group-hover:border-transparent border border-gray-200">
                       <ShoppingCart size={18} /> {t('marketplace.buy')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <MarketplaceUploadForm 
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={(newItem) => setItems([newItem, ...items])}
      />
      
      {checkoutItem && <CheckoutModal item={checkoutItem} onClose={() => setCheckoutItem(null)} />}
    </div>
  );
}

export default Marketplace;
