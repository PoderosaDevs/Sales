import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { PageInfo } from "../types";

export function Pagination({
  pageInfo,
  onChange,
}: {
  pageInfo: PageInfo;
  onChange: (pagina: number) => void;
}) {
  if (pageInfo.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-4 pt-6">
      <span className="text-xs text-gray-500 font-medium">
        Página {pageInfo.currentPage + 1} de {pageInfo.totalPages} · {pageInfo.totalItems} itens
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(pageInfo.currentPage - 1)}
          disabled={!pageInfo.hasPreviousPage}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-300 disabled:opacity-30 hover:bg-white/10 transition-all"
        >
          <IoChevronBack size={16} />
        </button>
        <button
          onClick={() => onChange(pageInfo.currentPage + 1)}
          disabled={!pageInfo.hasNextPage}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-300 disabled:opacity-30 hover:bg-white/10 transition-all"
        >
          <IoChevronForward size={16} />
        </button>
      </div>
    </div>
  );
}
