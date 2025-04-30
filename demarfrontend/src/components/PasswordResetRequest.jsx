import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PasswordResetRequest = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        let timer;
        if (isSuccess) {
            timer = setTimeout(() => {
                setMessage('');
                setIsSuccess(false);
            }, 3000);
        }
        return () => clearTimeout(timer);
    }, [isSuccess]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/demar/password_reset/', { email });
            setMessage('Se ha enviado un correo con instrucciones para restablecer tu contraseña.');
            setIsSuccess(true);
        } catch (error) {
            setMessage('Hubo un error al procesar tu solicitud.');
            setIsSuccess(false);
        }
    };

    return (
        <div className="container">
            <h2>Restablecer Contraseña</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ingresa tu correo electrónico"
                    required
                />
                <button type="submit">Solicitar reset de contraseña</button>
            </form>
            {message && (
                <p className={isSuccess ? 'success' : ''}>{message}</p>
            )}
        </div>
    );
};

export default PasswordResetRequest;
