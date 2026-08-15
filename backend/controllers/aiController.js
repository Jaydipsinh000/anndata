import { GoogleGenerativeAI } from '@google/generative-ai';

// Helper to extract Real-Time Farmer Context (Location, Season, Month, Soil Type)
const getFarmerContext = (req) => {
  const user = req.user;
  const village = user?.village || '';
  const taluka = user?.taluka || '';
  const district = user?.district || 'Gujarat';
  const state = user?.state || 'Gujarat';
  const address = user?.address || [village, taluka, district, state].filter(Boolean).join(', ');

  const now = new Date();
  const monthName = now.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const monthNum = now.getMonth() + 1; // 1-12

  let season = 'Monsoon / ચોમાસું (Kharif Season)';
  if (monthNum >= 10 || monthNum <= 1) {
    season = 'Winter / શિયાળુ (Rabi Season)';
  } else if (monthNum >= 2 && monthNum <= 5) {
    season = 'Summer / ઉનાળુ (Zaid Season)';
  }

  let soilType = 'Black Cotton & Loamy Soil (કાળી અને ગોરાડુ જમીન)';
  const distLower = (district || '').toLowerCase();
  if (['rajkot', 'amreli', 'junagadh', 'jamnagar', 'bhavnagar', 'morbi', 'saurashtra', 'gir'].some(d => distLower.includes(d))) {
    soilType = 'Saurashtra Medium-Heavy Black Cotton Soil (સૌરાષ્ટ્રની કાળી કપાસિયા જમીન)';
  } else if (['banaskantha', 'palanpur', 'patan', 'mehsana', 'sabarkantha'].some(d => distLower.includes(d))) {
    soilType = 'North Gujarat Light Loamy / Sandy Soil (ઉત્તર ગુજરાતની રેતાળ/ગોરાડુ જમીન)';
  } else if (['anand', 'kheda', 'vadodara', 'surat', 'bharuch', 'narmada'].some(d => distLower.includes(d))) {
    soilType = 'Central/South Gujarat Fertile Alluvial Deep Soil (મધ્ય/દક્ષિણ ગુજરાતની કાંપવાળી ફળદ્રુપ જમીન)';
  }

  return {
    location: address || 'Gujarat, India',
    village,
    taluka,
    district,
    monthName,
    season,
    soilType
  };
};

const DISCLAIMER_FOOTER = `\n\n⚠️ **નોંધ (અસ્વીકરણ):** આ માહિતી માત્ર શૈક્ષણિક અને માર્ગદર્શનના હેતુ માટે છે. વાસ્તવિક હવામાન અને જમીનની સ્થિતિ અલગ હોઈ શકે છે. કોઈપણ મોટા રાસાયણિક કે ક્ષેત્રીય પ્રયોગો કરતા પહેલા સ્થાનિક કૃષિ અધિકારીની સલાહ લેવી. કોઈપણ કાનૂની જવાબદારી અન્નદાતા પોર્ટલની રહેશે નહીં.`;

// Helper for Mock Diagnosis when API Key is not configured or fails
const getMockAnalysis = (lang) => {
  if (lang === 'gu') {
    return JSON.stringify({
      status: "રોગ જણાયેલ છે",
      disease: "પાંદડાનો અલ્ટરનેરિયા બ્લાઇટ (Alternaria Leaf Blight)",
      severity: "Medium",
      symptoms: "પાંદડા પર બદામી અને પીળા રંગના ગોળાકાર ધબ્બા દેખાય છે.",
      remedies: [
        "જૈવિક: ૧૦ લિટર પાણીમાં ૧૦૦ મિલી લીમડાનું તેલ ઉમેરીને છંટકાવ કરો.",
        "રાસાયણિક: કોપર ઓક્સીક્લોરાઇડ (Copper Oxychloride) ૩ ગ્રામ પ્રતિ લિટર પાણીમાં ભેળવીને છાંટો."
      ],
      prevention: "ખેતરમાં વધારે પડતું પાણી ન ભરાવા દો અને રોગમુક્ત બિયારણનો ઉપયોગ કરો."
    });
  } else if (lang === 'hi') {
    return JSON.stringify({
      status: "रोग पाया गया",
      disease: "पत्तियों का झुलसा रोग (Alternaria Leaf Blight)",
      severity: "Medium",
      symptoms: "पत्तियों पर भूरे और पीले रंग के गोल धब्बे दिखाई दे रहे हैं।",
      remedies: [
        "जैविक: 10 लीटर पानी में 100 मिली नीम का तेल मिलाकर छिड़काव करें।",
        "रासायनिक: कॉपर ऑक्सीक्लोराइड (Copper Oxychloride) 3 ग्राम प्रति लीटर पानी में मिलाकर स्प्रे करें।"
      ],
      prevention: "खेत में जलजमाव न होने दें और प्रमाणित रोगमुक्त बीजों का ही प्रयोग करें।"
    });
  } else {
    return JSON.stringify({
      status: "Disease Detected",
      disease: "Alternaria Leaf Blight",
      severity: "Medium",
      symptoms: "Brown concentric spots with yellow halos visible on leaves.",
      remedies: [
        "Organic: Spray Neem Oil mixture (10ml per liter of water).",
        "Chemical: Apply Copper Oxychloride 50% WP at 3g per liter of water."
      ],
      prevention: "Avoid overwatering, maintain crop spacing, and use disease-resistant seeds."
    });
  }
};

