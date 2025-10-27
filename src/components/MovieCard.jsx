function MovieCard({ movie, onClick }) {
  const poster = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image';

  return (
    <article 
      onClick={onClick}
      className="group relative w-full max-w-xs cursor-pointer overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-900/30 shadow-xl backdrop-blur-sm transition-all duration-500 hover:scale-[1.03] hover:border-red-600/30 hover:shadow-2xl hover:shadow-red-600/20 animate-fade-in"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={`View details for ${movie.Title}`}
    >
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
      
      <div className="relative aspect-[2/3] overflow-hidden">
        <img 
          src={poster} 
          alt={`${movie.Title} poster`}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        <div className="absolute right-4 top-4 z-20">
          <span className="rounded-full bg-red-600/95 px-3 py-1.5 text-xs font-medium text-white shadow-xl backdrop-blur-md">
            {movie.Year}
          </span>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
      </div>
      
      <div className="relative z-20 -mt-20 px-6 py-5 transition-transform duration-300 group-hover:-translate-y-2">
        <h3 className="mb-3 line-clamp-2 text-lg font-semibold leading-tight tracking-tight text-white drop-shadow-2xl">
          {movie.Title}
        </h3>
        <div className="mb-1 flex items-center gap-2 text-sm font-light text-gray-400">
          <span className="capitalize">{movie.Type}</span>
          {movie.Type && <span className="text-gray-600">•</span>}
          <span>{movie.Year}</span>
        </div>
        
        <div className="mt-5 opacity-0 transition-all duration-300 group-hover:opacity-100">
          <button className="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white shadow-xl transition-all duration-300 hover:bg-red-700 hover:shadow-red-600/50">
            View Details →
          </button>
        </div>
      </div>
    </article>
  );
}

export default MovieCard;

