import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-md mx-auto my-4">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search products..."
        className="border rounded-l px-4 py-2 w-full"
      />
      <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded-r">
        Search
      </button>
    </form>
  );
};

export default SearchBar; 