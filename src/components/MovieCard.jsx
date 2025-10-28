function MovieCard({ movie, onClick }) {
  const poster = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image';
  
  const getTypeLabel = (type) => {
    const labels = {
      'movie': 'Movie',
      'series': 'Series',
      'episode': 'Episode',
      'game': 'Game'
    };
    return labels[type.toLowerCase()] || type;
  };

  return (
    <article 
      onClick={onClick}
      className="group relative w-full max-w-xs cursor-pointer overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-900/50 shadow-lg transition-[transform,border-color,box-shadow] duration-300 ease-out will-change-transform hover:scale-[1.02] hover:border-red-600/30 hover:shadow-xl hover:shadow-red-600/10 animate-fade-in"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={`View details for ${movie.Title}`}
    >
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
      
      <div className="relative aspect-[2/3] overflow-hidden bg-black">
        <img 
          src={poster} 
          alt={`${movie.Title} poster`}
          className="block h-full w-full object-cover transition-transform duration-500 ease-out will-change-transform group-hover:scale-105"
          loading="lazy"
        />
        
        <div className="absolute right-4 top-4 z-20">
          <span className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-medium uppercase text-white shadow-lg">
            {getTypeLabel(movie.Type)}
          </span>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
      </div>
      
      <div className="relative z-20 -mt-16 min-h-[88px] bg-black px-6 py-4">
        <h3 className="mb-2 line-clamp-2 text-base font-semibold leading-tight tracking-tight text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.8)]">
          {movie.Title}
        </h3>
        <div className="flex items-center gap-2 text-sm font-light text-gray-400">
          <span>{movie.Year}</span>
        </div>
      </div>
    </article>
  );
}

export default MovieCard;

