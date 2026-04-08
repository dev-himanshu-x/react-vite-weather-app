import { useState, useRef, useEffect } from 'react';

export default function SearchBar({ onSearch, isLoading, onFocus }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  const clearQuery = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <section className="rounded-xl border-4 border-black bg-white p-4 shadow-[8px_8px_0_#111111]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
        <input
          ref={inputRef}
          id="search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={onFocus}
          placeholder="Enter city name"
          className="min-w-0 flex-1 rounded-lg border-4 border-black bg-[#f4f7ff] px-3 py-2 text-[15px] text-black placeholder:text-black/50 focus:outline-none focus:ring-0"
          disabled={isLoading}
          autoComplete="off"
        />
        <button
          id="search-button"
          type="submit"
          disabled={!query.trim() || isLoading}
          className="inline-flex items-center justify-center rounded-lg border-4 border-black bg-[#ff5d73] px-4 py-2 text-sm font-bold text-black shadow-[3px_3px_0_#111111] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
        {query && (
          <button
            type="button"
            onClick={clearQuery}
            className="inline-flex items-center justify-center rounded-lg border-4 border-black bg-white px-4 py-2 text-sm font-bold text-black shadow-[3px_3px_0_#111111]"
          >
            Clear
          </button>
        )}
      </form>

    </section>
  );
}
