'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (city: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full max-w-md mx-auto mb-8"
      aria-label="Search for a city"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a city..."
        className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white/20 transition-all"
        aria-label="City search input"
      />
      <button
        type="submit"
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
        aria-label="Perform search"
      >
        <Search size={20} />
      </button>
    </form>
  );
};

export default SearchBar;
