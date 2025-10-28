import { useState, useRef, useEffect, useCallback } from 'react';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';

function SearchBar({ onSearch, hasSearched, value = '', onClear, recentSearches = [], onClearRecent }) {
  const [searchTerm, setSearchTerm] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showRecent, setShowRecent] = useState(false);
  const inputRef = useRef(null);

  // Sync with external value prop
  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
      setHasInteracted(true);
    }
  };

  const handleClear = useCallback(() => {
    setSearchTerm('');
    if (onClear) {
      onClear();
    }
    // Focus the input after clearing
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, [onClear]);

  // Keyboard shortcut: "/" to focus search input
  const handleSlashKey = useCallback(() => {
    if (document.activeElement !== inputRef.current) {
      inputRef.current?.focus();
    }
  }, []);

  useKeyboardShortcut('/', handleSlashKey);

  // Keyboard shortcut: "Escape" to clear search
  const handleEscapeKey = useCallback(() => {
    if (document.activeElement === inputRef.current && searchTerm) {
      handleClear();
    }
  }, [searchTerm, handleClear]);

  useKeyboardShortcut('Escape', handleEscapeKey);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (!hasInteracted && e.target.value.length > 0) {
      setHasInteracted(true);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    setShowRecent(true);
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding to allow clicks on recent searches
    setTimeout(() => setShowRecent(false), 200);
  };

  const handleRecentClick = (search) => {
    setSearchTerm(search);
    setShowRecent(false);
    onSearch(search);
  };

  const handleClearRecent = useCallback(() => {
    if (onClearRecent) {
      onClearRecent();
    }
    setShowRecent(false);
  }, [onClearRecent]);

  return (
    <form onSubmit={handleSubmit} className="mx-auto mb-8 w-full max-w-3xl animate-fade-in relative">
      <div className="group relative">
        <div className={`absolute inset-0 -z-10 rounded-2xl bg-red-600/20 transition-opacity duration-300 ${isFocused ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}></div>
        
        <div className="relative flex flex-col gap-2 rounded-2xl border border-red-600/10 bg-zinc-900/80 p-1.5 shadow-lg transition-[border-color] duration-200 hover:border-red-600/20 sm:flex-row">
          <div className="flex flex-1 items-center gap-3 pe-3 ps-4">
            <span className="text-xl opacity-60" role="img" aria-label="Search">🔍</span>
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="Search movies by title..."
              className="flex-1 bg-transparent py-3 text-base font-light text-white outline-none placeholder:text-gray-500"
              required
              minLength="2"
              aria-label="Movie search input"
              title="Press '/' to focus, 'Escape' to clear"
            />
            
            {/* Keyboard shortcut hint - only show when not focused and no text */}
            {!isFocused && !searchTerm && (
              <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-zinc-700 bg-zinc-800/50 px-2 py-1 text-xs text-gray-500 animate-fade-in">
                <span>/</span>
              </kbd>
            )}
            
            {/* Clear button - appears when there's text */}
            {searchTerm && (
              <button
                type="button"
                onClick={handleClear}
                className="group/clear flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-zinc-800/80 text-gray-400 transition-all duration-200 hover:bg-zinc-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-600/50 active:scale-90 animate-slide-in"
                aria-label="Clear search"
              >
                <svg 
                  className="h-4 w-4 transition-transform duration-200 group-hover/clear:rotate-90" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          <button 
            type="submit" 
            className="mx-1 whitespace-nowrap rounded-xl bg-red-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-[transform,background-color] duration-200 ease-out hover:scale-[1.02] hover:cursor-pointer hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:ring-offset-2 focus:ring-offset-black active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            aria-label="Search button"
            disabled={!searchTerm.trim() || searchTerm.trim().length < 2}
          >
            Search
          </button>
        </div>
      </div>
      
      {/* Show hint only if user hasn't searched and hasn't interacted with the input */}
      {!hasSearched && !hasInteracted && (
        <p className="mt-3 text-center text-xs font-light text-gray-600 animate-fade-in">
          Try: <span className="text-gray-500">"Inception"</span>, <span className="text-gray-500">"Marvel"</span>, <span className="text-gray-500">"Star Wars"</span>
        </p>
      )}
      
      {/* Recent searches dropdown - positioned absolutely */}
      {showRecent && recentSearches.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-xl border border-zinc-700/50 bg-zinc-900/95 backdrop-blur-sm shadow-xl animate-fade-in">
          <div className="px-4 py-2 border-b border-zinc-700/30 flex items-center justify-between">
            <p className="text-xs font-medium text-gray-400">Recent Searches</p>
            <button
              type="button"
              onClick={handleClearRecent}
              className="text-xs text-gray-500 hover:text-red-400 transition-colors duration-200 px-2 py-1 rounded hover:bg-red-600/10 focus:outline-none focus:ring-2 focus:ring-red-600/50"
              aria-label="Clear recent searches"
            >
              Clear
            </button>
          </div>
          <div className="py-1 max-h-60 overflow-y-auto">
            {recentSearches.slice(0, 5).map((search, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleRecentClick(search)}
                className="w-full px-4 py-2.5 text-left text-sm text-gray-300 transition-colors hover:bg-red-600/10 hover:text-white flex items-center gap-2 group"
              >
                <span className="text-gray-600 group-hover:text-red-500 transition-colors">🕐</span>
                <span className="flex-1 truncate">{search}</span>
                <span className="text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">↵</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}

export default SearchBar;

