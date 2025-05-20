// src/components/GlobalSpinner.js
import React from 'react';
import { useLoading } from '../context/loadingContext';
import '../styles/GlobalSpinner.css';

const GlobalSpinner = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="global-spinner-overlay">
      <div className="global-spinner"></div>
    </div>
  );
};

export default GlobalSpinner;
