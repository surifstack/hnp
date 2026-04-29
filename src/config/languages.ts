export type TextDirection = "ltr" | "rtl";
export type ScriptType =
  | "Latin"
  | "Arabic"
  | "Devanagari"
  | "Han"
  | "Cyrillic"
  | "Thai"
  | "Hangul"
  | "Bengali"
  | "Tamil"
  | "Telugu"
  | "Gujarati"
  | "Kannada"
  | "Malayalam"
  | "Gurmukhi"
  | "Greek"
  | "Hebrew"
  | "Other";

export interface AddressField {
  label: string;
  key: string;
}

export interface LanguageOption {
  value: string;
  name: string;
  flag: string;
  script: ScriptType;
  rtl: boolean;
  dialCode?: string;
  addressFields: AddressField[];
}



export const SCRIPT_FONT_MAP: Record<
  ScriptType,
  { fontFamily: string; fontSize: string; direction: TextDirection }
> = {
  Latin: {
    fontFamily: "DIN Condensed, Liberation Sans Narrow, sans-serif",
    fontSize: "9pt",
    direction: "ltr",
  },
  Arabic: {
    fontFamily: "Noto Naskh Arabic, sans-serif",
    fontSize: "10pt",
    direction: "rtl",
  },
  Devanagari: {
    fontFamily: "Noto Sans Devanagari, sans-serif",
    fontSize: "10pt",
    direction: "ltr",
  },
  Han: {
    fontFamily: "Noto Sans CJK, sans-serif",
    fontSize: "10.5pt",
    direction: "ltr",
  },
  Cyrillic: {
    fontFamily: "Noto Sans, sans-serif",
    fontSize: "10pt",
    direction: "ltr",
  },
  Thai: {
    fontFamily: "Noto Sans Thai, sans-serif",
    fontSize: "10pt",
    direction: "ltr",
  },
  Hangul: {
    fontFamily: "Noto Sans KR, sans-serif",
    fontSize: "10pt",
    direction: "ltr",
  },
  Bengali: {
    fontFamily: "Noto Sans Bengali, sans-serif",
    fontSize: "10pt",
    direction: "ltr",
  },
  Tamil: {
    fontFamily: "Noto Sans Tamil, sans-serif",
    fontSize: "10pt",
    direction: "ltr",
  },
  Telugu: {
    fontFamily: "Noto Sans Telugu, sans-serif",
    fontSize: "10pt",
    direction: "ltr",
  },
  Gujarati: {
    fontFamily: "Noto Sans Gujarati, sans-serif",
    fontSize: "10pt",
    direction: "ltr",
  },
  Kannada: {
    fontFamily: "Noto Sans Kannada, sans-serif",
    fontSize: "10pt",
    direction: "ltr",
  },
  Malayalam: {
    fontFamily: "Noto Sans Malayalam, sans-serif",
    fontSize: "10pt",
    direction: "ltr",
  },
  Gurmukhi: {
    fontFamily: "Noto Sans Gurmukhi, sans-serif",
    fontSize: "10pt",
    direction: "ltr",
  },
  Greek: {
    fontFamily: "Noto Sans, sans-serif",
    fontSize: "9pt",
    direction: "ltr",
  },
  Hebrew: {
    fontFamily: "Noto Sans Hebrew, sans-serif",
    fontSize: "10pt",
    direction: "rtl",
  },
  Other: {
    fontFamily: "Noto Sans, sans-serif",
    fontSize: "10pt",
    direction: "ltr",
  },
};




