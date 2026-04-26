// src/config/fontConfig.ts

export type Direction = "ltr" | "rtl";

export interface FontConfigItem {
  fontFamily: string;
  fontSize: string;
  direction: Direction;
  characterLimit: number;
  primaryFont: string;
  fallbackFonts: string[];
  glyphBased?: boolean;
}

export type FontConfigMap = Record<string, FontConfigItem>;

export const SYSTEM_FONT_FALLBACK =
  'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

export const fontConfig: FontConfigMap = {
  default: {
    fontFamily: "'Liberation Sans Narrow', 'Arial', 'Helvetica', sans-serif",
    fontSize: "9px",
    direction: "ltr",
    characterLimit: 23,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // English
  en: {
    fontFamily: "'Liberation Sans Narrow', 'Arial', 'Helvetica', sans-serif",
    fontSize: "9px",
    direction: "ltr",
    characterLimit: 23,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // Mandarin Chinese (10-12 characters, 10-10.5pt)
  zh: {
    fontFamily: "'Liberation Sans Narrow', 'Noto Sans CJK SC', 'Noto Sans CJK', 'PingFang SC', 'Microsoft YaHei', sans-serif",
    fontSize: "10px",
    direction: "ltr",
    characterLimit: 12,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: ["Noto Sans CJK"]
  },
  
  // Hindi (14-16 characters, 9.5-10pt)
  hi: {
    fontFamily: "'Liberation Sans Narrow', 'Noto Sans Devanagari', 'Mangal', 'Nirmala UI', sans-serif",
    fontSize: "9.5px",
    direction: "ltr",
    characterLimit: 16,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // Spanish (22-23 characters, 9pt)
  es: {
    fontFamily: "'Liberation Sans Narrow', 'Arial', 'Helvetica', sans-serif",
    fontSize: "9px",
    direction: "ltr",
    characterLimit: 23,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // French (22-23 characters, 9pt)
  fr: {
    fontFamily: "'Liberation Sans Narrow', 'Arial', 'Helvetica', sans-serif",
    fontSize: "9px",
    direction: "ltr",
    characterLimit: 23,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // Modern Standard Arabic (14-16 characters, RTL, 9.5-10pt)
  ar: {
    fontFamily: "'Liberation Sans Narrow', 'Noto Sans Arabic', 'Amiri', 'Tahoma', sans-serif",
    fontSize: "9.5px",
    direction: "rtl",
    characterLimit: 16,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: ["Noto Sans Arabic", "Amiri"]
  },
  
  // Bengali (14-16 characters, 9.5-10pt)
  bn: {
    fontFamily: "'Liberation Sans Narrow', 'Noto Sans Bengali', 'Nirmala UI', 'Shonar Bangla', sans-serif",
    fontSize: "9.5px",
    direction: "ltr",
    characterLimit: 16,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // Portuguese (22-23 characters, 9pt)
  pt: {
    fontFamily: "'Liberation Sans Narrow', 'Arial', 'Helvetica', sans-serif",
    fontSize: "9px",
    direction: "ltr",
    characterLimit: 23,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // Russian (10pt)
  ru: {
    fontFamily: "'Liberation Sans Narrow', 'Noto Sans Cyrillic', 'Arial', 'Helvetica', sans-serif",
    fontSize: "10px",
    direction: "ltr",
    characterLimit: 20,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // Urdu (14-16 characters, RTL, 9.5-10pt)
  ur: {
    fontFamily: "'Liberation Sans Narrow', 'Noto Sans Arabic', 'Amiri', 'Jameel Noori Nastaleeq', sans-serif",
    fontSize: "9.5px",
    direction: "rtl",
    characterLimit: 16,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: ["Noto Sans Arabic", "Amiri"]
  },
  
  // Indonesian (22-23 characters, 9pt)
  id: {
    fontFamily: "'Liberation Sans Narrow', 'Arial', 'Helvetica', sans-serif",
    fontSize: "9px",
    direction: "ltr",
    characterLimit: 23,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // German (22-23 characters, 9pt)
  de: {
    fontFamily: "'Liberation Sans Narrow', 'Arial', 'Helvetica', sans-serif",
    fontSize: "9px",
    direction: "ltr",
    characterLimit: 23,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // Japanese (10-12 characters, 10-10.5pt)
  ja: {
    fontFamily: "'Liberation Sans Narrow', 'Noto Sans JP', 'Noto Sans CJK JP', 'Hiragino Kaku Gothic Pro', 'Meiryo', sans-serif",
    fontSize: "10px",
    direction: "ltr",
    characterLimit: 12,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: ["Noto Sans CJK"],
    glyphBased: true
  },
  
  // Swahili (22-23 characters, 9pt)
  sw: {
    fontFamily: "'Liberation Sans Narrow', 'Arial', 'Helvetica', sans-serif",
    fontSize: "9px",
    direction: "ltr",
    characterLimit: 23,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // Marathi (10pt)
  mr: {
    fontFamily: "'Liberation Sans Narrow', 'Noto Sans Devanagari', 'Mangal', 'Nirmala UI', sans-serif",
    fontSize: "10px",
    direction: "ltr",
    characterLimit: 16,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // Telugu (10pt)
  te: {
    fontFamily: "'Liberation Sans Narrow', 'Noto Sans Telugu', 'Nirmala UI', 'Gautami', sans-serif",
    fontSize: "10px",
    direction: "ltr",
    characterLimit: 16,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // Turkish (22-23 characters, 9pt)
  tr: {
    fontFamily: "'Liberation Sans Narrow', 'Arial', 'Helvetica', sans-serif",
    fontSize: "9px",
    direction: "ltr",
    characterLimit: 23,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // Tamil (10pt)
  ta: {
    fontFamily: "'Liberation Sans Narrow', 'Noto Sans Tamil', 'Nirmala UI', 'Latha', sans-serif",
    fontSize: "10px",
    direction: "ltr",
    characterLimit: 16,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // Vietnamese (22-23 characters, 9pt)
  vi: {
    fontFamily: "'Liberation Sans Narrow', 'Arial', 'Helvetica', sans-serif",
    fontSize: "9px",
    direction: "ltr",
    characterLimit: 23,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // Korean (12-14 characters, 9.5-10pt)
  ko: {
    fontFamily: "'Liberation Sans Narrow', 'Noto Sans KR', 'Noto Sans CJK KR', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
    fontSize: "9.5px",
    direction: "ltr",
    characterLimit: 14,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // Italian (22-23 characters, 9pt)
  it: {
    fontFamily: "'Liberation Sans Narrow', 'Arial', 'Helvetica', sans-serif",
    fontSize: "9px",
    direction: "ltr",
    characterLimit: 23,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // Thai (12-14 characters, 9.5-10pt)
  th: {
    fontFamily: "'Liberation Sans Narrow', 'Noto Sans Thai', 'Sukhumvit Set', 'Tahoma', sans-serif",
    fontSize: "9.5px",
    direction: "ltr",
    characterLimit: 14,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // Persian/Farsi (10pt)
  fa: {
    fontFamily: "'Liberation Sans Narrow', 'Noto Sans Arabic', 'Amiri', 'IRANSans', sans-serif",
    fontSize: "10px",
    direction: "rtl",
    characterLimit: 16,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // Gujarati (10pt)
  gu: {
    fontFamily: "'Liberation Sans Narrow', 'Noto Sans Gujarati', 'Nirmala UI', 'Shruti', sans-serif",
    fontSize: "10px",
    direction: "ltr",
    characterLimit: 16,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // Kannada (10pt)
  kn: {
    fontFamily: "'Liberation Sans Narrow', 'Noto Sans Kannada', 'Nirmala UI', 'Tunga', sans-serif",
    fontSize: "10px",
    direction: "ltr",
    characterLimit: 16,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // Bhojpuri (10pt)
  bho: {
    fontFamily: "'Liberation Sans Narrow', 'Noto Sans Devanagari', 'Mangal', 'Nirmala UI', sans-serif",
    fontSize: "10px",
    direction: "ltr",
    characterLimit: 16,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // Polish (22-23 characters, 9pt)
  pl: {
    fontFamily: "'Liberation Sans Narrow', 'Arial', 'Helvetica', sans-serif",
    fontSize: "9px",
    direction: "ltr",
    characterLimit: 23,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // Ukrainian (10pt)
  uk: {
    fontFamily: "'Liberation Sans Narrow', 'Noto Sans Cyrillic', 'Arial', 'Helvetica', sans-serif",
    fontSize: "10px",
    direction: "ltr",
    characterLimit: 20,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // Malayalam (10pt)
  ml: {
    fontFamily: "'Liberation Sans Narrow', 'Noto Sans Malayalam', 'Nirmala UI', 'Kartika', sans-serif",
    fontSize: "10px",
    direction: "ltr",
    characterLimit: 16,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // Odia (10pt)
  or: {
    fontFamily: "'Liberation Sans Narrow', 'Noto Sans Oriya', 'Nirmala UI', 'Kalinga', sans-serif",
    fontSize: "10px",
    direction: "ltr",
    characterLimit: 16,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // Maithili (10pt)
  mai: {
    fontFamily: "'Liberation Sans Narrow', 'Noto Sans Devanagari', 'Mangal', 'Nirmala UI', sans-serif",
    fontSize: "10px",
    direction: "ltr",
    characterLimit: 16,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // Burmese (10pt)
  my: {
    fontFamily: "'Liberation Sans Narrow', 'Noto Sans Myanmar', 'Myanmar3', 'Padauk', sans-serif",
    fontSize: "10px",
    direction: "ltr",
    characterLimit: 16,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // Hakka Chinese (10pt)
  hak: {
    fontFamily: "'Liberation Sans Narrow', 'Noto Sans CJK SC', 'Noto Sans CJK', 'PingFang SC', 'Microsoft YaHei', sans-serif",
    fontSize: "10px",
    direction: "ltr",
    characterLimit: 12,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // Hausa (10pt)
  ha: {
    fontFamily: "'Liberation Sans Narrow', 'Arial', 'Helvetica', sans-serif",
    fontSize: "10px",
    direction: "ltr",
    characterLimit: 23,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // Tagalog/Filipino (10pt)
  tl: {
    fontFamily: "'Liberation Sans Narrow', 'Arial', 'Helvetica', sans-serif",
    fontSize: "10px",
    direction: "ltr",
    characterLimit: 23,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // Yoruba (10pt)
  yo: {
    fontFamily: "'Liberation Sans Narrow', 'Arial', 'Helvetica', sans-serif",
    fontSize: "10px",
    direction: "ltr",
    characterLimit: 23,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // Punjabi (10pt)
  pa: {
    fontFamily: "'Liberation Sans Narrow', 'Noto Sans Gurmukhi', 'Nirmala UI', 'Raavi', sans-serif",
    fontSize: "10px",
    direction: "ltr",
    characterLimit: 16,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // Amharic (10pt)
  am: {
    fontFamily: "'Liberation Sans Narrow', 'Noto Sans Ethiopic', 'Nyala', 'Abyssinica SIL', sans-serif",
    fontSize: "10px",
    direction: "ltr",
    characterLimit: 18,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // Javanese (10pt)
  jv: {
    fontFamily: "'Liberation Sans Narrow', 'Arial', 'Helvetica', sans-serif",
    fontSize: "10px",
    direction: "ltr",
    characterLimit: 23,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // Romanian (22-23 characters, 9pt)
  ro: {
    fontFamily: "'Liberation Sans Narrow', 'Arial', 'Helvetica', sans-serif",
    fontSize: "9px",
    direction: "ltr",
    characterLimit: 23,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // Dutch (22-23 characters, 9pt)
  nl: {
    fontFamily: "'Liberation Sans Narrow', 'Arial', 'Helvetica', sans-serif",
    fontSize: "9px",
    direction: "ltr",
    characterLimit: 23,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // Hungarian (22-23 characters, 9pt)
  hu: {
    fontFamily: "'Liberation Sans Narrow', 'Arial', 'Helvetica', sans-serif",
    fontSize: "9px",
    direction: "ltr",
    characterLimit: 23,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // Greek (20-22 characters, 9pt)
  el: {
    fontFamily: "'Liberation Sans Narrow', 'Noto Sans Greek', 'Arial', 'Helvetica', sans-serif",
    fontSize: "9px",
    direction: "ltr",
    characterLimit: 22,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // Czech (22-23 characters, 9pt)
  cs: {
    fontFamily: "'Liberation Sans Narrow', 'Arial', 'Helvetica', sans-serif",
    fontSize: "9px",
    direction: "ltr",
    characterLimit: 23,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // Swedish (22-23 characters, 9pt)
  sv: {
    fontFamily: "'Liberation Sans Narrow', 'Arial', 'Helvetica', sans-serif",
    fontSize: "9px",
    direction: "ltr",
    characterLimit: 23,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // Zulu (10pt)
  zu: {
    fontFamily: "'Liberation Sans Narrow', 'Arial', 'Helvetica', sans-serif",
    fontSize: "10px",
    direction: "ltr",
    characterLimit: 23,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // Somali (10pt)
  so: {
    fontFamily: "'Liberation Sans Narrow', 'Arial', 'Helvetica', sans-serif",
    fontSize: "10px",
    direction: "ltr",
    characterLimit: 23,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // Azerbaijani (10pt)
  az: {
    fontFamily: "'Liberation Sans Narrow', 'Arial', 'Helvetica', sans-serif",
    fontSize: "10px",
    direction: "ltr",
    characterLimit: 23,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // Sinhala (10pt)
  si: {
    fontFamily: "'Liberation Sans Narrow', 'Noto Sans Sinhala', 'Iskoola Pota', 'Nirmala UI', sans-serif",
    fontSize: "10px",
    direction: "ltr",
    characterLimit: 16,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  },
  
  // Hebrew (10pt, RTL)
  he: {
    fontFamily: "'Liberation Sans Narrow', 'Noto Sans Hebrew', 'David', 'Arial', sans-serif",
    fontSize: "10px",
    direction: "rtl",
    characterLimit: 20,
    primaryFont: "Liberation Sans Narrow",
    fallbackFonts: []
  }

};

const stripQuotes = (value: string): string => {
  const trimmed = value.trim();
  return trimmed.replace(/^["']|["']$/g, "");
};

const toQuotedFont = (fontName: string): string => {
  const name = stripQuotes(fontName);
  // Keep generic family keywords unquoted.
  if (["serif", "sans-serif", "monospace", "cursive", "fantasy", "system-ui"].includes(name)) {
    return name;
  }
  return `"${name}"`;
};

export const parseFontFamilyList = (fontFamily: string): string[] => {
  return fontFamily
    .split(",")
    .map((s) => stripQuotes(s))
    .map((s) => s.trim())
    .filter(Boolean);
};

export const buildFontStack = (config: Pick<FontConfigItem, "fontFamily" | "primaryFont" | "fallbackFonts">): string => {
  const fromFontFamily = parseFontFamilyList(config.fontFamily);
  const ordered = [
    ...fromFontFamily,
    config.primaryFont,
    ...(config.fallbackFonts ?? []),
    ...parseFontFamilyList(SYSTEM_FONT_FALLBACK),
  ];

  const seen = new Set<string>();
  const deduped = ordered.filter((f) => {
    const key = f.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return deduped.map(toQuotedFont).join(", ");
};

/**
 * Helper function to get font config for any language
 */
export const getFontConfig = (languageCode: string): FontConfigItem => {
  // Chinese variants
  if (["zh-CN", "zh-SG", "zh"].includes(languageCode)) {
    return fontConfig.zh;
  }

  if (["zh-TW", "zh-HK"].includes(languageCode)) {
    return fontConfig.zh;
  }

  return fontConfig[languageCode] || fontConfig.default;
};

export default fontConfig;
