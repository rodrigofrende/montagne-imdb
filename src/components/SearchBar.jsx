import { useState } from 'react';

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto p-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for movies..."
          className="flex-1 p-2 border border-gray-300"
          required
          minLength="2"
        />
        <button 
          type="submit" 
          className="px-6 py-2 bg-blue-500 text-white"
        >
          Search
        </button>
      </div>
    </form>
  );
}

export default SearchBar;

