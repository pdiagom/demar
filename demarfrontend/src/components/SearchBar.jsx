import React, { useState, useCallback } from 'react';
import debounce from 'lodash.debounce';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce the search function
  const debouncedSearch = useCallback(
    debounce((term) => {
      onSearch(term);
    }, 300),
    [onSearch]
  );

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

  return (
    <div className="search-bar">
      <label htmlFor="search-input">Buscar artículos:</label>
      <input
        id="search-input"
        type="text"
        placeholder="Buscar por nombre"
        value={searchTerm}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchBar;