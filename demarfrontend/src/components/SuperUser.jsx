import React, { useState } from 'react';
import CreateArticle from './CreateArticle';
import CreateCategory from './CreateCategory';
import OrderList from './OrderList';
import UserManagement from './UserManagement';

const Superuser = () => {
    const [activeTab, setActiveTab] = useState('articles');

    const renderContent = () => {
        switch(activeTab) {
            case 'articles':
                return <CreateArticle />;
            case 'categories':
                return <CreateCategory />;
            case 'orders':
                return <OrderList />;
            case 'users':
                return <UserManagement />;
            default:
                return <CreateArticle />;
        }
    };

    return (
        <div className="superuser-dashboard">
            <h2>Dashboard de Superusuario</h2>
            <nav className="superuser-nav">
                <button onClick={() => setActiveTab('articles')}>Crear Artículo</button>
                <button onClick={() => setActiveTab('categories')}>Crear Categoría</button>
                <button onClick={() => setActiveTab('orders')}>Ver Pedidos</button>
                <button onClick={() => setActiveTab('users')}>Gestionar Usuarios</button>
            </nav>
            <div className="superuser-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default Superuser;
