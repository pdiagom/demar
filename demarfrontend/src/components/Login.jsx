import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUserId }) => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [errorMessage, setErrorMessage] = useState(''); // Estado para el mensaje de error
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/demar/login/', credentials);
            localStorage.setItem("token", response.data.token);
            setUserId(response.data.userId); 
            navigate('/dashboard');
        } catch (error) {
            console.error('Error en el inicio de sesión:', error);
            setErrorMessage('Usuario y/o contraseña incorrectos'); // Actualiza el mensaje de error
            setTimeout(() => {
                setErrorMessage(''); // Limpia el mensaje después de 3 segundos
            }, 3000);
        }
    };

    return (
        <div>
            {errorMessage && (
                <div style={{
                    backgroundColor: 'lightcoral',
                    color: 'white',
                    padding: '10px',
                    marginBottom: '20px',
                    borderRadius: '5px',

                }}>
                    {errorMessage}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    placeholder="Usuario"
                    required
                />
                <input
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="Contraseña"
                    required
                />
                <button type="submit">Iniciar Sesión</button>
            </form>
        </div>
    );
};

export default Login;
