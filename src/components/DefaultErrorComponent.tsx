import { useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

export function DefaultErrorComponent({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-3xl border shadow-2xl p-8 text-center">

        {/* ICON */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-4 border-red-100 bg-red-50">
          <AlertTriangle className="h-10 w-10 text-red-500" />
        </div>

        {/* TITLE */}
        <h1 className="text-3xl font-extrabold uppercase tracking-wide text-black">
          {t("defaultError.somethingWentWrong", {
            defaultValue: "Something went wrong",
          })}
        </h1>

        {/* SUBTITLE */}
        <p className="mt-3 text-sm leading-relaxed text-gray-500">
          {t("defaultError.anErrorOccurred", {
            defaultValue:
              "An unexpected error occurred. Please try again.",
          })}
        </p>

        {/* DEV ERROR */}
        {import.meta.env.DEV && error.message && (
          <pre className="mt-6 max-h-48 overflow-auto rounded-2xl border bg-black p-4 text-left text-xs text-red-400">
            {error.message}
          </pre>
        )}

        {/* ACTIONS */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">

          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-bold uppercase tracking-wide text-white transition active:scale-95 hover:opacity-90"
          >
            <RefreshCcw className="h-4 w-4" />
            {t("defaultError.tryAgain", {
              defaultValue: "Try Again",
            })}
          </button>

          <a
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border bg-white px-5 py-3 text-sm font-bold uppercase tracking-wide text-black transition hover:bg-gray-50"
          >
            <Home className="h-4 w-4" />
            {t("defaultError.goHome", {
              defaultValue: "Go Home",
            })}
          </a>
        </div>
      </div>
    </div>
  );
}