import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import orderService from '../services/orderService';
import cartService from '../services/cartService';
import { getCurrentUser } from '../services/authService'; 
import { useCart } from '../context/cartContext';

const CheckoutPage = () => {
    const { cartId } = useParams();
    const navigate = useNavigate();
    const [cartDetails, setCartDetails] = useState(null);
    const { dispatch } = useCart();
    const [errorMessage, setErrorMessage] = useState('');

    const [formData, setFormData] = useState({
        shippingAddress: '',
        city: '',
        postalCode: '',
        country: '',
        paymentMethod: 'Tarjeta',
        nCuenta: '',
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: ''
    });

   useEffect(() => {
     if (errorMessage) {
        const timer = setTimeout(() => {
            setErrorMessage('');
        }, 5000); // El mensaje desaparecerá después de 5 segundos

        return () => clearTimeout(timer);
    }
    const fetchData = async () => {
        try {
            const [cartDetails, userData] = await Promise.all([
                cartService.getCartDetails(cartId),
                getCurrentUser() // Implementa este método en userService
            ]);
            setCartDetails(cartDetails);
            setFormData(prevState => ({
                ...prevState,
                shippingAddress: userData.address || '',
                city: userData.city || '',
                postalCode: userData.postalCode || '',
                country: userData.country || ''
            }));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    fetchData();
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

        dispatch({ type: 'CLEAR_CART' });
        
        setCartDetails(null);     
        navigate('/articleList', { state: { orderSuccess: true } });
    } catch (error) {
        console.error('Error al crear el pedido:', error);
        setErrorMessage('Hay algún dato erróneo en el pedido. Por favor, verifique la información.');
    }
};


    if (!cartDetails) {
        return <div>Cargando detalles del carrito...</div>;
    }

    return (
        <div className="checkout-container">
            <h2>Finalizar Compra</h2>
            {errorMessage && (
            <div className="error-message">
                {errorMessage}
            </div>
        )}
            <div className="cart-summary">
                <h3>Resumen del Carrito</h3>
                <p>Artículos:</p>
                <ul>
                    {cartDetails.items.map(item => (
                        <li key={item.id}>{item.article.name} - Cantidad: {item.quantity}</li>
                    ))}
                </ul> 
                <p>Total: ${cartDetails.total}</p>
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

                {formData.paymentMethod === 'Transferencia' && (
                    <div className="card-details">
                        <input
                            type="text"
                            name="nCuenta"
                            placeholder="Número de cuenta"
                            value={formData.nCuenta}
                            onChange={handleChange}
                            required
                        />
                        </div>
                    )}
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
