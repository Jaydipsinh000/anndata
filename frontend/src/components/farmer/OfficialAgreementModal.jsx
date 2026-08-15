import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Award, FileText, Printer, ShieldCheck, X, CheckCircle2, Building2, Handshake, Landmark, Globe, Check, AlertCircle } from 'lucide-react';
import { translateText } from '../../utils/translate';

function OfficialAgreementModal({ land, onClose }) {
  const { i18n } = useTranslation();
  const [docLang, setDocLang] = useState(i18n.language || 'gu');

  if (!land) return null;

  // Determine Contract Type
  const isLease = land.status === 'rented_to_company' || land.purpose === 'lease';
  const isPartnership = land.status === 'partnership_active' || land.purpose === 'partnership';
  const isSale = land.status === 'sold' || land.purpose === 'sell';

  // Date Calculation Helpers
  const formatDate = (dateStr, lang) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(lang === 'gu' ? 'gu-IN' : (lang === 'hi' ? 'hi-IN' : 'en-IN'), {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  const startDate = land.contract_start_date ? formatDate(land.contract_start_date, docLang) : (land.createdAt ? formatDate(land.createdAt, docLang) : formatDate(new Date(), docLang));
  
  const getEndDateStr = () => {
    if (land.contract_end_date) return formatDate(land.contract_end_date, docLang);
    const start = land.contract_start_date ? new Date(land.contract_start_date) : (land.createdAt ? new Date(land.createdAt) : new Date());
    const years = land.lease_duration_years || 5;
    const end = new Date(start);
    end.setFullYear(end.getFullYear() + years);
    return formatDate(end, docLang);
  };
  const endDate = getEndDateStr();

  // Exhaustive Real-World Legal Clauses Dictionary
  const legalDocs = {
    gu: {
      leaseTitle: "કૃષિ જમીન કોર્પોરેટ લીઝ પટ્ટા અધિકૃત કરાર પત્ર",
      partnershipTitle: "કૃષિ ભાગીદારી સોદો અને સંયુક્ત સાહસ અધિકૃત કરાર પત્ર",
      saleTitle: "જમીન વેચાણ અને માલિકી હસ્તાંતરણ અધિકૃત પત્ર",
      subHeader: "અન્નદાતા કૃષિ ડિજિટલ લીગલ રજિસ્ટ્રી અને કોન્ટ્રાક્ટ ફ્રેમવર્ક",
      refCode: "કરાર રજિસ્ટ્રી નંબર:",
      statusActive: "સક્રિય અને કાયદેસર માન્ય કરાર",
      partiesHeader: "૧. કરારના સત્તાવાર પક્ષકારો (CONTRACTING PARTIES)",
      landowner: "જમીન માલિક (Lessor / Farmer):",
      partner: "લીઝી / ભાગીદાર (Lessee / Partner):",
      partnerCorp: "અન્નદાતા કોર્પોરેટ એગ્રી પોર્ટલ ડેસ્ક",
      contact: "રજિસ્ટર્ડ સંપર્ક નંબર:",
      parcelHeader: "૨. જમીન સંપત્તિ વિગતો (PROPERTY PARCEL DETAILS)",
      area: "કુલ મંજૂર વિસ્તાર:",
      acres: "એકર",
      location: "ગામ અને જિલ્લો:",
      quality: "માટી અને પાણી પદ્ધતિ:",
      termsHeader: "૩. કરાર ની અવધિ અને નાણાકીય ચુકવણી શરતો (TERMS & SETTLEMENT)",
      start: "કરાર શરૂઆત તારીખ:",
      end: "કરાર સમાપ્તિ તારીખ:",
      rentPrice: "વાર્ષિક નક્કી કરેલ ભાડું (Guaranteed Annual Rent):",
      investmentPrice: "વાર્ષિક ભાગીદારી મૂડી રોકાણ:",
      salePrice: "કુલ નક્કી કરેલ વેચાણ રકમ:",
      payoutFreq: "ભાડા ચુકવણી પદ્ધતિ:",
      yearlyPayout: "વાર્ષિક એડવાન્સ બેંક ચુકવણી (Yearly Direct Bank Transfer)",
      profitRatio: "નફાની વહેંચણી:",
      farmerContrib: "ખેડૂતનું યોગદાન:",
      corpContrib: "કંપનીનું યોગદાન:",
      corpContribDesc: "ઉચ્ચ બીજ, જૈવિક ખાતર, ટપક સિંચાઈ, મશીનરી અને 100% ખરીદી ની ખાતરી",
      landOnly: "માત્ર જમીન પૂરી પાડવી (Zero Farming Liability)",
      landLabor: "જમીન સંપત્તિ અને સ્થાનિક ખેતર દેખરેખ",
      clausesHeader: "૪. કાયદાકીય નિયમો અને કરાર ની સત્તાવાર શરતો (DETAILED LEGAL TERMS & CONDITIONS)",
      
      // Detailed Lease Terms (Rent Only)
      leaseClauses: [
        { title: "જમીન વપરાશ અધિકાર (Possession Rights)", desc: "જમીન માલિક પોતાની જમીન નક્કી કરેલ અવધિ માટે માત્ર કૃષિ હેતુસર અન્નદાતા કોર્પોરેટ ડેસ્કને લીઝ પર આપે છે. જમીનનો ઉપયોગ કોઈ પણ બિન-કૃષિ કે ગેરકાયદેસર પ્રવૃત્તિ માટે થઈ શકશે નહીં." },
        { title: "નિશ્ચિત ભાડું ગેરંટી (Guaranteed Annual Rent)", desc: "કંપની જમીન માલિકને નક્કી કરેલ વાર્ષિક ભાડું નિયત સમયે ચૂકવવા બંધાયેલી છે. ચોમાસું, દુષ્કાળ કે પાક નિષ્ફળ જવાના કિસ્સામાં પણ ખેડૂતના ભાડામાં કોઈ કપાત થશે નહીં." },
        { title: "જમીન માલિકી હક (Ownership Rights Retention)", desc: "જમીનના ૭/૧૨ અને ૮-અ માલિકી હક 100% ખેડૂતના નામે જ રહેશે. PM-KISAN કે સરકારી યોજનાઓની સહાય મેળવવાનો ખેડૂતનો અધિકાર અબાધિત રહેશે." },
        { title: "પાકની જવાબદારીમાંથી મુક્તિ (Zero Farming Risk)", desc: "જમીન માલિકે ખેતીમાં કોઈ નાણાકીય રોકાણ કે મજૂરી કરવાની રહેશે નહીં. પાકના વાવેતર, લણણી અને વેચાણની તમામ જવાબદારી કંપનીની રહેશે." },
        { title: "જમીન ફળદ્રુપતા સંરક્ષણ (Soil & Environmental Care)", desc: "કંપની જમીનમાં જૈવિક ખાતરો અને આધુનિક સિંચાઈ પદ્ધતિનો ઉપયોગ કરશે જેથી જમીનની ફળદ્રુપતા જળવાઈ રહે. લીઝ પૂરી થતાં જમીન મૂળ સ્થિતિમાં પરત કરવામાં આવશે." },
        { title: "વીજળી અને બોરવેલ વપરાશ (Utilities & Electricity)", desc: "હાલના બોરવેલ અને ૩-ફેઝ લાઈટ જોડાણનો ઉપયોગ કંપની કરી શકશે અને લીઝ અવધિ દરમિયાનના તમામ વીજળી બિલ કંપની દ્વારા ચૂકવવામાં આવશે." },
        { title: "કરાર રદ્દીકરણ શરત (Termination Clause)", desc: "જો કોઈ પક્ષ કરાર સમય પહેલાં રદ કરવા માંગે તો ૯૦ દિવસની અગાઉથી લેખિત નોટિસ આપવી ફરજિયાત રહેશે." },
        { title: "કાનૂની સુરક્ષા અને વિવાદ નિકાલ (Legal Immunity & Jurisdiction)", desc: "ખેતરમાં કામ કરતા મજૂરો કે સાધનો સંબંધિત કોઈ પણ અકસ્માત માટે કંપની જવાબદાર રહેશે. કોઈ પણ વિવાદના કિસ્સામાં સ્થાનિક જિલ્લા અદાલતનું ન્યાયક્ષેત્ર રહેશે." }
      ],

      // Detailed Partnership Terms (Joint Venture)
      partnershipClauses: [
        { title: "સંયુક્ત સાહસ હેતુ (Joint Venture Objective)", desc: "આ કરાર ખેડૂત અને અન્નદાતા કોર્પોરેટ વચ્ચે સંયુક્ત કૃષિ ભાગીદારી સ્થાપે છે, જેમાં આધુનિક ટેકનોલોજી દ્વારા મહત્તમ પાક ઉત્પાદન મેળવવાનું લક્ષ્ય છે." },
        { title: "નફાની વહેંચણી (Profit Sharing Mechanism)", desc: "પાકની લણણી અને વેચાણ પછી કુલ ચોખ્ખા નફામાંથી નક્કી કર્યા મુજબ (૫૦% ખેડૂત / ૫૦% કંપની) રકમ ખેડૂતના બેંક ખાતામાં સીધી ટ્રાન્સફર કરવામાં આવશે." },
        { title: "100% રોકાણ કંપની દ્વારા (Full Input Capital Funding)", desc: "ઉચ્ચ ગુણવત્તાવાળા બીજ, ખાતર, દવાઓ, ડ્રોન છંટકાવ અને મશીનરીનો તમામ ખર્ચ કંપની દ્વારા કરવામાં આવશે. ખેડૂતે કોઈ રોકાણ કરવાનું રહેશે નહીં." },
        { title: "ન્યૂનતમ ટેકાના ભાવની ગેરંટી (Minimum Floor Price Protection)", desc: "જો બજારમાં પાકના ભાવ ઘટી જાય તો પણ ખેડૂતને નુકસાન ન થાય તે માટે કંપની દ્વારા નક્કી કરેલ ગેરંટેડ ફ્લોર પ્રાઇઝ આપવાનું વચન આપવામાં આવે છે." },
        { title: "નિષ્ણાત કૃષિ સલાહ (Agronomist Supervision)", desc: "કંપનીના કૃષિ નિષ્ણાતો સમયાંતરે ખેતરની મુલાકાત લેશે અને વાવણીથી લણણી સુધીનું ટેકનિકલ માર્ગદર્શન પૂરું પાડશે." },
        { title: "સીધું માર્કેટ બાયબેક (100% Farmgate Buyback)", desc: "તમામ તૈયાર પાક ખેતરથી જ કંપની દ્વારા ખરીદી લેવામાં આવશે. ખેડૂતને મંડી કે પરિવહનનો કોઈ ખર્ચ ભોગવવો પડશે નહીં." },
        { title: "પારદર્શક ઓડિટ હિસાબ (Transparent Accounting)", desc: "અન્નદાતા એપમાં ખેડૂત દરેક પાક ચક્રનો ઇનપુટ ખર્ચ, ઉત્પાદનનું વજન અને નફાનો હિસાબ લાઈવ જોઈ શકશે." },
        { title: "કુદરતી આફત વીમો (Crop Insurance Coverage)", desc: "અતિવૃષ્ટિ કે કુદરતી આફત વખતે પાક વીમા કવરેજ હેઠળ નુકસાનનું વળતર મેળવવા બંને પક્ષો સંયુક્ત અરજી કરશે." }
      ],

      // Detailed Sale Terms
      saleClauses: [
        { title: "માલિકી હસ્તાંતરણ (Title Conveyance)", desc: "જમીન માલિક નક્કી કરેલ કુલ રકમ પ્રાપ્ત થયા બાદ આ મિલકતના તમામ કાયદેસરના હકો ખરીદનારને હસ્તાંતરિત કરવા સંમતિ આપે છે." },
        { title: "દસ્તાવેજ અને સરકારી મંજૂરી (Registration & NOC)", desc: "જમીન પર કોઈ બોજો, દેવું કે કાનૂની વિવાદ નથી તેવું પ્રમાણપત્ર આપી રજિસ્ટ્રી દસ્તાવેજ પૂર્ણ કરી આપવામાં આવશે." }
      ],

      notesHeader: "એડમિન મંજૂરી નોંધ / સત્તાવાર શરતો:",
      sealTitle: "અન્નદાતા ડીજીટલ લીગલ સીલ",
      sealVerified: "ડીજીટલી ચકાસાયેલ અને સત્તાવાર રીતે મંજૂર",
      sigTitle: "સત્તાવાર અધિકૃત સહી",
      sigSub: "અન્નદાતા પોર્ટલ કોર્પોરેટ ડેસ્ક",
      printBtn: "સત્તાવાર કરાર પત્ર પ્રિન્ટ / પીડીએફ ડાઉનલોડ કરો",
      closeBtn: "બંધ કરો"
    },
    hi: {
      leaseTitle: "कृषि भूमि कॉर्पोरेट लीज पट्टा आधिकारिक अनुबंध पत्र",
      partnershipTitle: "कृषि साझेदारी संयुक्त उद्यम आधिकारिक अनुबंध पत्र",
      saleTitle: "भूमि बिक्री एवं स्वामित्व हस्तांतरण आधिकारिक पत्र",
      subHeader: "अन्नदाता कृषि डिजिटल लीगल रजिस्ट्री एवं अनुबंध ढांचा",
      refCode: "अनुबंध रजिस्ट्री क्रमांक:",
      statusActive: "सक्रिय एवं कानूनी रूप से मान्य अनुबंध",
      partiesHeader: "१. अनुबंध के आधिकारिक पक्षकार (CONTRACTING PARTIES)",
      landowner: "भूमि स्वामी (Lessor / Farmer):",
      partner: "लीजी / साझेदार (Lessee / Partner):",
      partnerCorp: "अन्नदाता कॉर्पोरेट एग्री पोर्टल डेस्क",
      contact: "पंजीकृत संपर्क नंबर:",
      parcelHeader: "२. भूमि संपत्ति विवरण (PROPERTY PARCEL DETAILS)",
      area: "कुल स्वीकृत क्षेत्रफल:",
      acres: "एकड़",
      location: "गांव एवं जिला:",
      quality: "मिट्टी एवं जल प्रणाली:",
      termsHeader: "३. अनुबंध की अवधि एवं वित्तीय भुगतान शर्तें (TERMS & SETTLEMENT)",
      start: "अनुबंध प्रारंभ तिथि:",
      end: "अनुबंध समाप्ति तिथि:",
      rentPrice: "वार्षिक तय किराया (Guaranteed Annual Rent):",
      investmentPrice: "वार्षिक साझेदारी पूंजी निवेश:",
      salePrice: "कुल तय बिक्री राशि:",
      payoutFreq: "किराया भुगतान का तरीका:",
      yearlyPayout: "वार्षिक एडवांस बैंक भुगतान (Yearly Direct Bank Transfer)",
      profitRatio: "लाभ का बंटवारा:",
      farmerContrib: "किसान का योगदान:",
      corpContrib: "कंपनी का योगदान:",
      corpContribDesc: "उत्कृष्ट बीज, जैविक खाद, ड्रिप सिस्टम, मशीनरी एवं 100% खरीद गारंटी",
      landOnly: "केवल भूमि प्रदान करना (Zero Farming Liability)",
      landLabor: "भूमि संपत्ति एवं स्थानीय खेत देखभाल",
      clausesHeader: "४. कानूनी नियम एवं अनुबंध की विस्तृत शर्तें (DETAILED LEGAL TERMS & CONDITIONS)",
      
      leaseClauses: [
        { title: "भूमि उपयोग अधिकार (Possession Rights)", desc: "भूमि स्वामी अपनी भूमि तय अवधि के लिए केवल कृषि उद्देश्य हेतु अन्नदाता कॉर्पोरेट डेस्क को लीज पर देता है। भूमि का उपयोग किसी भी गैर-कृषि कार्य में नहीं किया जा सकता।" },
        { title: "निश्चित किराया गारंटी (Guaranteed Annual Rent)", desc: "कंपनी भूमि स्वामी को तय वार्षिक किराया निर्धारित समय पर देने हेतु बाध्य है। प्राकृतिक आपदा या फसल नुकसान की स्थिति में भी किसान के किराये में कटौती नहीं होगी।" },
        { title: "भूमि स्वामित्व अधिकार (Ownership Rights Retention)", desc: "भूमि के सभी खसरा/खतौनी स्वामित्व अधिकार 100% किसान के नाम ही रहेंगे। सरकारी योजनाओं का लाभ पाने का किसान का अधिकार सुरक्षित रहेगा।" },
        { title: "फसल जोखिम से मुक्ति (Zero Farming Risk)", desc: "भूमि स्वामी को खेती में कोई वित्तीय निवेश या मजदूरी नहीं करनी होगी। फसल की बुआई, कटाई और बिक्री की पूरी जिम्मेदारी कंपनी की होगी।" },
        { title: "भूमि उर्वरता संरक्षण (Soil & Environmental Care)", desc: "कंपनी भूमि में जैविक खाद और आधुनिक सिंचाई तकनीक का उपयोग करेगी ताकि मिट्टी की उपजाऊ क्षमता बनी रहे।" },
        { title: "बिजली एवं ट्यूबवेल उपयोग (Utilities & Electricity)", desc: "वर्तमान ट्यूबवेल और 3-फेज बिजली कनेक्शन का उपयोग कंपनी कर सकेगी और लीज अवधि के सभी बिजली बिल कंपनी भरेगी।" },
        { title: "अनुबंध निरस्तीकरण शर्त (Termination Clause)", desc: "समय से पूर्व अनुबंध समाप्त करने हेतु 90 दिनों की लिखित सूचना देना अनिवार्य होगा।" },
        { title: "कानूनी सुरक्षा (Legal Immunity)", desc: "खेत में काम करने वाले श्रमिकों या उपकरणों संबंधी किसी दुर्घटना के लिए कंपनी जिम्मेदार होगी।" }
      ],

      partnershipClauses: [
        { title: "संयुक्त उद्यम उद्देश्य (Joint Venture Objective)", desc: "यह अनुबंध किसान और अन्नदाता कॉर्पोरेट के बीच संयुक्त कृषि साझेदारी स्थापित करता है, जिसका लक्ष्य आधुनिक तकनीक से अधिकतम उत्पादन प्राप्त करना है।" },
        { title: "लाभ का बंटवारा (Profit Sharing Mechanism)", desc: "फसल बिक्री के बाद कुल शुद्ध लाभ में से तय अनुपात (50% किसान / 50% कंपनी) के अनुसार राशि किसान के बैंक खाते में ट्रांसफर की जाएगी।" },
        { title: "100% निवेश कंपनी द्वारा (Full Input Capital Funding)", desc: "उत्कृष्ट बीज, खाद, दवाइयां, ड्रोन छिड़काव और मशीनरी का पूरा खर्च कंपनी वहन करेगी।" },
        { title: "न्यूनतम समर्थन मूल्य गारंटी (Minimum Floor Price Protection)", desc: "बाजार में दाम गिरने पर भी किसान को नुकसान से बचाने हेतु कंपनी द्वारा तय गारंटीड फ्लोर प्राइस दिया जाएगा।" },
        { title: "विशेषज्ञ कृषि सलाह (Agronomist Supervision)", desc: "कंपनी के कृषि विशेषज्ञ समय-समय पर खेत का दौरा कर तकनीकी मार्गदर्शन प्रदान करेंगे।" },
        { title: "सीधी खरीद गारंटी (100% Farmgate Buyback)", desc: "तैयार फसल खेत से ही कंपनी द्वारा खरीदी जाएगी। किसान को मंडी या परिवहन का कोई खर्च नहीं देना होगा।" },
        { title: "पारदर्शी लेखा (Transparent Accounting)", desc: "अन्नदाता ऐप में किसान प्रत्येक फसल चक्र की लागत और लाभ का हिसाब लाइव देख सकेगा।" },
        { title: "प्राकृतिक आपदा बीमा (Crop Insurance Coverage)", desc: "प्राकृतिक आपदा की स्थिति में फसल बीमा दावों हेतु दोनों पक्ष संयुक्त आवेदन करेंगे।" }
      ],

      saleClauses: [
        { title: "स्वामित्व हस्तांतरण (Title Conveyance)", desc: "भूमि स्वामी तय मूल्य प्राप्त होने के बाद संपत्ति के सभी कानूनी अधिकार खरीदार को हस्तांतरित करने हेतु सहमत है।" }
      ],

      notesHeader: "एडमिन स्वीकृति नोट / आधिकारिक शर्तें:",
      sealTitle: "अन्नदाता डिजिटल लीगल सील",
      sealVerified: "डिजिटल रूप से सत्यापित एवं आधिकारिक स्वीकृत",
      sigTitle: "आधिकारिक अधिकृत हस्ताक्षर",
      sigSub: "अन्नदाता पोर्टल कॉर्पोरेट डेस्क",
      printBtn: "आधिकारिक अनुबंध पत्र प्रिंट / पीडीएफ डाउनलोड करें",
      closeBtn: "बंद करें"
    },
    en: {
      leaseTitle: "OFFICIAL AGRICULTURAL CORPORATE LEASE DEED",
      partnershipTitle: "OFFICIAL FARMING PARTNERSHIP & JOINT VENTURE CONTRACT",
      saleTitle: "OFFICIAL LAND SALE & TITLE TRANSFER DEED",
      subHeader: "Anndata Agritech Digital Legal Registry & Contract Framework",
      refCode: "REGISTRATION REF NO:",
      statusActive: "EXECUTED & LEGALLY BINDING CONTRACT",
      partiesHeader: "1. CONTRACTING PARTIES",
      landowner: "Lessor (Landowner / Farmer):",
      partner: "Lessee / Partner:",
      partnerCorp: "Anndata Corporate Agri Portal Desk",
      contact: "Registered Mobile:",
      parcelHeader: "2. PROPERTY PARCEL DETAILS",
      area: "Approved Parcel Area:",
      acres: "Acres",
      location: "Village & District:",
      quality: "Soil & Irrigation System:",
      termsHeader: "3. CONTRACT TERM & FINANCIAL SETTLEMENT",
      start: "Commencement Date:",
      end: "Expiration Date:",
      rentPrice: "Guaranteed Annual Rent:",
      investmentPrice: "Annual Joint Venture Capital:",
      salePrice: "Total Agreed Consideration:",
      payoutFreq: "Payout Settlement Schedule:",
      yearlyPayout: "Yearly Advance Direct Bank Transfer",
      profitRatio: "Profit Sharing Ratio:",
      farmerContrib: "Farmer Contribution:",
      corpContrib: "Corporate Contribution:",
      corpContribDesc: "High-yield Seeds, Bio-Fertilizers, Drip Systems, Machinery & 100% Buyback Guarantee",
      landOnly: "Land Ownership Asset Only (Zero Farming Risk)",
      landLabor: "Land Asset & Local Field Supervision",
      clausesHeader: "4. DETAILED LEGAL TERMS & CONDITIONS",
      
      leaseClauses: [
        { title: "Possession & Agrarian Rights", desc: "The Lessor grants exclusive agrarian possession of the specified parcel to Lessee solely for sustainable crop cultivation. No non-agricultural or unauthorized construction is permitted." },
        { title: "Guaranteed Annual Rent Assurance", desc: "The Lessee guarantees fixed annual rental payout regardless of weather calamities, drought, or crop market price fluctuations." },
        { title: "Retention of Title & Ownership", desc: "100% legal title (7/12 & 8A records) remains exclusively in the name of the Landowner. Government ownership subsidies (e.g. PM-KISAN) remain unabated with Landowner." },
        { title: "Zero Farming Risk & Operational Immunity", desc: "Landowner is exempted from all operational costs, labor management, or farming liabilities. All cultivation, harvesting, and selling expenses belong strictly to Lessee." },
        { title: "Soil Conservation & Environmental Care", desc: "Lessee agrees to use bio-fertilizers and organic enrichment practices to maintain soil fertility and return land in prime condition upon lease expiration." },
        { title: "Utilities & Electricity Bill Settlement", desc: "Lessee is authorized to utilize existing borewells and 3-phase electricity connections, and shall settle all electricity utility bills during the lease term." },
        { title: "Termination & Default Terms", desc: "Early termination requires a mandatory 90-day prior written notice by either party." },
        { title: "Indemnification & Legal Jurisdiction", desc: "Lessee indemnifies Landowner against third-party farm labor disputes or operational equipment liabilities. Jurisdiction resides with the District Court of Land Location." }
      ],

      partnershipClauses: [
        { title: "Joint Venture Framework", desc: "This agreement establishes a collaborative farming joint venture between Farmer and Anndata Corporate to maximize agricultural yield through modern technology." },
        { title: "Profit Sharing Mechanism", desc: "Net crop profits post-harvest shall be disbursed directly to Farmer's bank account according to the pre-agreed ratio (e.g., 50% Farmer / 50% Corporate)." },
        { title: "100% Input Capital Funded by Corporate", desc: "All certified seeds, organic fertilizers, drone spraying, and machinery costs are 100% funded by Corporate Investors. Farmer contributes zero financial capital." },
        { title: "Guaranteed Floor Support Price", desc: "Farmer is protected against market crashes via a guaranteed Minimum Floor Support Price per quintal." },
        { title: "Agronomist Supervision & Guidance", desc: "Anndata certified agronomists provide end-to-end technical guidance from sowing to harvest." },
        { title: "100% Farmgate Buyback Guarantee", desc: "All harvested produce is purchased directly at farmgate, eliminating mandi transport expenses for the farmer." },
        { title: "Transparent App Ledger Audit", desc: "Farmer can inspect real-time input costs, crop weight, and net profit distribution via the Anndata Mobile App." },
        { title: "Natural Calamity Crop Insurance", desc: "Joint insurance claims will be filed to recover losses caused by severe weather or natural calamities." }
      ],

      saleClauses: [
        { title: "Title Conveyance & Transfer", desc: "Landowner agrees to convey unencumbered title rights to Buyer upon full consideration disbursement." }
      ],

      notesHeader: "OFFICIAL DESK APPROVAL NOTES:",
      sealTitle: "ANNDATA CORPORATE LEGAL SEAL",
      sealVerified: "Digitally Authenticated & Officially Approved",
      sigTitle: "AUTHORIZED SIGNATORY",
      sigSub: "Anndata Portal Corporate Desk",
      printBtn: "Print / Save Official Agreement Certificate",
      closeBtn: "Close"
    }
  };

  const tDoc = legalDocs[docLang] || legalDocs['gu'];

  // Color Theme styling
  const theme = isPartnership 
    ? { bgHeader: 'from-[#064e3b] via-[#047857] to-[#065f46]', border: 'border-emerald-500', badge: 'bg-emerald-100 text-emerald-950 border-emerald-300', termsBg: 'bg-emerald-950 text-white border-emerald-800' }
    : (isSale 
      ? { bgHeader: 'from-[#451a03] via-[#78350f] to-[#7c2d12]', border: 'border-amber-600', badge: 'bg-amber-100 text-amber-950 border-amber-300', termsBg: 'bg-amber-950 text-white border-amber-800' }
      : { bgHeader: 'from-[#0f172a] via-[#1e1b4b] to-[#1e293b]', border: 'border-indigo-500', badge: 'bg-indigo-100 text-indigo-950 border-indigo-300', termsBg: 'bg-slate-950 text-white border-indigo-950' }
    );

  const clausesList = isPartnership ? tDoc.partnershipClauses : (isSale ? tDoc.saleClauses : tDoc.leaseClauses);

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 z-50 animate-fadeIn">
      <div className={`bg-white text-slate-900 rounded-[2.5rem] w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-2xl border-4 ${theme.border} relative p-4 md:p-8 font-sans print:p-0 print:border-none print:shadow-none`}>
         
         {/* Top Header Bar: Language Switcher & Close Button */}
         <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-200 print:hidden">
            <div className="flex items-center gap-2">
               <Globe className="text-[#006400]" size={20} />
               <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Document Language:</span>
               <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button onClick={() => setDocLang('gu')} className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${docLang === 'gu' ? 'bg-[#006400] text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}`}>ગુજરાતી</button>
                  <button onClick={() => setDocLang('hi')} className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${docLang === 'hi' ? 'bg-[#006400] text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}`}>हिंदी</button>
                  <button onClick={() => setDocLang('en')} className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${docLang === 'en' ? 'bg-[#006400] text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}`}>English</button>
               </div>
            </div>

            <button onClick={onClose} className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors">
               <X size={20} />
            </button>
         </div>

         {/* Formal Legal Certificate Frame */}
         <div className="border-4 border-double border-slate-900 p-5 md:p-8 rounded-[2rem] relative bg-[radial-gradient(#f1f5f9_1px,transparent_1px)] [background-size:16px_16px]">
            
            {/* Header Banner */}
            <div className={`bg-gradient-to-r ${theme.bgHeader} text-white p-6 md:p-8 rounded-2xl text-center mb-6 relative overflow-hidden shadow-xl`}>
               <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
               
               <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest mb-3 border ${theme.badge}`}>
                  {isPartnership ? <Handshake size={16}/> : (isSale ? <Landmark size={16}/> : <Building2 size={16}/>)}
                  <span>{isPartnership ? 'Corporate Joint Venture' : (isSale ? 'Title Deed Transfer' : 'Corporate Land Lease')}</span>
               </div>

               <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight text-white mb-2 leading-tight">
                  {isPartnership ? tDoc.partnershipTitle : (isSale ? tDoc.saleTitle : tDoc.leaseTitle)}
               </h2>
               <p className="text-slate-200 text-xs md:text-sm font-medium">{tDoc.subHeader}</p>

               <div className="mt-4 flex flex-wrap justify-between items-center text-xs font-mono font-bold bg-white/10 p-3 rounded-xl border border-white/20">
                  <span>{tDoc.refCode} REF-ANN-{isPartnership ? 'JV' : (isSale ? 'SALE' : 'LSE')}-2026-{land._id.slice(-6).toUpperCase()}</span>
                  <span className="text-emerald-300 bg-emerald-950/90 px-3 py-1 rounded-full border border-emerald-500 uppercase flex items-center gap-1">
                     <CheckCircle2 size={14}/> {tDoc.statusActive}
                  </span>
               </div>
            </div>

            {/* Section 1 & 2: Contracting Parties & Property Particulars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
               <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <h4 className="font-extrabold text-slate-500 uppercase text-[11px] tracking-wider mb-3 flex items-center gap-2 border-b border-slate-200 pb-2">
                     <FileText size={16} className="text-[#006400]"/> {tDoc.partiesHeader}
                  </h4>
                  <div className="space-y-2 text-xs md:text-sm font-medium text-slate-800">
                     <p><strong className="font-bold text-slate-900">{tDoc.landowner}</strong> {land.farmer_id?.name || 'Registered Farmer'}</p>
                     <p><strong className="font-bold text-slate-900">{tDoc.partner}</strong> {tDoc.partnerCorp}</p>
                     <p><strong className="font-bold text-slate-900">{tDoc.contact}</strong> {land.farmer_id?.mobile || 'Verified Mobile'}</p>
                  </div>
               </div>

               <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <h4 className="font-extrabold text-slate-500 uppercase text-[11px] tracking-wider mb-3 flex items-center gap-2 border-b border-slate-200 pb-2">
                     <Building2 size={16} className="text-[#006400]"/> {tDoc.parcelHeader}
                  </h4>
                  <div className="space-y-2 text-xs md:text-sm font-medium text-slate-800">
                     <p><strong className="font-bold text-slate-900">{tDoc.area}</strong> <span className="font-black text-[#006400]">{land.area_in_acres} {tDoc.acres}</span></p>
                     <p><strong className="font-bold text-slate-900">{tDoc.location}</strong> {land.location}</p>
                     <p><strong className="font-bold text-slate-900">{tDoc.quality}</strong> {translateText(land.soil_type || 'Black Soil')} | {translateText(land.water_source || 'Borewell')}</p>
                  </div>
               </div>
            </div>

            {/* Section 3: Terms & Financial Settlement */}
            <div className={`${theme.termsBg} p-6 rounded-2xl mb-6 shadow-inner`}>
               <h4 className="font-extrabold text-amber-400 uppercase text-xs tracking-wider mb-4 border-b border-white/20 pb-2">
                  {tDoc.termsHeader}
               </h4>
               
               {isSale ? (
                  /* SALE DEED: Single Execution Date & Agreed Amount (No End Date) */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center mb-2">
                     <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                        <span className="text-slate-300 font-bold text-[10px] uppercase block mb-1">
                          {docLang === 'gu' ? 'દસ્તાવેજ અને હસ્તાંતરણ તારીખ (Transfer Date)' : (docLang === 'hi' ? 'दस्तावेज़ एवं हस्तांतरण तिथि (Transfer Date)' : 'Deed Execution & Transfer Date')}
                        </span>
                        <span className="font-black text-white text-base md:text-lg">{startDate}</span>
                     </div>

                     <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                        <span className="text-slate-300 font-bold text-[10px] uppercase block mb-1">{tDoc.salePrice}</span>
                        <span className="font-black text-emerald-400 text-base md:text-xl">₹ {land.price?.toLocaleString()}</span>
                     </div>
                  </div>
               ) : (
                  /* LEASE & PARTNERSHIP: Start Date, End Date, and Price */
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-4">
                     <div className="bg-white/10 p-3.5 rounded-xl border border-white/10">
                        <span className="text-slate-300 font-bold text-[10px] uppercase block mb-1">{tDoc.start}</span>
                        <span className="font-black text-white text-sm md:text-base">{startDate}</span>
                     </div>

                     <div className="bg-white/10 p-3.5 rounded-xl border border-white/10">
                        <span className="text-slate-300 font-bold text-[10px] uppercase block mb-1">{tDoc.end}</span>
                        <span className="font-black text-amber-300 text-sm md:text-base">{endDate}</span>
                     </div>

                     <div className="bg-white/10 p-3.5 rounded-xl border border-white/10">
                        <span className="text-slate-300 font-bold text-[10px] uppercase block mb-1">
                           {isPartnership ? tDoc.investmentPrice : tDoc.rentPrice}
                        </span>
                        <span className="font-black text-emerald-400 text-base md:text-xl">₹ {land.price?.toLocaleString()}</span>
                     </div>
                  </div>
               )}

               {/* Specific terms per purpose */}
               {isLease && (
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex justify-between items-center text-xs">
                     <span className="text-slate-300 font-bold">{tDoc.payoutFreq}</span>
                     <span className="text-amber-300 font-black uppercase">{tDoc.yearlyPayout}</span>
                  </div>
               )}

               {isPartnership && (
                  <div className="space-y-2 bg-white/5 p-4 rounded-xl border border-white/10 text-xs">
                     <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <span className="text-slate-300 font-bold">{tDoc.profitRatio}</span>
                        <span className="text-amber-300 font-black text-sm">{land.profit_sharing_ratio || '50-50 Split'}</span>
                     </div>
                     <div className="flex justify-between items-center pt-1">
                        <span className="text-slate-300 font-bold">{tDoc.farmerContrib}</span>
                        <span className="text-white font-bold">{land.farmer_contribution === 'land_labor' ? tDoc.landLabor : tDoc.landOnly}</span>
                     </div>
                     <div className="flex justify-between items-center pt-1">
                        <span className="text-slate-300 font-bold">{tDoc.corpContrib}</span>
                        <span className="text-emerald-300 font-medium text-[11px]">{tDoc.corpContribDesc}</span>
                     </div>
                  </div>
               )}
            </div>


            {/* Section 4: EXHAUSTIVE REAL-WORLD LEGAL CLAUSES */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-6">
               <h4 className="font-extrabold text-slate-800 uppercase text-xs tracking-wider mb-4 border-b border-slate-300 pb-2 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-[#006400]" /> {tDoc.clausesHeader}
               </h4>
               
               <div className="space-y-4">
                  {clausesList.map((clause, idx) => (
                     <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#006400] text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                           {idx + 1}
                        </div>
                        <div>
                           <h5 className="font-extrabold text-slate-900 text-xs md:text-sm mb-1">{clause.title}</h5>
                           <p className="text-slate-600 text-xs leading-relaxed font-medium">{clause.desc}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Admin Response Notes */}
            {land.admin_message && (
               <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl mb-6 text-amber-900">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-amber-800 mb-1">{tDoc.notesHeader}</h4>
                  <p className="font-medium text-xs md:text-sm italic">"{translateText(land.admin_message)}"</p>
               </div>
            )}

            {/* Seal & Digital Signature */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 pt-6 border-t-2 border-slate-900">
               <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-amber-400 rounded-full border-4 border-slate-900 flex items-center justify-center shadow-lg shrink-0">
                     <ShieldCheck size={32} className="text-slate-950" />
                  </div>
                  <div>
                     <p className="font-black text-xs uppercase text-slate-900">{tDoc.sealTitle}</p>
                     <p className="text-[10px] text-slate-500 font-bold">{tDoc.sealVerified}</p>
                  </div>
               </div>

               <div className="text-right">
                  <div className="font-mono text-xs font-black tracking-widest text-slate-900 border-b border-slate-400 pb-1 mb-1">
                     [DIGITALLY SIGNED & VERIFIED BY ANNDATA DESK]
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">{tDoc.sigTitle}</p>
                  <p className="text-[9px] text-slate-400 font-semibold">{tDoc.sigSub}</p>
               </div>
            </div>

         </div>

         {/* Footer Actions */}
         <div className="mt-6 flex justify-between items-center print:hidden">
            <button 
              onClick={onClose}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-colors"
            >
               {tDoc.closeBtn}
            </button>

            <button 
              onClick={() => window.print()}
              className="px-8 py-3.5 bg-slate-950 hover:bg-slate-800 text-white rounded-xl font-extrabold text-sm transition-colors flex items-center gap-2 shadow-xl cursor-pointer"
            >
               <Printer size={18} /> {tDoc.printBtn}
            </button>
         </div>

      </div>
    </div>
  );
}

export default OfficialAgreementModal;
