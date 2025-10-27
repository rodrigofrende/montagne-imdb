function MovieCard({ movie, onClick }) {
  const poster = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image';

  return (
    <div 
      onClick={onClick}
      className="border border-gray-300 p-4 cursor-pointer"
    >
      <img 
        src={poster} 
        alt={movie.Title}
        className="w-full h-64 object-cover"
      />
      <h3 className="mt-2 font-bold">{movie.Title}</h3>
      <p className="text-gray-600">{movie.Year}</p>
    </div>
  );
}

export default MovieCard;

