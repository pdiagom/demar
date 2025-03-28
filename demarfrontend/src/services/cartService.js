// src/services/cartService.js

import axios from 'axios';

// Configurar la URL base si es necesario
const API_URL = "http://localhost:8000/demar/cart";

const cartService = {
    fetchCart: async () => {
        const token = localStorage.getItem('token'); // Obtiene el token del almacenamiento local o de donde lo estés almacenando
        const response = await axios.get(API_URL, {
            headers: {
                Authorization:`Token ${token}`
            }
        });
        return response.data;
    },

    addToCart: async (articleId, quantity) => {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}items/`, {
            article: { idArticle: articleId },
            quantity: quantity,
        }, {
            headers: {
                Authorization: token ? `Token ${token}` : ''
            }
        });
        return response.data;
    },

    removeFromCart: async (itemId) => {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}items/${itemId}/`, {
            headers: {
                Authorization: token ? `Token ${token}` : ''
            }
        });
    },

    updateQuantity: async (itemId, newQuantity) => {
        const token = localStorage.getItem('token');
        const response = await axios.patch(`${API_URL}items/${itemId}/`, { quantity: newQuantity }, {
            headers: {
                Authorization: token ? `Token ${token}` : ''
            }
        });
        return response.data;
    },
};

export default cartService;