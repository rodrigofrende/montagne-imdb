function Pagination({ currentPage, totalResults, onPageChange }) {
  const totalPages = Math.ceil(totalResults / 10);

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  return (
    <nav 
      className="flex flex-wrap items-center justify-center gap-3 py-12"
      aria-label="Pagination navigation"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-6 py-3 bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/50 text-gray-300 rounded-xl font-medium transition-all duration-300 hover:bg-red-600 hover:border-red-600/30 hover:text-white hover:scale-[1.02] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-zinc-900/60 shadow-xl"
        aria-label="Previous page"
      >
        ← Previous
      </button>
      
      <div className="flex items-center gap-2">
        {getPageNumbers().map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-4 text-gray-600 font-light">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`min-w-[48px] h-12 rounded-xl font-medium transition-all duration-300 shadow-xl ${
                currentPage === page
                  ? 'bg-red-600 text-white scale-105 shadow-red-600/40'
                  : 'bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/50 text-gray-300 hover:bg-red-600/30 hover:border-red-600/30 hover:scale-[1.02]'
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
        className="px-6 py-3 bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/50 text-gray-300 rounded-xl font-medium transition-all duration-300 hover:bg-red-600 hover:border-red-600/30 hover:text-white hover:scale-[1.02] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-zinc-900/60 shadow-xl"
        aria-label="Next page"
      >
        Next →
      </button>
      
      <div className="w-full text-center mt-6">
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

