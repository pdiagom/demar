// Cart.js
import React, { useEffect } from 'react';
import axios from 'axios';

const Cart = ({ cartItems, total, onRemoveFromCart, userId }) => {
    const handleCheckout = async () => {
        if (!userId) {
            alert("Debes iniciar sesión para proceder con la compra.");
            return; // Redirigir a la página de login si no estás autenticado
        }

        const cartData = {
            cartItem: cartItems.map(item => item.idArticle), 
            total,
            date: new Date().toISOString().split('T')[0], // Formato de fecha YYYY-MM-DD
            userId,
        };

        try {
            const response = await axios.post(`http://localhost:8000/demar/cart/`, cartData);
            console.log("Carrito guardado:", response.data);
            
        } catch (error) {
            console.error("Error al guardar el carrito:", error);
        }
    };

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
            <h3>Total: {total.toFixed(2)}€</h3>
            <button onClick={handleCheckout}>Proceder a la Compra</button>
        </div>
    );
};

export default Cart;
