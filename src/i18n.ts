import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslation from "@/locales/en/translation.json";
import esTranslation from "@/locales/es/translation.json";
import hiTranslation from "@/locales/hi/translation.json";
import frTranslation from "@/locales/fr/translation.json";
import ptTranslation from "@/locales/pt/translation.json";
import idTranslation from "@/locales/id/translation.json";
import deTranslation from "@/locales/de/translation.json";
import swTranslation from "@/locales/sw/translation.json";
import trTranslation from "@/locales/tr/translation.json";
import viTranslation from "@/locales/vi/translation.json";
import itTranslation from "@/locales/it/translation.json";
import plTranslation from "@/locales/pl/translation.json";
import roTranslation from "@/locales/ro/translation.json";
import nlTranslation from "@/locales/nl/translation.json";
import huTranslation from "@/locales/hu/translation.json";
import csTranslation from "@/locales/cs/translation.json";
import svTranslation from "@/locales/sv/translation.json";

const STORAGE_KEY = "hnp-lang";

const SUPPORTED_LANGUAGES = [
  "en",
  "es",
  "fr",
  "pt",
  "id",
  "de",
  "sw",
  "tr",
  "vi",
  "it",
  "pl",
  "ro",
  "nl",
  "hu",
  "cs",
  "sv",
] as const;

const resources = {
  en: {
    translation: enTranslation,
  },
  es: {
    translation: esTranslation,
  },
  hi: {
    translation: hiTranslation,
  },
  fr: {
    translation: frTranslation,
  },
  pt: {
    translation: ptTranslation,
  },
  id: {
    translation: idTranslation,
  },
  de: {
    translation: deTranslation,
  },
  sw: {
    translation: swTranslation,
  },
  tr: {
    translation: trTranslation,
  },
  vi: {
    translation: viTranslation,
  },
  it: {
    translation: itTranslation,
  },
  pl: {
    translation: plTranslation,
  },
  ro: {
    translation: roTranslation,
  },
  nl: {
    translation: nlTranslation,
  },
  hu: {
    translation: huTranslation,
  },
  cs: {
    translation: csTranslation,
  },
  sv: {
    translation: svTranslation,
  },
} as const;

const storedLng = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
const initialLng =
  storedLng && (SUPPORTED_LANGUAGES as readonly string[]).includes(storedLng) ? storedLng : "en";

void i18n.use(initReactI18next).init({
  resources,
  lng: initialLng,
  fallbackLng: "en",
  supportedLngs: [...SUPPORTED_LANGUAGES],
  nonExplicitSupportedLngs: true,
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (lng) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, lng);
  } catch {
    // ignore
  }
});

export default i18n;
