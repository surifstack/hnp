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

// Renamed for clarity - it now represents a full address format
export interface AddressFormat {
  fields: AddressField[];
  formatTemplate?: string; // Optional: e.g., "{{street}}\n{{city}}, {{state}} {{zipCode}}"
}

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
  // addressFields removed from here
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

// Client-provided languages only (address fields removed)
export const LANGUAGE_OPTIONS: readonly LanguageOption[] = [
  {
    value: "en",
    name: "English",
    flag: "🇺🇸",
    script: "Latin",
    rtl: false,
    dialCode: "+1",
  },
  {
    value: "es",
    name: "Spanish",
    flag: "🇪🇸",
    script: "Latin",
    rtl: false,
    dialCode: "+34",
  },
  {
    value: "fr",
    name: "French",
    flag: "🇫🇷",
    script: "Latin",
    rtl: false,
    dialCode: "+33",
  },
  {
    value: "pt",
    name: "Portuguese",
    flag: "🇵🇹",
    script: "Latin",
    rtl: false,
    dialCode: "+351",
  },
  {
    value: "id",
    name: "Indonesian",
    flag: "🇮🇩",
    script: "Latin",
    rtl: false,
    dialCode: "+62",
  },
  {
    value: "de",
    name: "German",
    flag: "🇩🇪",
    script: "Latin",
    rtl: false,
    dialCode: "+49",
  },
  {
    value: "sw",
    name: "Swahili",
    flag: "🇰🇪",
    script: "Latin",
    rtl: false,
    dialCode: "+254",
  },
  {
    value: "tr",
    name: "Turkish",
    flag: "🇹🇷",
    script: "Latin",
    rtl: false,
    dialCode: "+90",
  },
  {
    value: "vi",
    name: "Vietnamese",
    flag: "🇻🇳",
    script: "Latin",
    rtl: false,
    dialCode: "+84",
  },
  {
    value: "it",
    name: "Italian",
    flag: "🇮🇹",
    script: "Latin",
    rtl: false,
    dialCode: "+39",
  },
  {
    value: "pl",
    name: "Polish",
    flag: "🇵🇱",
    script: "Latin",
    rtl: false,
    dialCode: "+48",
  },
  {
    value: "ro",
    name: "Romanian",
    flag: "🇷🇴",
    script: "Latin",
    rtl: false,
    dialCode: "+40",
  },
  {
    value: "nl",
    name: "Dutch",
    flag: "🇳🇱",
    script: "Latin",
    rtl: false,
    dialCode: "+31",
  },
  {
    value: "hu",
    name: "Hungarian",
    flag: "🇭🇺",
    script: "Latin",
    rtl: false,
    dialCode: "+36",
  },
  {
    value: "cs",
    name: "Czech",
    flag: "🇨🇿",
    script: "Latin",
    rtl: false,
    dialCode: "+420",
  },
  {
    value: "sv",
    name: "Swedish",
    flag: "🇸🇪",
    script: "Latin",
    rtl: false,
    dialCode: "+46",
  },
] as const;

// -----------------------------
// Address Formats by Country
// -----------------------------

