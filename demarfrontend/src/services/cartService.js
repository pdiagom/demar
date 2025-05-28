// src/services/cartService.js

import axios from "axios";

// Configurar la URL base si es necesario
const API_URL = "https://demar.onrender.com/demar/cart";

const cartService = {
  fetchCart: async (cartId) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/${cartId}/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return response.data;
  },

  addToCart: async (cartId, articleId, quantity) => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/${cartId}/items/${articleId}`,
      {
        quantity: quantity,
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    return response.data;
  },

  removeFromCart: async (cartId, itemId) => {
    const token = localStorage.getItem("token");
    await axios.delete(`${API_URL}/${cartId}/items/${itemId}/`, {
      // Añadir el ID del carrito a la URL
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  },

  updateQuantity: async (cartId, itemId, newQuantity) => {
    const token = localStorage.getItem("token");
    const response = await axios.patch(
      `${API_URL}/${cartId}/items/${itemId}/`,
      { quantity: newQuantity },
      {
        // Añadir el ID del carrito a la URL
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    return response.data;
  },
  saveCart: async (items, total) => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `https://demar.onrender.com/demar/cart/create_cart_with_items/`,
      {
        items,
        total: Math.round(parseFloat(total) * 100) / 100,
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    return response.data;
  },
  getCartDetails: async (cartId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${API_URL}/${cartId}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching cart details:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  },
};

export default cartService;
