import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useAdminEmployeeStore } from "@/hooks/useAdminEmployeeStore";

export function AddEmployee() {
  const openAdd =
    useAdminEmployeeStore(
      (s) => s.openAdd
    );

  const setOpenAdd =
    useAdminEmployeeStore(
      (s) => s.setOpenAdd
    );

  const form =
    useAdminEmployeeStore(
      (s) => s.form
    );

  const setForm =
    useAdminEmployeeStore(
      (s) => s.setForm
    );

  const createEmployee =
    useAdminEmployeeStore(
      (s) => s.createEmployee
    );

  return (
    <Dialog
      open={openAdd}
      onOpenChange={setOpenAdd}
    >
      <DialogTrigger asChild>
        <Button className="h-11 rounded-2xl">
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </DialogTrigger>

      <DialogContent className="rounded-3xl border-slate-200 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Add Employee
          </DialogTitle>

          <DialogDescription>
            Create new employee account
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* NAME */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="First Name"
              value={form.firstName}
              onChange={(e) =>
                setForm({
                  firstName:
                    e.target.value,
                })
              }
              className="h-11 rounded-2xl"
            />

            <Input
              placeholder="Last Name"
              value={form.lastName}
              onChange={(e) =>
                setForm({
                  lastName:
                    e.target.value,
                })
              }
              className="h-11 rounded-2xl"
            />
          </div>

          {/* EMAIL */}
          <Input
            placeholder="Email Address"
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({
                email:
                  e.target.value,
              })
            }
            className="h-11 rounded-2xl"
          />

          {/* PHONE */}
          <div className="grid grid-cols-3 gap-3">
            <Input
              placeholder="+1"
              value={
                form.phoneCountryCode
              }
              onChange={(e) =>
                setForm({
                  phoneCountryCode:
                    e.target.value,
                })
              }
              className="h-11 rounded-2xl"
            />

            <Input
              placeholder="Phone Number"
              value={form.phoneNumber}
              onChange={(e) =>
                setForm({
                  phoneNumber:
                    e.target.value,
                })
              }
              className="col-span-2 h-11 rounded-2xl"
            />
          </div>

          {/* BUTTON */}
          <Button
            onClick={createEmployee}
            className="h-11 w-full rounded-2xl"
          >
            Create Employee
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}