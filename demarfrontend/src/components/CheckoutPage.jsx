// src/components/CheckoutPage.jsx

import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import orderService from "../services/orderService";
import cartService from "../services/cartService";
import { getCurrentUser } from "../services/authService";
import { useCart } from "../context/cartContext";

const CheckoutPage = () => {
  const { cartId } = useParams();
  const navigate = useNavigate();
  const [cartDetails, setCartDetails] = useState(null);
  const { dispatch } = useCart();
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    shippingAddress: "",
    city: "",
    postalCode: "",
    country: "",
    paymentMethod: "Tarjeta",
    nCuenta: "",
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });

  const paypalRef = useRef();

  // Cargar PayPal solo si está seleccionado y hay detalles del carrito
  useEffect(() => {
    if (formData.paymentMethod === "PayPal" && window.paypal && cartDetails) {
      window.paypal
        .Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: cartDetails.total.toFixed(2),
                  },
                },
              ],
            });
          },
          onApprove: async (data, actions) => {
            await actions.order.capture();
            await handleSubmit(); // Procesar orden
          },
          onError: (err) => {
            console.error("Error de PayPal:", err);
            setErrorMessage("Error al procesar el pago con PayPal.");
          },
        })
        .render(paypalRef.current);
    }
  }, [formData.paymentMethod, cartDetails]);

  // Cargar datos del carrito y del usuario
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cartDetails, userData] = await Promise.all([
          cartService.getCartDetails(cartId),
          getCurrentUser(),
        ]);
        setCartDetails(cartDetails);
        setFormData((prevState) => ({
          ...prevState,
          shippingAddress: userData.address || "",
          city: userData.city || "",
          postalCode: userData.postalCode || "",
          country: userData.country || "",
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage("Error al cargar los datos del usuario o carrito.");
      }
    };

    fetchData();
  }, [cartId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault(); // e puede ser null si es llamado desde PayPal

    try {
      const orderData = {
        cartId,
        ...formData,
        total: cartDetails.total,
      };

      await orderService.createOrderFromCart(orderData);

      dispatch({ type: "CLEAR_CART" });
      setCartDetails(null);
      navigate("/articleList", { state: { orderSuccess: true } });
    } catch (error) {
      console.error("Error al crear el pedido:", error);
      setErrorMessage("Verifique los datos del pedido e intente de nuevo.");
    }
  };

  if (!cartDetails) {
    return <div>Cargando detalles del carrito...</div>;
  }

  return (
    <div className="checkout-container">
      <h2>Finalizar Compra</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="cart-summary">
        <h3>Resumen del Carrito</h3>
        <ul>
          {cartDetails.items.map((item) => (
            <li key={item.id}>
              {item.article.name} - Cantidad: {item.quantity}
            </li>
          ))}
        </ul>
        <p>Total: {Number(cartDetails.total).toFixed(2)}€</p>
      </div>

      <form onSubmit={handleSubmit}>
        <h3>Dirección de Envío</h3>
        <input
          type="text"
          name="shippingAddress"
          placeholder="Dirección"
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
          <option value="PayPal">PayPal</option>
        </select>

        {formData.paymentMethod === "Tarjeta" && (
          <>
            <input
              type="text"
              name="cardNumber"
              placeholder="Número de Tarjeta"
              value={formData.cardNumber}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="cardHolder"
              placeholder="Titular"
              value={formData.cardHolder}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="expiryDate"
              placeholder="Fecha de Expiración (MM/AA)"
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
            <button type="submit">Pagar</button>
          </>
        )}

        {formData.paymentMethod === "PayPal" && (
          <div ref={paypalRef}></div>
        )}
      </form>
    </div>
  );
};

export default CheckoutPage;
