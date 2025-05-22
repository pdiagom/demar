import React, { useState } from 'react';

const PriceFilter = ({ onPriceChange }) => {
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onPriceChange({ min: Number(min) || 0, max: Number(max) || Infinity });
  };

  return (
    <form className="price-filter" onSubmit={handleSubmit}>
      <input
        type="number"
        placeholder="Min €"
        value={min}
        onChange={(e) => setMin(e.target.value)}
      />
      <input
        type="number"
        placeholder="Max €"
        value={max}
        onChange={(e) => setMax(e.target.value)}
      />
      <button type="submit">Filtrar</button>
    </form>
  );
};

export default PriceFilter;
