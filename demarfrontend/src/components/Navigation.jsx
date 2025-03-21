import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navigation = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav>
            <Link to="/dashboard">Dashboard</Link>
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
