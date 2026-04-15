import { useState } from 'react';
import { Bot, Upload, Loader2, Leaf, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

function AiCropDoctor() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!imagePreview) return toast.error("Please upload an image first.");
    setLoading(true);
    setAnalysis('');

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));

      // Strip out "data:image/jpeg;base64," prefix for the backend
      const base64Data = imagePreview.split(',')[1];
      const selectedLang = localStorage.getItem('selectedLang') || 'en';

      const res = await fetch('/api/ai/analyze-crop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo?.token || ''}`
        },
        body: JSON.stringify({ imageBase64: base64Data, lang: selectedLang })
      });

      const data = await res.json();
      if (res.ok) {
        setAnalysis(data.analysis);
      } else {
        toast.error(data.message || 'Analysis failed. Make sure API key is configured.');
      }
    } catch (err) {
      toast.error('Server error during analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-[2rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden group">
       <div className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-10 group-hover:rotate-12 transition-transform duration-1000">
          <Bot size={200} />
       </div>
       
       <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
         <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-500/30 p-3 rounded-2xl border border-indigo-400 text-indigo-200">
                 <Bot size={28} />
              </div>
              <h3 className="text-3xl font-black tracking-tight">AI Crop Doctor</h3>
            </div>
            <p className="text-indigo-200 text-lg font-medium mb-8 leading-relaxed">
               Snap a photo of your affected crops. Our Gemini-powered AI will identify diseases, deficiencies, and provide instant remedies.
            </p>

            {!imagePreview ? (
              <label className="cursor-pointer bg-white/10 hover:bg-white/20 border-2 border-dashed border-indigo-400/50 rounded-2xl w-full h-48 flex flex-col items-center justify-center transition-all">
                 <Upload size={32} className="text-indigo-300 mb-2" />
                 <span className="font-bold text-indigo-200">Upload Leaf Image</span>
                 <span className="text-xs text-indigo-400 mt-1 uppercase tracking-widest">JPG, PNG</span>
                 <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            ) : (
              <div className="bg-black/20 p-2 rounded-2xl shadow-inner relative">
                 <img src={imagePreview} alt="Crop" className="w-full h-48 object-cover rounded-xl" />
                 <button onClick={() => { setImage(null); setImagePreview(''); setAnalysis(''); }} className="absolute top-4 right-4 bg-red-500 text-white p-2 text-xs font-bold rounded-lg shadow-lg">Remove</button>
              </div>
            )}

            {imagePreview && !analysis && (
              <button 
                 onClick={analyzeImage}
                 disabled={loading}
                 className="mt-6 w-full bg-indigo-500 hover:bg-indigo-400 text-white font-black py-4 rounded-xl shadow-lg shadow-indigo-500/30 transition-colors flex justify-center items-center gap-2"
              >
                 {loading ? <><Loader2 className="animate-spin" size={20}/> Analyzing Image...</> : 'Scan Image Now'}
              </button>
            )}
         </div>

         <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 h-full min-h-[300px] flex flex-col justify-center backdrop-blur-md">
            {loading ? (
               <div className="text-center animate-pulse">
                  <div className="w-16 h-16 border-4 border-indigo-400 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="font-bold text-indigo-200 tracking-widest uppercase text-sm">Consulting Agronomy Database...</p>
               </div>
            ) : analysis ? (
               <div className="text-indigo-50 animate-[fadeIn_0.5s_ease-out]">
                 <h4 className="text-xl font-black mb-4 flex gap-2 text-white items-center border-b border-indigo-400/30 pb-3"><ShieldAlert className="text-yellow-400"/> AI Diagnosis</h4>
                 <div className="prose prose-invert prose-indigo font-medium text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: analysis.replace(/\n/g, '<br/>') }} />
               </div>
            ) : (
               <div className="text-center opacity-40">
                  <Leaf size={48} className="mx-auto mb-4" />
                  <p className="font-bold text-lg uppercase tracking-widest">Awaiting Analysis</p>
               </div>
            )}
         </div>
       </div>
    </div>
  );
}

export default AiCropDoctor;
