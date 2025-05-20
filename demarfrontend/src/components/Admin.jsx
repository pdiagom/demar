// src/components/Admin.jsx
import React, { useState, useEffect } from 'react';
import CreateArticle from './CreateArticle';
import CreateCategory from './CreateCategory';
import OrderList from './OrderList';
import { getCurrentUser } from '../services/authService';
import { Navigate } from 'react-router-dom';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('articles');
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                const user = await getCurrentUser();
                setIsAdmin(user.role === 1);
            } catch (error) {
                console.error('Error checking admin status:', error);
            } finally {
                setLoading(false);
            }
        };

        checkAdminStatus();
    }, []);

    const renderContent = () => {
        switch(activeTab) {
            case 'articles':
                return <CreateArticle />;
            case 'categories':
                return <CreateCategory />;
            case 'orders':
                return <OrderList />;
            default:
                return <CreateArticle />;
        }
    };

    if (loading) {
        return <div className="loading">Cargando...</div>;
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="admin-dashboard">
            <h2>Dashboard de Administración</h2>
            <nav className="admin-nav">
                {['articles', 'categories', 'orders'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={activeTab === tab ? 'active' : ''}
                    >
                        {tab === 'articles' && 'Crear Artículo'}
                        {tab === 'categories' && 'Crear Categoría'}
                        {tab === 'orders' && 'Ver Pedidos'}
                    </button>
                ))}
            </nav>
            <div className="admin-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default Admin;
