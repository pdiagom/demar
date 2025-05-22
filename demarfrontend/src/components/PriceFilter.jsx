import React, { useState } from 'react';

const PriceFilter = ({ onPriceChange }) => {
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onPriceChange({ min: Number(min) || 0, max: Number(max) || Infinity });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        placeholder="Precio mínimo"
        value={min}
        onChange={(e) => setMin(e.target.value)}
      />
      <input
        type="number"
        placeholder="Precio máximo"
        value={max}
        onChange={(e) => setMax(e.target.value)}
      />
      <button type="submit">Aplicar filtro</button>
    </form>
  );
};

export default PriceFilter;