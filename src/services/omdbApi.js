const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = 'https://www.omdbapi.com/';
const RESULTS_PER_PAGE = 12;

export const searchMovies = async (searchTerm, virtualPage = 1) => {
  try {
    const startIndex = (virtualPage - 1) * RESULTS_PER_PAGE;
    const firstApiPage = Math.floor(startIndex / 10) + 1;
    const secondApiPage = firstApiPage + 1;
    const offsetInFirstPage = startIndex % 10;
    
    const firstResponse = await fetch(
      `${BASE_URL}?apikey=${API_KEY}&s=${searchTerm}&page=${firstApiPage}`
    );
    const firstData = await firstResponse.json();
    
    if (firstData.Response === 'False') {
      // Customize error messages for better UX
      if (firstData.Error === 'Too many results.') {
        throw new Error(`Your search "${searchTerm}" is too broad. Please be more specific (e.g., add year, full title, or more keywords).`);
      }
      throw new Error(firstData.Error);
    }
    
    let allMovies = firstData.Search || [];
    const totalResults = parseInt(firstData.totalResults) || 0;
    
    const moviesFromFirstPage = allMovies.slice(offsetInFirstPage);
    const moviesNeeded = RESULTS_PER_PAGE - moviesFromFirstPage.length;
    
    if (moviesNeeded > 0 && secondApiPage <= Math.ceil(totalResults / 10)) {
      const secondResponse = await fetch(
        `${BASE_URL}?apikey=${API_KEY}&s=${searchTerm}&page=${secondApiPage}`
      );
      const secondData = await secondResponse.json();
      
      if (secondData.Response === 'True' && secondData.Search) {
        const moviesFromSecondPage = secondData.Search.slice(0, moviesNeeded);
        allMovies = [...moviesFromFirstPage, ...moviesFromSecondPage];
      } else {
        allMovies = moviesFromFirstPage;
      }
    } else {
      allMovies = moviesFromFirstPage;
    }
    
    return {
      Search: allMovies,
      totalResults: totalResults.toString(),
      Response: 'True'
    };
  } catch (error) {
    throw error;
  }
};

export const getMovieDetails = async (imdbID) => {
  try {
    const response = await fetch(
      `${BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`
    );
    const data = await response.json();
    
    if (data.Response === 'False') {
      throw new Error(data.Error);
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

