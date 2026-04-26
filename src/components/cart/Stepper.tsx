import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Step } from "./types";

export function Stepper({
  current,
  verified,
}: {
  current: Step;
  verified: boolean;
}) {
  const { t } = useTranslation();

  const steps = [
    { n: 1, label: t("checkout.steps.details") },
    { n: 2, label: t("checkout.steps.verify") },
    { n: 3, label: t("checkout.steps.address") },
    { n: 4, label: t("checkout.steps.pay") },
  ] as const;

  const isDone = (n: number) => {
    if (n < current) return true;
    if (n === 2 && verified && current > 2) return true;
    return false;
  };

  return (
    <div className="flex items-center justify-between bg-white/90 rounded-full px-3 py-2 border-2 border-black shadow">
      {steps.map((s, i) => {
        const done = isDone(s.n);
        const active = s.n === current;

        return (
          <div key={s.n} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-0.5">
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                  done
                    ? "bg-black text-white border-black"
                    : active
                    ? "bg-[color:var(--neon-green)] text-black border-black"
                    : "bg-white text-black/50 border-black/30"
                }`}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : s.n}
              </div>

              <span className="text-[9px] uppercase font-bold tracking-wide">
                {s.label}
              </span>
            </div>

            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1 ${
                  s.n < current ? "bg-black" : "bg-black/20"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}