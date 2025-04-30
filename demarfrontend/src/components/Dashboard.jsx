import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../services/authService';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getCurrentUser();
                setUser(userData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) return <p>Cargando datos del usuario...</p>;
    if (error) return <p>Error: {error}</p>;

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
