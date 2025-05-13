import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUserId, setCurrentUser }) => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [errorMessage, setErrorMessage] = useState(''); // Estado para el mensaje de error
    const [showPasswordReset, setShowPasswordReset] = useState(false);
    const [email, setEmail] = useState('');
    const [resetMessage, setResetMessage] = useState('');
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
        setCurrentUser(response.data.user); // Establecer el usuario actual con el rol
        // Almacenar el usuario en localStorage
        localStorage.setItem("currentUser", JSON.stringify(response.data.user.role));
        navigate('/dashboard');
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        setErrorMessage('Usuario y/o contraseña incorrectos');
        setTimeout(() => {
            setErrorMessage('');
        }, 3000);
    }
};

const handlePasswordResetRequest = async (e) => {
    e.preventDefault();
    try {
        await axios.post('http://localhost:8000/demar/password_reset/', { email });
        setResetMessage('Se ha enviado un correo con instrucciones para restablecer tu contraseña.');
    } catch (error) {
        setResetMessage('Hubo un error al procesar tu solicitud.');
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
        {!showPasswordReset ? (
            <>
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
                    <button onClick={() => setShowPasswordReset(true)}>Olvidé mi contraseña</button>
                </form>
                
            </>
        ) : (
            <form onSubmit={handlePasswordResetRequest}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ingresa tu correo electrónico"
                    required
                />
                <button type="submit">Solicitar cambio de contraseña</button>
                <button onClick={() => setShowPasswordReset(false)}>Volver al login</button>
                {resetMessage && <p>{resetMessage}</p>}
            </form>
        )}
    </div>
);
};


export default Login;
