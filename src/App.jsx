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
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-center py-8">DevMovies</h1>
      
      <SearchBar onSearch={handleSearch} />
      
      {loading && <p className="text-center p-8">Loading...</p>}
      
      {error && <p className="text-center p-8 text-red-500">{error}</p>}
      
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
        <p className="text-center p-8">No movies found. Try another search.</p>
      )}
      
      <MovieModal 
        imdbID={selectedMovieId}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default App;

