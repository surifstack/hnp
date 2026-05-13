import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { EmployeePayload } from "@/lib/types";
import { COUNTRY_OPTIONS } from "@/config/languages";

type EmployeeDialogProps = {
  open: boolean;

  setOpen: (v: boolean) => void;

  mode: "add" | "edit";

  form: EmployeePayload;

  setForm: (
    value:
      | Partial<EmployeePayload>
      | ((
          prev: EmployeePayload
        ) => EmployeePayload)
  ) => void;

  loading: boolean;

  error?: string;

  onSubmit: () => void;
};

export function EmployeeDialog({
  open,
  setOpen,
  mode,
  form,
  setForm,
  loading,
  error,
  onSubmit,
}: EmployeeDialogProps) {

  const isEdit =
    mode === "edit";

  const isDisabled =
    !form.firstName ||
    !form.lastName ||
    !form.email ||
    !form.phoneNumber;

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogContent
        className="
          rounded-3xl
          border-slate-200
          sm:max-w-lg
          overflow-hidden
          p-0
        "
      >

        {/* HEADER */}
        <div className="border-b border-slate-200 bg-white px-6 py-5">

          <DialogHeader>

            <DialogTitle className="text-xl font-bold text-slate-900">
              {isEdit
                ? "Edit Employee"
                : "Add Employee"}
            </DialogTitle>

            <DialogDescription className="text-slate-500">
              {isEdit
                ? "Update employee details and contact information"
                : "Create a new employee for your team"}
            </DialogDescription>

          </DialogHeader>
        </div>

        {/* BODY */}
        <div className="space-y-6 px-6 py-6">

          {/* ERROR */}
          {error && (
            <div
              className="
                rounded-2xl
                border
                border-red-200
                bg-red-50
                px-4
                py-3
                text-sm
                text-red-500
              "
            >
              {error}
            </div>
          )}

          {/* NAME */}
          <div className="space-y-2">

            <p className="text-xs font-semibold uppercase text-slate-500">
              Personal Information
            </p>

            <div className="grid grid-cols-2 gap-3">

              <Input
                placeholder="First Name"
                value={form.firstName}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    firstName:
                      e.target.value,
                  }))
                }
                className="
                  h-11
                  rounded-2xl
                  border-slate-200
                  bg-white
                "
              />

              <Input
                placeholder="Last Name"
                value={form.lastName}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    lastName:
                      e.target.value,
                  }))
                }
                className="
                  h-11
                  rounded-2xl
                  border-slate-200
                  bg-white
                "
              />

            </div>
          </div>

          {/* EMAIL */}
          <div className="space-y-2">

            <p className="text-xs font-semibold uppercase text-slate-500">
              Contact
            </p>

            <Input
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  email:
                    e.target.value,
                }))
              }
              className="
                h-11
                rounded-2xl
                border-slate-200
                bg-white
              "
            />
          </div>

          {/* PHONE */}
          <div className="space-y-2">

            <p className="text-xs font-semibold uppercase text-slate-500">
              Phone
            </p>

            <div className="grid grid-cols-4 gap-3">

              {/* COUNTRY CODE */}
              <Select
                value={
                  form.phoneCountryCode ||
                  "+1"
                }
                onValueChange={(v) =>
                  setForm((p) => ({
                    ...p,
                    phoneCountryCode:
                      v,
                  }))
                }
              >

                <SelectTrigger
                  className="
                    h-11
                    rounded-2xl
                    border-slate-200
                  "
                >
                  <SelectValue>
                    {
                      COUNTRY_OPTIONS.find(
                        (c) =>
                          c.dialCode ===
                          (
                            form.phoneCountryCode ||
                            "+1"
                          )
                      )?.dialCode
                    }
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>

                  {COUNTRY_OPTIONS.map(
                    (c) => (
                      <SelectItem
                        key={`${c.code}-${c.dialCode}`}
                        value={
                          c.dialCode
                        }
                      >

                        <div className="flex items-center gap-2">

                          <span>
                            {c.flag}
                          </span>

                          <span>
                            {c.name}
                          </span>

                          <span className="text-slate-400">
                            {
                              c.dialCode
                            }
                          </span>

                        </div>

                      </SelectItem>
                    )
                  )}

                </SelectContent>
              </Select>

              {/* PHONE NUMBER */}
              <Input
                placeholder="Phone number"
                value={
                  form.phoneNumber
                }
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    phoneNumber:
                      e.target.value,
                  }))
                }
                className="
                  col-span-3
                  h-11
                  rounded-2xl
                  border-slate-200
                "
              />

            </div>
          </div>

          {/* BUTTON */}
          <div className="space-y-2 pt-2">

            <Button
              onClick={onSubmit}
              disabled={
                loading ||
                isDisabled
              }
              className="
                h-11
                w-full
                rounded-2xl
                bg-[var(--neon-green)]
                font-bold
                text-black
                hover:bg-[var(--neon-green)]/90
                disabled:opacity-50
              "
            >
              {loading
                ? isEdit
                  ? "Updating..."
                  : "Creating..."
                : isEdit
                ? "Update Employee"
                : "Create Employee"}
            </Button>

            {isDisabled && (
              <p className="text-center text-xs text-slate-400">
                Please fill all
                required fields
              </p>
            )}

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}