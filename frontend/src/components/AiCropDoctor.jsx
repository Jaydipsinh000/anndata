import { useState } from 'react';
import { Bot, Upload, Loader2, Leaf, ShieldAlert, Sparkles, MessageSquare, Send, CheckCircle2, AlertTriangle, RefreshCw, Copy, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

function AiCropDoctor() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('scanner'); // 'scanner' | 'qa'
  
  // Scanner state
  const [, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [rawTextAnalysis, setRawTextAnalysis] = useState('');
  const [copied, setCopied] = useState(false);

  // Q&A State
  const [question, setQuestion] = useState('');
  const [qaLoading, setQaLoading] = useState(false);
  const [qaHistory, setQaHistory] = useState([]);

  const currentLang = localStorage.getItem('selectedLang') || 'en';

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setAnalysisData(null);
      setRawTextAnalysis('');
    }
  };

  const analyzeImage = async () => {
    if (!imagePreview) return toast.error(t('ai.uploadFirst', 'Please upload an image first.'));
    setLoading(true);
    setAnalysisData(null);
    setRawTextAnalysis('');

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const base64Data = imagePreview.split(',')[1];

      const res = await fetch('/api/ai/analyze-crop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo?.token || ''}`
        },
        body: JSON.stringify({ imageBase64: base64Data, lang: currentLang })
      });

      const data = await res.json();
      if (res.ok && data.analysis) {
        try {
          const parsed = typeof data.analysis === 'string' ? JSON.parse(data.analysis) : data.analysis;
          setAnalysisData(parsed);
        } catch {
          setRawTextAnalysis(data.analysis);
        }
        toast.success(t('ai.scanSuccess', 'Crop Leaf Diagnosis Complete!'));
      } else {
        toast.error(data.message || t('ai.scanError', 'Scan failed. Please try again.'));
      }
    } catch (err) {
      console.error(err);
      toast.error(t('ai.scanError', 'Scan failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async (promptQuery) => {
    const targetQ = promptQuery || question;
    if (!targetQ || !targetQ.trim()) return;

    setQaLoading(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo?.token || ''}`
        },
        body: JSON.stringify({ question: targetQ, lang: currentLang })
      });

      const data = await res.json();
      if (res.ok) {
        setQaHistory(prev => [{ q: targetQ, a: data.answer }, ...prev]);
        setQuestion('');
      } else {
        toast.error(data.message || 'Could not fetch response.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error contacting AI Agronomist.');
    } finally {
      setQaLoading(false);
    }
  };

  const copyDiagnosis = () => {
    if (!analysisData && !rawTextAnalysis) return;
    const textToCopy = analysisData 
      ? `AI Diagnosis:\nStatus: ${analysisData.status}\nDisease: ${analysisData.disease}\nSeverity: ${analysisData.severity}\nSymptoms: ${analysisData.symptoms}\nRemedies:\n${(analysisData.remedies || []).join('\n')}\nPrevention: ${analysisData.prevention}`
      : rawTextAnalysis;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const quickPrompts = {
    gu: [
      "ઘઉંમાં પીળા પાંદડાનો ઈલાજ શું છે?",
      "કપાસમાં ગુલાબી ઈયળ માટે કઈ દવા છાંટવી?",
      "ઉનાળામાં સિંચાઈ માટે શ્રેષ્ઠ સમય કયો?"
    ],
    hi: [
      "गेहूं में पीले पत्तों का क्या इलाज है?",
      "कपास में गुलाबी सुंडी के लिए कौन सी दवा स्प्रे करें?",
      "गर्मी के मौसम में सिंचाई का सबसे सही समय क्या है?"
    ],
    en: [
      "How to fix yellowing leaves in wheat?",
      "Best pesticide for pink bollworm in cotton?",
      "Optimal irrigation schedule for summer crops?"
    ]
  };

  const samplePrompts = quickPrompts[currentLang] || quickPrompts.en;

  return (
    <div className="bg-slate-950 rounded-3xl border border-indigo-500/20 shadow-2xl p-6 sm:p-8 text-white relative overflow-hidden">
      {/* Background Glow Overlay */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-500/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-indigo-500/20 relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-tr from-green-500 to-emerald-600 rounded-2xl shadow-lg shadow-green-500/20">
            <Bot size={32} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">{t('ai.title', 'AI Crop Doctor & Agronomist')}</h2>
              <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-indigo-400/30 flex items-center gap-1">
                <Sparkles size={10} /> Powered by Gemini
              </span>
            </div>
            <p className="text-indigo-200/80 text-xs sm:text-sm font-medium mt-1">
              {t('ai.subtitle', 'Instant AI disease detection from leaf photos & 24/7 expert agricultural Q&A.')}
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-slate-900/90 p-1.5 rounded-2xl border border-indigo-500/20 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'scanner'
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-900/40'
                : 'text-indigo-200 hover:text-white'
            }`}
          >
            <Leaf size={16} />
            {t('ai.tabScanner', 'Leaf Disease Scanner')}
          </button>

          <button
            onClick={() => setActiveTab('qa')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'qa'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-900/40'
                : 'text-indigo-200 hover:text-white'
            }`}
          >
            <MessageSquare size={16} />
            {t('ai.tabQa', 'Ask AI Agronomist')}
          </button>
        </div>
      </div>

      {/* Official Legal Advisory Disclaimer Banner */}
      <div className="mb-6 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-xs font-medium text-amber-200 flex items-start gap-3 relative z-10">
        <ShieldAlert size={20} className="text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-black text-amber-300 uppercase tracking-wider block mb-0.5">
             ⚠️ કૃષિ સલાહ અસ્વીકરણ (Official AI Legal Advisory Disclaimer)
          </span>
          <span className="leading-relaxed opacity-90">
             AI કૃષિ ડૉક્ટર દ્વારા પૂરી પાડવામાં આવેલ માહિતી અને સલાહ શૈક્ષણિક અને માર્ગદર્શનના હેતુ માટે છે. સ્થાનિક જમીન, હવામાન અને પાકની વાસ્તવિક સ્થિતિ અલગ હોઈ શકે છે. કોઈપણ રાસાયણિક પ્રયોગો કરતા પહેલા સ્થાનિક કૃષિ અધિકારી અથવા નિષ્ણાતની સલાહ લેવી. પાકના પરિણામો કે કોઈપણ નુકસાન માટે અન્નદાતા પોર્ટલ કાનૂની રીતે જવાબદાર રહેશે નહીં.
          </span>
        </div>
      </div>

      {/* Main Content Areas */}
      <div className="relative z-10">
        {/* TAB 1: SCANNER */}
        {activeTab === 'scanner' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Upload Area */}
            <div className="lg:col-span-5 space-y-4">
              <div
                className={`relative border-2 border-dashed rounded-3xl p-6 text-center transition-all flex flex-col items-center justify-center min-h-[260px] ${
                  imagePreview ? 'border-green-500/50 bg-slate-900/60' : 'border-indigo-500/30 hover:border-indigo-400/60 bg-slate-900/30'
                }`}
              >
                {imagePreview ? (
                  <div className="relative w-full h-56 rounded-2xl overflow-hidden group">
                    <img src={imagePreview} alt="Crop Leaf Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <label className="cursor-pointer bg-white/20 backdrop-blur-md hover:bg-white/30 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 border border-white/30">
                        <Upload size={14} /> Change Photo
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full p-6">
                    <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400 mb-3 border border-indigo-500/20">
                      <Upload size={28} />
                    </div>
                    <span className="text-sm font-bold text-white mb-1">{t('ai.uploadPrompt', 'Click or drag leaf photo here')}</span>
                    <span className="text-xs text-indigo-300/70">{t('ai.uploadDesc', 'Supports JPG, PNG (Max 5MB)')}</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>

              <button
                onClick={analyzeImage}
                disabled={loading || !imagePreview}
                className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl ${
                  loading || !imagePreview
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-green-900/40 cursor-pointer'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    {t('ai.scanning', 'Analyzing Leaf with AI...')}
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    {t('ai.scanButton', 'Scan & Diagnose Leaf')}
                  </>
                )}
              </button>
            </div>

            {/* Results Area */}
            <div className="lg:col-span-7">
              {loading ? (
                <div className="h-full min-h-[300px] bg-slate-900/40 rounded-3xl border border-indigo-500/10 p-8 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-green-500 rounded-full animate-spin"></div>
                    <Bot className="absolute inset-0 m-auto text-green-400" size={24} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">{t('ai.analyzingTitle', 'AI Agronomist is analyzing leaf patterns...')}</h4>
                    <p className="text-xs text-indigo-300/70 mt-1 max-w-sm">Checking for fungal spots, pest damage, nutrient deficiencies, and optimal treatment plans.</p>
                  </div>
                </div>
              ) : analysisData ? (
                <div className="bg-slate-900/80 rounded-3xl border border-indigo-500/20 p-6 sm:p-8 space-y-6 shadow-xl relative">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between border-b border-indigo-500/20 pb-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="text-green-400" size={20} />
                      <span className="font-bold text-sm text-green-300 uppercase tracking-wider">{t('ai.diagnosisReport', 'Diagnosis Report')}</span>
                    </div>

                    <button
                      onClick={copyDiagnosis}
                      className="flex items-center gap-1.5 text-xs font-bold text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-xl border border-indigo-400/20 transition-all"
                    >
                      {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>

                  {/* Disease Title & Severity */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-950/60 p-4 rounded-2xl border border-indigo-500/10">
                    <div>
                      <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">{t('ai.detectedCondition', 'Detected Condition')}</span>
                      <h3 className="text-lg font-black text-white">{analysisData.disease || 'General Health Review'}</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                        (analysisData.severity || '').toLowerCase() === 'high' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                        (analysisData.severity || '').toLowerCase() === 'medium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-green-500/20 text-green-300 border border-green-500/30'
                      }`}>
                        Severity: {analysisData.severity || 'Medium'}
                      </span>
                    </div>
                  </div>

                  {/* Symptoms */}
                  <div>
                    <h4 className="text-xs font-black text-indigo-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <AlertTriangle size={14} className="text-amber-400" />
                      {t('ai.symptomsTitle', 'Observed Symptoms')}
                    </h4>
                    <p className="text-sm text-indigo-100/90 leading-relaxed font-medium bg-slate-950/40 p-3 rounded-xl border border-indigo-500/10">
                      {analysisData.symptoms || 'No critical symptoms observed.'}
                    </p>
                  </div>

                  {/* Remedies */}
                  <div>
                    <h4 className="text-xs font-black text-indigo-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-green-400" />
                      {t('ai.remediesTitle', 'Recommended Treatment Plan')}
                    </h4>
                    <ul className="space-y-2 list-none p-0 m-0">
                      {Array.isArray(analysisData.remedies) && analysisData.remedies.map((rem, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-indigo-100 bg-slate-950/40 p-3 rounded-xl border border-indigo-500/10">
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 shrink-0"></span>
                          <span>{rem}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Prevention */}
                  {analysisData.prevention && (
                    <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-2xl p-4">
                      <h4 className="text-xs font-black text-emerald-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <ShieldAlert size={14} className="text-emerald-400" />
                        {t('ai.preventionTitle', 'Prevention')}
                      </h4>
                      <p className="text-xs text-emerald-100 leading-relaxed font-medium">
                        {analysisData.prevention}
                      </p>
                    </div>
                  )}
                </div>
              ) : rawTextAnalysis ? (
                <div className="bg-slate-900/80 rounded-3xl border border-indigo-500/20 p-6 sm:p-8 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
                    <span className="font-bold text-sm text-green-300 uppercase tracking-wider">{t('ai.diagnosisReport', 'Diagnosis Report')}</span>
                    <button onClick={copyDiagnosis} className="text-xs font-bold text-indigo-300 hover:text-white">Copy</button>
                  </div>
                  <div className="text-sm text-indigo-100 whitespace-pre-line leading-relaxed font-medium">
                    {rawTextAnalysis}
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[300px] bg-slate-900/30 rounded-3xl border border-indigo-500/10 p-8 flex flex-col items-center justify-center text-center opacity-60">
                  <Leaf size={48} className="text-indigo-400 mb-3" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">{t('ai.noScanYet', 'No Leaf Scanned Yet')}</h4>
                  <p className="text-xs text-indigo-300/70 mt-1 max-w-xs">{t('ai.noScanDesc', 'Upload a photo of your crop leaf on the left and click Scan to receive instant diagnosis.')}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: INTERACTIVE Q&A */}
        {activeTab === 'qa' && (
          <div className="space-y-6">
            {/* Input Bar */}
            <div className="bg-slate-900/90 rounded-3xl border border-indigo-500/20 p-4 sm:p-6 shadow-xl space-y-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAskQuestion();
                }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="text"
                  placeholder={t('ai.askPrompt', 'Ask any farming query (Diseases, Fertilizers, Weather advice, Crop care)')}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="flex-1 bg-slate-950 border border-indigo-500/30 rounded-2xl px-5 py-3.5 text-sm text-white placeholder-indigo-300/50 focus:outline-none focus:border-indigo-400 font-medium transition-all"
                />

                <button
                  type="submit"
                  disabled={qaLoading || !question.trim()}
                  className={`px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shrink-0 ${
                    qaLoading || !question.trim()
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-900/40 cursor-pointer'
                  }`}
                >
                  {qaLoading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                  {qaLoading ? t('ai.asking', 'Consulting...') : t('ai.askButton', 'Ask Agronomist')}
                </button>
              </form>

              {/* Sample Quick Prompts */}
              <div className="flex flex-wrap gap-2 items-center pt-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300/70 mr-1">
                  {t('ai.popularQuestions', 'Popular Questions:')}
                </span>
                {samplePrompts.map((promptText, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setQuestion(promptText); handleAskQuestion(promptText); }}
                    className="text-xs font-medium bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 hover:text-white px-3 py-1.5 rounded-xl transition-all"
                  >
                    {promptText}
                  </button>
                ))}
              </div>
            </div>

            {/* Answer Cards History */}
            {qaHistory.length > 0 ? (
              <div className="space-y-4">
                {qaHistory.map((item, index) => (
                  <div key={index} className="bg-slate-900/80 border border-indigo-500/20 rounded-3xl p-6 space-y-3 shadow-xl">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-300 mt-0.5">
                        <MessageSquare size={18} />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">{t('ai.question', 'Question')}</span>
                        <p className="text-base font-bold text-white">{item.q}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-indigo-950/40 p-4 rounded-2xl border border-indigo-500/10">
                      <div className="p-2 bg-purple-500/20 rounded-xl text-purple-300 mt-0.5">
                        <Bot size={18} />
                      </div>
                      <div className="flex-1">
                        <span className="text-xs font-bold text-purple-300 uppercase tracking-widest">{t('ai.recommendation', 'Agronomist Recommendation')}</span>
                        <div className="text-sm text-indigo-100 font-medium leading-relaxed whitespace-pre-line mt-1">
                          {item.a}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center opacity-40 py-8 bg-slate-900/40 rounded-3xl border border-indigo-500/10">
                <RefreshCw size={36} className="mx-auto mb-2 text-indigo-400" />
                <p className="text-sm font-bold uppercase tracking-wider text-indigo-200">{t('ai.noQuestions', 'No Questions Asked Yet')}</p>
                <p className="text-xs text-indigo-300 mt-1">{t('ai.noQuestionsDesc', 'Click a popular question above or type your own question to consult the AI Agronomist.')}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AiCropDoctor;
