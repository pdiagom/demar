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
<<<<<<< HEAD
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [userId, setUserId] = useState(null); // Estado para el ID del usuario autenticado

=======
    const [cartItems, setCartItems] = useState([]); // Estado para los artículos en el carrito
    const [total, setTotal] = useState(0); // Estado para el total del carrito

    // Función para agregar un artículo al carrito
>>>>>>> 4b73ebad8f9678acc72a15805be2fbab2ca86766
    const addToCart = (article) => {
        setCartItems(prevItems => [...prevItems, article]);
        setTotal(prevTotal => prevTotal + article.price);
    };

<<<<<<< HEAD
=======
    // Función para eliminar un artículo del carrito
>>>>>>> 4b73ebad8f9678acc72a15805be2fbab2ca86766
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
<<<<<<< HEAD
                        <ArticleList onAddToCart={addToCart} />
                    }
                />
            </Routes>
            <Cart cartItems={cartItems} total={total} onRemoveFromCart={removeFromCart} userId={userId} /> {/* Renderizar el carrito */}
=======
                        <ArticleList onAddToCart={addToCart} /> // Pasar la función para agregar al carrito
                    }
                />
            </Routes>
            <Cart cartItems={cartItems} total={total} onRemoveFromCart={removeFromCart} /> {/* Renderizar el carrito */}
>>>>>>> 4b73ebad8f9678acc72a15805be2fbab2ca86766
        </Router>
    );
}

export default App;