// Client-provided languages only
export const LANGUAGE_OPTIONS: readonly LanguageOption[] = [
  {
    value: "en",
    name: "English",
    flag: "🇺🇸",
    script: "Latin",
    rtl: false,
    dialCode: "+1",
    addressFields: [
      { label: "Street", key: "street" },
      { label: "City", key: "city" },
      { label: "State", key: "state" },
      { label: "ZIP Code", key: "zipCode" },
    ],
  },

  {
    value: "es",
    name: "Spanish",
    flag: "🇪🇸",
    script: "Latin",
    rtl: false,
    dialCode: "+34",
    addressFields: [
      { label: "Street", key: "street" },
      { label: "City", key: "city" },
      { label: "Province", key: "province" },
      { label: "Postal Code", key: "postalCode" },
    ],
  },

  {
    value: "fr",
    name: "French",
    flag: "🇫🇷",
    script: "Latin",
    rtl: false,
    dialCode: "+33",
    addressFields: [
      { label: "Street", key: "street" },
      { label: "Postal Code", key: "postalCode" },
      { label: "City", key: "city" },
    ],
  },

  {
    value: "pt",
    name: "Portuguese",
    flag: "🇵🇹",
    script: "Latin",
    rtl: false,
    dialCode: "+351",
    addressFields: [
      { label: "Street", key: "street" },
      { label: "Number", key: "number" },
      { label: "City", key: "city" },
      { label: "Postal Code", key: "postalCode" },
    ],
  },

  {
    value: "id",
    name: "Indonesian",
    flag: "🇮🇩",
    script: "Latin",
    rtl: false,
    dialCode: "+62",
    addressFields: [
      { label: "Street", key: "street" },
      { label: "Village", key: "village" },
      { label: "City", key: "city" },
      { label: "Province", key: "province" },
      { label: "Postal Code", key: "postalCode" },
    ],
  },

  {
    value: "de",
    name: "German",
    flag: "🇩🇪",
    script: "Latin",
    rtl: false,
    dialCode: "+49",
    addressFields: [
      { label: "Street", key: "street" },
      { label: "House Number", key: "houseNumber" },
      { label: "Postal Code", key: "postalCode" },
      { label: "City", key: "city" },
    ],
  },

  {
    value: "sw",
    name: "Swahili",
    flag: "🇰🇪",
    script: "Latin",
    rtl: false,
    dialCode: "+254",
    addressFields: [
      { label: "Street", key: "street" },
      { label: "Area", key: "area" },
      { label: "City", key: "city" },
      { label: "Postal Code", key: "postalCode" },
    ],
  },

  {
    value: "tr",
    name: "Turkish",
    flag: "🇹🇷",
    script: "Latin",
    rtl: false,
    dialCode: "+90",
    addressFields: [
      { label: "Street", key: "street" },
      { label: "District", key: "district" },
      { label: "City", key: "city" },
      { label: "Postal Code", key: "postalCode" },
    ],
  },

  {
    value: "vi",
    name: "Vietnamese",
    flag: "🇻🇳",
    script: "Latin",
    rtl: false,
    dialCode: "+84",
    addressFields: [
      { label: "Street", key: "street" },
      { label: "Ward", key: "ward" },
      { label: "District", key: "district" },
      { label: "City", key: "city" },
    ],
  },

  {
    value: "it",
    name: "Italian",
    flag: "🇮🇹",
    script: "Latin",
    rtl: false,
    dialCode: "+39",
    addressFields: [
      { label: "Street", key: "street" },
      { label: "House Number", key: "houseNumber" },
      { label: "City", key: "city" },
      { label: "Postal Code", key: "postalCode" },
    ],
  },

  {
    value: "pl",
    name: "Polish",
    flag: "🇵🇱",
    script: "Latin",
    rtl: false,
    dialCode: "+48",
    addressFields: [
      { label: "Street", key: "street" },
      { label: "City", key: "city" },
      { label: "Postal Code", key: "postalCode" },
    ],
  },

  {
    value: "ro",
    name: "Romanian",
    flag: "🇷🇴",
    script: "Latin",
    rtl: false,
    dialCode: "+40",
    addressFields: [
      { label: "Street", key: "street" },
      { label: "City", key: "city" },
      { label: "County", key: "county" },
      { label: "Postal Code", key: "postalCode" },
    ],
  },

  {
    value: "nl",
    name: "Dutch",
    flag: "🇳🇱",
    script: "Latin",
    rtl: false,
    dialCode: "+31",
    addressFields: [
      { label: "Street", key: "street" },
      { label: "House Number", key: "houseNumber" },
      { label: "City", key: "city" },
      { label: "Postal Code", key: "postalCode" },
    ],
  },

  {
    value: "hu",
    name: "Hungarian",
    flag: "🇭🇺",
    script: "Latin",
    rtl: false,
    dialCode: "+36",
    addressFields: [
      { label: "Street", key: "street" },
      { label: "City", key: "city" },
      { label: "Postal Code", key: "postalCode" },
    ],
  },

  {
    value: "cs",
    name: "Czech",
    flag: "🇨🇿",
    script: "Latin",
    rtl: false,
    dialCode: "+420",
    addressFields: [
      { label: "Street", key: "street" },
      { label: "City", key: "city" },
      { label: "Postal Code", key: "postalCode" },
    ],
  },

  {
    value: "sv",
    name: "Swedish",
    flag: "🇸🇪",
    script: "Latin",
    rtl: false,
    dialCode: "+46",
    addressFields: [
      { label: "Street", key: "street" },
      { label: "City", key: "city" },
      { label: "Postal Code", key: "postalCode" },
    ],
  },
] as const;

// -----------------------------
// Helpers
// -----------------------------

export const SUPPORTED_LANGUAGE_CODES = new Set<LanguageOption["value"]>(
  LANGUAGE_OPTIONS.map((o) => o.value)
);

export function getLanguageOption(
  languageCode: string
): LanguageOption | undefined {
  const normalized = languageCode.toLowerCase();
  return LANGUAGE_OPTIONS.find((o) => o.value === normalized);
}

/**
 * Supports i18n codes like "pt-BR", "en-US"
 */
export function getSupportedLanguageCode(
  languageCode: string
): LanguageOption["value"] | null {
  if (!languageCode) return null;

  const normalized = languageCode.toLowerCase();

  if (SUPPORTED_LANGUAGE_CODES.has(normalized as any)) {
    return normalized as LanguageOption["value"];
  }

  const base = normalized.split("-")[0];

  if (SUPPORTED_LANGUAGE_CODES.has(base as any)) {
    return base as LanguageOption["value"];
  }

  return null;
}




export function getTypography(language: LanguageOption) {
  return SCRIPT_FONT_MAP[language.script] || SCRIPT_FONT_MAP.Other;
}