import { buildApiUrl } from '../config/api';

const RESULTS_PER_PAGE = 10;

// Error types for better error handling
export const ErrorType = {
  NETWORK: 'NETWORK_ERROR',
  RATE_LIMIT: 'RATE_LIMIT_ERROR',
  SERVER: 'SERVER_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  TOO_BROAD: 'TOO_BROAD',
  NO_RESULTS: 'NO_RESULTS',
  ABORTED: 'ABORTED',
  UNKNOWN: 'UNKNOWN_ERROR',
};

/**
 * Custom error class for API errors
 */
class ApiError extends Error {
  constructor(message, type, statusCode = null, retryable = false) {
    super(message);
    this.name = 'ApiError';
    this.type = type;
    this.statusCode = statusCode;
    this.retryable = retryable;
  }
}

/**
 * Retry logic with exponential backoff
 */
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry if not retryable
      if (error instanceof ApiError && !error.retryable) {
        throw error;
      }
      
      // Don't retry if aborted
      if (error.name === 'AbortError') {
        throw error;
      }
      
      // Last attempt, throw error
      if (attempt === maxRetries - 1) {
        throw error;
      }
      
      // Exponential backoff: 1s, 2s, 4s...
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

/**
 * Handle fetch response and errors
 */
async function handleResponse(response, searchTerm = '') {
  // Handle network errors
  if (!response.ok) {
    // Rate limit (429)
    if (response.status === 429) {
      throw new ApiError(
        'Too many requests. Please wait a moment and try again.',
        ErrorType.RATE_LIMIT,
        429,
        true // Retryable
      );
    }
    
    // Server errors (5xx)
    if (response.status >= 500) {
      throw new ApiError(
        'Server is experiencing issues. Please try again later.',
        ErrorType.SERVER,
        response.status,
        true // Retryable
      );
    }
    
    // Client errors (4xx)
    if (response.status === 401) {
      throw new ApiError(
        'Invalid API key. Please check your configuration.',
        ErrorType.NETWORK,
        401,
        false
      );
    }
    
    throw new ApiError(
      `HTTP Error ${response.status}`,
      ErrorType.NETWORK,
      response.status,
      false
    );
  }
  
  const data = await response.json();
  
  // Handle OMDb API errors
  if (data.Response === 'False') {
    const errorMsg = data.Error || 'Unknown error';
    
    // Too many results
    if (errorMsg === 'Too many results.') {
      throw new ApiError(
        `Your search "${searchTerm}" is too broad. Please be more specific (e.g., add year, full title, or more keywords).`,
        ErrorType.TOO_BROAD,
        null,
        false
      );
    }
    
    // Movie not found
    if (errorMsg === 'Movie not found!' || errorMsg.includes('not found')) {
      throw new ApiError(
        `No results found for "${searchTerm}". Try different keywords or check your spelling.`,
        ErrorType.NO_RESULTS,
        null,
        false
      );
    }
    
    // Incorrect IMDb ID
    if (errorMsg.includes('Incorrect IMDb ID')) {
      throw new ApiError(
        'Invalid movie ID. The movie may no longer be available.',
        ErrorType.NOT_FOUND,
        null,
        false
      );
    }
    
    // Generic error
    throw new ApiError(
      errorMsg,
      ErrorType.UNKNOWN,
      null,
      false
    );
  }
  
  return data;
}

/**
 * Search movies with pagination
 * @param {string} searchTerm - Search query
 * @param {number} virtualPage - Page number (12 results per page)
 * @param {AbortSignal} signal - AbortController signal for cancellation
 */
export const searchMovies = async (searchTerm, virtualPage = 1, signal = null) => {
  // Validate input
  if (!searchTerm || searchTerm.trim().length < 2) {
    throw new ApiError(
      'Search term must be at least 2 characters long.',
      ErrorType.UNKNOWN,
      null,
      false
    );
  }

  const fetchFn = async () => {
    try {
      const startIndex = (virtualPage - 1) * RESULTS_PER_PAGE;
      const firstApiPage = Math.floor(startIndex / 10) + 1;
      const secondApiPage = firstApiPage + 1;
      const offsetInFirstPage = startIndex % 10;
      
      const fetchOptions = signal ? { signal } : {};
      
      const firstUrl = buildApiUrl({ s: searchTerm, page: firstApiPage });
      const firstResponse = await fetch(firstUrl, fetchOptions);
      
      const firstData = await handleResponse(firstResponse, searchTerm);
      
      let allMovies = firstData.Search || [];
      const totalResults = parseInt(firstData.totalResults) || 0;
      
      // Validate pagination bounds
      const maxPages = Math.ceil(totalResults / RESULTS_PER_PAGE);
      if (virtualPage > maxPages && maxPages > 0) {
        throw new ApiError(
          `Page ${virtualPage} does not exist. Maximum page is ${maxPages}.`,
          ErrorType.NOT_FOUND,
          null,
          false
        );
      }
      
      const moviesFromFirstPage = allMovies.slice(offsetInFirstPage);
      const moviesNeeded = RESULTS_PER_PAGE - moviesFromFirstPage.length;
      
      if (moviesNeeded > 0 && secondApiPage <= Math.ceil(totalResults / 10)) {
        const secondUrl = buildApiUrl({ s: searchTerm, page: secondApiPage });
        const secondResponse = await fetch(secondUrl, fetchOptions);
        const secondData = await handleResponse(secondResponse, searchTerm);
        
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
      // Handle AbortError
      if (error.name === 'AbortError') {
        throw new ApiError(
          'Request was cancelled.',
          ErrorType.ABORTED,
          null,
          false
        );
      }
      
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError(
          'Network error. Please check your internet connection.',
          ErrorType.NETWORK,
          null,
          true
        );
      }
      
      // Re-throw ApiError
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Unknown error
      throw new ApiError(
        error.message || 'An unexpected error occurred.',
        ErrorType.UNKNOWN,
        null,
        false
      );
    }
  };

  // Retry for retryable errors (rate limit, server errors, network errors)
  return retryWithBackoff(fetchFn, 3, 1000);
};

/**
 * Get movie details by IMDb ID
 * @param {string} imdbID - IMDb ID
 * @param {AbortSignal} signal - AbortController signal for cancellation
 */
export const getMovieDetails = async (imdbID, signal = null) => {
  const fetchFn = async () => {
    try {
      const fetchOptions = signal ? { signal } : {};
      
      const url = buildApiUrl({ i: imdbID, plot: 'full' });
      const response = await fetch(url, fetchOptions);
      
      return await handleResponse(response, imdbID);
    } catch (error) {
      // Handle AbortError
      if (error.name === 'AbortError') {
        throw new ApiError(
          'Request was cancelled.',
          ErrorType.ABORTED,
          null,
          false
        );
      }
      
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError(
          'Network error. Please check your internet connection.',
          ErrorType.NETWORK,
          null,
          true
        );
      }
      
      // Re-throw ApiError
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Unknown error
      throw new ApiError(
        error.message || 'An unexpected error occurred.',
        ErrorType.UNKNOWN,
        null,
        false
      );
    }
  };

  // Retry for retryable errors
  return retryWithBackoff(fetchFn, 2, 1000);
};