export const COUNTRY_ADDRESS_FORMATS: Record<string, AddressFormat> = {
  // United States / Canada / UK / Australia / NZ (similar format)
  US: {
    fields: [
      { label: "Street", key: "street" },
      { label: "City", key: "city" },
      { label: "State", key: "state" },
      { label: "ZIP Code", key: "zipCode" },
    ],
  },
  CA: {
    fields: [
      { label: "Street", key: "street" },
      { label: "City", key: "city" },
      { label: "Province", key: "province" },
      { label: "Postal Code", key: "postalCode" },
    ],
  },
  GB: {
    fields: [
      { label: "Street", key: "street" },
      { label: "City", key: "city" },
      { label: "County", key: "county" },
      { label: "Postal Code", key: "postalCode" },
    ],
  },
  AU: {
    fields: [
      { label: "Street", key: "street" },
      { label: "Suburb", key: "suburb" },
      { label: "State", key: "state" },
      { label: "Postal Code", key: "postalCode" },
    ],
  },
  NZ: {
    fields: [
      { label: "Street", key: "street" },
      { label: "City", key: "city" },
      { label: "Postal Code", key: "postalCode" },
    ],
  },

  // Spain / Mexico / most Latin American countries
  ES: {
    fields: [
      { label: "Street", key: "street" },
      { label: "City", key: "city" },
      { label: "Province", key: "province" },
      { label: "Postal Code", key: "postalCode" },
    ],
  },
  MX: {
    fields: [
      { label: "Street", key: "street" },
      { label: "City", key: "city" },
      { label: "State", key: "state" },
      { label: "Postal Code", key: "postalCode" },
    ],
  },
  AR: {
    fields: [
      { label: "Street", key: "street" },
      { label: "City", key: "city" },
      { label: "Province", key: "province" },
      { label: "Postal Code", key: "postalCode" },
    ],
  },

  // France / Belgium / Switzerland (French style)
  FR: {
    fields: [
      { label: "Street", key: "street" },
      { label: "Postal Code", key: "postalCode" },
      { label: "City", key: "city" },
    ],
  },
  BE: {
    fields: [
      { label: "Street", key: "street" },
      { label: "Postal Code", key: "postalCode" },
      { label: "City", key: "city" },
    ],
  },

  // Germany / Austria / Netherlands / Poland / Czech / Hungary / Sweden
  DE: {
    fields: [
      { label: "Street", key: "street" },
      { label: "House Number", key: "houseNumber" },
      { label: "Postal Code", key: "postalCode" },
      { label: "City", key: "city" },
    ],
  },
  AT: {
    fields: [
      { label: "Street", key: "street" },
      { label: "House Number", key: "houseNumber" },
      { label: "Postal Code", key: "postalCode" },
      { label: "City", key: "city" },
    ],
  },
  NL: {
    fields: [
      { label: "Street", key: "street" },
      { label: "House Number", key: "houseNumber" },
      { label: "City", key: "city" },
      { label: "Postal Code", key: "postalCode" },
    ],
  },
  PL: {
    fields: [
      { label: "Street", key: "street" },
      { label: "City", key: "city" },
      { label: "Postal Code", key: "postalCode" },
    ],
  },
  CZ: {
    fields: [
      { label: "Street", key: "street" },
      { label: "City", key: "city" },
      { label: "Postal Code", key: "postalCode" },
    ],
  },
  HU: {
    fields: [
      { label: "Street", key: "street" },
      { label: "City", key: "city" },
      { label: "Postal Code", key: "postalCode" },
    ],
  },
  SE: {
    fields: [
      { label: "Street", key: "street" },
      { label: "City", key: "city" },
      { label: "Postal Code", key: "postalCode" },
    ],
  },
  NO: {
    fields: [
      { label: "Street", key: "street" },
      { label: "City", key: "city" },
      { label: "Postal Code", key: "postalCode" },
    ],
  },
  DK: {
    fields: [
      { label: "Street", key: "street" },
      { label: "City", key: "city" },
      { label: "Postal Code", key: "postalCode" },
    ],
  },

  // Portugal / Brazil
  PT: {
    fields: [
      { label: "Street", key: "street" },
      { label: "Number", key: "number" },
      { label: "City", key: "city" },
      { label: "Postal Code", key: "postalCode" },
    ],
  },
  BR: {
    fields: [
      { label: "Street", key: "street" },
      { label: "Number", key: "number" },
      { label: "Neighborhood", key: "neighborhood" },
      { label: "City", key: "city" },
      { label: "State", key: "state" },
      { label: "Postal Code", key: "postalCode" },
    ],
  },

  // Italy
  IT: {
    fields: [
      { label: "Street", key: "street" },
      { label: "House Number", key: "houseNumber" },
      { label: "City", key: "city" },
      { label: "Province", key: "province" },
      { label: "Postal Code", key: "postalCode" },
    ],
  },

  // Indonesia
  ID: {
    fields: [
      { label: "Street", key: "street" },
      { label: "Village", key: "village" },
      { label: "City", key: "city" },
      { label: "Province", key: "province" },
      { label: "Postal Code", key: "postalCode" },
    ],
  },

  // Vietnam
  VN: {
    fields: [
      { label: "Street", key: "street" },
      { label: "Ward", key: "ward" },
      { label: "District", key: "district" },
      { label: "City", key: "city" },
    ],
  },

  // Turkey
  TR: {
    fields: [
      { label: "Street", key: "street" },
      { label: "District", key: "district" },
      { label: "City", key: "city" },
      { label: "Postal Code", key: "postalCode" },
    ],
  },

  // India (multiple languages, distinct format)
  IN: {
    fields: [
      { label: "Street", key: "street" },
      { label: "Area", key: "area" },
      { label: "City", key: "city" },
      { label: "State", key: "state" },
      { label: "PIN Code", key: "pinCode" },
    ],
  },

  // Kenya (Swahili/English)
  KE: {
    fields: [
      { label: "Street", key: "street" },
      { label: "Area", key: "area" },
      { label: "City", key: "city" },
      { label: "Postal Code", key: "postalCode" },
    ],
  },

  // Japan
  JP: {
    fields: [
      { label: "Postal Code", key: "postalCode" },
      { label: "Prefecture", key: "prefecture" },
      { label: "City", key: "city" },
      { label: "Street", key: "street" },
      { label: "Building/Apartment", key: "building" },
    ],
  },

  // South Korea
  KR: {
    fields: [
      { label: "Postal Code", key: "postalCode" },
      { label: "Province", key: "province" },
      { label: "City", key: "city" },
      { label: "Street", key: "street" },
      { label: "Building", key: "building" },
    ],
  },

  // China
  CN: {
    fields: [
      { label: "Postal Code", key: "postalCode" },
      { label: "Province", key: "province" },
      { label: "City", key: "city" },
      { label: "District", key: "district" },
      { label: "Street", key: "street" },
    ],
  },

  // Thailand
  TH: {
    fields: [
      { label: "Street", key: "street" },
      { label: "District", key: "district" },
      { label: "City", key: "city" },
      { label: "Province", key: "province" },
      { label: "Postal Code", key: "postalCode" },
    ],
  },

  // Russia
  RU: {
    fields: [
      { label: "Postal Code", key: "postalCode" },
      { label: "Country", key: "country" },
      { label: "Region", key: "region" },
      { label: "City", key: "city" },
      { label: "Street", key: "street" },
      { label: "House", key: "house" },
    ],
  },

  // Middle East (UAE, Saudi, Qatar, Kuwait, etc.) - similar format
  AE: {
    fields: [
      { label: "Street", key: "street" },
      { label: "City", key: "city" },
      { label: "Emirate", key: "emirate" },
      { label: "Postal Code", key: "postalCode" },
    ],
  },
  SA: {
    fields: [
      { label: "Street", key: "street" },
      { label: "City", key: "city" },
      { label: "Postal Code", key: "postalCode" },
    ],
  },
  QA: {
    fields: [
      { label: "Street", key: "street" },
      { label: "City", key: "city" },
      { label: "Postal Code", key: "postalCode" },
    ],
  },
  KW: {
    fields: [
      { label: "Street", key: "street" },
      { label: "City", key: "city" },
      { label: "Block", key: "block" },
      { label: "Postal Code", key: "postalCode" },
    ],
  },

  // Nigeria
  NG: {
    fields: [
      { label: "Street", key: "street" },
      { label: "City", key: "city" },
      { label: "State", key: "state" },
      { label: "Postal Code", key: "postalCode" },
    ],
  },

  // Philippines
  PH: {
    fields: [
      { label: "Street", key: "street" },
      { label: "City", key: "city" },
      { label: "Province", key: "province" },
      { label: "Postal Code", key: "postalCode" },
    ],
  },

  // Greece
  GR: {
    fields: [
      { label: "Street", key: "street" },
      { label: "City", key: "city" },
      { label: "Postal Code", key: "postalCode" },
    ],
  },

  // Romania
  RO: {
    fields: [
      { label: "Street", key: "street" },
      { label: "City", key: "city" },
      { label: "County", key: "county" },
      { label: "Postal Code", key: "postalCode" },
    ],
  },

  // Switzerland (varies by language region, using flexible format)
  CH: {
    fields: [
      { label: "Street", key: "street" },
      { label: "House Number", key: "houseNumber" },
      { label: "Postal Code", key: "postalCode" },
      { label: "City", key: "city" },
    ],
  },
};

