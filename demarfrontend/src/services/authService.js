const API_URL = "http://localhost:8000/demar/";

// Función auxiliar para manejar respuestas
const handleResponse = async (response) => {
    if (!response.ok) { // Verifica si la respuesta fue exitosa
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error inesperado"); // Lanza un error con el mensaje adecuado
    }
    return response.json(); // Devuelve la respuesta convertida a JSON
};

export const register = async (userData) => {
    try {
        const response = await fetch(`${API_URL}register/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });
        return await handleResponse(response); // Maneja la respuesta
    } catch (error) {
        console.error("Error en el registro:", error);
        throw error; // Lanza el error para que pueda ser manejado en el componente
    }
};

export const login = async (credentials) => {
    try {
        const response = await fetch(`${API_URL}login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });
        return await handleResponse(response); // Maneja la respuesta
    } catch (error) {
        console.error("Error en el login:", error);
        throw error; // Lanza el error para que pueda ser manejado en el componente
    }
};
