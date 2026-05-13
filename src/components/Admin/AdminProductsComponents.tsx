// AdminProductsComponents.tsx

import {
  Search,
 
} from "lucide-react";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { useAdminProductsStore } from "@/hooks/useAdminProductsStore";

import { ProductCard, ProductsSkeleton } from "../Helpers/AdminProductHelper";

/* ================= PAGE ================= */

export function AdminProductsComponents() {
  const products =
    useAdminProductsStore(
      (s) => s.products
    );

  const loading =
    useAdminProductsStore(
      (s) => s.loading
    );

  const error =
    useAdminProductsStore(
      (s) => s.error
    );

  

  const fetchProducts =
    useAdminProductsStore(
      (s) => s.fetchProducts
    );

  const toggleHidden =
    useAdminProductsStore(
      (s) => s.toggleHidden
    );

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    void fetchProducts();
  }, []);

  const filteredProducts = (
    products ?? []
  ).filter((product) =>
    product.name
      .toLowerCase()
      .includes(
        search.toLowerCase()
      )
  );

  if (loading) {
    return (
      <ProductsSkeleton />
    );
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
              Product Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage all products
              and visibility
            </p>
          </div>

          {/* SEARCH */}
          <div className="relative w-full sm:w-[280px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <Input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search products..."
              className="h-11 rounded-2xl border-slate-200 pl-10"
            />
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredProducts.map(
          (product) => (
            <ProductCard
              key={product.id}
              product={product}
              hidden={product.isAvailable}
              onToggle={() =>
                toggleHidden(
                  product.id,
                  !product.isAvailable
                )
              }
            />
          )
        )}
      </section>

      {/* EMPTY */}
      {!filteredProducts.length && (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            No products found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            No product available.
          </p>
        </div>
      )}
    </div>
  );
}


