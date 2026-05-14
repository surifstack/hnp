import * as React from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { apiJson } from "@/lib/api";
import { useSessionStore } from "@/hooks/useSessionStore";

type PasswordOtpResponse = {
  ok: boolean;
  expiresAt: string;
  devOtp?: string;
};

export function ProfileManagementComponents() {
  const user = useSessionStore((s) => s.user);
  const setSession = useSessionStore((s) => s.setSession);

  const [saving, setSaving] = React.useState(false);

  const [firstName, setFirstName] = React.useState(user?.firstName ?? "");
  const [lastName, setLastName] = React.useState(user?.lastName ?? "");
  const [email, setEmail] = React.useState(user?.email ?? "");
 
  const [phoneNumber, setPhoneNumber] = React.useState(user?.phoneNumber ?? "");

  React.useEffect(() => {
    setFirstName(user?.firstName ?? "");
    setLastName(user?.lastName ?? "");
    setEmail(user?.email ?? "");
    setPhoneNumber(user?.phoneNumber ?? "");
  }, [
    user?.firstName,
    user?.lastName,
    user?.email,
    user?.phoneCountryCode,
    user?.phoneNumber,
  ]);


  async function saveProfile() {
    if (!user) return;
    try {
      setSaving(true);
      const response = await apiJson<{ user: any }>(`/auth/profile`, {
        method: "PATCH",
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phoneNumber: phoneNumber.trim(),
        }),
      });

      setSession(response.user ?? null);
      toast.success("Profile updated");
    } catch (e: any) {
      const msg =
        typeof e?.message === "string"
          ? e.message
          : "Failed to update profile";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <section className="userdash-surface rounded-2xl p-5">
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View and update profile details (including email and profile picture).
        </p>
      </section>

      <section className="userdash-surface rounded-2xl p-5">
       

        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            saveProfile();
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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white"
            />
          </div>
            <div className="space-y-1.5">
              <Label htmlFor="phoneNumber">Phone number</Label>
              <Input
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="bg-white"
              />
            </div>
          </div>

          <Button type="submit" className="userdash-neon-btn" disabled={saving}>
            <Save className="h-4 w-4" />
            Save
          </Button>
        </form>
      </section>
 <AdminPasswordChange />
    </div>
  );
}

function AdminPasswordChange() {
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [otpCode, setOtpCode] = React.useState("");
  const [devOtp, setDevOtp] = React.useState<string | undefined>(undefined);
  const [busy, setBusy] = React.useState(false);

  async function requestOtp() {
    try {
      setBusy(true);
      const res = await apiJson<PasswordOtpResponse>(`/auth/password/otp`, {
        method: "POST",
      });
      setDevOtp(res.devOtp);
      toast.success("OTP generated");
    } catch (e: any) {
      toast.error(typeof e?.message === "string" ? e.message : "Failed to request OTP");
    } finally {
      setBusy(false);
    }
  }

  async function changePassword() {
    try {
      if (!otpCode.trim()) {
        toast.error("OTP is required");
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      setBusy(true);
      await apiJson(`/auth/password/change`, {
        method: "POST",
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
          otpCode,
        }),
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setOtpCode("");
      toast.success("Password changed");
    } catch (e: any) {
      toast.error(typeof e?.message === "string" ? e.message : "Failed to change password");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="userdash-surface rounded-2xl p-5">
      <h2 className="text-lg font-semibold tracking-tight">Password Change</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Password change with dummy OTP verification.
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <Button type="button" variant="outline" className="rounded-2xl" onClick={requestOtp} disabled={busy}>
          Request OTP
        </Button>
        {devOtp ? (
          <div className="text-sm">
            Dev OTP: <span className="font-semibold text-slate-900">{devOtp}</span>
          </div>
        ) : null}
      </div>

      <form
        className="mt-4 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          changePassword();
        }}
      >
        <div className="space-y-1.5">
          <Label htmlFor="currentPassword">Current Password</Label>
          <Input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="bg-white"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-white"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-white"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="otpCode">OTP</Label>
          <Input
            id="otpCode"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            className="bg-white"
          />
        </div>

        <Button type="submit" className="userdash-neon-btn" disabled={busy}>
          Change Password
        </Button>
      </form>
    </section>
  );
}

