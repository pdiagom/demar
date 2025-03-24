// Login.js
import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setUserId }) => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/demar/login/', credentials);
            localStorage.setItem("token", response.data.access);
            setUserId(response.data.userId); 
        } catch (error) {
            console.error('Error en el inicio de sesión:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="username" value={credentials.username} onChange={handleChange} placeholder="Usuario" required />
            <input type="password" name="password" value={credentials.password} onChange={handleChange} placeholder="Contraseña" required />
            <button type="submit">Iniciar Sesión</button>
        </form>
    );
};

export default Login;