// Helper to get address format by country code
export function getAddressFormat(countryCode: string): AddressFormat {
  const format = COUNTRY_ADDRESS_FORMATS[countryCode.toUpperCase()];
  if (!format) {
    // Fallback to a generic format if country not found
    return {
      fields: [
        { label: "Street", key: "street" },
        { label: "City", key: "city" },
        { label: "Postal Code", key: "postalCode" },
      ],
    };
  }
  return format;
}

export interface CountryOption {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
  languages: LanguageOption["value"][];
  addressFormat: AddressFormat; // Added address format to country
}

export const COUNTRY_OPTIONS: readonly CountryOption[] = [
  {
    code: "AF",
    name: "Afghanistan",
    flag: "🇦🇫",
    dialCode: "+93",
    languages: ["ar"],
    addressFormat: getAddressFormat("AF"),
  },
  {
    code: "AL",
    name: "Albania",
    flag: "🇦🇱",
    dialCode: "+355",
    languages: ["en"],
    addressFormat: getAddressFormat("AL"),
  },
  {
    code: "DZ",
    name: "Algeria",
    flag: "🇩🇿",
    dialCode: "+213",
    languages: ["ar", "fr"],
    addressFormat: getAddressFormat("DZ"),
  },
  {
    code: "AR",
    name: "Argentina",
    flag: "🇦🇷",
    dialCode: "+54",
    languages: ["es"],
    addressFormat: getAddressFormat("AR"),
  },
  {
    code: "AU",
    name: "Australia",
    flag: "🇦🇺",
    dialCode: "+61",
    languages: ["en"],
    addressFormat: getAddressFormat("AU"),
  },
  {
    code: "AT",
    name: "Austria",
    flag: "🇦🇹",
    dialCode: "+43",
    languages: ["de"],
    addressFormat: getAddressFormat("AT"),
  },
  {
    code: "BD",
    name: "Bangladesh",
    flag: "🇧🇩",
    dialCode: "+880",
    languages: ["bn", "en"],
    addressFormat: getAddressFormat("BD"),
  },
  {
    code: "BE",
    name: "Belgium",
    flag: "🇧🇪",
    dialCode: "+32",
    languages: ["fr", "de", "en"],
    addressFormat: getAddressFormat("BE"),
  },
  {
    code: "BR",
    name: "Brazil",
    flag: "🇧🇷",
    dialCode: "+55",
    languages: ["pt"],
    addressFormat: getAddressFormat("BR"),
  },
  {
    code: "CA",
    name: "Canada",
    flag: "🇨🇦",
    dialCode: "+1",
    languages: ["en", "fr"],
    addressFormat: getAddressFormat("CA"),
  },
  {
    code: "CN",
    name: "China",
    flag: "🇨🇳",
    dialCode: "+86",
    languages: ["zh"],
    addressFormat: getAddressFormat("CN"),
  },
  {
    code: "DK",
    name: "Denmark",
    flag: "🇩🇰",
    dialCode: "+45",
    languages: ["en"],
    addressFormat: getAddressFormat("DK"),
  },
  {
    code: "EG",
    name: "Egypt",
    flag: "🇪🇬",
    dialCode: "+20",
    languages: ["ar"],
    addressFormat: getAddressFormat("EG"),
  },
  {
    code: "FR",
    name: "France",
    flag: "🇫🇷",
    dialCode: "+33",
    languages: ["fr"],
    addressFormat: getAddressFormat("FR"),
  },
  {
    code: "DE",
    name: "Germany",
    flag: "🇩🇪",
    dialCode: "+49",
    languages: ["de"],
    addressFormat: getAddressFormat("DE"),
  },
  {
    code: "GR",
    name: "Greece",
    flag: "🇬🇷",
    dialCode: "+30",
    languages: ["el"],
    addressFormat: getAddressFormat("GR"),
  },
  {
    code: "IN",
    name: "India",
    flag: "🇮🇳",
    dialCode: "+91",
    languages: ["en", "hi", "ta", "te", "gu", "kn", "ml", "pa"],
    addressFormat: getAddressFormat("IN"),
  },
  {
    code: "ID",
    name: "Indonesia",
    flag: "🇮🇩",
    dialCode: "+62",
    languages: ["en"],
    addressFormat: getAddressFormat("ID"),
  },
  {
    code: "IR",
    name: "Iran",
    flag: "🇮🇷",
    dialCode: "+98",
    languages: ["ar"],
    addressFormat: getAddressFormat("IR"),
  },
  {
    code: "IQ",
    name: "Iraq",
    flag: "🇮🇶",
    dialCode: "+964",
    languages: ["ar"],
    addressFormat: getAddressFormat("IQ"),
  },
  {
    code: "IE",
    name: "Ireland",
    flag: "🇮🇪",
    dialCode: "+353",
    languages: ["en"],
    addressFormat: getAddressFormat("IE"),
  },
  {
    code: "IT",
    name: "Italy",
    flag: "🇮🇹",
    dialCode: "+39",
    languages: ["it"],
    addressFormat: getAddressFormat("IT"),
  },
  {
    code: "JP",
    name: "Japan",
    flag: "🇯🇵",
    dialCode: "+81",
    languages: ["ja"],
    addressFormat: getAddressFormat("JP"),
  },
  {
    code: "KE",
    name: "Kenya",
    flag: "🇰🇪",
    dialCode: "+254",
    languages: ["sw", "en"],
    addressFormat: getAddressFormat("KE"),
  },
  {
    code: "KW",
    name: "Kuwait",
    flag: "🇰🇼",
    dialCode: "+965",
    languages: ["ar"],
    addressFormat: getAddressFormat("KW"),
  },
  {
    code: "MY",
    name: "Malaysia",
    flag: "🇲🇾",
    dialCode: "+60",
    languages: ["en"],
    addressFormat: getAddressFormat("MY"),
  },
  {
    code: "MX",
    name: "Mexico",
    flag: "🇲🇽",
    dialCode: "+52",
    languages: ["es"],
    addressFormat: getAddressFormat("MX"),
  },
  {
    code: "NL",
    name: "Netherlands",
    flag: "🇳🇱",
    dialCode: "+31",
    languages: ["nl"],
    addressFormat: getAddressFormat("NL"),
  },
  {
    code: "NZ",
    name: "New Zealand",
    flag: "🇳🇿",
    dialCode: "+64",
    languages: ["en"],
    addressFormat: getAddressFormat("NZ"),
  },
  {
    code: "NG",
    name: "Nigeria",
    flag: "🇳🇬",
    dialCode: "+234",
    languages: ["en"],
    addressFormat: getAddressFormat("NG"),
  },
  {
    code: "NO",
    name: "Norway",
    flag: "🇳🇴",
    dialCode: "+47",
    languages: ["en"],
    addressFormat: getAddressFormat("NO"),
  },
  {
    code: "PK",
    name: "Pakistan",
    flag: "🇵🇰",
    dialCode: "+92",
    languages: ["en", "ar"],
    addressFormat: getAddressFormat("PK"),
  },
  {
    code: "PH",
    name: "Philippines",
    flag: "🇵🇭",
    dialCode: "+63",
    languages: ["en"],
    addressFormat: getAddressFormat("PH"),
  },
  {
    code: "PL",
    name: "Poland",
    flag: "🇵🇱",
    dialCode: "+48",
    languages: ["pl"],
    addressFormat: getAddressFormat("PL"),
  },
  {
    code: "PT",
    name: "Portugal",
    flag: "🇵🇹",
    dialCode: "+351",
    languages: ["pt"],
    addressFormat: getAddressFormat("PT"),
  },
  {
    code: "QA",
    name: "Qatar",
    flag: "🇶🇦",
    dialCode: "+974",
    languages: ["ar"],
    addressFormat: getAddressFormat("QA"),
  },
  {
    code: "RO",
    name: "Romania",
    flag: "🇷🇴",
    dialCode: "+40",
    languages: ["ro"],
    addressFormat: getAddressFormat("RO"),
  },
  {
    code: "RU",
    name: "Russia",
    flag: "🇷🇺",
    dialCode: "+7",
    languages: ["ru"],
    addressFormat: getAddressFormat("RU"),
  },
  {
    code: "SA",
    name: "Saudi Arabia",
    flag: "🇸🇦",
    dialCode: "+966",
    languages: ["ar"],
    addressFormat: getAddressFormat("SA"),
  },
  {
    code: "SG",
    name: "Singapore",
    flag: "🇸🇬",
    dialCode: "+65",
    languages: ["en", "zh"],
    addressFormat: getAddressFormat("SG"),
  },
  {
    code: "ZA",
    name: "South Africa",
    flag: "🇿🇦",
    dialCode: "+27",
    languages: ["en"],
    addressFormat: getAddressFormat("ZA"),
  },
  {
    code: "KR",
    name: "South Korea",
    flag: "🇰🇷",
    dialCode: "+82",
    languages: ["ko"],
    addressFormat: getAddressFormat("KR"),
  },
  {
    code: "ES",
    name: "Spain",
    flag: "🇪🇸",
    dialCode: "+34",
    languages: ["es"],
    addressFormat: getAddressFormat("ES"),
  },
  {
    code: "SE",
    name: "Sweden",
    flag: "🇸🇪",
    dialCode: "+46",
    languages: ["sv"],
    addressFormat: getAddressFormat("SE"),
  },
  {
    code: "CH",
    name: "Switzerland",
    flag: "🇨🇭",
    dialCode: "+41",
    languages: ["fr", "de", "it"],
    addressFormat: getAddressFormat("CH"),
  },
  {
    code: "TH",
    name: "Thailand",
    flag: "🇹🇭",
    dialCode: "+66",
    languages: ["th"],
    addressFormat: getAddressFormat("TH"),
  },
  {
    code: "TR",
    name: "Turkey",
    flag: "🇹🇷",
    dialCode: "+90",
    languages: ["tr"],
    addressFormat: getAddressFormat("TR"),
  },
  {
    code: "AE",
    name: "United Arab Emirates",
    flag: "🇦🇪",
    dialCode: "+971",
    languages: ["ar", "en"],
    addressFormat: getAddressFormat("AE"),
  },
  {
    code: "GB",
    name: "United Kingdom",
    flag: "🇬🇧",
    dialCode: "+44",
    languages: ["en"],
    addressFormat: getAddressFormat("GB"),
  },
  {
    code: "US",
    name: "United States",
    flag: "🇺🇸",
    dialCode: "+1",
    languages: ["en", "es"],
    addressFormat: getAddressFormat("US"),
  },
  {
    code: "VN",
    name: "Vietnam",
    flag: "🇻🇳",
    dialCode: "+84",
    languages: ["vi"],
    addressFormat: getAddressFormat("VN"),
  },
] as const;

/* =========================================================
   HELPERS
========================================================= */

export function getCountryOption(countryCode: string): CountryOption | undefined {
  return COUNTRY_OPTIONS.find((c) => c.code.toLowerCase() === countryCode.toLowerCase());
}

export const SUPPORTED_LANGUAGE_CODES = new Set<LanguageOption["value"]>(
  LANGUAGE_OPTIONS.map((o) => o.value)
);

export function getLanguageOption(languageCode: string): LanguageOption | undefined {
  const normalized = languageCode.toLowerCase();
  return LANGUAGE_OPTIONS.find((o) => o.value === normalized);
}

/**
 * Supports i18n codes like "pt-BR", "en-US"
 */
export function getSupportedLanguageCode(languageCode: string): LanguageOption["value"] | null {
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

// New helper to get address fields for a country
export function getAddressFieldsForCountry(countryCode: string): AddressField[] {
  const country = getCountryOption(countryCode);
  if (country && country.addressFormat) {
    return country.addressFormat.fields;
  }
  // Fallback to a default format
  return [
    { label: "Street", key: "street" },
    { label: "City", key: "city" },
    { label: "Postal Code", key: "postalCode" },
  ];
}