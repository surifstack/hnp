// AdminEmployeesComponents.tsx

import {
  Search,
  Plus,
} from "lucide-react";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAdminEmployeeStore } from "@/hooks/useAdminEmployeeStore";

import { PagePagination } from "../PagePagination";

import {
  DeleteModal,
  EmployeeCard,
  EmployeesSkeleton,
} from "../Helpers/EmployeeHelper";
import { EmployeeDialog } from "./EmployeeDialog";
import { HNPUserStatus } from "@/lib/hnp.types";

export function AdminEmployeesComponents() {

  const openAdd = useAdminEmployeeStore((s) => s.openAdd);
  const setOpenAdd = useAdminEmployeeStore((s) => s.setOpenAdd);

  const form = useAdminEmployeeStore((s) => s.form);
  const setForm = useAdminEmployeeStore((s) => s.setForm);

  const createEmployee = useAdminEmployeeStore((s) => s.createEmployee);
  const employees =
    useAdminEmployeeStore(
      (s) => s.employees
    );

  const loading =
    useAdminEmployeeStore(
      (s) => s.loading
    );

   const submitting =
    useAdminEmployeeStore(
      (s) => s.submitting
    );
  const setFormError =
    useAdminEmployeeStore(
      (s) => s.setFormError
    );

  const error =
    useAdminEmployeeStore(
      (s) => s.error
    );
  const formError = 
    useAdminEmployeeStore(
      (s) => s.formError
    );

  const search =
    useAdminEmployeeStore(
      (s) => s.search
    );

  const status =
    useAdminEmployeeStore(
      (s) => s.status
    );

  const pagination =
    useAdminEmployeeStore(
      (s) => s.pagination
    );

  const fetchEmployees =
    useAdminEmployeeStore(
      (s) => s.fetchEmployees
    );

  const setSearch =
    useAdminEmployeeStore(
      (s) => s.setSearch
    );

  const setStatus =
    useAdminEmployeeStore(
      (s) => s.setStatus
    );



 

  useEffect(() => {
    fetchEmployees(1);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEmployees(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search, status]);

  if (loading) {
    return <EmployeesSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Employee Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage all employees
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {/* SEARCH */}
            <div className="relative w-full sm:w-[260px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <Input
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search employees..."
                className="h-11 rounded-2xl border-slate-200 pl-10"
              />
            </div>

            {/* FILTER */}
           <Select
            value={status}
            onValueChange={setStatus}
          >
            <SelectTrigger className="h-11 w-[150px] rounded-2xl border-slate-200">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>

            <SelectContent>

              <SelectItem value="*">
                All
              </SelectItem>

              {HNPUserStatus.map((item) => (
                <SelectItem
                  key={item}
                  value={item}
                >
                  {item.charAt(0) + item.slice(1).toLowerCase()}
                </SelectItem>
              ))}

            </SelectContent>
          </Select>

          <Button
            type="button"
            className="h-11 rounded-2xl"
            onClick={() => {

              // reset form first
              setForm({
                firstName: "",
                lastName: "",
                email: "",
                phoneNumber: "",
                phoneCountryCode: "+1",
              });

              // clear old error
              setFormError("");

              // open dialog
              setOpenAdd(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />

            Add Employee
          </Button>

            {/* ADD EMPLOYEE */}
           <EmployeeDialog
            open={openAdd}
            setOpen={setOpenAdd}
            mode="add"
            error={formError}
            form={form}
            setForm={setForm}
            loading={submitting}
            onSubmit={createEmployee}
          />
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <DeleteModal />
        {employees.map((employee) => (
          <EmployeeCard
            key={employee._id}
            employee={employee}
          />
        ))}
      </section>

      {/* EMPTY */}
      {!employees.length && (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            No employees found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            No employee available.
          </p>
        </div>
      )}

      {/* PAGINATION */}
     {pagination.totalPages > 1 &&
       <PagePagination
        currentPage={
          pagination.currentPage
        }
        totalPages={
          pagination.totalPages
        }
        // onPageChange={(page) => {
        //   fetchEmployees(page);
        // }}
      />
       } 
    </div>
  );
}