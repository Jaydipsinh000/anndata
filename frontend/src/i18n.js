import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "app": {
        "welcome": "Welcome to",
        "selectLang": "Please select your preferred language to continue",
        "continueGuest": "Continue as Guest",
        "loginRegister": "Login / Register"
      },
      "home": {
        "welcome": "Welcome to Anndata",
        "subtitle": "Empowering Farmers, Connecting Markets.",
        "badge": "Empowering Modern Agriculture",
        "getStarted": "Get Started",
        "exploreMarket": "Explore Market",
        "aboutTitle": "About Anndata Portal",
        "aboutP1": "Anndata is a dedicated platform designed to support farmers and agricultural workers. We provide tools for crop management, access to marketplaces, and a platform for equipment rental.",
        "aboutP2": "Whether you are a farmer looking to sell your crops or someone searching for organic products and farming tools, Anndata brings everything together in one place.",
        "featLandTitle": "Smart Land Management",
        "featLandDesc": "Digital land records, soil health tracking, and resource allocation.",
        "featMarketTitle": "Direct Market Access",
        "featMarketDesc": "Bypass middlemen and sell your produce directly to verified buyers.",
        "featOrganicTitle": "Sustainable Practices",
        "featOrganicDesc": "Expert guidance and community support for modern organic farming.",
        "copyright": "Anndata Portal. Cultivating a better tomorrow."
      },
      "nav": {
        "home": "Home",
        "lands": "Lands",
        "partnerships": "Partnerships",
        "crops": "Crops",
        "my_crops": "My Crops",
        "tools": "Tools",
        "tool_rentals": "Tool Rentals",
        "marketplace": "Marketplace",
        "profile": "Profile",
        "admin": "Admin Panel",
        "bookings": "My Bookings",
        "services": "Services"
      },
      "auth": {
        "register": "Register",
        "login": "Login",
        "logout": "Sign Out",
        "registerTitle": "Register to Anndata",
        "loginTitle": "Login to Anndata",
        "fullName": "Full Name",
        "email": "Email Address",
        "mobile": "Mobile Number",
        "address": "Address",
        "password": "Password",
        "roleFarmer": "Farmer",
        "roleWorker": "Agricultural Worker",
        "roleBuyer": "Company / Buyer",
        "registerBtn": "Create Account",
        "loginBtn": "Login to Account",
        "alreadyHaveAccount": "Already have an account?",
        "dontHaveAccount": "Don't have an account?",
        "loginHere": "Login here",
        "registerHere": "Register here"
      },
      "profile": {
        "title": "Your Profile",
        "personalInfo": "Personal Information",
        "logout": "Sign Out",
        "role": "Account Role",
        "joined": "Member Since"
      },
      "crops": {
        "title": "My Crop Portfolio",
        "subtitle": "Control panel for your growing and ready-to-sell crops.",
        "listNew": "List New Crop",
        "growingSection": "Growing Crops (In Field)",
        "readySection": "Ready to Sell",
        "noReady": "No ready crops yet",
        "markHarvested": "Mark as Harvested",
        "confirmHarvest": "Confirm Harvest",
        "cancel": "Cancel",
        "area": "Area",
        "yield": "Expected Yield",
        "harvestDate": "Harvest Date",
        "priceUnit": "Price/Unit",
        "available": "Available",
        "season": "Season",
        "growingDetails": "Growing Crop Details",
        "readyDetails": "Ready Crop Details",
        "sowingDate": "Sowing Date",
        "expectedHarvest": "Expected Harvest",
        "enableAdvance": "Enable Advance Booking for Buyers",
        "submitCrop": "Submit Crop for Approval"
      },
      "land": {
        "heroTitle": "My Land Portfolio",
        "heroSubtitle": "Manage your land properties submitted to the company. View direct feedback and track contract statuses securely.",
        "postProperty": "Submit New Land Proposal",
        "noProperties": "No Properties Listed Yet",
        "noPropertiesDesc": "Post your agricultural land securely to propose a contract to the company.",
        "pendingReview": "Pending Review",
        "pendingMsg": "The company is verifying your property details. You'll hear back shortly.",
        "proposalDeclined": "Proposal Declined",
        "dealFinalized": "Deal Finalized",
        "statusActive": "Pending Company Review",
        "for": "For"
      },
      "landForm": {
        "title": "Publish Land Property",
        "subtitle": "Connect with buyers, renters, and partners.",
        "purpose": "Purpose of Listing",
        "rent": "Rent / Lease",
        "sell": "Sell Property",
        "partnership": "Partnership",
        "area": "Area Dimension (Acres)",
        "price": "Asking Price / Expected Share",
        "location": "Geographic Location (Village & District)",
        "soil": "Soil Classification / Type",
        "irrigation": "Primary Irrigation System",
        "docs": "Official Documents",
        "docsDesc": "Proof required.",
        "submit": "List Land Property securely",
        "submitting": "Listing Property...",
        "soilOptions": {
          "select": "Select Soil...",
          "black": "Black Soil",
          "red": "Red Soil",
          "alluvial": "Alluvial Soil",
          "laterite": "Laterite",
          "arid": "Arid / Sandy"
        },
        "waterOptions": {
          "tubeWell": "Tube Well",
          "canal": "Canal System",
          "rainFed": "Rain-fed",
          "none": "None"
        },
        "leaseDuration": "Expected Lease Duration (Years)",
        "payoutFreq": "Payout Frequency",
        "freqOptions": {
          "monthly": "Monthly",
          "halfYearly": "Every 6 Months",
          "yearly": "Annually"
        },
        "partnershipNeeds": "What support do you require?",
        "needsOptions": {
          "tools": "Agricultural Tools",
          "labor": "Workers / Laborers",
          "finance": "Financial Investment",
          "seeds": "Quality Seeds / Fertilizer"
        },
        "profitRatio": "Expected Profit Sharing",
        "ratioFifty": "50% - 50% (Standard)",
        "partnershipDuration": "Initial Contract Duration",
        "durationSeason": "1 Season (Until Harvest)",
        "durationYear": "1 Year (Full Cycle)"
      },
      "tools": {
        "title": "Agricultural Machinery",
        "subtitle": "Empower your harvest. Find high-quality tractors, harvesters, and tools available for directly buying or renting from peers.",
        "listTool": "List your Tool",
        "noTools": "No tools available yet",
        "noToolsDesc": "Be the first to list a farming tool for rent or sale!",
        "buy": "Buy",
        "rent": "Rent"
      },
      "toolForm": {
        "title": "List a Farming Tool",
        "name": "Tool Name",
        "stock": "Total Units Available",
        "price": "Direct Purchase Price",
        "rentPrice": "Rent Price",
        "rentDuration": "Rent Duration Baseline",
        "submit": "Submit Profile for Tool",
        "submitting": "Listing Component..."
      },
      "marketplace": {
        "title": "Farmer's Marketplace",
        "subtitle": "Buy fresh produce directly from farmers.",
        "sellCrop": "Sell Your Crop",
        "noItems": "No crops in the market yet.",
        "buy": "Buy"
      },
      "marketForm": {
        "title": "Sell Your Crop",
        "cropName": "Crop Name",
        "quantity": "Quantity",
        "unit": "Unit",
        "pricePerUnit": "Price Per Unit",
        "location": "Pickup Location",
        "submit": "Submit Listing",
        "submitting": "Listing...",
        "unitOptions": {
          "kg": "KG",
          "ton": "Tons",
          "quintal": "Quintal",
          "pieces": "Pieces"
        }
      },
      "partnerships": {
        "title": "Farm Partnerships & Investments",
        "subtitle": "Collaborate with verified agricultural investors, co-farmers, and suppliers.",
        "create": "Create Partnership Request",
        "noItems": "No partnership requests active right now."
      },
      "services": {
        "title": "Agricultural Services Hub",
        "subtitle": "Book professional tractor plowing, drone spraying, harvesting, and soil testing services.",
        "bookNow": "Book Service Now",
        "myBookings": "My Service Bookings",
        "noServices": "No services available currently."
      },
      "bookings": {
        "title": "My Bookings & Rentals",
        "subtitle": "Track your active tool rentals, service appointments, and crop purchases.",
        "toolsTab": "Tool Rentals",
        "servicesTab": "Services Booked",
        "noBookings": "No active bookings found."
      },
      "admin": {
        "title": "Admin Command Center",
        "subtitle": "System oversight, crop approvals, land verification, and deal analytics.",
        "cropsApproval": "Crop Approvals",
        "landVerification": "Land Verification",
        "userManagement": "User Management",
        "stats": "System Statistics"
      },
      "checkout": {
        "title": "Secure Checkout",
        "total": "Total Payable",
        "submit": "Confirm Transaction",
        "submitting": "Processing...",
        "success": "Order Confirmed!"
      }
    }
  },
  hi: {
    translation: {
      "app": {
        "welcome": "स्वागत है",
        "selectLang": "कृपया जारी रखने के लिए अपनी पसंदीदा भाषा चुनें",
        "continueGuest": "गेस्ट के रूप में जारी रखें",
        "loginRegister": "लॉगिन / रजिस्टर"
      },
      "home": {
        "welcome": "अन्नदाता (Anndata) में आपका स्वागत है",
        "subtitle": "किसानों को सशक्त बनाना, बाजारों को जोड़ना।",
        "badge": "आधुनिक कृषि का सशक्तिकरण",
        "getStarted": "शुरू करें",
        "exploreMarket": "बाज़ार देखें",
        "aboutTitle": "अन्नदाता पोर्टल के बारे में",
        "aboutP1": "अन्नदाता किसानों और खेतिहर मजदूरों का समर्थन करने के लिए बनाया गया एक समर्पित मंच है। हम फसल प्रबंधन के लिए उपकरण, बाजारों तक पहुंच और उपकरण किराये पर लेने के लिए एक मंच प्रदान करते हैं।",
        "aboutP2": "चाहे आप अपनी फसल बेचने के लिए एक किसान हों या जैविक उत्पादों और खेती के उपकरणों की तलाश में हों, अन्नदाता सब कुछ एक ही स्थान पर लाता है।",
        "featLandTitle": "स्मार्ट भूमि प्रबंधन",
        "featLandDesc": "डिजिटल भूमि रिकॉर्ड, मिट्टी के स्वास्थ्य की निगरानी और संसाधन आवंटन।",
        "featMarketTitle": "सीधी बाजार पहुंच",
        "featMarketDesc": "बिचौलियों को हटाएं और अपनी उपज सीधे सत्यापित खरीदारों को बेचें।",
        "featOrganicTitle": "सतत खेती पद्धतियां",
        "featOrganicDesc": "आधुनिक जैविक खेती के लिए विशेषज्ञ सलाह और सामुदायिक सहायता।",
        "copyright": "अन्नदाता पोर्टल। एक बेहतर कल की ओर।"
      },
      "nav": {
        "home": "होम",
        "lands": "ज़मीन",
        "partnerships": "साझेदारी",
        "crops": "फसलें",
        "my_crops": "मेरी फसलें",
        "tools": "उपकरण",
        "tool_rentals": "उपकरण का किराया",
        "marketplace": "बाज़ार",
        "profile": "प्रोफ़ाइल",
        "admin": "एडमिन पैनल",
        "bookings": "मेरी बुकिंग",
        "services": "सेवाएं"
      },
      "auth": {
        "register": "रजिस्टर करें",
        "login": "लॉगिन करें",
        "logout": "लॉग आउट करें",
        "registerTitle": "अन्नदाता पर रजिस्टर करें",
        "loginTitle": "अन्नदाता में लॉगिन करें",
        "fullName": "पूरा नाम",
        "email": "ईमेल पता",
        "mobile": "मोबाइल नंबर",
        "address": "पता",
        "password": "पासवर्ड",
        "roleFarmer": "किसान",
        "roleWorker": "खेतिहर मजदूर",
        "roleBuyer": "कंपनी / खरीदार",
        "registerBtn": "खाता बनाएं",
        "loginBtn": "लॉगिन करें",
        "alreadyHaveAccount": "क्या आपके पास पहले से खाता है?",
        "dontHaveAccount": "क्या आपके पास खाता नहीं है?",
        "loginHere": "यहां लॉगिन करें",
        "registerHere": "यहां रजिस्टर करें"
      },
      "profile": {
        "title": "आपकी प्रोफ़ाइल",
        "personalInfo": "व्यक्तिगत जानकारी",
        "logout": "लॉग आउट करें",
        "role": "खाता प्रकार",
        "joined": "जुड़ने की तिथि"
      },
      "crops": {
        "title": "मेरा फसल पोर्टफोलियो",
        "subtitle": "आपकी बढ़ती हुई और बेचने योग्य फसलों का नियंत्रण केंद्र।",
        "listNew": "नई फसल दर्ज करें",
        "growingSection": "खेत में बढ़ती फसलें",
        "readySection": "बेचने के लिए तैयार फसलें",
        "noReady": "अभी कोई तैयार फसल नहीं है",
        "markHarvested": "कटाई (Harvest) के रूप में चिह्नित करें",
        "confirmHarvest": "कटाई की पुष्टि करें",
        "cancel": "रद्द करें",
        "area": "क्षेत्रफल",
        "yield": "अनुमानित उपज",
        "harvestDate": "कटाई की तारीख",
        "priceUnit": "कीमत / इकाई",
        "available": "उपलब्ध मात्रा",
        "season": "मौसम",
        "growingDetails": "बढ़ती फसल का विवरण",
        "readyDetails": "तैयार फसल का विवरण",
        "sowingDate": "बुआई की तारीख",
        "expectedHarvest": "अपेक्षित कटाई",
        "enableAdvance": "खरीदारों के लिए एडवांस बुकिंग चालू करें",
        "submitCrop": "स्वीकृति के लिए फसल सबमिट करें"
      },
      "land": {
        "heroTitle": "मेरी ज़मीन का पोर्टफोलियो",
        "heroSubtitle": "कंपनी को सबमिट की गई अपनी जमीन का प्रबंधन करें। फीडबैक और कॉन्ट्रैक्ट स्टेटस देखें।",
        "postProperty": "नई ज़मीन का प्रस्ताव दें",
        "noProperties": "कोई संपत्ति सूचीबद्ध नहीं है",
        "noPropertiesDesc": "कंपनी के साथ अनुबंध प्रस्तावित करने के लिए अपनी कृषि भूमि सुरक्षित रूप से पोस्ट करें।",
        "pendingReview": "समीक्षा लंबित",
        "pendingMsg": "कंपनी आपके संपत्ति विवरण की पुष्टि कर रही है।",
        "proposalDeclined": "प्रस्ताव अस्वीकृत",
        "dealFinalized": "सौदा पक्का हो गया",
        "statusActive": "समीक्षा लंबित है",
        "for": "प्रकार:"
      },
      "landForm": {
        "title": "भूमि संपत्ति प्रकाशित करें",
        "subtitle": "खरीदारों, किराएदारों और भागीदारों से जुड़ें।",
        "purpose": "लिस्टिंग का उद्देश्य",
        "rent": "किराया / पट्टा (Lease)",
        "sell": "बेचना (Sell)",
        "partnership": "साझेदारी (Partnership)",
        "area": "कुल क्षेत्रफल (एकड़ में)",
        "price": "कीमत / अपेक्षित हिस्सा",
        "location": "भौगोलिक स्थान (गांव और जिला)",
        "soil": "मिट्टी का वर्गीकरण / प्रकार",
        "irrigation": "प्राथमिक सिंचाई प्रणाली",
        "docs": "आधिकारिक दस्तावेज",
        "docsDesc": "प्रमाण",
        "submit": "भूमि संपत्ति सुरक्षित रूप से सूचीबद्ध करें",
        "submitting": "लिस्टिंग कर रहा है...",
        "soilOptions": {
          "select": "मिट्टी चुनें...",
          "black": "काली मिट्टी",
          "red": "लाल मिट्टी",
          "alluvial": "जलोढ़ मिट्टी",
          "laterite": "लेटराइट मिट्टी",
          "arid": "रेतीली / सूखी मिट्टी"
        },
        "waterOptions": {
          "tubeWell": "ट्यूबवेल",
          "canal": "नहर प्रणाली",
          "rainFed": "बारिश पर निर्भर",
          "none": "कोई नहीं"
        },
        "leaseDuration": "अपेक्षित लीज़ अवधि (वर्ष)",
        "payoutFreq": "भुगतान की आवृत्ति",
        "freqOptions": {
          "monthly": "मासिक",
          "halfYearly": "हर 6 महीने में",
          "yearly": "सालाना"
        },
        "partnershipNeeds": "आपको किस सहायता की आवश्यकता है?",
        "needsOptions": {
          "tools": "कृषि उपकरण",
          "labor": "मज़दूर",
          "finance": "वित्तीय निवेश (पैसे)",
          "seeds": "अच्छे बीज / खाद"
        },
        "profitRatio": "लाभ का बँटवारा",
        "ratioFifty": "50% - 50% (मानक)",
        "partnershipDuration": "प्रारंभिक अनुबंध अवधि",
        "durationSeason": "1 सीज़न (कटाई तक)",
        "durationYear": "1 वर्ष (पूरा चक्र)"
      },
      "tools": {
        "title": "कृषि मशीनरी",
        "subtitle": "अपनी फसल को सशक्त बनाएं। बेहतरीन ट्रैक्टर, हार्वेस्टर और उपकरण किराए पर लें या खरीदें।",
        "listTool": "अपना उपकरण सूचीबद्ध करें",
        "noTools": "अभी कोई उपकरण उपलब्ध नहीं है",
        "noToolsDesc": "किराए या बिक्री के लिए कृषि उपकरण सूचीबद्ध करने वाले पहले व्यक्ति बनें!",
        "buy": "खरीदें",
        "rent": "किराया"
      },
      "toolForm": {
        "title": "कृषि उपकरण सूचीबद्ध करें",
        "name": "उपकरण का नाम",
        "stock": "कुल इकाइयां उपलब्ध",
        "price": "सीधी खरीद मूल्य",
        "rentPrice": "किराया मूल्य",
        "rentDuration": "किराये की अवधि (उदा. 1 दिन)",
        "submit": "उपकरण प्रोफाइल सबमिट करें",
        "submitting": "कम्पोनेंट सूचीबद्ध कर रहा है..."
      },
      "marketplace": {
        "title": "किसान का बाज़ार",
        "subtitle": "किसानों से सीधे ताजा उपज खरीदें।",
        "sellCrop": "अपनी फसल बेचें",
        "noItems": "बाजार में अभी तक कोई फसल नहीं है।",
        "buy": "खरीदें"
      },
      "marketForm": {
        "title": "अपनी फसल बेचें",
        "cropName": "फसल का नाम",
        "quantity": "मात्रा",
        "unit": "इकाई",
        "pricePerUnit": "प्रति इकाई मूल्य",
        "location": "पिकअप स्थान",
        "submit": "लिस्टिंग सबमिट करें",
        "submitting": "लिस्टिंग हो रही है...",
        "unitOptions": {
          "kg": "किलो",
          "ton": "टन",
          "quintal": "क्विंटल",
          "pieces": "नग (Pieces)"
        }
      },
      "partnerships": {
        "title": "कृषि साझेदारी और निवेश",
        "subtitle": "सत्यापित कृषि निवेशकों, सह-किसानों और आपूर्तिकर्ताओं के साथ सहयोग करें।",
        "create": "साझेदारी अनुरोध बनाएं",
        "noItems": "वर्तमान में कोई साझेदारी अनुरोध सक्रिय नहीं है।"
      },
      "services": {
        "title": "कृषि सेवा केंद्र",
        "subtitle": "ट्रैक्टर जोताई, ड्रोन छिड़काव, फसल कटाई और मिट्टी परीक्षण सेवाएं बुक करें।",
        "bookNow": "अभी सेवा बुक करें",
        "myBookings": "मेरी सेवा बुकिंग",
        "noServices": "वर्तमान में कोई सेवा उपलब्ध नहीं है।"
      },
      "bookings": {
        "title": "मेरी बुकिंग और किराये",
        "subtitle": "अपने सक्रिय उपकरण किराये, सेवा नियुक्तियों और फसल की खरीदारी पर नज़र रखें।",
        "toolsTab": "उपकरण किराया",
        "servicesTab": "बुक की गई सेवाएं",
        "noBookings": "कोई सक्रिय बुकिंग नहीं मिली।"
      },
      "admin": {
        "title": "एडमिन कंट्रोल सेंटर",
        "subtitle": "सिस्टम निगरानी, फसल स्वीकृति, भूमि सत्यापन और सौदों का विश्लेषण।",
        "cropsApproval": "फसल स्वीकृति",
        "landVerification": "भूमि सत्यापन",
        "userManagement": "उपयोगकर्ता प्रबंधन",
        "stats": "सिस्टम आंकड़े"
      },
      "checkout": {
        "title": "सुरक्षित चेकआउट",
        "total": "कुल देय राशि",
        "submit": "लेनदेन की पुष्टि करें",
        "submitting": "प्रोसेसिंग...",
        "success": "आदेश की पुष्टि हो गई!"
      }
    }
  },
  gu: {
    translation: {
      "app": {
        "welcome": "સ્વાગત છે",
        "selectLang": "કૃપા કરીને આગળ વધવા માટે તમારી પસંદગીની ભાષા પસંદ કરો",
        "continueGuest": "મહેમાન તરીકે આગળ વધો",
        "loginRegister": "લોગિન / નોંધણી કરો"
      },
      "home": {
        "welcome": "અન્નદાતા (Anndata) માં તમારું સ્વાગત છે",
        "subtitle": "ખેડૂતોને સશક્ત બનાવવા, બજારોને જોડવા.",
        "badge": "આધુનિક કૃષિનું સશક્તિકરણ",
        "getStarted": "શરૂ કરો",
        "exploreMarket": "બજાર જુઓ",
        "aboutTitle": "અન્નદાતા પોર્ટલ વિશે",
        "aboutP1": "અન્નદાતા એ ખેડૂતો અને ખેતમજૂરોને ટેકો આપવા માટે રચાયેલ એક સમર્પિત પ્લેટફોર્મ છે. અમે પાક વ્યવસ્થાપન માટેના સાધનો, બજારોમાં પ્રવેશ અને સાધનોના ભાડા માટેનું પ્લેટફોર્મ પ્રદાન કરીએ છીએ.",
        "aboutP2": "ભલે તમે પાક વેચવા માંગતા ખેડૂત હોવ અથવા જૈવિક ઉત્પાદનો અને ખેતીના સાધનો શોધી રહ્યા હોવ, અન્નદાતા બધું એક જ જગ્યાએ લાવે છે.",
        "featLandTitle": "સ્માર્ટ જમીન વ્યવસ્થાપન",
        "featLandDesc": "ડિજિટલ જમીન રેકોર્ડ્સ, જમીન આરોગ્ય ટ્રેકિંગ અને સંસાધન ફાળવણી.",
        "featMarketTitle": "સીધો બજાર પ્રવેશ",
        "featMarketDesc": "વચેટિયાઓને દૂર કરો અને તમારી ઉપજ સીધી ચકાસાયેલ ખરીદદારોને વેચો.",
        "featOrganicTitle": "ટકાઉ ખેતી પદ્ધતિઓ",
        "featOrganicDesc": "આધુનિક જૈવિક ખેતી માટે નિષ્ણાત માર્ગદર્શન અને સમુદાય સહયોગ.",
        "copyright": "અન્નદાતા પોર્ટલ. એક સારા આવતીકાલ તરફ."
      },
      "nav": {
        "home": "હોમ",
        "lands": "જમીન",
        "partnerships": "ભાગીદારી",
        "crops": "પાક",
        "my_crops": "મારો પાક",
        "tools": "સાધનો",
        "tool_rentals": "સાધનોનું ભાડું",
        "marketplace": "માર્કેટપ્લેસ",
        "profile": "પ્રોફાઈલ",
        "admin": "એડમિન પેનલ",
        "bookings": "મારું બુકિંગ",
        "services": "સેવાઓ"
      },
      "auth": {
        "register": "નોંધણી કરો",
        "login": "લોગિન કરો",
        "logout": "લોગ આઉટ કરો",
        "registerTitle": "અન્નદાતામાં નોંધણી કરો",
        "loginTitle": "અન્નદાતામાં લોગિન કરો",
        "fullName": "પૂરું નામ",
        "email": "ઇમેઇલ સરનામું",
        "mobile": "મોબાઇલ નંબર",
        "address": "સરનામું",
        "password": "પાસવર્ડ",
        "roleFarmer": "ખેડૂત",
        "roleWorker": "ખેતમજૂર",
        "roleBuyer": "કંપની / ખરીદનાર",
        "registerBtn": "નવું ખાતું બનાવો",
        "loginBtn": "લોગિન કરો",
        "alreadyHaveAccount": "શું તમારી પાસે પહેલેથી જ ખાતું છે?",
        "dontHaveAccount": "શું તમારી પાસે ખાતું નથી?",
        "loginHere": "અહીં લોગિન કરો",
        "registerHere": "અહીં નોંધણી કરો"
      },
      "profile": {
        "title": "તમારી પ્રોફાઇલ",
        "personalInfo": "વ્યક્તિગત માહિતી",
        "logout": "લોગ આઉટ કરો",
        "role": "ખાતાનો પ્રકાર",
        "joined": "જોડાવાની તારીખ"
      },
      "crops": {
        "title": "મારો પાક પોર્ટફોલિયો",
        "subtitle": "તમારા ઉગતા અને વેચવા માટે તૈયાર પાકનું નિયંત્રણ કેન્દ્ર.",
        "listNew": "નવો પાક ઉમેરો",
        "growingSection": "ખેતરમાં ઉગતો પાક",
        "readySection": "વેચાણ માટે તૈયાર પાક",
        "noReady": "હજુ સુધી કોઈ તૈયાર પાક નથી",
        "markHarvested": "લણણી (Harvest) તરીકે માર્ક કરો",
        "confirmHarvest": "લણણીની પુષ્ટિ કરો",
        "cancel": "રદ કરો",
        "area": "વિસ્તાર",
        "yield": "અપેક્ષિત ઉત્પાદન",
        "harvestDate": "લણણીની તારીખ",
        "priceUnit": "કિંમત / એકમ",
        "available": "ઉપલબ્ધ જથ્થો",
        "season": "સિઝન",
        "growingDetails": "ઉગતા પાકની વિગતો",
        "readyDetails": "તૈયાર પાકની વિગતો",
        "sowingDate": "વાવણીની તારીખ",
        "expectedHarvest": "અપેક્ષિત લણણી",
        "enableAdvance": "ખરીદદારો માટે એડવાન્સ બુકિંગ ચાલુ કરો",
        "submitCrop": "મંજૂરી માટે પાક સબમિટ કરો"
      },
      "land": {
        "heroTitle": "મારો જમીનનો પોર્ટફોલિયો",
        "heroSubtitle": "કંપનીને સબમિટ કરેલી તમારી જમીનનું સંચાલન કરો. ફીડબેક અને કોન્ટ્રાક્ટ સ્ટેટસ જુઓ.",
        "postProperty": "નવી જમીનનો પ્રસ્તાવ મૂકો",
        "noProperties": "કોઈ સંપત્તિ સૂચિબદ્ધ નથી",
        "noPropertiesDesc": "કંપની સાથે કરારની દરખાસ્ત કરવા માટે તમારી ખેતીની જમીન સુરક્ષિત રીતે પોસ્ટ કરો.",
        "pendingReview": "સમીક્ષા બાકી છે",
        "pendingMsg": "કંપની તમારી જમીનની વિગતો ચકાસી રહી છે.",
        "proposalDeclined": "પ્રસ્તાવ નકારવામાં આવ્યો",
        "dealFinalized": "સોદો નક્કી થઈ ગયો",
        "statusActive": "કંપનીની સમીક્ષા બાકી છે",
        "for": "હેતુ:"
      },
      "landForm": {
        "title": "જમીન સંપત્તિ પ્રકાશિત કરો",
        "subtitle": "ખરીદદારો, ભાડૂતો અને ભાગીદારો સાથે જોડાઓ.",
        "purpose": "સૂચિનો હેતુ",
        "rent": "ભાડે / લીઝ (Lease)",
        "sell": "વેચવા માટે (Sell)",
        "partnership": "ભાગીદારી (Partnership)",
        "area": "કુલ વિસ્તાર (એકરમાં)",
        "price": "કિંમત / અપેક્ષિત હિસ્સો",
        "location": "ભૌગોલિક સ્થાન (ગામ અને જિલ્લો)",
        "soil": "માટીનું વર્ગીકરણ / પ્રકાર",
        "irrigation": "પ્રાથમિક સિંચાઈ વ્યવસ્થા",
        "docs": "સત્તાવાર દસ્તાવેજો",
        "docsDesc": "પુરાવા",
        "submit": "જમીન સુરક્ષિત રીતે સૂચિબદ્ધ કરો",
        "submitting": "સૂચિબદ્ધ થઈ રહ્યું છે...",
        "soilOptions": {
          "select": "માટી પસંદ કરો...",
          "black": "કાળી માટી",
          "red": "લાલ માટી",
          "alluvial": "કાંપવાળી માટી",
          "laterite": "લેટેરાઇટ માટી",
          "arid": "રેતાળ માટી"
        },
        "waterOptions": {
          "tubeWell": "ટ્યુબવેલ",
          "canal": "નહેર વ્યવસ્થા",
          "rainFed": "વરસાદ આધારિત",
          "none": "કોઈ નહિ"
        },
        "leaseDuration": "અપેક્ષિત લીઝનો સમયગાળો (વર્ષ)",
        "payoutFreq": "ચુકવણીની આવર્તન",
        "freqOptions": {
          "monthly": "માસિક",
          "halfYearly": "દર 6 મહિને",
          "yearly": "વાર્ષિક"
        },
        "partnershipNeeds": "તમારે કયા આધારની જરૂર છે?",
        "needsOptions": {
          "tools": "કૃષિ સાધનો",
          "labor": "કામદારો / મજૂરો",
          "finance": "નાણાકીય રોકાણ",
          "seeds": "ઉચ્ચ-ગુણવત્તાવાળા બીજ / ખાતર"
        },
        "profitRatio": "નફાની વહેંચણી",
        "ratioFifty": "50% - 50% (પ્રમાણભૂત)",
        "partnershipDuration": "પ્રારંભિક કરારનો સમયગાળો",
        "durationSeason": "1 સિઝન (લણણી સુધી)",
        "durationYear": "1 વર્ષ (સંપૂર્ણ ચક્ર)"
      },
      "tools": {
        "title": "કૃષિ મશીનરી",
        "subtitle": "તમારા પાકને સશક્ત બનાવો. શ્રેષ્ઠ ટ્રેક્ટર અને સાધનો ભાડે લો અથવા ખરીદો.",
        "listTool": "તમારું સાધન સૂચિબદ્ધ કરો",
        "noTools": "હજી કોઈ સાધનો ઉપલબ્ધ નથી",
        "noToolsDesc": "ભાડે અથવા વેચાણ માટે કૃષિ સાધનો સૂચિબદ્ધ કરનાર પ્રથમ બનો!",
        "buy": "ખરીદો",
        "rent": "ભાડે"
      },
      "toolForm": {
        "title": "કૃષિ સાધનો સૂચિબદ્ધ કરો",
        "name": "સાધનનું નામ",
        "stock": "કુલ એકમો",
        "price": "સીધી ખરીદી કિંમત",
        "rentPrice": "ભાડાની કિંમત",
        "rentDuration": "ભાડાની અવધિ",
        "submit": "સાધન સબમિટ કરો",
        "submitting": "સૂચિબદ્ધ થઈ રહ્યું છે..."
      },
      "marketplace": {
        "title": "ખેડૂતનું બજાર",
        "subtitle": "ખેડૂતો પાસેથી સીધા જ તાજા ઉત્પાદનો ખરીદો.",
        "sellCrop": "તમારો પાક વેચો",
        "noItems": "બજારમાં હજી કોઈ પાક નથી.",
        "buy": "ખરીદો"
      },
      "marketForm": {
        "title": "તમારો પાક વેચો",
        "cropName": "પાકનું નામ",
        "quantity": "જથ્થો",
        "unit": "એકમ (Unit)",
        "pricePerUnit": "એકમ દીઠ કિંમત",
        "location": "પિકઅપ સ્થાન",
        "submit": "સૂચિ સબમિટ કરો",
        "submitting": "સૂચિબદ્ધ થઈ રહ્યું છે...",
        "unitOptions": {
          "kg": "કિલો",
          "ton": "ટન",
          "quintal": "ક્વિન્ટલ",
          "pieces": "નંગ"
        }
      },
      "partnerships": {
        "title": "કૃષિ ભાગીદારી અને રોકાણ",
        "subtitle": "ચકાસાયેલ કૃષિ રોકાણકારો, સહ-ખેડૂતો અને સપ્લાયર્સ સાથે સહયોગ કરો.",
        "create": "ભાગીદારી વિનંતી બનાવો",
        "noItems": "હાલમાં કોઈ ભાગીદારી વિનંતી સક્રિય નથી."
      },
      "services": {
        "title": "કૃષિ સેવા કેન્દ્ર",
        "subtitle": "ટ્રેક્ટર ખેડાણ, ડ્રોન છંટકાવ, લણણી અને જમીન પરીક્ષણ સેવાઓ બુક કરો.",
        "bookNow": "હવે સેવા બુક કરો",
        "myBookings": "મારું સેવા બુકિંગ",
        "noServices": "હાલમાં કોઈ સેવાઓ ઉપલબ્ધ નથી."
      },
      "bookings": {
        "title": "મારું બુકિંગ અને ભાડાં",
        "subtitle": "તમારા સક્રિય સાધનોના ભાડાં, સેવા એપોઇન્ટમેન્ટ્સ અને પાકની ખરીદી પર નજર રાખો.",
        "toolsTab": "સાધનોનું ભાડું",
        "servicesTab": "બુક કરેલ સેવાઓ",
        "noBookings": "કોઈ સક્રિય બુકિંગ મળ્યું નથી."
      },
      "admin": {
        "title": "એડમિન કંટ્રોલ સેન્ટર",
        "subtitle": "સિસ્ટમ સુપરવિઝન, પાક મંજૂરી, જમીન ચકાસણી અને સોદા વિશ્લેષણ.",
        "cropsApproval": "પાક મંજૂરીઓ",
        "landVerification": "જમીન ચકાસણી",
        "userManagement": "વપરાશકર્તા વ્યવસ્થાપન",
        "stats": "સિસ્ટમ આંકડા"
      },
      "checkout": {
        "title": "સુરક્ષિત ચેકઆઉટ",
        "total": "કુલ ચૂકવવાપાત્ર રકમ",
        "submit": "વ્યવહારની પુષ્ટિ કરો",
        "submitting": "પ્રક્રિયા થઈ રહી છે...",
        "success": "ઓર્ડરની પુષ્ટિ થઈ ગઈ!"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('selectedLang') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
