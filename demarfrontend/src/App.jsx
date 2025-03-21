import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Navigation from "./components/Navigation";
import ArticleList from "./components/ArticleList";
import "./styles/styles.css";
function App() {
    return (
        <Router>
            <h1 style={{textAlign:"center"}}>Bienvenido a DEMAR</h1>
            <Navigation />
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
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
                            <ArticleList />
                    }/>
            </Routes>
            
        </Router>
    );
}

export default App;
