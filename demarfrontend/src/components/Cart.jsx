// Cart.js
import React from 'react';

const Cart = ({ cartItems, total, onRemoveFromCart }) => {
    return (
        <div className="cart">
            <h2>Carrito de Compras</h2>
            <ul>
                {cartItems.map(item => (
                    <li key={item.idArticle}>
                        {item.name} - ${item.price.toFixed(2)}
                        <button onClick={() => onRemoveFromCart(item.idArticle)}>Eliminar</button>
                    </li>
                ))}
            </ul>
            <h3>Total: ${total.toFixed(2)}</h3>
        </div>
    );
};

export default Cart;
