import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-12 py-4">
      {/* Prev Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2.5 rounded-none border border-slate-200 text-slate-600 transition-all cursor-pointer ${
          currentPage === 1
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-slate-100 hover:text-blue-600'
        }`}
      >
        <FiChevronLeft className="w-5 h-5" />
      </button>

      {/* Pages */}
      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`h-11 w-11 rounded-none font-bold text-sm transition-all cursor-pointer flex items-center justify-center ${
            currentPage === page
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-blue-600'
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2.5 rounded-none border border-slate-200 text-slate-600 transition-all cursor-pointer ${
          currentPage === totalPages
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-slate-100 hover:text-blue-600'
        }`}
      >
        <FiChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
