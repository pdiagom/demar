import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react"; // Importa useEffect para manejar efectos secundarios
import Register from "./components/Register";
import Admin from "./components/Admin";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import MaintenancePage from "./components/MaintenancePage"; // Importa el nuevo componente
import Navigation from "./components/Navigation";
import PrivateRoute from "./components/PrivateRoute"; // Importa el componente de ruta privada
import ArticleList from "./components/ArticleList";
import Cart from "./components/Cart"; // Importa el componente Cart
import "./styles/styles.css";
import CheckoutPage from "./components/CheckoutPage";
import PasswordResetRequest from "./components/PasswordResetRequest";
import PasswordResetConfirm from "./components/PasswordResetConfirm";
import Superuser from "./components/SuperUser"; 
import { LoadingProvider } from "./context/loadingContext"; // Importa el contexto de carga
import GlobalSpinner from "./components/GlobalSpinner"; // Importa el componente de spinner global
import ScrollToCartButton from "./components/ScrollToCartButton"; // Importa el botón para desplazarse al carrito

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [userId, setUserId] = useState(null); // Estado para el ID del usuario autenticado
  const [currentUser, setCurrentUser] = useState(null); // Estado para el usuario actual

  // Usar useEffect para cargar el usuario actual desde localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    setCurrentUser(user);
  }, [currentUser]); // Se ejecuta una vez al montar el componente

  // Función para agregar un artículo al carrito
  const onAddToCart = (article) => {
    setCartItems((prevItems) => [...prevItems, article]); // Agrega el artículo al array del carrito
    setTotal((prevTotal) => prevTotal + article.price); // Actualiza el total
  };

  // Función para eliminar un artículo del carrito
  const removeFromCart = (idArticle) => {
    const itemToRemove = cartItems.find((item) => item.idArticle === idArticle);
    if (itemToRemove) {
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.idArticle !== idArticle)
      ); // Elimina el artículo del carrito
      setTotal((prevTotal) => prevTotal - itemToRemove.price); // Actualiza el total
    }
  };

  return (
    <LoadingProvider>
    <Router>
      
      <Navigation />
      <ScrollToCartButton />
      <Routes>
        <Route path="/" element={<Navigate to="/articleList" replace />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/login"
          element={
            <Login setUserId={setUserId} setCurrentUser={setCurrentUser} />
          }
        />
        <Route path="/checkout/:cartId" element={<CheckoutPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            currentUser && currentUser === 1 ? (
              <PrivateRoute>
                <Admin />
              </PrivateRoute>
            ) : (
              <MaintenancePage />
            )
          }
        />
        <Route
          path="/superuser"
          element={
            currentUser && currentUser === 2 ? (
              <PrivateRoute>
                <Superuser />
              </PrivateRoute>
            ) : (
              <MaintenancePage />
            )
          }
        />
        <Route
          path="/articleList"
          element={
            <ArticleList
              onAddToCart={onAddToCart}
              currentUser={currentUser} // Pasar el usuario actual
            />
          }
        />
        <Route path="/password-reset" exact component={PasswordResetRequest} />
        <Route path="/password-reset-confirm" element={<PasswordResetConfirm />} />

      </Routes>
      <Cart
        cartItems={cartItems}
        total={total}
        onRemoveFromCart={removeFromCart}
        userId={userId}
        currentUser={currentUser} // Pasar el usuario actual
      />
      <GlobalSpinner/>
    </Router>
    </LoadingProvider>
  );
}

export default App;
