import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from "react"; // Importa useState para manejar el estado
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Navigation from "./components/Navigation";
import ArticleList from "./components/ArticleList";
import Cart from "./components/Cart"; // Importa el componente Cart
import "./styles/styles.css";

function App() {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [userId, setUserId] = useState(null); // Estado para el ID del usuario autenticado

    // Función para agregar un artículo al carrito
    const addToCart = (article) => {
        setCartItems(prevItems => [...prevItems, article]); // Agrega el artículo al array del carrito
        setTotal(prevTotal => prevTotal + article.price); // Actualiza el total
    };

    // Función para eliminar un artículo del carrito
    const removeFromCart = (idArticle) => {
        const itemToRemove = cartItems.find(item => item.idArticle === idArticle);
        if (itemToRemove) {
            setCartItems(prevItems => prevItems.filter(item => item.idArticle !== idArticle)); // Elimina el artículo del carrito
            setTotal(prevTotal => prevTotal - itemToRemove.price); // Actualiza el total
        }
    };

    return (
        <Router>
            <h1 style={{ textAlign: "center" }}>Bienvenido a DEMAR</h1>
            <Navigation />
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login setUserId={setUserId} />} />
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/articleList"
                    element={
                        <ArticleList onAddToCart={addToCart} /> // Pasar la función para agregar artículos al carrito
                    }
                />
            </Routes>
            <Cart
                cartItems={cartItems}
                total={total}
                onRemoveFromCart={removeFromCart}
                userId={userId} 
            /> {/* Renderizar el carrito */}
        </Router>
    );
}

export default App;
