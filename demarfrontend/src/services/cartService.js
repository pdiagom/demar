// src/services/cartService.js

import axios from 'axios';

// Configurar la URL base si es necesario
const API_URL = "http://localhost:8000/demar/cart";

const cartService = {
    fetchCart: async (cartId) => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/${cartId}/`, {
            headers: {
                Authorization: `Token ${token}`
            }
        });
        return response.data;
    },

    addToCart: async (cartId, articleId, quantity) => {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/${cartId}/items/${articleId}`, {
            quantity: quantity,
        }, {
            headers: {
                Authorization: `Token ${token}`
            }
        });
        return response.data;
    },

    removeFromCart: async (cartId, itemId) => {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/${cartId}/items/${itemId}/`, { // Añadir el ID del carrito a la URL
            headers: {
                Authorization: `Token ${token}`
            }
        });
    },

    updateQuantity: async (cartId, itemId, newQuantity) => {
        const token = localStorage.getItem('token');
        const response = await axios.patch(`${API_URL}/${cartId}/items/${itemId}/`, { quantity: newQuantity }, { // Añadir el ID del carrito a la URL
            headers: {
                Authorization: `Token ${token}`
            }
        });
        return response.data;
    },
};

export default cartService;
