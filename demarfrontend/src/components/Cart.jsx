// src/components/Cart.js

import React, { useState, useEffect } from 'react';
import { useCart } from '../context/cartContext';
import cartService from '../services/cartService';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const { state, dispatch } = useCart();
    const { cartItems, total } = state;
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null);
            }, 3000);

            // Limpia el timeout si el componente se desmonta o si error cambia
            return () => clearTimeout(timer);
        }
    }, [error]);
    const handleIncrease = (article) => {
        dispatch({ type: 'ADD_TO_CART', payload: { article, quantity: 1 } });
    };

    const handleDecrease = (article) => {
        dispatch({ type: 'DECREASE_QUANTITY', payload: article });
    };

    const handleRemove = (article) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: article });
    };

    const handleSaveCart = async () => {
        try {
            const response = await cartService.saveCart(cartItems);
            const cartId = response.cart_id;
            navigate(`/checkout/${cartId}`); // Redirige al Checkout
        } catch (error) {
            console.error('Error al guardar el carrito:', error);
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
                <div className='cart'>
                    <ul className='carrito'>
                        {cartItems.map((item) => (
                            <li className='articleItem' key={item.article.idArticle}>
                                {item.article.name} - {item.article.price}€
                                <div>
                                    <button onClick={() => handleDecrease(item.article)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => handleIncrease(item.article)}>+</button>
                                </div>
                                <button onClick={() => handleRemove(item.article)}>Eliminar</button>
                            </li>
                        ))}
                    </ul>
                    <h3>Total: {total}€</h3>
                    <button onClick={handleSaveCart}>Guardar Carrito</button>
                </div>
            )}
        </div>
    );
};

export default Cart;
