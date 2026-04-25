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

const LANGUAGE_OPTIONS: Array<{
  value: string;
  name: string;
  flag: string;
}> = [
  { value: "en", name: "English", flag: "🇺🇸" },
  { value: "es", name: "Spanish", flag: "🇪🇸" },
  { value: "fr", name: "French", flag: "🇫🇷" },
  { value: "pt", name: "Portuguese", flag: "🇵🇹" },
  { value: "id", name: "Indonesian", flag: "🇮🇩" },
  { value: "de", name: "German", flag: "🇩🇪" },
  { value: "sw", name: "Swahili", flag: "🇰🇪" },
  { value: "tr", name: "Turkish", flag: "🇹🇷" },
  { value: "vi", name: "Vietnamese", flag: "🇻🇳" },
  { value: "it", name: "Italian", flag: "🇮🇹" },
  { value: "pl", name: "Polish", flag: "🇵🇱" },
  { value: "ro", name: "Romanian", flag: "🇷🇴" },
  { value: "nl", name: "Dutch", flag: "🇳🇱" },
  { value: "hu", name: "Hungarian", flag: "🇭🇺" },
  { value: "cs", name: "Czech", flag: "🇨🇿" },
  { value: "sv", name: "Swedish", flag: "🇸🇪" },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const currentValue = i18n.resolvedLanguage || i18n.language || "en";
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
            onSelect={() => void i18n.changeLanguage(o.value)}
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
