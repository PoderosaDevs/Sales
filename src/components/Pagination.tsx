import React, { useEffect, useState } from "react";
import {
  BiChevronLeft,
  BiChevronRight,
  BiChevronsLeft,
  BiChevronsRight,
} from "react-icons/bi";

export interface PageInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

interface PaginationProps {
  pagesInfo: PageInfo;
  setPagesInfo: (page: number, quantity: number) => void;
}

const PaginationComponent: React.FC<PaginationProps> = ({
  pagesInfo,
  setPagesInfo,
}) => {
  const { currentPage, totalPages, hasNextPage, hasPreviousPage } = pagesInfo;

  const [quantity, setQuantity] = useState(() => {
    const storedQuantity = localStorage.getItem("selectedQuantity");
    return storedQuantity ? parseInt(storedQuantity) : 10;
  });

  useEffect(() => {
    localStorage.setItem("selectedQuantity", String(quantity));
    setPagesInfo(currentPage, quantity);
  }, [quantity]); 

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedQuantity = parseInt(e.target.value);
    setQuantity(selectedQuantity);
  };

  const onPageChange = (page: number, quantity: number) => {
    setPagesInfo(page < 0 ? 0 : page, quantity);
  };

  const renderPageNumbers = () => {
    const maxButtons = 5;
    let startPage = 0;
    let endPage = totalPages - 1; // Ajuste para índice 0

    if (totalPages > maxButtons) {
      if (currentPage < Math.ceil(maxButtons / 2)) {
        endPage = maxButtons - 1;
      } else if (currentPage >= totalPages - Math.floor(maxButtons / 2)) {
        startPage = totalPages - maxButtons;
      } else {
        startPage = currentPage - Math.floor(maxButtons / 2);
        endPage = currentPage + Math.floor(maxButtons / 2);
      }
    }

    const pageNumbers = Array.from(
      { length: Math.max(0, endPage - startPage + 1) },
      (_, index) => index + startPage
    );

    return pageNumbers.map((pageNumber) => (
      <li key={pageNumber}>
        <button
          className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-black transition-all duration-200 ${
            pageNumber === currentPage
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20 active:scale-95"
              : "bg-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300 border border-white/5"
          }`}
          onClick={() => onPageChange(pageNumber, quantity)}
        >
          {pageNumber + 1}
        </button>
      </li>
    ));
  };

  return (
    <nav aria-label="Pagination" className="w-full flex flex-col md:flex-row items-center justify-between gap-6 py-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* SELETOR DE QUANTIDADE */}
      <div className="flex items-center gap-3 order-2 md:order-1">
        <label htmlFor="quantity-select" className="text-[10px] font-black text-gray-500 uppercase tracking-[2px]">
          Exibir:
        </label>
        <div className="relative group">
            <select
              id="quantity-select"
              className="bg-[#0a0a0c] border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-gray-300 outline-none focus:ring-1 focus:ring-emerald-500/40 appearance-none cursor-pointer pr-10 transition-all hover:border-white/20"
              value={quantity}
              onChange={handleQuantityChange}
            >
              <option value={10}>10 linhas</option>
              <option value={15}>15 linhas</option>
              <option value={20}>20 linhas</option>
              <option value={50}>50 linhas</option>
              <option value={100}>100 linhas</option>
            </select>
            {/* Ícone customizado para o select */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600">
                <BiChevronRight className="rotate-90" size={16} />
            </div>
        </div>
        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest ml-2">
            Total: {pagesInfo.totalItems}
        </span>
      </div>

      {/* NAVEGAÇÃO DE PÁGINAS */}
      <ul className="flex items-center gap-2 order-1 md:order-2">
        {/* Ir para início */}
        <li>
          <button
            disabled={!hasPreviousPage}
            className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all ${
              !hasPreviousPage
                ? "bg-transparent border-white/5 text-gray-800 cursor-not-allowed"
                : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-emerald-500"
            }`}
            onClick={() => onPageChange(0, quantity)}
            title="Primeira página"
          >
            <BiChevronsLeft size={20} />
          </button>
        </li>

        {/* Anterior */}
        <li>
          <button
            disabled={!hasPreviousPage}
            className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all ${
              !hasPreviousPage
                ? "bg-transparent border-white/5 text-gray-800 cursor-not-allowed"
                : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-emerald-500"
            }`}
            onClick={() => onPageChange(currentPage - 1, quantity)}
            title="Anterior"
          >
            <BiChevronLeft size={20} />
          </button>
        </li>

        {/* Números das Páginas */}
        {renderPageNumbers()}

        {/* Próximo */}
        <li>
          <button
            disabled={!hasNextPage}
            className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all ${
              !hasNextPage
                ? "bg-transparent border-white/5 text-gray-800 cursor-not-allowed"
                : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-emerald-500"
            }`}
            onClick={() => onPageChange(currentPage + 1, quantity)}
            title="Próxima"
          >
            <BiChevronRight size={20} />
          </button>
        </li>

        {/* Última página */}
        <li>
          <button
            disabled={!hasNextPage}
            className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all ${
              !hasNextPage
                ? "bg-transparent border-white/5 text-gray-800 cursor-not-allowed"
                : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-emerald-500"
            }`}
            onClick={() => onPageChange(totalPages - 1, quantity)}
            title="Última página"
          >
            <BiChevronsRight size={20} />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default PaginationComponent;