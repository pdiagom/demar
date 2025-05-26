// src/components/ScrollToCartButton.jsx
import React from 'react';
import carrito from '../../../media/media/carrito.png'; 
const ScrollToCartButton = () => {
  const scrollToCart = () => {
    const cartElement = document.querySelector('.cart-container');
    if (cartElement) {
      cartElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <button className="scroll-to-cart-button" onClick={scrollToCart}>
      <img src={carrito} alt="carrito" />
    </button>
  );
};

export default ScrollToCartButton;
