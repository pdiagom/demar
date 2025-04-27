import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import orderService from '../services/orderService';

const CheckoutPage = () => {
    const { cartId } = useParams();
    const [paymentMethod, setPaymentMethod] = useState('Tarjeta');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const order = await orderService.createOrderFromCart(cartId, paymentMethod);
            alert('¡Pedido realizado con éxito!');
            navigate('/'); // O redirigir a "Mis pedidos", etc
        } catch (error) {
            console.error('Error al crear el pedido:', error);
            alert('Hubo un error al procesar el pedido.');
        }
    };

    return (
        <div className="checkout-container">
            <h2>Finalizar Compra</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Método de Pago:</label>
                    <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                        <option value="Tarjeta">Tarjeta</option>
                        <option value="Transferencia">Transferencia</option>
                        <option value="PayPal">PayPal</option>
                    </select>
                </div>
                <button type="submit">Confirmar Pedido</button>
            </form>
        </div>
    );
};

export default CheckoutPage;
