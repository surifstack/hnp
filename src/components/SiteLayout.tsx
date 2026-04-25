import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { ShoppingCart, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import logo from "@/assets/logo.png";
import bg from "@/assets/background.png";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useCatalogStore } from "@/hooks/useCatalogStore";
import { useCartStore } from "@/hooks/useCartStore";
import { CartSheet } from "@/components/cart/CartSheet";

interface SiteLayoutProps {
  children: React.ReactNode;
  showTabs?: boolean;
  showLanguageSwitcher?: boolean;
}

export function SiteLayout({
  children,
  showTabs = true,
  showLanguageSwitcher = true,
}: SiteLayoutProps) {
  const { t } = useTranslation();
  const fetchProducts = useCatalogStore((s) => s.fetchProducts);
  const cartCount = useCartStore((s) => s.items.length);

  useEffect(() => {
    if (showTabs) {
      void fetchProducts();
    }
  }, [fetchProducts, showTabs]);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Top bar */}
      <header className="w-full px-4 pt-4 pb-3 sm:px-6">
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex items-center justify-between gap-2 mb-3">
            <Link
              to="/signin"
              className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide bg-black text-white px-3 py-1.5 rounded-full"
            >
              <User className="h-3.5 w-3.5" />
              {t("common.signIn")}
            </Link>
            <CartSheet
              trigger={
                <button
                  type="button"
                  className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide bg-black text-white px-3 py-1.5 rounded-full"
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  {t("common.cart")}
                  {cartCount > 0 && (
                    <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-[10px] font-extrabold text-black">
                      {cartCount}
                    </span>
                  )}
                </button>
              }
            />
          </div>

          {/* Logo centered */}
          <Link to="/" className="block mx-auto w-full max-w-md">
            <img src={logo} alt="Hot Neon Posters" className="w-full h-auto" />
          </Link>

          {/* Product tab */}
          {showTabs && (
            <nav className="mt-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:justify-center">
                <Link
                  to="/products"
                  className="shrink-0 px-4 py-2 text-xs font-extrabold uppercase tracking-widest bg-white/90 text-black rounded-full border-2 border-black shadow"
                 
                >
                  {t("common.products", { defaultValue: "Products" })}
                </Link>
            
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 px-4 py-4 sm:px-6">
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </main>

      {/* Footer */}
      <footer className="w-full px-4 py-4 mt-6 sm:px-6">
        <div className="mx-auto w-full max-w-6xl flex justify-between items-center text-[10px] uppercase tracking-widest font-semibold">
          <Link to="/contact" className="text-black hover:underline">
            {t("common.contact")}
          </Link>
          <Link to="/dashboard" className="text-black hover:underline">
            {t("common.dashboard")}
          </Link>
        </div>
      </footer>

      {showLanguageSwitcher && (
        <div className="fixed bottom-4 right-4 z-50">
          <LanguageSwitcher />
        </div>
      )}
    </div>
  );
}
