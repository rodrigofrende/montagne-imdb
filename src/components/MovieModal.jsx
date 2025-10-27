import { useEffect, useState } from 'react';
import { getMovieDetails } from '../services/omdbApi';

function MovieModal({ imdbID, onClose }) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await getMovieDetails(imdbID);
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (imdbID) {
      fetchDetails();
    }
  }, [imdbID]);

  if (!imdbID) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white max-w-2xl w-full max-h-screen overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {loading && <p>Loading...</p>}
        
        {error && <p className="text-red-500">{error}</p>}
        
        {movie && (
          <div>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{movie.Title}</h2>
              <button 
                onClick={onClose}
                className="text-2xl px-3"
              >
                ×
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <img 
                src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image'}
                alt={movie.Title}
                className="w-full md:w-64"
              />
              
              <div className="flex-1">
                <p><strong>Year:</strong> {movie.Year}</p>
                <p><strong>Rated:</strong> {movie.Rated}</p>
                <p><strong>Runtime:</strong> {movie.Runtime}</p>
                <p><strong>Genre:</strong> {movie.Genre}</p>
                <p><strong>Director:</strong> {movie.Director}</p>
                <p><strong>Actors:</strong> {movie.Actors}</p>
                <p className="mt-4"><strong>Plot:</strong> {movie.Plot}</p>
                
                {movie.Ratings && movie.Ratings.length > 0 && (
                  <div className="mt-4">
                    <strong>Ratings:</strong>
                    <ul>
                      {movie.Ratings.map((rating, index) => (
                        <li key={index}>
                          {rating.Source}: {rating.Value}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieModal;

