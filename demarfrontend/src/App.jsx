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

    const addToCart = (article) => {
        setCartItems(prevItems => [...prevItems, article]);
        setTotal(prevTotal => prevTotal + article.price);
    };

    const removeFromCart = (idArticle) => {
        const itemToRemove = cartItems.find(item => item.idArticle === idArticle);
        setCartItems(prevItems => prevItems.filter(item => item.idArticle !== idArticle));
        setTotal(prevTotal => prevTotal - itemToRemove.price);
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
                        <ArticleList onAddToCart={addToCart} />
                    }
                />
            </Routes>
            <Cart cartItems={cartItems} total={total} onRemoveFromCart={removeFromCart} userId={userId} /> {/* Renderizar el carrito */}
        </Router>
    );
}

export default App;
