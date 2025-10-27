const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = 'https://www.omdbapi.com/';

export const searchMovies = async (searchTerm, page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}?apikey=${API_KEY}&s=${searchTerm}&page=${page}`
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

