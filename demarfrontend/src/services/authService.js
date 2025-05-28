const API_URL = "https://demar.onrender.com/demar/";

// Función auxiliar para manejar respuestas
const handleResponse = async (response) => {
  if (!response.ok) {
    // Verifica si la respuesta fue exitosa
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
    const data = await handleResponse(response); // Maneja la respuesta

    // Almacena el token de acceso en localStorage
    if (data.access) {
      localStorage.setItem("token", data.access); // Almacena el token de acceso
      localStorage.setItem("refreshToken", data.refresh);
    }

    return data; // Retorna los datos de la respuesta para su uso
  } catch (error) {
    console.error("Error en el login:", error);
    throw error; // Lanza el error para que pueda ser manejado en el componente
  }
};

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No hay token de autenticación");
    }

    const response = await fetch(`${API_URL}users/me/`, {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error al obtener datos del usuario actual:", error);
    throw error;
  }
};
export const checkUserExists = async (username, email) => {
  const response = await fetch(`${API_URL}check-user/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email }),
  });
  return response.json();
};

export const updateUser = async (userData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No hay token de autenticación");
    }

    const response = await fetch(`${API_URL}users/me/`, {
      method: "PUT",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error al actualizar datos del usuario:", error);
    throw error;
  }
};
