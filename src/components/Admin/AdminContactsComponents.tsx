import { useEffect, useState } from "react";

import {
  Mail,
  Search,
  Package,
} from "lucide-react";

import {
  useNavigate,
  useSearch,
} from "@tanstack/react-router";

import { Input } from "@/components/ui/input";

import { apiJson } from "@/lib/api";

import type {
  Pagination,
} from "@/lib/api.types";

import { PagePagination } from "../PagePagination";
import { formatMoney } from "../Helpers/UserHelpers";

/* ---------------------------------- */
/* TYPES                              */
/* ---------------------------------- */


type Order = {
  _id: string;

  status: string;

  totals: {total:number, currency:string};


  createdAt: string;
};

type Contact = {
  _id: string;

  firstName: string;

  email: string;

  message: string;

  createdAt: string;

  order?: Order | null;
};

type ContactsResponse = {
  status: number;

  message: string;

  pagination: Pagination;

  data: Contact[];
};

/* ---------------------------------- */
/* SKELETON                           */
/* ---------------------------------- */

function ContactsSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map(
        (i) => (
          <div
            key={i}
            className="animate-pulse rounded-3xl border bg-white p-5"
          >
            <div className="space-y-3">
              <div className="h-5 w-40 rounded-full bg-gray-200" />

              <div className="h-4 w-52 rounded-full bg-gray-100" />

              <div className="space-y-2 pt-3">
                <div className="h-3 w-full rounded-full bg-gray-100" />

                <div className="h-3 w-5/6 rounded-full bg-gray-100" />
              </div>

              <div className="h-24 rounded-2xl bg-gray-100" />
            </div>
          </div>
        )
      )}
    </div>
  );
}

/* ---------------------------------- */
/* CARD                               */
/* ---------------------------------- */

function ContactCard({
  contact,
}: {
  contact: Contact;
}) {


  return (
    <article className="rounded-3xl border bg-white p-5 shadow-sm">
      {/* TOP */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {contact.firstName}
          </h2>

          <p className="text-sm text-slate-500">
            {contact.email}
          </p>
        </div>

        <div className="rounded-xl bg-[var(--neon-green)]/10 p-2">
          <Mail className="h-5 w-5 text-[var(--neon-green)]" />
        </div>
      </div>

      {/* MESSAGE */}
      <div className="mt-4 rounded-2xl bg-slate-50 p-4">
        <p className="line-clamp-4 text-sm leading-relaxed text-slate-700">
          {contact.message}
        </p>
      </div>

      {/* ORDER */}
      {contact.order && (
        <div className="mt-4 rounded-2xl border border-slate-200 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Package className="h-4 w-4 text-slate-500" />

            <h3 className="text-sm font-bold text-slate-900">
              Order Details
            </h3>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">
                Status
              </span>

              <span className="font-semibold capitalize">
                {contact.order.status}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                Total
              </span>

              <span className="font-semibold">
            {(() => {
              const money = formatMoney(
                contact.order.totals.total,
                contact.order.totals.currency
              );

              return money;
            })()}
          </span>
            </div>
          </div>

        </div>
      )}

      {/* DATE */}
      <div className="mt-5 text-xs text-slate-400">
        {new Date(
          contact.createdAt
        ).toLocaleString()}
      </div>
    </article>
  );
}

/* ---------------------------------- */
/* PAGE                               */
/* ---------------------------------- */

export function AdminContactsComponents() {
  const navigate = useNavigate();

  const search = useSearch({
    strict: false,
  });

  const [contacts, setContacts] =
    useState<Contact[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [
    debouncedSearch,
    setDebouncedSearch,
  ] = useState("");

  const [pagination, setPagination] =
    useState<Pagination>({
      total: 0,
      totalPages: 1,
      currentPage: 1,
      limit: 12,
    });

  /* SEARCH */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(
        searchTerm
      );
    }, 500);

    return () =>
      clearTimeout(timer);
  }, [searchTerm]);

  /* FETCH */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);

        setError("");

        const page = Number(
          search.page || 1
        );

        const limit =
          pagination.limit;

        const offset =
          (page - 1) * limit;

        const queryParams =
          new URLSearchParams({
            limit:
              String(limit),

            offset:
              String(offset),

            ...(debouncedSearch && {
              search:
                debouncedSearch,
            }),
          });

        const response =
          await apiJson<ContactsResponse>(
            `/contact?${queryParams}`
          );

        if (cancelled) return;

        setContacts(
          response.data ??
            []
        );

        if (
          response.pagination
        ) {
          setPagination({
            total:
              response
                .pagination
                .total ?? 0,

            totalPages:
              response
                .pagination
                .totalPages ??
              1,

            currentPage:
              response
                .pagination
                .currentPage ??
              1,

            limit:
              response
                .pagination
                .limit ?? 12,
          });
        }
      } catch (err) {
        if (cancelled)
          return;

        setError(
          "Failed to load contacts"
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
    search.page,
    debouncedSearch,
  ]);

  /* LOADING */
  if (loading) {
    return (
      <ContactsSkeleton />
    );
  }

  /* ERROR */
  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Contact Messages
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage support &
              customer messages
            </p>
          </div>

          {/* SEARCH */}
          <div className="relative w-full sm:w-[260px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <Input
              placeholder="Search contacts..."
              value={
                searchTerm
              }
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
              className="h-11 rounded-2xl pl-10"
            />
          </div>
        </div>
      </section>

      {/* EMPTY */}
      {!contacts.length ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            No contacts found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            No messages available.
          </p>
        </div>
      ) : (
        <>
          {/* GRID */}
          <section
            className="
              grid grid-cols-1 gap-5
              md:grid-cols-2
              xl:grid-cols-3
            "
          >
            {contacts.map(
              (contact) => (
                <ContactCard
                  key={
                    contact._id
                  }
                  contact={
                    contact
                  }
                />
              )
            )}
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