// =============================================================================
// Translation dictionaries for English, Amharic, Afaan Oromo, Somali.
// Keys are organised by feature area. New keys must be added to every locale.
// =============================================================================

export const SUPPORTED_LOCALES = ["en", "am", "om", "so"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, { native: string; english: string; flag: string }> = {
  en: { native: "English", english: "English", flag: "🇬🇧" },
  am: { native: "አማርኛ", english: "Amharic", flag: "🇪🇹" },
  om: { native: "Afaan Oromoo", english: "Afaan Oromo", flag: "🇪🇹" },
  so: { native: "Af-Soomaali", english: "Somali", flag: "🇸🇴" },
};

export const translations = {
  en: {
    nav: {
      features: "Features",
      academy: "Academy",
      pricing: "Pricing",
      tools: "AI Tools",
      community: "Community",
      signIn: "Sign in",
      getStarted: "Get started",
    },
    hero: {
      eyebrow: "AI for Eastern Ethiopia & Africa",
      title: "Learn AI. Automate Business. Build the Future.",
      subtitle:
        "Eastern AI Consultant helps businesses, students, and organisations understand and use artificial intelligence effectively — in your language, on your phone, at any bandwidth.",
      startLearning: "Start learning free",
      tryAssistant: "Try the AI assistant",
      poweredBy: "Powered by Groq, LangChain & LangGraph",
    },
    stats: {
      students: "Students trained",
      businesses: "Businesses served",
      countries: "Countries reached",
      languages: "Languages supported",
    },
    features: {
      title: "An AI ecosystem built for African builders",
      subtitle:
        "Eight specialist AI agents, an academy, business consulting, automation and a community — in one beautiful workspace.",
      items: {
        chat: {
          title: "Multi-agent AI chat",
          body: "Ten specialised agents — Teacher, Business, Agriculture, Marketing, Career, Automation, Resume, Translator, Tutor, Startup — with streaming, voice and file uploads.",
        },
        academy: {
          title: "AI Learning Academy",
          body: "Practical courses with video, quizzes, certificates and progress tracking. Built for low-bandwidth and mobile-first.",
        },
        business: {
          title: "Business AI consulting",
          body: "Upload your docs, describe your business, get a full SWOT, automation roadmap and 30-day marketing plan in one click.",
        },
        automation: {
          title: "Automation Center",
          body: "WhatsApp bots, email flows, invoices, social posts, lead capture — designed for African SMEs.",
        },
        agriculture: {
          title: "AI for Agriculture",
          body: "Crop recommendations, pest diagnosis, weather + market prices, voice-first, in your language.",
        },
        career: {
          title: "AI Career Coach",
          body: "ATS resumes, cover letters, LinkedIn rewrites, interview simulations and skill roadmaps.",
        },
      },
    },
    pricing: {
      title: "Simple pricing that grows with you",
      subtitle: "Start free. Upgrade when your business demands more horsepower.",
      perMonth: "/ month",
      cta: "Choose plan",
      mostPopular: "Most popular",
    },
    faq: {
      title: "Frequently asked questions",
      items: [
        {
          q: "What languages do you support?",
          a: "English, Amharic, Afaan Oromo and Somali — for both UI and AI responses. More are coming soon.",
        },
        {
          q: "Will it work on low bandwidth?",
          a: "Yes. The whole platform is mobile-first, lazily loaded, and designed for 2G/3G. The AI uses Groq for fast streaming.",
        },
        {
          q: "Do I need to know how to code?",
          a: "No. Everything is no-code. Builders who code will also find advanced features like the AI Tool Directory and Automation builder.",
        },
        {
          q: "Is my data safe?",
          a: "Your business documents are encrypted at rest and isolated to your account. We never train external models on your data.",
        },
      ],
    },
    footer: {
      tagline: "AI literacy and automation for every African business.",
      product: "Product",
      company: "Company",
      legal: "Legal",
      privacy: "Privacy",
      terms: "Terms",
      contact: "Contact",
      about: "About",
      careers: "Careers",
      partners: "Partners",
      copyright: "© {year} Eastern AI Consultant. All rights reserved.",
    },
    auth: {
      signInTitle: "Welcome back",
      signInSubtitle: "Sign in to continue your AI journey.",
      signUpTitle: "Create your account",
      signUpSubtitle: "Join thousands of African students and entrepreneurs learning AI.",
      email: "Email",
      password: "Password",
      fullName: "Full name",
      country: "Country",
      forgot: "Forgot password?",
      noAccount: "Don't have an account?",
      haveAccount: "Already have an account?",
      signIn: "Sign in",
      signUp: "Sign up",
      orContinueWith: "or continue with",
      google: "Continue with Google",
    },
    dashboard: {
      welcome: "Welcome back, {name}",
      yourAgents: "Your AI agents",
      recentChats: "Recent chats",
      myCourses: "My courses",
      yourBusiness: "Your business",
      activeAutomations: "Active automations",
      startChat: "Start a new chat",
      newConversation: "New conversation",
    },
    chat: {
      placeholder: "Ask anything — the AI is multilingual",
      send: "Send",
      newChat: "New chat",
      suggestions: "Try one of these",
      thinking: "Thinking…",
      attachFile: "Attach file",
      voiceInput: "Voice input",
      readAloud: "Read aloud",
      promptExamples: [
        "How can AI help my small business?",
        "Teach me prompt engineering in 5 minutes",
        "Diagnose this crop disease",
        "Write me a 30-day marketing plan",
        "Build a resume for a remote junior data role",
      ],
    },
    common: {
      loading: "Loading…",
      error: "Something went wrong.",
      retry: "Try again",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      learnMore: "Learn more",
    },
  },

  am: {
    nav: {
      features: "ባህሪያት",
      academy: "አካዳሚ",
      pricing: "ዋጋ",
      tools: "የAI መሣሪያዎች",
      community: "ማህበረሰብ",
      signIn: "ይግቡ",
      getStarted: "ጀምር",
    },
    hero: {
      eyebrow: "ለምስራቅ ኢትዮጵያ እና አፍሪካ የተዘጋጀ AI",
      title: "AI ይማሩ። ስራዎን ይቀላጥፉ። የወደፊቱን ይገንቡ።",
      subtitle:
        "Eastern AI Consultant ለሥራ ፈጣሪዎች፣ ተማሪዎችና ድርጅቶች ሰው ሰራሽ ብልህነትን (AI) እንዲረዱና በብቃት እንዲጠቀሙበት ይረዳል — በቋንቋዎ፣ በስልክዎ፣ በማንኛውም የበይነመረብ ፍጥነት።",
      startLearning: "ነፃ ትምህርት ጀምር",
      tryAssistant: "AI ረዳትን ይሞክሩ",
      poweredBy: "በGroq፣ LangChain እና LangGraph የተደገፈ",
    },
    stats: {
      students: "የሰለጠኑ ተማሪዎች",
      businesses: "የተደገፉ ድርጅቶች",
      countries: "ተደራሽ አገራት",
      languages: "የሚደገፉ ቋንቋዎች",
    },
    features: {
      title: "ለአፍሪካ ሰሪዎች የተዘጋጀ የAI ስብስብ",
      subtitle:
        "ስምንት የተለያዩ AI ወኪሎች፣ አካዳሚ፣ የንግድ ምክር፣ አውቶሜሽን እና ማህበረሰብ — በአንድ ቆንጆ መድረክ።",
      items: {
        chat: {
          title: "ብዙ-ወኪል AI ቻት",
          body: "አስር ልዩ ወኪሎች — መምህር፣ ንግድ፣ ግብርና፣ ግብይት፣ ሥራ፣ አውቶሜሽን፣ CV፣ ተርጓሚ — ከስትሪሚንግ፣ ድምፅና ፋይል ጭነት ጋር።",
        },
        academy: {
          title: "AI መማሪያ አካዳሚ",
          body: "በቪዲዮ፣ በፈተናዎች፣ በሰርተፊኬቶችና በእድገት ክትትል ተግባራዊ ኮርሶች።",
        },
        business: {
          title: "የንግድ AI ምክር",
          body: "ሰነዶችዎን ያስገቡ፣ ንግድዎን ይግለፁ፣ ሙሉ SWOT፣ የአውቶሜሽን ካርታና የ30-ቀን ግብይት እቅድ ያግኙ።",
        },
        automation: {
          title: "የአውቶሜሽን ማዕከል",
          body: "WhatsApp ቦቶች፣ ኢሜል ፍሰቶች፣ ደረሰኞች፣ ማህበራዊ ልጥፎች፣ የደንበኛ መያዣ።",
        },
        agriculture: {
          title: "AI ለግብርና",
          body: "የሰብል ምክሮች፣ የተባይ ምርመራ፣ የአየር ሁኔታ + የገበያ ዋጋ።",
        },
        career: {
          title: "AI የሥራ አሰልጣኝ",
          body: "ATS CV፣ የመግቢያ ደብዳቤ፣ LinkedIn ማመቻቸት፣ የቃለ-መጠይቅ ስልጠና።",
        },
      },
    },
    pricing: {
      title: "ቀላል ዋጋ — ከእርስዎ ጋር የሚያድግ",
      subtitle: "በነፃ ይጀምሩ። ንግድዎ ሲጨምር ያሻሽሉ።",
      perMonth: "/ ወር",
      cta: "ይምረጡ",
      mostPopular: "በጣም ተወዳጅ",
    },
    faq: {
      title: "ተደጋጋሚ ጥያቄዎች",
      items: [
        { q: "ምን ቋንቋዎች ይደገፋሉ?", a: "እንግሊዝኛ፣ አማርኛ፣ Afaan Oromoo እና Af-Soomaali።" },
        { q: "በዝቅተኛ የበይነመረብ ፍጥነት ይሰራል?", a: "አዎ። መድረኩ ሙሉ በሙሉ ሞባይል-ፊርስት እና ለ2G/3G የተመቻቸ ነው።" },
        { q: "ኮድ ማወቅ አለብኝ?", a: "አይ። ሁሉም ነገር ኮድ የለሽ ነው።" },
        { q: "ውሂቤ ደህንነቱ የተጠበቀ ነው?", a: "አዎ። ሰነዶችዎ ይመሰጠራሉ እና ለእርስዎ መለያ ብቻ ናቸው።" },
      ],
    },
    footer: {
      tagline: "AI እውቀት እና አውቶሜሽን ለሁሉም የአፍሪካ ንግድ።",
      product: "ምርት",
      company: "ኩባንያ",
      legal: "ህጋዊ",
      privacy: "የግላዊነት ፖሊሲ",
      terms: "ውሎች",
      contact: "ያግኙን",
      about: "ስለ እኛ",
      careers: "ሥራዎች",
      partners: "አጋሮች",
      copyright: "© {year} Eastern AI Consultant። ሁሉም መብቶች የተጠበቁ ናቸው።",
    },
    auth: {
      signInTitle: "እንኳን ደህና መጡ",
      signInSubtitle: "የAI ጉዞዎን ለመቀጠል ይግቡ።",
      signUpTitle: "መለያዎን ይፍጠሩ",
      signUpSubtitle: "በሺዎች የሚቆጠሩ የአፍሪካ ተማሪዎችን ይቀላቀሉ።",
      email: "ኢሜል",
      password: "የይለፍ ቃል",
      fullName: "ሙሉ ስም",
      country: "አገር",
      forgot: "የይለፍ ቃል ረሱ?",
      noAccount: "መለያ የለዎትም?",
      haveAccount: "ቀደም ሲል መለያ አለዎት?",
      signIn: "ይግቡ",
      signUp: "ይመዝገቡ",
      orContinueWith: "ወይም በዚህ ይቀጥሉ",
      google: "በGoogle ይቀጥሉ",
    },
    dashboard: {
      welcome: "እንኳን ደህና መጡ፣ {name}",
      yourAgents: "የAI ወኪሎችዎ",
      recentChats: "የቅርብ ጊዜ ቻቶች",
      myCourses: "የእኔ ኮርሶች",
      yourBusiness: "ንግድዎ",
      activeAutomations: "ንቁ አውቶሜሽኖች",
      startChat: "አዲስ ቻት ጀምር",
      newConversation: "አዲስ ውይይት",
    },
    chat: {
      placeholder: "ማንኛውንም ይጠይቁ — AI ብዙ ቋንቋዎችን ይደግፋል",
      send: "ላክ",
      newChat: "አዲስ ቻት",
      suggestions: "ከእነዚህ ይሞክሩ",
      thinking: "በማሰብ ላይ…",
      attachFile: "ፋይል አያይዝ",
      voiceInput: "ድምፅ ግባት",
      readAloud: "ጮክ ብለህ አንብብ",
      promptExamples: [
        "AI ለትንሽ ንግዴ እንዴት ሊረዳኝ ይችላል?",
        "በ5 ደቂቃ ውስጥ prompt engineering አስተምሩኝ",
        "ይህን የሰብል በሽታ መርምሩ",
        "የ30-ቀን ግብይት እቅድ ይፃፉልኝ",
      ],
    },
    common: {
      loading: "በመጫን ላይ…",
      error: "የሆነ ችግር ተፈጥሯል።",
      retry: "እንደገና ሞክሩ",
      cancel: "ሰርዝ",
      save: "አስቀምጥ",
      delete: "ሰርዝ",
      edit: "አርትዕ",
      learnMore: "ተጨማሪ ይማሩ",
    },
  },

  om: {
    nav: {
      features: "Amaloota",
      academy: "Akkaadaamii",
      pricing: "Gatii",
      tools: "Meeshaalee AI",
      community: "Hawaasa",
      signIn: "Seeni",
      getStarted: "Eegali",
    },
    hero: {
      eyebrow: "AI Itoophiyaa Bahaa fi Afrikaaf",
      title: "AI baradhu. Daldala otoomeesi. Egeree ijaari.",
      subtitle:
        "Eastern AI Consultant daldalaaf, barattootaaf fi dhaabbileef AI hubachuu fi fayyadamuuf gargaara — afaan kee, bilbila kee, sa'aatii kamiyyuu.",
      startLearning: "Bilisaan eegali",
      tryAssistant: "Gargaaraa AI yaali",
      poweredBy: "Groq, LangChain fi LangGraph irraa",
    },
    stats: {
      students: "Barattoota leenjifaman",
      businesses: "Daldala tajaajilaman",
      countries: "Biyyoota qaqqaban",
      languages: "Afaanota deeggaraman",
    },
    features: {
      title: "Sirna AI ijaartoota Afrikaaf qophaa'e",
      subtitle:
        "Bakka-bu'oonni AI saddeet, akkaadaamii, gorsa daldalaa, otoomeessuu fi hawaasa — bakka tokkotti.",
      items: {
        chat: {
          title: "Marii AI bakka bu'aa hedduu",
          body: "Bakka-bu'oonni kudhan addaa — Barsiisaa, Daldalaa, Qonna, Gabaa, Carraa Hojii, Otoomeessuu, CV, Hiikaa.",
        },
        academy: {
          title: "Akkaadaamii Barnoota AI",
          body: "Koorsiiwwan hojii irra oolan: viidiyoo, qormaata, waraqaa ragaa, hordoffii adeemsa.",
        },
        business: {
          title: "Gorsa daldalaa AI",
          body: "Sanadoota fe'i, daldala kee ibsi, SWOT guutuu, karoora otoomeessuu fi gabaa 30-guyyaa argadhu.",
        },
        automation: {
          title: "Wiirtuu otoomeessuu",
          body: "Boottii WhatsApp, hojii email, nagahee, post miidiyaa hawaasaa, qabannaa lead.",
        },
        agriculture: {
          title: "AI Qonnaaf",
          body: "Filannoo midhaan, qorannoo dhukkuba, qilleensa fi gatii gabaa.",
        },
        career: {
          title: "Leenjisaa Carraa Hojii AI",
          body: "CV ATS, xalayaa ittisaa, LinkedIn, gaaffii af-gaaffii.",
        },
      },
    },
    pricing: {
      title: "Gatii salphaa — siwaliin guddatu",
      subtitle: "Bilisaan eegali. Daldalli kee yommuu guddatu fooyyessi.",
      perMonth: "/ ji'a",
      cta: "Filadhu",
      mostPopular: "Beekamaa",
    },
    faq: {
      title: "Gaaffilee yeroo baayyee gaafataman",
      items: [
        { q: "Afaanota maaltu deeggarama?", a: "Ingiliffaa, Amaariffaa, Afaan Oromoo fi Af-Soomaali." },
        { q: "Interneetii dadhabaa irratti hojjeta?", a: "Eeyyee. Sirnichi guutummaatti mobile-first fi 2G/3G-tti mijaa'eera." },
        { q: "Koodii beekuun barbaachisaa?", a: "Lakki, hundinuu koodii malee." },
        { q: "Daataan koo nageenya qabaa?", a: "Eeyyee, sanadoonni kee jechi galmee taasifame qofa siif galma'a." },
      ],
    },
    footer: {
      tagline: "Beekumsa AI fi otoomeessuu daldala Afrikaa hundaaf.",
      product: "Oomisha",
      company: "Dhaabbata",
      legal: "Seeraa",
      privacy: "Iccitii",
      terms: "Haalota",
      contact: "Nu qunnami",
      about: "Waa'ee keenya",
      careers: "Hojiiwwan",
      partners: "Michoota",
      copyright: "© {year} Eastern AI Consultant. Mirgi hundi eegamaadha.",
    },
    auth: {
      signInTitle: "Baga deebitee dhufte",
      signInSubtitle: "Imala AI kee itti fufuuf seeni.",
      signUpTitle: "Akkaawuntii kee uumi",
      signUpSubtitle: "Barattoota fi daldaltoota Afrikaa kuma kuma waliin makamadhu.",
      email: "Email",
      password: "Jecha icciitii",
      fullName: "Maqaa guutuu",
      country: "Biyya",
      forgot: "Jecha icciitii dagatte?",
      noAccount: "Akkaawuntii hin qabduu?",
      haveAccount: "Akkaawuntii duraan qabdaa?",
      signIn: "Seeni",
      signUp: "Galmaa'i",
      orContinueWith: "yookaan kanaan itti fufi",
      google: "Google'tiin itti fufi",
    },
    dashboard: {
      welcome: "Baga deebitee dhufte, {name}",
      yourAgents: "Bakka bu'oota AI kee",
      recentChats: "Marii dhihoo",
      myCourses: "Koorsiiwwan koo",
      yourBusiness: "Daldala kee",
      activeAutomations: "Otoomeessuu hojii irra jiran",
      startChat: "Marii haaraa eegali",
      newConversation: "Haasaa haaraa",
    },
    chat: {
      placeholder: "Wanta kamiyyuu gaafadhu — AI afaanota hedduu deeggara",
      send: "Ergi",
      newChat: "Marii haaraa",
      suggestions: "Isaan kana yaali",
      thinking: "Yaadaa jira…",
      attachFile: "Faayilii dabaluu",
      voiceInput: "Sagalee galchi",
      readAloud: "Sagaleen dubbisi",
      promptExamples: [
        "AI daldala koo xiqqaaf akkamitti gargaaruu danda'a?",
        "Daqiiqaa 5 keessatti prompt engineering na barsiisi",
        "Dhukkuba midhaan kana qoradhu",
        "Karoora gabaa guyyaa 30 naaf barreessi",
      ],
    },
    common: {
      loading: "Fe'aa jira…",
      error: "Rakkoon uumameera.",
      retry: "Irra deebi'i yaali",
      cancel: "Haquu",
      save: "Olkaa'i",
      delete: "Haqi",
      edit: "Gulaali",
      learnMore: "Dabalata baradhu",
    },
  },

  so: {
    nav: {
      features: "Astaamaha",
      academy: "Akadeemiyada",
      pricing: "Qiimaha",
      tools: "Aaladaha AI",
      community: "Bulshada",
      signIn: "Soo gal",
      getStarted: "Bilow",
    },
    hero: {
      eyebrow: "AI loogu talagalay Geeska Afrika",
      title: "Baro AI. Otomaadi ganacsiga. Dhis mustaqbalka.",
      subtitle:
        "Eastern AI Consultant waxa uu caawiyaa ganacsato, ardayda iyo hay'adaha si ay u fahmaan oo u isticmaalaan AI — luqaddaada, taleefankaaga, internet kasta.",
      startLearning: "Bilash u bilow",
      tryAssistant: "Tijaabi kaaliyaha AI",
      poweredBy: "Waxaa awooda Groq, LangChain & LangGraph",
    },
    stats: {
      students: "Arday la tababaray",
      businesses: "Ganacsi la caawiyay",
      countries: "Dalal la gaaray",
      languages: "Luqado la taageeray",
    },
    features: {
      title: "Nidaam AI oo loo dhisay dhisayaasha Afrika",
      subtitle:
        "Sideed wakiilo AI khaas ah, akadeemiyad, lataliye ganacsi, otomeyn iyo bulsho — meel keliya.",
      items: {
        chat: {
          title: "Wadahadal AI badan",
          body: "Toban wakiilo khaas ah — Macallin, Ganacsi, Beero, Suuq, Shaqo, Otomeyn, CV, Turjubaan.",
        },
        academy: {
          title: "Akademiyada Barashada AI",
          body: "Koorsooyin firfircoon: muuqaal, imtixaan, shahaadooyin, raadinta horumarka.",
        },
        business: {
          title: "Lataliye AI ganacsi",
          body: "Soo geli dukumiintiyada, sharax ganacsigaaga, hel SWOT, jidka otomeynta iyo qorshaha suuq ee 30 maalmood.",
        },
        automation: {
          title: "Xarunta Otomeynta",
          body: "Bots WhatsApp, email, qaansheeg, social, ururinta hogaamiyeyaasha.",
        },
        agriculture: {
          title: "AI Beeraha",
          body: "Talo dalagga, ogaanshaha cuduradda, cimilada iyo qiimaha suuqa.",
        },
        career: {
          title: "Tababaraha Shaqo AI",
          body: "CV ATS, warqad daboolaad, LinkedIn, jawaab celin wareysi.",
        },
      },
    },
    pricing: {
      title: "Qiime fudud — koraya adigaba",
      subtitle: "Bilash u bilow. Hagaaji marka ganacsigaagu u baahdo awood badan.",
      perMonth: "/ bishii",
      cta: "Dooro qorshaha",
      mostPopular: "Caan",
    },
    faq: {
      title: "Su'aalo soo noqnoqday",
      items: [
        { q: "Luqadihee aad taageertaan?", a: "Ingiriisi, Amxaari, Afaan Oromo, iyo Af-Soomaali." },
        { q: "Ma ku shaqayn doonaa internet liita?", a: "Haa. Madasha oo dhan waa mobile-first oo loogu talagalay 2G/3G." },
        { q: "Ma u baahanahay inaan code aqaano?", a: "Maya. Wax walba waa code-la'aan." },
        { q: "Xogtaydu ma ammaan tahay?", a: "Haa. Dukumiintiyada ganacsigaaga waa la sirayaa." },
      ],
    },
    footer: {
      tagline: "Aqoonta AI iyo otomeyn ganacsi Afrika kasta.",
      product: "Alaab",
      company: "Shirkad",
      legal: "Sharci",
      privacy: "Asturnaanta",
      terms: "Shuruudaha",
      contact: "Nala soo xidhiidh",
      about: "Annaga",
      careers: "Shaqooyinka",
      partners: "Lammaaneyaasha",
      copyright: "© {year} Eastern AI Consultant. Xuquuqda oo dhan way xafidan tahay.",
    },
    auth: {
      signInTitle: "Soo dhowow",
      signInSubtitle: "Soo gal si aad u sii waddo safarkaaga AI.",
      signUpTitle: "Samee akoonkaaga",
      signUpSubtitle: "Ku biir kumanaan arday iyo ganacsato Afrikaan ah.",
      email: "Email",
      password: "Furaha sirta",
      fullName: "Magaca buuxa",
      country: "Dalka",
      forgot: "Ma ilowday furaha?",
      noAccount: "Ma lihid akoon?",
      haveAccount: "Mar hore ma lahaad akoon?",
      signIn: "Soo gal",
      signUp: "Is diiwaan gali",
      orContinueWith: "ama ku sii wad",
      google: "Ku sii wad Google",
    },
    dashboard: {
      welcome: "Soo dhowow, {name}",
      yourAgents: "Wakiilada AI",
      recentChats: "Wadahadalada dhowaa",
      myCourses: "Koorsooyinkayga",
      yourBusiness: "Ganacsigaaga",
      activeAutomations: "Otomeyno shaqaynaya",
      startChat: "Bilow wadahadal cusub",
      newConversation: "Wadahadal cusub",
    },
    chat: {
      placeholder: "Wax kasta weydii — AI waa luqado badan",
      send: "Dir",
      newChat: "Wadahadal cusub",
      suggestions: "Isku day kuwan",
      thinking: "Waan ka fakareyaa…",
      attachFile: "Ku lifaaq fayl",
      voiceInput: "Geli cod",
      readAloud: "Ku akhri cod kor ah",
      promptExamples: [
        "Sidee AI uga caawin karaa ganacsigayga yar?",
        "Iga bar prompt engineering 5 daqiiqo gudahood",
        "Caafimaadkan dalag baar",
        "Ii qor qorshe suuq 30 maalmood ah",
      ],
    },
    common: {
      loading: "Soo dejinaya…",
      error: "Wax baa khaldamay.",
      retry: "Mar kale isku day",
      cancel: "Jooji",
      save: "Kaydi",
      delete: "Tirtir",
      edit: "Wax ka beddel",
      learnMore: "Wax dheeraad ah baro",
    },
  },
} as const;

export type TranslationKeys = typeof translations.en;

export function t(locale: Locale, path: string, params?: Record<string, string | number>): string {
  const dict = translations[locale] ?? translations.en;
  const value = path.split(".").reduce<unknown>(
    (acc, key) => (acc && typeof acc === "object" ? (acc as Record<string, unknown>)[key] : undefined),
    dict,
  );
  let out = typeof value === "string" ? value : path;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      out = out.replaceAll(`{${k}}`, String(v));
    }
  }
  return out;
}
