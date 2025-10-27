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
        setError(null);
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
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [imdbID]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (imdbID) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [imdbID, onClose]);

  if (!imdbID) return null;

  const getRatingIcon = (source) => {
    if (source.includes('IMDb')) return '⭐';
    if (source.includes('Rotten')) return '🍅';
    if (source.includes('Metacritic')) return '📊';
    return '🎯';
  };

  return (
    <div 
      className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-6 z-50 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="bg-gradient-to-br from-zinc-900/95 to-black border border-zinc-800/50 max-w-5xl w-full max-h-[92vh] overflow-y-auto rounded-3xl shadow-2xl shadow-black/80"
        onClick={(e) => e.stopPropagation()}
      >
        {loading && (
          <div className="flex flex-col items-center justify-center p-16 space-y-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-red-600/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-red-600 animate-spin"></div>
            </div>
            <p className="text-gray-300 font-light">Loading movie details...</p>
          </div>
        )}
        
        {error && (
          <div className="p-16 text-center">
            <p className="text-red-400 text-lg flex items-center justify-center gap-2">
              <span className="text-3xl">⚠️</span>
              <span>{error}</span>
            </p>
            <button 
              onClick={onClose}
              className="mt-8 px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-300 font-medium"
            >
              Close
            </button>
          </div>
        )}
        
        {movie && (
          <div className="relative">
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-black/70 backdrop-blur-md text-gray-300 hover:text-white hover:bg-red-600 transition-all duration-300 hover:scale-110 border border-zinc-800/50 hover:border-red-600/30 shadow-xl"
              aria-label="Close modal"
            >
              ✕
            </button>
            
            <div className="relative h-72 md:h-96 overflow-hidden rounded-t-3xl">
              <div 
                className="absolute inset-0 bg-cover bg-center blur-2xl scale-110"
                style={{ 
                  backgroundImage: movie.Poster !== 'N/A' ? `url(${movie.Poster})` : 'none',
                  backgroundColor: movie.Poster === 'N/A' ? '#0a0a0a' : undefined
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/30"></div>
              
              <div className="relative h-full flex items-end p-8 md:p-10">
                <div className="flex flex-col md:flex-row gap-8 w-full">
                  <img 
                    src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image'}
                    alt={`${movie.Title} poster`}
                    className="w-44 md:w-56 rounded-2xl shadow-2xl border border-zinc-800/50"
                  />
                  
                  <div className="flex-1">
                    <h2 id="modal-title" className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                      {movie.Title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 text-gray-300">
                      <span className="px-4 py-2 bg-red-600 backdrop-blur-md rounded-full text-sm font-medium text-white shadow-lg">
                        {movie.Year}
                      </span>
                      <span className="px-4 py-2 bg-zinc-800/70 backdrop-blur-md rounded-full text-sm font-light">
                        {movie.Rated}
                      </span>
                      <span className="px-4 py-2 bg-zinc-800/70 backdrop-blur-md rounded-full text-sm font-light">
                        {movie.Runtime}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-8 md:p-10 space-y-8">
              <div className="flex flex-wrap gap-3">
                {movie.Genre?.split(', ').map((genre) => (
                  <span 
                    key={genre}
                    className="px-5 py-2 bg-red-600/10 border border-red-600/20 text-red-300 rounded-full text-sm font-light"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-red-500 font-semibold mb-3 text-lg">Plot</h3>
                  <p className="text-gray-300 leading-relaxed text-base font-light">{movie.Plot}</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="bg-zinc-900/30 rounded-2xl p-6 border border-zinc-800/50">
                    <h3 className="text-red-500 font-medium mb-3 text-sm uppercase tracking-wider">Director</h3>
                    <p className="text-white font-light text-lg">{movie.Director}</p>
                  </div>
                  
                  <div className="bg-zinc-900/30 rounded-2xl p-6 border border-zinc-800/50">
                    <h3 className="text-red-500 font-medium mb-3 text-sm uppercase tracking-wider">Writer</h3>
                    <p className="text-white font-light text-lg">{movie.Writer}</p>
                  </div>
                </div>
                
                <div className="bg-zinc-900/30 rounded-2xl p-6 border border-zinc-800/50">
                  <h3 className="text-red-500 font-medium mb-3 text-sm uppercase tracking-wider">Cast</h3>
                  <p className="text-white font-light text-lg leading-relaxed">{movie.Actors}</p>
                </div>
                
                {movie.Ratings && movie.Ratings.length > 0 && (
                  <div>
                    <h3 className="text-red-500 font-semibold mb-5 text-lg">Ratings</h3>
                    <div className="grid sm:grid-cols-3 gap-5">
                      {movie.Ratings.map((rating, index) => (
                        <div 
                          key={index}
                          className="bg-gradient-to-br from-zinc-900/50 to-zinc-900/30 rounded-2xl p-6 border border-zinc-800/40 text-center hover:border-red-600/20 transition-all duration-300"
                        >
                          <div className="text-4xl mb-3">{getRatingIcon(rating.Source)}</div>
                          <div className="text-2xl font-bold text-white mb-2">{rating.Value}</div>
                          <div className="text-gray-500 text-xs font-light uppercase tracking-wider">{rating.Source}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {movie.Awards && movie.Awards !== 'N/A' && (
                  <div className="bg-gradient-to-r from-yellow-900/10 to-orange-900/10 border border-yellow-600/20 rounded-2xl p-6">
                    <h3 className="text-yellow-400 font-medium mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                      <span className="text-xl">🏆</span>
                      <span>Awards</span>
                    </h3>
                    <p className="text-yellow-100/80 font-light leading-relaxed">{movie.Awards}</p>
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

