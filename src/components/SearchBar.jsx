import { useState, useRef, useEffect } from 'react';

export default function SearchBar({
  onSearch,
  isLoading,
  onFocus,
  onUseLocation,
  recentSearches,
  favorites,
  onSelectRecent,
  onSelectFavorite,
}) {
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

  const handleUseMyLocation = () => {
    if (isLoading) return;
    setQuery('');
    onUseLocation();
  };

  return (
    <section className="rounded-2xl border-4 border-black bg-white p-4 shadow-[8px_8px_0_#111111]">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-extrabold tracking-wide text-black">City Search</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2 lg:grid-cols-[minmax(0,1fr)_auto_auto_auto] lg:items-stretch">
        <input
          ref={inputRef}
          id="search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={onFocus}
          placeholder="Search city (e.g. Mumbai, Delhi)"
          className="min-w-0 flex-1 rounded-xl border-3 border-black bg-white px-3 py-2 text-[15px] font-semibold text-black placeholder:text-black/50 focus:outline-none"
          disabled={isLoading}
          autoComplete="off"
        />
        <button
          id="search-button"
          type="submit"
          disabled={!query.trim() || isLoading}
          className="inline-flex items-center justify-center rounded-xl border-3 border-black bg-black px-4 py-2 text-sm font-extrabold text-white shadow-[3px_3px_0_#111111] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-xl border-3 border-black bg-[#fff7cc] px-4 py-2 text-sm font-extrabold text-black shadow-[3px_3px_0_#111111] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
        >
          Use My Location
        </button>
        {query && (
          <button
            type="button"
            onClick={clearQuery}
            className="inline-flex items-center justify-center rounded-xl border-3 border-black bg-white px-4 py-2 text-sm font-extrabold text-black shadow-[3px_3px_0_#111111] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
          >
            Clear
          </button>
        )}
      </form>

      {favorites.length > 0 && (
        <div className="mt-3">
          <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-black/70">Favorites</p>
          <div className="flex flex-wrap gap-2">
            {favorites.map((item) => (
              <button
                key={`${item.latitude}-${item.longitude}`}
                type="button"
                onClick={() => onSelectFavorite(item)}
                className="rounded-lg border-2 border-black bg-[#ecffef] px-2.5 py-1 text-xs font-extrabold text-black shadow-[2px_2px_0_#111111] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
              >
                {item.searchLabel || item.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {recentSearches.length > 0 && (
        <div className="mt-3">
          <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-black/70">Recent</p>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((item) => (
              <button
                key={`${item.latitude}-${item.longitude}`}
                type="button"
                onClick={() => onSelectRecent(item)}
                className="rounded-lg border-2 border-black bg-[#fff7cc] px-2.5 py-1 text-xs font-extrabold text-black shadow-[2px_2px_0_#111111] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
              >
                {item.searchLabel || item.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
