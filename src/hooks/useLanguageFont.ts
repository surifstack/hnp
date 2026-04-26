import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { buildFontStack, getFontConfig, type FontConfigItem, parseFontFamilyList } from "@/config/fontConfig";
import { getLanguageOption, getSupportedLanguageCode, type TextDirection } from "@/config/languages";

export interface UseLanguageFontOptions {
  /**
   * When true (default), the hook updates CSS variables on `:root` and sets
   * `html/body` to use those variables. Keeps styling declarative in CSS.
   */
  useCssVariables?: boolean;
  /**
   * When true (default), attempts to detect whether the preferred font is
   * available via `document.fonts.check` and falls back to the primary stack.
   */
  enableFontCheck?: boolean;
}

interface UseLanguageFontReturn {
  getCurrentFont: () => FontConfigItem;
}

const DEFAULT_OPTIONS: Required<UseLanguageFontOptions> = {
  useCssVariables: true,
  enableFontCheck: true,
};

const isFontAvailable = (fontFamilyName: string): boolean => {
  if (typeof document === "undefined") return true;
  if (!document.fonts?.check) return true;
  const family = fontFamilyName.trim();
  if (!family) return true;
  // Use a fully-qualified font shorthand to avoid "always true" results.
  return document.fonts.check(`12px "${family}"`);
};

const pickEffectiveFontFamily = (
  config: FontConfigItem,
  enableFontCheck: boolean,
): string => {
  const desiredStack = buildFontStack(config);
  if (!enableFontCheck) return desiredStack;

  const preferredFirst =
    parseFontFamilyList(config.fontFamily)[0] || config.primaryFont;

  if (!preferredFirst) return desiredStack;
  if (isFontAvailable(preferredFirst)) return desiredStack;

  // Preferred stack isn't available; start with the primary font and keep the same fallbacks.
  return buildFontStack({
    fontFamily: config.primaryFont,
    primaryFont: config.primaryFont,
    fallbackFonts: config.fallbackFonts,
  });
};

export function useLanguageFont(options?: UseLanguageFontOptions): UseLanguageFontReturn {
  const { i18n } = useTranslation();
  const mergedOptions = useMemo(
    () => ({ ...DEFAULT_OPTIONS, ...(options ?? {}) }),
    [options],
  );

  useEffect(() => {
    if (typeof document === "undefined") return;

    const applyFont = (languageCode?: string): void => {
      const rawLang = languageCode ?? i18n.resolvedLanguage ?? i18n.language ?? "en";
      const supportedLang = getSupportedLanguageCode(rawLang);
      const normalizedLang = supportedLang ?? rawLang.split("-")[0] ?? rawLang;

      const option = supportedLang ? getLanguageOption(supportedLang) : undefined;
      const config = getFontConfig(normalizedLang);

      const direction: TextDirection = option?.rtl ? "rtl" : config.direction;
      const fontFamily = pickEffectiveFontFamily(config, mergedOptions.enableFontCheck);
      console.log(fontFamily , 'fontFamily');

      if (mergedOptions.useCssVariables) {
        document.documentElement.style.setProperty("--app-font-family", fontFamily);
        // Keeping the variable for now, but intentionally not applying it.
        // The client reported issues when fontSize is changed at runtime.
        // document.documentElement.style.setProperty("--app-font-size", config.fontSize);
        document.documentElement.style.setProperty("--app-direction", direction);

        document.documentElement.style.fontFamily = "var(--app-font-family)";
        // document.documentElement.style.fontSize = "var(--app-font-size)";
        document.documentElement.style.direction = "var(--app-direction)";

        document.body.style.fontFamily = "var(--app-font-family)";
        // document.body.style.fontSize = "var(--app-font-size)";
        document.body.style.direction = "var(--app-direction)";
      } else {
        document.documentElement.style.fontFamily = fontFamily;
        // document.documentElement.style.fontSize = config.fontSize;
        document.documentElement.style.direction = direction;

        document.body.style.fontFamily = fontFamily;
        // document.body.style.fontSize = config.fontSize;
        document.body.style.direction = direction;
      }

      document.documentElement.setAttribute("dir", direction);
      document.documentElement.setAttribute("data-language", supportedLang ?? normalizedLang);
      document.documentElement.lang = supportedLang ?? normalizedLang;
    };

    applyFont();

    i18n.on("languageChanged", applyFont as (lng: string) => void);

    return () => {
      i18n.off("languageChanged", applyFont as (lng: string) => void);
    };
  }, [i18n, mergedOptions.enableFontCheck, mergedOptions.useCssVariables]);

  const getCurrentFont = (): FontConfigItem => {
    const rawLang = i18n.resolvedLanguage ?? i18n.language ?? "en";
    const supportedLang = getSupportedLanguageCode(rawLang);
    const normalizedLang = supportedLang ?? rawLang.split("-")[0] ?? rawLang;
    return getFontConfig(normalizedLang);
  };

  return { getCurrentFont };
}

export default useLanguageFont;
