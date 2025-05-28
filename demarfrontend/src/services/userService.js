import axios from "axios";
const API_URL = "https://demar.onrender.com/demar/users/";

const userService = {
  getAllUsers: async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Token ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching users:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  },

  updateUser: async (userId, userData) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(`${API_URL}${userId}/`, userData, {
        headers: { Authorization: `Token ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error updating user:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  },

  deleteUser: async (userId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_URL}${userId}/`, {
        headers: { Authorization: `Token ${token}` },
      });
    } catch (error) {
      console.error(
        "Error deleting user:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  },
};

export default userService;
