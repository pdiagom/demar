import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const PasswordResetConfirm = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tokenFromUrl = params.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
            console.log("Token obtenido:", tokenFromUrl);
        } else {
            setMessage('Token no encontrado en la URL');
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Las contraseñas no coinciden');
            return;
        }
        if (password.length < 8) {
            setMessage('La contraseña debe tener al menos 8 caracteres');
            return;
        }
        try {
            const response = await axios.post('https://demar.onrender.com/demar/password_reset/confirm/', {
                token: token,
                password: password
            });
            setMessage('Contraseña restablecida con éxito');
            navigate('/login'); // Redirigir al usuario a la página de inicio de sesión
            console.log(response.data);
        } catch (error) {
            if (error.response) {
                console.error("Error data:", error.response.data);
                console.error("Error status:", error.response.status);
                setMessage(`Error: ${JSON.stringify(error.response.data)}`);
            } else if (error.request) {
                console.error("Error request:", error.request);
                setMessage('No se recibió respuesta del servidor');
            } else {
                console.error('Error message:', error.message);
                setMessage('Error al enviar la solicitud');
            }
        }
    };

    return (
        <div>
            <h2>Restablecer Contraseña</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="password">Nueva contraseña:</label>
                    <input 
                        id="password"
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Nueva contraseña" 
                        required 
                        minLength="8"
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword">Confirmar contraseña:</label>
                    <input 
                        id="confirmPassword"
                        type="password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        placeholder="Confirmar nueva contraseña" 
                        required 
                    />
                </div>
                <button type="submit">Restablecer Contraseña</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default PasswordResetConfirm;
