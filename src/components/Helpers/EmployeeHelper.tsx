/* ================= CARD ================= */

import {
  Calendar,
  Mail,
  Phone,
  Pencil,
  Power,
  Trash2,
  User2,
} from "lucide-react";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { apiJson } from "@/lib/api";

import type {
  Employee,
  EmployeePayload,
} from "@/lib/types";

type Props = {
  employee: Employee;

  onDelete: (id: string) => void;

  onToggle: (
    id: string,
    active: boolean
  ) => void;

  onUpdated?: () => void;
};

export function EmployeeCard({
  employee,
  onDelete,
  onToggle,
  onUpdated,
}: Props) {
  const [openEdit, setOpenEdit] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState<EmployeePayload>({
      firstName:
        employee.firstName || "",

      lastName:
        employee.lastName || "",

      email: employee.email || "",

      phoneCountryCode:
        employee.phoneCountryCode ||
        "+1",

      phoneNumber:
        employee.phoneNumber || "",
    });

  async function updateEmployee() {
    try {
      setLoading(true);

      await apiJson(
        `/admin/employees/${employee._id}`,
        {
          method: "PATCH",

          body: JSON.stringify(form),
        }
      );

      setOpenEdit(false);

      onUpdated?.();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="
        overflow-hidden rounded-3xl border border-slate-200
        bg-white shadow-sm transition-all duration-300
        hover:-translate-y-0.5 hover:shadow-xl
      "
    >
      {/* TOP BAR */}
      <div className="h-1 w-full bg-[var(--neon-green)]" />

      <div className="p-6">
        <div className="flex flex-col gap-5">
          {/* HEADER */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {employee.firstName}{" "}
                {employee.lastName}
              </h3>

              <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                <User2 className="h-4 w-4" />

                {employee.role ||
                  "Employee"}
              </div>
            </div>

            <div
              className={`
                rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide
                ${
                  employee.active
                    ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                    : "border-red-200 bg-red-100 text-red-700"
                }
              `}
            >
              {employee.active
                ? "Active"
                : "Inactive"}
            </div>
          </div>

          {/* INFO GRID */}
          <div className="grid grid-cols-1 gap-3 rounded-2xl bg-slate-50 p-4">
            <InfoCard
              icon={
                <Mail className="h-4 w-4" />
              }
              label="Email"
              value={employee.email}
            />

            <InfoCard
              icon={
                <Phone className="h-4 w-4" />
              }
              label="Phone"
              value={`${employee.phoneCountryCode} ${employee.phoneNumber}`}
            />

            <InfoCard
              icon={
                <Calendar className="h-4 w-4" />
              }
              label="Created"
              value={new Date(
                employee.createdAt
              ).toLocaleDateString()}
            />
          </div>

          {/* ACTIONS */}
          <div className="grid grid-cols-2 gap-3">
            {/* EDIT */}
            <Dialog
              open={openEdit}
              onOpenChange={
                setOpenEdit
              }
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-2xl border-slate-200"
                >
                  <Pencil className="mr-2 h-4 w-4" />

                  Edit
                </Button>
              </DialogTrigger>

              <DialogContent className="rounded-3xl border-slate-200 sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">
                    Edit Employee
                  </DialogTitle>
                </DialogHeader>

                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="First Name"
                      value={
                        form.firstName
                      }
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          firstName:
                            e.target
                              .value,
                        }))
                      }
                      className="h-11 rounded-2xl"
                    />

                    <Input
                      placeholder="Last Name"
                      value={
                        form.lastName
                      }
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          lastName:
                            e.target
                              .value,
                        }))
                      }
                      className="h-11 rounded-2xl"
                    />
                  </div>

                  <Input
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        email:
                          e.target
                            .value,
                      }))
                    }
                    className="h-11 rounded-2xl"
                  />

                  <div className="grid grid-cols-3 gap-3">
                    <Input
                      placeholder="+1"
                      value={
                        form.phoneCountryCode
                      }
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          phoneCountryCode:
                            e.target
                              .value,
                        }))
                      }
                      className="h-11 rounded-2xl"
                    />

                    <Input
                      placeholder="Phone Number"
                      value={
                        form.phoneNumber
                      }
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          phoneNumber:
                            e.target
                              .value,
                        }))
                      }
                      className="col-span-2 h-11 rounded-2xl"
                    />
                  </div>

                  <Button
                    onClick={
                      updateEmployee
                    }
                    disabled={loading}
                    className="h-11 w-full rounded-2xl"
                  >
                    {loading
                      ? "Updating..."
                      : "Update Employee"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* ACTIVE / INACTIVE */}
            <Button
              variant="outline"
              className="rounded-2xl border-slate-200"
              onClick={() =>
                onToggle(
                  employee._id,
                  employee.active
                )
              }
            >
              <Power className="mr-2 h-4 w-4" />

              {employee.active
                ? "Disable"
                : "Enable"}
            </Button>

            {/* DELETE */}
            <Button
              variant="destructive"
              className="col-span-2 rounded-2xl"
              onClick={() =>
                onDelete(
                  employee._id
                )
              }
            >
              <Trash2 className="mr-2 h-4 w-4" />

              Delete Employee
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= INFO CARD ================= */

export function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;

  label: string;

  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white p-3">
      <div className="text-slate-400">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-500">
          {label}
        </p>

        <p className="truncate text-sm font-semibold text-slate-900">
          {value}
        </p>
      </div>
    </div>
  );
}

/* ================= SKELETON ================= */

export function EmployeesSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-28 rounded-3xl bg-muted" />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map(
          (i) => (
            <div
              key={i}
              className="h-72 rounded-3xl bg-muted"
            />
          )
        )}
      </div>
    </div>
  );
}