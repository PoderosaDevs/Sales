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

  const renderPageNumbers = () => {
    const maxButtons = 5;
    let startPage = 0;
    let endPage = totalPages;

    if (totalPages > maxButtons) {
      if (currentPage < Math.ceil(maxButtons / 2)) {
        endPage = maxButtons;
      } else if (currentPage >= totalPages - Math.floor(maxButtons / 2)) {
        startPage = totalPages - maxButtons;
      } else {
        startPage = currentPage - Math.floor(maxButtons / 2);
        endPage = currentPage + Math.floor(maxButtons / 2);
      }
    }

    const pageNumbers = Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => index + startPage
    );

    return pageNumbers.map((pageNumber) => (
      <li key={pageNumber} className="page-item">
        <button
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            pageNumber === currentPage
              ? "bg-custom-bg-start text-white"
              : "bg-gray-200 text-gray-700"
          } hover:bg-custom-bg-start hover:text-white`}
          onClick={() => onPageChange(pageNumber, quantity)}
        >
          {pageNumber + 1}
        </button>
      </li>
    ));
  };

  const onPageChange = (page: number, quantity: number) => {
    setPagesInfo(page < 0 ? 0 : page, quantity);
  };

  return (
    <nav aria-label="Pagination" className="w-full flex items-center justify-end py-4">
      <div className="flex items-center mr-6">
        <label htmlFor="quantity-select" className="text-gray-700 mr-2">
          Quantidade:
        </label>
        <select
          id="quantity-select"
          className="border border-gray-300 rounded-md p-2 text-gray-700 bg-white"
          value={quantity}
          onChange={handleQuantityChange}
        >
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
      <ul className="flex items-center space-x-2">
        <li>
          <button
            disabled={!hasPreviousPage}
            className={`px-1 py-1 rounded-md text-sm font-medium ${
              !hasPreviousPage
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setPagesInfo(0, quantity)}
          >
            <BiChevronsLeft className="w-5 h-5" />
          </button>
        </li>
        <li>
          <button
            disabled={!hasPreviousPage}
            className={`px-1 py-1 rounded-md text-sm font-medium ${
              !hasPreviousPage
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setPagesInfo(pagesInfo.currentPage - 1, quantity)}
          >
            <BiChevronLeft className="w-5 h-5" />
          </button>
        </li>

        {renderPageNumbers()}

        <li>
          <button
            disabled={!hasNextPage}
            className={`px-1 py-1 rounded-md text-sm font-medium ${
              !hasNextPage
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setPagesInfo(pagesInfo.currentPage + 1, quantity)}
          >
            <BiChevronRight className="w-5 h-5" />
          </button>
        </li>
        <li>
          <button
            disabled={!hasNextPage}
            className={`px-1 py-1 rounded-md text-sm font-medium ${
              !hasNextPage
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setPagesInfo(pagesInfo.totalPages, quantity)}
          >
            <BiChevronsRight className="w-5 h-5" />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default PaginationComponent;
