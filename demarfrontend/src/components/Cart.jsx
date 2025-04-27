// src/components/Cart.js

import React from 'react';
import { useCart } from '../context/cartContext';
import cartService from '../services/cartService';
import { useNavigate } from 'react-router-dom';
const Cart = () => {
    const { state, dispatch } = useCart();
    const { cartItems, total } = state;
    const navigate = useNavigate();
    
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
            alert('Carrito guardado exitosamente.');
            navigate(`/checkout/${cartId}`); // Redirige al Checkout
        } catch (error) {
            console.error('Error al guardar el carrito:', error);
            alert('Hubo un error al guardar el carrito.');
        }
    };
    return (
        <div className="cart-container">
            <h2>Carrito de Compras</h2>
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
