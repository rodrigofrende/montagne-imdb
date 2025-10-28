function Pagination({ currentPage, totalResults, onPageChange }) {
  const RESULTS_PER_PAGE = 12;
  const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = window.innerWidth < 640 ? 3 : 5; // Menos páginas en mobile
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (window.innerWidth < 640) {
        // Mobile: mostrar solo página actual y vecinas
        if (currentPage <= 2) {
          pages.push(1, 2, 3, '...', totalPages);
        } else if (currentPage >= totalPages - 1) {
          pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
        } else {
          pages.push(1, '...', currentPage, '...', totalPages);
        }
      } else {
        // Desktop: mostrar más páginas
        if (currentPage <= 3) {
          pages.push(1, 2, 3, 4, '...', totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
          pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
        }
      }
    }
    
    return pages;
  };

  return (
    <nav 
      className="py-8 md:py-12 px-4"
      aria-label="Pagination navigation"
    >
      {/* Info de página - Arriba en mobile */}
      <div className="text-center mb-4 md:hidden">
        <p className="text-gray-500 text-xs font-light">
          Page <span className="text-white font-medium">{currentPage}</span> of <span className="text-white font-medium">{totalPages}</span>
          <span className="text-gray-600 mx-2">•</span>
          <span className="text-gray-400">{totalResults.toLocaleString()} results</span>
        </p>
      </div>

      {/* Controles de paginación */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-full sm:w-auto px-6 py-3 bg-zinc-900/80 border border-zinc-800/50 text-gray-300 rounded-xl font-medium transition-[transform,background-color,border-color] duration-200 ease-out hover:bg-red-600 hover:border-red-600/30 hover:text-white hover:scale-[1.02] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-zinc-900/80 shadow-lg"
          aria-label="Previous page"
        >
          ← Previous
        </button>
        
        <div className="flex items-center justify-center gap-1.5 sm:gap-2">
          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="px-2 sm:px-3 text-gray-600 font-light text-sm">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`min-w-[40px] sm:min-w-[48px] h-10 sm:h-12 text-sm sm:text-base rounded-lg sm:rounded-xl font-medium transition-[transform,background-color,border-color] duration-200 ease-out shadow-lg ${
                  currentPage === page
                    ? 'bg-red-600 text-white scale-105 shadow-red-600/40'
                    : 'bg-zinc-900/80 border border-zinc-800/50 text-gray-300 hover:bg-red-600/30 hover:border-red-600/30 hover:scale-[1.02]'
                }`}
                aria-label={`Go to page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            )
          ))}
        </div>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-full sm:w-auto px-6 py-3 bg-zinc-900/80 border border-zinc-800/50 text-gray-300 rounded-xl font-medium transition-[transform,background-color,border-color] duration-200 ease-out hover:bg-red-600 hover:border-red-600/30 hover:text-white hover:scale-[1.02] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-zinc-900/80 shadow-lg"
          aria-label="Next page"
        >
          Next →
        </button>
      </div>

      {/* Info de página - Abajo en desktop */}
      <div className="hidden md:block text-center mt-6">
        <p className="text-gray-500 text-sm font-light">
          Showing page <span className="text-white font-medium">{currentPage}</span> of <span className="text-white font-medium">{totalPages}</span> 
          <span className="text-gray-600 mx-2">•</span>
          <span className="text-gray-400">{totalResults.toLocaleString()} results</span>
        </p>
      </div>
    </nav>
  );
}

export default Pagination;

