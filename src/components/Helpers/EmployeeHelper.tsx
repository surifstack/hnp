/* ================= CARD ================= */

import {
  Calendar,
  Mail,
  Phone,
  Pencil,
  Power,
  Trash2,
  User2,
  Briefcase,
} from "lucide-react";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { HnpUser, UserStatus } from "@/lib/hnp.types";
import { useAdminEmployeeStore } from "@/hooks/useAdminEmployeeStore";
import { EmployeeDialog } from "../Admin/EmployeeDialog";
import { CustomerRow } from "./UserHelpers";

type Props = {
  employee: HnpUser;

  onDelete: (id: string) => void;

  onToggle: (
    id: string,
    status: UserStatus
  ) => void;

  onUpdated?: () => void;
};




export function EmployeeCard({
  employee,
  onDelete,
  onToggle,
}: Props) {
  const [openEdit, setOpenEdit] = useState(false);

  const isActive = employee.status === "ACTIVE";

  const joinedDate = new Date(employee.createdAt);

  return (
    <div className="
      overflow-hidden rounded-3xl border border-slate-200
      bg-white shadow-sm transition-all duration-300
      hover:-translate-y-1 hover:shadow-xl
    ">

      {/* NEON TOP BAR */}
      <div className="h-1 w-full bg-[var(--neon-green)]" />

      <div className="p-6 space-y-5">

        {/* HEADER */}
        <div className="flex items-start justify-between gap-4">

          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {employee.firstName} {employee.lastName}
            </h3>

            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
              <Calendar className="h-4 w-4" />
              Joined {joinedDate.toLocaleDateString()}
            </div>
          </div>

          {/* STATUS */}
          <div
            className={`
              rounded-full border px-3 py-1 text-xs font-bold uppercase
              ${
                isActive
                  ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                  : "border-slate-200 bg-slate-100 text-slate-600"
              }
            `}
          >
            {employee.status}
          </div>
        </div>

        {/* CONTACT INFO */}
        <div className="space-y-3 rounded-2xl bg-slate-50 p-4 border border-slate-100">

          <CustomerRow
            icon={<Mail className="h-4 w-4" />}
            value={employee.email}
          />

          <CustomerRow
            icon={<Phone className="h-4 w-4" />}
            value={`${employee.phoneCountryCode} ${employee.phoneNumber}`}
          />

          {employee.role && (
            <CustomerRow
              icon={<Briefcase className="h-4 w-4" />}
              value={employee.role}
            />
          )}
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-3">

        
        </div>

      

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 pt-2">

          <Button
            variant="outline"
            onClick={() => setOpenEdit(true)}
            className="rounded-xl"
          >
            Edit
          </Button>

          <Button
            variant="outline"
            onClick={() => onToggle(employee._id, employee.status)}
            className="rounded-xl"
          >
            {isActive ? "Disable" : "Enable"}
          </Button>

          <Button
            onClick={() => onDelete(employee._id)}
            className="rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
          >
            Delete
          </Button>
        </div>
      </div>

      {/* EDIT MODAL */}
      <EmployeeDialog
        open={openEdit}
        setOpen={setOpenEdit}
        mode="edit"
        form={{
          firstName: employee.firstName || "",
          lastName: employee.lastName || "",
          email: employee.email || "",
          phoneCountryCode: employee.phoneCountryCode || "",
          phoneNumber: employee.phoneNumber || "",
        }}
        setForm={() => {}}
        loading={false}
        onSubmit={() => {}}
      />
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