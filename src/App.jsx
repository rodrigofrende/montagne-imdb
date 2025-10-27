import { useState, useEffect, useRef } from 'react';
import SearchBar from './components/SearchBar';
import MovieGrid from './components/MovieGrid';
import MovieModal from './components/MovieModal';
import Pagination from './components/Pagination';
import { searchMovies } from './services/omdbApi';

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const randomTerms = ['action', 'love', 'war', 'star', 'life', 'time', 'hero'];
    const randomTerm = randomTerms[Math.floor(Math.random() * randomTerms.length)];
    
    const fetchInitialMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        setSearchTerm(randomTerm);
        
        const data = await searchMovies(randomTerm, 1);
        setMovies(data.Search || []);
        setTotalResults(parseInt(data.totalResults) || 0);
        setCurrentPage(1);
      } catch (err) {
        setError(err.message);
        setMovies([]);
        setTotalResults(0);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialMovies();
  }, []);

  const handleSearch = async (term, page = 1) => {
    try {
      setLoading(true);
      setError(null);
      setSearchTerm(term);
      
      const data = await searchMovies(term, page);
      setMovies(data.Search || []);
      setTotalResults(parseInt(data.totalResults) || 0);
      setCurrentPage(page);
    } catch (err) {
      setError(err.message);
      setMovies([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    handleSearch(searchTerm, newPage);
  };

  const handleMovieClick = (imdbID) => {
    setSelectedMovieId(imdbID);
  };

  const handleCloseModal = () => {
    setSelectedMovieId(null);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzFhMWExYSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
      
      <div className="relative z-10">
        <header className="sticky top-0 z-50 border-b border-red-600/10 bg-black/80 shadow-lg shadow-black/50 backdrop-blur-md">
          <div className="mx-auto w-full max-w-7xl px-6 py-4 md:px-12 md:py-5">
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl md:text-3xl">🎬</span>
              <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                <span className="text-red-600">Dev</span>Movies
              </h1>
            </div>
          </div>
        </header>
        
        <main className="mx-auto w-full max-w-[1400px] px-6 py-8 md:px-12 md:py-10">
          <SearchBar onSearch={handleSearch} />
          
          {loading && (
            <div className="flex flex-col items-center justify-center space-y-4 p-12">
              <div className="relative h-16 w-16">
                <div className="absolute inset-0 rounded-full border-4 border-red-600/30"></div>
                <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-red-600"></div>
              </div>
              <p className="text-lg text-gray-300">Loading amazing movies...</p>
            </div>
          )}
          
          {error && (
            <div className="mx-auto mt-8 max-w-md rounded-xl border border-red-600/50 bg-red-600/10 p-6 backdrop-blur-sm">
              <p className="flex items-center justify-center gap-2 text-center text-red-400">
                <span className="text-2xl">⚠️</span>
                <span>{error}</span>
              </p>
            </div>
          )}
          
          {!loading && !error && movies.length > 0 && (
            <>
              <MovieGrid movies={movies} onMovieClick={handleMovieClick} />
              <Pagination 
                currentPage={currentPage}
                totalResults={totalResults}
                onPageChange={handlePageChange}
              />
            </>
          )}
          
          {!loading && !error && movies.length === 0 && searchTerm && (
            <div className="mx-auto mt-16 max-w-md rounded-2xl border border-red-600/10 bg-zinc-900/50 p-10 text-center shadow-xl backdrop-blur-sm">
              <p className="mb-6 text-6xl">🔍</p>
              <p className="text-xl font-medium text-white">No movies found</p>
              <p className="mt-3 text-sm text-gray-400">Try searching with different keywords</p>
            </div>
          )}
        </main>
        
        <footer className="mt-20 border-t border-zinc-800/50 py-10 text-center text-sm text-gray-600">
          <p className="font-light">Powered by OMDb API • Built with React & Tailwind CSS</p>
        </footer>
      </div>
      
      <MovieModal 
        imdbID={selectedMovieId}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default App;

