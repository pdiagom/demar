import React, { useState } from "react";
import CreateArticle from "./CreateArticle";
import CreateCategory from "./CreateCategory";
import OrderList from "./OrderList";
import UserManagement from "./UserManagement";

const Superuser = () => {
  const [activeTab, setActiveTab] = useState("articles");

  const renderContent = () => {
    switch (activeTab) {
      case "articles":
        return <CreateArticle />;
      case "categories":
        return <CreateCategory />;
      case "orders":
        return <OrderList />;
      case "users":
        return <UserManagement />;
      default:
        return <CreateArticle />;
    }
  };
  const getButtonClass = (tabName) => {
    return activeTab === tabName ? "active" : "";
  };

  return (
    <div className="admin-dashboard">
      <h2>Menu de Gestor</h2>
      <nav className="admin-nav">
        <button
          className={getButtonClass("articles")}
          onClick={() => setActiveTab("articles")}
        >
          Crear Artículo
        </button>
        <button
          className={getButtonClass("categories")}
          onClick={() => setActiveTab("categories")}
        >
          Crear Categoría
        </button>
        <button
          className={getButtonClass("orders")}
          onClick={() => setActiveTab("orders")}
        >
          Ver Pedidos
        </button>
        <button
          className={getButtonClass("users")}
          onClick={() => setActiveTab("users")}
        >
          Gestionar Usuarios
        </button>
      </nav>
      <div className="admin-content">{renderContent()}</div>
    </div>
  );
};

export default Superuser;
