// Cart.js
<<<<<<< HEAD
import React, { useEffect } from 'react';
import axios from 'axios';

const Cart = ({ cartItems, total, onRemoveFromCart, userId }) => {
    const handleCheckout = async () => {
        if (!userId) {
            alert("Debes iniciar sesión para proceder con la compra.");
            return; // Redirigir a la página de login si no estás autenticado
        }

        const cartData = {
            cartItem: cartItems.map(item => item.idArticle), // Asumiendo que necesitas solo los IDs de los artículos
            total,
            date: new Date().toISOString().split('T')[0], // Formato de fecha YYYY-MM-DD
            userId,
        };

        try {
            const response = await axios.post(`http://localhost:8000/demar/cart/`, cartData);
            console.log("Carrito guardado:", response.data);
            // Aquí podrías redirigir al usuario a una página de confirmación o al carrito
        } catch (error) {
            console.error("Error al guardar el carrito:", error);
        }
    };

=======
import React from 'react';

const Cart = ({ cartItems, total, onRemoveFromCart }) => {
>>>>>>> 4b73ebad8f9678acc72a15805be2fbab2ca86766
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
<<<<<<< HEAD
            <button onClick={handleCheckout}>Proceder a la Compra</button>
=======
>>>>>>> 4b73ebad8f9678acc72a15805be2fbab2ca86766
        </div>
    );
};

export default Cart;
