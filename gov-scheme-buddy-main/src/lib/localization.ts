// Complete localization system for Samvaad AI

export type SupportedLanguage = "en" | "hi" | "bn" | "mr" | "te" | "ta";

export interface UITranslations {
  // Header & Branding
  appName: string;
  tagline: string;
  
  // Navigation
  newChat: string;
  chatHistory: string;
  resetChat: string;
  changeLanguage: string;
  signOut: string;
  
  // Welcome Screen
  welcomeTitle: string;
  welcomeSubtitle: string;
  welcomeFooter: string;
  
  // Chat Interface
  typeMessage: string;
  send: string;
  thinking: string;
  inputPlaceholder: string;
  disclaimer: string;
  
  // Guided Flow
  selectAgeGroup: string;
  selectSchemeCategory: string;
  selectEmploymentStatus: string;
  
  // Age Groups
  ageBelow18: string;
  age18to35: string;
  age36to60: string;
  ageAbove60: string;
  
  // Nested age groups for GuidedButtons
  ageGroups?: {
    below18: string;
    "18to35": string;
    "36to60": string;
    above60: string;
  };
  
  // Scheme Categories
  educationSchemes: string;
  employmentSchemes: string;
  healthSchemes: string;
  farmerSchemes: string;
  womenSchemes: string;
  pensionSchemes: string;
  housingSchemes: string;
  
  // Nested scheme categories for GuidedButtons
  schemeCategories?: {
    education: string;
    employment: string;
    health: string;
    agriculture: string;
    women: string;
    pension: string;
  };
  
  // Employment Status
  student: string;
  employed: string;
  unemployed: string;
  selfEmployed: string;
  
  // Nested employment status for GuidedButtons
  employmentStatus?: {
    student: string;
    employed: string;
    unemployed: string;
    selfEmployed: string;
  };
  
  // Filters Panel
  activeFilters: string;
  ageGroup: string;
  schemeType: string;
  status: string;
  noFiltersSelected: string;
  
  // Suggestion Chips
  checkAnotherScheme: string;
  changeAgeGroup: string;
  viewAllSchemes: string;
  startOver: string;
  
  // Nested suggestions for SuggestionChips
  suggestions?: {
    title: string;
    checkAnother: string;
    changeAge: string;
    viewAll: string;
  };
  
  // Scheme Card
  eligibility: string;
  benefits: string;
  requiredDocuments: string;
  applicationProcess: string;
  visitWebsite: string;
  eligible: string;
  notEligible: string;
  
  // Errors & Messages
  errorMessage: string;
  noSchemesFound: string;
  selectFromOptions: string;
  
  // Accessibility
  voiceInput: string;
  clearChat: string;
}

