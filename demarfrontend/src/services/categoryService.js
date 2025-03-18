import axios from 'axios';

const API_URL = 'http://localhost:8000/demar/';

export const getCategories = async () => {
    try {
        const token = localStorage.getItem('token'); // Obtiene el token del almacenamiento local
        const response = await fetch(`${API_URL}categories/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`, // Agrega el token en el encabezado
            },
        });
        return await handleResponse(response); // Maneja la respuesta
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        throw error; // Lanza el error para manejarlo en el componente
    }
};