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
      {/* Header */}
      <header className="w-full px-3 pt-4 pb-3 sm:px-6">
        <div className="mx-auto w-full max-w-6xl">
          {/* Top Bar */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <Link
              to="/signin"
              className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide bg-black text-white px-4 py-2 rounded-full whitespace-nowrap"
            >
              <User className="h-4 w-4" />
              {t("common.signIn")}
            </Link>

            <CartSheet
              trigger={
                <button
                  type="button"
                  className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide bg-black text-white px-4 py-2 rounded-full whitespace-nowrap"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {t("common.cart")}
                  {cartCount > 0 && (
                    <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-xs font-extrabold text-black">
                      {cartCount}
                    </span>
                  )}
                </button>
              }
            />
          </div>

          {/* Logo */}
          <Link to="/" className="block mx-auto text-center">
            <img
              src={logo}
              alt="Hot Neon Posters"
className="w-52 sm:w-64 md:w-80 lg:w-[420px] xl:w-[520px] mx-auto h-auto"            />
          </Link>

          {/* Tabs */}
          {showTabs && (
            <nav className="mt-5">
              <div className="flex justify-center sm:justify-center gap-3 overflow-x-auto pb-2 px-1 snap-x snap-mandatory">
                <Link
                  to="/products"
                  className="shrink-0 snap-start px-4 py-2 text-xs sm:text-sm font-bold uppercase tracking-widest bg-[var(--neon-green)] text-black rounded-full border-2 border-black shadow-md active:scale-95 transition-transform whitespace-nowrap"
                >
                  {t("common.products", { defaultValue: "Products" })}
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-3 py-3 sm:px-6">
        <div className="mx-auto w-full max-w-6xl">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-3 py-4 mt-6 sm:px-6">
        <div className="mx-auto w-full max-w-6xl flex justify-between items-center text-xs sm:text-sm uppercase tracking-widest font-semibold">
          <Link to="/contact" className="text-black hover:underline">
            {t("common.contact")}
          </Link>
          <Link to="/dashboard" className="text-black hover:underline">
            {t("common.dashboard")}
          </Link>
        </div>
      </footer>

      {/* Language Switcher */}
      {showLanguageSwitcher && (
        <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
          <LanguageSwitcher />
        </div>
      )}
    </div>
  );
}
