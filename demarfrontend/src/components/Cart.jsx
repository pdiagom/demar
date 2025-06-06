// src/components/Cart.js

import React, { useState, useEffect } from "react";
import { useCart } from "../context/cartContext";
import cartService from "../services/cartService";
import { useNavigate } from "react-router-dom";
import articleService from "../services/articleService";
import { useRef } from "react";

const Cart = () => {
  const { state, dispatch } = useCart();
  const { cartItems, total } = state;
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const cartRef = useRef(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);

      // Limpia el timeout si el componente se desmonta o si error cambia
      return () => clearTimeout(timer);
    }
  }, [error]);
  const handleIncrease = async (article) => {
    try {
      const stock = await articleService.getStock(article.idArticle);
      const itemInCart = cartItems.find(
        (item) => item.article.idArticle === article.idArticle
      );
      const currentQuantity = itemInCart ? itemInCart.quantity : 0;

      if (currentQuantity < stock) {
        dispatch({ type: "ADD_TO_CART", payload: { article, quantity: 1 } });
      } else {
        setError(
          "No puedes añadir más unidades de este artículo. Stock insuficiente."
        );
      }
    } catch (error) {
      console.error("Error al obtener el stock:", error);
      setError("Error al verificar stock del artículo.");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleDecrease = (article) => {
    dispatch({ type: "DECREASE_QUANTITY", payload: article });
  };

  const handleRemove = (article) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: article });
  };

  const handleSaveCart = async () => {
    try {
      const response = await cartService.saveCart(cartItems);
      const cartId = response.cart_id;
      scrollToTop();
      setTimeout(() => {
        navigate(`/checkout/${cartId}`);
      }, 500); // Espera 500ms antes de redirigir
      dispatch({ type: "CLEAR_CART" });
    } catch (error) {
      console.error("Error al guardar el carrito:", error);
      setTimeout(()=>{scrollToTop();},3000);
      if (error.response && error.response.status === 401) {
        setError("Debe iniciar sesión para procesar el carrito");
      } else {
        setError("Hubo un error al guardar el carrito.");
      }
    }
  };

    return (
    <div className="cart-container">
      <h2>Carrito de Compras</h2>
      {error && <p className="error">{error}</p>}
      {cartItems.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <div className="cart">
          <div className="cart-items-container">
            <ul className="carrito">
              {cartItems.map((item) => (
                <li className="articleItem" key={item.article.idArticle}>
                  <div className="item-info">
                    <span className="cart-article-name">{item.article.name}</span>
                    <span>{item.article.price}€</span>
                  </div>
                  <div className="item-actions">
                    <button
                      className="cart-button"
                      onClick={() => handleDecrease(item.article)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="cart-button"
                      onClick={() => handleIncrease(item.article)}
                    >
                      +
                    </button>
                    <button
                      className="cart-button remove-button"
                      onClick={() => handleRemove(item.article)}
                    >
                      X
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="cart-summary">
            <h3>Total: {total}€</h3>
            <button onClick={handleSaveCart}>Procesar Compra</button>
          </div>
        </div>
      )}
      <button className="scroll-to-top-button" onClick={scrollToTop}>
        Volver Arriba
      </button>
    </div>
  );
};

export default Cart;
