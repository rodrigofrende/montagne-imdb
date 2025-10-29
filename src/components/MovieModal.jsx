import { useEffect, useState, useRef } from 'react';
import { getMovieDetails, ErrorType } from '../services/omdbApi';
import { useFocusTrap, useAbortController } from '../hooks';

function MovieModal({ imdbID, onClose }) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorType, setErrorType] = useState(null);
  const closeButtonRef = useRef(null);
  
  // Focus trap for accessibility
  const { trapRef } = useFocusTrap(!!imdbID);
  
  // AbortController for cancelling requests
  const { getSignal, abort } = useAbortController();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        setErrorType(null);
        
        const data = await getMovieDetails(imdbID, getSignal());
        setMovie(data);
      } catch (err) {
        // Don't show error if request was aborted
        if (err.type !== ErrorType.ABORTED) {
          setError(err.message);
          setErrorType(err.type || ErrorType.UNKNOWN);
        }
      } finally {
        setLoading(false);
      }
    };

    if (imdbID) {
      fetchDetails();
      // Lock body scroll when modal is open
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      // Restore body scroll and padding
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
      // Cancel pending request
      abort();
    };
  }, [imdbID]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 animate-fade-in md:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div 
        ref={trapRef}
        className="relative w-full max-h-[95vh] max-w-6xl overflow-hidden rounded-2xl border border-zinc-800/50 bg-black shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {loading && (
          <div 
            className="flex flex-col items-center justify-center space-y-4 p-16"
            role="status"
            aria-live="polite"
            aria-busy="true"
          >
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 rounded-full border-4 border-red-600/20"></div>
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-red-600"></div>
            </div>
            <p className="font-light text-gray-300">Loading movie details...</p>
            <span className="sr-only">Loading movie information</span>
          </div>
        )}
        
        {error && (
          <div 
            className="p-16 text-center"
            role="alert"
            aria-live="assertive"
          >
            <div className="mb-4 flex items-center justify-center">
              <span className="text-6xl" aria-hidden="true">
                {errorType === ErrorType.NETWORK ? '🌐' : 
                 errorType === ErrorType.NOT_FOUND ? '🎭' : '⚠️'}
              </span>
            </div>
            <h3 className="mb-3 text-xl font-semibold text-red-400">
              {errorType === ErrorType.NETWORK ? 'Connection Error' : 
               errorType === ErrorType.NOT_FOUND ? 'Movie Not Found' : 'Error'}
            </h3>
            <p className="text-base text-gray-300 mb-6">{error}</p>
            <button 
              ref={closeButtonRef}
              onClick={onClose}
              className="rounded-xl bg-red-600 px-8 py-3 font-medium text-white transition-all duration-300 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600/50"
              aria-label="Close modal"
            >
              Close
            </button>
          </div>
        )}
        
        {movie && (
          <div className="relative flex max-h-[95vh] flex-col overflow-y-auto bg-zinc-950">
            <button 
              ref={closeButtonRef}
              onClick={onClose}
              className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800/50 bg-black/90 text-gray-300 shadow-lg transition-[transform,background-color,border-color] duration-200 ease-out hover:scale-110 hover:border-red-600/50 hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-600/50"
              aria-label="Close modal (Press Escape to close)"
              type="button"
            >
              <span aria-hidden="true">✕</span>
            </button>
            
            <div className="flex flex-col bg-zinc-950 md:flex-row">
              <div className="flex w-full items-center justify-center bg-black p-6 md:w-2/5 md:p-8 lg:w-1/3">
                <img 
                  src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image'}
                  alt={`${movie.Title} poster`}
                  className="h-auto w-full max-w-sm rounded-xl border border-zinc-800/50 object-cover shadow-2xl md:max-w-none"
                />
              </div>
              
              <div className="flex-1 bg-gradient-to-br from-zinc-950 to-black p-6 md:p-8 lg:p-10">
                <h2 id="modal-title" className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
                  {movie.Title}
                </h2>
                
                <div className="mb-5 flex flex-wrap items-center gap-2 md:gap-3">
                  <span className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-lg">
                    {movie.Year}
                  </span>
                  <span className="rounded-full bg-zinc-800/90 px-4 py-2 text-sm font-light text-gray-200">
                    {movie.Rated}
                  </span>
                  <span className="rounded-full bg-zinc-800/90 px-4 py-2 text-sm font-light text-gray-200">
                    {movie.Runtime}
                  </span>
                </div>
                
                {movie.Genre && (
                  <div className="mb-6 flex flex-wrap gap-2">
                    {movie.Genre.split(', ').map((genre) => (
                      <span 
                        key={genre}
                        className="rounded-full border border-red-600/20 bg-red-600/10 px-4 py-1.5 text-sm font-light text-red-300"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}
                
                {movie.Plot && movie.Plot !== 'N/A' && (
                  <div className="mt-6">
                    <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-red-500">Plot</h3>
                    <p className="text-base font-light leading-relaxed text-gray-300">{movie.Plot}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-6 bg-gradient-to-b from-black to-zinc-950 px-6 py-6 md:space-y-8 md:px-10 md:py-8">
              <div className="grid gap-4 sm:grid-cols-2 md:gap-5">
                {movie.Director && movie.Director !== 'N/A' && (
                  <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-5">
                    <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-red-500">Director</h3>
                    <p className="font-light text-white">{movie.Director}</p>
                  </div>
                )}
                
                {movie.Writer && movie.Writer !== 'N/A' && (
                  <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-5">
                    <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-red-500">Writer</h3>
                    <p className="font-light text-white">{movie.Writer}</p>
                  </div>
                )}
              </div>
              
              {movie.Actors && movie.Actors !== 'N/A' && (
                <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-5">
                  <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-red-500">Cast</h3>
                  <p className="font-light leading-relaxed text-white">{movie.Actors}</p>
                </div>
              )}
              
              {movie.Ratings && movie.Ratings.length > 0 && (
                <div>
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-red-500">Ratings</h3>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {movie.Ratings.map((rating, index) => (
                      <div 
                        key={index}
                        className="rounded-xl border border-zinc-800/40 bg-zinc-900/50 p-5 text-center transition-[border-color] duration-200 hover:border-red-600/30"
                      >
                        <div className="mb-2 text-3xl">{getRatingIcon(rating.Source)}</div>
                        <div className="mb-1 text-xl font-bold text-white">{rating.Value}</div>
                        <div className="text-xs font-light uppercase tracking-wider text-gray-500">{rating.Source}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {movie.Awards && movie.Awards !== 'N/A' && (
                <div className="rounded-xl border border-yellow-600/20 bg-gradient-to-r from-yellow-900/10 to-orange-900/10 p-5">
                  <h3 className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-yellow-400">
                    <span className="text-lg">🏆</span>
                    <span>Awards</span>
                  </h3>
                  <p className="font-light leading-relaxed text-yellow-100/80">{movie.Awards}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieModal;

