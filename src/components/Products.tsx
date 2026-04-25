import { useEffect } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { useCatalogStore } from "@/hooks/useCatalogStore";
import { Link } from "@tanstack/react-router";


export function Products() {
  const fetchProducts = useCatalogStore((s) => s.fetchProducts);
   const products = useCatalogStore((s) => s.products);
   const loading = useCatalogStore((s) => s.loading);
   const error = useCatalogStore((s) => s.error);
 
 
   useEffect(() => {
     void fetchProducts();
   }, [fetchProducts]);

  return (
   <SiteLayout>
       <div className="space-y-6">
         <header className="bg-white rounded-2xl p-6 shadow-lg border">
           <h1 className="text-3xl font-extrabold">Products</h1>
           <p className="mt-2 text-sm text-gray-500">
             Explore our neon print products with full specs, pricing, and customization options.
           </p>
           {loading && <SkeletonList />}
           {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
         </header>
 
         <div className="space-y-5">
           {(products ?? []).map((p) => (
             <Link
               key={p.slug}
               to="/products/$slug"
               params={{ slug: p.slug }}
               className="block group"
             >
               <div className="flex flex-col lg:flex-row gap-6 bg-white rounded-2xl p-6 shadow-md border hover:shadow-xl transition">
                 {/* LEFT: Main Info */}
                 <div className="flex-1">
                   <div className="flex items-center justify-between">
                     <h2 className="text-xl font-bold">{p.name}</h2>
                     <span className="text-xs uppercase text-gray-400">
                       {p.id}
                     </span>
                   </div>
 
                   <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                     {p.description}
                   </p>
 
                   {/* Process Steps */}
                   {p.processSteps && (
                     <div className="mt-4">
                       <div className="text-xs font-semibold text-gray-400 uppercase mb-2">
                         How it works
                       </div>
                       <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                         {p.processSteps.slice(0, 2).map((step, i) => (
                           <li key={i}>{step}</li>
                         ))}
                       </ul>
                     </div>
                   )}
                 </div>
 
                 {/* RIGHT: Details Panel */}
                 <div className="w-full lg:w-64 space-y-4">
                   {/* Pricing */}
                   <div className="bg-gray-50 rounded-xl p-4 border">
                     <div className="text-xs uppercase text-gray-400 font-semibold">
                       Pricing
                     </div>
                     <div className="mt-2 text-lg font-bold">
                       ${(p.pricing?.pricePerSetCents ?? 0) / 100}
                     </div>
                     <div className="text-xs text-gray-500">
                       Shipping: ${(p.pricing?.shippingCents ?? 0) / 100}
                     </div>
                   </div>
 
                   {/* SKUs */}
                   <div className="bg-gray-50 rounded-xl p-4 border">
                     <div className="text-xs uppercase text-gray-400 font-semibold mb-2">
                       SKUs
                     </div>
                     <div className="grid grid-cols-3 gap-2 text-xs">
                       <SkuPill label="G" value={p.skus?.G ?? "—"} />
                       <SkuPill label="P" value={p.skus?.P ?? "—"} />
                       <SkuPill label="Y" value={p.skus?.Y ?? "—"} />
                     </div>
                   </div>
 
                   {/* CTA */}
                   <div className="text-sm font-semibold text-[var(--neon-green)] group-hover:underline">
                     View full details →
                   </div>
                 </div>
               </div>
             </Link>
           ))}
         </div>
       </div>
     </SiteLayout>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-5 animate-pulse">
      {[1,2,3,4].map((i) => (
        <div key={i} className="flex flex-col lg:flex-row gap-6 bg-white rounded-2xl p-6 shadow-md border">
          <div className="flex-1 space-y-3">
            <div className="h-5 w-1/3 bg-gray-200 rounded" />
            <div className="h-4 w-2/3 bg-gray-200 rounded" />
            <div className="h-4 w-1/2 bg-gray-200 rounded" />
            <div className="space-y-2 mt-4">
              <div className="h-3 w-24 bg-gray-200 rounded" />
              <div className="h-3 w-3/4 bg-gray-200 rounded" />
              <div className="h-3 w-2/3 bg-gray-200 rounded" />
            </div>
          </div>

          <div className="w-full lg:w-64 space-y-4">
            <div className="bg-gray-50 rounded-xl p-4 border space-y-2">
              <div className="h-3 w-16 bg-gray-200 rounded" />
              <div className="h-5 w-20 bg-gray-200 rounded" />
              <div className="h-3 w-24 bg-gray-200 rounded" />
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border space-y-2">
              <div className="h-3 w-16 bg-gray-200 rounded" />
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="h-6 bg-gray-200 rounded" />
                <div className="h-6 bg-gray-200 rounded" />
                <div className="h-6 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SkuPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border px-2 py-1 text-center bg-white">
      <span className="font-mono text-xs">
        {label}:{value}
      </span>
    </div>
  );
}
