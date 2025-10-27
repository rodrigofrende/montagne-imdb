import MovieCard from './MovieCard';

function MovieGrid({ movies, onMovieClick }) {
  if (movies.length === 0) {
    return <p className="text-center p-8">No movies found</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {movies.map((movie) => (
        <MovieCard 
          key={movie.imdbID} 
          movie={movie} 
          onClick={() => onMovieClick(movie.imdbID)}
        />
      ))}
    </div>
  );
}

export default MovieGrid;

