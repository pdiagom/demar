import axios from 'axios';

const API_URL = "http://localhost:8000/demar/orders";

const orderService = {
    createOrderFromCart: async (orderData) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(`${API_URL}/create_order_from_cart/`, orderData, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error creating order:', error.response ? error.response.data : error.message);
            throw error;
        }
    },

    getOrderDetails: async (orderId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`${API_URL}/${orderId}/`, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching order details:', error.response ? error.response.data : error.message);
            throw error;
        }
    },

    getUserOrders: async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`${API_URL}/user_orders/`, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching user orders:', error.response ? error.response.data : error.message);
            throw error;
        }
    }
};

export default orderService;
