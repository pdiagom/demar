import axios from 'axios';

const API_URL = 'http://localhost:8000/demar/';

const handleResponse = (response) => {
    if (!response.ok) {
        throw new Error("Error en la respuesta de la API");
    }
    return response.json(); // Devuelve la respuesta convertida a JSON
};

export const getCategories = async () => {
    try {
        const response = await fetch(`${API_URL}categories/`, {
            method: "GET",
        });
        return await handleResponse(response); // Maneja la respuesta
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        throw error; // Lanza el error para manejarlo en el componente
    }
};