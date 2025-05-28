// src/services/articleService.js
import axios from "axios";

const API_URL = "https://demar.onrender.com/demar/articles";

const articleService = {
  getStock: async (articleId) => {
    const response = await axios.get(`${API_URL}/${articleId}/`);
    return response.data.stock;
  },
};

export default articleService;
