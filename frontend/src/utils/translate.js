import i18n from '../i18n';

const dynamicDictionary = {
  // Categories & Filters
  'all': { gu: 'બધા', hi: 'सभी', en: 'All' },
  'grains': { gu: 'અનાજ', hi: 'अनाज', en: 'Grains' },
  'vegetables': { gu: 'શાકભાજી', hi: 'सब्‍जियां', en: 'Vegetables' },
  'fruits': { gu: 'ફળો', hi: 'फल', en: 'Fruits' },
  'spices': { gu: 'મસાલા', hi: 'मसाले', en: 'Spices' },
  'other': { gu: 'અન્ય', hi: 'अन्य', en: 'Other' },

  // Crops & Produce
  'wheat': { gu: 'ઘઉં', hi: 'गेहूं', en: 'Wheat' },
  'cotton': { gu: 'કપાસ', hi: 'कपास', en: 'Cotton' },
  'rice': { gu: 'ચોખા / ડાંગર', hi: 'चावल / धान', en: 'Rice' },
  'paddy': { gu: 'ડાંગર', hi: 'धान', en: 'Paddy' },
  'corn': { gu: 'મકાઈ', hi: 'मक्का', en: 'Corn' },
  'maize': { gu: 'મકાઈ', hi: 'मक्का', en: 'Maize' },
  'groundnut': { gu: 'મગફળી', hi: 'मूंगफली', en: 'Groundnut' },
  'peanut': { gu: 'મગફળી', hi: 'मूंगफली', en: 'Peanut' },
  'mustard': { gu: 'રાયડો', hi: 'सरसों', en: 'Mustard' },
  'sugarcane': { gu: 'શેરડી', hi: 'गन्ना', en: 'Sugarcane' },
  'potato': { gu: 'બટાટા', hi: 'आलू', en: 'Potato' },
  'onion': { gu: 'ડુંગળી', hi: 'प्याज', en: 'Onion' },
  'tomato': { gu: 'ટમેટા', hi: 'टमाटर', en: 'Tomato' },
  'chili': { gu: 'મરચાં', hi: 'मिर्च', en: 'Chili' },
  'turmeric': { gu: 'હળદર', hi: 'हल्दी', en: 'Turmeric' },
  'cumin': { gu: 'જીરું', hi: 'जीरा', en: 'Cumin' },

  // Statuses & Types
  'pending': { gu: 'સમીક્ષા બાકી છે', hi: 'समीक्षा लंबित', en: 'Pending Review' },
  'approved': { gu: 'મંજૂર થયેલ', hi: 'स्वीकृत', en: 'Approved' },
  'rejected': { gu: 'અસ્વીકૃત', hi: 'अस्वीकृत', en: 'Rejected' },
  'harvested': { gu: 'લણણી થયેલ', hi: 'कटाई पूर्ण', en: 'Harvested' },
  'growing': { gu: 'ખેતરમાં ઉગતો', hi: 'खेत में बढ़ती', en: 'Growing' },
  'ready': { gu: 'વેચાણ માટે તૈયાર', hi: 'बिक्री के लिए तैयार', en: 'Ready to Sell' },
  'active': { gu: 'સક્રિય', hi: 'सक्रिय', en: 'Active' },
  'completed': { gu: 'પૂર્ણ થયેલ', hi: 'પૂર્ણ', en: 'Completed' },
  'cancelled': { gu: 'રદ કરેલ', hi: 'રદ્દ', en: 'Cancelled' },

  // Seasons
  'monsoon': { gu: 'ચોમાસું', hi: 'मानसून', en: 'Monsoon' },
  'winter': { gu: 'શિયાળો', hi: 'સર્દિયાં', en: 'Winter' },
  'summer': { gu: 'ઉનાળો', hi: 'गर्मी', en: 'Summer' },
  'all season': { gu: 'બધી ઋતુ', hi: 'सभी मौसम', en: 'All Season' },

  // Services & Labor
  'labor': { gu: 'મજૂર / લેબર', hi: 'मजदूर', en: 'Labor' },
  'transportation': { gu: 'પરિવહન / ટ્રાન્સપોર્ટ', hi: 'परिवहन', en: 'Transportation' },
  'soil testing': { gu: 'જમીન પરીક્ષણ', hi: 'मिट्टी परीक्षण', en: 'Soil Testing' },
  'veterinary': { gu: 'પશુચિકિત્સા (વેટરનરી)', hi: 'पशु चिकित्सा', en: 'Veterinary' },
  'advisory': { gu: 'ખેતી સલાહ', hi: 'कृषि सलाह', en: 'Advisory' },
  'tractor plowing': { gu: 'ટ્રેક્ટર ખેડાણ', hi: 'ट्रैक्टर जुताई', en: 'Tractor Plowing' },
  'drone spraying': { gu: 'ડ્રોન છંટકાવ', hi: 'ड्रोन छिड़काव', en: 'Drone Spraying' },

  // Machinery & Tools
  'tractor': { gu: 'ટ્રેક્ટર', hi: 'ट्रैक्टर', en: 'Tractor' },
  'harvester': { gu: 'હારવેસ્ટર', hi: 'હારવેસ્ટર', en: 'Harvester' },
  'rotavator': { gu: 'રોટાવેટર', hi: 'રોટાવાઇટર', en: 'Rotavator' },
  'thresher': { gu: 'થ્રેસર', hi: 'थ्रेशर', en: 'Thresher' },
  'cultivator': { gu: 'કલ્ટીવેટર', hi: 'कल्टीवेटर', en: 'Cultivator' },
  'sprayer': { gu: 'સ્પ્રેયર પંપ', hi: 'સ્પ્રેયર', en: 'Sprayer' },

  // Durations & Rates
  'per day': { gu: 'પ્રતિ દિવસ', hi: 'प्रति दिन', en: 'per day' },
  'per hour': { gu: 'પ્રતિ કલાક', hi: 'प्रति घंटा', en: 'per hour' },
  'per acre': { gu: 'પ્રતિ એકર', hi: 'प्रति एकड़', en: 'per acre' },
  'flat fee': { gu: 'ફિક્સ રકમ', hi: 'एकमुश्त शुल्क', en: 'flat fee' },
  'daily': { gu: 'દૈનિક', hi: 'दैनिक', en: 'Daily' },

  // Purposes
  'rent': { gu: 'ભાડે / લીઝ', hi: 'किराया / पट्टा', en: 'Rent / Lease' },
  'sell': { gu: 'વેચવા માટે', hi: 'बेचना', en: 'Sell' },
  'partnership': { gu: 'ભાગીદારી', hi: 'સાાઝેદારી', en: 'Partnership' }
};

export const translateText = (text) => {
  if (!text) return '';
  const currentLang = i18n.language || localStorage.getItem('selectedLang') || 'en';
  if (currentLang === 'en') return text;

  const key = String(text).trim().toLowerCase();
  if (dynamicDictionary[key] && dynamicDictionary[key][currentLang]) {
    return dynamicDictionary[key][currentLang];
  }

  // Substring or pattern replacement for known phrases
  let translated = String(text);
  Object.keys(dynamicDictionary).forEach((dictKey) => {
    const val = dynamicDictionary[dictKey][currentLang];
    if (val) {
      const regex = new RegExp(`\\b${dictKey}\\b`, 'gi');
      translated = translated.replace(regex, val);
    }
  });

  return translated;
};
