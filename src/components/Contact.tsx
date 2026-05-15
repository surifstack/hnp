import { useState } from "react";
import {
  Mail,
  PackageSearch,
  Send,
} from "lucide-react";

import { SiteLayout } from "@/components/SiteLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { apiJson } from "@/lib/api";

/* ---------------------------------- */
/* TYPES                              */
/* ---------------------------------- */

interface ContactResponse {
  _id: string;
  firstName: string;
  email: string;
  message: string;
  orderId?: string | null;
}

/* ---------------------------------- */
/* FULL SCREEN LOADER                 */
/* ---------------------------------- */

function ContactLoadingOverlay() {
  return (
    <div
      className="
        fixed inset-0 z-[9999]
        flex flex-col items-center justify-center
        bg-black/60
        backdrop-blur-md
      "
    >
      {/* Spinner */}
      <div className="relative flex items-center justify-center">

        {/* Glow */}
        <div className="absolute h-28 w-28 rounded-full bg-[var(--neon-green)] opacity-20 blur-3xl" />

        {/* Spinner */}
        <div
          className="
            h-20 w-20
            animate-spin
            rounded-full
            border-[6px]
            border-white/10
            border-t-[var(--neon-green)]
          "
        />
      </div>

      {/* Text */}
      <div className="mt-8 text-center">
        <h2 className="text-xl font-bold text-white">
          Sending Message...
        </h2>

        <p className="mt-2 text-sm text-white/70">
          Please wait while we contact support
        </p>
      </div>
    </div>
  );
}

/* ---------------------------------- */
/* CONTACT PAGE                       */
/* ---------------------------------- */

export function Contact() {
  const { t } = useTranslation();

  /* LOADING */
  const [loading, setLoading] =
    useState(false);

  /* FORM */
  const [form, setForm] = useState({
    firstName: "",
    lastName:"",
    email: "",
    hasOrder: false,
    orderId: "",
    message: "",
  });

  /* HANDLE CHANGE */
  const handleChange = (
    key: keyof typeof form,
    value: string | boolean
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /* SUBMIT */
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (loading) return;

    /* VALIDATION */
    if (
      form.hasOrder &&
      !/^[a-f\d]{24}$/i.test(
        form.orderId
      )
    ) {
      toast.warning(
        "Please enter a valid Order ID"
      );

      return;
    }

    try {
      setLoading(true);

      const payload = {
        firstName:
              form.firstName.trim(),
        lastName:
              form.lastName.trim(),
        email:
          form.email.trim(),

        message:
          form.message.trim(),

        orderId: form.hasOrder
          ? form.orderId.trim()
          : null,
      };

      const response =
        await apiJson<ContactResponse>(
          "/contact",
          {
            method: "POST",

            body: JSON.stringify(
              payload
            ),
          }
        );


      toast.success(
        "Message sent successfully"
      );

      /* RESET */
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        hasOrder: false,
        orderId: "",
        message: "",
      });

    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteLayout>

      {/* FULL SCREEN LOADER */}
      {loading && (
        <ContactLoadingOverlay />
      )}

      <div className="mx-auto w-full max-w-2xl space-y-6">

        {/* HEADER */}
        <section className="rounded-3xl border bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-4 border-[var(--neon-green)]/30 bg-[var(--neon-green)]/10">
            <Mail className="h-8 w-8 text-black" />
          </div>

          <h1 className="text-3xl font-extrabold uppercase tracking-wide">
            {t("contact.title", {
              defaultValue:
                "Contact Us",
            })}
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-gray-500">
            {t(
              "contact.subtitle",
              {
                defaultValue:
                  "Questions, issues, or custom requests? Send us a message and our team will respond shortly.",
              }
            )}
          </p>
        </section>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-3xl border bg-white p-6 shadow-xl md:p-8"
        >

          {/* NAME */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wide">
              First Name
            </Label>

            <Input
              required
              disabled={loading}
              value={form.firstName}
              onChange={(e) =>
                handleChange(
                  "firstName",
                  e.target.value
                )
              }
              className="h-12 rounded-xl border-2 focus-visible:ring-[var(--neon-green)]"
            />
          </div>


          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wide">
              Last Name
            </Label>

            <Input
              required
              disabled={loading}
              value={form.lastName}
              onChange={(e) =>
                handleChange(
                  "lastName",
                  e.target.value
                )
              }
              className="h-12 rounded-xl border-2 focus-visible:ring-[var(--neon-green)]"
            />
          </div>

          {/* EMAIL */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wide">
              Email Address
            </Label>

            <Input
              type="email"
              required
              disabled={loading}
              value={form.email}
              onChange={(e) =>
                handleChange(
                  "email",
                  e.target.value
                )
              }
              className="h-12 rounded-xl border-2 focus-visible:ring-[var(--neon-green)]"
            />
          </div>

          {/* ORDER */}
          <div className="rounded-2xl border bg-gray-50 p-4">
            <div className="flex items-start gap-3">
              <Checkbox
                checked={form.hasOrder}
                disabled={loading}
                onCheckedChange={(v) =>
                  handleChange(
                    "hasOrder",
                    v === true
                  )
                }
                className="mt-0.5"
              />

              <div className="space-y-1">
                <Label className="cursor-pointer font-semibold">
                  This is about an existing order
                </Label>

                <p className="text-xs text-gray-500">
                  Enable this if your
                  message relates to a
                  previous order.
                </p>
              </div>
            </div>

            {/* ORDER ID */}
            {form.hasOrder && (
              <div className="mt-4 space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wide">
                  Order ID
                </Label>

                <div className="relative">
                  <PackageSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                  <Input
                    required
                    disabled={loading}
                    placeholder="665f2f4f8f91a6a0e2b67b22"
                    value={form.orderId}
                    onChange={(e) =>
                      handleChange(
                        "orderId",
                        e.target.value
                      )
                    }
                    className="h-12 rounded-xl border-2 pl-10 focus-visible:ring-[var(--neon-green)]"
                  />
                </div>

                {/* VALIDATION */}
                {form.orderId &&
                  !/^[a-f\d]{24}$/i.test(
                    form.orderId
                  ) && (
                    <p className="text-xs text-red-500">
                      Invalid Order Id
                    </p>
                  )}
              </div>
            )}
          </div>

          {/* MESSAGE */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold uppercase tracking-wide">
                Message
              </Label>

              <span className="text-xs text-gray-400">
                {
                  form.message.length
                }
                /500
              </span>
            </div>

            <Textarea
              rows={6}
              maxLength={500}
              required
              disabled={loading}
              value={form.message}
              onChange={(e) =>
                handleChange(
                  "message",
                  e.target.value
                )
              }
              placeholder="Tell us how we can help you..."
              className="resize-none rounded-2xl border-2 focus-visible:ring-[var(--neon-green)]"
            />
          </div>

          {/* BUTTON */}
          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="
              h-12
              w-full
              rounded-xl
              bg-black
              text-white
              font-extrabold
              uppercase
              tracking-wide
              transition
              active:scale-[0.98]
              disabled:opacity-60
            "
          >
            {loading ? (
              <>
                <div
                  className="
                    mr-2
                    h-4
                    w-4
                    animate-spin
                    rounded-full
                    border-2
                    border-white/20
                    border-t-white
                  "
                />

                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />

                Send Message
              </>
            )}
          </Button>
        </form>
      </div>
    </SiteLayout>
  );
}