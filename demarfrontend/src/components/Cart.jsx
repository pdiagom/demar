

import React, { useState, useEffect } from 'react';
import cartService from '../services/cartService'; // Importar el servicio

const Cart = () => {
    const [cart, setCart] = useState({ items: [], total: 0 });

    // Cargar el carrito al montar el componente
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const data = await cartService.fetchCart(); // Usar el servicio
                setCart(data);
            } catch (error) {
                console.error('Error fetching cart:', error);
            }
        };
        fetchCart();
    }, []);

    // Agregar artículos al carrito
    const addToCart = async (articleId, quantity) => {
        try {
            const addedItem = await cartService.addToCart(articleId, quantity); // Usar el servicio
            setCart(prevCart => ({
                ...prevCart,
                items: [...prevCart.items, addedItem],
                total: prevCart.total + (addedItem.article.price * quantity)
            }));
        } catch (error) {
            console.error('Error adding item to cart:', error);
        }
    };

    // Eliminar artículos del carrito
    const removeFromCart = async (itemId) => {
        try {
            await cartService.removeFromCart(itemId); // Usar el servicio
            setCart(prevCart => ({
                ...prevCart,
                items: prevCart.items.filter(item => item.id !== itemId),
                total: prevCart.total - (prevCart.items.find(item => item.id === itemId).article.price * prevCart.items.find(item => item.id === itemId).quantity)
            }));
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };

    // Actualizar la cantidad de un artículo
    const updateQuantity = async (itemId, newQuantity) => {
        try {
            const updatedItem = await cartService.updateQuantity(itemId, newQuantity); // Usar el servicio
            setCart(prevCart => {
                const updatedItems = prevCart.items.map(item => {
                    if (item.id === itemId) {
                        return { ...item, quantity: newQuantity };
                    }
                    return item;
                });
                const total = updatedItems.reduce((acc, item) => acc + (item.article.price * item.quantity), 0);
                return { ...prevCart, items: updatedItems, total };
            });
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };
    const handleProceedToCheckout = () => {
        
        alert('Esta funcionalidad se implementará en el futuro.');
    };

    return (
        <div>
            <h2>Carrito de Compras</h2>
            {cart.items.length === 0 ? (
                <p>El carrito está vacío.</p>
            ) : (
                <ul>
                    {cart.items.map(item => (
                        <li key={item.id}>
                            {item.article.name} - Cantidad: 
                            <input 
                                type="number" 
                                value={item.quantity} 
                                onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                                min="1"
                            />
                            - Precio: ${item.article.price}
                            <button onClick={() => removeFromCart(item.id)}>Eliminar</button>
                        </li>
                    ))}
                </ul>
            )}
            <h3>Total: ${cart.total}</h3> 
            <button onClick={handleProceedToCheckout}>Proceder al Pago</button>
        </div>
    );
};

export default Cart;
