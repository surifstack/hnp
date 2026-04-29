import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getLanguageOption, getTypography, LANGUAGE_OPTIONS } from "@/config/languages";
import { useEffect } from "react";



export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const currentValue = i18n.resolvedLanguage || i18n.language || "en";
  useEffect(()=>{
  const lang = getLanguageOption(currentValue);
  if (lang) {
    const { fontFamily, fontSize, direction } = getTypography(lang);
          document.documentElement.style.setProperty("--app-font-family", fontFamily);
          document.documentElement.style.setProperty("--app-direction", direction);
          document.documentElement.style.fontFamily = "var(--app-font-family)";
          document.documentElement.style.direction = "var(--app-direction)";
          document.body.style.fontFamily = "var(--app-font-family)";
          document.body.style.direction = "var(--app-direction)";
          document.documentElement.setAttribute("dir", direction);
      };
    },[currentValue]);

  const current =
    LANGUAGE_OPTIONS.find((o) => o.value === currentValue) ??
    LANGUAGE_OPTIONS.find((o) => o.value === "en")!;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-full border-2 border-black bg-white/95 px-3 py-2 text-xs font-extrabold uppercase tracking-widest shadow-xl"
          aria-label="Language"
        >
          <Languages className="h-4 w-4" />
          <span className="text-base leading-none">{current.flag}</span>
          <span>{current.name}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top" className="w-56">
        <DropdownMenuLabel>Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LANGUAGE_OPTIONS.map((o) => (
          <DropdownMenuItem
            key={o.value}
            onSelect={() => {void i18n.changeLanguage(o.value)
              }}
            className={o.value === current.value ? "bg-accent" : undefined}
          >
            <span className="text-base leading-none">{o.flag}</span>
            <span className="font-semibold">{o.name}</span>
            <span className="ml-auto text-xs font-bold uppercase tracking-widest opacity-60">
              {o.value}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
