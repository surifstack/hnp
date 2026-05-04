import { useState } from "react";
import { Mail, PackageSearch, Send } from "lucide-react";

import { SiteLayout } from "@/components/SiteLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "react-i18next";

export function Contact() {
  const [hasOrder, setHasOrder] = useState(false);
  const [message, setMessage] = useState("");

  const { t } = useTranslation();

  return (
    <SiteLayout>
      <div className="mx-auto w-full max-w-2xl space-y-6">

        {/* HEADER */}
        <section className="bg-white rounded-3xl border shadow-xl p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-4 border-[var(--neon-green)]/30 bg-[var(--neon-green)]/10">
            <Mail className="h-8 w-8 text-black" />
          </div>

          <h1 className="text-3xl font-extrabold uppercase tracking-wide">
            {t("contact.title", { defaultValue: "Contact Us" })}
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-gray-500">
            {t("contact.subtitle", {
              defaultValue:
                "Questions, issues, or custom requests? Send us a message and our team will respond shortly.",
            })}
          </p>
        </section>

        {/* FORM */}
        <form
          className="bg-white rounded-3xl border shadow-xl p-6 md:p-8 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          {/* NAME */}
          <div className="space-y-2">
            <Label
              htmlFor="first"
              className="text-xs font-bold uppercase tracking-wide"
            >
              {t("contact.firstName", {
                defaultValue: "First Name",
              })}
            </Label>

            <Input
              id="first"
              required
              className="h-12 rounded-xl border-2 focus-visible:ring-[var(--neon-green)]"
            />
          </div>

          {/* EMAIL */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-xs font-bold uppercase tracking-wide"
            >
              {t("contact.email", {
                defaultValue: "Email Address",
              })}
            </Label>

            <Input
              id="email"
              type="email"
              required
              className="h-12 rounded-xl border-2 focus-visible:ring-[var(--neon-green)]"
            />
          </div>

          {/* EXISTING ORDER */}
          <div className="rounded-2xl border bg-gray-50 p-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id="hasOrder"
                checked={hasOrder}
                onCheckedChange={(v) => setHasOrder(v === true)}
                className="mt-0.5"
              />

              <div className="space-y-1">
                <Label
                  htmlFor="hasOrder"
                  className="font-semibold cursor-pointer"
                >
                  {t("contact.existsOrder", {
                    defaultValue: "This is about an existing order",
                  })}
                </Label>

                <p className="text-xs text-gray-500">
                  {t("contact.existsOrderDesc", {
                    defaultValue:
                      "Enable this if your message relates to a previously placed order.",
                  })}
                </p>
              </div>
            </div>

            {hasOrder && (
              <div className="mt-4 space-y-2">
                <Label
                  htmlFor="orderNum"
                  className="text-xs font-bold uppercase tracking-wide"
                >
                  {t("contact.orderNumber", {
                    defaultValue: "Order Number",
                  })}
                </Label>

                <div className="relative">
                  <PackageSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                  <Input
                    id="orderNum"
                    required
                    placeholder="ORD-10293"
                    className="h-12 rounded-xl border-2 pl-10 focus-visible:ring-[var(--neon-green)]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* MESSAGE */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="msg"
                className="text-xs font-bold uppercase tracking-wide"
              >
                {t("contact.message", {
                  defaultValue: "Message",
                })}
              </Label>

              <span className="text-xs text-gray-400">
                {message.length}/500
              </span>
            </div>

            <Textarea
              id="msg"
              maxLength={500}
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              placeholder={t("contact.messagePlaceholder", {
                defaultValue:
                  "Tell us how we can help you...",
              })}
              className="rounded-2xl border-2 resize-none focus-visible:ring-[var(--neon-green)]"
            />
          </div>

          {/* SUBMIT */}
          <Button
            type="submit"
            size="lg"
            className="w-full h-12 rounded-xl bg-black text-white font-extrabold uppercase tracking-wide transition active:scale-[0.98]"
          >
            <Send className="mr-2 h-4 w-4" />

            {t("contact.sendMessage", {
              defaultValue: "Send Message",
            })}
          </Button>
        </form>
      </div>
    </SiteLayout>
  );
}