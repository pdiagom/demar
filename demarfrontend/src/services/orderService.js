import axios from 'axios';

const API_URL = "http://localhost:8000/demar/orders";

const orderService = {
    createOrderFromCart: async (cartId, paymentMethod) => {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/create_order_from_cart/`, {
            cartId,
            paymentMethod,
        }, {
            headers: {
                Authorization: `Token ${token}`,
            },
        });
        return response.data;
    }
};

export default orderService;
