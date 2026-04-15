import { GoogleGenerativeAI } from '@google/generative-ai';

// Controller 1: Fetch localized weather using wttr.in (no API key needed)
export const getWeather = async (req, res) => {
  try {
    const city = req.query.city || req.user.address || 'Delhi';
    const response = await fetch(`https://wttr.in/${city}?format=j1`);
    
    if (!response.ok) {
       return res.status(400).json({ message: 'Weather data unavailable' });
    }

    const data = await response.json();
    
    // Extract concise useful data
    const current = data.current_condition[0];
    const weather = {
      temp_c: current.temp_C,
      condition: current.weatherDesc[0].value,
      humidity: current.humidity,
      wind_kmh: current.windspeedKmph,
      city: data.nearest_area[0].areaName[0].value
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
    if (!apiKey) {
       return res.status(500).json({ message: 'AI Engine is currently unconfigured (No API Key).' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    
    const languageMap = { 'gu': 'Gujarati', 'hi': 'Hindi', 'en': 'English' };
    const targetLang = languageMap[lang] || 'English';

    // Expecting imageBase64 to be sent without the "data:image/jpeg;base64," prefix.
    const prompt = `You are an expert agronomist. Analyze this crop leaf image. Identify any visible diseases, deficiencies, or pests. Provide a short 3-sentence summary of the diagnosis and immediately actionable advice for the farmer. CRITICAL: You MUST write your ENTIRE final response translated perfectly in the ${targetLang} language. Do NOT use English if ${targetLang} was requested.`;

    const imageParts = [
      {
        inlineData: {
          data: imageBase64,
          mimeType: "image/jpeg"
        }
      }
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();

    res.json({ analysis: text });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ message: error.message });
  }
};
