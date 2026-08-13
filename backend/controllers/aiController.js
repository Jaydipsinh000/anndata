import { GoogleGenerativeAI } from '@google/generative-ai';

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
const getAgronomyFallback = (question, lang) => {
  const qLower = (question || '').toLowerCase();
  
  if (lang === 'gu') {
    if (qLower.includes('પીળા') || qLower.includes('yellow')) {
      return "🌱 **પાંદડા પીળા પડવાના મુખ્ય ઉપાયો:**\n- ૧. **નાઇટ્રોજનની કમી:** ૧૫ લીટર પંપમાં ૧૦૦ ગ્રામ યુરિયા અથવા ૧૯-૧૯-૧૯ વિલયશીલ ખાતર ભેળવી છંટકાવ કરો.\n- ૨. **ફૂગજન્ય રોગ:** સાફ (Saaf - Carbendazim + Mancozeb) ૨ ગ્રામ પ્રતિ લીટર પાણીમાં છાંટો.\n- ૩. ખેતરમાં વધારાનું પાણી ન ભરાવા દો.";
    }
    if (qLower.includes('ઈયળ') || qLower.includes('કપાસ') || qLower.includes('pest') || qLower.includes('cotton')) {
      return "🐛 **જીવાત અને ઈયળ નિયંત્રણ સલાહ:**\n- ૧. લીમડાનું અર્ક (Neem Oil 10,000 ppm) ૩૦ મિલી પ્રતિ પંપ છાંટો.\n- ૨. ગુલાબી કે લશ્કરી ઈયળ માટે ઇમામેક્ટીન બેન્ઝોએટ (Emamectin Benzoate) ૫ ગ્રામ પ્રતિ ૧૫ લિટર પંપમાં વાપરો.\n- ૩. ખેતરમાં ફિરોમોન ટ્રેપ (Pheromone Traps) ગોઠવો.";
    }
    return "🌾 **કૃષિ નિષ્ણાત સલાહ:**\n- **સિંચાઈ:** સાંજના અથવા વહેલી સવારે સિંચાઈ આપવી હિતાવહ છે.\n- **ખાતર:** વાવણી સમયે NPK યોગ્ય માત્રામાં આપવું અને માટી પરીક્ષણ મુજબ માઇક્રોન્યુટ્રિઅન્ટ્સ વાપરવા.\n- **પાક રક્ષણ:** રોગના પ્રારંભિક લક્ષણો જણાતા જ લીમડા આધારિત જૈવિક દવાઓનો છંટકાવ કરવો.";
  } else if (lang === 'hi') {
    if (qLower.includes('पीले') || qLower.includes('yellow')) {
      return "🌱 **पत्तियों के पीलेपन का समाधान:**\n- 1. **नाइट्रोजन की कमी:** 15 लीटर स्प्रे पंप में 100 ग्राम यूरिया या NPK 19-19-19 मिलाकर स्प्रे करें।\n- 2. **फंगल संक्रमण:** साफ (Saaf) या मैंकोज़ेब 2 ग्राम प्रति लीटर पानी में मिलाकर छिड़काव करें।\n- 3. खेत में जलभराव की स्थिति न बनने दें।";
    }
    return "🌾 **कृषि विशेषज्ञ सलाह:**\n- **सिंचाई:** सुबह या शाम के समय ही सिंचाई करें ताकि वाष्पीकरण कम हो।\n- **उर्वरक:** मृदा परीक्षण के अनुसार संतुलित NPK और सूक्ष्म पोषक तत्वों का उपयोग करें।\n- **पौध सुरक्षा:** बीमारी के शुरुआती लक्षणों में नीम तेल (10,000 ppm) का स्प्रे करें।";
  } else {
    return "🌾 **Agronomist Recommendation:**\n- 1. **Soil & Fertilization:** Apply NPK 19-19-19 or organic compost based on soil moisture.\n- 2. **Pest & Disease Control:** Spray 5ml Neem Oil per liter of water for sucking pests, or use Carbendazim + Mancozeb for fungal spots.\n- 3. **Irrigation:** Maintain proper field drainage to avoid root rot.";
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
    const city = req.query.city || req.user?.address || 'Delhi';
    const response = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
    
    if (!response.ok) {
       return res.status(400).json({ message: 'Weather data unavailable' });
    }

    const data = await response.json();
    const current = data.current_condition[0];
    const tempC = parseInt(current.temp_C, 10);
    const humidity = parseInt(current.humidity, 10);
    const condition = current.weatherDesc[0].value;

    let smartAdvice = "Optimal farming weather. Perfect for standard field activities.";
    if (condition.toLowerCase().includes('rain') || condition.toLowerCase().includes('drizzle')) {
      smartAdvice = "Rain expected. Postpone fertilizer/pesticide spraying to prevent wash-off.";
    } else if (humidity > 80) {
      smartAdvice = "High humidity level detected. Monitor crops closely for fungal diseases.";
    } else if (tempC > 38) {
      smartAdvice = "High temperature alert. Provide evening irrigation to protect crops from heat stress.";
    }

    const weather = {
      temp_c: current.temp_C,
      condition: condition,
      humidity: current.humidity,
      wind_kmh: current.windspeedKmph,
      city: data.nearest_area?.[0]?.areaName?.[0]?.value || city,
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
       return res.status(400).json({ message: 'No image provided for analysis.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const languageMap = { 'gu': 'Gujarati', 'hi': 'Hindi', 'en': 'English' };
    const targetLang = languageMap[lang] || 'English';

    if (!apiKey) {
       console.warn("GEMINI_API_KEY is missing. Returning mock structured diagnosis.");
       return res.json({ analysis: getMockAnalysis(lang), isMock: true });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const candidateModels = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.5-flash", "gemini-1.0-pro"];

    const prompt = `You are an expert Indian Agronomist AI Doctor. Analyze this crop leaf image.
CRITICAL INSTRUCTION: Return your response strictly in raw JSON format (no backticks, no markdown fence) with the following structure:
{
  "status": "Short status e.g. Disease Detected / Deficiency / Healthy",
  "disease": "Disease or pest name (both common name and English/scientific if applicable)",
  "severity": "Low" | "Medium" | "High" | "Healthy",
  "symptoms": "Brief explanation of symptoms seen",
  "remedies": [
    "Organic treatment option 1",
    "Chemical treatment option 2"
  ],
  "prevention": "1-2 lines on preventing recurrence"
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

    // Clean JSON format if markdown codeblock fence is attached
    if (text.startsWith("```json")) {
      text = text.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (text.startsWith("```")) {
      text = text.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    res.json({ analysis: text });
  } catch (error) {
    console.error("AI Crop Scan Error:", error);
    // Fallback to mock analysis if Gemini API fails or model fails
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

    const apiKey = process.env.GEMINI_API_KEY;
    const languageMap = { 'gu': 'Gujarati', 'hi': 'Hindi', 'en': 'English' };
    const targetLang = languageMap[lang] || 'English';

    if (!apiKey) {
      return res.json({ answer: getAgronomyFallback(question, lang) });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const candidateModels = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.5-flash", "gemini-1.0-pro"];

    const prompt = `You are Annadata's expert AI Agronomist specializing in Indian agriculture, soil health, crop diseases, fertilizers, and farming advice.
Farmer's Question: "${question}"
Instructions:
- Provide a helpful, clear, and encouraging answer in bullet points or short paragraphs.
- Keep remedies practical and accessible to Indian farmers.
- Write the response entirely in ${targetLang}.`;

    try {
      const text = await generateContentWithFallback(genAI, candidateModels, prompt);
      return res.json({ answer: text });
    } catch (apiErr) {
      console.warn("Gemini API call failed for Q&A, using Agronomy fallback:", apiErr.message);
      return res.json({ answer: getAgronomyFallback(question, lang), isFallback: true });
    }
  } catch (error) {
    console.error("AI Agronomist Q&A Error:", error);
    res.json({ answer: getAgronomyFallback(req.body?.question, req.body?.lang) });
  }
};


