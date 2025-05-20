import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from 'react-router-dom';
import ArticleItem from "./ArticleItem";
import CategoryFilter from "./CategoryFilter";
import { getCategories } from "../services/categoryService";
import { useCart } from '../context/cartContext'; // Importa el hook useCart
import { useLoading } from '../context/loadingContext'; // Importa el hook useLoading


const ArticleList = ({ currentUser }) => {
    const { dispatch } = useCart(); // Accede a dispatch del contexto
    const { setIsLoading } = useLoading()
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
     const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const location = useLocation();

    const fetchArticles = async () => {
        setIsLoading(true); // Inicia la carga
        try {
            const response = await axios.get("https://demar.onrender.com/demar/articles/");
            setArticles(response.data);
        } catch (error) {
            console.error("Error al obtener los artículos:", error);
        }
        setIsLoading(false); // Finaliza la carga
    };

    const fetchCategories = async () => {
        setIsLoading(true); // Inicia la carga
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error("Error al obtener las categorías:", error);
        }
        setIsLoading(false); // Finaliza la carga
    };

    useEffect(() => {
        fetchArticles();
        fetchCategories();
         if (location.state && location.state.orderSuccess) {
            setShowSuccessMessage(true);
            // Ocultar el mensaje después de 5 segundos
            setTimeout(() => setShowSuccessMessage(false), 5000);
            window.history.replaceState({}, document.title);
        }
    }, [location]);


    const filteredArticles = selectedCategory
        ? articles.filter((article) => article.categoryId === Number(selectedCategory))
        : articles;

    const handleAddToCart = (article) => {
        // Aquí se define la acción para agregar al carrito
        dispatch({ type: 'ADD_TO_CART', payload: { article, quantity: 1 } });
    };

    const renderArticlesList = () => {
        if (filteredArticles.length === 0) {
            return <h3>No hay artículos disponibles</h3>;
        }
        return filteredArticles.map((article) => (
            <ArticleItem
                key={article.idArticle} // Asegúrate de incluir una clave única
                article={article}
                categories={categories}
                onAddToCart={handleAddToCart} // Pasa la función handleAddToCart
                user={currentUser} // Pasa el usuario que contiene el rol
            />
        ));
    };

    return (
        <div>
            <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={(event) => setSelectedCategory(event.target.value)}
            />
             {showSuccessMessage && (
                <div className="success-message">
                    Pedido realizado con éxito
                </div>
            )}
            <ul>{renderArticlesList()}</ul>
        </div>
    );
};

export default ArticleList;

