// src/components/Cart.js

import React, { useState, useEffect } from 'react';
import { useCart } from '../context/cartContext';
import cartService from '../services/cartService';
import { useNavigate } from 'react-router-dom';
import articleService from '../services/articleService';

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
    const handleIncrease = async (article) => {
    try {
        const stock = await articleService.getStock(article.idArticle);
        const itemInCart = cartItems.find(item => item.article.idArticle === article.idArticle);
        const currentQuantity = itemInCart ? itemInCart.quantity : 0;

        if (currentQuantity < stock) {
            dispatch({ type: 'ADD_TO_CART', payload: { article, quantity: 1 } });
        } else {
            setError('No puedes añadir más unidades de este artículo. Stock insuficiente.');
        }
    } catch (error) {
        console.error('Error al obtener el stock:', error);
        setError('Error al verificar stock del artículo.');
    }
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
                                
                                    <button className='cart-button' onClick={() => handleDecrease(item.article)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button className='cart-button' onClick={() => handleIncrease(item.article)}>+</button>
                                
                                <button className='cart-button remove-button' onClick={() => handleRemove(item.article)}>Eliminar</button>
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
