import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import orderService from '../services/orderService';
import cartService from '../services/cartService';

const CheckoutPage = () => {
    const { cartId } = useParams();
    const navigate = useNavigate();
    const [cartDetails, setCartDetails] = useState(null);
    const [formData, setFormData] = useState({
        shippingAddress: '',
        city: '',
        postalCode: '',
        country: '',
        paymentMethod: 'Tarjeta',
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: ''
    });

    useEffect(() => {
        const fetchCartDetails = async () => {
            try {
                const details = await cartService.getCartDetails(cartId);
                setCartDetails(details);
            } catch (error) {
                console.error('Error fetching cart details:', error);
                alert('Error al cargar los detalles del carrito');
            }
        };

        fetchCartDetails();
    }, [cartId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const orderData = {
                cartId,
                ...formData,
                total: cartDetails.total
            };
            const order = await orderService.createOrderFromCart(orderData);
            alert('¡Pedido realizado con éxito!');
            navigate('/orders');
        } catch (error) {
            console.error('Error al crear el pedido:', error);
            alert('Hubo un error al procesar el pedido.');
        }
    };

    if (!cartDetails) {
        return <div>Cargando detalles del carrito...</div>;
    }

    return (
        <div className="checkout-container">
            <h2>Finalizar Compra</h2>
            <div className="cart-summary">
                <h3>Resumen del Carrito</h3>
                <p>Total: ${cartDetails.total}</p>
                <ul>
                    {cartDetails.items.map(item => (
                        <li key={item.id}>{item.name} - Cantidad: {item.quantity}</li>
                    ))}
                </ul>
            </div>
            <form onSubmit={handleSubmit}>
                <h3>Dirección de Envío</h3>
                <input
                    type="text"
                    name="shippingAddress"
                    placeholder="Dirección de envío"
                    value={formData.shippingAddress}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="city"
                    placeholder="Ciudad"
                    value={formData.city}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="postalCode"
                    placeholder="Código Postal"
                    value={formData.postalCode}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="country"
                    placeholder="País"
                    value={formData.country}
                    onChange={handleChange}
                    required
                />

                <h3>Método de Pago</h3>
                <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                >
                    <option value="Tarjeta">Tarjeta</option>
                    <option value="Transferencia">Transferencia</option>
                    <option value="PayPal">PayPal</option>
                </select>

                {formData.paymentMethod === 'Tarjeta' && (
                    <div className="card-details">
                        <input
                            type="text"
                            name="cardNumber"
                            placeholder="Número de tarjeta"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="cardHolder"
                            placeholder="Titular de la tarjeta"
                            value={formData.cardHolder}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="expiryDate"
                            placeholder="Fecha de expiración (MM/YY)"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="cvv"
                            placeholder="CVV"
                            value={formData.cvv}
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}

                <button type="submit">Confirmar Pedido</button>
            </form>
        </div>
    );
};

export default CheckoutPage;
