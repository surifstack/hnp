import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Search,
  Eye,
  Package,
  DollarSign,
  Hash,
  Boxes,
  Power,
} from "lucide-react";
import { formatMoney } from "./UserHelpers";

export function ProductsSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-28 rounded-3xl bg-muted" />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map(
          (i) => (
            <div
              key={i}
              className="h-80 rounded-3xl bg-muted"
            />
          )
        )}
      </div>
    </div>
  );
}


export function ProductCard({
  product,
  hidden,
  onToggle,
}: {
  product: any;

  hidden: boolean | undefined;

  onToggle: () => void;
}) {
  const skuList = Object.values(
    product.skus ?? {}
  );

  const visible = !hidden;

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
      {/* TOP BAR */}
      <div className="h-1 w-full bg-[var(--neon-green)]" />

      <div className="p-6">
        <div className="flex flex-col gap-5">
          {/* HEADER */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {product.name}
              </h3>

            
            </div>

            <div
              className={`rounded-full border px-3 py-1 text-xs font-bold uppercase ${
                visible
                  ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                  : "border-red-200 bg-red-100 text-red-700"
              }`}
            >
              {visible
                ? "Visible"
                : "Hidden"}
            </div>
          </div>

          {/* INFO */}
          <div className="grid grid-cols-1 gap-3 rounded-2xl bg-slate-50 p-4">
            

            <InfoCard
              icon={
                <Boxes className="h-4 w-4" />
              }
              label="SKUs"
              value={
                skuList.length
                  ? skuList.join(
                      ", "
                    )
                  : "—"
              }
            />

            <InfoCard
              icon={
                <DollarSign className="h-4 w-4" />
              }
              label="Price Per Set"
              value={formatMoney(
                product.pricing
                  ?.pricePerSetCents
              )}
            />

            <InfoCard
              icon={
                <Package className="h-4 w-4" />
              }
              label="Category"
              value={
                product.category ||
                "General"
              }
            />
          </div>

          {/* ACTIONS */}
          <div className="grid grid-cols-2 gap-3">
            {/* VIEW */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-2xl"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Button>
              </DialogTrigger>

              <DialogContent className="rounded-3xl sm:max-w-3xl">
                <DialogHeader>
                  <DialogTitle>
                    Product Details
                  </DialogTitle>

                  <DialogDescription>
                    Complete product
                    information
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-5">
                  {/* PRODUCT HEADER */}
                  <div className="rounded-3xl bg-[var(--neon-green)]/10 p-5">
                    <h2 className="text-2xl font-bold text-slate-900">
                      {
                        product.name
                      }
                    </h2>

                    <p className="mt-2 text-sm text-slate-600">
                      {
                        product.description
                      }
                    </p>
                  </div>

                  {/* DETAILS */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <StatCard
                      label="Slug"
                      value={
                        product.slug
                      }
                    />

                    <StatCard
                      label="Price"
                      value={formatMoney(
                        product
                          .pricing
                          ?.pricePerSetCents
                      )}
                    />

                    <StatCard
                      label="Visibility"
                      value={
                        visible
                          ? "Visible"
                          : "Hidden"
                      }
                    />

                    <StatCard
                      label="SKUs Count"
                      value={
                        skuList.length
                      }
                    />
                  </div>

                  {/* SKU LIST */}
                  <div className="rounded-3xl border border-slate-200 p-5">
                    <h3 className="text-lg font-bold text-slate-900">
                      Product SKUs
                    </h3>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {skuList.length ? (
                        skuList.map(
                          (
                            sku,
                            index
                          ) => (
                            <div
                              key={
                                index
                              }
                              className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700"
                            >
                              {String(
                                sku
                              )}
                            </div>
                          )
                        )
                      ) : (
                        <p className="text-sm text-slate-500">
                          No SKU
                          available
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* TOGGLE */}
            <Button
              variant="outline"
              className={`rounded-2xl ${
                visible
                  ? "border-red-200 text-red-600 hover:bg-red-50"
                  : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              }`}
              onClick={onToggle}
            >
              <Power className="mr-2 h-4 w-4" />

              {visible
                ? "Hide"
                : "Unhide"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}



/* ================= HELPERS ================= */

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
    <div className="flex items-center gap-3 rounded-xl bg-white p-3">
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

export function StatCard({
  label,
  value,
}: {
  label: string;

  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-3 text-lg font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}