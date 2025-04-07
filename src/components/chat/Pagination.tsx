"use client";

import type React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationPreview: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const generatePages = () => {
    const pages = [];

    pages.push(1);

    if (totalPages === 1) return pages;
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage <= 3) {
      endPage = Math.min(4, totalPages - 1);
    } else if (currentPage >= totalPages - 2) {
      startPage = Math.max(totalPages - 3, 2);
    }

    if (startPage > 2) {
      pages.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages - 1) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="flex items-center justify-center">
      {/* Previous button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center px-2 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded-sm ${
          currentPage === 1
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-700"
        }`}
        aria-label="Previous page"
      >
        {isMobile ? (
          <ChevronLeft className="w-4 h-4" />
        ) : (
          <>
            <ChevronLeft className="w-4 h-4 mr-1" />
            <span>Previous</span>
          </>
        )}
      </button>

      {/* Page numbers */}
      <div className="flex items-center mx-2 space-x-1 sm:space-x-2">
        {generatePages().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && handlePageChange(page)}
            disabled={page === "..."}
            className={`min-w-[28px] px-1 sm:min-w-[32px] h-8 flex items-center justify-center rounded-md text-sm cursor-pointer ${
              page === currentPage
                ? "bg-gray-900 text-white"
                : page === "..."
                ? "text-gray-500"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center px-2 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded-sm ${
          currentPage === totalPages
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-700"
        }`}
        aria-label="Next page"
      >
        {isMobile ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <>
            <span>Next</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </>
        )}
      </button>
    </div>
  );
};

export default PaginationPreview;
