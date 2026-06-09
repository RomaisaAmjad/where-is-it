import React from 'react';
import { ChevronLeft, ChevronRight } from 'tabler-icons-react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <nav
      className="flex items-center justify-between px-4 py-3 sm:px-6 mt-6 border-t border-granny-panel/30"
      aria-label="Pagination Navigation"
    >
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="relative inline-flex items-center rounded-xl border border-granny-panel px-4 py-2.5 text-sm font-semibold tracking-wide text-granny-text bg-granny-canvas hover:bg-granny-panel/30 transition-smooth disabled:opacity-40 disabled:pointer-events-none"
        >
          Previous
        </button>
        <div className="flex items-center text-sm font-medium text-granny-text tracking-wide">
          Page {currentPage} of {totalPages}
        </div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="relative ml-3 inline-flex items-center rounded-xl border border-granny-panel px-4 py-2.5 text-sm font-semibold tracking-wide text-granny-text bg-granny-canvas hover:bg-granny-panel/30 transition-smooth disabled:opacity-40 disabled:pointer-events-none"
        >
          Next
        </button>
      </div>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-granny-text/80 tracking-wide font-medium">
            Showing page <span className="font-bold text-granny-text">{currentPage}</span> of{' '}
            <span className="font-bold text-granny-text">{totalPages}</span>
          </p>
        </div>
        <div>
          <span className="relative inline-flex gap-1.5 shadow-sm rounded-xl">
            {/* Previous Button */}
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="relative inline-flex items-center rounded-xl border border-granny-panel p-2.5 text-granny-text bg-granny-canvas hover:bg-granny-panel/30 transition-smooth focus:z-20 disabled:opacity-40 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-granny-salmon"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Page number indicators */}
            {Array.from({ length: totalPages }, (_, idx) => {
              const pageNum = idx + 1;
              const isActive = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative inline-flex items-center justify-center w-10 h-10 text-sm font-bold tracking-wide rounded-xl transition-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-granny-salmon ${
                    isActive
                      ? 'bg-granny-salmon text-white shadow-md'
                      : 'border border-granny-panel text-granny-text hover:bg-granny-panel/30'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Next Button */}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="relative inline-flex items-center rounded-xl border border-granny-panel p-2.5 text-granny-text bg-granny-canvas hover:bg-granny-panel/30 transition-smooth focus:z-20 disabled:opacity-40 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-granny-salmon"
              aria-label="Next Page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </span>
        </div>
      </div>
    </nav>
  );
}
