import axios from "axios";

const API_URL = "http://localhost:8000/demar/orders";

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
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching all orders:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  },
  updateOrderStatus: async (orderId, newStatus) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `${API_URL}/update_status/${orderId}/`,
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
    } catch (error) {
      console.error(
        "Error deleting order:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  },
};

export default orderService;
