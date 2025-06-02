import React from "react";
import { Link, useNavigate } from "react-router-dom";
import headerimage from "../../../media/media/demar_sin_fondo.png";
const Navigation = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("cart");
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav>
      <img src={headerimage} alt="Logo Demar" className="demar" />
      <Link to="/dashboard">Mi perfil</Link>
      {currentUser === 1 ? <Link to="/admin">Administrador</Link> : ""}
      {currentUser === 2 ? <Link to="/superuser">Gestor</Link> : ""}
      <Link to="/articleList">Articulos</Link>
      {token ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Registro</Link>
        </>
      )}
    </nav>
  );
};

export default Navigation;
