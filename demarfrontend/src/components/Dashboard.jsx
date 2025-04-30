import React, { useEffect, useState } from 'react';
import { getCurrentUser, updateUser } from '../services/authService';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState({});

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const userData = await getCurrentUser();
            setUser(userData);
            setEditedUser(userData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedUser(user);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedUser(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updatedUser = await updateUser(editedUser);
            setUser(updatedUser);
            setIsEditing(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Cargando datos del usuario...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="dashboard">
            <h2>Mi Perfil</h2>
            {user && (
                <>
                    {isEditing ? (
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>Nombre de usuario:</label>
                                <input type="text" name="username" value={editedUser.username} onChange={handleChange} />
                            </div>
                            <div>
                                <label>Email:</label>
                                <input type="email" name="email" value={editedUser.email} onChange={handleChange} />
                            </div>
                            <div>
                                <label>Nombre:</label>
                                <input type="text" name="name" value={editedUser.name} onChange={handleChange} />
                            </div>
                            <div>
                                <label>Teléfono:</label>
                                <input type="tel" name="phone" value={editedUser.phone || ''} onChange={handleChange} />
                            </div>
                            <div>
                                <label>Dirección:</label>
                                <input type="text" name="address" value={editedUser.address || ''} onChange={handleChange} />
                            </div>
                            <div>
                                <label>Ciudad:</label>
                                <input type="text" name="city" value={editedUser.city || ''} onChange={handleChange} />
                            </div>
                            <div>
                                <label>País:</label>
                                <input type="text" name="country" value={editedUser.country || ''} onChange={handleChange} />
                            </div>
                            <div>
                                <label>Código postal:</label>
                                <input type="text" name="postalCode" value={editedUser.postalCode || ''} onChange={handleChange} />
                            </div>
                            <button type="submit">Guardar cambios</button>
                            <button type="button" onClick={handleCancel}>Cancelar</button>
                        </form>
                    ) : (
                        <div>
                            <p><strong>Nombre de usuario:</strong> {user.username}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Nombre:</strong> {user.name}</p>
                            <p><strong>Teléfono:</strong> {user.phone || 'No proporcionado'}</p>
                            <p><strong>Dirección:</strong> {user.address || 'No proporcionada'}</p>
                            <p><strong>Ciudad:</strong> {user.city || 'No especificada'}</p>
                            <p><strong>País:</strong> {user.country || 'No especificado'}</p>
                            <p><strong>Código postal:</strong> {user.postalCode || 'No especificado'}</p>
                            <button onClick={handleEdit}>Editar perfil</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Dashboard;
