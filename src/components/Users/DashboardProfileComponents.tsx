import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useSessionStore } from "@/hooks/useSessionStore";
import { useUserProfileStore, formatDisplayName } from "@/hooks/useUserProfileStore";
import * as React from "react";
export function DashboardProfileComponents() {
  const user = useSessionStore((s) => s.user);
  const profile = useUserProfileStore((s) => (user?.id ? s.profilesById[user.id] : undefined));
  const upsertProfile = useUserProfileStore((s) => s.upsertProfile);

  const [firstName, setFirstName] = React.useState(profile?.firstName ?? "");
  const [lastName, setLastName] = React.useState(profile?.lastName ?? "");
  const [phone, setPhone] = React.useState(profile?.phone ?? "");
  const [country, setCountry] = React.useState(profile?.country ?? "");

  React.useEffect(() => {
    setFirstName(profile?.firstName ?? "");
    setLastName(profile?.lastName ?? "");
    setPhone(profile?.phone ?? "");
    setCountry(profile?.country ?? "");
  }, [profile?.firstName, profile?.lastName, profile?.phone, profile?.country]);

  if (!user) return null;

  const displayName = formatDisplayName(profile, user.id);

  return (
    <div className="space-y-4">
      <section className="userdash-surface rounded-2xl p-5">
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your basic info. (We don’t show your email or password here.)
        </p>
      </section>

      <section className="userdash-surface rounded-2xl p-5">
        <div className="text-xs font-medium text-muted-foreground">Display name</div>
        <div className="mt-1 text-lg font-semibold tracking-tight">{displayName}</div>

        <form
          className="mt-4 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            upsertProfile({
              firstName: firstName.trim() || undefined,
              lastName: lastName.trim() || undefined,
              phone: phone.trim() || undefined,
              country: country.trim() || undefined,
            });
            toast.success("Saved");
          }}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="first">First name</Label>
              <Input
                id="first"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="last">Last name</Label>
              <Input
                id="last"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="bg-white"
              />
            </div>
          </div>

          <Button type="submit" className="userdash-neon-btn">
            <Save className="h-4 w-4" />
            Save
          </Button>
        </form>
      </section>
    </div>
  );
}