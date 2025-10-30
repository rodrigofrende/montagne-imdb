import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import SearchBar from './components/SearchBar';
import MovieGrid from './components/MovieGrid';
import Pagination from './components/Pagination';
import { searchMovies, ErrorType } from './services/omdbApi';
import { useLocalStorage, useAbortController } from './hooks';

// Lazy load MovieModal for better performance
const MovieModal = lazy(() => import('./components/MovieModal'));

const LOADING_MESSAGES = [
  "🎬 Preparing the red carpet...",
  "🎥 Rolling the cameras...",
  "🍿 Popping fresh popcorn...",
  "🎭 Opening the curtains...",
  "🎞️ Loading the reels...",
  "✨ Adding movie magic...",
  "🎪 Setting up the premiere...",
  "🌟 Spotlighting the stars...",
  "📽️ Adjusting the projector...",
  "🎨 Painting the scenes...",
];

const MOVIE_COLLECTIONS = [
  {
    name: "Sci-Fi Classics",
    terms: ["Matrix", "Blade Runner", "Alien", "Terminator", "Star Wars"]
  },
  {
    name: "Action Heroes",
    terms: ["Die Hard", "John Wick", "Mad Max", "Bourne", "Mission Impossible"]
  },
  {
    name: "Epic Adventures",
    terms: ["Lord of the Rings", "Pirates Caribbean", "Indiana Jones", "Jurassic"]
  },
  {
    name: "Comic Book Universe",
    terms: ["Avengers", "Batman", "Spider-Man", "Iron Man", "Superman"]
  },
  {
    name: "Modern Thrillers",
    terms: ["Inception", "Interstellar", "Shutter Island", "Prestige", "Memento"]
  },
  {
    name: "Animated Favorites",
    terms: ["Toy Story", "Shrek", "Finding Nemo", "Lion King", "Frozen"]
  },
  {
    name: "Horror Classics",
    terms: ["Conjuring", "Insidious", "Exorcist", "Shining", "Nightmare"]
  },
  {
    name: "Comedy Gems",
    terms: ["Hangover", "Superbad", "Bridesmaids", "Anchorman", "Step Brothers"]
  }
];

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorType, setErrorType] = useState(null);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [internalSearchTerm, setInternalSearchTerm] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const [currentCollection, setCurrentCollection] = useState(null);
  const hasFetchedRef = useRef(false);
  
  // Use improved localStorage with options
  const [recentSearches, setRecentSearches] = useLocalStorage(
    'devmovies-recent-searches', 
    [],
    { maxItems: 5, dedupe: true, normalize: true }
  );
  
  // AbortController for cancelling requests
  const { getSignal, abort } = useAbortController();

  useEffect(() => {
    if (hasFetchedRef.current) return;

    const randomCollection = MOVIE_COLLECTIONS[Math.floor(Math.random() * MOVIE_COLLECTIONS.length)];
    const randomTerm = randomCollection.terms[Math.floor(Math.random() * randomCollection.terms.length)];
    
    const fetchInitialMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        setErrorType(null);
        setCurrentCollection(randomCollection.name);
        setInternalSearchTerm(randomTerm);
        
        const signal = getSignal();
        const data = await searchMovies(randomTerm, 1, signal);
        setMovies(data.Search || []);
        setTotalResults(parseInt(data.totalResults) || 0);
        setCurrentPage(1);
        hasFetchedRef.current = true;
      } catch (err) {
        if (err.type !== ErrorType.ABORTED) {
          setError(err.message);
          setErrorType(err.type || ErrorType.UNKNOWN);
          setMovies([]);
          setTotalResults(0);
          hasFetchedRef.current = true;
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialMovies();
  }, []);

  const fetchMoviesInternal = async (term, page) => {
    try {
      setLoading(true);
      setError(null);
      setErrorType(null);
      
      const data = await searchMovies(term, page, getSignal());
      setMovies(data.Search || []);
      setTotalResults(parseInt(data.totalResults) || 0);
      setCurrentPage(page);
    } catch (err) {
      // Don't show error if request was aborted
      if (err.type !== ErrorType.ABORTED) {
        setError(err.message);
        setErrorType(err.type || ErrorType.UNKNOWN);
        setMovies([]);
        setTotalResults(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term, page = 1) => {
    setSearchTerm(term);
    setInternalSearchTerm(term);
    setHasSearched(true);
    setIsInitialLoad(false);
    
    if (page === 1) {
      const trimmedTerm = term.trim();
      setRecentSearches(prev => {
        const filtered = prev.filter(s => s.toLowerCase() !== trimmedTerm.toLowerCase());
        return [trimmedTerm, ...filtered].slice(0, 5);
      });
    }
    
    await fetchMoviesInternal(term, page);
  };

  const handlePageChange = (newPage) => {
    fetchMoviesInternal(internalSearchTerm, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMovieClick = (imdbID) => {
    setSelectedMovieId(imdbID);
  };

  const handleCloseModal = () => {
    setSelectedMovieId(null);
  };

  useEffect(() => {
    if (!loading) return;
    
    const randomIndex = Math.floor(Math.random() * LOADING_MESSAGES.length);
    setLoadingMessage(LOADING_MESSAGES[randomIndex]);
    
    const interval = setInterval(() => {
      setLoadingMessage(prev => {
        const currentIndex = LOADING_MESSAGES.indexOf(prev);
        const nextIndex = (currentIndex + 1) % LOADING_MESSAGES.length;
        return LOADING_MESSAGES[nextIndex];
      });
    }, 1500);
    
    return () => clearInterval(interval);
  }, [loading]);

  const handleLogoClick = async () => {
    let randomCollection;
    do {
      randomCollection = MOVIE_COLLECTIONS[Math.floor(Math.random() * MOVIE_COLLECTIONS.length)];
    } while (randomCollection.name === currentCollection && MOVIE_COLLECTIONS.length > 1);
    
    const randomTerm = randomCollection.terms[Math.floor(Math.random() * randomCollection.terms.length)];
    
    try {
      setLoading(true);
      setError(null);
      setErrorType(null);
      setSearchTerm('');
      setInternalSearchTerm(randomTerm);
      setHasSearched(false);
      setIsInitialLoad(false);
      setCurrentCollection(randomCollection.name);
      setCurrentPage(1);
      
      const data = await searchMovies(randomTerm, 1, getSignal());
      setMovies(data.Search || []);
      setTotalResults(parseInt(data.totalResults) || 0);
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      if (err.type !== ErrorType.ABORTED) {
        setError(err.message);
        setErrorType(err.type || ErrorType.UNKNOWN);
        setMovies([]);
        setTotalResults(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = async () => {
    let randomCollection;
    do {
      randomCollection = MOVIE_COLLECTIONS[Math.floor(Math.random() * MOVIE_COLLECTIONS.length)];
    } while (randomCollection.name === currentCollection && MOVIE_COLLECTIONS.length > 1);
    
    const randomTerm = randomCollection.terms[Math.floor(Math.random() * randomCollection.terms.length)];
    
    try {
      setLoading(true);
      setError(null);
      setErrorType(null);
      setSearchTerm('');
      setInternalSearchTerm(randomTerm);
      setHasSearched(false);
      setCurrentCollection(randomCollection.name);
      setCurrentPage(1);
      
      const data = await searchMovies(randomTerm, 1, getSignal());
      setMovies(data.Search || []);
      setTotalResults(parseInt(data.totalResults) || 0);
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      if (err.type !== ErrorType.ABORTED) {
        setError(err.message);
        setErrorType(err.type || ErrorType.UNKNOWN);
        setMovies([]);
        setTotalResults(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClearRecentSearches = () => {
    setRecentSearches([]);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzFhMWExYSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
      
      <div className="relative z-10">
        <header className="sticky top-0 z-50 border-b border-red-600/10 bg-black/95 shadow-lg">
          <div className="mx-auto w-full max-w-7xl px-6 py-2 md:px-12 md:py-3">
            <button 
              onClick={handleLogoClick}
              className="mx-auto flex cursor-pointer items-center justify-center gap-3 transition-[transform,opacity] duration-200 ease-out hover:scale-105 hover:opacity-80 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:ring-offset-2 focus:ring-offset-black rounded-lg px-4 py-2"
              aria-label="Go to home and load new recommendations"
            >
              <span className="text-2xl md:text-3xl">🎬</span>
              <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                <span className="text-red-600">Dev</span>Movies
              </h1>
            </button>
          </div>
        </header>
        
        <main className="mx-auto w-full max-w-[1400px] px-6 py-6 md:px-12 md:py-8">
          <SearchBar 
            onSearch={handleSearch} 
            hasSearched={hasSearched}
            value={searchTerm}
            onClear={handleClearSearch}
            recentSearches={recentSearches}
            onClearRecent={handleClearRecentSearches}
          />
          
          {loading && (
            <div 
              className="flex flex-col items-center justify-center space-y-4 p-12"
              role="status"
              aria-live="polite"
              aria-busy="true"
            >
              <div className="relative h-16 w-16">
                <div className="absolute inset-0 rounded-full border-4 border-red-600/30"></div>
                <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-red-600"></div>
              </div>
              <p className="text-lg text-gray-300 animate-pulse-subtle transition-all duration-500" key={loadingMessage}>
                {loadingMessage}
              </p>
              <span className="sr-only">Loading movies...</span>
            </div>
          )}
          
          {error && (
            <div 
              className="mx-auto mt-12 max-w-2xl rounded-2xl border border-red-600/30 bg-gradient-to-br from-red-600/10 via-red-600/5 to-transparent p-8 shadow-lg animate-fade-in"
              role="alert"
              aria-live="polite"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-600/20 ring-4 ring-red-600/10">
                  <span className="text-4xl" aria-hidden="true">
                    {errorType === ErrorType.NETWORK ? '🌐' : 
                     errorType === ErrorType.RATE_LIMIT ? '⏱️' : 
                     errorType === ErrorType.SERVER ? '🔧' : 
                     errorType === ErrorType.NO_RESULTS ? '🎭' : '⚠️'}
                  </span>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-red-400">
                  {errorType === ErrorType.NETWORK ? 'Connection Error' : 
                   errorType === ErrorType.RATE_LIMIT ? 'Too Many Requests' : 
                   errorType === ErrorType.SERVER ? 'Server Error' : 
                   errorType === ErrorType.NO_RESULTS ? 'No Results Found' :
                   errorType === ErrorType.TOO_BROAD ? 'Search Too Broad' : 'Search Error'}
                </h3>
                <p className="text-base leading-relaxed text-gray-300">{error}</p>
                
                {/* Action buttons based on error type */}
                <div className="mt-6 flex flex-wrap gap-3 justify-center">
                  {(errorType === ErrorType.NETWORK || errorType === ErrorType.SERVER || errorType === ErrorType.RATE_LIMIT) && (
                    <button
                      onClick={() => fetchMoviesInternal(internalSearchTerm, currentPage)}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600/50"
                      aria-label="Retry search"
                    >
                      🔄 Retry
                    </button>
                  )}
                  
                  {errorType === ErrorType.NO_RESULTS && (
                    <button
                      onClick={handleClearSearch}
                      className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-red-600/20 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-600/50"
                      aria-label="Discover new movies"
                    >
                      🎲 Discover Movies
                    </button>
                  )}
                </div>
                
                {/* Show suggestions if it's a "too broad" error */}
                {errorType === ErrorType.TOO_BROAD && (
                  <div className="mt-6 w-full rounded-xl border border-zinc-700/50 bg-zinc-900/50 p-4">
                    <p className="mb-3 text-sm font-medium text-gray-400">💡 Try these examples:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <button
                        onClick={() => handleSearch('Inception 2010')}
                        className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs text-gray-300 transition-colors hover:bg-red-600/20 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-600/50"
                        aria-label="Search for Inception 2010"
                      >
                        "Inception 2010"
                      </button>
                      <button
                        onClick={() => handleSearch('The Dark Knight')}
                        className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs text-gray-300 transition-colors hover:bg-red-600/20 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-600/50"
                        aria-label="Search for The Dark Knight"
                      >
                        "The Dark Knight"
                      </button>
                      <button
                        onClick={() => handleSearch('Avengers Endgame')}
                        className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs text-gray-300 transition-colors hover:bg-red-600/20 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-600/50"
                        aria-label="Search for Avengers Endgame"
                      >
                        "Avengers Endgame"
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {!loading && !error && movies.length > 0 && (
            <>
              {!hasSearched && currentCollection && (
                <div className="mb-6 rounded-xl border border-red-600/20 bg-gradient-to-r from-red-600/10 via-red-600/5 to-transparent px-6 py-4 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {isInitialLoad ? '✨' : '🎲'}
                    </span>
                    <div>
                      <h2 className="text-lg font-semibold text-white">
                        {isInitialLoad ? 'Our Selection for You' : 'Discover More'}
                      </h2>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {currentCollection}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {hasSearched && (
                <div className="mb-6 flex items-center justify-between rounded-xl border border-red-600/10 bg-zinc-900/50 px-4 py-3 animate-fade-in">
                  <p className="text-sm text-gray-400">
                    Found <span className="font-semibold text-white">{totalResults.toLocaleString()}</span> {totalResults === 1 ? 'result' : 'results'}
                    {searchTerm && (
                      <>
                        {' '}for <span className="font-medium text-red-500">"{searchTerm}"</span>
                      </>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">
                    Page {currentPage} of {Math.ceil(totalResults / 12)}
                  </p>
                </div>
              )}
              
              <MovieGrid movies={movies} onMovieClick={handleMovieClick} />
              <Pagination 
                currentPage={currentPage}
                totalResults={totalResults}
                onPageChange={handlePageChange}
              />
            </>
          )}
          
          {!loading && !error && movies.length === 0 && searchTerm && (
            <div 
              className="mx-auto mt-16 max-w-md rounded-2xl border border-red-600/10 bg-zinc-900/80 p-10 text-center shadow-lg animate-fade-in"
              role="status"
              aria-live="polite"
            >
              <p className="mb-6 text-6xl" aria-hidden="true">🎭</p>
              <p className="text-xl font-medium text-white">No movies found</p>
              <p className="mt-3 text-sm text-gray-400">
                We couldn't find any movies matching <span className="font-medium text-red-500">"{searchTerm}"</span>
              </p>
              <p className="mt-2 text-xs text-gray-500">Try different keywords or check your spelling</p>
            </div>
          )}
        </main>
        
        <footer className="mt-20 border-t border-zinc-800/50 py-10 text-center text-sm text-gray-600">
          <p className="font-light">Powered by OMDb API • Coded by <a href="https://github.com/rodrigofrende" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">Rodrigo Frende</a></p>
        </footer>
      </div>
      
      <Suspense fallback={null}>
        <MovieModal 
          imdbID={selectedMovieId}
          onClose={handleCloseModal}
        />
      </Suspense>
    </div>
  );
}

export default App;

