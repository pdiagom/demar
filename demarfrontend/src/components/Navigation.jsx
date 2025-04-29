import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navigation = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        
        navigate("/login");
        window.location.reload();
    };

    return (
        <nav>
            <Link to="/dashboard">Dashboard</Link>
            {currentUser===1?(<Link to="/admin">Admin</Link>):("")}
            <Link to="/articleList">Articles</Link>
            { token ? (
                <button onClick={handleLogout}>Logout</button>
            ) : (
                <>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </>
            )}
        </nav>
    );
};

export default Navigation;
