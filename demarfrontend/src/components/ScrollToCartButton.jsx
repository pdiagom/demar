// src/components/ScrollToCartButton.jsx
import React from 'react';

const ScrollToCartButton = () => {
  const scrollToCart = () => {
    const cartElement = document.querySelector('.cart-container');
    if (cartElement) {
      cartElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <button className="scroll-to-cart-button" onClick={scrollToCart}>
      Ir al Carrito
    </button>
  );
};

export default ScrollToCartButton;
