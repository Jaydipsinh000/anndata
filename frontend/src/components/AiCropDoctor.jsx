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
          // Attempt to parse structured JSON
          const parsed = JSON.parse(data.analysis);
          setAnalysisData(parsed);
        } catch {
          // Fallback to text
          setRawTextAnalysis(data.analysis);
        }
        if (data.isMock) {
          toast.success("AI Crop Diagnosis Generated (Demo Mode)");
        } else {
          toast.success("AI Scan Complete!");
        }
      } else {
        toast.error(data.message || 'Analysis failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error during AI analysis.');
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async (qText) => {
    const targetQ = qText || question;
    if (!targetQ.trim()) return toast.error(t('ai.typeQuestion', 'Please type a question.'));

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
      "Ideal irrigation schedule for summer crops?"
    ]
  };

  const samplePrompts = quickPrompts[currentLang] || quickPrompts.en;

  const getSeverityBadge = (severity) => {
    const sev = (severity || '').toLowerCase();
    if (sev.includes('high') || sev.includes('ઉચ્ચ') || sev.includes('गंभीर')) {
      return <span className="px-3 py-1 bg-red-500/20 text-red-300 border border-red-500/40 rounded-full text-xs font-bold flex items-center gap-1"><AlertTriangle size={14}/> High Risk</span>;
    }
    if (sev.includes('medium') || sev.includes('મધ્યમ') || sev.includes('मध्यम')) {
      return <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-bold flex items-center gap-1"><AlertTriangle size={14}/> Medium Risk</span>;
    }
    return <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle2 size={14}/> Mild / Healthy</span>;
  };

  return (
    <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 rounded-[2.5rem] p-6 md:p-10 text-white shadow-2xl relative overflow-hidden border border-indigo-500/20">
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 opacity-10 transform translate-x-12 -translate-y-12 pointer-events-none">
        <Bot size={280} />
      </div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-indigo-500/20 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-3 rounded-2xl shadow-lg shadow-indigo-500/30">
              <Bot size={28} className="text-white" />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2">
                {t('ai.title', 'AI Crop Doctor & Advisor')} <Sparkles className="text-yellow-400 size-5" />
              </h3>
              <p className="text-indigo-200 text-sm font-medium">
                {t('ai.subtitle', 'Gemini AI Powered Agronomy Assistant')}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-800/80 p-1.5 rounded-2xl border border-indigo-500/30 backdrop-blur-md">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all duration-300 ${
              activeTab === 'scanner'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                : 'text-indigo-200 hover:text-white hover:bg-white/5'
            }`}
          >
            <Leaf size={16} />
            <span>{t('ai.scannerTab', 'Leaf Scanner')}</span>
          </button>

          <button
            onClick={() => setActiveTab('qa')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all duration-300 ${
              activeTab === 'qa'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                : 'text-indigo-200 hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageSquare size={16} />
            <span>{t('ai.qaTab', 'AI Agronomist Q&A')}</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="relative z-10">
        {activeTab === 'scanner' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Image Upload */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <p className="text-indigo-200 text-sm leading-relaxed">
                {t('ai.scannerDesc', 'Snap or upload a clear photo of an affected leaf or plant stem. Our AI will analyze diseases, deficiency symptoms, and prescribe immediate remedies.')}
              </p>

              {!imagePreview ? (
                <label className="cursor-pointer bg-slate-800/50 hover:bg-indigo-900/30 border-2 border-dashed border-indigo-400/40 hover:border-indigo-400 rounded-3xl p-8 flex flex-col items-center justify-center transition-all group min-h-[220px]">
                  <div className="p-4 bg-indigo-500/10 rounded-2xl group-hover:scale-110 transition-transform mb-3 border border-indigo-400/20">
                    <Upload size={32} className="text-indigo-300" />
                  </div>
                  <span className="font-bold text-white text-base">{t('ai.uploadLeaf', 'Upload Leaf Image')}</span>
                  <span className="text-xs text-indigo-300 mt-1">JPG, PNG (Max 5MB)</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              ) : (
                <div className="bg-slate-800/80 p-3 rounded-3xl border border-indigo-500/30 relative group shadow-xl">
                  <img src={imagePreview} alt="Crop Leaf" className="w-full h-56 object-cover rounded-2xl" />
                  <div className="absolute top-5 right-5 flex gap-2">
                    <button
                      onClick={() => { setImage(null); setImagePreview(''); setAnalysisData(null); setRawTextAnalysis(''); }}
                      className="bg-red-600/90 hover:bg-red-600 text-white px-3 py-1.5 text-xs font-bold rounded-xl shadow-lg backdrop-blur-md transition-colors"
                    >
                      {t('ai.remove', 'Remove')}
                    </button>
                  </div>
                </div>
              )}

              {imagePreview && (
                <button
                  onClick={analyzeImage}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 text-white font-extrabold py-4 rounded-2xl shadow-xl shadow-indigo-500/25 transition-all flex justify-center items-center gap-2 transform active:scale-95 disabled:opacity-50"
                >
                  {loading ? (
                    <><Loader2 className="animate-spin" size={20} /> {t('ai.analyzing', 'Analyzing Symptoms...')}</>
                  ) : (
                    <><Sparkles size={20} /> {t('ai.runScan', 'Run AI Scan')}</>
                  )}
                </button>
              )}
            </div>

            {/* Right Column: AI Analysis Result Display */}
            <div className="lg:col-span-7 bg-slate-900/80 border border-indigo-500/30 rounded-3xl p-6 md:p-8 min-h-[360px] flex flex-col justify-center backdrop-blur-xl relative">
              {loading ? (
                <div className="text-center py-10">
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-ping"></div>
                    <div className="w-20 h-20 border-4 border-indigo-400 border-t-purple-400 rounded-full animate-spin"></div>
                    <Bot className="absolute inset-0 m-auto text-indigo-300" size={32} />
                  </div>
                  <h4 className="font-bold text-lg text-white mb-2">{t('ai.analyzing', 'Analyzing Symptoms...')}</h4>
                  <p className="text-indigo-300 text-xs tracking-wider uppercase">Consulting Indian Agronomy Database...</p>
                </div>
              ) : analysisData ? (
                <div className="space-y-5 animate-fadeIn">
                  {/* Top Bar with Status & Copy */}
                  <div className="flex items-center justify-between border-b border-indigo-500/20 pb-4">
                    <div className="flex items-center gap-3">
                      <ShieldAlert className="text-yellow-400" size={24} />
                      <div>
                        <span className="text-xs text-indigo-300 uppercase tracking-widest block font-bold">{t('ai.diagnosisSummary', 'Diagnosis Summary')}</span>
                        <h4 className="text-xl font-black text-white">{analysisData.disease || analysisData.status}</h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getSeverityBadge(analysisData.severity)}
                      <button 
                        onClick={copyDiagnosis}
                        className="p-2 bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-200 rounded-xl border border-indigo-400/30 transition-colors"
                        title="Copy Report"
                      >
                        {copied ? <Check size={16} className="text-emerald-400"/> : <Copy size={16}/>}
                      </button>
                    </div>
                  </div>

                  {/* Symptoms */}
                  {analysisData.symptoms && (
                    <div className="bg-indigo-950/50 p-4 rounded-2xl border border-indigo-500/20">
                      <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block mb-1">{t('ai.symptoms', 'Key Symptoms Observed')}</span>
                      <p className="text-sm text-indigo-100 font-medium leading-relaxed">{analysisData.symptoms}</p>
                    </div>
                  )}

                  {/* Remedies */}
                  {analysisData.remedies && analysisData.remedies.length > 0 && (
                    <div className="bg-emerald-950/30 p-4 rounded-2xl border border-emerald-500/20">
                      <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block mb-2">{t('ai.remedies', 'Recommended Treatments')}</span>
                      <ul className="space-y-2">
                        {analysisData.remedies.map((rem, idx) => (
                          <li key={idx} className="text-sm text-emerald-100 font-medium flex items-start gap-2">
                            <span className="mt-1 text-emerald-400 font-bold">•</span>
                            <span>{rem}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Prevention */}
                  {analysisData.prevention && (
                    <div className="bg-slate-800/60 p-4 rounded-2xl border border-indigo-500/20">
                      <span className="text-xs font-bold text-purple-300 uppercase tracking-wider block mb-1">{t('ai.prevention', 'Preventive Measures')}</span>
                      <p className="text-sm text-indigo-100 font-medium leading-relaxed">{analysisData.prevention}</p>
                    </div>
                  )}
                </div>
              ) : rawTextAnalysis ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-indigo-500/20 pb-3">
                    <h4 className="font-bold text-lg text-white flex items-center gap-2"><ShieldAlert className="text-yellow-400"/> {t('ai.diagnosisSummary', 'AI Diagnosis Report')}</h4>
                    <button onClick={copyDiagnosis} className="p-2 bg-indigo-500/20 text-indigo-200 rounded-xl">
                      {copied ? <Check size={16} className="text-emerald-400"/> : <Copy size={16}/>}
                    </button>
                  </div>
                  <div className="text-sm text-indigo-100 leading-relaxed font-medium whitespace-pre-line">
                    {rawTextAnalysis}
                  </div>
                </div>
              ) : (
                <div className="text-center opacity-50 py-12">
                  <Leaf size={48} className="mx-auto mb-3 text-indigo-400" />
                  <p className="font-bold text-lg uppercase tracking-wider text-indigo-200">{t('ai.awaitingScan', 'Awaiting Image Scan')}</p>
                  <p className="text-xs text-indigo-300 mt-1">{t('ai.awaitingScanDesc', 'Upload a crop leaf picture on the left to begin diagnosis.')}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: AI Agronomist Q&A */}
        {activeTab === 'qa' && (
          <div className="space-y-6">
            {/* Input & Quick Chips */}
            <div className="bg-slate-900/90 border border-indigo-500/30 rounded-3xl p-6 backdrop-blur-xl">
              <label className="block text-sm font-bold text-indigo-200 mb-3">
                {t('ai.askPrompt', 'Ask any farming query (Diseases, Fertilizers, Weather advice, Crop care)')}
              </label>

              <div className="flex gap-3">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
                  placeholder={t('ai.askPlaceholder', 'e.g. Cotton crop leaves turning brown, what spray to use?')}
                  className="flex-1 bg-slate-800/80 border border-indigo-500/30 rounded-2xl px-5 py-4 text-white placeholder-indigo-300/50 text-sm focus:outline-none focus:border-indigo-400 transition-colors"
                />
                <button
                  onClick={() => handleAskQuestion()}
                  disabled={qaLoading}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold px-6 py-4 rounded-2xl shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {qaLoading ? <Loader2 size={18} className="animate-spin"/> : <Send size={18}/>}
                </button>
              </div>

              {/* Sample Preset Question Chips */}
              <div className="mt-4 flex flex-wrap gap-2 items-center">
                <span className="text-xs font-bold text-indigo-300 flex items-center gap-1">
                  <Sparkles size={12}/> {t('ai.popularQuestions', 'Popular questions:')}
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

