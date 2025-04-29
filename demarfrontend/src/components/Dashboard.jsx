
import React, { useEffect, useState } from 'react';

const Dashboard = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('currentUser'));
        if (userData) {
            setUser(userData);
        }
    }, []);

    
    return (
        <div className="dashboard">
            <h2>Mi Perfil</h2>
            {user ? (
                <div>
                    <p><strong>Nombre de usuario:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Nombre:</strong> {user.name}</p>
                    <p><strong>Teléfono:</strong> {user.phone || 'No proporcionado'}</p>
                    <p><strong>Dirección:</strong> {user.address || 'No proporcionada'}</p>
                    <p><strong>Ciudad:</strong> {user.city || 'No especificada'}</p>
                    <p><strong>País:</strong> {user.country || 'No especificado'}</p>
                    <p><strong>Código postal:</strong> {user.postalCode || 'No especificado'}</p>
                </div>
            ) : (
                <p>No hay información del usuario disponible.</p>
            )}
        </div>
    );
};

export default Dashboard;
