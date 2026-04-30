import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { LANGUAGE_OPTIONS } from "@/config/languages";

// 🌍 translations
import en from "@/locales/en/translation.json";
import de from "@/locales/de/translation.json";
import id from "@/locales/id/translation.json";
import fr from "@/locales/fr/translation.json";
import es from "@/locales/es/translation.json";
import pt from "@/locales/pt/translation.json";
import vi from "@/locales/vi/translation.json";
import hi from "@/locales/hi/translation.json";
import sv from "@/locales/sv/translation.json";
import pl from "@/locales/pl/translation.json";
import nl from "@/locales/nl/translation.json";
import it from "@/locales/it/translation.json";
import hu from "@/locales/hu/translation.json";
import tr from "@/locales/tr/translation.json";
import sw from "@/locales/sw/translation.json";



const STORAGE_KEY = "hnp-lang";

/**
 * 🌍 Supported languages
 */
export const SUPPORTED_LANGUAGES = [
  ...LANGUAGE_OPTIONS.map((o) => o.value),
] as const;

/**
 * 📦 Translation resources
 */
const resources = {
  en: { translation: en },
  de: { translation: de },
  id: { translation: id },
  fr: { translation: fr },
  es: { translation: es },
  pt: { translation: pt },
  vi: { translation: vi },
  sw: { translation: sw },
  hi: { translation: hi },
  hu: { translation: hu },
  sv: { translation: sv },
  pl: { translation: pl },
  nl: { translation: nl },
  it: { translation: it },
  tr: { translation: tr }

} as const;

/**
 * 💾 Get saved language
 */
const storedLng =
  typeof window !== "undefined"
    ? window.localStorage.getItem(STORAGE_KEY)
    : null;

/**
 * 🌐 Initial language
 */
const initialLng =
  storedLng && (SUPPORTED_LANGUAGES as readonly string[]).includes(storedLng)
    ? storedLng
    : "en";

/**
 * 🚀 i18n init
 */
void i18n.use(initReactI18next).init({
  resources,
  lng: initialLng,
  fallbackLng: "en",

  supportedLngs: [...SUPPORTED_LANGUAGES],
  nonExplicitSupportedLngs: true,

  interpolation: {
    escapeValue: false,
  },

  /**
   * 🔥 IMPORTANT FIXES
   */
  returnNull: false,
  returnEmptyString: false,
  returnObjects: false,

  fallbackNS: "translation",

  missingKeyHandler: (lng, ns, key) => {
    console.warn(`Missing translation: ${lng}.${key}`);
  },
});

/**
 * 💾 persist language change
 */
i18n.on("languageChanged", (lng) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, lng);
  } catch {
    // ignore
  }
});

export default i18n;
