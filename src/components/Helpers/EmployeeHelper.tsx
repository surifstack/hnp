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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { HnpUser, UserStatus } from "@/lib/hnp.types";
import { useAdminEmployeeStore } from "@/hooks/useAdminEmployeeStore";
import { EmployeeDialog } from "../Admin/EmployeeDialog";
import { CustomerRow } from "./UserHelpers";

type Props = {
  employee: HnpUser;
};



export function EmployeeCard({
  employee,
}: Props) {

 const form =
  useAdminEmployeeStore(
    (s) => s.form
  );

  const openEdit =
  useAdminEmployeeStore(
    (s) => s.openEdit
  );

  const editingId =
  useAdminEmployeeStore(
    (s) => s.editingId
  );

   const setEditingId =
  useAdminEmployeeStore(
    (s) => s.setEditingId
  );
  
  const setOpenEdit =
  useAdminEmployeeStore(
    (s) => s.setOpenEdit
  );
const setForm =
  useAdminEmployeeStore(
    (s) => s.setForm
  );

const updateEmployee =
  useAdminEmployeeStore(
    (s) => s.updateEmployee
  );

const submitting =
  useAdminEmployeeStore(
    (s) => s.submitting
  );
const setDeleteId =
  useAdminEmployeeStore(
    (s) => s.setDeleteId
  );
const setDeleteConfirmOpen =
  useAdminEmployeeStore(
    (s) => s.setDeleteConfirmOpen
  );
const formError =
  useAdminEmployeeStore(
    (s) => s.formError
  );

  const isActive =
    employee.status === "ACTIVE";

  const joinedDate =
    new Date(employee.createdAt);

  const toggleStatus =
      useAdminEmployeeStore(
        (s) => s.toggleStatus
      );

  return (
    <div
      className="
        overflow-hidden
        rounded-3xl
        border
        border-slate-200
        bg-white
        shadow-sm
      "
    >

      <div className="h-1 w-full bg-[var(--neon-green)]" />

      <div className="space-y-5 p-6">

        {/* HEADER */}
        <div className="flex items-start justify-between gap-4">

          <div>

            <h3 className="text-lg font-bold text-slate-900">
              {employee.firstName}{" "}
              {employee.lastName}
            </h3>

            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">

              <Calendar className="h-4 w-4" />

              Joined{" "}
              {joinedDate.toLocaleDateString()}
            </div>

          </div>

          <div
            className={`
              rounded-full
              border
              px-3
              py-1
              text-xs
              font-bold
              uppercase
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

        {/* CONTACT */}
        <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">

          <CustomerRow
            icon={
              <Mail className="h-4 w-4" />
            }
            value={employee.email}
          />

          <CustomerRow
            icon={
              <Phone className="h-4 w-4" />
            }
            value={`${employee.phoneCountryCode} ${employee.phoneNumber}`}
          />

        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 pt-2">

          <Button
            variant="outline"
             onClick={() => {
                // fill zustand form
                setForm({
                  firstName:
                    employee.firstName || "",

                  lastName:
                    employee.lastName || "",

                  email:
                    employee.email || "",

                  phoneCountryCode:
                    employee.phoneCountryCode ||
                    "+1",

                  phoneNumber:
                    employee.phoneNumber || "",
                });
                setEditingId(employee._id); // ✅ important

                setOpenEdit(true);
              }}
            className="rounded-xl"
          >
            Edit
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              toggleStatus(
                employee._id,
                employee.status
              )
            }
            className="rounded-xl"
          >
            {isActive
              ? "Disable"
              : "Enable"}
          </Button>

          <Button
            onClick={() =>{
                 setDeleteId(employee._id);
        setDeleteConfirmOpen(true);
            }
            }
            className="
              rounded-xl
              border
              border-red-200
              bg-red-50
              text-red-600
            "
          >
            Delete
          </Button>

        </div>
      </div>



      {/* EDIT DIALOG */}
      <EmployeeDialog
        open={openEdit}
        setOpen={setOpenEdit}
        mode="edit"
        form={form}
        setForm={setForm}
        loading={submitting}
        error={formError}
        onSubmit={async () => {

          if (!editingId) return;

            await updateEmployee(
              editingId,
              form
            );

            const latestError =
              useAdminEmployeeStore.getState()
                .formError;

            if (!latestError) {
              setOpenEdit(false);
              setEditingId(null); // reset
            }
        }}
      />
    </div>
  );
}


export function DeleteModal(){

  

  const deleteConfirmOpen =
  useAdminEmployeeStore(
    (s) => s.deleteConfirmOpen
  );

const setDeleteConfirmOpen =
  useAdminEmployeeStore(
    (s) => s.setDeleteConfirmOpen
  );
  const deleteEmployee =
  useAdminEmployeeStore(
    (s) => s.deleteEmployee
  );
const deleteId =
  useAdminEmployeeStore(
    (s) => s.deleteId
  );

  const setDeleteId =
  useAdminEmployeeStore(
    (s) => s.setDeleteId
  );
  return  (

      <Dialog
  open={deleteConfirmOpen}
  onOpenChange={setDeleteConfirmOpen}
>
  <DialogContent className="rounded-2xl">

    <DialogHeader>
      <DialogTitle>
        Delete Employee?
      </DialogTitle>
    </DialogHeader>

    <p className="text-sm text-slate-500">
      This action cannot be undone.
    </p>

    <div className="flex justify-end gap-2 pt-4">

      <Button
        variant="outline"
        onClick={() =>
          setDeleteConfirmOpen(false)
        }
      >
        Cancel
      </Button>

      <Button
        className="bg-red-500 text-white"
        onClick={async () => {

          if (!deleteId) return;

          await deleteEmployee(deleteId);

          setDeleteConfirmOpen(false);
          setDeleteId("");
        }}
      >
        Delete
      </Button>

    </div>

  </DialogContent>
</Dialog>
  )
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