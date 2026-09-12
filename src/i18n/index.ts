import enLocale from '../../locales/en.json';

export type LanguageCode = 'en' | 'hi' | 'mr' | 'pa' | 'od';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  native: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'od', label: 'Odia', native: 'ଓଡ଼ିଆ' },
];

const translations: Record<LanguageCode, any> = {
  en: enLocale,
  hi: {
    ...enLocale,
    farmer: {
      ...enLocale.farmer,
      greeting: "शुभ प्रभात",
      heroPrompt: "क्या आप अपनी फसल की तुलाई के लिए तैयार हैं?",
      primaryAction: "उपार्जन स्लॉट बुक करें",
      trackAction: "बुकिंग ट्रैक करें",
      queueAction: "कतार की स्थिति",
      paymentAction: "भुगतान स्थिति",
      operatingSmoothly: "सुचारू रूप से संचालित",
      expectedTurn: "अपेक्षित समय",
      smartPhoneNotRequired: "स्मार्टफोन आवश्यक नहीं है"
    },
    booking: {
      ...enLocale.booking,
      step1: "फसल चुनें",
      step2: "अनुमानित मात्रा दर्ज करें",
      step3: "मंडी केंद्र चुनें",
      step4: "आगमन समय",
      step5: "पुष्टि करें",
      confirmButton: "उपार्जन बुकिंग सुनिश्चित करें"
    }
  },
  mr: {
    ...enLocale,
    farmer: {
      ...enLocale.farmer,
      greeting: "शुभ सकाळ",
      heroPrompt: "आपल्या पिकाच्या खरेदीसाठी तयार आहात का?",
      primaryAction: "खरेदी बुकिंग करा",
      trackAction: "बुकिंग तपासा",
      queueAction: "रांगेची स्थिती",
      paymentAction: "देयक स्थिती"
    }
  },
  pa: {
    ...enLocale,
    farmer: {
      ...enLocale.farmer,
      greeting: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ",
      heroPrompt: "ਕੀ ਤੁਸੀਂ ਆਪਣੀ ਫਸਲ ਦੀ ਖਰੀਦ ਲਈ ਤਿਆਰ ਹੋ?",
      primaryAction: "ਖਰੀਦ ਬੁੱਕ ਕਰੋ",
      trackAction: "ਬੁਕਿੰਗ ਟ੍ਰੈਕ ਕਰੋ"
    }
  },
  od: {
    ...enLocale,
    farmer: {
      ...enLocale.farmer,
      greeting: "ଶୁଭ ସକାଳ",
      heroPrompt: "ଆପଣଙ୍କ ଫସଲ ବିକ୍ରୟ ପାଇଁ ପ୍ରସ୍ତୁତ କି?",
      primaryAction: "କ୍ରୟ ସ୍ଲଟ ବୁକ୍ କରନ୍ତୁ"
    }
  }
};

export function getTranslation(lang: LanguageCode, keyPath: string): string {
  const parts = keyPath.split('.');
  let current: any = translations[lang] || translations['en'];
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      // Fallback to English
      let fallback: any = translations['en'];
      for (const fPart of parts) {
        if (fallback && typeof fallback === 'object' && fPart in fallback) {
          fallback = fallback[fPart];
        } else {
          return keyPath;
        }
      }
      return typeof fallback === 'string' ? fallback : keyPath;
    }
  }
  return typeof current === 'string' ? current : keyPath;
}
