import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [term, setTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(term);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Buscar por nombre"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
      <button type="submit">Buscar</button>
    </form>
  );
};

export default SearchBar;