// Smart fallback answer generator for Q&A Agronomist
const getAgronomyFallback = (question, lang, ctx) => {
  const qLower = (question || '').toLowerCase();
  
  // Specific Tree / Branch Damage / Bilvipatra / Injury Queries
  if (qLower.includes('tuta') || qLower.includes('તૂટ') || qLower.includes('ટૂટા') || qLower.includes('ડાળી') || qLower.includes('ઝાડ') || qLower.includes('શાખા') || qLower.includes('bilv') || qLower.includes('બિલિ') || qLower.includes('branch') || qLower.includes('tree') || qLower.includes('baris')) {
    return `🌳 **બિલિપત્ર / વૃક્ષની ભાંગેલી ડાળી બચાવવાની માર્ગદર્શિકા (${ctx?.location || 'ગુજરાત'}):**

📍 **તમારા વિસ્તારનું વાતાવરણ:** ${ctx?.season || 'ચોમાસું (ખરીફ)'} | જમીન: ${ctx?.soilType || 'કાળી જમીન'}

૧. **ઝાડ બચવાની શક્યતા:**
   - જો ડાળી બે ટુકડા થઈને અલગ નથી થઈ અને થડ સાથે જોડાયેલી છે, તો ચોમાસાના ભેજવાળા હવામાનમાં તેને સમયસર સીધી કરીને બાંધવાથી **૭૫% થી ૯૦% ઝાડ/ડાળી બચી જવાની શક્યતા છે**.

૨. **ડાળી સાંધવા માટેના ત્વરિત ઉપાય:**
   - 🩹 **ચુસ્ત બંધન (Tight Binding):** ભાંગેલી ડાળીને તેની મૂળ કુદરતી જગ્યાએ સીધી ગોઠવી, સુતરાઉ કાપડ અથવા ગ્રાફ્ટિંગ ટેપ (Grafting Tape) થી ખૂબ મજબૂતીથી બાંધી દો જેથી પવનથી હાલે નહીં.
   - 🌿 **વજન હળવું કરવું (Pruning):** ભાંગેલી ડાળી પરના ૩૦% થી ૫૦% પાંદડા કાપી નાખો. આનાથી ડાળી પર પાણી અને વજનનું ભારણ ઘટશે અને રૂઝ ઝડપી આવશે.
   - 🛡️ **ફૂગ રક્ષણ (Fungal Protection):** જ્યાંથી છાલ કે લાકડું ચિરાયું છે ત્યાં **કોપર ઓક્સીક્લોરાઇડ (Copper Oxychloride)** ની પાવડર પેસ્ટ અથવા છાણ + માટીનો લેપ લગાવી દો જેથી વરસાદના કારણે ફંગસ ન લાગે.

૩. **બચવાના લક્ષણો (Symptoms of Survival/Recovery):**
   - 🟢 **જીવંત અને સાજા થવાના લક્ષણો (૧૦ થી ૧૫ દિવસમાં):** 
     - ભાંગેલી ડાળીના પાંદડા સૂકાઈને ખરી પડવાને બદલે લીલા જ રહે.
     - ડાળીમાંથી નવી કૂંપળો કે નવા નાના પાન ફૂટવાનું શરૂ થાય.
   - 🔴 **સુકાઈ જવાના લક્ષણો:** 
     - ડાળી સંપૂર્ણ કાળી પડી જાય અને પાંદડા સુકાઈને ખરી જાય.` + DISCLAIMER_FOOTER;
  }

  if (lang === 'gu') {
    if (qLower.includes('પીળા') || qLower.includes('yellow')) {
      return `🌱 **પાંદડા પીળા પડવાના મુખ્ય ઉપાયો (${ctx?.location}):**\n- ૧. **નાઇટ્રોજનની કમી:** ૧૫ લીટર પંપમાં ૧૦૦ ગ્રામ યુરિયા અથવા ૧૯-૧૯-૧૯ વિલયશીલ ખાતર ભેળવી છંટકાવ કરો.\n- ૨. **ફૂગજન્ય રોગ:** સાફ (Saaf) ૨ ગ્રામ પ્રતિ લીટર પાણીમાં છાંટો.\n- ૩. વર્તમાન ${ctx?.season} માં ખેતરમાં પાણી ન ભરાવા દો.` + DISCLAIMER_FOOTER;
    }
    if (qLower.includes('ઈયળ') || qLower.includes('કપાસ') || qLower.includes('pest') || qLower.includes('cotton')) {
      return `🐛 **જીવાત અને ઈયળ નિયંત્રણ સલાહ (${ctx?.location}):**\n- ૧. લીમડાનું અર્ક (Neem Oil 10,000 ppm) ૩૦ મિલી પ્રતિ પંપ છાંટો.\n- ૨. ઇમામેક્ટીન બેન્ઝોએટ ૫ ગ્રામ પ્રતિ ૧૫ લિટર પંપમાં વાપરો.\n- ૩. ખેતરમાં ફિરોમોન ટ્રેપ ગોઠવો.` + DISCLAIMER_FOOTER;
    }
    return `🌾 **કૃષિ નિષ્ણાત સલાહ (${ctx?.location} - ${ctx?.season}):**\n- **સ્થળ અને જમીન:** ${ctx?.location} (${ctx?.soilType})\n- **સિંચાઈ:** ${ctx?.season} ના વાતાવરણ મુજબ સાંજના સમયે જ પિયત આપવું.\n- **ખાતર:** સ્થાનિક જમીનની જરૂરિયાત મુજબ NPK અને માઇક્રોન્યુટ્રિઅન્ટ્સ આપવા.\n- **પાક રક્ષણ:** રોગના પ્રારંભિક લક્ષણો જણાતા જ લીમડા આધારિત દવાઓનો છંટકાવ કરવો.` + DISCLAIMER_FOOTER;
  } else if (lang === 'hi') {
    return `🌾 **कृषि विशेषज्ञ सलाह (${ctx?.location} - ${ctx?.season}):**\n- **स्थान एवं मिट्टी:** ${ctx?.location} (${ctx?.soilType})\n- **सिंचाई:** मौसम अनुसार शाम के समय सिंचाई करें।\n- **पौध सुरक्षा:** नीम तेल (10,000 ppm) का स्प्रे करें।` + DISCLAIMER_FOOTER;
  } else {
    return `🌾 **Agronomist Recommendation (${ctx?.location} - ${ctx?.season}):**\n- 1. **Location & Soil:** ${ctx?.location} (${ctx?.soilType})\n- 2. **Current Season:** ${ctx?.season}\n- 3. **Pest & Disease Control:** Spray 5ml Neem Oil per liter of water.` + DISCLAIMER_FOOTER;
  }
};

// Helper for trying candidate Gemini models in sequence
const generateContentWithFallback = async (genAI, candidateModels, contents) => {
  let lastErr;
  for (const modelName of candidateModels) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(contents);
      const response = await result.response;
      return response.text();
    } catch (err) {
      console.warn(`Gemini model '${modelName}' failed:`, err.message);
      lastErr = err;
    }
  }
  throw lastErr || new Error("All Gemini candidate models failed.");
};

// Controller 1: Fetch localized weather with Smart Farming Advice
export const getWeather = async (req, res) => {
  try {
    let queryCity = req.query.city;
    
    if (!queryCity && req.user) {
      queryCity = [req.user.village, req.user.taluka, req.user.district, 'Gujarat'].filter(Boolean).join(', ') || req.user.address;
    }
    
    const targetLocation = queryCity || 'Ahmedabad, Gujarat';
    const response = await fetch(`https://wttr.in/${encodeURIComponent(targetLocation)}?format=j1`);
    
    if (!response.ok) {
       return res.status(400).json({ message: 'Weather data unavailable' });
    }

    const data = await response.json();
    const current = data.current_condition[0];
    const tempC = parseInt(current.temp_C, 10);
    const humidity = parseInt(current.humidity, 10);
    const condition = current.weatherDesc[0].value;

    let smartAdvice = "ખેતી માટે સાનુકૂળ હવામાન. પ્રમાણભૂત પાક સંભાળ અને પ્રવૃત્તિઓ માટે ઉત્તમ.";
    if (condition.toLowerCase().includes('rain') || condition.toLowerCase().includes('drizzle')) {
      smartAdvice = "વરસાદની આગાહી છે. ખાતર/જંતુનાશક દવાઓનો છંટકાવ મુલતવી રાખો.";
    } else if (humidity > 80) {
      smartAdvice = "ઉંચો ભેજ છે. ફૂગજન્ય રોગો અટકાવવા પાકની કાળજીપૂર્વક તપાસ કરો.";
    } else if (tempC > 38) {
      smartAdvice = "ઉંચુ તાપમાન છે. પાકને ગરમીથી બચાવવા માટે સાંજે પિયત આપો.";
    }

    const displayCityName = queryCity || data.nearest_area?.[0]?.areaName?.[0]?.value || 'Ahmedabad, Gujarat';

    const weather = {
      temp_c: current.temp_C,
      condition: condition,
      humidity: current.humidity,
      wind_kmh: current.windspeedKmph,
      city: displayCityName,
      smartAdvice
    };

    res.json(weather);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller 2: AI Crop Disease Detection via Google Gemini Vision
export const analyzeCropImage = async (req, res) => {
  try {
    const { imageBase64, lang } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ message: 'Image data is required.' });
    }

    const ctx = getFarmerContext(req);
    const apiKey = process.env.GEMINI_API_KEY;
    const languageMap = { 'gu': 'Gujarati', 'hi': 'Hindi', 'en': 'English' };
    const targetLang = languageMap[lang] || 'English';

    if (!apiKey) {
      return res.json({ analysis: getMockAnalysis(lang), isMock: true });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const candidateModels = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash", "gemini-pro"];

    const prompt = `You are an expert Indian Agronomist AI Doctor. Analyze this crop leaf image.

FARMER REAL-TIME CONTEXT:
- Farmer Location: ${ctx.location}
- Current Month & Season: ${ctx.monthName} (${ctx.season})
- Regional Soil Profile: ${ctx.soilType}

CRITICAL INSTRUCTION: Return your response strictly in raw JSON format (no backticks, no markdown fence) with the following structure:
{
  "status": "Short status e.g. Disease Detected / Deficiency / Healthy",
  "disease": "Disease or pest name (both common name and English/scientific if applicable)",
  "severity": "Low" | "Medium" | "High" | "Healthy",
  "symptoms": "Brief explanation of symptoms seen",
  "remedies": [
    "Organic treatment option 1 for ${ctx.location} region",
    "Chemical treatment option 2"
  ],
  "prevention": "1-2 lines on preventing recurrence in ${ctx.season}"
}

IMPORTANT: All text fields inside the JSON MUST be written fluently in ${targetLang}.`;

    const imageParts = [
      {
        inlineData: {
          data: imageBase64,
          mimeType: "image/jpeg"
        }
      }
    ];

    let text = await generateContentWithFallback(genAI, candidateModels, [prompt, ...imageParts]);
    text = text.trim();

    if (text.startsWith("```json")) {
      text = text.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (text.startsWith("```")) {
      text = text.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    res.json({ analysis: text });
  } catch (error) {
    console.error("AI Crop Scan Error:", error);
    res.json({ analysis: getMockAnalysis(req.body.lang), isMock: true, errorNote: error.message });
  }
};

// Controller 3: Interactive AI Agronomist Q&A
export const askAiAgronomist = async (req, res) => {
  try {
    const { question, lang } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({ message: 'Question is required.' });
    }

    const ctx = getFarmerContext(req);
    const apiKey = process.env.GEMINI_API_KEY;
    const languageMap = { 'gu': 'Gujarati', 'hi': 'Hindi', 'en': 'English' };
    const targetLang = languageMap[lang] || 'English';

    if (!apiKey) {
      return res.json({ answer: getAgronomyFallback(question, lang, ctx) });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const candidateModels = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash", "gemini-pro"];

    const prompt = `You are Annadata's expert AI Agronomist specializing in Indian agriculture, horticulture, tree care, crop diseases, fertilizers, and plant injury recovery.

FARMER REAL-TIME CONTEXT:
- Farmer Location: ${ctx.location} (${ctx.district} district)
- Current Month & Year: ${ctx.monthName}
- Current Agricultural Season: ${ctx.season}
- Region Soil Profile: ${ctx.soilType}

FARMER'S QUESTION: "${question}"

CRITICAL INSTRUCTIONS:
1. Address the farmer's specific question directly with high scientific & practical accuracy.
2. Tailor all advice specifically for the farmer's location (${ctx.location}), soil type (${ctx.soilType}), and current season (${ctx.season}).
3. If the farmer asks about tree injury, branch split, pest attack, or soil care, provide exact steps suitable for their region and season.
4. Write your response entirely and fluently in ${targetLang}.`;

    try {
      let text = await generateContentWithFallback(genAI, candidateModels, prompt);
      text += DISCLAIMER_FOOTER;
      return res.json({ answer: text });
    } catch (apiErr) {
      console.warn("Gemini API call failed for Q&A, using Agronomy fallback:", apiErr.message);
      return res.json({ answer: getAgronomyFallback(question, lang, ctx), isFallback: true });
    }
  } catch (error) {
    console.error("AI Agronomist Q&A Error:", error);
    const ctx = getFarmerContext(req);
    res.json({ answer: getAgronomyFallback(req.body?.question, req.body?.lang, ctx) });
  }
};
