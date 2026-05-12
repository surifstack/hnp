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
  EmployeeCard,
  EmployeesSkeleton,
} from "../Helpers/EmployeeHelper";
import { AddEmployee } from "./AddEmployee";

export function AdminEmployeesComponents() {
  const employees =
    useAdminEmployeeStore(
      (s) => s.employees
    );

  const loading =
    useAdminEmployeeStore(
      (s) => s.loading
    );

  const error =
    useAdminEmployeeStore(
      (s) => s.error
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

  const deleteEmployee =
    useAdminEmployeeStore(
      (s) => s.deleteEmployee
    );

  const toggleStatus =
    useAdminEmployeeStore(
      (s) => s.toggleStatus
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
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  All
                </SelectItem>

                <SelectItem value="active">
                  Active
                </SelectItem>

                <SelectItem value="inactive">
                  Inactive
                </SelectItem>
              </SelectContent>
            </Select>

            {/* ADD EMPLOYEE */}
            <AddEmployee />
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {employees.map((employee) => (
          <EmployeeCard
            key={employee._id}
            employee={employee}
            onDelete={deleteEmployee}
            onToggle={toggleStatus}
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
    </div>
  );
}