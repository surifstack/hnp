export type TextDirection = "ltr" | "rtl";

export interface LanguageOption {
  value: string;
  name: string;
  flag: string;
  script: string;
  rtl: boolean;
  dialCode?: string; // ✅ NEW
}

// Client-provided languages only (exactly as per client's JSON)
export const LANGUAGE_OPTIONS: readonly LanguageOption[] = [
  { value: "en", name: "English", flag: "🇺🇸", script: "Latin", rtl: false, dialCode: "+1" },
  { value: "zh", name: "Mandarin Chinese", flag: "🇨🇳", script: "Han", rtl: false, dialCode: "+86" },
  { value: "hi", name: "Hindi", flag: "🇮🇳", script: "Devanagari", rtl: false, dialCode: "+91" },
  { value: "es", name: "Spanish", flag: "🇪🇸", script: "Latin", rtl: false, dialCode: "+34" },
  { value: "fr", name: "French", flag: "🇫🇷", script: "Latin", rtl: false, dialCode: "+33" },
  { value: "ar", name: "Modern Standard Arabic", flag: "🇸🇦", script: "Arabic", rtl: true, dialCode: "+966" },
  { value: "bn", name: "Bengali", flag: "🇧🇩", script: "Bengali", rtl: false, dialCode: "+880" },
  { value: "pt", name: "Portuguese", flag: "🇵🇹", script: "Latin", rtl: false, dialCode: "+351" },
  { value: "ru", name: "Russian", flag: "🇷🇺", script: "Cyrillic", rtl: false, dialCode: "+7" },
  { value: "ur", name: "Urdu", flag: "🇵🇰", script: "Arabic", rtl: true, dialCode: "+92" },
  { value: "id", name: "Indonesian", flag: "🇮🇩", script: "Latin", rtl: false, dialCode: "+62" },
  { value: "de", name: "German", flag: "🇩🇪", script: "Latin", rtl: false, dialCode: "+49" },
  { value: "ja", name: "Japanese", flag: "🇯🇵", script: "Japanese", rtl: false, dialCode: "+81" },
  { value: "sw", name: "Swahili", flag: "🇰🇪", script: "Latin", rtl: false, dialCode: "+254" },
  { value: "mr", name: "Marathi", flag: "🇮🇳", script: "Devanagari", rtl: false, dialCode: "+91" },
  { value: "te", name: "Telugu", flag: "🇮🇳", script: "Telugu", rtl: false, dialCode: "+91" },
  { value: "tr", name: "Turkish", flag: "🇹🇷", script: "Latin", rtl: false, dialCode: "+90" },
  { value: "ta", name: "Tamil", flag: "🇮🇳", script: "Tamil", rtl: false, dialCode: "+91" },
  { value: "vi", name: "Vietnamese", flag: "🇻🇳", script: "Latin", rtl: false, dialCode: "+84" },
  { value: "ko", name: "Korean", flag: "🇰🇷", script: "Hangul", rtl: false, dialCode: "+82" },
  { value: "it", name: "Italian", flag: "🇮🇹", script: "Latin", rtl: false, dialCode: "+39" },
  { value: "th", name: "Thai", flag: "🇹🇭", script: "Thai", rtl: false, dialCode: "+66" },
  { value: "fa", name: "Persian (Farsi)", flag: "🇮🇷", script: "Arabic", rtl: true, dialCode: "+98" },
  { value: "gu", name: "Gujarati", flag: "🇮🇳", script: "Gujarati", rtl: false, dialCode: "+91" },
  { value: "kn", name: "Kannada", flag: "🇮🇳", script: "Kannada", rtl: false, dialCode: "+91" },
  { value: "bho", name: "Bhojpuri", flag: "🇮🇳", script: "Devanagari", rtl: false, dialCode: "+91" },
  { value: "pl", name: "Polish", flag: "🇵🇱", script: "Latin", rtl: false, dialCode: "+48" },
  { value: "uk", name: "Ukrainian", flag: "🇺🇦", script: "Cyrillic", rtl: false, dialCode: "+380" },
  { value: "ml", name: "Malayalam", flag: "🇮🇳", script: "Malayalam", rtl: false, dialCode: "+91" },
  { value: "or", name: "Odia (Oriya)", flag: "🇮🇳", script: "Oriya", rtl: false, dialCode: "+91" },
  { value: "mai", name: "Maithili", flag: "🇮🇳", script: "Devanagari", rtl: false, dialCode: "+91" },
  { value: "my", name: "Burmese", flag: "🇲🇲", script: "Myanmar", rtl: false, dialCode: "+95" },
  { value: "hak", name: "Hakka Chinese", flag: "🇨🇳", script: "Han", rtl: false, dialCode: "+86" },
  { value: "ha", name: "Hausa", flag: "🇳🇬", script: "Latin", rtl: false, dialCode: "+234" },
  { value: "tl", name: "Tagalog (Filipino)", flag: "🇵🇭", script: "Latin", rtl: false, dialCode: "+63" },
  { value: "yo", name: "Yoruba", flag: "🇳🇬", script: "Latin", rtl: false, dialCode: "+234" },
  { value: "pa", name: "Punjabi", flag: "🇮🇳", script: "Gurmukhi", rtl: false, dialCode: "+91" },
  { value: "am", name: "Amharic", flag: "🇪🇹", script: "Ethiopic", rtl: false, dialCode: "+251" },
  { value: "jv", name: "Javanese", flag: "🇮🇩", script: "Latin", rtl: false, dialCode: "+62" },
  { value: "ro", name: "Romanian", flag: "🇷🇴", script: "Latin", rtl: false, dialCode: "+40" },
  { value: "nl", name: "Dutch", flag: "🇳🇱", script: "Latin", rtl: false, dialCode: "+31" },
  { value: "hu", name: "Hungarian", flag: "🇭🇺", script: "Latin", rtl: false, dialCode: "+36" },
  { value: "el", name: "Greek", flag: "🇬🇷", script: "Greek", rtl: false, dialCode: "+30" },
  { value: "cs", name: "Czech", flag: "🇨🇿", script: "Latin", rtl: false, dialCode: "+420" },
  { value: "sv", name: "Swedish", flag: "🇸🇪", script: "Latin", rtl: false, dialCode: "+46" },
  { value: "zu", name: "Zulu", flag: "🇿🇦", script: "Latin", rtl: false, dialCode: "+27" },
  { value: "so", name: "Somali", flag: "🇸🇴", script: "Latin", rtl: false, dialCode: "+252" },
  { value: "az", name: "Azerbaijani", flag: "🇦🇿", script: "Latin", rtl: false, dialCode: "+994" },
  { value: "si", name: "Sinhala", flag: "🇱🇰", script: "Sinhala", rtl: false, dialCode: "+94" },
  { value: "he", name: "Hebrew", flag: "🇮🇱", script: "Hebrew", rtl: true, dialCode: "+972" },
] as const;

export const SUPPORTED_LANGUAGE_CODES = new Set(LANGUAGE_OPTIONS.map((o) => o.value));

export function getLanguageOption(languageCode: string): LanguageOption | undefined {
  return LANGUAGE_OPTIONS.find((o) => o.value === languageCode);
}

/**
 * Returns a code that exists in `LANGUAGE_OPTIONS`, or `null` if unsupported.
 * Handles common i18next tags like "pt-BR", "zh-CN".
 */
export function getSupportedLanguageCode(languageCode: string): string | null {
  if (SUPPORTED_LANGUAGE_CODES.has(languageCode)) return languageCode;
  const base = languageCode.split("-")[0];
  if (SUPPORTED_LANGUAGE_CODES.has(base)) return base;
  return null;
}