import { useNavigate, useSearch } from "@tanstack/react-router";

import {
  Search
} from "lucide-react";

import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { apiJson } from "@/lib/api";

import type { Pagination ,UserDetail} from "@/lib/api.types";
import { PagePagination } from "../PagePagination";
import { UserCard, UsersSkeleton } from "../Helpers/UserHelpers";



type UsersResponse = {
  status: number;
  message: string;
  pagination: Pagination;
  data: UserDetail[];
};

type UserTab =
  | "all"
  | "active"
  | "blocked";

/* ================= PAGE ================= */

export function AdminUsersComponents() {
  const navigate = useNavigate();

  const search = useSearch({
    strict: false,
  });

  const [users, setUsers] = useState<
    UserDetail[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [debouncedSearch, setDebouncedSearch] =
    useState("");

  const [pagination, setPagination] =
    useState<Pagination>({
      total: 0,
      totalPages: 1,
      currentPage: 1,
      limit: 12,
    });

  const currentTab: UserTab =
    search.tab === "active" ||
    search.tab === "blocked" ||
    search.tab === "all"
      ? search.tab
      : "all";

  /* ================= SEARCH ================= */

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  /* ================= FETCH ================= */

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError("");

        const page = Number(
          search.page || 1
        );

        const limit = pagination.limit;

        const offset =
          (page - 1) * limit;

        const queryParams =
          new URLSearchParams({
            limit: String(limit),
            offset: String(offset),

            ...(debouncedSearch && {
              search: debouncedSearch,
            }),

            ...(currentTab !==
              "all" && {
              status: currentTab,
            }),
          });

        const response =
          await apiJson<UsersResponse>(
            `/admin/users?${queryParams}`
          );

        if (cancelled) return;

        setUsers(response.data ?? []);

        if (
          response.pagination &&
          typeof response.pagination ===
            "object" &&
          !Array.isArray(
            response.pagination
          )
        ) {
          setPagination({
            total:
              response.pagination
                .total ?? 0,

            totalPages:
              response.pagination
                .totalPages ?? 1,

            currentPage:
              response.pagination
                .currentPage ?? 1,

            limit:
              response.pagination
                .limit ?? 12,
          });
        }
      } catch (err) {
        if (cancelled) return;

        setError(
          "Failed to load users"
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    currentTab,
    search.page,
    debouncedSearch,
  ]);

  /* ================= LOADING ================= */

  if (loading) {
    return <UsersSkeleton />;
  }

  /* ================= ERROR ================= */

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-500">
        {error}
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Users Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage all platform users
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {/* SEARCH */}
            <div className="relative w-full sm:w-[260px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value
                  )
                }
                className="h-11 rounded-2xl pl-10"
              />
            </div>

            {/* FILTER */}
            <Select
              value={currentTab}
              onValueChange={(value) => {
                navigate({
                  search: {
                    ...search,
                    tab: value,
                    page: 1,
                  },
                });
              }}
            >
              <SelectTrigger className="h-11 w-[160px] rounded-2xl">
                <SelectValue />
              </SelectTrigger>

              <SelectContent className="rounded-2xl">
                <SelectItem value="all">
                  All Users
                </SelectItem>

                <SelectItem value="active">
                  Active Users
                </SelectItem>

                <SelectItem value="blocked">
                  Blocked Users
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* GRID */}
      {!users.length ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            No users found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            No users available.
          </p>
        </div>
      ) : (
        <>
          <section
            className="
              grid grid-cols-1 gap-5
              md:grid-cols-2
              xl:grid-cols-3
              2xl:grid-cols-4
            "
          >
            {users.map((user) => (
              <UserCard
                key={user._id}
                user={user}
              />
            ))}
          </section>

          {/* PAGINATION */}
          {pagination.totalPages >
            1 && (
            <PagePagination
              currentPage={
                pagination.currentPage
              }
              totalPages={
                pagination.totalPages
              }
            />
          )}
        </>
      )}
    </div>
  );
}


