import axios from "axios";

const API_URL = "https://demar.onrender.com/demar/orders";

const orderService = {
  createOrderFromCart: async (orderData) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${API_URL}/create_order_from_cart/`,
        orderData,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error creating order:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  },

  getOrderDetails: async (orderId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${API_URL}/${orderId}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching order details:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  },

  getUserOrders: async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${API_URL}/user_orders/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching user orders:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  },

  getAllOrders: async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}/all_orders/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    console.log("Orders received:", response.data);  // Log para depuración
    return response.data;
  } catch (error) {
    console.error("Error fetching all orders:", error);
    throw error;
  }
},

  updateOrderStatus: async (orderId, newStatus) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `${API_URL}/${orderId}/update_status/`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error updating order status:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  },

  deleteOrder: async (orderId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_URL}/${orderId}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      return true; // Indicar éxito
    } catch (error) {
      console.error(
        "Error deleting order:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  },

  // Nuevo método para obtener los items de un pedido específico
  getOrderItems: async (orderId) => {
  const token = localStorage.getItem("token");
  try {
    console.log(`Fetching items for order ${orderId}`);
    const response = await axios.get(`${API_URL}/${orderId}/items/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    console.log("Order items received:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching order items:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    }
    throw error;
  }
},

getOrderStats : async () => {
    try {
        const response = await axios.get('/api/orders/order_stats/');
        return response.data;
    } catch (error) {
        console.error('Error fetching order stats:', error);
        throw error;
    }
},


};

export default orderService;