export const translations: Record<SupportedLanguage, UITranslations> = {
  en: {
    appName: "SAMVAAD AI",
    tagline: "Your guide to government schemes",
    newChat: "New Chat",
    chatHistory: "Chat History",
    resetChat: "Reset Chat",
    changeLanguage: "Change Language",
    signOut: "Sign Out",
    welcomeTitle: "Welcome to SAMVAAD AI",
    welcomeSubtitle: "I help you find and understand government schemes. Let's start by knowing about you.",
    welcomeFooter: "Ask about any central or state government scheme",
    typeMessage: "Type your message...",
    send: "Send",
    thinking: "Thinking...",
    inputPlaceholder: "Ask about government schemes... (सरकारी योजनाओं के बारे में पूछें)",
    disclaimer: "SAMVAAD AI provides information about government schemes. Always verify on official portals.",
    selectAgeGroup: "Please select your age group",
    selectSchemeCategory: "Please select scheme category",
    selectEmploymentStatus: "What is your current status?",
    ageBelow18: "Below 18",
    age18to35: "18 - 35",
    age36to60: "36 - 60",
    ageAbove60: "Above 60",
    ageGroups: {
      below18: "Below 18",
      "18to35": "18-35 years",
      "36to60": "36-60 years",
      above60: "Above 60",
    },
    educationSchemes: "Education Schemes",
    employmentSchemes: "Employment Schemes",
    healthSchemes: "Health Schemes",
    farmerSchemes: "Farmer Schemes",
    womenSchemes: "Women Welfare Schemes",
    pensionSchemes: "Pension Schemes",
    housingSchemes: "Housing Schemes",
    schemeCategories: {
      education: "Education",
      employment: "Employment",
      health: "Health",
      agriculture: "Agriculture",
      women: "Women Welfare",
      pension: "Pension",
    },
    student: "Student",
    employed: "Employed",
    unemployed: "Unemployed",
    selfEmployed: "Self Employed",
    employmentStatus: {
      student: "Student",
      employed: "Employed",
      unemployed: "Unemployed",
      selfEmployed: "Self Employed",
    },
    activeFilters: "Active Filters",
    ageGroup: "Age Group",
    schemeType: "Scheme Type",
    status: "Status",
    noFiltersSelected: "No filters selected",
    checkAnotherScheme: "Check another scheme",
    changeAgeGroup: "Change age group",
    viewAllSchemes: "View all schemes",
    startOver: "Start over",
    suggestions: {
      title: "Quick Actions:",
      checkAnother: "Check Another Scheme",
      changeAge: "Change Age Group",
      viewAll: "View All Schemes",
    },
    eligibility: "Eligibility",
    benefits: "Benefits",
    requiredDocuments: "Required Documents",
    applicationProcess: "Application Process",
    visitWebsite: "Visit Official Website",
    eligible: "Eligible",
    notEligible: "Not Eligible",
    errorMessage: "Please choose from available options or type your query clearly.",
    noSchemesFound: "No schemes found matching your criteria.",
    selectFromOptions: "Please select from the options below",
    voiceInput: "Voice Input",
    clearChat: "Clear Chat",
  },
  hi: {
    appName: "संवाद AI",
    tagline: "सरकारी योजनाओं के लिए आपका मार्गदर्शक",
    newChat: "नई चैट",
    chatHistory: "चैट इतिहास",
    resetChat: "चैट रीसेट करें",
    changeLanguage: "भाषा बदलें",
    signOut: "लॉग आउट",
    welcomeTitle: "संवाद AI में आपका स्वागत है",
    welcomeSubtitle: "मैं आपको सरकारी योजनाओं को खोजने और समझने में मदद करता हूं। आइए आपके बारे में जानकर शुरू करें।",
    welcomeFooter: "किसी भी केंद्र या राज्य सरकार की योजना के बारे में पूछें",
    typeMessage: "अपना संदेश लिखें...",
    send: "भेजें",
    thinking: "सोच रहा हूं...",
    inputPlaceholder: "सरकारी योजनाओं के बारे में पूछें...",
    disclaimer: "संवाद AI सरकारी योजनाओं की जानकारी प्रदान करता है। कृपया आधिकारिक पोर्टल पर सत्यापित करें।",
    selectAgeGroup: "कृपया अपना आयु वर्ग चुनें",
    selectSchemeCategory: "कृपया योजना श्रेणी चुनें",
    selectEmploymentStatus: "आपकी वर्तमान स्थिति क्या है?",
    ageBelow18: "18 से कम",
    age18to35: "18 - 35",
    age36to60: "36 - 60",
    ageAbove60: "60 से ऊपर",
    ageGroups: {
      below18: "18 से कम",
      "18to35": "18-35 वर्ष",
      "36to60": "36-60 वर्ष",
      above60: "60 से ऊपर",
    },
    educationSchemes: "शिक्षा योजनाएं",
    employmentSchemes: "रोजगार योजनाएं",
    healthSchemes: "स्वास्थ्य योजनाएं",
    farmerSchemes: "किसान योजनाएं",
    womenSchemes: "महिला कल्याण योजनाएं",
    pensionSchemes: "पेंशन योजनाएं",
    housingSchemes: "आवास योजनाएं",
    schemeCategories: {
      education: "शिक्षा",
      employment: "रोजगार",
      health: "स्वास्थ्य",
      agriculture: "कृषि",
      women: "महिला कल्याण",
      pension: "पेंशन",
    },
    student: "छात्र",
    employed: "नौकरीपेशा",
    unemployed: "बेरोजगार",
    selfEmployed: "स्वरोजगार",
    employmentStatus: {
      student: "छात्र",
      employed: "नौकरीपेशा",
      unemployed: "बेरोजगार",
      selfEmployed: "स्वरोजगार",
    },
    activeFilters: "सक्रिय फ़िल्टर",
    ageGroup: "आयु वर्ग",
    schemeType: "योजना प्रकार",
    status: "स्थिति",
    noFiltersSelected: "कोई फ़िल्टर नहीं चुना गया",
    checkAnotherScheme: "अन्य योजना देखें",
    changeAgeGroup: "आयु वर्ग बदलें",
    viewAllSchemes: "सभी योजनाएं देखें",
    startOver: "फिर से शुरू करें",
    suggestions: {
      title: "त्वरित कार्रवाई:",
      checkAnother: "अन्य योजना देखें",
      changeAge: "आयु वर्ग बदलें",
      viewAll: "सभी योजनाएं देखें",
    },
    eligibility: "पात्रता",
    benefits: "लाभ",
    requiredDocuments: "आवश्यक दस्तावेज",
    applicationProcess: "आवेदन प्रक्रिया",
    visitWebsite: "आधिकारिक वेबसाइट देखें",
    eligible: "पात्र",
    notEligible: "पात्र नहीं",
    errorMessage: "कृपया उपलब्ध विकल्पों में से चुनें या अपना प्रश्न स्पष्ट रूप से लिखें।",
    noSchemesFound: "आपके मापदंडों से मेल खाती कोई योजना नहीं मिली।",
    selectFromOptions: "कृपया नीचे दिए गए विकल्पों में से चुनें",
    voiceInput: "वॉइस इनपुट",
    clearChat: "चैट साफ़ करें",
  },
  bn: {
    appName: "সংবাদ AI",
    tagline: "সরকারি প্রকল্পের জন্য আপনার গাইড",
    newChat: "নতুন চ্যাট",
    chatHistory: "চ্যাট ইতিহাস",
    resetChat: "চ্যাট রিসেট",
    changeLanguage: "ভাষা পরিবর্তন",
    signOut: "লগ আউট",
    welcomeTitle: "সংবাদ AI-তে স্বাগতম",
    welcomeSubtitle: "আমি আপনাকে সরকারি প্রকল্প খুঁজে পেতে এবং বুঝতে সাহায্য করি। আসুন আপনার সম্পর্কে জেনে শুরু করি।",
    welcomeFooter: "যেকোনো কেন্দ্রীয় বা রাজ্য সরকারি প্রকল্প সম্পর্কে জিজ্ঞাসা করুন",
    typeMessage: "আপনার বার্তা লিখুন...",
    send: "পাঠান",
    thinking: "ভাবছি...",
    inputPlaceholder: "সরকারি প্রকল্প সম্পর্কে জিজ্ঞাসা করুন...",
    disclaimer: "সংবাদ AI সরকারি প্রকল্পের তথ্য সরবরাহ করে। অফিসিয়াল পোর্টালে যাচাই করুন।",
    selectAgeGroup: "অনুগ্রহ করে আপনার বয়স গোষ্ঠী নির্বাচন করুন",
    selectSchemeCategory: "অনুগ্রহ করে প্রকল্পের বিভাগ নির্বাচন করুন",
    selectEmploymentStatus: "আপনার বর্তমান অবস্থা কী?",
    ageBelow18: "১৮-এর নিচে",
    age18to35: "১৮ - ৩৫",
    age36to60: "৩৬ - ৬০",
    ageAbove60: "৬০-এর উপরে",
    ageGroups: {
      below18: "১৮-এর নিচে",
      "18to35": "১৮-৩৫ বছর",
      "36to60": "৩৬-৬০ বছর",
      above60: "৬০-এর উপরে",
    },
    educationSchemes: "শিক্ষা প্রকল্প",
    employmentSchemes: "কর্মসংস্থান প্রকল্প",
    healthSchemes: "স্বাস্থ্য প্রকল্প",
    farmerSchemes: "কৃষক প্রকল্প",
    womenSchemes: "মহিলা কল্যাণ প্রকল্প",
    pensionSchemes: "পেনশন প্রকল্প",
    housingSchemes: "আবাসন প্রকল্প",
    schemeCategories: {
      education: "শিক্ষা",
      employment: "কর্মসংস্থান",
      health: "স্বাস্থ্য",
      agriculture: "কৃষি",
      women: "মহিলা কল্যাণ",
      pension: "পেনশন",
    },
    student: "ছাত্র",
    employed: "চাকরিজীবী",
    unemployed: "বেকার",
    selfEmployed: "স্বনিযুক্ত",
    employmentStatus: {
      student: "ছাত্র",
      employed: "চাকরিজীবী",
      unemployed: "বেকার",
      selfEmployed: "স্বনিযুক্ত",
    },
    activeFilters: "সক্রিয় ফিল্টার",
    ageGroup: "বয়স গোষ্ঠী",
    schemeType: "প্রকল্পের ধরন",
    status: "অবস্থা",
    noFiltersSelected: "কোনো ফিল্টার নির্বাচিত নয়",
    checkAnotherScheme: "অন্য প্রকল্প দেখুন",
    changeAgeGroup: "বয়স গোষ্ঠী পরিবর্তন",
    viewAllSchemes: "সমস্ত প্রকল্প দেখুন",
    startOver: "আবার শুরু করুন",
    suggestions: {
      title: "দ্রুত কার্যক্রম:",
      checkAnother: "অন্য প্রকল্প দেখুন",
      changeAge: "বয়স গোষ্ঠী পরিবর্তন",
      viewAll: "সমস্ত প্রকল্প দেখুন",
    },
    eligibility: "যোগ্যতা",
    benefits: "সুবিধা",
    requiredDocuments: "প্রয়োজনীয় নথি",
    applicationProcess: "আবেদন প্রক্রিয়া",
    visitWebsite: "অফিসিয়াল ওয়েবসাইট দেখুন",
    eligible: "যোগ্য",
    notEligible: "যোগ্য নয়",
    errorMessage: "অনুগ্রহ করে উপলব্ধ বিকল্পগুলি থেকে চয়ন করুন বা আপনার প্রশ্ন স্পষ্টভাবে লিখুন।",
    noSchemesFound: "আপনার মানদণ্ডের সাথে মেলে এমন কোনো প্রকল্প পাওয়া যায়নি।",
    selectFromOptions: "অনুগ্রহ করে নীচের বিকল্পগুলি থেকে নির্বাচন করুন",
    voiceInput: "ভয়েস ইনপুট",
    clearChat: "চ্যাট সাফ করুন",
  },
  mr: {
    appName: "संवाद AI",
    tagline: "सरकारी योजनांसाठी तुमचे मार्गदर्शक",
    newChat: "नवीन चॅट",
    chatHistory: "चॅट इतिहास",
    resetChat: "चॅट रीसेट करा",
    changeLanguage: "भाषा बदला",
    signOut: "लॉग आउट",
    welcomeTitle: "संवाद AI मध्ये आपले स्वागत",
    welcomeSubtitle: "मी तुम्हाला सरकारी योजना शोधण्यात आणि समजून घेण्यात मदत करतो. तुमच्याबद्दल जाणून घेऊन सुरुवात करूया.",
    welcomeFooter: "कोणत्याही केंद्र किंवा राज्य सरकारी योजनेबद्दल विचारा",
    typeMessage: "तुमचा संदेश टाइप करा...",
    send: "पाठवा",
    thinking: "विचार करत आहे...",
    inputPlaceholder: "सरकारी योजनांबद्दल विचारा...",
    disclaimer: "संवाद AI सरकारी योजनांची माहिती देतो. अधिकृत पोर्टलवर तपासा.",
    selectAgeGroup: "कृपया तुमचा वयोगट निवडा",
    selectSchemeCategory: "कृपया योजना श्रेणी निवडा",
    selectEmploymentStatus: "तुमची सध्याची स्थिती काय आहे?",
    ageBelow18: "१८ खाली",
    age18to35: "१८ - ३५",
    age36to60: "३६ - ६०",
    ageAbove60: "६० वर",
    ageGroups: {
      below18: "१८ खाली",
      "18to35": "१८-३५ वर्षे",
      "36to60": "३६-६० वर्षे",
      above60: "६० वर",
    },
    educationSchemes: "शिक्षण योजना",
    employmentSchemes: "रोजगार योजना",
    healthSchemes: "आरोग्य योजना",
    farmerSchemes: "शेतकरी योजना",
    womenSchemes: "महिला कल्याण योजना",
    pensionSchemes: "पेन्शन योजना",
    housingSchemes: "गृहनिर्माण योजना",
    schemeCategories: {
      education: "शिक्षण",
      employment: "रोजगार",
      health: "आरोग्य",
      agriculture: "शेती",
      women: "महिला कल्याण",
      pension: "पेन्शन",
    },
    student: "विद्यार्थी",
    employed: "नोकरदार",
    unemployed: "बेरोजगार",
    selfEmployed: "स्वयंरोजगार",
    employmentStatus: {
      student: "विद्यार्थी",
      employed: "नोकरदार",
      unemployed: "बेरोजगार",
      selfEmployed: "स्वयंरोजगार",
    },
    activeFilters: "सक्रिय फिल्टर",
    ageGroup: "वयोगट",
    schemeType: "योजना प्रकार",
    status: "स्थिती",
    noFiltersSelected: "कोणतेही फिल्टर निवडलेले नाही",
    checkAnotherScheme: "दुसरी योजना पहा",
    changeAgeGroup: "वयोगट बदला",
    viewAllSchemes: "सर्व योजना पहा",
    startOver: "पुन्हा सुरू करा",
    suggestions: {
      title: "द्रुत कृती:",
      checkAnother: "दुसरी योजना पहा",
      changeAge: "वयोगट बदला",
      viewAll: "सर्व योजना पहा",
    },
    eligibility: "पात्रता",
    benefits: "फायदे",
    requiredDocuments: "आवश्यक कागदपत्रे",
    applicationProcess: "अर्ज प्रक्रिया",
    visitWebsite: "अधिकृत वेबसाइट भेट द्या",
    eligible: "पात्र",
    notEligible: "पात्र नाही",
    errorMessage: "कृपया उपलब्ध पर्यायांमधून निवडा किंवा तुमची क्वेरी स्पष्टपणे टाइप करा.",
    noSchemesFound: "तुमच्या निकषांशी जुळणारी कोणतीही योजना आढळली नाही.",
    selectFromOptions: "कृपया खालील पर्यायांमधून निवडा",
    voiceInput: "व्हॉइस इनपुट",
    clearChat: "चॅट साफ करा",
  },
  te: {
    appName: "సంవాద్ AI",
    tagline: "ప్రభుత్వ పథకాల కోసం మీ గైడ్",
    newChat: "కొత్త చాట్",
    chatHistory: "చాట్ చరిత్ర",
    resetChat: "చాట్ రీసెట్",
    changeLanguage: "భాష మార్చు",
    signOut: "లాగ్ అవుట్",
    welcomeTitle: "సంవాద్ AI కి స్వాగతం",
    welcomeSubtitle: "ప్రభుత్వ పథకాలను కనుగొని అర్థం చేసుకోవడంలో నేను మీకు సహాయం చేస్తాను. మీ గురించి తెలుసుకుని ప్రారంభిద్దాం.",
    welcomeFooter: "ఏదైనా కేంద్ర లేదా రాష్ట్ర ప్రభుత్వ పథకం గురించి అడగండి",
    typeMessage: "మీ సందేశాన్ని టైప్ చేయండి...",
    send: "పంపు",
    thinking: "ఆలోచిస్తున్నాను...",
    inputPlaceholder: "ప్రభుత్వ పథకాల గురించి అడగండి...",
    disclaimer: "సంవాద్ AI ప్రభుత్వ పథకాల సమాచారాన్ని అందిస్తుంది. అధికారిక పోర్టల్‌లో ధృవీకరించండి.",
    selectAgeGroup: "దయచేసి మీ వయస్సు గ్రూప్‌ను ఎంచుకోండి",
    selectSchemeCategory: "దయచేసి పథకం వర్గాన్ని ఎంచుకోండి",
    selectEmploymentStatus: "మీ ప్రస్తుత స్థితి ఏమిటి?",
    ageBelow18: "18 కంటే తక్కువ",
    age18to35: "18 - 35",
    age36to60: "36 - 60",
    ageAbove60: "60 పైన",
    ageGroups: {
      below18: "18 కంటే తక్కువ",
      "18to35": "18-35 సంవత్సరాలు",
      "36to60": "36-60 సంవత్సరాలు",
      above60: "60 పైన",
    },
    educationSchemes: "విద్యా పథకాలు",
    employmentSchemes: "ఉపాధి పథకాలు",
    healthSchemes: "ఆరోగ్య పథకాలు",
    farmerSchemes: "రైతు పథకాలు",
    womenSchemes: "మహిళా సంక్షేమ పథకాలు",
    pensionSchemes: "పెన్షన్ పథకాలు",
    housingSchemes: "గృహ పథకాలు",
    schemeCategories: {
      education: "విద్య",
      employment: "ఉపాధి",
      health: "ఆరోగ్యం",
      agriculture: "వ్యవసాయం",
      women: "మహిళా సంక్షేమం",
      pension: "పెన్షన్",
    },
    student: "విద్యార్థి",
    employed: "ఉద్యోగి",
    unemployed: "నిరుద్యోగి",
    selfEmployed: "స్వయం ఉపాధి",
    employmentStatus: {
      student: "విద్యార్థి",
      employed: "ఉద్యోగి",
      unemployed: "నిరుద్యోగి",
      selfEmployed: "స్వయం ఉపాధి",
    },
    activeFilters: "యాక్టివ్ ఫిల్టర్లు",
    ageGroup: "వయస్సు గ్రూప్",
    schemeType: "పథకం రకం",
    status: "స్థితి",
    noFiltersSelected: "ఫిల్టర్లు ఎంపిక చేయబడలేదు",
    checkAnotherScheme: "మరో పథకం చూడండి",
    changeAgeGroup: "వయస్సు గ్రూప్ మార్చు",
    viewAllSchemes: "అన్ని పథకాలు చూడండి",
    startOver: "మళ్లీ ప్రారంభించు",
    suggestions: {
      title: "త్వరిత చర్యలు:",
      checkAnother: "మరో పథకం చూడండి",
      changeAge: "వయస్సు గ్రూప్ మార్చు",
      viewAll: "అన్ని పథకాలు చూడండి",
    },
    eligibility: "అర్హత",
    benefits: "ప్రయోజనాలు",
    requiredDocuments: "అవసరమైన పత్రాలు",
    applicationProcess: "దరఖాస్తు ప్రక్రియ",
    visitWebsite: "అధికారిక వెబ్‌సైట్ సందర్శించండి",
    eligible: "అర్హులు",
    notEligible: "అర్హులు కాదు",
    errorMessage: "దయచేసి అందుబాటులో ఉన్న ఎంపికల నుండి ఎంచుకోండి లేదా మీ ప్రశ్నను స్పష్టంగా టైప్ చేయండి.",
    noSchemesFound: "మీ ప్రమాణాలకు సరిపోలే పథకాలు కనుగొనబడలేదు.",
    selectFromOptions: "దయచేసి క్రింది ఎంపికల నుండి ఎంచుకోండి",
    voiceInput: "వాయిస్ ఇన్‌పుట్",
    clearChat: "చాట్ క్లియర్ చేయండి",
  },
  ta: {
    appName: "சம்வாத் AI",
    tagline: "அரசு திட்டங்களுக்கான உங்கள் வழிகாட்டி",
    newChat: "புதிய அரட்டை",
    chatHistory: "அரட்டை வரலாறு",
    resetChat: "அரட்டை மீட்டமை",
    changeLanguage: "மொழி மாற்று",
    signOut: "வெளியேறு",
    welcomeTitle: "சம்வாத் AI க்கு வரவேற்கிறோம்",
    welcomeSubtitle: "அரசு திட்டங்களைக் கண்டறிந்து புரிந்துகொள்ள நான் உங்களுக்கு உதவுகிறேன். உங்களைப் பற்றி தெரிந்துகொண்டு தொடங்குவோம்.",
    welcomeFooter: "எந்த மத்திய அல்லது மாநில அரசு திட்டத்தைப் பற்றியும் கேளுங்கள்",
    typeMessage: "உங்கள் செய்தியைத் தட்டச்சு செய்யுங்கள்...",
    send: "அனுப்பு",
    thinking: "சிந்திக்கிறேன்...",
    inputPlaceholder: "அரசு திட்டங்களைப் பற்றி கேளுங்கள்...",
    disclaimer: "சம்வாத் AI அரசு திட்டங்கள் பற்றிய தகவல்களை வழங்குகிறது. அதிகாரப்பூர்வ தளங்களில் சரிபார்க்கவும்.",
    selectAgeGroup: "உங்கள் வயது குழுவைத் தேர்ந்தெடுக்கவும்",
    selectSchemeCategory: "திட்ட வகையைத் தேர்ந்தெடுக்கவும்",
    selectEmploymentStatus: "உங்கள் தற்போதைய நிலை என்ன?",
    ageBelow18: "18க்கு கீழ்",
    age18to35: "18 - 35",
    age36to60: "36 - 60",
    ageAbove60: "60க்கு மேல்",
    ageGroups: {
      below18: "18க்கு கீழ்",
      "18to35": "18-35 வயது",
      "36to60": "36-60 வயது",
      above60: "60க்கு மேல்",
    },
    educationSchemes: "கல்வி திட்டங்கள்",
    employmentSchemes: "வேலைவாய்ப்பு திட்டங்கள்",
    healthSchemes: "சுகாதார திட்டங்கள்",
    farmerSchemes: "விவசாயி திட்டங்கள்",
    womenSchemes: "பெண்கள் நலத் திட்டங்கள்",
    pensionSchemes: "ஓய்வூதிய திட்டங்கள்",
    housingSchemes: "வீட்டு வசதி திட்டங்கள்",
    schemeCategories: {
      education: "கல்வி",
      employment: "வேலைவாய்ப்பு",
      health: "சுகாதாரம்",
      agriculture: "விவசாயம்",
      women: "பெண்கள் நலன்",
      pension: "ஓய்வூதியம்",
    },
    student: "மாணவர்",
    employed: "பணியாளர்",
    unemployed: "வேலையில்லாதவர்",
    selfEmployed: "சுயதொழில்",
    employmentStatus: {
      student: "மாணவர்",
      employed: "பணியாளர்",
      unemployed: "வேலையில்லாதவர்",
      selfEmployed: "சுயதொழில்",
    },
    activeFilters: "செயலில் உள்ள வடிப்பான்கள்",
    ageGroup: "வயது குழு",
    schemeType: "திட்ட வகை",
    status: "நிலை",
    noFiltersSelected: "வடிப்பான்கள் தேர்ந்தெடுக்கப்படவில்லை",
    checkAnotherScheme: "மற்றொரு திட்டத்தைப் பாருங்கள்",
    changeAgeGroup: "வயது குழு மாற்று",
    viewAllSchemes: "அனைத்து திட்டங்களையும் காண்க",
    startOver: "மீண்டும் தொடங்கு",
    suggestions: {
      title: "விரைவு நடவடிக்கைகள்:",
      checkAnother: "மற்றொரு திட்டத்தைப் பாருங்கள்",
      changeAge: "வயது குழு மாற்று",
      viewAll: "அனைத்து திட்டங்களையும் காண்க",
    },
    eligibility: "தகுதி",
    benefits: "பலன்கள்",
    requiredDocuments: "தேவையான ஆவணங்கள்",
    applicationProcess: "விண்ணப்ப செயல்முறை",
    visitWebsite: "அதிகாரப்பூர்வ இணையதளத்தைப் பார்வையிடவும்",
    eligible: "தகுதியானவர்",
    notEligible: "தகுதியற்றவர்",
    errorMessage: "கிடைக்கும் விருப்பங்களிலிருந்து தேர்ந்தெடுக்கவும் அல்லது உங்கள் வினவலை தெளிவாகத் தட்டச்சு செய்யவும்.",
    noSchemesFound: "உங்கள் அளவுகோல்களுக்கு பொருந்தும் திட்டங்கள் எதுவும் கிடைக்கவில்லை.",
    selectFromOptions: "கீழே உள்ள விருப்பங்களிலிருந்து தேர்ந்தெடுக்கவும்",
    voiceInput: "குரல் உள்ளீடு",
    clearChat: "அரட்டை அழி",
  },
};

export const getTranslation = (language: string): UITranslations => {
  return translations[language as SupportedLanguage] || translations.en;
};

export const LANGUAGE_OPTIONS = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिंदी" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
];
