import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [{ title: "Contact Us — Hot Neon Posters" }],
  }),
  component: Contact,
});

function Contact() {
  const [hasOrder, setHasOrder] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <SiteLayout>
      <div className="mx-auto w-full max-w-2xl bg-white/95 rounded-2xl p-6 shadow-xl border-2 border-black">
        <h1 className="text-2xl font-extrabold uppercase tracking-wide mb-5">Contact Us</h1>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="first">First name</Label>
            <Input id="first" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" required />
          </div>
          <div className="flex items-start gap-2">
            <Checkbox
              id="hasOrder"
              checked={hasOrder}
              onCheckedChange={(v) => setHasOrder(v === true)}
            />
            <Label htmlFor="hasOrder" className="text-sm font-normal">
              This is about an existing order
            </Label>
          </div>
          {hasOrder && (
            <div className="space-y-1.5">
              <Label htmlFor="orderNum">Order number</Label>
              <Input id="orderNum" required />
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="msg">
              Message <span className="text-xs text-muted-foreground">({message.length}/500)</span>
            </Label>
            <Textarea
              id="msg"
              maxLength={500}
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" size="lg">
            Send message
          </Button>
        </form>
      </div>
    </SiteLayout>
  );
}
