// src/components/Cart.js

import React from 'react';
import { useCart } from '../context/cartContext';

const Cart = () => {
    const { state, dispatch } = useCart();
    const { cartItems, total } = state;

    const handleRemove = (article) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: article });
    };

    return (
        <div className="cart-container">
            <h2>Carrito de Compras</h2>
            {cartItems.length === 0 ? (
                <p>Tu carrito está vacío.</p>
            ) : (
                <div>
                    <ul>
                        {cartItems.map((item) => (
                            <li key={item.article.idArticle}>
                                {item.article.name} - {item.quantity} x {item.article.price}€
                                <button onClick={() => handleRemove(item.article)}>Eliminar</button>
                            </li>
                        ))}
                    </ul>
                    <h3>Total: {total}€</h3>
                </div>
            )}
        </div>
    );
};

export default Cart;
