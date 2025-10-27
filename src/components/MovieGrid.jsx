import MovieCard from './MovieCard';

function MovieGrid({ movies, onMovieClick }) {
  if (movies.length === 0) {
    return (
      <div className="text-center p-12">
        <p className="text-gray-400 text-lg">No movies found</p>
      </div>
    );
  }

  return (
    <section 
      className="w-full"
      role="list"
      aria-label="Movie results"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mb-16 place-items-center">
        {movies.map((movie, index) => (
          <MovieCard 
            key={movie.imdbID}
            movie={movie} 
            onClick={() => onMovieClick(movie.imdbID)}
            style={{ animationDelay: `${index * 0.05}s` }}
          />
        ))}
      </div>
    </section>
  );
}

export default MovieGrid;

