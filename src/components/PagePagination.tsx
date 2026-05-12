import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useSearch } from "@tanstack/react-router";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

export function PagePagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  const navigate = useNavigate();

  const search = useSearch({
    strict: false,
  });

  const generatePages = () => {
    const pages: (number | string)[] = [];

    pages.push(1);

    // LEFT DOTS
    if (currentPage > 4) {
      pages.push("...");
    }

    // CENTER PAGES
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }

    // RIGHT DOTS
    if (currentPage < totalPages - 3) {
      pages.push("...");
    }

    // LAST PAGE
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return [...new Set(pages)];
  };

  const pages = generatePages();

  const goToPage = (page: number) => {
    navigate({
      search: {
        ...search,
        page,
      },
    });
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {/* PREVIOUS */}
      <button
        disabled={currentPage === 1}
        onClick={() =>
          goToPage(currentPage - 1)
        }
        className="
          flex h-10 w-10 items-center justify-center
          rounded-2xl border border-slate-200
          bg-white text-slate-700
          transition-all hover:bg-slate-100
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* PAGE BUTTONS */}
      {pages.map((page, index) => {
        if (page === "...") {
          return (
            <div
              key={`dots-${index}`}
              className="
                flex h-10 min-w-[40px]
                items-center justify-center
                text-sm font-semibold text-slate-400
              "
            >
              ...
            </div>
          );
        }

        const active = currentPage === page;

        return (
          <button
            key={page}
            onClick={() =>
              goToPage(Number(page))
            }
            className={`
              flex h-10 min-w-[40px]
              items-center justify-center
              rounded-2xl border text-sm
              font-bold transition-all

              ${
                active
                  ? `
                    border-[var(--neon-green)]
                    bg-[var(--neon-green)]
                    text-black shadow-lg
                  `
                  : `
                    border-slate-200 bg-white
                    text-slate-700 hover:bg-slate-100
                  `
              }
            `}
          >
            {page}
          </button>
        );
      })}

      {/* NEXT */}
      <button
        disabled={currentPage === totalPages}
        onClick={() =>
          goToPage(currentPage + 1)
        }
        className="
          flex h-10 w-10 items-center justify-center
          rounded-2xl border border-slate-200
          bg-white text-slate-700
          transition-all hover:bg-slate-100
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}