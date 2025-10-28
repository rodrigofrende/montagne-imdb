import { useState } from 'react';

function SearchBar({ onSearch, hasSearched }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto mb-8 w-full max-w-3xl animate-fade-in">
      <div className="group relative">
        <div className={`absolute inset-0 -z-10 rounded-2xl bg-red-600/20 transition-opacity duration-300 ${isFocused ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}></div>
        
        <div className="relative flex flex-col gap-2 rounded-2xl border border-red-600/10 bg-zinc-900/80 p-1.5 shadow-lg transition-[border-color] duration-200 hover:border-red-600/20 sm:flex-row">
          <div className="flex flex-1 items-center gap-3 pe-3 ps-4">
            <span className="text-xl opacity-60" role="img" aria-label="Search">🔍</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search movies by title..."
              className="flex-1 bg-transparent py-3 text-base font-light text-white outline-none placeholder:text-gray-500"
              required
              minLength="2"
              aria-label="Movie search input"
            />
          </div>
          
          <button 
            type="submit" 
            className="mx-1 whitespace-nowrap rounded-xl bg-red-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-[transform,background-color] duration-200 ease-out hover:scale-[1.02] hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:ring-offset-2 focus:ring-offset-black active:scale-95"
            aria-label="Search button"
          >
            Search
          </button>
        </div>
      </div>
      
      {!hasSearched && (
        <p className="mt-3 text-center text-xs font-light text-gray-600">
          Try: <span className="text-gray-500">"Inception"</span>, <span className="text-gray-500">"Marvel"</span>, <span className="text-gray-500">"Star Wars"</span>
        </p>
      )}
    </form>
  );
}

export default SearchBar;

